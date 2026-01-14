"use client";
import React, { useState, useRef } from "react";
import { DatePicker, TimePicker } from "rsuite";
import "rsuite/dist/rsuite.min.css";
import { Calendar, Clock } from "lucide-react";
import Input from "@/components/Input";
import Link from "../Link";
import { useRouter, useSearchParams } from "next/navigation";
import { createCoupon } from "@/services/clubServices";
import { toast } from "react-toastify";

const CreateCouponForm = () => {
  const router = useRouter()
  const searchParams = useSearchParams();
  const vendorId = searchParams.get("vendorId");
  const [validTill, setValidTill] = useState(null);
 
  const [title, setTitle] = useState("");
  const [numberOfCoupons, setNumberOfCoupons] = useState("");
  const [description, setDescription] = useState("");
  const [termsAndConditions, setTermsAndConditions] = useState("");
  const [scheduleTime, setScheduleTime] = useState(null);
  const [scheduleDate, setScheduleDate] = useState(null);

  // Refs to programmatically open pickers
  const validTillRef = useRef(null);
  const scheduleDateRef = useRef(null);
  const scheduleTimeRef = useRef(null);

  const formattedTime = scheduleTime
    ? scheduleTime.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
    : "Select Time";

  // Handle form submission
  const handleSubmit = async () => {
    if (!title || !validTill || !numberOfCoupons || !description || !termsAndConditions || !scheduleDate || !scheduleTime) {
      alert("Please fill in all fields before submitting.");
      return;
    }
    const scheduledDate = new Date(scheduleDate);
    const validTillDate = new Date(validTill);

    if (scheduledDate > validTillDate) {
      toast.error("Scheduled date cannot be after the valid till date!");
      return;
    }

    // Construct validFrom datetime by combining scheduleDate and scheduleTime
    const validFrom = new Date(scheduleDate);
    validFrom.setHours(scheduleTime.getHours(), scheduleTime.getMinutes());

    // Prepare the payload
    const payload = {
      forAudience: "User",
      validFrom: validFrom.toISOString(),
      title: title,
      validTill: new Date(validTill).toISOString(),
      description: description,
      type: "normal",
      vendor: vendorId,
      isCreatedByAdmin: true,
      terms: termsAndConditions
    };

    try {
      const response = await createCoupon(payload);
      if (response?.status) {

        router.push(`/club-manager-management/${vendorId}?tab=CouponsCreated`);
      } else {
        toast.error(response?.message || "Failed to create coupon");
      }
    } catch (error) {
      toast.error("Something went wrong. Please try again.");
      console.error("Coupon creation error:", error);
    }
  };
  return (
    <div className="max-w-lg  px-6 rounded-lg">
      <div className="mt-4  mb-6">
        <h2 className="text-black-3 text-sm font-normal cursor-pointer">
          <Link href="/club-manager-management" className={"text-black-3  text-sm font-medium hover:text-primary hover:underline"}>Vendors</Link> {" "}
          <span className="text-black-3 text-sm font-medium">
            &gt;  <Link href={`/club-manager-management/${vendorId}?tab=CouponsCreated`} className={"text-black-3  text-sm font-medium hover:text-primary hover:underline"}>
              Vendor details
            </Link>

          </span>
          <span className="text-black-3 text-sm font-medium">
            &gt; Create Coupon{" "}
          </span>
        </h2>
      </div>

      {/* Coupon Title */}
      <div className="mb-4">
        <label className="block text-black-3 text-sm  font-medium mb-2">Coupon Title</label>
        <div className="flex items-center border rounded-md bg-white px-4 py-2">
          <Input
            type="text"
            placeholder="Enter here"
            value={title}
            maxLength={50}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full outline-none pl-1 placeholder-[#5D5D5D] placeholder:text-sm"
          />
        </div>

      </div>

      {/* Valid Till */}
      <div className="mb-4">
        <label className="block text-black-3 text-sm font-medium mb-2">Valid Till</label>
        <div className="relative border rounded-md">
          <DatePicker
            ref={validTillRef}
            format="yyyy-MM-dd"
            oneTap
            placeholder="Select date"
            value={validTill}
            onChange={setValidTill}
            appearance="subtle"
            shouldDisableDate={(date) => date < new Date(new Date().setHours(0, 0, 0, 0))}
            // customStyles={{ dateInput: { borderWidth: 0 } }}
            className="w-full border-b-red-700 "
          />
          <div
            className="absolute top-2 right-3 py-2 text-gray-500 w-5 h-5 cursor-pointer"
            onClick={() => validTillRef.current.open()}
          >
            {/* <Calendar /> */}
          </div>
        </div>
      </div>

      {/* Number of Coupons */}
      <div className="mb-4">
        <label className="block text-black-3 text-sm  font-medium mb-2">Number of Coupons</label>
        <div className="flex items-center border  rounded-md bg-white px-4 py-2">
          <Input
            type="number"
            value={numberOfCoupons}
            onChange={(e) => setNumberOfCoupons(e.target.value)}
            placeholder="Enter maximum coupons a user can get."
            className="w-full focus:outline-none focus:ring-0 focus:border-transparent  pl-1 placeholder-[#5D5D5D] placeholder:text-sm"
          />
        </div>

      </div>

      {/* Description */}
      <div className="mb-4">
        <label className="block text-black-3 text-sm  font-medium mb-2">Description</label>
        <div className="flex items-center border  rounded-md bg-white px-4 py-2">


          <textarea
            placeholder="Enter here"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows="3"
            maxLength={400}

            className="w-full outline-none pl-1 placeholder-[#5D5D5D] placeholder:text-sm"
          />

        </div>
      </div>
      {/* Terms & Condition */}
      <div className="mb-4">
        <label className="block text-black-3 text-sm  font-medium mb-2">Terms & Condition</label>
        <div className="flex items-center border  rounded-md bg-white px-4 py-2">
          <textarea
            placeholder="Enter here"
            value={termsAndConditions}
            onChange={(e) => setTermsAndConditions(e.target.value)}
            rows="3"
            maxLength={200}

            className="w-full outline-none pl-1 placeholder-[#5D5D5D] placeholder:text-sm" />
        </div>
      </div>
      {/* Schedule Date & Time */}
      <div className="mb-4">
        <label className="block text-black-3 text-sm  font-medium mb-2">Schedule Date & Time</label>
        <div className="flex space-x-4">
          {/* Date Picker */}
          <div className="relative border rounded-md flex-1">
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

          <div className="relative border rounded-md flex-1">
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


      {/* Save Button */}
      <button className="radius-lg bg-red-500 text-white py-3 px-11 mt-6 rounded-md hover:bg-red-600 transition" onClick={handleSubmit}>
        Save
      </button>
    </div>
  );
};

export default CreateCouponForm;
