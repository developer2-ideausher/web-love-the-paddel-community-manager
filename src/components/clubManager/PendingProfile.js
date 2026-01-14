import React from "react";
import { formatDate } from "@/Utilities/helpers";

export default function PendingProfile({ data }) {
    const userdetails = data
    return (
         <>
        
                    <div className="p-4 border rounded-lg pt-7 bg-white">
                        {/* User Image */}
                        <img
                            src={
                                userdetails?.profilePic?.url ? userdetails?.profilePic?.url : "/images/dummyUser.png"
                            }
                            alt={userdetails?.name}
                            className="w-32 h-32 mx-auto "
                        />
        
                        {/* User Name */}
                        <h2 className="font-semibold text-black-4 text-center pt-4 text-xl ">
                            {userdetails?.name ? userdetails?.name : "N/A"}
                        </h2>
        
                        {/* User Plan */}
                        <div className="flex justify-center ">
        
                            <button
                                className={` cursor-pointer py-1 px-3 rounded-lg text-sm border-2 ${userdetails?.isBlocked
                                    ? "text-red-500 font-normal border-red-500"
                                    : "text-success font-normal border-success"
                                    }`}
                            //   onClick={() => openModal(userdetails._id, userdetails?.isBlocked)}
                            >
                                {userdetails?.isBlocked ? (
                                    "Suspended"
                                ) : (
                                    "Active"
                                )}
                            </button>
        
        
                        </div>
        
                        {/* Divider Line */}
                        {/* <div className="border-t mt-6 mb-7 w-full"></div> */}
        
                        {/* User Details */}
                        <div className="space-y-6 mt-7">
                            <div className="flex flex-col">
                                <p className="text-sm font-normal text-grey-1  leading-5">
                                    Business Id
                                </p>
        
                                <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
                                    {userdetails?._id || "N/A"}
                                </p>
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
        
                            <div className="flex flex-col">
                                <p className="text-sm font-normal text-grey-1  leading-5">
                                    Business Category
                                </p>
                                <p className="text-sm font-medium text-black-1 leading-6 pt-1 break-all">
                                    {userdetails?.businessCategories?.length > 0
                                        ? userdetails.businessCategories.map(catItem => catItem.name).join(", ")
                                        : "N/A"}
                                </p>
        
                            </div>
                            {/* Age */}
                            <div className="flex flex-col">
                                <p className="text-sm font-normal text-grey-1  leading-5">
                                    Registration Date
                                </p>
                                <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
                                    {formatDate(userdetails?.createdAt)}
        
                                </p>
                            </div>
        
                            <div className="flex flex-col">
                                <p className="text-sm font-normal text-grey-1  leading-5">
                                    Street Name / No.
                                </p>
                                <p className="text-sm font-medium text-black-1 leading-6 pt-1 break-all ">
                                 {userdetails?.manualAddress?.streetName}   
                                </p>
                            </div>
        
                            {/* Weight */}
                            <div className="flex flex-col">
                                <p className="text-sm font-normal text-grey-1  leading-5">
                                    City / Town
                                </p>
                                <p className="text-sm font-medium text-black-1 leading-6 pt-1 break-all ">
                                {userdetails?.manualAddress?.city}   
        
                                </p>
                            </div>
        
                            <div className="flex flex-col">
                                <p className="text-sm font-normal text-grey-1  leading-5">
                                    Post Code
                                </p>
                                <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
                                {userdetails?.manualAddress?.pinCode}   
        
                                </p>
                            </div>
                        </div>
                    </div>
        
                </>
    );
}
