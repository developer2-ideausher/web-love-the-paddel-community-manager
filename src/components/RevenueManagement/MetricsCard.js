import React, { useEffect, useState } from "react";

const MetricsCard = ({ data }) => {
    const metricsData = [
        {
            title: "Total Revenue",
            value: data?.totalRevenue ,
          

        },
        {
            title: "Revenue by Club Managers",
            value: data?.revenueByClubManagers ,

        },
        {
            title: "Revenue by Users",
            value: data?.revenueByUsers,


        },
        
    ];
    return (
        <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 my-10">
            {
                metricsData.map((metric, index) => (
                    <div
                        key={index}
                        className="bg-[#4C5F7D] p-4 rounded-lg shadow-lg flex flex-col justify-between"
                    >
                        <h3 className="text-base font-semibold text-white">{metric.title}</h3>
                        <h2 className="text-xl text-white font-semibold pt-1">{metric.value}</h2>
                    </div>
                ))
            }
        </div>
    );
};

export default MetricsCard;
