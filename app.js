const cityInput = document.getElementById("city-input");
const searchBtn = document.getElementById("search-btn");
const refreshBtn = document.getElementById("refresh-btn");
const lastUpdated = document.getElementById("last-updated");
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

        // Update main weather
        mainCity.textContent = data.name;
        mainTemp.textContent = `${Math.round(data.main.temp)}°C`;
        mainIcon.src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

        // Update weather details
        sunTimes.textContent = `Sunrise: ${formatTime(data.sys.sunrise)} / Sunset: ${formatTime(data.sys.sunset)}`;
        windInfo.textContent = `Wind: ${getWindDirection(data.wind.deg)} ${data.wind.speed} m/s`;
        humidityInfo.textContent = `Humidity: ${data.main.humidity}%`;

        let precipText = "0 mm";
        if (data.rain && data.rain["1h"]) {
            precipText = `${data.rain["1h"]} mm (rain)`;
        } else if (data.snow && data.snow["1h"]) {
            precipText = `${data.snow["1h"]} mm (snow)`;
        }
        precip.textContent = `Precipitation: ${precipText}`;

        // Fetch forecast
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
                    <img src="https://openweathermap.org/img/wn/${item.weather[0].icon}.png" 
                         alt="${item.weather[0].description}">
                    <span>${dayName}</span>
                    <span>${Math.round(item.main.temp)}°C</span>
                `;
                forecastContainer.appendChild(div);
            }
        });

        const now = new Date();
        lastUpdated.textContent = `Last updated: ${now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;

    } catch (error) {
        console.error("Error fetching weather:", error);
    }
}

let lastCity = "Melbourne";

function handleSearch() {
    const city = cityInput.value.trim();
    if (city) {
        getWeather(city);
        lastCity = city;
        cityInput.value = "";
    }
}

// Search bar activates on click or enter key
searchBtn.addEventListener("click", handleSearch);

cityInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        handleSearch();
    }
});

refreshBtn.addEventListener("click", () => {
    getWeather(lastCity);
});

// Auto refresh every 10 minutes
setInterval(() => {
    getWeather(lastCity);
}, 600000);

// Initial load
getWeather("Melbourne");
