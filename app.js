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
        const res = await fetch('${weatherURL}?q=${city}&units=metric&appid=${apiKey}');
        const data = await res.json();
        if (data.cod != 200) {
            alert("City not found");
            return;
        } 
    }   
}

