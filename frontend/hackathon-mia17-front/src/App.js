import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import 'chart.js/auto';
import Prediction from './Prediction';  // Importez le composant de prédiction
import './App.css'; // Importez le fichier CSS

function App() {
  const [country, setCountry] = useState('');
  const [team, setTeam] = useState('');
  const [year, setYear] = useState('');
  const [medalsByCountry, setMedalsByCountry] = useState([]);
  const [medalsByTeamYear, setMedalsByTeamYear] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    fetchTopTeams();
    fetchCountries();
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

  const fetchCountries = async () => {
    try {
      const response = await axios.get('http://localhost:5000/countries');
      setCountries(response.data);
    } catch (error) {
      console.error("There was an error fetching the countries:", error);
    }
  };

  const fetchMedalsByCountry = async () => {
    try {
      const response = await axios.get('http://localhost:5000/medals_by_country', {
        params: { country }
      });
      console.log('Medals by country:', response.data);
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
      console.log('Medals by team and year:', response.data);
      setMedalsByTeamYear(response.data);
    } catch (error) {
      console.error("There was an error fetching the medals by team and year:", error);
    }
  };

  const fetchTopTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/top_teams');
      console.log('Top teams data received:', response.data);
      setTopTeams(response.data);
    } catch (error) {
      console.error("There was an error fetching the top teams:", error);
    }
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

  console.log('Top teams data for chart:', topTeamsData);

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
            <input type="text" value={team} onChange={handleTeamChange} placeholder="Team name" />
            <input type="text" value={year} onChange={handleYearChange} placeholder="Year" />
            <button onClick={fetchMedalsByTeamYear}>Search</button>
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
          </div>
        </div>

        <div className="top-teams-container">
          <h2>Top 10 Teams with Most Medals</h2>
          <Bar data={topTeamsData} />
        </div>
      </header>

      <Prediction />  {/* Ajoutez le composant de prédiction */}
    </div>
  );
}

export default App;
