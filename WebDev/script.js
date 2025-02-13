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
const rainfallFrame = document.querySelector(".rainfall-value-frame");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currDateFrame = document.querySelector(".curr-date-text");

const forecastItemsFrame = document.querySelector(".forecast-items-frame");

const riceBlastPercentage = document.querySelector("#rbp");
const falseSmutPercentage = document.querySelector("#fsp");

const riceBlastImg = document.querySelector("#rb-img");
const falseSmutImg = document.querySelector("#fs-img");

const apiKey = "e2a5ffae0db80d6ba420dbed858bea3a";

let index = 0;

const week = 49;

searchBtn.addEventListener("click", () => {
    if (cityInput.value.trim() !== "") {
        updateWeatherInfo(cityInput.value);
        // updatePastWeather(cityInput.value, week);
        cityInput.value = "";
        cityInput.blur();
        updateTextColor(index);
        updatePhoto(index);
        index = (index + 1) % 5;
    }
});

cityInput.addEventListener("keydown", (event) => {
    if (event.key === "Enter" && cityInput.value.trim() !== "") {
        updateWeatherInfo(cityInput.value);
        // updatePastWeather(cityInput.value, week);
        cityInput.value = "";
        cityInput.blur();
        updateTextColor(index);
        updatePhoto(index);
        index = (index + 1) % 5;
    }
});

function updateTextColor(idx) {
    const colors = ["red", "blue", "green", "purple", "black"];
    riceBlastPercentage.style.color = colors[idx];
    falseSmutPercentage.style.color = colors[idx];
}

function updatePhoto(idx) {
    riceBlastImg.src = `assets/diseases/rb${idx+1}.jpg`;
    falseSmutImg.src = `assets/diseases/fs${idx+1}.jpg`;
}

async function updatePastWeather(city, week) {
    if (city != 'coimbatore' && city != 'aduthurai' && city != 'ambasamudram') {
        displaySection(notFoundSection);
        return
    }

    locationFrame.textContent = city.charAt(0).toUpperCase() + city.slice(1);
    currDateFrame.textContent = getDate(week);

    data = await getWeatherData(city, week);
    console.log(data);

    const { maxTemp, minTemp, relHum, rainfall, windSpeed, evp, sunDur } = data[0];

    console.log("Max Temp:", maxTemp);
    console.log("Min Temp:", minTemp);
    console.log("Relative Humidity:", relHum);
    console.log("Rainfall:", rainfall);
    console.log("Wind Speed:", windSpeed);
    console.log("Evaporation:", evp);
    console.log("Sunshine Duration:", sunDur);

    temperatureFrame.textContent = Math.round((maxTemp+minTemp)/2) + "℃";
    humidityFrame.textContent = Math.round(relHum) + "%";
    windValueFrame.textContent = Math.round(windSpeed) + " M/s";
    rainfallFrame.textContent = (rainfall).toFixed(2) + "mm";

    if ((maxTemp+minTemp)/2 > 24)
        weatherSummaryImg.src = `assets/weather/clear.png`;
    else
    weatherSummaryImg.src = `assets/weather/clouds.png`;

    displaySection(weatherInfoSection);

    await getPastDiseasePrediction(maxTemp, minTemp, relHum, relHum, rainfall, windSpeed, sunDur, evp);
}

async function getPastDiseasePrediction(maxTemp, minTemp, relHum, relHum, rainfall, windSpeed, sunDur, evp) {
    // Rice Blast Prediction
    const rbURL = `http://127.0.0.1:8000/predict_rice_blast?max_temp=${maxTemp}&min_temp=${minTemp}&rh_morning=${relHum}&rh_evening=${relHum}&rainfall=${rainfall}&wind_speed=${windSpeed}&sunshine=${sunDur}&solar_radiation=300&evaporation=${evp}`;
    const rbResponse = await fetch(rbURL);
    const rbData = await rbResponse.json(); 

    if (rbData?.predicted_rice_blast?.[0] !== undefined) {
        const predictedRiceBlast = rbData.predicted_rice_blast[0];
        console.log(predictedRiceBlast);
        riceBlastPercentage.innerHTML = predictedRiceBlast + "%";

        if (predictedRiceBlast > 25) {
            // showWarning('⚠ Critical Rice Blast Alert!', 'alert');
            showWarning(' ⚠ Warning: Rice Blast incidence exceeds threshold. Immediate action is recommended to prevent further spread','alert');
        } else if (predictedRiceBlast > 20) {
            // showWarning('⚠ Moderate Rice Blast Risk', 'warning');
            showWarning('⚠ Alert: Moderate Rice Blast Risk Found. Take preventive measures', 'warning');
        }
    } else {
        console.error("Error: predicted_rice_blast not found in response");
    }

    // False Smut Prediction
    const fsURL = `http://127.0.0.1:8000/predict_false_smut?max_temp=${maxTemp}&min_temp=${minTemp}&rh_morning=${relHum}&rh_evening=${relHum}&rainfall=${rainfall}&wind_speed=${windSpeed}&sunshine=${sunDur}&solar_radiation=300&evaporation=${evp}`;
    const fsResponse = await fetch(fsURL);
    const fsData = await fsResponse.json(); 

    if (fsData?.predicted_false_smut?.[0] !== undefined) {
        const predictedFalseSmut = fsData.predicted_false_smut[0]; 
        console.log(predictedFalseSmut);
        falseSmutPercentage.innerHTML = predictedFalseSmut + "%";

        if (predictedFalseSmut > 25) {
            // showWarning('⚠ Critical False Smut Alert!', 'alert');
            showWarning(' ⚠ Warning: False Smut incidence exceeds threshold. Immediate action is recommended to prevent further spread', 'alert')
        } else if (predictedFalseSmut > 20) {
            // showWarning('⚠ Moderate False Smut Risk', 'warning');
            showWarning('⚠ Alert: Moderate False Smut Risk Found. Take preventive measures', 'warning');
        }
    } else {
        console.error("Error: predicted_false_smut not found in response");
    }
}

