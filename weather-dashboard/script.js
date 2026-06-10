// OpenWeatherMap API Configuration
const API_KEY = 'YOUR_API_KEY_HERE'; // Get free key from https://openweathermap.org/api
const API_BASE_URL = 'https://api.openweathermap.org/data/2.5';

// DOM Elements
const searchInput = document.getElementById('searchInput');
const searchBtn = document.getElementById('searchBtn');
const currentWeatherEl = document.getElementById('currentWeather');
const forecastContainerEl = document.getElementById('forecastContainer');
const weatherDetailsEl = document.getElementById('weatherDetails');

// Event Listeners
searchBtn.addEventListener('click', searchWeather);
searchInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        searchWeather();
    }
});

// Load default city on page load
window.addEventListener('load', () => {
    getWeatherByCity('London');
});

/**
 * Search weather by city name
 */
function searchWeather() {
    const city = searchInput.value.trim();
    if (city) {
        getWeatherByCity(city);
        searchInput.value = '';
    }
}

/**
 * Fetch weather data by city name
 */
async function getWeatherByCity(city) {
    try {
        showLoading();

        // Get coordinates from city name
        const geoResponse = await fetch(
            `${API_BASE_URL}/weather?q=${city}&appid=${API_KEY}&units=metric`
        );

        if (!geoResponse.ok) {
            throw new Error('City not found');
        }

        const geoData = await geoResponse.json();
        const { lat, lon } = geoData.coord;

        // Fetch current weather and forecast
        await Promise.all([
            fetchCurrentWeather(lat, lon),
            fetchForecast(lat, lon)
        ]);
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Fetch current weather data
 */
async function fetchCurrentWeather(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/weather?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch weather data');
        }

        const data = await response.json();
        displayCurrentWeather(data);
        displayWeatherDetails(data);
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Fetch 5-day forecast
 */
async function fetchForecast(lat, lon) {
    try {
        const response = await fetch(
            `${API_BASE_URL}/forecast?lat=${lat}&lon=${lon}&appid=${API_KEY}&units=metric`
        );

        if (!response.ok) {
            throw new Error('Failed to fetch forecast data');
        }

        const data = await response.json();
        displayForecast(data);
    } catch (error) {
        showError(error.message);
    }
}

/**
 * Display current weather
 */
function displayCurrentWeather(data) {
    const { name, country } = data.sys;
    const { main, weather } = data;
    const temp = Math.round(main.temp);
    const description = weather[0].main;
    const icon = getWeatherIcon(weather[0].main);

    currentWeatherEl.innerHTML = `
        <h2 class="city-name">${name}, ${country}</h2>
        <div class="weather-main">
            <div class="weather-icon">${icon}</div>
            <div class="temperature-info">
                <div class="temperature">${temp}°C</div>
                <div class="weather-description">${description}</div>
            </div>
        </div>
    `;
}

/**
 * Display weather details (humidity, wind, pressure, feels like)
 */
function displayWeatherDetails(data) {
    const { main, wind } = data;

    document.getElementById('humidity').textContent = `${main.humidity}%`;
    document.getElementById('windSpeed').textContent = `${wind.speed} m/s`;
    document.getElementById('pressure').textContent = `${main.pressure} hPa`;
    document.getElementById('feelsLike').textContent = `${Math.round(main.feels_like)}°C`;
}

/**
 * Display 5-day forecast
 */
function displayForecast(data) {
    const forecastList = data.list;
    const dailyForecasts = {};

    // Group forecasts by day
    forecastList.forEach(forecast => {
        const date = new Date(forecast.dt * 1000);
        const day = date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' });

        if (!dailyForecasts[day]) {
            dailyForecasts[day] = forecast;
        }
    });

    // Display first 5 days
    forecastContainerEl.innerHTML = Object.entries(dailyForecasts)
        .slice(0, 5)
        .map(([day, forecast]) => {
            const temp = Math.round(forecast.main.temp);
            const description = forecast.weather[0].main;
            const icon = getWeatherIcon(description);

            return `
                <div class="forecast-card">
                    <div class="forecast-date">${day}</div>
                    <div class="forecast-icon">${icon}</div>
                    <div class="forecast-temp">${temp}°C</div>
                    <div class="forecast-description">${description}</div>
                </div>
            `;
        })
        .join('');
}

/**
 * Get weather icon based on condition
 */
function getWeatherIcon(condition) {
    const icons = {
        'Clear': '<i class="fas fa-sun"></i>',
        'Clouds': '<i class="fas fa-cloud"></i>',
        'Rain': '<i class="fas fa-cloud-rain"></i>',
        'Drizzle': '<i class="fas fa-cloud-rain"></i>',
        'Thunderstorm': '<i class="fas fa-bolt"></i>',
        'Snow': '<i class="fas fa-snowflake"></i>',
        'Mist': '<i class="fas fa-smog"></i>',
        'Smoke': '<i class="fas fa-smog"></i>',
        'Haze': '<i class="fas fa-smog"></i>',
        'Dust': '<i class="fas fa-smog"></i>',
        'Fog': '<i class="fas fa-smog"></i>',
        'Sand': '<i class="fas fa-smog"></i>',
        'Ash': '<i class="fas fa-smog"></i>',
        'Squall': '<i class="fas fa-wind"></i>',
        'Tornado': '<i class="fas fa-tornado"></i>'
    };

    return icons[condition] || '<i class="fas fa-cloud"></i>';
}

/**
 * Show loading state
 */
function showLoading() {
    currentWeatherEl.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
    forecastContainerEl.innerHTML = '<div class="loading"><i class="fas fa-spinner fa-spin"></i> Loading...</div>';
}

/**
 * Show error message
 */
function showError(message) {
    currentWeatherEl.innerHTML = `<div class="error"><i class="fas fa-exclamation-circle"></i> ${message}</div>`;
    forecastContainerEl.innerHTML = `<div class="error">Unable to load forecast</div>`;
}