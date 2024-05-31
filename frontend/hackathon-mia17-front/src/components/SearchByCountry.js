import React, { useState, useEffect } from 'react';
import axios from 'axios';

const SearchByCountry = () => {
  const [country, setCountry] = useState('');
  const [countries, setCountries] = useState([]);
  const [results, setResults] = useState([]);

  useEffect(() => {
    const fetchCountries = async () => {
      const response = await axios.get('http://localhost:5000/countries');
      setCountries(response.data);
    };
    fetchCountries();
  }, []);

  const handleSearch = async () => {
    const response = await axios.get(`http://localhost:5000/medals_by_country?country=${country}`);
    setResults(response.data);
  };

  return (
    <div>
      <h2>Search Medals by Country</h2>
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
        <option value="">Select a country</option>
        {countries.map((country, index) => (
          <option key={index} value={country}>{country}</option>
        ))}
      </select>
      <button onClick={handleSearch}>Search</button>
      <ul>
        {results.map(result => (
          <li key={result.country_name + result.game_year}>
            {result.game_year}: {result.total_medals} medals (Gold: {result.GOLD}, Silver: {result.SILVER}, Bronze: {result.BRONZE})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchByCountry;
