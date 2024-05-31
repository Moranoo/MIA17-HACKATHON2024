import React, { useState, useEffect } from 'react';
import axios from 'axios';

function Prediction() {
  const [features, setFeatures] = useState({
    country_name: '',
    discipline_title: '',
    event_title: '',
    game_slug: '',
    participant_type: '',
    game_year: '',
    value_unit_category: '',
    value_type: '',
    games_participations: '',
    first_game: '',
    gold_medals: '',
    silver_medals: '',
    bronze_medals: ''
  });
  const [countries, setCountries] = useState([]);
  const [prediction, setPrediction] = useState(null);

  useEffect(() => {
    fetchCountries();
  }, []);

  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/countries');
      setCountries(response.data);
    } catch (error) {
      console.error("There was an error fetching the countries:", error);
    }
  };

  const handleChange = (e) => {
    setFeatures({
      ...features,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:5000/predict', {
        features: [features]
      });
      setPrediction(response.data.prediction);
    } catch (error) {
      console.error("There was an error making the prediction:", error);
    }
  };

  return (
    <div>
      <h2>Make a Prediction</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Country:
          <select name="country_name" value={features.country_name} onChange={handleChange}>
            <option value="">Select a country</option>
            {countries.map((country, index) => (
              <option key={index} value={country}>{country}</option>
            ))}
          </select>
        </label>
        {/* Add other inputs for features */}
        <button type="submit">Predict</button>
      </form>
      {prediction && (
        <div>
          <h3>Prediction Result</h3>
          <p>{prediction}</p>
        </div>
      )}
    </div>
  );
}

export default Prediction;
