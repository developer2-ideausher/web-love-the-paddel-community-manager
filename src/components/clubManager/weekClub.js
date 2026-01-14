import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { Eye, SearchIcon, Star, Trash2 } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import Link from "next/link";
import { formatDate } from "@/Utilities/helpers";
import { useRouter } from "next/router";

import Loader from "../ui/Loader";
import Pagination from "../Paignation";
import { deleteClub, getClubEarningsById, getClubOfWeekById, getClubOfWeekList } from "@/services/clubServices";
import { useEffect, useState } from "react";
import Button from "../Button";
const WeekClubTable = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedClubs, setSelectedClubs] = useState([]);
    const [dateRange, setDateRange] = useState({});
    const [loadingPopup, setLoadingPopup] = useState(false);
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
    const [selectedClubId, setSelectedClubId] = useState(null);
    const [deleting, setDeleting] = useState(false);

    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);

    const fetchClubOfWeekList = async () => {
        setLoading(true);

        const payload = {
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm
        };

        const res = await getClubOfWeekList(payload);
        if (res?.data) {
            setData(res?.data?.results || []);
            setPagination({
                page: res?.data?.page,
                limit: res?.data?.limit,
                totalPages: res?.data?.totalPages,
            });
        }
        setLoading(false);
    };

    const handleViewClubs = async (id, startDate, endDate) => {
        setLoadingPopup(true);
        setIsModalOpen(true);
        try {
            const res = await getClubOfWeekById(id);
            if (res?.data) {
                setSelectedClubs(res?.data?.clubs || []);
                setDateRange({ startDate, endDate });
            }
        } catch (err) {
            console.error(err);
        }
        setLoadingPopup(false);
    };


    const handleDelete = async () => {
        if (!selectedClubId) return;
        setDeleting(true);
        try {
            const res = await deleteClub(selectedClubId);
            if (res?.status) {
                fetchClubOfWeekList();
                setIsDeleteModalOpen(false);
            }
        } catch (err) {
            console.error("Delete failed", err);
        }
        setDeleting(false);
    };


    useEffect(() => {
        fetchClubOfWeekList();
    }, [pagination.page, pagination.limit]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (pagination.page !== 1) {
                setPagination((prev) => ({
                    ...prev,
                    page: 1,
                }));
            } else {
                fetchClubOfWeekList();
            }
        }, 700);

        return () => clearTimeout(handler);
    }, [searchTerm]);


    return (
        <>
            <Loader loading={loading} />
            <div className="flex items-center justify-between mb-6">
                <InputWithLabel
                    placeholder="Search"
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
                    <Link href={"club-manager-management/pick-club-of-the-week"}>
                        <Button className="whitespace-nowrap flex gap-1 py-3" >
                            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                                <path d="M9.16699 9.16699V4.16699H10.8337V9.16699H15.8337V10.8337H10.8337V15.8337H9.16699V10.8337H4.16699V9.16699H9.16699Z" fill="white" />
                            </svg>
                            Publish New
                        </Button>
                    </Link>
                </div>

            </div>
            <div className="pt-2 ">
                <Table className="min-w-full overflow-x-auto">
                    <TableHeader className="border-t-1">
                        <TableRow className="bg-light-blue rounded-lg  ">

                            <TableHead className="text-white font-medium text-sm text-left">
                                Date Range
                            </TableHead>

                            <TableHead className="text-white font-medium text-sm text-left">
                                Clubs

                            </TableHead>

                            <TableHead className="text-white font-medium text-sm text-left">
                                Club Published
                            </TableHead>


                            <TableHead className="text-white font-medium text-sm text-left">
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
                                            {formatDate(item?.startDate)} - {formatDate(item?.endDate)}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-wrap items-center gap-2">
                                            {item?.clubs?.slice(0, 2).map((club) => (
                                                <span
                                                    key={club?._id}
                                                    className="px-3 py-1 bg-gray-200 text-gray-800 text-sm rounded-full"
                                                >
                                                    {club?.clubName}
                                                </span>
                                            ))}

                                            {item?.clubs?.length > 2 && (
                                                <span className="text-gray-600 text-sm font-medium">
                                                    + {item?.clubs.length - 2}
                                                </span>
                                            )}
                                        </div>
                                    </TableCell>

                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.total || "N/A"}

                                        </span>
                                    </TableCell>
                                    <TableCell className="flex gap-4">


                                        <button
                                            onClick={() => handleViewClubs(item._id, item.startDate, item.endDate)}
                                        >
                                            <Eye color="#0e0f0c" />
                                        </button>


                                        <button
                                            onClick={() => {
                                                setSelectedClubId(item._id);
                                                setIsDeleteModalOpen(true);
                                            }}
                                        >
                                            <Trash2 color="#0e0f0c" />
                                        </button>

                                    </TableCell>


                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>


                <Pagination pagination={pagination} setPagination={setPagination} />

            </div>

            {isModalOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40">
                    <div className="bg-white rounded-2xl shadow-lg w-[600px] max-h-[90vh] overflow-y-auto p-6 relative">
                        <button
                            onClick={() => setIsModalOpen(false)}
                            className="absolute top-3 right-3 text-black text-3xl "
                        >
                            ×
                        </button>

                        <h2 className="text-lg font-semibold mb-2">
                            Dates {formatDate(dateRange.startDate)} - {formatDate(dateRange.endDate)}
                        </h2>
                        <p className="text-sm text-gray-500 mb-4">Top 5 clubs of the week.</p>

                        {loadingPopup ? (
                            <Loader loading={true} />
                        ) : (
                            <div className="space-y-4">
                                {selectedClubs.map((club, idx) => (
                                    <div
                                        key={club?._id || idx}
                                        className="flex justify-between items-center border-b pb-3 w-[90%] max-w-full gap-2"
                                    >
                                        <div>
                                            <h3 className="font-semibold text-base font-black-4 ">{club?.clubName}</h3>
                                            <div>
                                                <p className="text-sm text-grey-1">
                                                    {[
                                                        club?.location?.streetAddress,
                                                        club?.location?.city,
                                                        club?.location?.state,
                                                        club?.location?.postalCode,
                                                        club?.location?.country
                                                    ]
                                                        .filter(Boolean)
                                                        .join(", ")}
                                                </p>
                                            </div>

                                        </div>
                                        <div className="flex items-center gap-4 w-[18%] max-w-full">
                                            <div className="flex items-center gap-1">
                                                <Star fill="#eab308" color="#eab308" size="18px" />
                                                <p className=" text-yellow-500 font-medium ">
                                                    {club?.averageRating || "0"}
                                                </p>
                                            </div>


                                            <div className="flex items-center gap-1">
                                                <div>
                                                    <svg width="20" height="21" viewBox="0 0 20 21" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                        <g clip-path="url(#clip0_6337_39355)">
                                                            <path d="M4.14285 14.7639L5.32594 13.6591C7.63625 11.3488 6.2234 5.86863 9.52992 2.5621C11.8517 0.240305 14.4931 0.253548 17.3698 3.13019C20.2464 6.00683 20.2597 8.64827 17.9379 10.9701C14.6314 14.2766 9.15121 12.8637 6.8409 15.1741L2.23199 20.1093L0.390625 18.268L1.57355 17.1633" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path fill-rule="evenodd" clip-rule="evenodd" d="M7.6709 12.8298C8.64965 12.4362 9.73844 12.2347 10.8412 12.0536C10.3743 11.7501 9.93039 11.3929 9.5191 10.9816C9.10777 10.5702 8.75059 10.1263 8.44703 9.65942C8.26594 10.7622 8.06445 11.851 7.6709 12.8298Z" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M5.44141 13.7739L6.72656 15.0591" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M12.2119 3.31665L12.2122 3.31693" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M10.9688 4.55933L10.969 4.55956" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M9.72461 5.80225L9.72484 5.80248" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M14.6973 3.31665L14.6975 3.31693" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M13.4541 4.55933L13.4543 4.55956" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M12.2119 5.80225L12.2122 5.80248" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M10.9688 7.04541L10.969 7.04569" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M9.72461 8.28857L9.72484 8.28881" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M15.9404 4.55933L15.9407 4.55956" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M14.6973 5.80225L14.6975 5.80248" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M13.4541 7.04541L13.4543 7.04569" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M12.2119 8.28857L12.2122 8.28881" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M10.9688 9.53125L10.969 9.53148" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M17.1826 5.80225L17.1829 5.80248" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M15.9404 7.04541L15.9407 7.04569" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M14.6973 8.28857L14.6975 8.28881" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M13.4541 9.53125L13.4543 9.53148" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M12.2119 10.7742L12.2122 10.7744" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M17.1826 8.28857L17.1829 8.28881" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M15.9404 9.53125L15.9407 9.53148" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M14.6973 10.7742L14.6975 10.7744" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="22.9256" stroke-linecap="round" stroke-linejoin="round" />
                                                            <path d="M2.8584 15.9634H2.85877" stroke="#252B37" stroke-width="0.781251" stroke-miterlimit="2.6131" stroke-linecap="round" stroke-linejoin="round" />
                                                        </g>
                                                        <defs>
                                                            <clipPath id="clip0_6337_39355">
                                                                <rect width="20" height="20" fill="white" transform="translate(0 0.5)" />
                                                            </clipPath>
                                                        </defs>
                                                    </svg>

                                                </div>
                                                <p className="text-gray-600">
                                                    {club?.totalBookings || "0"}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {isDeleteModalOpen && (
                <div className="fixed z-[999] inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                    <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">
                        <div className="flex justify-between items-center">
                            <h2 className="text-lg text-black-1 font-semibold">
                                Delete This List?
                            </h2>

                            <button
                                className="text-black text-3xl flex mt-[-30px] justify-end"
                                onClick={() => setIsDeleteModalOpen(false)}
                            >
                                ×
                            </button>
                        </div>
                        <p className="text-grey-4 mt-2">
                            Are you sure you want to delete this list?
                        </p>
                        <div className="flex justify-center space-x-3 mt-5">
                            <Button
                                onClick={() => setIsDeleteModalOpen(false)}
                                className="py-2 px-5 border-2  bg-[#F5F7F5] text-primary rounded-full"
                            >
                                No
                            </Button>
                            <Button
                                onClick={handleDelete}
                                disabled={deleting}
                            >
                                {deleting ? "Deleting..." : "Yes, Delete"}
                            </Button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
};

export default WeekClubTable;
