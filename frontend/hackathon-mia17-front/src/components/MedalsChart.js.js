import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';

const MedalsChart = ({ apiUrl }) => {
    const [chartData, setChartData] = useState(null);

    useEffect(() => {
        fetch(`http://localhost:5000${apiUrl}`)
            .then(response => response.json())
            .then(data => setChartData(JSON.parse(data)))
            .catch(error => console.error('Error fetching data:', error));
    }, [apiUrl]);

    return (
        <div>
            {chartData ? (
                <Plot data={chartData.data} layout={chartData.layout} />
            ) : (
                <p>Loading...</p>
            )}
        </div>
    );
};

export default MedalsChart;
