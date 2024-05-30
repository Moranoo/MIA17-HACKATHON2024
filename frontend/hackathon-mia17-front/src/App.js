import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Bar } from 'react-chartjs-2';
import './App.css';

function App() {
  const [country, setCountry] = useState('');
  const [team, setTeam] = useState('');
  const [year, setYear] = useState('');
  const [medalsByCountry, setMedalsByCountry] = useState([]);
  const [medalsByTeamYear, setMedalsByTeamYear] = useState([]);
  const [topTeams, setTopTeams] = useState([]);
  const [countries, setCountries] = useState([]);
  const [teams, setTeams] = useState([]);
  const [years, setYears] = useState([]);
  const [teamYearMessage, setTeamYearMessage] = useState('');

  useEffect(() => {
    fetchTopTeams();
    fetchCountries();
    fetchTeams();
    fetchYears();
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

  const fetchTopTeams = async () => {
    try {
      const response = await axios.get('http://localhost:5000/top_teams');
      setTopTeams(response.data);
    } catch (error) {
      console.error("There was an error fetching the top teams:", error);
    }
  };

  const resetCountrySearch = () => {
    setCountry('');
    setMedalsByCountry([]);
  };

  const resetTeamYearSearch = () => {
    setTeam('');
    setYear('');
    setMedalsByTeamYear([]);
    setTeamYearMessage('');
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
