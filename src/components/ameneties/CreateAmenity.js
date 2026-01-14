"use client";
import React, { useState } from "react";
import Input from "@/components/Input";
import Link from "../Link";

import Button from "../Button";
import { useRouter } from "next/router";
import Loader from "../ui/Loader";
import { toast } from "react-toastify";
import { createAmenity } from "@/services/amenetiesServices";
const CreateAmenity = () => {
    const router = useRouter();
    const [title, setTitle] = useState("");
    const [loading, setLoading] = useState(false);
    const { id } = router.query;
    const handleSubmit = async () => {

        if (!title.trim()) {
            toast.error("Title is required");
            return;
        }
        const payload = {
            amenityName: title
        };
        setLoading(true);
        try {

            const response = await createAmenity(payload);
            if (response?.status) {
                router.push("/amenities-management");
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
                        <Link href="/amenities-management" className="text-black-3 hover:text-black-3 ">Amenities Management </Link>
                        <span className="text-black-3 text-sm font-medium">
                            &gt; Add amenities{" "}
                        </span>

                    </h2>
                </div>

                <div className=" w-[500px] bg-white p-6 rounded-2xl">
                    <div className="mb-4 ">
                        <label className="block text-black-4 text-base  font-medium mb-3">Add Amenity</label>

                        <Input
                            type="text"
                            placeholder="Enter here"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className=" outline-none pl-1 placeholder-[#5D5D5D] placeholder:text-sm bg-gray-6  bg-grey-6 flex items-center  rounded-lg  px-4 py-2"
                        />



                    </div>

                    <div className="mt-7" >
                        <Button onClick={handleSubmit} className="w-40"> Save</Button>

                    </div>
                </div>


            </div>

        </>
    );
};

export default CreateAmenity;
