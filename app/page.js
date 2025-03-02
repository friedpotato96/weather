"use client";

import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sun, Moon, Loader } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";


export default function WeatherPage() {
  const [city, setCity] = useState("");
  const [weather, setWeather] = useState(null);
  const [forecast, setForecast] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.documentElement.classList.add("dark");
    }
  }, []);

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    if (!darkMode) {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
    } else {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
    }
  };

  const fetchWeather = async () => {
    if (!city) return;
    setLoading(true);
    setError(null);
    setWeather(null);
    setForecast(null);

    try {
      const apiKey = "ffde1c2be34298178e74e129c68bce6e";
      const weatherRes = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${apiKey}`
      );
      const forecastRes = await fetch(
        `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=metric&appid=${apiKey}`
      );

      if (!weatherRes.ok || !forecastRes.ok) throw new Error("City not found! ❌");

      const weatherData = await weatherRes.json();
      const forecastData = await forecastRes.json();
      setWeather(weatherData);
      setForecast(forecastData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4 transition-all bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white">
      <Card className="w-full max-w-md p-6 shadow-lg rounded-2xl bg-white dark:bg-gray-800 transition-all">
        <CardContent className="flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold">Weather App 🌦</h1>
            <Button onClick={toggleDarkMode} variant="outline" size="icon">
              {darkMode ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </Button>
          </div>
          <div className="flex flex-col gap-2">
            <Input
              type="text"
              placeholder="Enter city name"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              className="w-full dark:bg-gray-700 dark:border-gray-600"
            />
            <Button onClick={fetchWeather} className="w-full">
              {loading ? <Loader className="animate-spin w-5 h-5" /> : "Get Weather"}
            </Button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}
          {weather && (
            <div className="text-center animate-fadeIn flex flex-col items-center">
              <p className="text-2xl font-bold">{weather.name}</p>
              <img
                src={`https://openweathermap.org/img/wn/${weather.weather[0].icon}@2x.png`}
                alt="Weather Icon"
                className="w-20 h-20"
              />
              <p className="text-4xl font-bold">{weather.main.temp}°C</p>
              <p className="text-lg">{weather.weather[0].description}</p>
            </div>
          )}
          {forecast && (
              <div className="mt-6">
              <h2 className="text-lg font-bold">Hourly Forecast ⏳</h2>
              <ScrollArea className="w-full max-w-md">
                <div className="flex gap-4 p-2">
                  {forecast.list.slice(0, 5).map((item, index) => (
                    <div key={index} className="text-center min-w-[80px]">
                      <p className="text-sm">{new Date(item.dt * 1000).getHours()}:00</p>
                      <img
                            src={`https://openweathermap.org/img/wn/${item.weather[0].icon}.png`}
                            alt="Weather Icon"
                            className="w-12 h-12"
                            onError={(e) => (e.target.src = "/fallback-weather.png")}
                      />
                      <p>{Math.round(item.main.temp)}°C</p>
                    </div>
                  ))}
                </div>
              </ScrollArea>
              </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
