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
import { createSubscription, editSubscription, getPlanById } from "@/services/subscriptionServices";
const EditSubscription = () => {
    const router = useRouter();
    const { id } = router.query;
    const [title, setTitle] = useState("");
    const [answer, setAnswer] = useState("");
    const [fee, setFee] = useState("");
    const [recipientsTarget, setRecipientsTarget] = useState("");
    const [originalData, setOriginalData] = useState(null);

    const [loading, setLoading] = useState(false);
    const validityOptions = [
        { id: 1, title: "30 days" },
        { id: 2, title: "365 days" },
    ];
    const fetchPlanById = async () => {
        setLoading(true);
        try {
            const res = await getPlanById(id);
            if (res?.status) {
                setTitle(res?.data?.planName);
                setAnswer(res?.data?.description);
                setFee(res?.data?.priceAndCurrency?.price);
                setRecipientsTarget(res?.data?.validityInDays);

                setOriginalData({
                    planName: res?.data?.planName,
                    description: res?.data?.description,
                    price: res?.data?.priceAndCurrency?.price,
                    validityInDays: res?.data?.validityInDays,
                });
            }
        } catch (error) {
            console.error("Error fetching plan by ID:", error);
        } finally {
            setLoading(false);
        }
    };
    const handleSubmit = async () => {
        if (
            originalData &&
            title === originalData.planName &&
            answer === originalData.description &&
            fee === originalData.price &&
            recipientsTarget === originalData.validityInDays
        ) {
            toast.info("No changes made");
            router.push("/subscription-management");
            return;
        }

        const payload = {
            planName: title,
            description: answer,
            priceAndCurrency: { price: fee, currency: "AED" },
            validityInDays: recipientsTarget,
        };
        setLoading(true);
        try {
            const response = await editSubscription(id, payload);
            if (response?.status) {
                router.push("/subscription-management");
            } else {
                toast.error(response?.message);
            }
        } catch (error) {
            console.error("Error creating amenities:", error);
        } finally {
            setLoading(false);
        }
    };


    useEffect(() => {
        if (id) {
            fetchPlanById();
        }
    }, [id]);

    return (
        <>
            <Loader loading={loading} />
            <div className="  px-6 rounded-lg">
                <div className="mt-4  mb-6">
                    <h2 className="text-black-3 text-sm font-normal cursor-pointer">
                        <Link href="/subscription-management" className="text-black-3 hover:text-black-3 ">Subscription</Link>
                        <span className="text-black-3 text-sm font-medium">
                            &gt; Edit Subscription Plan{" "}
                        </span>

                    </h2>
                </div>

                <div className=" w-[500px] bg-white p-6 rounded-2xl">
                    <div className="mb-6 ">
                        <label className="block text-black-4 text-base  font-medium mb-3">Plan Title</label>

                        <Input
                            type="text"
                            placeholder="Enter title"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className=" outline-none  placeholder-[#5D5D5D] placeholder:text-sm bg-gray-6  bg-grey-6 flex items-center  rounded-lg  px-4 py-2 text-base font-medium"
                        />

                    </div>
                    <div className="mb-6">
                        <label className="block text-black-4 text-base  font-medium mb-3">Plan Description</label>

                        <textarea
                            placeholder="Enter description here"
                            rows="5"
                            className="w-full  text-black outline-none  placeholder-[#5D5D5D] placeholder:text-sm bg-gray-6  bg-grey-6 flex items-center  rounded-lg  px-4 py-2 text-base font-medium"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>

                    <div className="mb-6 ">
                        <label className="block text-black-4 text-base  font-medium mb-3">Subscription Fee</label>

                        <Input
                            type="number"
                            placeholder="Enter price"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            className=" outline-none  placeholder-[#5D5D5D] placeholder:text-sm bg-gray-6  bg-grey-6 flex items-center  rounded-lg  px-4 py-2 text-base font-medium"
                        />

                    </div>

                    <div className="mb-6">
                        <label className="block text-black-4 text-base  font-medium mb-3">
                            Validity Period
                        </label>
                        <DynamicDropdown
                            data={validityOptions}
                            placeholder="Select validity period"
                            value={validityOptions.find((item) => Number(item.title.replace(" days", "")) === recipientsTarget) || null}

                            callback={(item) => {
                                const onlyNumber = item.title.replace(" days", "");
                                setRecipientsTarget(Number(onlyNumber));
                            }}
                        />


                    </div>

                </div>

                <div className="mt-7" >
                    <Button onClick={handleSubmit} className="w-40"> Save</Button>

                </div>


            </div >

        </>
    );
};

export default EditSubscription;
