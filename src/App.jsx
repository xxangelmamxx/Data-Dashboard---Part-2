// App.jsx
import React, { useState, useEffect } from 'react';
import './App.css';
import ParticlesBackground from './ParticlesBackground';

const API_KEY = import.meta.env.VITE_APP_API_KEY;
const CITY = "New York";
const API_URL = `https://api.weatherbit.io/v2.0/forecast/daily?city=${CITY}&key=${API_KEY}`;

function App() {
  const [weatherData, setWeatherData] = useState([]);
  const [searchInput, setSearchInput] = useState("");
  const [tempFilter, setTempFilter] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchWeatherData() {
      try {
        const response = await fetch(API_URL);
        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        setWeatherData(data.data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    }
    fetchWeatherData();
  }, []);

  const filteredData = weatherData.filter(item => {
    const searchLower = searchInput.toLowerCase();
    return (
      item.datetime.toLowerCase().includes(searchLower) ||
      item.weather.description.toLowerCase().includes(searchLower)
    );
  }).filter(item => {
    if (tempFilter === "") return true;
    return item.temp >= Number(tempFilter);
  });

  const totalItems = weatherData.length;
  const meanTemp =
    totalItems > 0
      ? weatherData.reduce((acc, curr) => acc + curr.temp, 0) / totalItems
      : 0;
  const maxTemp =
    totalItems > 0
      ? weatherData.reduce((acc, curr) => (curr.temp > acc ? curr.temp : acc), -Infinity)
      : 0;

  if (loading) {
    return (
      <div className="App">
        <div className="loader">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="App">
        <p className="error">Error: {error}</p>
      </div>
    );
  }

  return (
    <>
      {/* Render the particles background */}
      <ParticlesBackground />
      <div className="App">
        <header className="app-header">
          <h1>Weather Dashboard - {CITY} &#x1F5FD;</h1>
        </header>

        {/* Summary Statistics */}
        <section className="summary">
          <div className="stat">
            <h2>{totalItems}</h2>
            <p>Total Forecast Days</p>
          </div>
          <div className="stat">
            <h2>{meanTemp.toFixed(2)}°C</h2>
            <p>Mean Temperature</p>
          </div>
          <div className="stat">
            <h2>{maxTemp}°C</h2>
            <p>Max Temperature</p>
          </div>
        </section>

        {/* Filters */}
        <section className="filters">
          <input 
            type="text" 
            placeholder="Search by date or description..."
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            className="search-input"
          />
          <input 
            type="number" 
            placeholder="Min Temperature" 
            value={tempFilter}
            onChange={(e) => setTempFilter(e.target.value)}
            className="filter-input"
          />
        </section>

        {/* Dashboard List */}
        <section className="dashboard">
          {filteredData.length > 0 ? (
            filteredData.map(item => (
              <div key={item.datetime} className="card">
                <h3>{item.datetime}</h3>
                <p>{item.weather.description}</p>
                <p><strong>Temp:</strong> {item.temp}°C</p>
              </div>
            ))
          ) : (
            <p>No results found.</p>
          )}
        </section>
      </div>
    </>
  );
}

export default App;
