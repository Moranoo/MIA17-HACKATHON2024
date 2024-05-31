import React from 'react';
import SearchByCountry from './components/SearchByCountry';
import SearchByTeamAndYear from './components/SearchByTeamAndYear';
import PredictionForm from './components/PredictionForm';
import './App.css';

const App = () => {
  return (
    <div>
      <h1>Olympic Medals Search</h1>
      <div className="container">
        <SearchByCountry />
      </div>
      <div className="container">
        <SearchByTeamAndYear />
      </div>
      <div className="container">
        <PredictionForm />
      </div>
    </div>
  );
};

export default App;
