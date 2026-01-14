// components/AgeGroupBarChart.js

import React from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Tooltip,
  Legend,
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, BarElement, Tooltip, Legend);

const AgeGroupBarChart = ({ageData}) => {
  const data = {
    labels: [
      '18-24 years',
      '25-34 years',
      '35-44 years',
      '45-54 years',
      '55-64 years',
      '>64 years',
    ],
    datasets: [
      {
        label: 'Percentage',
        data: [ageData?.UserGroupOne, ageData?.UserGroupTwo, ageData?.UserGroupThree, ageData?.UserGroupFour, ageData?.UserGroupFive, ageData?.UserGroupSix],
        backgroundColor: '#cc1728',
        borderRadius: 10, 
        barThickness: 30, 
      },
    ],
  };

  const options = {
    indexAxis: 'y', // Horizontal bar chart
    responsive: true,
    maintainAspectRatio: false, // Allows controlling height
    scales: {
      x: {
        ticks: {
          callback: function (value) {
            return `${value} %`;
          },
        },
        grid: {
          display: false, // Hide vertical gridlines
        },
      },
      y: {
        grid: {
          display: false, // Hide horizontal gridlines
        },
        categoryPercentage: 0.9, // More space between categories
        barPercentage: 0.9, // Bar width within category
      },
    },
    plugins: {
      legend: {
        display: false, // Disable the legend
      },
      tooltip: {
        callbacks: {
          label: (context) => `${context.raw} %`,
        },
      },
    },
  };

  return (
    <div className="w-full max-w-lg h-[280px] flex items-center justify-center "> 
      {/* Increase height of the container using Tailwind (e.g., 400px) */}
      <Bar data={data} options={options} />
    </div>
  );
};

export default AgeGroupBarChart;
