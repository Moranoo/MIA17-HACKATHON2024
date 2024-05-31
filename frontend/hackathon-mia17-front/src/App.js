import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './App.css';

function App() {
  const [country, setCountry] = useState('');
  const [team, setTeam] = useState('');
  const [year, setYear] = useState('');
  const [discipline, setDiscipline] = useState('');
  const [event, setEvent] = useState('');
  const [gameSlug, setGameSlug] = useState('');
  const [participantType, setParticipantType] = useState('');
  const [valueUnitCategory, setValueUnitCategory] = useState('');
  const [valueType, setValueType] = useState('');
  const [medalsByCountry, setMedalsByCountry] = useState([]);
  const [medalsByTeamYear, setMedalsByTeamYear] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [countries, setCountries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [years, setYears] = useState([]);
  const [disciplines, setDisciplines] = useState([]);
  const [events, setEvents] = useState([]);
  const [gameSlugs, setGameSlugs] = useState([]);
  const [participantTypes, setParticipantTypes] = useState([]);
  const [valueUnitCategories, setValueUnitCategories] = useState([]);
  const [valueTypes, setValueTypes] = useState([]);
  const [teamYearMessage, setTeamYearMessage] = useState('');
  const [prediction, setPrediction] = useState('');
  const [predictionModel, setPredictionModel] = useState('random_forest'); // Nouveau state pour choisir le modèle

  useEffect(() => {
    fetchTopTeams();
    fetchCountries();
    fetchTeams();
    fetchYears();
    fetchDisciplines();
    fetchEvents();
    fetchGameSlugs();
    fetchParticipantTypes();
    fetchValueUnitCategories();
    fetchValueTypes();
  }, []);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleTeamChange = (e) => {
    setTeam(e.target.value);
  };

  const handleYearChange = (e) => {
    setYear(e.target.value);
  };

  const handleDisciplineChange = (e) => {
    setDiscipline(e.target.value);
  };

  const handleEventChange = (e) => {
    setEvent(e.target.value);
  };

  const handleGameSlugChange = (e) => {
    setGameSlug(e.target.value);
  };

  const handleParticipantTypeChange = (e) => {
    setParticipantType(e.target.value);
  };

  const handleValueUnitCategoryChange = (e) => {
    setValueUnitCategory(e.target.value);
  };

  const handleValueTypeChange = (e) => {
    setValueType(e.target.value);
  };

  const handlePredictionModelChange = (e) => {
    setPredictionModel(e.target.value);
  };

  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/countries');
      setCountries(response.data);
    } catch (error) {
      console.error("There was an error fetching the countries:", error);
    }
  };

  const fetchTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/teams');
      setTeams(response.data);
    } catch (error) {
      console.error("There was an error fetching the teams:", error);
    }
  };

  const fetchYears = async () => {
    try {
      const response = await axios.get('http://localhost:5000/years');
      setYears(response.data);
    } catch (error) {
      console.error("There was an error fetching the years:", error);
    }
  };

  const fetchDisciplines = async () => {
    try {
      const response = await axios.get('http://localhost:5000/disciplines');
      setDisciplines(response.data);
    } catch (error) {
      console.error("There was an error fetching the disciplines:", error);
    }
  };

  const fetchEvents = async () => {
    try {
      const response = await axios.get('http://localhost:5000/events');
      setEvents(response.data);
    } catch (error) {
      console.error("There was an error fetching the events:", error);
    }
  };

  const fetchGameSlugs = async () => {
    try {
      const response = await axios.get('http://localhost:5000/game_slugs');
      setGameSlugs(response.data);
    } catch (error) {
      console.error("There was an error fetching the game slugs:", error);
    }
  };

  const fetchParticipantTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/participant_types');
      setParticipantTypes(response.data);
    } catch (error) {
      console.error("There was an error fetching the participant types:", error);
    }
  };

  const fetchValueUnitCategories = async () => {
    try {
      const response = await axios.get('http://localhost:5000/value_unit_categories');
      setValueUnitCategories(response.data);
    } catch (error) {
      console.error("There was an error fetching the value unit categories:", error);
    }
  };

  const fetchValueTypes = async () => {
    try {
      const response = await axios.get('http://localhost:5000/value_types');
      setValueTypes(response.data);
    } catch (error) {
      console.error("There was an error fetching the value types:", error);
    }
  };

  const fetchTopTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/top_teams');
      setTopTeams(response.data);
    } catch (error) {
      console.error("There was an error fetching the top teams:", error);
    }
  };

  const fetchMedalsByCountry = async () => {
    try {
      const response = await axios.get('http://localhost:5000/medals_by_country', {
        params: { country }
      });
      setMedalsByCountry(response.data);
    } catch (error) {
      console.error("There was an error fetching the medals by country:", error);
    }
  };

  const fetchMedalsByTeamYear = async () => {
    try {
      const response = await axios.get('http://localhost:5000/medals_by_team_year', {
        params: { team, year }
      });
      if (response.data.length === 0) {
        setTeamYearMessage('Dommage, l\'équipe n\'était pas qualifiée');
        setMedalsByTeamYear([]);
      } else {
        setMedalsByTeamYear(response.data);
        setTeamYearMessage('');
      }
    } catch (error) {
      console.error("There was an error fetching the medals by team and year:", error);
    }
  };

  const fetchPrediction = async () => {
    try {
      if (
        !year || !discipline || !event || !gameSlug || !participantType || !team ||
        !valueUnitCategory || !valueType
      ) {
        alert('Please fill all the fields before making a prediction');
        return;
      }
      
      const features = [
        {
          game_year: parseInt(year),
          discipline_title: discipline,
          event_title: event,
          game_slug: gameSlug,
          participant_type: participantType,
          country_name: team,
          value_unit_category: valueUnitCategory,
          value_type: valueType
        }
      ];

      const response = predictionModel === 'random_forest'
        ? await axios.post('http://localhost:5000/predict', { features })
        : await axios.post('http://localhost:5000/predict_keras', { features });
      
      setPrediction(response.data.prediction[0]);
    } catch (error) {
      console.error("There was an error fetching the prediction:", error);
    }
  };

  const resetCountrySearch = () => {
    setCountry('');
    setMedalsByCountry([]);
  };

  const resetTeamYearSearch = () => {
    setTeam('');
    setYear('');
    setDiscipline('');
    setEvent('');
    setGameSlug('');
    setParticipantType('');
    setValueUnitCategory('');
    setValueType('');
    setMedalsByTeamYear([]);
    setTeamYearMessage('');
    setPrediction('');
  };

  const topTeamsData = {
    labels: topTeams.map(team => team.participant_title),
    datasets: [
      {
        label: 'Total Medals',
        data: topTeams.map(team => team.total_medals),
        backgroundColor: 'rgba(75, 192, 192, 0.6)',
        borderColor: 'rgba(75, 192, 192, 1)',
        borderWidth: 1
      }
    ]
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Olympic Medals Dashboard</h1>
        <div className="search-container">
          <div className="search-by-country">
            <h2>Search Medals by Country</h2>
            <select value={country} onChange={handleCountryChange}>
              <option value="">Select a country</option>
              {countries.map((country, index) => (
                <option key={index} value={country}>{country}</option>
              ))}
            </select>
            <button onClick={fetchMedalsByCountry}>Search</button>
            <button onClick={resetCountrySearch}>Reset</button>
            {medalsByCountry.length > 0 && (
              <div className="medals-container">
                <table>
                  <thead>
                    <tr>
                      <th>Game</th>
                      <th>Gold</th>
                      <th>Silver</th>
                      <th>Bronze</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medalsByCountry.map((medal, index) => (
                      <tr key={index}>
                        <td>{medal.slug_game}</td>
                        <td>{medal.GOLD || 0}</td>
                        <td>{medal.SILVER || 0}</td>
                        <td>{medal.BRONZE || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
          <div className="search-by-team">
            <h2>Search Medals by Team and Year</h2>
            <select value={team} onChange={handleTeamChange}>
              <option value="">Select a team</option>
              {teams.map((team, index) => (
                <option key={index} value={team}>{team}</option>
              ))}
            </select>
            <select value={year} onChange={handleYearChange}>
              <option value="">Select a year</option>
              {years.map((year, index) => (
                <option key={index} value={year}>{year}</option>
              ))}
            </select>
            <button onClick={fetchMedalsByTeamYear}>Search</button>
            <button onClick={resetTeamYearSearch}>Reset</button>
            {teamYearMessage && <p>{teamYearMessage}</p>}
            {medalsByTeamYear.length > 0 && (
              <div className="medals-container">
                <table>
                  <thead>
                    <tr>
                      <th>Event</th>
                      <th>Gold</th>
                      <th>Silver</th>
                      <th>Bronze</th>
                    </tr>
                  </thead>
                  <tbody>
                    {medalsByTeamYear.map((medal, index) => (
                      <tr key={index}>
                        <td>{medal.event_title}</td>
                        <td>{medal.GOLD || 0}</td>
                        <td>{medal.SILVER || 0}</td>
                        <td>{medal.BRONZE || 0}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            <h2>Make a Prediction</h2>
            <select value={discipline} onChange={handleDisciplineChange}>
              <option value="">Select a discipline</option>
              {disciplines.map((discipline, index) => (
                <option key={index} value={discipline}>{discipline}</option>
              ))}
            </select>
            <select value={event} onChange={handleEventChange}>
              <option value="">Select an event</option>
              {events.map((event, index) => (
                <option key={index} value={event}>{event}</option>
              ))}
            </select>
            <select value={gameSlug} onChange={handleGameSlugChange}>
              <option value="">Select a game slug</option>
              {gameSlugs.map((gameSlug, index) => (
                <option key={index} value={gameSlug}>{gameSlug}</option>
              ))}
            </select>
            <select value={participantType} onChange={handleParticipantTypeChange}>
              <option value="">Select a participant type</option>
              {participantTypes.map((participantType, index) => (
                <option key={index} value={participantType}>{participantType}</option>
              ))}
            </select>
            <select value={valueUnitCategory} onChange={handleValueUnitCategoryChange}>
              <option value="">Select a value unit category</option>
              {valueUnitCategories.map((valueUnitCategory, index) => (
                <option key={index} value={valueUnitCategory}>{valueUnitCategory}</option>
              ))}
            </select>
            <select value={valueType} onChange={handleValueTypeChange}>
              <option value="">Select a value type</option>
              {valueTypes.map((valueType, index) => (
                <option key={index} value={valueType}>{valueType}</option>
              ))}
            </select>
            <select value={predictionModel} onChange={handlePredictionModelChange}>
              <option value="random_forest">Random Forest</option>
              <option value="keras">Keras/TensorFlow</option>
            </select>
            <button onClick={fetchPrediction}>Predict</button>
            {prediction && <p>Prediction: {prediction}</p>}
          </div>
        </div>
        <div className="top-teams-container">
          <h2>Top 10 Teams with Most Medals</h2>
          <Bar data={topTeamsData} />
        </div>
      </header>
    </div>
  );
}

export default App;
