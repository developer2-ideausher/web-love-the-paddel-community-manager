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
import { formatDate } from "@/Utilities/helpers";
import { useRouter } from "next/router";

import Loader from "../ui/Loader";
import Pagination from "../Paignation";
const ApprovedTable = ({
    data,
    searchTerm,
    setSearchTerm,
    pagination,
    setPagination, loading, fetchClubs

}) => {

    const router = useRouter();
    function calculatePlanEndDate(startDateString, validityInDays) {
        if (!startDateString || !validityInDays) return "N/A";

        const startDate = new Date(startDateString);
        if (isNaN(startDate)) return "N/A";

        const endDate = new Date(startDate);
        endDate.setDate(endDate.getDate() + validityInDays);

        const day = String(endDate.getDate()).padStart(2, '0');
        const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const month = monthNames[endDate.getMonth()];
        const year = endDate.getFullYear();

        return `${day}-${month}-${year}`;
    }
    return (
        <>
            <Loader loading={loading} />
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


            </div >
            <div className="pt-2 ">
                <Table className="min-w-full overflow-x-auto">
                    <TableHeader className="border-t-1">
                        <TableRow className="bg-light-blue rounded-lg  ">

                            {/* ID Column */}
                            <TableHead className="text-white font-medium text-sm text-left">
                                Club Name
                            </TableHead>

                            {/* Business Name Column */}
                            <TableHead className="text-white font-medium text-sm text-left">
                                Subscription Plan

                            </TableHead>

                            {/* Phone Number Column */}
                            <TableHead className="text-white font-medium text-sm text-left">
                                Total Earnings
                            </TableHead>

                            {/* Category Column */}
                            <TableHead className="text-white font-medium text-sm text-left">
                                Subscription Expiry Date
                            </TableHead>

                            {/* Registration Date Column */}
                            <TableHead className="text-white font-medium text-sm text-left">
                                Club Rating

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
                                            {item?.clubName || "N/A"}
                                        </span>
                                    </TableCell>
                                    <TableCell
                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.plan?.planName || "N/A"}{" "} <br />

                                        </span>

                                    </TableCell>
                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.totalEarnings || "N/A"}

                                        </span>
                                    </TableCell>


                                    <TableCell
                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {calculatePlanEndDate(item?.planStartDate, item?.plan?.validityInDays)}
                                        </span>
                                    </TableCell>
                                    <TableCell

                                    >
                                        <span className="text-black-3 font-normal text-sm text-left truncate...">
                                            {item?.averageRating}
                                        </span>
                                    </TableCell>

                                    <TableCell >
                                        <Link href={`/club-manager-management/${item._id}`}>
                                            <span className="text-black-3 font-normal text-sm text-left">View</span>

                                            {/* <Eye color="#0e0f0c" /> */}
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

export default ApprovedTable;
