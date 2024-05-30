import React, { useEffect, useState } from 'react';

const TopAthletes = () => {
    const [athletes, setAthletes] = useState([]);

    useEffect(() => {
        fetch('/api/top_athletes')
            .then(response => response.json())
            .then(data => setAthletes(data))
            .catch(error => console.error('Error fetching data:', error));
    }, []);

    return (
        <div>
            <h2>Top 10 Athletes by Total Medals</h2>
            <ul>
                {athletes.map((athlete, index) => (
                    <li key={index}>
                        {athlete.athlete_full_name} - {athlete.total_medals} Medals
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default TopAthletes;
