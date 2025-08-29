from flask import Flask, request, jesonify
import requests
import os

app = Flask(__name__)

API_KEY = "2f7dd0fb87c2a3c1314c918804c19256"
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"

@app.route("/weather")
def get_weather():
    city = request.args.get("city", "Melbourne")

    weather_res = request.get(WEATHER_URL, params={
        "q": city,
        "units": "metric",
        "appid": API_KEY
    })
    forecast_data = weather_res.json()

    forecast_res = request.get(FORECAST_URL, params={
        "q": city,
        "units": "metric",
        "appid": API_KEY
    })
    forecast_data = forecast_res.json()

