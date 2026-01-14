import { useEffect, useState } from "react";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "../ui/table";
import { useRouter } from "next/router";
import Loader from "../ui/Loader";
import Pagination from "../Paignation";
import { getClubEarningsById } from "@/services/clubServices";
import { formatDate, formatTime } from "@/Utilities/helpers";

const ClubEarningsTable = () => {
    const router = useRouter();
    const { clubId } = router.query;
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const fetchCouponDetail = async (id) => {
        if (!id) return;

        setLoading(true);
        const payload = {
            page: pagination.page,
            limit: pagination.limit,
        };

        try {
            const res = await getClubEarningsById(id, payload);

            if (res?.data) {
                const clubData = res.data;
                setData(clubData);

                if (clubData?.recentTransactions) {
                    setPagination(prev => ({
                        ...prev,
                        totalPages: clubData.recentTransactions.totalPages || 1,
                    }));
                }
            }
        } catch (error) {
            console.error("Error fetching vendor details:", error);
        }
        setLoading(false);
    };


    useEffect(() => {
        if (router.isReady && clubId) {
            fetchCouponDetail(clubId);
        }
    }, [router.isReady, clubId, pagination.page, pagination.limit]);

    return (
        <>
            <Loader loading={loading} />

            <div className="grid grid-cols-1 md:grid-cols-6 gap-4">
                <div className="col-span-1 bg-white rounded-lg p-4 h-24 ">
                    <h2 className="text-base pb-2 text-[#0A0D12] font-semibold">Total Earnings</h2>
                    <p className="text-xl text-black4 font-medium">{data?.totalRevenue || "N/A"}</p>
                </div>

                <div className="col-span-5">
                    <div>

                        <div className="bg-white rounded-3xl">
                            <div>

                                {/* // Table */}

                                <div className="pt-2 px-4">
                                    <h2 className="text-lg pb-6 pt-4 ">Recent Transactions</h2>
                                    <div className="">
                                        <Table className="min-w-full overflow-x-auto ">
                                            <TableHeader className="border-t-1">
                                                <TableRow className="bg-light-blue rounded-lg   ">
                                                    <TableHead className="text-white font-medium text-sm text-left">
                                                        Transaction Id
                                                    </TableHead>
                                                    <TableHead className="text-white font-medium text-sm text-left">
                                                        Title
                                                    </TableHead>
                                                    <TableHead className="text-white font-medium text-sm text-left">
                                                        Date & Time
                                                    </TableHead>
                                                    <TableHead className="text-white font-medium text-sm text-left">
                                                        Amount
                                                    </TableHead>
                                                </TableRow>
                                            </TableHeader>
                                            <TableBody>
                                                {data?.recentTransactions?.results && Array.isArray(data?.recentTransactions?.results) && data?.recentTransactions?.results.length > 0 ? (
                                                    data.recentTransactions?.results.map((e, index) => (
                                                        <TableRow key={index} className="bg-white hover:bg-white cursor-pointer">
                                                            <TableCell>
                                                                <span className="text-black font-normal text-sm text-left truncate...">
                                                                    {e._id || "N/A"}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-black font-normal text-sm text-left truncate...">
                                                                    {e.reason || "N/A"}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-black font-normal text-sm text-left truncate...">
                                                                    {formatDate(e.createdAt) + ", " + formatTime(e.createdAt) || "N/A"}
                                                                </span>
                                                            </TableCell>
                                                            <TableCell>
                                                                <span className="text-black font-normal text-sm text-left truncate...">
                                                                    {e.transactionType == "credit" ? "+ " : "- "}       {+ e.amount + " AED" || "N/A"}
                                                                </span>
                                                            </TableCell>
                                                        </TableRow>
                                                    ))
                                                ) : (
                                                    <TableRow>
                                                        <TableCell colSpan={4} className="text-center text-gray-500">
                                                            No data available
                                                        </TableCell>
                                                    </TableRow>
                                                )}
                                            </TableBody>

                                        </Table>
                                        <Pagination pagination={pagination} setPagination={setPagination} />
                                    </div>
                                </div>
                            </div>

                        </div>


                    </div>

                </div>

            </div>
        </>
    );
}


export default ClubEarningsTable;
