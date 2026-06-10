# Weather Dashboard

A modern, responsive weather dashboard that fetches real-time weather data from the OpenWeatherMap API.

## Features

✨ **Current Weather Display**
- Real-time temperature and weather conditions
- Weather icons based on conditions
- City and country information

🎯 **Weather Details**
- Humidity percentage
- Wind speed
- Atmospheric pressure
- Feels-like temperature

📅 **5-Day Forecast**
- Daily forecasts with temperature
- Weather conditions and icons
- Interactive hover effects

🔍 **Search Functionality**
- Search any city in the world
- Enter city name or press Enter to search
- Real-time error handling

📱 **Responsive Design**
- Works on desktop, tablet, and mobile
- Beautiful gradient background
- Smooth animations and transitions

## Setup Instructions

### 1. Get an API Key

1. Visit [OpenWeatherMap](https://openweathermap.org/api)
2. Sign up for a free account
3. Go to API keys section and copy your key
4. Free tier includes:
   - Current weather data
   - 5-day forecast
   - Unlimited API calls
   - Rate limited to 60 calls per minute

### 2. Update the API Key

Open `script.js` and replace:
```javascript
const API_KEY = 'YOUR_API_KEY_HERE';
```

With your actual API key:
```javascript
const API_KEY = 'your_actual_api_key_here';
```

### 3. Run the Dashboard

Simply open `index.html` in your web browser or serve it with a local server:

```bash
# Using Python 3
python -m http.server 8000

# Using Python 2
python -m SimpleHTTPServer 8000

# Using Node.js http-server
npx http-server
```

Then navigate to `http://localhost:8000` in your browser.

## Usage

1. **Default City**: The dashboard loads with London weather by default
2. **Search**: Enter any city name in the search box and press Enter or click the search button
3. **View Details**: Check humidity, wind speed, pressure, and feels-like temperature
4. **5-Day Forecast**: Scroll down to see the 5-day weather forecast

## Technologies Used

- **HTML5**: Semantic markup
- **CSS3**: Modern styling with gradients, flexbox, and grid
- **JavaScript (ES6+)**: Async/await, fetch API
- **Font Awesome**: Weather icons
- **OpenWeatherMap API**: Real-time weather data

## File Structure

```
weather-dashboard/
├── index.html      # Main HTML file
├── styles.css      # CSS styling
├── script.js       # JavaScript logic
└── README.md       # This file
```

## API Endpoints Used

- Current Weather: `/weather`
- Forecast: `/forecast`
- Base URL: `https://api.openweathermap.org/data/2.5`

## Customization

### Change Default City
In `script.js`, modify the default city in the load event:
```javascript
window.addEventListener('load', () => {
    getWeatherByCity('Paris'); // Change to your preferred city
});
```

### Adjust Grid Layout
Edit the CSS in `styles.css` to change the number of forecast cards per row.

### Change Temperature Units
In `script.js`, replace `units=metric` with `units=imperial` for Fahrenheit.

## Troubleshooting

**Weather data not loading?**
- Verify your API key is correct
- Check that you have an active internet connection
- Ensure the API key has permissions for weather data

**"City not found" error?**
- Double-check the spelling of the city name
- Try using the full country name (e.g., "New York, USA")

**CORS errors?**
- This is normal for local development
- The API supports CORS, so it should work in production

## Future Enhancements

- [ ] Save favorite cities
- [ ] Hourly forecast view
- [ ] Weather alerts
- [ ] UV index and air quality
- [ ] Dark mode toggle
- [ ] Multiple language support
- [ ] Geolocation support

## License

MIT License - feel free to use this project for personal or commercial purposes.

## Resources

- [OpenWeatherMap Documentation](https://openweathermap.org/api)
- [MDN Web Docs - Fetch API](https://developer.mozilla.org/en-US/docs/Web/API/Fetch_API)
- [Font Awesome Icons](https://fontawesome.com/)
