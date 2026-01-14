"use client";
import React, { useEffect, useState } from "react";
import Input from "@/components/Input";
import Link from "../Link";
import Button from "../Button";
import Loader from "../ui/Loader";
import { toast } from "react-toastify";
import { createAmenity } from "@/services/amenetiesServices";
import DynamicDropdown from "../DynamicDropdown";
import { editConflict, getConflictById } from "@/services/conflictServices";
import { useRouter } from "next/router";

const ConflictForm = () => {
    const router = useRouter();
    const id = router.query.id;
   const [showEmptyResponseModal, setShowEmptyResponseModal] = useState(false);

    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [responseText, setResponseText] = useState("");
    const [status, setStatus] = useState(null);

    const [loading, setLoading] = useState(false);

    const typeData = [
        { id: 1, title: "Pending", value: "pending" },
        { id: 2, title: "On-hold", value: "onhold" },
        { id: 3, title: "Resolved", value: "resolved" },
    ];

    const fetchConflictDetails = async () => {
        if (!id) return;
        setLoading(true);
        try {
            const res = await getConflictById(id);
            if (res?.status) {
                const conflict = res.data;
                setTitle(conflict.title || "");
                setDescription(conflict.description || "");
                const conflictStatus = typeData.find((item) => item.value === conflict.status);
                setStatus(conflictStatus || null);
                setResponseText(conflict.response || "");

            } else {
                toast.error(res?.message || "Failed to fetch conflict");
            }
        } catch (error) {
            console.error("Error fetching conflict:", error);
            toast.error("Something went wrong while fetching details");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (router.isReady && id) {
            fetchConflictDetails();
        }
    }, [router.isReady, id]);

    const proceedToSubmit = async () => {
    const payload = {
        title,
        description,
        response: responseText,
        status: status?.value || "",
    };

    setLoading(true);
    try {
        const response = await editConflict(id, payload);
        if (response?.status) {
            router.push("/conflict-management");
        } else {
            toast.error(response?.message);
        }
    } catch (error) {
        console.error("Error saving:", error);
    } finally {
        setLoading(false);
    }
};

 const handleSubmit = async () => {
    if (!status) {
        toast.error("Status is required");
        return;
    }

    if (status.value === "resolved" && !responseText.trim()) {
        setShowEmptyResponseModal(true); // show confirmation modal
        return;
    }

    await proceedToSubmit(); // Submit directly if not empty or not resolved
};

    return (
        <>
            <Loader loading={loading} />
            <div className="px-6 rounded-lg">
                <div className="mt-4 mb-6">
                    <h2 className="text-black-3 text-sm font-normal cursor-pointer">
                        <Link href="/conflict-management" className="text-black-3 hover:text-black-3">
                            Conflict Management
                        </Link>
                        <span className="text-black-3 text-sm font-medium"> &gt; {id}</span>
                    </h2>
                </div>

                <div className="w-[500px] bg-white p-6 rounded-2xl">
                    {/* Title */}
                    <div className="mb-6">
                        <label className="block text-black4 text-base font-medium mb-3">Title of the issue</label>
                        <Input
                            type="text"
                            placeholder="Enter title"
                            readOnly 
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            className="outline-none bg-grey-6 rounded-lg px-4 py-2 placeholder-[#5D5D5D] placeholder:text-sm text-[#5e5c5c]"
                        />

                    </div>

                    {/* Description */}
                    <div className="mb-6">
                        <label className="block text-black4 text-base font-medium mb-3">Issue Description</label>
                        <textarea
                            placeholder="Enter description"
                            rows="5"
                            readOnly
                            className="w-full outline-none bg-grey-6 rounded-lg px-4 py-2 placeholder-[#5D5D5D] placeholder:text-sm text-base text-[#5e5c5c]"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                        />
                    </div>

                    {/* Response */}
                    <div className="mb-6">
                        <label className="block text-black4 text-base font-medium mb-3">Type your response</label>
                        <textarea
                            placeholder="Enter Response"
                            rows="5"
                            className="w-full outline-none bg-grey-6 rounded-lg px-4 py-2 text-base text-black placeholder-[#5D5D5D] placeholder:text-sm"
                            value={responseText}
                            onChange={(e) => setResponseText(e.target.value)}
                        />
                    </div>

                    {/* Status Dropdown */}
                    <div className="mb-6">
                        <label className="block text-black4 text-base font-medium mb-3">Mark status as *</label>
                        <DynamicDropdown
                            data={typeData}
                            placeholder="Select status"
                            value={status}
                            callback={(item) => setStatus(item)}
                        />


                    </div>

                    {/* Save Button */}
                    <div className="mt-7">
                        <Button onClick={handleSubmit} className="w-60">
                            Save and Respond
                        </Button>
                    </div>
                </div>
            </div>
            {showEmptyResponseModal && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
        <div className="bg-white p-6 rounded-2xl w-[350px]  shadow-lg">
            <h3 className="text-lg text-black4 font-semibold mb-2">Resolve This Ticket?</h3>
            <p className="text-sm text-grey-1 mb-5">
                You have not typed anything in the response.<br />Do you wish to resolve this ticket?
            </p>
            <div className="flex justify-between gap-4">
                <Button
                    className="bg-gray-200 text-black px-5 py-2 rounded-full"
                    onClick={() => setShowEmptyResponseModal(false)}
                >
                    No
                </Button>
                <Button
                    onClick={() => {
                        setShowEmptyResponseModal(false);
                        proceedToSubmit();
                    }}
                >
                    Yes, Close
                </Button>
            </div>
        </div>
    </div>
)}

        </>
    );
};

export default ConflictForm;
