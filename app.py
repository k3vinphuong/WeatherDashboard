from flask import Flask, request, jsonify
import requests
import os

app = Flask(__name__)

API_KEY = os.getenv("OPENWEATHER_API_KEY")
WEATHER_URL = "https://api.openweathermap.org/data/2.5/weather"
FORECAST_URL = "https://api.openweathermap.org/data/2.5/forecast"

@app.route("/weather")
def get_weather():
    city = request.args.get("city", "Melbourne")

    weather_res = requests.get(WEATHER_URL, params={
        "q": city,
        "units": "metric",
        "appid": API_KEY
    })
    weather_data = weather_res.json()

    forecast_res = requests.get(FORECAST_URL, params={
        "q": city,
        "units": "metric",
        "appid": API_KEY
    })
    forecast_data = forecast_res.json()

    return jsonify({
        "weather": weather_data,
        "forecast": forecast_data
    })

if __name__ == "__main__":
    app.run(debug=True)