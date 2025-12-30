import React from 'react';
import { PieChart } from '@mui/x-charts'; // Make sure you have @mui/x-charts installed

function Doughnut({
    data = [],               // Pie chart data
    innerRadius = 50,        // Inner radius
    outerRadius = 100,       // Outer radius
    arcLabel = 'value',      // Label to display on arcs
    settings = {},           // Additional PieChart props (like colors, animations)
    width = 300,             // Chart width
    height = 300,            // Chart height
}) {
    return (
        <PieChart
            series={[{ innerRadius, outerRadius, data, arcLabel }]}
            width={width}
            height={height}
            {...settings} // Spread any additional customization
        />
    );
}

export default Doughnut;
