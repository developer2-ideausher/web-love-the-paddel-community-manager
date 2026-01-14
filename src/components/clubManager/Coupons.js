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
import Loader from "../ui/Loader";
import { ClipLoader } from "react-spinners";
import Pagination from "../Paignation";
import Button from "../Button";
import Popuplist from "../Popuplist";
import { deleteCoupon, getCouponsListById, toggleCouponStatus } from "@/services/discountServices";
import PromoCard from "./CouponPromoCard";
import Dropdown from "../ui/Dropdown";
const CouponsTable = () => {
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
    const [promoCardData, setPromoCardData] = useState([])
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [client, setClient] = useState(false);
    const [filterType, setfilterType] = useState("all");

    const router = useRouter();
    const clubId = router.query.clubId;

    let searchTimeout;
    const handleFilterClick = (type) => {
        setfilterType(value);
        setPagination(prev => ({ ...prev, page: 1 }));
    };


    const fetchCouponDetails = async () => {
        setLoading(true);
        const payload = {
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm.trim(),
        };

        if (filterType === "active") {
            payload.activeStatus = true;
        } else if (filterType === "expired") {
            payload.activeStatus = false;
        }

        const res = await getCouponsListById(payload, clubId);

        if (res.status) {
            setData(res?.data?.results);
            setPromoCardData(res?.data)
            setPagination({
                page: res?.data?.page,
                limit: res?.data?.limit,
                totalPages: res?.data?.totalPages,
            });
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchCouponDetails();
    }, [pagination.page, pagination.limit, filterType]);
    useEffect(() => {
        if (searchTimeout) clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            setPagination((prev) => ({
                ...prev,
                page: 1,
            }));
            fetchCouponDetails();
        }, 1000);

        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);

    const openDeleteModal = (faqId) => {
        setSelectedDelete(faqId);
        setShowDeleteModal(true);
    };

    const closeDeleteModal = () => {
        setShowDeleteModal(false);
        setSelectedDelete(null);
    };

    const handleDeleteCoupon = async () => {
        setIsProcessing(true);
        try {
            await deleteCoupon(selectedDelete);
            fetchCouponDetails();
            closeDeleteModal();
        } catch (error) {
            console.error("Failed to delete coupon:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const openModal = (id, isActive) => {
        setSelectedUser({ id, isActive });
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedUser(null);
    };
    const filterArray = [
        { value: "all", label: "All" },
        { value: "active", label: "Active" },
        { value: "expired", label: "Expired" }
    ];

    const handleToggleStatus = async (id) => {
        if (!selectedUser) return;

        // Toggle activeStatus: if currently true, send false, and vice versa
        const newActiveStatus = !selectedUser.isActive;

        const payload = {
            activeStatus: newActiveStatus,
        };

        setIsProcessing(true);

        try {
            await toggleCouponStatus(id, payload);

            await fetchCouponDetails();
            closeModal();
        } catch (error) {
            console.error("Failed to toggle status:", error);
        } finally {
            setIsProcessing(false);
        }
    };

    const handleExport = () => {
        if (typeof window === "undefined" || !data.length) return;

        const fileName = window.prompt("Enter a name for the exported file:", "coupons_export");
        if (!fileName) return;

        const headers = ['Promo Id', 'Promo Title', 'Discount', 'End Date', 'Status'];

        const rows = data.map(item => [
            item?._id,
            item?.couponTitle,
            `${item?.couponType === 'fixed' ? 'AED' : ''}${item?.discountAmount}${item?.couponType === 'percentage' ? '%' : ''}`,
            formatDate(item?.expirationDate),
            item?.activeStatus ? 'Running' : 'Expired'
        ]);

        const csvContent = [headers, ...rows]
            .map(row => row.map(value => `"${String(value).replace(/"/g, '""')}"`).join(','))
            .join('\n');

        const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
        const url = URL.createObjectURL(blob);
        const link = document.createElement('a');

        link.href = url;
        link.download = `${fileName}.csv`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    useEffect(() => {
        setClient(true);
    }, []);

    return (
        <>
            <Loader loading={loading} />

            {client && <PromoCard data={promoCardData}/>}

            {showModal && (
                <div className="fixed z-[999] inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg text-black-1 font-semibold">
                                {selectedUser?.isActive ? "Deactivate Coupon?" : "Activate Coupon?"}
                            </h2>
                            <button className="text-black text-3xl flex mt-[-30px] justify-end" onClick={closeModal}>×</button>
                        </div>
                        <p className="text-grey-1 mt-2">
                            Are you sure you want to {selectedUser?.isActive ? "deactivate" : "activate"} this Coupon?
                        </p>

                        <div className="flex justify-center space-x-3 mt-5">
                            <button
                                className="py-2 w-1/2 px-5 border-2 border-primary text-primary rounded-lg"
                                onClick={closeModal}
                            >
                                No
                            </button>
                            <button
                                className="py-2 w-1/2 px-5 bg-primary text-white rounded-lg flex items-center justify-center"
                                onClick={() => handleToggleStatus(selectedUser.id)}
                                disabled={isProcessing}
                            >
                                {isProcessing ? <ClipLoader color="white" size={20} /> : "Yes"}
                            </button>

                        </div>
                    </div>
                </div>
            )}
            {showDeleteModal && (
                <div className="fixed z-[999] inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg text-black-1 font-semibold">
                                Delete this Promo Code?
                            </h2>
                            <button
                                className="text-black text-3xl flex mt-[-30px] justify-end"
                                onClick={closeDeleteModal}
                            >
                                ×
                            </button>
                        </div>

                        <p className="text-grey-4 mt-2">
                            Are you sure you want to delete this Promo Code?
                        </p>

                        <div className="flex justify-center space-x-3 mt-5">
                            <Button
                                className="py-2 px-5 border-2  bg-[#F5F7F5] text-primary rounded-full"
                                onClick={closeDeleteModal}
                            >
                                No
                            </Button>
                            <Button

                                onClick={handleDeleteCoupon
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
                    onKeyPress={(e) => e.key === "Enter" && fetchCouponDetails()}
                    className="text-zinc-500 rounded-full"
                    iconType={"pre"}
                >
                    <SearchIcon />
                </InputWithLabel>
                <div className="flex gap-5">
                    <div className="flex gap-6">

                        <Dropdown
                            Title="Filter"
                            filterArray={filterArray}
                            setHandleFilter={(value) => {
                                setfilterType(value);
                                let activeStatusQuery;
                                if (value === "active") activeStatusQuery = "true";
                                else if (value === "expired") activeStatusQuery = "false";
                                else activeStatusQuery = undefined;

                                router.push({
                                    pathname: router.pathname,
                                    query: {
                                        ...router.query,
                                        activeStatus: activeStatusQuery,
                                    },
                                }, undefined, { shallow: true });
                            }}
                        />

                    </div>

                    {client && (
                        <Button className={"py-3"} onClick={handleExport}>
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16699 9.16699V4.16699H10.8337V9.16699H15.8337V10.8337H10.8337V15.8337H9.16699V10.8337H4.16699V9.16699H9.16699Z" fill="white" />
                            </svg>
                            Export
                        </Button>
                    )}


                </div>

            </div>
            {client && (
                <div className="pt-2 ">
                    <Table className="min-w-full overflow-x-auto">
                        <TableHeader className="border-t-1">
                            <TableRow className="bg-light-blue rounded-lg  ">

                                <TableHead className="text-white font-normal text-sm text-left">
                                    Promo Id
                                </TableHead>


                                <TableHead className="text-white font-normal text-sm text-left flex items-center gap-1">
                                    Promo Title
                                </TableHead>

                                <TableHead className="text-white font-normal text-sm text-left">
                                    Discount
                                </TableHead>


                                <TableHead className="text-white font-normal text-sm text-left">
                                    End Date
                                </TableHead>
                                <TableHead className="text-white font-normal text-sm text-center">
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
                                                {item?._id}
                                            </span>
                                        </TableCell>

                                        <TableCell

                                        >
                                            <span className="text-black-3 font-normal text-sm text-left truncate...">
                                                {item?.couponTitle}
                                            </span>
                                        </TableCell>

                                        <TableCell

                                        >
                                            <span className="text-black-3 font-normal text-sm text-left truncate...">
                                                {item?.couponType === "fixed" && "AED"}      {item?.discountAmount}  {item?.couponType === "percentage" && "%"}

                                            </span>
                                        </TableCell>
                                        <TableCell

                                        >
                                            <span className="text-black-3 font-normal text-sm text-left truncate...">
                                                {formatDate(item?.expirationDate)}
                                            </span>
                                        </TableCell>
                                        <TableCell className="text-center ">
                                            <button
                                                className={`cursor-pointer py-1 px-3 rounded-lg text-sm border-2 ${item?.activeStatus
                                                    ? "text-success font-normal border-success"
                                                    : "text-red-500 font-normal border-red-500"
                                                    }`}
                                                onClick={() => openModal(item._id, item?.activeStatus)}
                                            >
                                                {item?.activeStatus ? (
                                                    "Running"
                                                ) : (
                                                    "Expired"
                                                )}
                                            </button>
                                        </TableCell>



                                        <TableCell className="flex  items-center">
                                            <Popuplist>

                                                <span
                                                    value="unfollow"
                                                    onClick={() => openDeleteModal(item._id)}
                                                    className="cursor-pointer py-2 px-3 gap-2 flex flex-wrap text-sm items-center text-black hover:text-primary rounded-lg font-normal"
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
                </div>)}
        </>
    );
};

export default CouponsTable;




