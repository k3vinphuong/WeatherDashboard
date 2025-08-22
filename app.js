const apiKey = "2f7dd0fb87c2a3c1314c918804c19256";
const weatherURL = "https://api.openweathermap.org/data/2.5/weather";
const forecastURL = "https://api.openweathermap.org/data/2.5/forecast";

const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const mainCity = document.querySelector(".mainweather h1");
const mainTemp = document.querySelector(".mainweather .temp");
const mainIcon = document.querySelector(".mainweather img");
const forecastContainer = document.querySelector(".weekforecast");

const sunTimes = document.getElementById("sun-time");
const windInfo = document.getElementById("wind-info");
const humidityInfo = document.getElementById("humidity-info");
const precip = document.getElementById("rain-level");

function formatTime(timestamp) {
    const date = new Date(timestamp * 1000);
    return date.toLocaleDateString([], { hour: '2-digit', minute: '2-digit' });
}

function getWindDirection(deg) {
    const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return directions[Math.round(deg / 45) % 8];
}

async function getWeather(city) {
   try {
        const res = await fetch(`${weatherURL}?q=${city}&units=metric&appid=${apiKey}`);
        const data = await res.json();
        if (data.cod != 200) {
            alert("City not found");
            return;
        }
        
        mainCity.textContent = data.name;
        mainTemp.textContent = `${Math.round(data.main.temp)}°C`;
        mainIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        sunTimes.textContent = `Sunrise: ${formatTime(data.sys.sunrise)} / Sunset: ${formatTime(data.sys.sunset)}`;
        windInfo.textContent = `Wind: ${getWindDirection(data.wind.deg)} ${data.wind.speed} m/s`;
        humidityInfo.textContent = `Humidity: ${data.main.humidity}%`;
        
        let precipText = "0 mm";
        if (data.rain && data.rain["1h"]) precipText = `${data.rain["1h"]} mm (rain)`;
        else if (data.snow && data.snow["1h"]) precipText = `${data.snow["1h"]} mm (snow)`;
        precip.textContent = `Precipitation: ${precipText}`;

        const forecastRes = await fetch(`${forecastURL}?q=${city}&units=metric&appid=${apiKey}`);
        const forecastData = await forecastRes.json();

        forecastContainer.innerHTML = "";
        const daysShown = new Set();
        
        forecastData.list.forEach(item => {
            const date = new Date(item.dt * 1000);
            const dayName = date.toLocaleDateString("en-AU", { weekday: "long" });

            if (!daysShown.has(dayName) && date.getHours() >= 11 && date.getHours() <= 13) {
                daysShown.add(dayName);

                const div = document.createElement("div");
                div.classList.add("day");
                div.innerHTML = `
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" alt="${item.weather[0].description}">
                    <span>${dayName}</span>
                    <span>${Math.round(item.main.temp)}°C</span>
                `;
                forecastContainer.appendChild(div);
            }
        });
    } catch (error) {
        console.error("Error fetching weather:", error);
    } 
}

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        cityInput.value = "";
    }
}

searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener('keypress', (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

getWeather("Sydney");


