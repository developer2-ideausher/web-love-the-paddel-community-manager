import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { CircleX, Download, SearchIcon } from "lucide-react";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { formatDate, downloadCSV } from "@/Utilities/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { suspendCampaign } from "@/services/promotionServices";
import Loader from "../ui/Loader";
import { ClipLoader } from "react-spinners";
import Pagination from "../Paignation";
import Button from "../Button";
import { deleteAmeneties, getAmenetiesList } from "@/services/amenetiesServices";
import Popuplist from "../Popuplist";
import Dropdown from "../ui/Dropdown";
import { getConflictList } from "@/services/conflictServices";

const ConflictTable = () => {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [filterStatus, setFilterStatus] = useState("");
    const [selectedRows, setSelectedRows] = useState(() => []);
    const [selectedDeleteFaq, setSelectedDeleteFaq] = useState(null);

    const router = useRouter();
    const clearFilter = () => {
        setFilterStatus("");
    };
    let searchTimeout;
    const exportToCSV = () => {
        if (typeof window === "undefined") return;

        const columns = [
            { key: "TicketID", header: "Ticket ID" },
            { key: "UserName", header: "User Name" },
            { key: "Title", header: "Title" },
            { key: "DateCreated", header: "Date Created" },
            { key: "Status", header: "Status" },
        ];

        let exportData = [];

        if (selectedRows.length === 0) {
            exportData = data.map((item) => ({
                TicketID: item?.ticketId || "N/A",
                UserName: (item?.user?.firstName || "") + " " + (item?.user?.lastName || "") || "N/A",
                Title: item?.title || "N/A",
                DateCreated: formatDate(item?.createdAt) || "N/A",
                Status: item?.status || "Unknown",
            }));
        } else {
            exportData = data
                .filter(({ _id }) => selectedRows.includes(_id))
                .map((item) => ({
                    TicketID: item?.ticketId || "N/A",
                    UserName: (item?.user?.firstName || "") + " " + (item?.user?.lastName || "") || "N/A",
                    Title: item?.title || "N/A",
                    DateCreated: formatDate(item?.createdAt) || "N/A",
                    Status: item?.status || "Unknown",
                }));
        }

        downloadCSV(columns, exportData, "conflict_data.csv");
    };


    const fetchConflictsDetails = async () => {
        setLoading(true);
        const payload = {
            page: pagination.page,
            limit: pagination.limit,
            status: filterStatus,
            search: searchTerm.trim(),
        };
        const res = await getConflictList(payload);

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
        fetchConflictsDetails();
    }, [pagination.page, pagination.limit, filterStatus]);
    useEffect(() => {
        if (searchTimeout) clearTimeout(searchTimeout);

        searchTimeout = setTimeout(() => {
            setPagination((prev) => ({
                ...prev,
                page: 1,
            }));
            fetchConflictsDetails();
        }, 1000);

        return () => clearTimeout(searchTimeout);
    }, [searchTerm]);


    return (
        <>
            <Loader loading={loading} />


            <div className="flex items-center justify-between mb-6 rounded-full">
                <InputWithLabel
                    placeholder="Search by title"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyPress={(e) => e.key === "Enter" && fetchUserDetails()}
                    className="text-zinc-500 rounded-full"
                    iconType={"pre"}
                >
                    <SearchIcon />
                </InputWithLabel>
                <div className="flex gap-6">
                    {filterStatus && (
                        <button onClick={clearFilter} className="px-4  rounded-full border-2 text-sm text-[#cc1728] border-[#cc1728]  hover:text-red-500 transition items-center  py-2 flex gap-2 text-nowrap"
                        >   <CircleX color="#cc1728" />
                            Remove Filter
                        </button>
                    )}
                    <Dropdown
                        Title="Filter"
                        filterArray={[
                            { value: "pending", label: "Pending" },
                            { value: "on-hold", label: "On-hold" },
                            { value: "resolved", label: "Resolved" },
                        ]}
                        selectedValue={filterStatus}
                        setHandleFilter={(value) => setFilterStatus(value)}
                    />


                    <div className="flex gap-6 ">

                        <Button
                            onClick={exportToCSV}
                        >
                            Export
                        </Button>

                    </div>

                </div>

            </div>

            <div className="pt-2 ">


                <Table className="min-w-full overflow-x-auto">
                    <TableHeader className="border-t-1">
                        <TableRow className="bg-light-blue rounded-lg  ">

                            <TableHead className="text-white font-normal text-sm text-left">
                                Ticket ID
                            </TableHead>


                            <TableHead className="text-white font-normal text-sm text-left flex items-center gap-1">
                                User Name
                            </TableHead>

                            <TableHead className="text-white font-normal text-sm text-left">
                                Title
                            </TableHead>

                            <TableHead className="text-white font-normal text-sm text-left">
                                Date Created
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
                                            {item?.ticketId}
                                        </span>
                                    </TableCell>


                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {(item?.user?.firstName || item?.user?.lastName) ? `${item?.user?.firstName || ""} ${item?.user?.lastName || ""}` : "N/A"}
                                        </span>
                                    </TableCell>
                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.title}
                                        </span>
                                    </TableCell>
                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {formatDate(item?.createdAt)}
                                        </span>
                                    </TableCell>

                                    <TableCell className="text-center">
                                        <button
                                            className={`cursor-pointer py-1 px-3 rounded-lg text-sm border-2 ${item?.status === "resolved"
                                                ? "text-success border-success"
                                                : item?.status === "pending"
                                                    ? "text-yellow-500 border-yellow-500"
                                                    : item?.status === "on-hold"
                                                        ? "text-blue-500 border-blue-500"
                                                        : "text-gray-500 border-gray-500"
                                                }`}
                                        >
                                            {item?.status === "resolved"
                                                ? "Resolved"
                                                : item?.status === "pending"
                                                    ? "Pending"
                                                    : item?.status === "on-hold"
                                                        ? "On-Hold"
                                                        : "Unknown"}
                                        </button>
                                    </TableCell>



                                    <TableCell className="flex  items-center">
                                        <Popuplist>
                                            <span
                                                value="unfollow"
                                                onClick={() =>
                                                    router.push({
                                                        pathname: `/conflict-management/conflict/${item?._id}`,
                                                    })
                                                }
                                                className="cursor-pointer w-full py-2 px-3 gap-2 flex flex-wrap text-sm items-center text-black hover:text-primary rounded-lg font-normal"
                                            >
                                                View
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

export default ConflictTable;




