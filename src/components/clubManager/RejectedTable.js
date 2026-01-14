import Dropdown from "@/components/ui/Dropdown";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { ArrowUpDown, ChevronDown, Download, Eye, EyeIcon, SearchIcon } from "lucide-react";
import { BeatLoader } from "react-spinners";

import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { ArrowLeft, ArrowRight } from "lucide-react";
import Popuplist from "../Popuplist";
import Link from "next/link";
import { formatDate, downloadCSV } from "@/Utilities/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import CategoryDropdown from "./CategoryDropdown";
import Pagination from "../Paignation";
const RejectedTable = ({
    data,
    searchTerm,
    setSearchTerm,
    pagination,
    setPagination,
    sortBy,
    setSortBy,
    onCategoryChange,
    filterApplied,
    onClearFilter,
}) => {
    const [selectedCategories, setSelectedCategories] = useState([]);

    const [selectedRows, setSelectedRows] = useState(() => []);
    const router = useRouter();
    const [isClient, setIsClient] = useState(false);
    const handleCategoryApply = (categories) => {
        setSelectedCategories(categories);
        onCategoryChange(categories);
    };

    const handleCheckboxChange = (id) => {
        setSelectedRows((prev) =>
            prev.includes(id) ? prev.filter((rowId) => rowId !== id) : [...prev, id]
        );
    };
    const toggleSort = (field) => {
        if (sortBy === `${field}_asc`) {
            setSortBy(`${field}_desc`);
        } else {
            setSortBy(`${field}_asc`);
        }
    };
    const exportToCSV = () => {
        if (typeof window === "undefined") return;

        const columns = [
            { key: "ID", header: "Vendor ID" },
            { key: "BusinessName", header: "Business Name" },
            { key: "Address", header: "Address" },
            { key: "Phone", header: "Phone Number" },
            { key: "Category", header: "Category" },
            { key: "RegistrationDate", header: "Registration Date" },
            { key: "RejectedReason", header: "Rejected Reason" },
            { key: "RejectedDate", header: "Rejected Date" },
        ];

        let exportData = [];

        if (selectedRows.length === 0) {
            exportData = data.map(({
                _id, businessName, address, phoneNumber,
                businessCategories, createdAt, updatedAt, RejectedReason
            }) => ({
                ID: _id,
                BusinessName: businessName || "N/A",
                Address: address || "N/A",
                Phone: phoneNumber || "N/A",
                Category: businessCategories?.map(cat => cat.name).join(", ") || "--",
                RegistrationDate: formatDate(createdAt),
                RejectedReason: RejectedReason || "N/A",
                RejectedDate: formatDate(updatedAt),
            }));
        } else {
            exportData = data
                .filter(({ _id }) => selectedRows.includes(_id))
                .map(({
                    _id, businessName, address, phoneNumber,
                    businessCategories, createdAt, updatedAt, RejectedReason
                }) => ({
                    ID: _id,
                    BusinessName: businessName || "N/A",
                    Address: address || "N/A",
                    Phone: phoneNumber || "N/A",
                    Category: businessCategories?.map(cat => cat.name).join(", ") || "--",
                    RegistrationDate: formatDate(createdAt),
                    RejectedReason: RejectedReason || "N/A",
                    RejectedDate: formatDate(updatedAt),
                }));
        }

        downloadCSV(columns, exportData, "rejected_vendors_data.csv");
    };


    useEffect(() => {
        setIsClient(true);
    }, []);
    return (
        <>

            <div className="flex items-center justify-between mb-3">
                <InputWithLabel
                    placeholder="Search by business name"

                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-zinc-500"
                    iconType={"pre"}
                >
                    <SearchIcon />
                </InputWithLabel>
                <div className="flex gap-6 mb-3 items-center">
                    <CategoryDropdown
                        selectedCategories={selectedCategories}
                        setSelectedCategories={setSelectedCategories}
                        onApply={handleCategoryApply}
                        filterApplied={filterApplied}
                        onClear={onClearFilter}
                    />

                    <div className="flex gap-6 ">
                        {isClient && (
                            <button
                                onClick={exportToCSV}
                                className="bg-white border px-4 py-3 rounded-md flex gap-2 items-center"
                            >
                                <Download color="#5D5D5D" />
                                <span className="text-black-1 text-sm font-medium"> Export to CSV</span>
                            </button>
                        )}


                    </div>

                </div>
            </div>
            <div className="pt-2 ">

                <Table className="min-w-full overflow-x-auto">
                    <TableHeader className="border-t-1">
                        <TableRow className="bg-neutral hover:bg-liteOrange">
                            <TableHead>

                                <input
                                    type="checkbox"
                                    onChange={(e) =>
                                        setSelectedRows(e.target.checked ? data.map((d) => d._id) : [])
                                    }
                                    checked={data.length > 0 && selectedRows.length === data.length}
                                />

                            </TableHead>
                            <TableHead className="text-black-1 font-normal text-sm text-left">
                                Id
                            </TableHead>


                            <TableHead className="text-black-1 font-normal text-sm text-left flex items-center gap-1">
                                Business Name <ArrowUpDown size={"16px"} color="#111" onClick={() => toggleSort("businessName")}
                                    className="cursor-pointer" />
                            </TableHead>
                            <TableHead className="text-black-1 font-normal text-sm text-left">
                                Category
                            </TableHead>
                            <TableHead className="text-black-1 font-normal text-sm text-left flex items-center gap-1">
                                Registration Date
                                <ArrowUpDown size={"16px"} color="#111" onClick={() => toggleSort("date")}
                                    className="cursor-pointer" />
                            </TableHead>

                            <TableHead className="text-black-1 font-normal text-sm text-left">
                                Rejected Reason
                            </TableHead>
                            <TableHead className="text-black-1 font-normal text-sm text-left flex items-center gap-1">
                                Rejected Date
                                <ArrowUpDown size={"16px"} color="#111" onClick={() => toggleSort("date")}
                                    className="cursor-pointer" />
                            </TableHead>

                            <TableHead className="text-black-1 font-normal text-sm text-left">
                                Action
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {data.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={9} className="text-center py-4 text-gray-500">
                                    No Data Found
                                </TableCell>
                            </TableRow>
                        ) : (
                            data.map((item, index) => (
                                <TableRow key={index} className="bg-white hover:bg-white cursor-pointer">
                                    <TableCell>
                                        <input
                                            type="checkbox"
                                            checked={selectedRows.includes(item._id)}
                                            onChange={() => handleCheckboxChange(item._id)}
                                        />
                                    </TableCell>

                                    {/* Id */}
                                    <TableCell>
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item._id}
                                        </span>
                                    </TableCell>

                                    {/* Business Name */}
                                    <TableCell
                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.businessName || "N/A"}{" "} <br />
                                            <span className="text-gray-700 font-normal text-sm text-left truncate..."> {item?.address}{" "}</span>
                                        </span>
                                    </TableCell>

                                    {/* Category */}
                                    <TableCell>
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.businessCategories?.map(category => category.name).join(", ") || "--"}
                                        </span>
                                    </TableCell>

                                    {/* Registration Date */}
                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {formatDate(item?.createdAt) || "N/A"}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item.rejectionReason
                                                ? item.rejectionReason.type === "other"
                                                    ? item.rejectionReason.customReason || "N/A"
                                                    : item.rejectionReason.type
                                                : "N/A"}
                                        </span>
                                    </TableCell>

                                    <TableCell>
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {formatDate(item.updatedAt)}
                                        </span>
                                    </TableCell>
                                    {/* Action Column - Fix Misalignment */}
                                    <TableCell className="text-black-3 font-normal text-sm text-left truncate...">
                                        <Link
                                            href={{
                                                pathname: `/club-manager-management/rejected/${item._id}`,
                                                query: {
                                                    rejectionReason: item.rejectionReason?.type === "other"
                                                        ? item.rejectionReason.customReason
                                                        : item.rejectionReason?.type || "N/A"
                                                }
                                            }}
                                        >
                                            <Eye color="#0e0f0c" />
                                        </Link>



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

export default RejectedTable;
