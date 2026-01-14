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
import Link from "next/link";
import { formatDate, downloadCSV } from "@/Utilities/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import Loader from "../ui/Loader";
import { ClipLoader } from "react-spinners";
import Pagination from "../Paignation";
import Button from "../Button";
import { deleteAmeneties, getAmenetiesList } from "@/services/amenetiesServices";
import Popuplist from "../Popuplist";
import { deleteNotifications, getNotificationsList } from "@/services/notificationServices";
const NotificationsTable = () => {
    const [isClient, setIsClient] = useState(false);
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
    const [selectedDelete, setSelectedDelete] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const router = useRouter();
    let searchTimeout;

    const fetchNotificationDetails = async () => {
        setLoading(true);
        const payload = {
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm.trim(),
        };
        const res = await getNotificationsList(payload);

        if (res.status) {
            setData(res?.data?.results);
            setPagination({
                page: res?.data?.page,
                limit: res?.data?.limit,
                totalPages: res?.data?.totalPages,
            });
        }
        setLoading(false);
    };
    useEffect(() => {
        fetchNotificationDetails();
    }, [pagination.page, pagination.limit]);

    useEffect(() => {
        const handler = setTimeout(() => {
            setPagination((prev) => ({
                ...prev,
                page: 1,
            }));

            fetchNotificationDetails();
        }, 700);

        return () => clearTimeout(handler);
    }, [searchTerm]);



    const openDeleteModal = (faqId) => {
        setSelectedDelete(faqId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedDelete(null);
    };

    const handleDeleteAmeneties = async () => {
        setIsProcessing(true);
        try {
            await deleteNotifications(selectedDelete);
            fetchNotificationDetails();
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
        fetchNotificationDetails();
        setIsProcessing(false);
        closeModal();
    };

    return (
        <>
            <Loader loading={loading} />

            {showDeleteModal && (
                <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">

                        <div className="flex justify-between items-center">
                            <h2 className="text-lg text-black-1 font-semibold">
                                Delete this notification?
                            </h2>
                            <button
                                className="text-black text-3xl flex mt-[-30px] justify-end"
                                onClick={closeDeleteModal}
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-grey-4 mt-2">
                            Are you sure you want to delete this notification?
                        </p>

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
            <div className="flex items-center justify-between mb-6">
                <InputWithLabel
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            setPagination((prev) => ({ ...prev, page: 1 }));
                            fetchNotificationDetails();
                        }
                    }}
                    className="text-zinc-500 rounded-full"
                    iconType={"pre"}
                >
                    <SearchIcon />
                </InputWithLabel>

                <div className="flex gap-6">
                    <Link href={"/notifications-management/notification/create-notification"}>
                        <Button className="whitespace-nowrap flex gap-1 py-3" >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16699 9.16699V4.16699H10.8337V9.16699H15.8337V10.8337H10.8337V15.8337H9.16699V10.8337H4.16699V9.16699H9.16699Z" fill="white" />
                            </svg>
                            New Notification
                        </Button>
                    </Link>
                </div>

            </div>

            <div className="pt-2 ">


                <Table className="min-w-full overflow-x-auto">
                    <TableHeader className="border-t-1">
                        <TableRow className="bg-light-blue rounded-lg  ">

                            <TableHead className="text-white font-normal text-sm text-left">
                                Notification Title
                            </TableHead>

                            <TableHead className="text-white font-normal text-sm text-left flex items-center gap-1">
                                Notification Message
                            </TableHead>

                            <TableHead className="text-white font-normal text-sm text-left">
                                Recipient Type
                            </TableHead>
                            <TableHead className="text-white font-normal text-sm text-left">
                                Date Created
                            </TableHead>
                            <TableHead className="text-white font-normal text-sm text-left">
                                Status
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
                                            {item?.title || "N/A"}
                                        </span>
                                    </TableCell>


                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.description || "N/A"}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.targetRole === "NormalUser"
                                                ? "User"
                                                : item?.targetRole === "ClubManager"
                                                    ? "Club Manager" : item?.targetRole === "All"
                                                        ? "All"
                                                        : "N/A"}
                                        </span>
                                    </TableCell>

                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {formatDate(item?.createdAt)}
                                        </span>
                                    </TableCell>
                                    <TableCell className=" ">
                                        <button
                                            className={`cursor-pointer py-1 px-3 rounded-lg text-sm border-2 ${item?.status === "Sent"
                                                ? "text-success font-normal border-success"
                                                : "text-red-400 font-normal border-red-400"
                                                }`}
                                        >
                                            {item?.status === "Sent" ? "Sent" : "Scheduled"}
                                        </button>

                                    </TableCell>

                                    <TableCell className="flex  items-center">
                                        <Popuplist>
                                            <span
                                                value="unfollow"
                                                onClick={() =>
                                                    router.push({
                                                        pathname: `/notifications-management/notification/edit/${item?._id}`
                                                    })
                                                }
                                                className="cursor-pointer w-full py-2 px-3 gap-2 flex flex-wrap text-sm items-center text-black hover:text-primary rounded-lg font-normal"
                                            >
                                                Edit Notification
                                            </span>

                                            <span
                                                value="unfollow"
                                                onClick={() => openDeleteModal(item._id)}
                                                className="cursor-pointer w-full py-2 px-3 gap-2 flex flex-wrap text-sm items-center text-black hover:text-primary rounded-lg font-normal"
                                            >
                                                Delete Notification
                                            </span>
                                        </Popuplist>
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

export default NotificationsTable;