async function getWeatherData(location, week) {
    const sheetMapping = {
        coimbatore: "Coimbatore",
        aduthurai: "ADUTHURAI",
        ambasamudram: "Ambasamudram"
    };

    const columnMapping = {
        coimbatore: { maxTemp: "MaxT", minTemp: "MinT", relHum1: "RHm", relHum2: "Rhe", rainfall: "RF", windSpeed: "WS", evp: "EVP", sunDur: "SS" },
        aduthurai: { maxTemp: "MaxT", minTemp: "MinT", relHum1: "RHm", relHum2: "Rhe", rainfall: "Rainfall", windSpeed: "WV", evp: "EVP", sunDur: "SS" },
        ambasamudram: { maxTemp: "MaxT", minTemp: "MinT", relHum1: "RHm", relHum2: "Rhe", rainfall: "RF", windSpeed: "WS", evp: "SR", sunDur: "ST" } // "ST" instead of "SS"
    };

    const sheetName = sheetMapping[location.toLowerCase()];
    if (!sheetName) {
        throw new Error("Invalid location. Choose from 'coimbatore', 'aduthurai', or 'ambasamudram'.");
    }

    const response = await fetch("assets/data/OCT TO DEC 2024.xlsx");
    const arrayBuffer = await response.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });

    const sheet = workbook.Sheets[sheetName];
    const jsonData = XLSX.utils.sheet_to_json(sheet);

    const columns = columnMapping[location.toLowerCase()];

    const filteredData = jsonData
        .filter(row => row.SMW === week) 
        .map(row => ({
            maxTemp: row[columns.maxTemp],
            minTemp: row[columns.minTemp],
            relHum: (row[columns.relHum1] + row[columns.relHum2]) / 2, 
            rainfall: row[columns.rainfall],
            windSpeed: row[columns.windSpeed],
            evp: row[columns.evp],
            sunDur: row[columns.sunDur] 
        }));

    return filteredData;
}

function getDate(week) {
    if (week == 42) {
        lb = 15, ub = 21;
        month = 10;
    } else if (week == 43) {
        lb = 22, ub = 28;
        month = 10;
    } else if (week == 44) {
        lb = 1, ub = 4;
        month = 11;
    } else if (week == 45) {
        lb = 5, ub = 11;
        month = 11;
    } else if (week == 46) {
        lb = 12, ub = 19;
        month = 11;
    } else if (week == 47) {
        lb = 20, ub = 31;
        month = 11;
    } else {
        lb = 1, ub = 2;
        month = 12;
    }

    const date = new Date(2024, month - 1, getDay(lb,ub));
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return date.toLocaleDateString("en-GB", options);
}

