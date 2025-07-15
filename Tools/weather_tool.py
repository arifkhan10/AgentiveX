

# from pydantic import BaseModel
# import requests

# class WeatherInput(BaseModel):
#     city: str

# def get_weather(input: WeatherInput) -> str:
#     """Returns current weather for a given city using Open-Meteo API"""
#     # Static lat/lon for now; in production, geocode city to lat/lon
#     response = requests.get(
#         "https://api.open-meteo.com/v1/forecast?latitude=35&longitude=139&current_weather=true"
#     )
#     if response.ok:
#         data = response.json()
#         return f"Current temperature in {input.city}: {data['current_weather']['temperature']}°C"
#     return "Failed to fetch weather."



# import requests
# from pydantic import BaseModel, Field

# # Replace this with your actual API key
# OPENWEATHER_API_KEY = "https://api.open-meteo.com/v1/forecast?latitude=35&longitude=139&current_weather=true"

# class WeatherInput(BaseModel):
#     city: str = Field(..., description="Name of the city to get weather for")

# def get_weather(city: str) -> str:
#     url = f"http://api.openweathermap.org/data/2.5/weather"
#     params = {
#         "q": city,
#         "appid": OPENWEATHER_API_KEY,
#         "units": "metric"  # or "imperial" for Fahrenheit
#     }

#     response = requests.get(url, params=params)

#     if response.status_code != 200:
#         return f"Failed to fetch weather for {city}: {response.text}"

#     data = response.json()
#     temp = data["main"]["temp"]
#     description = data["weather"][0]["description"].capitalize()

#     return f"The weather in {city} is {temp}°C with {description}."



from pydantic import BaseModel, Field
import requests

class WeatherInput(BaseModel):
    city: str = Field(..., description="City name to fetch weather for")

def get_weather(input: WeatherInput) -> str:
    # Dummy coordinates – replace with geolocation API if needed
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": 28.61,  # New Delhi
        "longitude": 77.23,
        "current_weather": True
    }
    response = requests.get(url, params=params)
    if response.status_code == 200:
        weather = response.json().get("current_weather", {})
        temp = weather.get("temperature")
        return f"Current weather in {input.city} is {temp}°C."
    return f"Unable to fetch weather for {input.city}."
