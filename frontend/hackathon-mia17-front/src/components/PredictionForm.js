import React, { useState } from 'react';
import axios from 'axios';

const PredictionForm = () => {
  const [country, setCountry] = useState('');
  const [year, setYear] = useState('');
  const [totalDisciplines, setTotalDisciplines] = useState('');
  const [totalEvents, setTotalEvents] = useState('');
  const [predictedMedals, setPredictedMedals] = useState(null);

  const handlePrediction = async () => {
    try {
      const response = await axios.get('http://localhost:5000/predict', {
        params: {
          country,
          year,
          total_disciplines: totalDisciplines,
          total_events: totalEvents,
        }
      });
      console.log(response.data);  // Vérifiez que les données sont correctes
      setPredictedMedals(response.data.predicted_medals);
    } catch (error) {
      console.error("Error fetching the prediction data", error);
    }
  };

  return (
    <div>
      <h2>Make a Prediction</h2>
      <div>
        <label>Country:</label>
        <input 
          type="text" 
          value={country} 
          onChange={(e) => setCountry(e.target.value)} 
          placeholder="Enter country name" 
        />
      </div>
      <div>
        <label>Year:</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(e.target.value)}
          placeholder="Enter year"
        />
      </div>
      <div>
        <label>Total Disciplines:</label>
        <input
          type="number"
          value={totalDisciplines}
          onChange={(e) => setTotalDisciplines(e.target.value)}
          placeholder="Enter total disciplines"
        />
      </div>
      <div>
        <label>Total Events:</label>
        <input
          type="number"
          value={totalEvents}
          onChange={(e) => setTotalEvents(e.target.value)}
          placeholder="Enter total events"
        />
      </div>
      <button onClick={handlePrediction}>Predict</button>
      {predictedMedals !== null && (
        <div>
          <h3>Predicted Medals:</h3>
          <p>{predictedMedals}</p>
        </div>
      )}
    </div>
  );
};

export default PredictionForm;