function getDay(lower, upper) {
    return Math.floor(Math.random() * (upper - lower + 1)) + lower;
}

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
    rainfallFrame.textContent = speed + "mm";

    currDateFrame.textContent = getCurrentDate();
    weatherSummaryImg.src = `assets/weather/${getWeatherIcon(id)}`;

    await updateForeCastInfo(city);
    
    displaySection(weatherInfoSection);
    
    await getDiseasePrediction(city);
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

        const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${cords.lat}&longitude=${cords.lon}&hourly=relative_humidity_2m,wind_speed_10m&daily=temperature_2m_max,temperature_2m_min,sunshine_duration,precipitation_sum,et0_fao_evapotranspiration&timezone=Asia%2FSingapore&past_days=7&forecast_days=1`;
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

            // Rice Blast Prediction
            const rbURL = `http://127.0.0.1:8000/predict_rice_blast?max_temp=${maxTemp}&min_temp=${minTemp}&rh_morning=${relHum}&rh_evening=${relHum}&rainfall=${rainfall}&wind_speed=${windSpeed}&sunshine=${sunDur}&solar_radiation=300&evaporation=${evp}`;
            const rbResponse = await fetch(rbURL);
            const rbData = await rbResponse.json(); 

            if (rbData?.predicted_rice_blast?.[0] !== undefined) {
                const predictedRiceBlast = rbData.predicted_rice_blast[0];
                console.log(predictedRiceBlast);
                riceBlastPercentage.innerHTML = predictedRiceBlast + "%";

                if (predictedRiceBlast > 30) {
                    // showWarning('⚠ Critical Rice Blast Alert!', 'alert');
                    showWarning('⚠ Warning: Rice Blast incidence exceeds threshold. Immediate action is recommended to prevent further spread', 'alert');
                } else if (predictedRiceBlast > 25) {
                    // showWarning('⚠ Moderate Rice Blast Risk', 'warning');
                    showWarning('⚠ Alert: Moderate Rice Blast Risk Found. Take preventive measures', 'warning');
                }
            } else {
                console.error("Error: predicted_rice_blast not found in response");
            }

            // False Smut Prediction
            const fsURL = `http://127.0.0.1:8000/predict_false_smut?max_temp=${maxTemp}&min_temp=${minTemp}&rh_morning=${relHum}&rh_evening=${relHum}&rainfall=${rainfall}&wind_speed=${windSpeed}&sunshine=${sunDur}&solar_radiation=300&evaporation=${evp}`;
            const fsResponse = await fetch(fsURL);
            const fsData = await fsResponse.json(); 

            if (fsData?.predicted_false_smut?.[0] !== undefined) {
                const predictedFalseSmut = fsData.predicted_false_smut[0]; 
                console.log(predictedFalseSmut);
                falseSmutPercentage.innerHTML = predictedFalseSmut + "%";

                if (predictedFalseSmut > 30) {
                    // showWarning('⚠ Critical False Smut Alert!', 'alert');
                    showWarning('⚠ Warning: False Smut incidence exceeds threshold. Immediate action is recommended to prevent further spread', 'alert')
                } else if (predictedFalseSmut > 25) {
                    // showWarning('⚠ Moderate False Smut Risk', 'warning');
                    showWarning('⚠ Alert: Moderate False Smut Risk Found. Take preventive measures', 'warning');
                }
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

        rainfallFrame.textContent = daily.precipitation_sum[daily.precipitation_sum.length - 1] + " mm";

        if (!daily || !hourly) {
            throw new Error("Missing daily or hourly data in the response.");
        }

        const days = 7;
        for (let i = 0; i < days; i++) {
            const maxTemp = daily.temperature_2m_max[i];
            const minTemp = daily.temperature_2m_min[i];
            const precipitationSum = daily.precipitation_sum[i];
            const sunshineDuration = daily.sunshine_duration[i] / 3600; // convert seconds to hours
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
    forecastItemsFrame.innerHTML = "";
    forcastData.list.forEach(forecastWeather => {
        if (forecastWeather.dt_txt.includes(time) && !forecastWeather.dt_txt.includes(todayDate)) {
            updateForecastItems(forecastWeather);
        }
    });
}

function updateForecastItems(weatherData) {
    const {
        dt_txt: date,
        weather: [{ id }],
        main: { temp }
    } = weatherData;
    console.log(weatherData);

    const forecastDate = new Date(date);
    const dateOption = { day: "2-digit", month: "short" };
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
    else if (id === 800)
        return "clear.png";
    else
        return "clouds.png";
}

function getCurrentDate() {
    const currDate = new Date();
    const options = { weekday: "short", day: "2-digit", month: "short" };
    return currDate.toLocaleDateString("en-GB", options);
}

function displaySection(section) {
    const sectionList = [searchCitySection, weatherInfoSection, notFoundSection];
    sectionList.forEach((sec) => sec.style.display = "none");
    section.style.display = "flex";
}

function showWarning(message, type) {
    // Ensure the warning container exists and is centered.
    let warningContainer = document.getElementById("warning-container");
    if (!warningContainer) {
        warningContainer = document.createElement("div");
        warningContainer.id = "warning-container";
        Object.assign(warningContainer.style, {
            position: "fixed",
            top: "70px",
            left: "50%",
            transform: "translateX(-50%)",
            zIndex: "1000",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",  // Center child items horizontally
            gap: "10px",
            width: "100%" // container takes full width so child elements can center
        });
        document.body.appendChild(warningContainer);
    }

    // Create a new warning box element with increased size.
    const warningBox = document.createElement("div");
    warningBox.textContent = message;
    Object.assign(warningBox.style, {
        padding: "50px",
        borderRadius: "20px",
        color: "#fff",
        fontSize: "20px",
        fontWeight: "bold",
        width: "500px",
        textAlign: "center",
        backgroundColor: type === "alert" ? "red" : "orange",
        transition: "opacity 0.5s ease, transform 0.5s ease",
        opacity: "1"
    });

    // Append the warning box to the centered container.
    warningContainer.appendChild(warningBox);

    // After 5 seconds, fade out and remove the warning.
    setTimeout(() => {
        warningBox.style.opacity = "0";
        warningBox.style.transform = "translateY(-20px)";
        setTimeout(() => {
            warningBox.remove();
        }, 500);
    }, 5000);
}