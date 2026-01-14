import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { SearchIcon } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { formatDate } from "@/Utilities/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Button from "../Button";
import { ClubApproval, ClubReject, vendorApproval } from "@/services/clubServices";
import { toast } from "react-toastify";
import Loader from "../ui/Loader";
import Pagination from "../Paignation";
import { set } from "lodash";
const PendingTable = ({
    data,
    fetchClubs,
    searchTerm,
    setSearchTerm,
    pagination,
    setPagination, loading, setLoading

}) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isApprovedModalOpen, setIsApprovedModalOpen] = useState(false);
    const [showApproved, setShowApproved] = useState(false)
    const [selectedReason, setSelectedReason] = useState("");
    const [clubId, setclubId] = useState(null);
    const [showApproveModal, setShowApproveModal] = useState(false);
    const [showRejectModal, setShowRejectModal] = useState(false);
    const [customReason, setCustomReason] = useState("");
    const router = useRouter();
    const handleApproveVendor = async (clubId) => {
        try {
            setLoading(true);
            const payload = { isApproved: "approved" };
            await ClubApproval(clubId, payload);
            setIsApprovedModalOpen(false);
            router.push("/club-manager-management?tab=approved", { scroll: false });

            fetchClubs();
        } catch (error) {
            console.error("Approval failed:", error);
            toast.error("Failed to approve vendor.");
        } finally {
            setLoading(false);
        }
    };

    const closeApproveModal = () => {
        setShowApproveModal(false);
    };
    const closeRejectModal = () => {
        setShowRejectModal(false);
    };
    const handleRejectVendor = async (clubId) => {

        const payload = {
            // isApproved: "rejected",
            reasonOfDenial: customReason

        };

        try {
            setLoading(true);

            await ClubReject(clubId, payload);
            toast.success("Club rejected successfully!");

            setIsModalOpen(false);
            fetchClubs();

        } catch (error) {
            console.error("Rejection failed:", error);
            toast.error("Failed to reject vendor.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Loader loading={loading} />
            {showRejectModal && (
                <div className="fixed z-[999] inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg text-black-1 font-semibold">
                                Reject this Club?
                            </h2>
                            <button
                                className="text-black text-3xl flex mt-[-30px] justify-end"
                                onClick={closeRejectModal}
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-grey-4 mt-2">
                            Are you sure you want to Reject this club
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-center space-x-3 mt-5">
                            <Button
                                className="py-2 px-5 border-2  bg-[#F5F7F5] text-primary rounded-full"
                                onClick={closeRejectModal}
                            >
                                No
                            </Button>
                            <Button
                                onClick={() => {
                                    setShowRejectModal(false);
                                    setIsModalOpen(true);
                                }}
                                disabled={loading}
                            >
                                {loading ? <ClipLoader color="white" size={20} /> : "Yes, Reject"}
                            </Button>


                        </div>
                    </div>
                </div>
            )}


            {showApproveModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg text-black-1 font-semibold">
                                Approve this Club?
                            </h2>
                            <button
                                className="text-black text-3xl flex mt-[-30px] justify-end"
                                onClick={closeApproveModal}
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-grey-4 mt-2">
                            Are you sure you want to approve this club
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-center space-x-3 mt-5">
                            <Button
                                className="py-2 px-5 border-2  bg-[#F5F7F5] text-primary rounded-full"
                                onClick={closeApproveModal}
                            >
                                No
                            </Button>
                            <Button
                                onClick={async () => {
                                    setShowApproveModal(false);

                                    setShowApproved(true);
                                }}
                                disabled={loading}
                            >


                                {loading ? <ClipLoader color="white" size={20} /> : "Yes, approve"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            {showApproved && (
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
                                Club Successfully Approved
                            </h2>

                        </div>



                        {/* Buttons */}
                        <div className="flex justify-center space-x-3 mt-5">

                            <Button
                                onClick={async () => {
                                    await handleApproveVendor(clubId);

                                }}
                                disabled={loading}
                            >
                                {loading ? <ClipLoader size={20} /> : "Continue"}
                            </Button>

                        </div>
                    </div>
                </div>
            )}
            {isModalOpen && (
                <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white  px-6 py-8  rounded-lg shadow-lg w-[440px]">
                        <div className="flex justify-between items-center  pb-2">
                            <h2 className="text-lg font-semibold">Club was successfully rejected</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-500 text-xl">✕</button>
                        </div>
                        <p className="text-gray-600 mt-3">Please explain reason of cancelation.</p>

                        <div className="mt-3">


                            <textarea
                                className="mt-2 w-full border rounded-md p-2"
                                placeholder="Write your reason here"
                                value={customReason}
                                onChange={(e) => setCustomReason(e.target.value)}
                                rows={4}
                            />

                        </div>

                        <div className="flex justify-between mt-5 gap-5 mb-4">
                            <Button
                                onClick={() => setIsModalOpen(false)}
                                variant={"secondary-with-border"}
                            >
                                Cancel
                            </Button>
                            <Button

                                onClick={() => handleRejectVendor(clubId)}
                            >
                                Continue
                            </Button>
                        </div>
                    </div>
                </div>
            )}

            {isApprovedModalOpen && (
                <div className="fixed z-50 inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center">
                    <div className="bg-white px-6 py-8 rounded-lg shadow-lg w-[540px]">
                        <div className=" flex justify-end text-end">
                            <button onClick={() => setIsApprovedModalOpen(false)} className="text-gray-500 text-xl ">✕</button>
                        </div>

                        <div className="flex justify-center">
                            <img src="./images/approve.svg" alt="approved" />
                        </div>
                        <p className="font-semibold text-2xl text-center text-black-1"> Club successfully approved</p>


                        <div className="flex justify-between mt-4 mb-6">
                            <Button onClick={() => handleApproveVendor(clubId)}> Continue</Button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-between mb-3">
                <InputWithLabel
                    placeholder="Search by club name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-zinc-500"
                    iconType={"pre"}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            if (pagination.page !== 1) {
                                setPagination((prev) => ({ ...prev, page: 1 }));
                            } else {
                                fetchClubs();
                            }
                        }
                    }}

                >
                    <SearchIcon />
                </InputWithLabel>


            </div>
            <div className="pt-2 ">

                <Table className="min-w-full overflow-x-auto">
                    <TableHeader className="border-t-1">
                        <TableRow className="bg-light-blue rounded-lg  ">


                            <TableHead className="text-white font-medium text-sm text-left">
                                Club Name
                            </TableHead>


                            <TableHead className="text-white font-medium text-sm text-left">
                                Location
                            </TableHead>

                            <TableHead className="text-white font-medium text-sm text-left">
                                Club Status
                            </TableHead>

                            {/* <TableHead className="text-white font-medium text-sm text-left">
                                Sports Offered
                            </TableHead> */}
                            <TableHead className="text-white font-medium text-sm text-center">
                                Clubs Request
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell
                                    colSpan={9}
                                    className="text-center py-4 text-gray-500"
                                >
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow
                                    key={index}
                                    className="bg-white hover:bg-white cursor-pointer"
                                >
                                    <TableCell
                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.clubName}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {[
                                                item?.location?.streetAddress,
                                                item?.location?.city,
                                                item?.location?.state,
                                                item?.location?.postalCode,
                                                item?.location?.country
                                            ]
                                                .filter(Boolean)
                                                .join(", ")}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.clubStatus || "N/A"}
                                        </span>
                                    </TableCell>
                               

                                    <TableCell >
                                        <div className="flex gap-2 justify-center items-center">
                                            <img
                                                src="/icons/Approve.svg"
                                                alt=""
                                                className="icon"
                                                onClick={() => {
                                                    // setIsApprovedModalOpen(true);
                                                    setShowApproveModal(true);
                                                    setclubId(item._id);
                                                }}
                                            />
                                            <img
                                                src="/icons/Reject.svg"
                                                alt=""
                                                className="icon"
                                                onClick={() => {
                                                    // setIsModalOpen(true);
                                                    setShowRejectModal(true);
                                                    setclubId(item._id);
                                                }}
                                            />
                                        </div>


                                    </TableCell>



                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                <Pagination pagination={pagination} setPagination={setPagination} />
            </div>
        </>
    );
};

export default PendingTable;
