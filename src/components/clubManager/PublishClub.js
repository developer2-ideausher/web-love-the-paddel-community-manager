import Link from "next/link";
import { useEffect, useState } from "react";
import Input from "../Input";
import DatePicker from "../DatePicker";
import { toast } from "react-toastify";
import { getClubList, publishweekClub } from "@/services/clubServices";
import DynamicDropdown from "../DynamicDropdown";
import ClubDynamicDropdown from "./ClubDynamicDropdown";
import Button from "../Button";
import { useRouter } from "next/router";

const PublishWeekClubs = () => {
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [startDate, setStartDate] = useState(null);
    const [endDate, setEndDate] = useState(null);
    const [loading, setLoading] = useState(false);
    const [selectedClub, setSelectedClub] = useState(null);
    const [showSuccessPopup, setShowSuccessPopup] = useState(false);
    const router = useRouter()
    
    const handleSubmit = async () => {
        if (!startDate || !endDate || selectedClubs.length === 0) {
            toast.error("All fields are required (date range + at least one club)");
            return;
        }

        const payload = {
            clubs: selectedClubs.map((c) => c._id),
            startDate,
            endDate,
            total: selectedClubs.length,
        };

        setLoading(true);
        try {
            const res = await publishweekClub(payload);
            if (res?.status) {
                setSelectedClubs([]);
                setStartDate(null);
                setEndDate(null);
                setSelectedClub(null);
                setShowSuccessPopup(true);
            } else {
                toast.error(res?.message || "Failed to publish");
            }
        } catch (err) {
            console.error(err);
        }
        setLoading(false);
    };

    return (
        <div className="px-6 rounded-lg mb-10">

            <div className="mt-4  mb-6">
                <h2 className="text-black-3 text-sm font-normal cursor-pointer">
                    <Link href="/club-manager-management" className={"text-black-3  text-sm font-medium hover:text-primary hover:underline"}>Club Manager Management</Link> {" "}
                    <span className="text-black-3 text-sm font-medium">
                        &gt;
                        Pick club of the week
                    </span>

                </h2>
            </div>
            <h1 className="text-xl font-semibold mb-2">Club Manager Management</h1>
            <div className="flex gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-info-icon lucide-info"><circle cx="12" cy="12" r="10" /><path d="M12 16v-4" /><path d="M12 8h.01" /></svg>
                <p className="text-black4 mb-6 text-base font-medium">
                    Select up to 5 top clubs based on ratings, bookings, and promotions to feature as club of the week.
                </p>
            </div>

            <div className=" max-w-lg bg-white rounded-xl shadow p-6 space-y-6">
                <div>
                    <label className="block text-sm font-medium mb-2">Select Date Range</label>
                    <div className="grid grid-cols-2 gap-6">
                        <DatePicker label="Start Date" value={startDate} onChange={setStartDate} />
                        <DatePicker label="End Date" value={endDate} onChange={setEndDate} />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-medium mb-2">Choose Club</label>
                    <ClubDynamicDropdown
                        placeholder="Select a club"
                        value={selectedClubs}
                        callback={(updatedClubs) => {
                            setSelectedClubs(updatedClubs); 
                        }}
                    />



                </div>

                <div>
                    <button
                        onClick={handleSubmit}
                        disabled={loading}
                        className="px-6 py-2 rounded-full bg-black text-white font-medium hover:bg-gray-800 disabled:opacity-50"
                    >
                        {loading ? "Publishing..." : "Publish"}
                    </button>
                </div>
            </div>
            {showSuccessPopup && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg mx-auto w-96">

                        <div className="">
                            <div className="flex justify-center">
                                <svg width="140" height="140" viewBox="0 0 140 140" fill="none" xmlns="http://www.w3.org/2000/svg">
                                    <rect width="140" height="140" rx="70" fill="#617896" />
                                    <path d="M63.5023 78.3054L93.3776 48.4302L97.9737 53.0264L63.5023 87.4977L42.8193 66.815L47.4155 62.2189L63.5023 78.3054Z" fill="white" />
                                </svg>
                            </div>

                            <h2 className="text-lg text-black-1 mt-4 text-center font-semibold">
                                Club Successfully Published On Love The Padel App
                            </h2>

                        </div>



                        <div className="flex justify-center space-x-3 mt-5">

                            <Button
                                onClick={() => router.push("/club-manager-management?tab=weekClub")}
                                disabled={loading}
                            >
                                {loading ? <ClipLoader size={20} /> : "Continue"}
                            </Button>

                        </div>
                    </div>
                </div>
            )}
        </div>
        
    );
};

export default PublishWeekClubs;
