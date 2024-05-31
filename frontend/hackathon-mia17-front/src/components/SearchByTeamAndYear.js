import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchByTeamAndYear = () => {
  const [team, setTeam] = useState('');
  const [teams, setTeams] = useState([]);
  const [year, setYear] = useState('');
  const [results, setResults] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchTeams = async () => {
      const response = await axios.get('http://localhost:5000/teams');
      setTeams(response.data);
    };
    fetchTeams();
  }, []);

  const handleSearch = async () => {
    try {
      const response = await axios.get('http://localhost:5000/medals_by_team_and_year', {
        params: {
          team,
          year,
        },
      });
      if (response.data.length === 0) {
        setError('No results found');
      } else {
        setError(null);
      }
      setResults(response.data);
    } catch (error) {
      setError('Error fetching data');
    }
  };

  return (
    <div>
      <h2>Search Medals by Disciplines and Year</h2>
      <div>
        <label>Team:</label>
        <select value={team} onChange={(e) => setTeam(e.target.value)}>
          <option value="">Select a team</option>
          {teams.map((team, index) => (
            <option key={index} value={team}>{team}</option>
          ))}
        </select>
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
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      <ul>
        {results.map(result => (
          <li key={result._id}>
            {result.athlete_full_name} ({result.country_name}): {result.medal_type} in {result.discipline_title}, {result.event_title}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchByTeamAndYear;
