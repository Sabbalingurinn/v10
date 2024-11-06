import { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [weather, setWeather] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [location, setLocation] = useState("reykjavik"); // Track selected location

  // Coordinates for the three locations
  const locations = {
    reykjavik: { name: "Reykjavík", latitude: 64.1355, longitude: -21.8954 },
    japan: { name: "Tokyo, Japan", latitude: 35.6895, longitude: 139.6917 },
    new_york: { name: "New York, USA", latitude: 40.7128, longitude: -74.0060 },
  };

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true);
      setError(null);
      const { latitude, longitude } = locations[location];
      
      try {
        const response = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch weather data");
        }
        const data = await response.json();
        setWeather(data.current_weather);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWeather();
  }, [location]);

  const formatTime = (isoTime) => {
    const date = new Date(isoTime);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <>  
      <div>
        <h2>Veðrið</h2>
        
        {}
        <select value={location} onChange={(e) => setLocation(e.target.value)}>
          <option value="reykjavik">Reykjavík, Ísland</option>
          <option value="japan">Tokyo, Japan</option>
          <option value="new_york">New York, USA</option>
        </select>
        
        {loading ? (
          <p>Loading weather data...</p>
        ) : error ? (
          <p>Error: {error}</p>
        ) : (
          weather && (
            <div>
              <p>Staðsetning: {locations[location].name}</p>
              <p>Hitastig: {weather.temperature}°C</p>
              <p>Vindhraði: {weather.windspeed} km/klst</p>
              <p>Tími: {formatTime(weather.time)}</p>
            </div>
          )
        )}
      </div>
    </>
  );
}

export default App;
