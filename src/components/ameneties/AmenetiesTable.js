import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { ArrowUpDown, ChevronDown, Download, Eye, EyeIcon, SearchIcon, Trash2 } from "lucide-react";

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
import { deleteCampaign, getCampaignList, suspendCampaign } from "@/services/promotionServices";
import Loader from "../ui/Loader";
import { ClipLoader } from "react-spinners";
import Pagination from "../Paignation";
import Button from "../Button";
import { deleteAmeneties, getAmenetiesList } from "@/services/amenetiesServices";
import Popuplist from "../Popuplist";
const AmenetiesTable = () => {
    const [isClient, setIsClient] = useState(false);
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [selectedDeleteFaq, setSelectedDeleteFaq] = useState(null);
    const [showDeleteModal, setShowDeleteModal] = useState(false);

    const router = useRouter();
    let searchTimeout;

    const fetchAmenities = async () => {
        setLoading(true);
        const payload = {
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm.trim(),

        };

        const res = await getAmenetiesList(payload);

        if (res.status) {
            setData(res?.data?.results);
            setPagination((prev) => ({
                ...prev,
                totalPages: res?.data?.totalPages,
                limit: res?.data?.limit || prev.limit,
            }));
        }

        setLoading(false);
    };


    useEffect(() => {
        fetchAmenities();
    }, [pagination.page, pagination.limit]);

 useEffect(() => {
    const handler = setTimeout(() => {
        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));

        fetchAmenities();
    }, 700);

    return () => clearTimeout(handler);
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
            fetchAmenities();
            closeDeleteModal();
        } catch (error) {
            console.error("Failed to delete amenity:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    return (
        <>

            <Loader loading={loading} />

            {showDeleteModal && (
                <div className="fixed z-[999] inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
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
                    placeholder="Search"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => {
                        if (e.key === "Enter") {
                            setPagination((prev) => ({ ...prev, page: 1 }));
                            fetchAmenities();
                        }
                    }}
                    className="text-zinc-500 rounded-full"
                    iconType={"pre"}
                >
                    <SearchIcon />
                </InputWithLabel>

                <div className="flex gap-6">
                    <Link href={"/amenities-management/amenity/create-amenity"}>
                        <Button className="whitespace-nowrap flex gap-1 py-3" >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16699 9.16699V4.16699H10.8337V9.16699H15.8337V10.8337H10.8337V15.8337H9.16699V10.8337H4.16699V9.16699H9.16699Z" fill="white" />
                            </svg>
                            New Amenity
                        </Button>
                    </Link>
                </div>

            </div>
            <div className="pt-2 ">


                <Table className="min-w-full overflow-x-auto">
                    <TableHeader className="border-t-1">
                        <TableRow className="bg-light-blue rounded-lg  ">

                            <TableHead className="text-white font-normal text-sm text-left">
                                Amenity ID
                            </TableHead>


                            <TableHead className="text-white font-normal text-sm text-left flex items-center gap-1">
                                Amenity
                            </TableHead>

                            <TableHead className="text-white font-normal text-sm text-left">
                                Date Created
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
                                            {item?._id}
                                        </span>
                                    </TableCell>


                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.amenityName}
                                        </span>
                                    </TableCell>
                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {formatDate(item?.createdAt)}
                                        </span>
                                    </TableCell>

                                    <TableCell className="flex  items-center">
                                        <Popuplist>
                                            <span
                                                value="unfollow"
                                                onClick={() =>
                                                    router.push({
                                                        pathname: `/amenities-management/amenity/edit/${item?._id}`,
                                                        query: { name: item?.amenityName },
                                                    })
                                                }
                                                className="cursor-pointer w-full py-2 px-3 gap-2 flex flex-wrap text-sm items-center text-black hover:text-primary rounded-lg font-normal"
                                            >
                                                Edit
                                            </span>

                                            <span
                                                value="unfollow"
                                                onClick={() => openDeleteModal(item._id)}
                                                className="cursor-pointer w-full py-2 px-3 gap-2 flex flex-wrap text-sm items-center text-black hover:text-primary rounded-lg font-normal"
                                            >
                                                Delete
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

export default AmenetiesTable;




