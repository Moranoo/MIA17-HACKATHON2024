// src/components/PredictionForm.js
import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [country, setCountry] = useState('');
  const [year, setYear] = useState(2024);
  const [disciplines, setDisciplines] = useState('');
  const [events, setEvents] = useState('');
  const [predictions, setPredictions] = useState(null);

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      const response = await axios.get('http://localhost:5000/predict', {
        params: {
          country_name: country,
          game_year: year,
          total_disciplines: disciplines,
          total_events: events,
        },
      });
      setPredictions(response.data);
    } catch (error) {
      console.error("Error fetching the prediction data", error);
    }
  };

  return (
    <div>
      <h2>Prediction for 2024</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Country: </label>
          <input
            type="text"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            placeholder="Enter country name"
          />
        </div>
        <div>
          <label>Year: </label>
          <input
            type="number"
            value={year}
            onChange={(e) => setYear(e.target.value)}
            placeholder="Enter year"
            disabled
          />
        </div>
        <div>
          <label>Total Disciplines: </label>
          <input
            type="number"
            value={disciplines}
            onChange={(e) => setDisciplines(e.target.value)}
            placeholder="Enter total disciplines"
          />
        </div>
        <div>
          <label>Total Events: </label>
          <input
            type="number"
            value={events}
            onChange={(e) => setEvents(e.target.value)}
            placeholder="Enter total events"
          />
        </div>
        <button type="submit">Get Prediction</button>
      </form>
      {predictions && (
        <div>
          <h3>Predicted Medals</h3>
          <p>{country}: {predictions.predicted_medals} medals</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
