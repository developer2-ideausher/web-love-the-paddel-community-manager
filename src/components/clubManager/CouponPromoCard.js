import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";

const PromoCard = ({ data }) => {
const router = useRouter()
  const metricsData = [
        {
            title: "Coupons redeemed",
            value: data?.couponsRedeemed ?? "N/A",
            image: "/icons/coupon-redemeed.svg"
        },
        {
            title: "%age booking with coupons",
            value: data?.percentOfBookingsWithCoupons != null
                ? data.percentOfBookingsWithCoupons + "%"
                : "N/A",
            image: "/icons/calendar-check-out-01.svg"
        },
    ];
    return (
        <>
            <div className="grid grid-cols-2 xl:grid-cols-3 gap-6 my-10">
                {
                    metricsData.map((metric, index) => (
                        <div
                            key={index}
                            className="bg-white p-4 rounded-lg shadow-lg flex flex-col justify-between"
                        >
                            <div className="flex  align-center gap-3">
                                <div className="bg-[#E7FADA] rounded-2xl p-4">
                                    <img src={metric.image} alt="" />
                                </div>
                                <div>
                                    <h3 className="text-base font-normal text-neutral1">{metric.title}</h3>
                                    <h2 className="text-2xl text-[#374355] font-medium pt-1">{metric.value}</h2>
                                </div>
                            </div>

                        </div>
                    ))
                }
            </div>
        </>
    );
};

export default PromoCard;
