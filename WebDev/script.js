const cityInput = document.querySelector(".city-frame");
const searchBtn = document.querySelector(".search-button");

const weatherInfoSection = document.querySelector(".weather-information");
const searchCitySection = document.querySelector(".search-city");
const notFoundSection = document.querySelector(".not-found");

const locationFrame = document.querySelector(".location-text");
const temperatureFrame = document.querySelector(".temp-frame");
const conditionFrame = document.querySelector(".conditionframe");
const humidityFrame = document.querySelector(".humidity-value-frame");
const windValueFrame = document.querySelector(".wind-value-frame");
const pressureFrame = document.querySelector(".pressure-value-frame");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currDateFrame = document.querySelector(".curr-date-text");

const forecastItemsFrame = document.querySelector(".forecast-items-frame");

const riceBlastPercentage = document.querySelector("#rbp");
const falseSmutPercentage = document.querySelector("#fsp");

const apiKey = "e2a5ffae0db80d6ba420dbed858bea3a";

searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    } 
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key == "Enter" && cityInput.value.trim() != "") {
        updateWeatherInfo(cityInput.value);
        cityInput.value = "";
        cityInput.blur();
    }
});

async function fetchData(type, city) {
    const apiUrl = `https://api.openweathermap.org/data/2.5/${type}?q=${city}&appid=${apiKey}&units=metric`;
    const response = await fetch(apiUrl);

    return response.json();
}

async function updateWeatherInfo(city) {
    const weatherData = await fetchData("weather", city);
    console.log(weatherData);

    if (weatherData.cod != 200) {
        displaySection(notFoundSection);
        return;
    }
    
    const {
        name: country,
        main: { temp, humidity },
        weather: [{ id, main }],
        wind: { speed },
    } = weatherData;
    
    locationFrame.textContent = country;
    temperatureFrame.textContent = Math.round(temp) + "℃";
    conditionFrame.textContent = main;
    humidityFrame.textContent = humidity + "%";
    windValueFrame.textContent = speed + " M/s";

    currDateFrame.textContent = getCurrentDate();
    
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForeCastInfo(city);
    
    await getDiseasePrediction(city);

    displaySection(weatherInfoSection);
}

async function getDiseasePrediction(city) {
    const cords = await findCords(city);

    let maxTemp = 0,
        minTemp = 0,
        relHum = 0,
        rainfall = 0,
        windSpeed = 0,
        evp = 0,
        sunDur = 0;

    if (cords) {
        console.log("Latitude:", cords.lat);
        console.log("Longitude:", cords.lon);

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cords.lat}&longitude=${cords.lon}&hourly=relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunshine_duration,precipitation_sum,wind_speed_10m_max,et0_fao_evapotranspiration&timezone=Asia%2FSingapore&past_days=7&forecast_days=0`;

        const weatherResponse = await fetch(weatherUrl);

        const weather2DList = await convertTo2DList(weatherResponse);
        console.log("Weather 2D List:", weather2DList);

        if (weather2DList && weather2DList.length > 0) {
            const days = weather2DList.length;

            weather2DList.forEach(row => {
                maxTemp += row[0];
                minTemp += row[1];
                relHum += row[2];
                rainfall += row[3];
                windSpeed += row[4];
                evp += row[5];
                sunDur += row[6];
            });

            maxTemp /= days;
            minTemp /= days;
            relHum /= days;
            rainfall /= days;
            windSpeed /= days;
            evp /= days;
            sunDur /= days;

            console.log("Averages for the past 7 days:");
            console.log("Max Temperature:", maxTemp.toFixed(2));
            console.log("Min Temperature:", minTemp.toFixed(2));
            console.log("Relative Humidity:", relHum.toFixed(2));
            console.log("Rainfall:", rainfall.toFixed(2));
            console.log("Wind Speed:", windSpeed.toFixed(2));
            console.log("Evapotranspiration:", evp.toFixed(2));
            console.log("Sunshine Duration:", sunDur.toFixed(2));

            const rbURL = `http://127.0.0.1:8000/predict_rice_blast?max_temp=${maxTemp}&min_temp=${minTemp}&rh_morning=${relHum}&rh_evening=${relHum}&rainfall=${rainfall}&wind_speed=${windSpeed}&sunshine=${sunDur}&solar_radiation=300&evaporation=${evp}`;
                const rbResponse = await fetch(rbURL);
                const rbData = await rbResponse.json(); 

                if (rbData && rbData.predicted_rice_blast && rbData.predicted_rice_blast[0] !== undefined) {
                    const predictedRiceBlast = rbData.predicted_rice_blast[0];
                    console.log(predictedRiceBlast);
                    riceBlastPercentage.innerHTML = predictedRiceBlast + "%";
                } else {
                    console.error("Error: predicted_rice_blast not found in response");
                }

                const fsURL = `http://127.0.0.1:8000/predict_false_smut?max_temp=${maxTemp}&min_temp=${minTemp}&rh_morning=${relHum}&rh_evening=${relHum}&rainfall=${rainfall}&wind_speed=${windSpeed}&sunshine=${sunDur}&solar_radiation=300&evaporation=${evp}`;
                const fsResponse = await fetch(fsURL);
                const fsData = await fsResponse.json(); 

                if (fsData && fsData.predicted_false_smut && fsData.predicted_false_smut[0] !== undefined) {
                    const predictedFalseSmut = fsData.predicted_false_smut[0]; 
                    console.log(predictedFalseSmut);
                    falseSmutPercentage.innerHTML = predictedFalseSmut + "%";
                } else {
                    console.error("Error: predicted_false_smut not found in response");
                }
        }
    }
}

