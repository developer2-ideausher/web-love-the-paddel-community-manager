import React, { useState, useEffect } from "react";
import Layout from "@/layout/Layout";
import Link from "@/components/Link";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";

import ClubEarningsTable from "@/components/clubManager/clubEarningsTable";
import RatingFeedback from "@/components/clubManager/RatingFeedback";
import { useRouter } from "next/router";
import { getClubById, suspendClub } from "@/services/clubServices";
import Loader from "@/components/ui/Loader";
import ClubProfile from "@/components/clubManager/ClubProfile";
import { convertTo12Hour } from "@/Utilities/helpers";
import CouponsTable from "@/components/clubManager/Coupons";
import Button from "@/components/Button";
import { ClipLoader } from "react-spinners";
export default function Index() {
    const router = useRouter();
    const { clubId, tab } = router.query;
    const [activeTab, setActiveTab] = useState("ClubDetails");
    const [isActive, setIsActive] = useState(true);
    const [data, setData] = useState([]);
    const [coupondata, setCouponData] = useState([]);
    const [loading, setLoading] = useState(false);
    const [selectedRows, setSelectedRows] = useState([]);

    const [isProcessing, setIsProcessing] = useState(false);


    const [showSuspendModal, setShowSuspendModal] = useState(false)
    const [pagination, setPagination] = useState({
        page: 1,
        limit: 10,
        totalPages: 1,
    });
    const [couponRefreshTrigger, setCouponRefreshTrigger] = useState(false);

    useEffect(() => {
        if (!router.isReady) return;

        if (tab) {
            setActiveTab(decodeURIComponent(tab.replace(/\+/g, " ")));
        } else {
            setActiveTab("ClubDetails");
        }
    }, [router.isReady, tab]);
    useEffect(() => {
        if (tab) {
            setActiveTab(decodeURIComponent(tab.replace(/\+/g, ' ')));
        }
    }, [tab]);
    const triggerCouponRefresh = () => {
        setCouponRefreshTrigger((prev) => !prev);
    };
    const closeSuspendModal = () => {
        setShowSuspendModal(false);
    };

    const fetchClubDetail = async (id) => {
        if (!id) return;

        setLoading(true);

        try {
            const res = await getClubById(id);

            if (res?.data) {
                const clubData = res?.data;
                setData(clubData);
                setIsActive(clubData?.activeStatus);
            }
        } catch (error) {
            console.error("Error fetching vendor details:", error);
        }
        setLoading(false);
    };

    useEffect(() => {
        if (router.isReady && clubId) {
            fetchClubDetail(clubId);
        }
    }, [router.isReady, clubId, activeTab, pagination.page, pagination.limit]);


    const handleToggleSuspend = async () => {
        setLoading(true);
        try {
            await suspendClub(clubId);
            await fetchClubDetail(clubId);
            setShowSuspendModal(false);
        } catch (error) {
            console.error("Error suspending/restoring:", error);
        } finally { setLoading(false); }

    };

    const handleTabChange = (tabName) => {
        router.push({ pathname: `/club-manager-management/${clubId}`, query: { tab: encodeURIComponent(tabName) } }, undefined, { shallow: true });
    }; 
    if (!router.isReady) return null;  
    return (
        <Layout title={"Club Manager Management"}>
            {loading ? (
                <Loader loading={true} />
            ) : (

                <div className="container mx-auto px-4 mt-4" >
                    <div className="flex justify-between items-center mb-7">
                        <div className="mt-4 mb-3">
                            <h2 className="text-black-3 text-sm font-normal cursor-pointer">
                                <Link href="/club-manager-management" className={"text-black-3  text-sm font-medium hover:text-primary hover:underline"}>Club Manager Management</Link> {" "}
                                <span className="text-black-3 text-sm font-medium">
                                    &gt; Club Details{" "}
                                </span>
                            </h2>
                        </div>
                    </div>

                    <div className="mb-4 mt-6 mx-2 flex justify-between border-b-2  border-gray-200">
                        <div className="flex space-x-8 ">
                            <button
                                className={`pb-2 ${activeTab === "ClubDetails" ? "border-b-[3px] border-primary font-medium text-base text-black-4 pl-1" : "pl-1 text-grey-1"}`}
                                onClick={() => handleTabChange("ClubDetails")}
                            >
                                Club Details 
                            </button>
                            <button
                                className={`pb-2 ${activeTab === "clubEarnings" ? "border-b-[3px] border-primary font-medium text-base text-black-4 pl-1" : "pl-1 text-grey-1"}`}
                                onClick={() => handleTabChange("clubEarnings")}
                            >
                                Club Earnings
                            </button>
                            <button
                                className={`pb-2 ${activeTab === "ClubRatingReviews" ? "border-b-[3px] border-primary font-medium text-base text-black-4 pl-1" : "pl-1 text-grey-1"}`}
                                onClick={() => handleTabChange("ClubRatingReviews")}
                            >
                                Club Rating & Reviews
                            </button>
                            <button
                                className={`pb-2 ${activeTab === "Coupons" ? "border-b-[3px] border-primary font-medium text-base text-black-4 pl-1" : "pl-1 text-grey-1"}`}
                                onClick={() => handleTabChange("Coupons")}
                            >
                                Coupons
                            </button>

                        </div>
                        <div>
                            {activeTab === "ClubDetails" && (
                                <div>
                                    <Button onClick={() => setShowSuspendModal(true)}>
                                        {isActive ? "Suspend" : "Restore"}
                                    </Button>
                                </div>
                            )}


                        </div>
                    </div>

                    {activeTab === "ClubDetails" && (

                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                            <div className="col-span-1">
                                <ClubProfile data={data} />
                            </div>

                            <div className="col-span-3">
                                <div>
                                    <div className="bg-white rounded-lg p-4">
                                        <h2 className="text-lg pb-6 pt-4 ">Description</h2>
                                        <p>{data?.clubDescription} </p>

                                    </div>
                                    <div className="bg-white rounded-lg">
                                        <div>
                                            <div className="pt-2 px-4">
                                                <h2 className="text-lg pb-6 pt-4 ">Timings</h2>
                                                <div className="">
                                                    <Table className="min-w-full overflow-x-auto ">
                                                        <TableHeader className="border-t-1">
                                                            <TableRow className="bg-light-blue rounded-lg  ">
                                                                <TableHead className="text-white font-normal text-sm text-left">
                                                                    Days
                                                                </TableHead>
                                                                <TableHead className="text-white font-normal text-sm text-left">
                                                                    Opening Timings
                                                                </TableHead>
                                                                <TableHead className="text-white font-normal text-sm text-left">
                                                                    Closed Timings
                                                                </TableHead>
                                                            </TableRow>
                                                        </TableHeader>
                                                        <TableBody>
                                                            {data?.openingHours && Array.isArray(data?.openingHours) && data?.openingHours.length > 0 ? (
                                                                data.openingHours.map((dummyData, index) => (
                                                                    <TableRow key={index} className="bg-white hover:bg-white cursor-pointer">
                                                                        <TableCell>
                                                                            <span className="text-black font-normal text-sm text-left truncate...">
                                                                                {dummyData.day || "N/A"}
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <span className="text-black font-normal text-sm text-left truncate...">
                                                                                {convertTo12Hour(dummyData.openingTime || "N/A")}
                                                                            </span>
                                                                        </TableCell>
                                                                        <TableCell>
                                                                            <span className="text-black font-normal text-sm text-left truncate...">
                                                                                {convertTo12Hour(dummyData.closingTime || "N/A")}
                                                                            </span>
                                                                        </TableCell>
                                                                    </TableRow>
                                                                ))
                                                            ) : (
                                                                <TableRow>
                                                                    <TableCell colSpan={3} className="text-center text-gray-500">
                                                                        No timings available
                                                                    </TableCell>
                                                                </TableRow>
                                                            )}
                                                        </TableBody>

                                                    </Table>

                                                </div>
                                            </div>
                                        </div>

                                    </div>

                                    {/* <div className="bg-white rounded-lg p-4">
                                        <h2 className="text-lg pb-6 pt-4 ">Cancellation Policy</h2>
                                        <p> </p>

                                    </div> */}
                                </div>

                            </div>

                        </div>

                    )}

                    {/* { coupons created} */}

                    {activeTab === "clubEarnings" && (
                        <ClubEarningsTable
                        />

                    )}

                    {/* { rating and feedback} */}
                    {activeTab === "ClubRatingReviews" && (
                        <RatingFeedback pagination={pagination}
                            setPagination={setPagination}
                            clubId={clubId}
                            loading={loading}
                            setLoading={setLoading}
                            data={data} />
                    )}

                    {activeTab === "Coupons" && (
                        <CouponsTable pagination={pagination}
                            setPagination={setPagination}
                            clubId={clubId}
                            loading={loading}
                            setLoading={setLoading}
                            data={data} />
                    )}

                    {showSuspendModal && (
                        <div className="fixed z-[999] inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
                            <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">

                                <div className="flex justify-between items-center">
                                    <h2 className="text-lg text-black-1 font-semibold">
                                        {isActive ? "Suspend this Club?" : "Restore this Club?"}
                                    </h2>
                                    <button
                                        className="text-black text-3xl flex mt-[-30px] justify-end"
                                        onClick={closeSuspendModal}
                                    >
                                        ×
                                    </button>
                                </div>

                                <p className="text-grey-4 mt-2">
                                    {isActive
                                        ? "Are you certain you wish to Suspend this club? Suspending it will remove it from the admin panel, but it will remain in the database. You can restore the club at any time."
                                        : "Do you want to restore this club?"}
                                </p>
                                {/* Buttons */}
                                <div className="flex justify-center space-x-3 mt-5">
                                    <Button
                                        className="py-2 px-5 border-2  bg-[#F5F7F5] text-primary rounded-full"
                                        onClick={closeSuspendModal}
                                    >
                                        No
                                    </Button>
                                    <Button onClick={handleToggleSuspend} disabled={isProcessing}>
                                        {isProcessing ? <ClipLoader color="white" size={20} /> : (isActive ? "Yes, Suspend" : "Yes, Restore")}
                                    </Button>

                                </div>
                            </div>
                        </div>
                    )}
                </div>)}
        </Layout>
    );
}
