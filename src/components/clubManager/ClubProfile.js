import { formatDate } from "@/Utilities/helpers";
import React from "react";

export default function ClubProfile({ data }) {
    const userdetails = data;

    function calculatePlanEndDate(startDateString, validityInDays) {
        if (!startDateString || !validityInDays) return "N/A";

        const startDate = new Date(startDateString);
        if (isNaN(startDate)) return "N/A";

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + validityInDays);

        const day = String(endDate.getDate()).padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[endDate.getMonth()];
        const year = endDate.getFullYear();

        return `${day}-${month}-${year}`;
    }

    return (
        <>
            <div >
                <div className="p-4 border rounded-lg pt-7 mb-4 bg-white">
                    {/* User Image */}
                    <img
                        src={
                            userdetails?.profilePic?.url ? userdetails?.profilePic?.url : "/images/dummyUser.png"
                        }
                        alt={userdetails?.name}
                        className="w-32 h-32 rounded-full mx-auto "
                    />

                    {/* User Name */}
                    <h2 className="font-semibold text-black-4 text-center pt-4 text-xl ">
                        {userdetails?.clubName ? userdetails?.clubName : "N/A"}
                    </h2>


                    {/* User Details */}
                    <div className="space-y-6 mt-7">
                        <div className="flex flex-col">
                            <div className="flex flex-col">
                                <p className="text-sm font-normal text-grey-1 leading-5">
                                    Address
                                </p>

                                <p className="text-sm font-medium text-black-1 leading-6 pt-1">
                                    {userdetails?.location
                                        ? `${userdetails.location.streetAddress || ""}, ${userdetails.location.city || ""}, ${userdetails.location.state || ""}, ${userdetails.location.country || ""}`
                                        : "N/A"}
                                </p>
                            </div>

                        </div>
                        {/* Contact Number */}
                        <div className="flex flex-col">
                            <p className="text-sm font-normal text-grey-1  leading-5">
                                Phone Number
                            </p>

                            <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
                                {userdetails?.phone || "N/A"}

                            </p>
                        </div>


                        {/* Email ID */}
                        <div className="flex flex-col">
                            <p className="text-sm font-normal text-grey-1  leading-5">
                                Email Address
                            </p>
                            <p className="text-sm font-medium text-black-1 leading-6 pt-1 break-all">
                                {userdetails?.email || "N/A"}

                            </p>
                        </div>
                    </div>
                </div>
                <div className="p-4 border rounded-lg pt-7 mb-4 bg-white">    <p className="text-lg font-[#0A0D12]  font-semibold mb-6">
                    Amenities
                </p>
                    <div className="flex flex-wrap gap-2">
                        {userdetails?.amenities?.map((item) => (
                            <div
                                key={item?._id}
                                className="shrink-0 inline-flex text-sm font-normal text-white leading-6 px-4 py-2 bg-[#4C5F7D] border border-[#4C5F7D] rounded-3xl"
                            >
                                {item?.amenityName}
                            </div>
                        ))}
                    </div>



                </div>
                {/* Age */}
                <div className="p-4 border rounded-lg pt-7 mb-4 bg-white">
                    <p className="text-lg font-[#0A0D12] mb-5  font-semibold">
                        Subscription Plan Details
                    </p>
                    <div className="flex flex-col">
                        <p className="text-sm font-normal text-grey-1  leading-5  mt-4">
                            Plan Type
                        </p>
                        <p className="text-sm font-medium text-black4 leading-6 pt-1  ">
                            {userdetails?.plan?.planName || "N/A"}
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-normal text-grey-1  leading-5  mt-4">
                            Start Date
                        </p>
                        <p className="text-sm font-medium text-black4 leading-6 pt-1  ">
                            {formatDate(userdetails?.planStartDate) || "N/A"}
                        </p>
                    </div>

                    <div className="flex flex-col">
                        <p className="text-sm font-normal text-grey-1 leading-5 mt-4">
                            End Date
                        </p>
                        <p className="text-sm font-medium text-black4 leading-6 pt-1">
                            <p className="text-sm font-medium text-black4 leading-6 pt-1">
                                {calculatePlanEndDate(userdetails?.planStartDate, userdetails?.plan?.validityInDays)}
                            </p>

                        </p>
                    </div>

                </div>


            </div>

        </>
    );
}
