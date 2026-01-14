import { useEffect, useState } from "react";
import ApprovedTable from "./ApprovedTable";
import PendingTable from "./PendingTable";
import RejectedTable from "./RejectedTable";
import { getClubList, getVendorList } from "@/services/clubServices";
import Loader from "../ui/Loader";
import { useRouter } from "next/navigation";
import { useSearchParams } from "next/navigation";
import WeekClubTable from "./weekClub";
const ClubManagerTable = () => {
    const router = useRouter();
    const searchParams = useSearchParams();
    const tabFromQuery = searchParams.get("tab") || "approved";
    const [activeTab, setActiveTab] = useState(tabFromQuery);

    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(false);


    const [searchTerm, setSearchTerm] = useState("");
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });

    let searchTimeout;

    const fetchClubDetails = async () => {
        setLoading(true);

        const payload = {
            page: pagination.page,
            limit: pagination.limit,
            search: searchTerm
        };

        if (activeTab === "approved") {
            payload.isApprovedByAdmin = true;
            payload.includeRatings = true;
        } else if (activeTab === "pending") {
            payload.isApprovedByAdmin = null;
        }

        const res = await getClubList(payload);
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
    useEffect(() => {
        fetchClubDetails();
    }, [activeTab, pagination.page, pagination.limit]);

    useEffect(() => {
        const handler = setTimeout(() => {
            if (pagination.page !== 1) {
                setPagination((prev) => ({
                    ...prev,
                    page: 1,
                }));
            } else {
                fetchClubDetails();
            }
        }, 700);

        return () => clearTimeout(handler);
    }, [searchTerm]);

    useEffect(() => {
        setActiveTab(tabFromQuery);
    }, [tabFromQuery]);
    const handleTabChange = (tab) => {
        setActiveTab(tab);
        router.push(`/club-manager-management?tab=${tab}`, { scroll: false });
    };
    return (
        <>
            <div className="mb-4 mt-6 mx-2">
                <div className="flex space-x-8 border-b-2  border-gray-200">
                    <button
                        className={`pb-2  text-base ${activeTab === "approved"
                            ? "border-b-[3px]  border-primary font-medium text-base  text-black-4 pl-1"
                            : "pl-1 text-grey-1 "
                            }`}
                        onClick={() => handleTabChange("approved")}
                    >
                        Registered Clubs{" "}

                    </button>

                    <button
                        className={`pb-2 text-base ${activeTab === "pending"
                            ? "border-b-[3px] border-primary font-medium text-base  text-black-4 pl-1"
                            : "pl-1 text-grey-1 "
                            }`}
                        onClick={() => handleTabChange("pending")}
                    >
                        Pending Clubs Request

                    </button>

                    <button
                        className={`pb-2 text-base ${activeTab === "weekClub"
                            ? "border-b-[3px] border-primary font-medium text-base  text-black-4 pl-1"
                            : "pl-1 text-grey-1 "
                            }`}
                        onClick={() => handleTabChange("weekClub")}
                    >
                        Club Of The Week

                    </button>

                </div>
            </div>
            {loading ? (
                <Loader loading={loading} />
            ) : (
                <>
                    {activeTab === "approved" && (
                        <ApprovedTable
                            data={data}
                            fetchClubs={fetchClubDetails}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            pagination={pagination}
                            setPagination={setPagination}
                            loading={loading}
                        />
                    )}
                    {activeTab === "pending" && (
                        <PendingTable
                            data={data}
                            fetchClubs={fetchClubDetails}
                            searchTerm={searchTerm}
                            setSearchTerm={setSearchTerm}
                            pagination={pagination}
                            setPagination={setPagination}
                            loading={loading}
                            setLoading={setLoading}

                        />
                    )}
                    {activeTab === "weekClub" && (
                        <WeekClubTable
                        />
                    )}

                </>
            )}
        </>
    );
};

export default ClubManagerTable;