async function getCords(city) {
    const url = `https://api.openweathermap.org/geo/1.0/direct?q=${city}&appid=${apiKey}`;
    const response = await fetch(url);
    return await response.json(); 
}

async function findCords(city) {
    try {
        const data = await getCords(city);

        if (Array.isArray(data) && data.length > 0) {
            const { lat, lon } = data[0];
            return { lat, lon };
        } else {
            throw new Error("No data found for the specified city.");
        }
    } catch (error) {
        console.error("Error in findCords:", error);
    }
}

async function convertTo2DList(apiResponse) {
    try {
        const weatherData = await apiResponse.json();
        const result = [];

        const { daily, hourly } = weatherData;

        if (!daily || !hourly) {
            throw new Error("Missing daily or hourly data in the response.");
        }

        const days = daily.time.length;

        for (let i = 0; i < days; i++) {
            const maxTemp = daily.temperature_2m_max[i];
            const minTemp = daily.temperature_2m_min[i];
            const precipitationSum = daily.precipitation_sum[i];
            const sunshineDuration = daily.sunshine_duration[i] / 3600;
            const evapotranspiration = daily.et0_fao_evapotranspiration[i];

            const hourlyIndices = hourly.time
                .map((time, index) => (time.startsWith(daily.time[i]) ? index : -1))
                .filter((index) => index !== -1);

            const relativeHumidityAvg =
                hourlyIndices.reduce((sum, idx) => sum + hourly.relative_humidity_2m[idx], 0) /
                hourlyIndices.length;

            const windSpeedAvg =
                hourlyIndices.reduce((sum, idx) => sum + hourly.wind_speed_10m[idx], 0) /
                hourlyIndices.length;

            const row = [
                maxTemp,
                minTemp,
                relativeHumidityAvg,
                precipitationSum,
                windSpeedAvg,
                evapotranspiration,
                sunshineDuration,
            ];

            result.push(row);
        }

        return result;
    } catch (error) {
        console.error("Error in convertTo2DList:", error);
    }
}

async function updateForeCastInfo(city) {
    const forcastData = await fetchData("forecast", city);

    const time = "12:00:00";
    const todayDate = new Date().toISOString().split("T")[0];

    forecastItemsFrame.innerHTML = " ";
    forcastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(time) && !forecastWeather.dt_txt.includes(todayDate))
            updateForecastItems(forecastWeather);
    })
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData;
    console.log(weatherData);

    const forecastDate = new Date(date);
    const dateOption = {
        day: "2-digit",
        month: "short"
    }
    const forecastDateResult = forecastDate.toLocaleDateString("en-us", dateOption);

    const forecastItem = `
        <div class="forecast-item">
            <h5 class="forecast-item-data regular-frame">${forecastDateResult}</h5>
            <img src="assets/weather/${getWeatherIcon(id)}" class="forecast-item-img">
            <h5 class="forecast-item-temp">${Math.round(temp)} ℃</h5>
        </div>
    `;

    forecastItemsFrame.insertAdjacentHTML("beforeend", forecastItem);
}

function getWeatherIcon(id) {
    if (id <= 232)
        return "thunder-storm.png";
    else if (id <= 321)
        return "drizzle.png";
    else if (id <= 531)
        return "rain.png";
    else if (id <= 622)
        return "snow.png";
    else if (id <= 781)
        return "atmosphere.png";
    else if (id <= 800)
        return "clear.png";
    else
        return "clouds.png";
}

function getCurrentDate() {
    const currDate = new Date();
    const options = {
        weekday: "short",
        day: "2-digit",
        month: "short"
    }

    return currDate.toLocaleDateString("en-GB",options);
}

function displaySection(section) {
    sectionList = [searchCitySection, weatherInfoSection, notFoundSection];
    sectionList.forEach((section) => section.style.display = "none");

    section.style.display = "flex";
}