import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,
    Legend,
} from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const DoughnutChart = ({ percentage }) => {

    const data = {
        labels: ['Male Customer', 'Female Customer', 'Other\'s'],
        datasets: [
            {
                label: 'Male Customer',
                data: percentage?.values, 
                backgroundColor: ['#CC1728', '#FBE8EA'],
                borderWidth: 0,
                cutout: '50%',
                radius: '90%',
            },
            {
                label: 'Female Customer',
                data: [percentage?.values
                [1], 100 - percentage?.values
                [1]], // 50% filled, 50% empty
                backgroundColor: ['#FF930F', '#FFF7CC'], // Yellow for filled, lighter yellow for empty
                borderWidth: 0,
                cutout: '60%', // Slightly smaller inner hole
                radius: '70%', // Slightly smaller ring
            },
            {
                label: 'Other\'s',
                data: [percentage?.values
                [2], 100 - percentage?.values
                [2]], // 10% filled, 90% empty
                backgroundColor: ['#F5B400', '#FFF7CC'],
                borderWidth: 0,
                cutout: '40%', // Smallest inner hole
                radius: '50%', // Smallest ring
            },
        ],
    };

    const options = {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
            legend: {
                display: false, // Custom legend will be made
            },
            tooltip: {
                callbacks: {
                    label: function (context) {
                        return `${context.label}: ${context.raw}%`;
                    },
                },
            },
        },
    };

    return (
        <div className='relative flex w-full h-full  justify-between items-start '>
            {/* Chart on the left */}
            <div className="w-1/2 h-[250px] flex justify-center">
                <Doughnut data={data} options={options} />
            </div>

            {/* Content on the right */}
            <div className="w-1/2 h-[300px] flex flex-col gap-5 mt-4  pl-6">
                <div className="flex items-center mb-2">
                    <span
                        style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#CC1728',
                            marginRight: '8px',
                            borderRadius: '100%'

                        }}
                    />
                    <div>
                        <p className='font-medium text-sm text-black-1'>Male Customer</p>
                        <p className='font-bold text-lg text-black-1'>{percentage?.values[0]} %</p>
                    </div>
                </div>
                <div className="flex items-center mb-2">
                    <span
                        style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#FF930F',
                            marginRight: '8px',
                            borderRadius: '100%'

                        }}
                    /> <div>
                        <p className='font-medium text-sm text-black-1'>Female Customer</p>
                        <p className='font-bold text-lg text-black-1'>{percentage?.values[1]} %</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <span
                        style={{
                            display: 'inline-block',
                            width: '12px',
                            height: '12px',
                            backgroundColor: '#F5B400',
                            marginRight: '8px',
                            borderRadius: '100%'
                        }}
                    /> 
                   <div>
                   <p className='font-medium text-sm text-black-1'>Other&apos;s</p>
                   <p className='font-bold text-lg text-black-1'>{percentage?.values[2]} %</p> 
                   </div>
                </div>
            </div>
        </div>

    );
};

export default DoughnutChart;
