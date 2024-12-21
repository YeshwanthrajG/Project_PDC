const cityInput = document.querySelector(".city-frame");
const searchBtn = document.querySelector(".search-button");

const weatherInfoSection = document.querySelector(".weather-information");
const searchCitySection = document.querySelector(".search-city");
const notFoundSection = document.querySelector(".not-found");

const locationFrame = document.querySelector(".location-frame");
const temperatureFrame = document.querySelector(".temp-frame");
const conditionFrame = document.querySelector(".conditionframe");
const humidityFrame = document.querySelector(".humidity-value-frame");
const windValueFrame = document.querySelector(".wind-value-frame");
const weatherSummaryImg = document.querySelector(".weather-summary-img");
const currDateFrame = document.querySelector(".curr-date-frame");

const forecastItemsFrame = document.querySelector(".forecast-items-frame");

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

    // Get disease prediction
    const risk = await getDiseasePrediction(Math.round(temp), humidity);
    if (risk === 1) {
        alert("Alert: Rice blast is likely to occur. Take preventive measures!");
    } else {
        alert("Rice blast is not likely to occur. Conditions are safe.");
    }

    await updateForeCastInfo(city);

    displaySection(weatherInfoSection);
}

async function getDiseasePrediction(temperature, humidity) {
    const url = `https://appsail-50024113720.development.catalystappsail.in/predict?temperature=${temperature}&humidity=${humidity}`;

    try {
        const response = await fetch(url);
        const data = await response.json();
        console.log(data);
        return data.rice_blast[0][0]; // Ensure this exists in API response
    } catch (error) {
        console.error("Error fetching disease prediction:", error);
        return undefined;
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