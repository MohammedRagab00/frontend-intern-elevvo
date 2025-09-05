import React, { useEffect, useRef, useState } from "react";
import "./Weather.css";
import search_icon from "../assets/search.png";
import clear_icon from "../assets/clear.png";
import cloud_icon from "../assets/cloud.png";
import drizzle_icon from "../assets/drizzle.png";
import humidity_icon from "../assets/humidity.png";
import rain_icon from "../assets/rain.png";
import snow_icon from "../assets/snow.png";
import wind_icon from "../assets/wind.png";

function Weather() {
  const inputRef = useRef();
  const [weatherData, setWeatherData] = useState(false);
  const [forecastData, setForecastData] = useState([]);

  const allIcons = {
    "01d": clear_icon,
    "01n": clear_icon,
    "02d": cloud_icon,
    "02n": cloud_icon,
    "03d": cloud_icon,
    "03n": cloud_icon,
    "04d": drizzle_icon,
    "04n": drizzle_icon,
    "09d": rain_icon,
    "09n": rain_icon,
    "10d": rain_icon,
    "10n": rain_icon,
    "13d": snow_icon,
    "13n": snow_icon,
  };

  const fetchWeather = async ({ city, lat, lon }) => {
    try {
      const key = import.meta.env.VITE_WEATHER_API_KEY;
      const base = "https://api.openweathermap.org/data/2.5";

      const locationParams = city ? `q=${city}` : `lat=${lat}&lon=${lon}`;

      const [currentData, forecastData] = await Promise.all([
        fetch(
          `${base}/weather?${locationParams}&units=metric&appid=${key}`
        ).then((res) => res.json()),
        fetch(
          `${base}/forecast?${locationParams}&units=metric&appid=${key}`
        ).then((res) => res.json()),
      ]);

      if (currentData.cod !== 200) {
        alert(currentData.message);
        return;
      }

      const icon = allIcons[currentData.weather[0].icon] || clear_icon;
      setWeatherData({
        humidity: currentData.main.humidity,
        windSpeed: currentData.wind.speed,
        temperature: Math.floor(currentData.main.temp),
        location: currentData.name,
        icon: icon,
      });

      const formattedForecast = forecastData.list
        .filter((item) => item.dt_txt.includes("12:00:00"))
        .slice(0, 3)
        .map((item) => ({
          date: new Date(item.dt_txt).toLocaleDateString("en-US", {
            weekday: "short",
          }),
          temp: Math.floor(item.main.temp),
          icon: allIcons[item.weather[0].icon] || clear_icon,
        }));

      setForecastData(formattedForecast);
    } catch (error) {
      console.error("Error fetching weather data:", error);
      setWeatherData(false);
      setForecastData([]);
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          fetchWeather({ lat: latitude, lon: longitude });
        },
        (error) => {
          console.warn("Geolocation failed, defaulting to Cairo");
          search("Cairo");
        }
      );
    } else {
      console.warn("Geolocation not supported, defaulting to Cairo");
      search("Cairo");
    }
  }, []);

  return (
    <div className="weather">
      <div className="search-bar">
        <input ref={inputRef} type="text" placeholder="Search" />
        <img
          src={search_icon}
          alt="search icon"
          onClick={() => fetchWeather({ city: inputRef.current.value })}
        />
      </div>
      {weatherData && (
        <>
          <img
            src={weatherData.icon}
            alt="weather icon"
            className="weather-icon"
          />
          <p className="temperature">{weatherData.temperature} °C</p>
          <p className="location">{weatherData.location}</p>
          <div className="weather-data">
            <div className="col">
              <img src={humidity_icon} alt="humidity icon" />
              <div>
                <p>{weatherData.humidity} %</p>
                <span>Humidity</span>
              </div>
            </div>
            <div className="col">
              <img src={wind_icon} alt="wind icon" />
              <div>
                <p>{weatherData.windSpeed} km/h</p>
                <span>Wind Speed</span>
              </div>
            </div>
          </div>

          <div className="forecast">
            {forecastData.map((day, index) => (
              <div key={index} className="forecast-card">
                <p>{day.date}</p>
                <img src={day.icon} alt="forecast icon" />
                <p>{day.temp} °C</p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

export default Weather;
