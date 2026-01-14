
// pages/user-details.js
import React, { useState, useEffect } from "react";
import Layout from "@/layout/Layout";
import Link from "@/components/Link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import Button from "@/components/Button";
import { ArrowDown } from "lucide-react";

import { useRouter } from "next/router";
import PendingProfile from "@/components/clubManager/PendingProfile";
import Loader from "@/components/ui/Loader";
import { toast } from "react-toastify";
import { ClubApproval, ClubReject } from "@/services/clubServices";

export default function VendorDetails() {
    const router = useRouter();
    const { id } = router.query;
    const [businessPhotos, setBusinessPhotos] = useState([]);
    const [businessVideos, setBusinessVideos] = useState([]);
    const [showPopup, setShowPopup] = useState(false);
    const [activeMediaTab, setActiveMediaTab] = useState("Videos");
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
    const [isRejectModalOpen, setIsRejectModalOpen] = useState(false);
    const [selectedReason, setSelectedReason] = useState("");
    const [customReason, setCustomReason] = useState("");

    const fetchVendorDetail = async (id) => {
        if (!id) return;

        setLoading(true);

        try {
            const res = await getVendorById(id);

            if (res?.data?.data?.vendor) {
                const vendorData = res.data.data.vendor;
                setData(vendorData);

                setBusinessPhotos(Array.isArray(vendorData.businessPhotos) ? vendorData.businessPhotos : []);
                setBusinessVideos(Array.isArray(vendorData.businessVideos) ? vendorData.businessVideos : []);
            }
        } catch (error) {
            console.error("Error fetching vendor details:", error);
        }

        setLoading(false);
    };

    useEffect(() => {
        if (router.isReady && id) {
            fetchVendorDetail(id);
        }
    }, [router.isReady, id]);

    const handleApproveVendor = async () => {
        try {
            const payload = { isApproved: "approved" };
            await ClubApproval(id, payload);
            setIsApprovedModalOpen(false);
            fetchVendorDetail(id); 
        } catch (error) {
            console.error("Approval failed:", error);
            toast.error("Failed to approve vendor.");
        }
    };

    const handleRejectVendor = async () => {
        if (!selectedReason) {
            toast.error("Please select a rejection reason.");
            return;
        }

        const payload = {
            isApproved: "rejected",
            rejectionReason: selectedReason === "Other" ? "other" : selectedReason.toLowerCase(),
            ...(selectedReason === "Other" && customReason ? { customReason } : {}),
        };

        try {
            await ClubReject(id, payload);
            toast.success("Vendor rejected successfully!");
            setIsRejectModalOpen(false);
            fetchVendorDetail(id);
        } catch (error) {
            console.error("Rejection failed:", error);
            toast.error("Failed to reject vendor.");
        }
    };
    return (
        <Layout title={"Vendors"}>
            <Loader loading={loading} />

            <div className="container mx-auto px-4 mt-4" >
                <div className="flex justify-between items-center mb-7">
                    <div className="mt-4 mb-3">
                        <h2 className="text-black-3 text-sm font-normal cursor-pointer">
                            <Link href="/club-manager-management" className={"text-black-3  text-sm font-medium hover:text-primary hover:underline"}>Vendor</Link> {" "}
                            <span className="text-black-3 text-sm font-medium">
                                &gt; Vendor Details{" "}
                            </span>
                        </h2>
                    </div>

                    <div>
                        <div className="flex items-center space-x-4">
                            
                            {data.isApproved === "pending" ? (
                                <>
                                    <Button
                                        className="whitespace-nowrap flex gap-1 rounded-"
                                        variant={"success"}
                                        onClick={() => setIsApprovedModalOpen(true)}
                                    >
                                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 22.5C6.47715 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5C22 18.0228 17.5228 22.5 12 22.5ZM12 20.5C16.4183 20.5 20 16.9183 20 12.5C20 8.08172 16.4183 4.5 12 4.5C7.58172 4.5 4 8.08172 4 12.5C4 16.9183 7.58172 20.5 12 20.5ZM11.0026 16.5L6.75999 12.2574L8.17421 10.8431L11.0026 13.6716L16.6595 8.01472L18.0737 9.42893L11.0026 16.5Z"
                                                fill="white"
                                            />
                                        </svg>
                                        Approve
                                    </Button>

                                    <Button
                                        className="whitespace-nowrap flex gap-1"
                                        variant={"danger"}
                                        onClick={() => setIsRejectModalOpen(true)}
                                    >
                                        <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                            <path
                                                d="M12 22.5C6.47715 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5C22 18.0228 17.5228 22.5 12 22.5ZM12 20.5C16.4183 20.5 20 16.9183 20 12.5C20 8.08172 16.4183 4.5 12 4.5C7.58172 4.5 4 8.08172 4 12.5C4 16.9183 7.58172 20.5 12 20.5ZM12 11.0858L14.8284 8.25736L16.2426 9.67157L13.4142 12.5L16.2426 15.3284L14.8284 16.7426L12 13.9142L9.17157 16.7426L7.75736 15.3284L10.5858 12.5L7.75736 9.67157L9.17157 8.25736L12 11.0858Z"
                                                fill="white"
                                            />
                                        </svg>
                                        Reject
                                    </Button>
                                </>
                            ) : (
                                
                                <Button
                                    className="whitespace-nowrap flex gap-1 cursor-not-allowed opacity-50"
                                    variant={data.isApproved === "approved" ? "success" : "danger"}
                                    disabled
                                >
                                    <svg width="24" height="25" viewBox="0 0 24 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                                        <path
                                            d="M12 22.5C6.47715 22.5 2 18.0228 2 12.5C2 6.97715 6.47715 2.5 12 2.5C17.5228 2.5 22 6.97715 22 12.5C22 18.0228 17.5228 22.5 12 22.5ZM12 20.5C16.4183 20.5 20 16.9183 20 12.5C20 8.08172 16.4183 4.5 12 4.5C7.58172 4.5 4 8.08172 4 12.5C4 16.9183 7.58172 20.5 12 20.5ZM11.0026 16.5L6.75999 12.2574L8.17421 10.8431L11.0026 13.6716L16.6595 8.01472L18.0737 9.42893L11.0026 16.5Z"
                                            fill="white"
                                        />
                                    </svg>
                                    {data.isApproved === "approved" ? "Approved" : "Rejected"}
                                </Button>
                            )}
                        </div>


                    </div>

                    {/* ✅ Approve Modal */}
                    {isApprovedModalOpen && (
                        <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white px-6 py-8 rounded-lg shadow-lg w-[540px]">
                            <div className=" flex justify-end text-end">
                            <button onClick={() => setIsApprovedModalOpen(false)} className="text-gray-500 text-xl ">✕</button>
                        </div>
                                <div className="flex justify-center">
                                    <img src="/images/approved.svg" alt="approved" />
                                </div>
                                <p className="font-semibold text-2xl text-center text-black">Vendor Approved Successfully!</p>

                                <div className="flex justify-center mt-6">
                                    <Button onClick={handleApproveVendor}>Continue</Button>
                                </div>
                            </div>
                        </div>
                    )}

                    {isRejectModalOpen && (
                        <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                            <div className="bg-white px-6 py-8 rounded-lg shadow-lg w-[440px]">
                                <h2 className="text-lg font-semibold">Reject Vendor</h2>
                                <p className="text-gray-600 mt-3">Select a reason for rejection:</p>

                                <div className="mt-3">
                                    {["Incomplete documents", "Invalid or expired documents", "Duplicate submission", "Unverified business details", "Other"].map((reason) => (
                                        <div key={reason} className="flex items-center space-x-2 mt-4">
                                            <input
                                                type="radio"
                                                name="rejectReason"
                                                value={reason}
                                                checked={selectedReason === reason}
                                                onChange={() => setSelectedReason(reason)}
                                            />
                                            <label className="text-sm">{reason}</label>
                                        </div>
                                    ))}
                                    {selectedReason === "Other" && (
                                        <textarea
                                            className="mt-2 w-full border rounded-md p-2"
                                            placeholder="Write your reason here"
                                            value={customReason}
                                            onChange={(e) => setCustomReason(e.target.value)}
                                            rows={4}
                                        />
                                    )}
                                </div>

                                <div className="flex justify-between mt-5 gap-5">
                                    <Button onClick={() => setIsRejectModalOpen(false)} variant="secondary-with-border">
                                        Cancel
                                    </Button>
                                    <Button onClick={handleRejectVendor} className="bg-red-600">
                                        Reject
                                    </Button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>



                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="col-span-1">
                        <PendingProfile data={data} />
                    </div>

                    <div className="col-span-3">
                        <div>
                            <div className="bg-white rounded-lg">
                                <div>
                                    <div className="pt-2 px-4">
                                        <h2 className="text-lg pb-6 pt-4 ">Timings</h2>
                                        <div className="">
                                            <Table className="min-w-full overflow-x-auto ">
                                                <TableHeader className="bg-neutral hover:bg-liteOrange">
                                                    <TableRow className="pl-5">
                                                        <TableHead className="text-black-1 font-normal text-sm text-left">
                                                            Days
                                                        </TableHead>
                                                        <TableHead className="text-black-1 font-normal text-sm text-left">
                                                            Opening Timings
                                                        </TableHead>
                                                        <TableHead className="text-black-1 font-normal text-sm text-left">
                                                            Closed Timings
                                                        </TableHead>


                                                    </TableRow>
                                                </TableHeader>
                                                <TableBody>
                                                    {data?.timings && Array.isArray(data.timings) && data.timings.length > 0 ? (
                                                        data.timings.map((dummyData, index) => (
                                                            <TableRow key={index} className="bg-white hover:bg-white cursor-pointer">
                                                                <TableCell>
                                                                    <span className="text-black font-normal text-sm text-left truncate...">
                                                                        {dummyData.day || "N/A"}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className="text-black font-normal text-sm text-left truncate...">
                                                                        {dummyData.openingTime || "N/A"}
                                                                    </span>
                                                                </TableCell>
                                                                <TableCell>
                                                                    <span className="text-black font-normal text-sm text-left truncate...">
                                                                        {dummyData.closingTime || "N/A"}
                                                                    </span>
                                                                </TableCell>
                                                            </TableRow>
                                                        ))
                                                    ) : (
                                                        <TableRow>
                                                            <TableCell colSpan={3} className="text-center text-gray-500">
                                                                No timings available
                                                            </TableCell>
                                                        </TableRow>
                                                    )}
                                                </TableBody>
                                            </Table>

                                        </div>
                                    </div>
                                </div>

                            </div>

                            <div className="mt-6 grid grid-cols-1 md:grid-cols-4 gap-4">
                                <div className="col-span-2 bg-white rounded-lg p-4">

                                    <p className="text-base font-semibold text-black-1  mb-6 mt-4 ">Social Media Links</p>
                                    <div className="flex flex-col mb-4">
                                        <p className="text-sm font-normal text-grey-1  leading-5">
                                            Website Link
                                        </p>

                                        <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
                                            <a href={data?.websiteLink} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-black-1 hover:text-primary hover:underline">
                                                {data?.websiteLink}
                                            </a>
                                        </p>
                                    </div>
                                    {data?.socialMediaLinks?.length > 0 && (
                                        <>
                                            {data.socialMediaLinks.map((social) => {
                                                return (
                                                    <div key={social._id} className="flex flex-col mb-4">
                                                        <p className="text-sm font-normal text-grey-1 leading-5">
                                                            {social?.platform}
                                                        </p>

                                                        <p className="text-sm font-medium text-black-1 leading-6 pt-1 break-all">
                                                            <a href={social.link} target="_blank" rel="noopener noreferrer" className="cursor-pointer text-black-1 hover:text-primary hover:underline">
                                                                {social.link}
                                                            </a>
                                                        </p>
                                                    </div>
                                                );
                                            })}
                                        </>
                                    )}


                                    

                                    <div className=" bg-white rounded-lg ">
                                        <p className="text-sm font-normal text-grey-1  leading-5 mb-4">Document</p>

                                        <div className="space-y-4">
                                            {data?.businessDocument?.url ? (
                                                <div className="flex justify-between items-center">
                                                    <div className="flex items-center space-x-4">
                                                        <img src="/images/pdf-icon.png" alt="PDF Icon" className="w-8 h-8" />
                                                        <div>
                                                            <p className="text-sm font-medium text-black-1">Business Document</p>

                                                        </div>
                                                    </div>
                                                    <a
                                                        href={data?.businessDocument?.url}
                                                        download

                                                    >
                                                        <ArrowDown color="#CC1728" size={20} />
                                                    </a>



                                                </div>
                                            ) : (
                                                <p className="text-sm text-gray-500">No document available.</p>
                                            )}
                                        </div>
                                    </div>

                                </div>

                                <div className="col-span-2 bg-white rounded-lg p-4">

                                    <p className="text-base font-semibold text-black-1  mb-6 mt-4 ">Business Verification Documents</p>
                                    <div className="flex flex-col mb-4">
                                        <p className="text-sm font-normal text-grey-1  leading-5">
                                            Business Owner Name
                                        </p>

                                        <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
                                            {data?.name}
                                        </p>
                                    </div>
                                    <div className="flex flex-col mb-4">
                                        <p className="text-sm font-normal text-grey-1  leading-5">
                                            ID of the owner
                                        </p>

                                        <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
                                            {data?.ownerId || "N/A"}
                                        </p>
                                    </div>
                                    <div className="flex flex-col mb-4">
                                        <p className="text-sm font-normal text-grey-1  leading-5">
                                            Business ID Number
                                        </p>

                                        <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
                                            {data?.businessIDNumber || "N/A"}


                                        </p>
                                    </div>
                                </div>

                                {showPopup && (
                                    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
                                        <div className="bg-white p-6 rounded-lg w-[600px]">
                                            {/* Header */}
                                            <div className="flex justify-between items-center mb-4">
                                                <h2 className="text-lg font-medium">Media</h2>
                                                <button onClick={() => setShowPopup(false)} className="text-gray-500 text-xl">✕</button>
                                            </div>

                                            {/* Tabs */}
                                            <div className="flex border-b-2">
                                                <button
                                                    className={`px-4 py-2 ${activeMediaTab === "Photos" ? "border-b-2 border-red-500 font-bold" : ""}`}
                                                    onClick={() => setActiveMediaTab("Photos")}
                                                >
                                                    Photos
                                                </button>
                                                <button
                                                    className={`px-4 py-2 ${activeMediaTab === "Videos" ? "border-b-2 border-red-500 font-bold" : ""}`}
                                                    onClick={() => setActiveMediaTab("Videos")}
                                                >
                                                    Videos
                                                </button>
                                            </div>

                                            {/* Content */}
                                            <div className="mt-4 grid grid-cols-5 gap-2">
                                                {activeMediaTab === "Photos" ? (
                                                    // Display Photos
                                                    <>
                                                        <img src="/images/img1.png" alt="media" className="w-24 h-24 rounded-md" />
                                                        <img src="/images/img2.png" alt="media" className="w-24 h-24 rounded-md" />
                                                        <img src="/images/img3.png" alt="media" className="w-24 h-24 rounded-md" />
                                                        <img src="/images/img4.png" alt="media" className="w-24 h-24 rounded-md" />
                                                        <img src="/images/img1.png" alt="media" className="w-24 h-24 rounded-md" />
                                                        <img src="/images/img2.png" alt="media" className="w-24 h-24 rounded-md" />
                                                        <img src="/images/img3.png" alt="media" className="w-24 h-24 rounded-md" />
                                                        <img src="/images/img4.png" alt="media" className="w-24 h-24 rounded-md" />
                                                    </>
                                                ) : (
                                                    // Display Videos (Mocked Video Thumbnails)
                                                    <>
                                                        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                                                            Video 1
                                                        </div>
                                                        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                                                            Video 2
                                                        </div>
                                                        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                                                            Video 3
                                                        </div>
                                                        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                                                            Video 4
                                                        </div>
                                                        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                                                            Video 3
                                                        </div>
                                                        <div className="w-24 h-24 bg-gray-300 flex items-center justify-center rounded-md">
                                                            Video 4
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* Buttons */}
                                            <div className="w-1/2 ml-auto flex justify-end gap-3 mt-4">
                                                <Button onClick={() => setShowPopup(false)} className="px-4 py-2" variant={"secondary-with-border"}>
                                                    Cancel
                                                </Button>
                                                <Button className="px-4 py-2">
                                                    Save
                                                </Button>
                                            </div>

                                        </div>
                                    </div>
                                )}

                            </div>
                        </div>

                    </div>

                </div>




            </div>
        </Layout>
    );
}
