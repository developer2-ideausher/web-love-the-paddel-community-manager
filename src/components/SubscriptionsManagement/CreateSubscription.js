"use client";
import React, { useRef, useState } from "react";
import Input from "@/components/Input";
import Link from "../Link";
import Button from "../Button";
import { useRouter } from "next/router";
import Loader from "../ui/Loader";
import { toast } from "react-toastify";
import { createAmenity } from "@/services/amenetiesServices";
import DynamicDropdown from "../DynamicDropdown";
import { createSubscription } from "@/services/subscriptionServices";
const CreateSubscription = () => {
    const router = useRouter();
    const { id } = router.query;
    const [title, setTitle] = useState("");
    const [answer, setAnswer] = useState("");
    const [fee, setFee] = useState("");
    const [recipientsTarget, setRecipientsTarget] = useState(null);
    const [loading, setLoading] = useState(false);
    const typeData = [
        { id: 1, title: "30" },
        { id: 2, title: "365" },

    ];

    const handleSubmit = async () => {

        if (!title.trim || !answer || !fee || !recipientsTarget) {
            toast.error("Please fill all the required fields");
            return;
        }

        const payload = {
            planName: title,
            description: answer,
            priceAndCurrency: { "price": fee, "currency": "AED" },
            validityInDays: Number(recipientsTarget.title.replace(" days", "")),
        };
        setLoading(true);
        try {

            const response = await createSubscription(payload);
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
    }

    return (
        <>
            <Loader loading={loading} />
            <div className="  px-6 rounded-lg">
                <div className="mt-4  mb-6">
                    <h2 className="text-black-3 text-sm font-normal cursor-pointer">
                        <Link href="/subscription-management" className="text-black-3 hover:text-black-3 ">Subscription  </Link>
                        <span className="text-black-3 text-sm font-medium">
                            &gt; New Subscription Plan{" "}
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
                            className="w-full outline-none  placeholder-[#5D5D5D] placeholder:text-sm   bg-grey-6 flex items-center  rounded-lg  px-4 py-2 text-base font-medium"
                            value={answer}
                            onChange={(e) => setAnswer(e.target.value)}
                        />
                    </div>

                    <div className="mb-6 ">
                        <label className="block text-black-4 text-base  font-medium mb-3">Subscription Fee</label>

                        <Input
                            type="number"
                            placeholder="Enter price in AED"
                            value={fee}
                            onChange={(e) => setFee(e.target.value)}
                            onWheel={(e) => e.target.blur()} 
                            className="outline-none placeholder-[#5D5D5D] placeholder:text-sm bg-grey-6 flex items-center rounded-lg px-4 py-2 text-base font-medium"
                        />



                    </div>

                    <div className="mb-6">
                        <label className="block text-black-4 text-base  font-medium mb-3">
                            Validity Period
                        </label>
                        <DynamicDropdown
                            data={[
                                { id: 1, title: "30 days" },
                                { id: 2, title: "365 days" },
                            ]}
                            placeholder="Select validity period"
                            value={recipientsTarget}
                            callback={(item) => setRecipientsTarget(item)}
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

export default CreateSubscription;
