// pages/user-details.js
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
import Button from "@/components/Button";
import UserProfile from "@/components/UsersPage/UserProfile";
import Loader from "@/components/ui/Loader";
import { getBookingListById, getUserById, getUserList } from "@/services/userServices";
import { useRouter } from "next/router";
import Pagination from "@/components/Paignation";
export default function UserDetailsPage() {
  const [userDetail, setUserDetail] = useState({})
  const [bookingData, setBookingData] = useState([])

  const [userCouponList, setuserCouponList] = useState(null)
  const [totalCouponsRedeemed, setTotalCouponsRedeemed] = useState(null)
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const router = useRouter();
  const { userId } = router.query;
  const fetchUserDetails = async (userId) => {
    setLoading(true);
    const res = await getUserById(userId);
    if (res.status) {
      setUserDetail(res?.data);
      setTotalCouponsRedeemed(res?.data?.coupons?.totalDocs);
      setuserCouponList(res?.data?.coupons || { redeemedCoupons: [] });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (userId) {
      fetchUserDetails(userId);
    }
  }, [router.isReady, userId]);
  const fetchBookingDetails = async () => {
    setLoading(true);
    const payload = {
      page: pagination.page,
      limit: pagination.limit,
      bookingInitiatorUser: userId
    }
    const res = await getBookingListById(payload);
    if (res.status) {
      setBookingData(res?.data?.results)
      setPagination({
        page: res?.data?.page,
        limit: res?.data?.limit,
        totalPages: res?.data?.totalPages,
      });
    }

    setLoading(false);
  };

  useEffect(() => {
    if (!router.isReady) return;
    if (userId) { fetchBookingDetails(); }

  }, [router.isReady, pagination.page, pagination.limit, userId]);
  return (
    <Layout title={"Users"}>
      <Loader loading={loading} />
      <div className="container mx-auto px-4 mt-4" >
        <div className="flex justify-between items-center">
          <div className="mt-4 mb-3">
            <h2 className="text-black-3 text-sm font-normal cursor-pointer">
              <Link className={"text-black-3 hover:text-primary hover:underline"} href="/user-management">User Management</Link> {" "}
              <span className="text-black-3 text-sm font-medium">
                &gt; User Details{" "}
              </span>
            </h2>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="col-span-1">
            <UserProfile data={userDetail} couponsRedeemed={totalCouponsRedeemed} />
          </div>

          <div className="col-span-3 bg-white rounded-lg">
            <div>
              <div>

                <div className="pt-2 px-4">
                  <h2 className="text-xl pb-6 pt-4 ">Court Bookings</h2>
                  <div className="">
                    <Table className="min-w-full overflow-x-auto ">
                      <TableHeader className="border-t-1">
                        <TableRow className="bg-light-blue rounded-lg">
                          <TableHead className="text-white font-medium text-sm text-left">
                            Club Name
                          </TableHead>
                          <TableHead className="text-white font-medium text-sm text-left">
                            Court Name
                          </TableHead>
                          <TableHead className="text-white font-medium text-sm text-left">
                            Date
                          </TableHead>
                          <TableHead className="text-white font-medium text-sm text-left">
                            Time
                          </TableHead>
                          {/* <TableHead className="text-white font-medium text-sm text-left">
                            Sport
                          </TableHead> */}

                        </TableRow>
                      </TableHeader>
                      <TableBody>

                        {!Array.isArray(bookingData) || bookingData.length === 0 ? (<TableRow> <TableCell
                          colSpan={5}
                          className="text-center py-4 text-gray-500"
                        >
                          No Data Found
                        </TableCell></TableRow>) : (bookingData?.map((item) => {
                          return (
                            <TableRow
                              key={item._id}
                              className="bg-white hover:bg-white cursor-pointer"
                            >
                              <TableCell>
                                <span className="text-black font-normal text-sm text-left truncate...">
                                  {item?.club?.clubName || "N/A"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-black font-normal text-sm text-left truncate...">
                                  {(item?.court?.name) || "N/A"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-black font-normal text-sm text-left truncate...">
                                  {item?.date || "N/A"}
                                </span>
                              </TableCell>
                              <TableCell>
                                <span className="text-black font-normal text-sm text-left">
                                  {(item?.timeSlot) || "N/A"}

                                </span>
                              </TableCell>
                              
                            </TableRow>
                          )
                        }))

                        }

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
    </Layout>
  );
}
