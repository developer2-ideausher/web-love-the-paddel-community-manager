"use client";
import React, { useEffect, useRef, useState } from "react";
import Input from "@/components/Input";
import Link from "../Link";
import { DatePicker, TimePicker } from "rsuite";

import Button from "../Button";
import { useRouter } from "next/router";
import Loader from "../ui/Loader";
import { toast } from "react-toastify";
import { createAmenity } from "@/services/amenetiesServices";
import DynamicDropdown from "../DynamicDropdown";
import { createCoupon } from "@/services/clubServices";
import { editCoupons, getCouponById } from "@/services/discountServices";
const EditPromocode = () => {
    const router = useRouter();
    const { query, isReady } = router;
    const couponId = query?.id;
    const [title, setTitle] = useState("");
    const [couponCode, setCouponCode] = useState("");
    const [couponTitle, setCouponTitle] = useState("");
    const [couponType, setCouponType] = useState("percentage");
    const [discountAmount, setDiscountAmount] = useState("");
    const [couponDescription, setCouponDescription] = useState("");
    const [minBookingAmount, setMinBookingAmount] = useState("");
    const [usageLimit, setUsageLimit] = useState("");
    const [expirationDate, setExpirationDate] = useState(null);
    const [activeStatus, setActiveStatus] = useState(true);
    const [scheduleDate, setScheduleDate] = useState(null);
    const [scheduleTime, setScheduleTime] = useState(null);
    const scheduleDateRef = useRef(null);
    const scheduleTimeRef = useRef(null);
    const [loading, setLoading] = useState(false);

    const recipentData = [
        { title: "AED", value: "fixed" },
        { title: "%", value: "percentage" },
    ];
    useEffect(() => {
        if (!isReady || !couponId) return;

        const fetchCoupon = async () => {
            setLoading(true);
            try {
                const res = await getCouponById(couponId);
                if (res?.status) {
                    const data = res.data;
                    setCouponCode(data.couponCode || "");
                    setCouponTitle(data.couponTitle || "");
                    setCouponType(data.couponType || "percentage");
                    setDiscountAmount(data.discountAmount || "");
                    setCouponDescription(data.couponDescription || "");
                    setMinBookingAmount(data.minBookingAmount || "");
                    setUsageLimit(data.usageLimit || "");
                    setExpirationDate(data.expirationDate ? new Date(data.expirationDate) : null);
                    setActiveStatus(data.activeStatus);
                    setScheduleDate(data.scheduledDateTime ? new Date(data.scheduledDateTime) : null);
                    setScheduleTime(data.scheduledDateTime ? new Date(data.scheduledDateTime) : null);
                } else {
                    toast.error("Failed to load coupon");
                }
            } catch (err) {
                console.error("Error fetching coupon", err);
                toast.error("Error fetching coupon");
            } finally {
                setLoading(false);
            }
        };

        fetchCoupon();
    }, [couponId, isReady]);

    const handleSubmit = async () => {
        if (!couponCode || !couponTitle || !couponType || !discountAmount || !expirationDate) {
            toast.error("Please fill all required fields");
            return;
        }

        const formatDateTime = (date, time) => {
            if (!date) return null;
            const dt = new Date(date);
            if (time) {
                dt.setHours(time.getHours());
                dt.setMinutes(time.getMinutes());
            }
            return dt.toISOString();
        };

        const payload = {
            couponCode: couponCode.toUpperCase(),
            couponTitle,
            couponType,
            discountAmount: Number(discountAmount),
            couponDescription,
            minBookingAmount: Number(minBookingAmount),
            usageLimit: Number(usageLimit),
            expirationDate: expirationDate?.toISOString(),
            activeStatus,
            scheduledDateTime: formatDateTime(scheduleDate, scheduleTime)
        };

        setLoading(true);
        try {
            const response = await editCoupons(couponId, payload);

            if (response?.status) {
                router.push("/discount-management");
            } else {
                toast.error(response?.message || "Failed to update  coupon");
            }
        } catch (error) {
            console.error("update coupon error:", error);
            toast.error("An error occurred while updating the coupon.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Loader loading={loading} />
            <div className="  px-6 rounded-lg">
                <div className="mt-4  mb-6">
                    <h2 className="text-black-3 text-sm font-normal cursor-pointer">
                        <Link href="/amenities-management" className="text-black-3 hover:text-black-3 ">Discount Management </Link>
                        <span className="text-black-3 text-sm font-medium">
                            &gt; Add Promo Code{" "}
                        </span>

                    </h2>
                </div>

                <div className=" w-[500px] bg-white p-6 rounded-2xl">
                    <div className="mb-6 ">
                        <label className="block text-black-3 text-sm  font-medium mb-2">Promo Code 
                        {/* <span className="text-grey-7">(All letter should be capital)</span> */}
                             </label>

                        <Input
                            type="text"
                            value={couponCode}
                            onChange={(e) => setCouponCode(e.target.value)}
                            placeholder="Enter Promo Code"
                            className=" outline-none  placeholder-[#5D5D5D] placeholder:text-sm bg-gray-6  bg-grey-6 flex items-center  rounded-lg  px-4 py-2"
                        />



                    </div>
                    <div className="mb-6">
                        <label className="block text-black-3 text-sm  font-medium mb-2">Promo Title</label>


                        <Input
                            type="text"
                            placeholder="Enter here"
                            value={couponTitle}
                            onChange={(e) => setCouponTitle(e.target.value)}
                            className=" outline-none  placeholder-[#5D5D5D] placeholder:text-sm bg-gray-6  bg-grey-6 flex items-center  rounded-lg  px-4 py-2"
                        />
                    </div>

                    <div className="mb-6">
                        <label className="block text-black-3 text-sm  font-medium mb-2">
                            Discount Code Type
                        </label>
                        <DynamicDropdown
                            data={recipentData}
                            placeholder="Select type"
                            value={recipentData.find((item) => item.value === couponType)}
                            callback={(item) => setCouponType(item.value)}
                        />



                    </div>

                    <div className="mb-6">
                        <label className="block text-black-3 text-sm  font-medium mb-2">
                            Discount Amount
                        </label>
                        <Input
                            type="text"
                            placeholder="Enter here"
                            value={discountAmount}
                            onChange={(e) => setDiscountAmount(e.target.value)}
                            className=" outline-none  placeholder-[#5D5D5D] placeholder:text-sm  bg-grey-6 flex items-center  rounded-lg  px-4 py-2"
                        />

                    </div>
                    <div className="mb-4">
                        <label className="block text-black-3 text-sm  font-medium mb-2">Description</label>
                        <div className=" items-center   bg-grey-6 flex   rounded-lg  px-4 py-2">


                            <textarea
                                placeholder="Enter here"
                                value={couponDescription}

                                onChange={(e) => setCouponDescription(e.target.value)}
                                rows="3"
                                maxLength={400}
                                className=" w-full outline-none  placeholder-[#5D5D5D] placeholder:text-sm   bg-grey-6 flex items-center  rounded-lg py-2"
                            />

                        </div>
                    </div>

                    <div className="mb-6">
                        <label className="block text-black-3 text-sm  font-medium mb-2">
                            Minimum Booking Amount
                        </label>
                        <Input
                            type="number"
                            placeholder="Enter here"
                            value={minBookingAmount}
                            onChange={(e) => setMinBookingAmount(e.target.value)}
                            className=" outline-none  placeholder-[#5D5D5D] placeholder:text-sm bg-gray-6  bg-grey-6 flex items-center  rounded-lg  px-4 py-2"
                        />

                    </div>

                    <div className="mb-6">
                        <label className="block text-black-3 text-sm  font-medium mb-2">
                            Usage Limit <span className="text-grey-7">(Number of times promo codes can be used by user)</span>
                        </label>
                        <Input
                            type="number"
                            placeholder="Enter here"
                            value={usageLimit}
                            onChange={(e) => setUsageLimit(e.target.value)}
                            className=" outline-none  placeholder-[#5D5D5D] placeholder:text-sm bg-gray-6  bg-grey-6 flex items-center  rounded-lg  px-4 py-2"
                        />

                    </div>

                    <div className="mb-6">
                        <label className="block text-black-3 text-sm  font-medium mb-2">
                            Expiry Date
                        </label>
                        {/* Date Picker */}
                        <div className="relative border rounded-md flex-1 w-full">
                            <DatePicker
                                ref={scheduleDateRef}
                                format="yyyy-MM-dd"
                                oneTap
                                placeholder="Select Date"
                                value={expirationDate}
                                onChange={setExpirationDate}
                                appearance="subtle"
                                shouldDisableDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
                                className="w-[100%] outline-none placeholder-[#5D5D5D] placeholder:text-sm"
                            />
                        </div>

                    </div>
                    <div className="mb-6">
                        <label className="block text-black-3 text-sm font-medium mb-2">
                            Status <span className="text-red-500">*</span>
                        </label>

                        <div className="flex items-center justify-between bg-[#f6f8f7] rounded-lg px-4 py-3">
                            <span className="text-gray-500 text-sm">
                                {activeStatus ? "On" : "Off"}
                            </span>

                            <button
                                onClick={() => setActiveStatus((prev) => !prev)}
                                className={`relative inline-flex items-center h-6 w-11 rounded-full transition-colors focus:outline-none ${activeStatus ? "bg-teal-400" : "bg-gray-300"
                                    }`}
                            >
                                <span
                                    className={`inline-block w-4 h-4 transform bg-white rounded-full transition-transform ${activeStatus ? "translate-x-5" : "translate-x-1"
                                        }`}
                                />
                            </button>
                        </div>
                    </div>

                    <div className="mb-4">
                        <label className="block text-black-3 text-sm  font-medium mb-2">Schedule Date & Time</label>
                        <div className="flex space-x-4">
                            {/* Date Picker */}
                            <div className="relative  rounded-md flex-1">
                                <DatePicker
                                    ref={scheduleDateRef}
                                    format="yyyy-MM-dd"
                                    oneTap
                                    placeholder="Select Date"
                                    value={scheduleDate}
                                    onChange={setScheduleDate}
                                    appearance="subtle"
                                    shouldDisableDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}

                                />
                            </div>

                            <div className="relative  rounded-md flex-1">
                                <TimePicker
                                    ref={scheduleTimeRef}
                                    format="hh:mm aa"
                                    showMeridiem
                                    oneTap={false}
                                    placeholder="Select Time"
                                    value={scheduleTime}
                                    onChange={(time) => setScheduleTime(time)}
                                    block
                                    cleanable
                                    className="w-full outline-none placeholder-[#5D5D5D] placeholder:text-sm"
                                />

                            </div>


                        </div>

                    </div>



                </div>

            </div>

            <div className="mt-7" >
                <Button onClick={handleSubmit} className="w-40"> Save</Button>

            </div>


        </>
    );
};

export default EditPromocode;
