import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import Link from "next/link";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { suspendCampaign } from "@/services/promotionServices";
import Loader from "../ui/Loader";
import { ClipLoader } from "react-spinners";
import Button from "../Button";
import { deleteAmeneties, getAmenetiesList } from "@/services/amenetiesServices";
import Popuplist from "../Popuplist";
import { getSubscriptionList } from "@/services/subscriptionServices";
const SubscriptionTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [showModal, setShowModal] = useState(false);
    const [selectedUser, setSelectedUser] = useState(null);
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedDeleteFaq, setSelectedDeleteFaq] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const router = useRouter();
    let searchTimeout;

    const fetchSubscriptionList = async () => {
        setLoading(true);
        const payload = {
            page: pagination.page,
            limit: pagination.limit,
            title: searchTerm.trim(),

        };
        const res = await getSubscriptionList(payload);

        if (res.status) {
            setData(res?.data);
            setPagination({
                page: res?.data?.page,
                limit: res?.data?.limit,
                totalPages: res?.data?.totalPages,
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchSubscriptionList();
    }, [pagination.page, pagination.limit]);
    useEffect(() => {
        if (searchTimeout) clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            setPagination((prev) => ({
                ...prev,
                page: 1,
            }));
            fetchSubscriptionList();
        }, 1000);

        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);

    const openDeleteModal = (faqId) => {
        setSelectedDeleteFaq(faqId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedDeleteFaq(null);
    };

    const handleDeleteAmeneties = async () => {
        setIsProcessing(true);
        try {
            await deleteAmeneties(selectedDeleteFaq);
            fetchSubscriptionList();
            closeDeleteModal();
        } catch (error) {
            console.error("Failed to delete amenity:", error);
        } finally {
            setIsProcessing(false);
        }
    };


    const openModal = (userId, isActive) => {
        setSelectedUser({ userId, isActive });
        setShowModal(true);
    };


    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };

    const handleToggleStatus = async (id) => {
        setIsProcessing(true);
        await suspendCampaign(id);
        fetchSubscriptionList();
        setIsProcessing(false);
        closeModal();
    };

    return (
        <>
            <Loader loading={loading} />
            {showModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">

                        <div className="flex justify-between items-center">

                            <h2 className="text-lg text-black-1 font-semibold">
                                {selectedUser?.isActive ? "Suspend Campaign?" : "Activate Campaign?"}
                            </h2>
                            <button className="text-black text-3xl flex mt-[-30px] justify-end" onClick={closeModal}>×</button>
                        </div>
                        <p className="text-grey-1 mt-2">
                            Are you sure you want to {selectedUser?.isActive ? "suspend" : "activate"} this campaign?
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-center space-x-3 mt-5">
                            <button
                                className="py-2 w-1/2 px-5 border-2 border-red-500 text-red-500 rounded-lg"
                                onClick={closeModal}
                            >
                                No
                            </button>
                            <button
                                className="py-2 w-1/2 px-5 bg-red-500 text-white rounded-lg flex items-center justify-center"
                                onClick={() => handleToggleStatus(selectedUser.userId)}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <ClipLoader color="white" size={20} /> : "Yes"}
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg text-black-1 font-semibold">
                                Delete this amenity?
                            </h2>
                            <button
                                className="text-black text-3xl flex mt-[-30px] justify-end"
                                onClick={closeDeleteModal}
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-grey-4 mt-2">
                            Are you sure you want to delete this amenity?
                        </p>

                        {/* Buttons */}
                        <div className="flex justify-center space-x-3 mt-5">
                            <Button
                                className="py-2 px-5 border-2  bg-[#F5F7F5] text-primary rounded-full"
                                onClick={closeDeleteModal}
                            >
                                No
                            </Button>
                            <Button

                                onClick={handleDeleteAmeneties

                                }
                                disabled={isProcessing}
                            >
                                {isProcessing ? <ClipLoader color="white" size={20} /> : "Yes, delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}
            <div className="flex items-center justify-end mb-6 text-xl text-black4 font-medium">
                <div className="flex gap-6">
                    <p></p>
                    <Link href="/subscription-management/subscription/create-subscription">
                        <Button className="whitespace-nowrap flex gap-1 py-3" >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16699 9.16699V4.16699H10.8337V9.16699H15.8337V10.8337H10.8337V15.8337H9.16699V10.8337H4.16699V9.16699H9.16699Z" fill="white" />
                            </svg>
                            New Subscription
                        </Button>
                    </Link>
                </div>

            </div>

            <div className="pt-2 ">

                <Table className="min-w-full overflow-x-auto">
                    <TableHeader className="border-t-1">
                        <TableRow className="bg-light-blue rounded-lg  ">
                            <TableHead className="text-white font-normal text-sm text-left">
                                Plan Name
                            </TableHead>
                            <TableHead className="text-white font-normal text-sm text-left flex items-center gap-1">
                                Description
                            </TableHead>

                            <TableHead className="text-white font-normal text-sm text-left">
                                Subscription Fee
                            </TableHead>
                            <TableHead className="text-white font-normal text-sm text-left">
                                Validity Period
                            </TableHead>

                            <TableHead className="text-white font-normal text-sm text-left">
                                Number of Subscribers
                            </TableHead>
                            <TableHead className="text-white font-normal text-sm text-left">
                                Action
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
                                            {item?.planName}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.description}
                                        </span>
                                    </TableCell>

                                    <TableCell
                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.priceAndCurrency?.currency} {item?.priceAndCurrency?.price}
                                        </span>
                                    </TableCell>

                                    <TableCell >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.validityInDays} Days
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <span className="text-black-3 font-normal text-sm text-left truncate">
                                            {item?.currentlySubscribedBy?.length ?? "N/A"}
                                        </span>
                                    </TableCell>



                                    <TableCell className="flex  items-center">
                                        <Popuplist>
                                            <Link href={`/subscription-management/subscription/edit/${item?._id}`} >
                                                <span
                                                    value="unfollow"
                                                    className="cursor-pointer w-full py-2 px-3 gap-2 flex flex-wrap text-sm items-center text-black hover:text-primary rounded-lg font-normal"
                                                >
                                                    Edit Plan
                                                </span>
                                            </Link>

                                        </Popuplist>
                                    </TableCell>

                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
                {/* <Pagination pagination={pagination} setPagination={setPagination} /> */}
            </div>
        </>
    );
};

export default SubscriptionTable;




