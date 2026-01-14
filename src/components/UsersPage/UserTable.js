import Dropdown from "@/components/ui/Dropdown";
import { InputWithLabel } from "@/components/ui/InputWithLabel";
import { ArrowUpDown, Download, Eye, SearchIcon } from "lucide-react";
import { ClipLoader } from "react-spinners";
import { useEffect, useState } from 'react'
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
import { getUserList, suspendUser } from "@/services/userServices";
import Loader from "../ui/Loader";
import Pagination from "../Paignation";
const UserTable = () => {

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

  const router = useRouter();
  let searchTimeout;

  const fetchUserDetails = async () => {
    setLoading(true);
    const payload = {
      page: pagination.page,
      limit: pagination.limit,
      search: searchTerm.trim(),
    };
    const res = await getUserList(payload);

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
    fetchUserDetails();
  }, [pagination.page, pagination.limit]);

 useEffect(() => {
    const handler = setTimeout(() => {
        setPagination((prev) => ({
            ...prev,
            page: 1,
        }));

        fetchUserDetails();
    }, 700);

    return () => clearTimeout(handler);
}, [searchTerm]);


  const openModal = (userId, status) => {
    setSelectedUser({ userId, status });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = async (id) => {
    setIsProcessing(true);
    await suspendUser(id);
    fetchUserDetails();
    setIsProcessing(false);
    closeModal();
  };



  return (
    <>
      <Loader loading={loading} />
      <div className="flex items-center justify-between mb-3">
    <InputWithLabel
  placeholder="Search"
  value={searchTerm}
  onChange={(e) => setSearchTerm(e.target.value)}
  onKeyPress={(e) => {
    if (e.key === "Enter") {
      setPagination((prev) => ({ ...prev, page: 1 }));
      fetchUserDetails();
    }
  }}
  className="text-zinc-500 rounded-full"
  iconType={"pre"}
>
  <SearchIcon />
</InputWithLabel>

      </div>
      <div className="pt-2 ">
        <div className="mb-4 mx-2">
          <div className="flex space-x-8 border-b-2  border-gray-200">

          </div>
        </div>

        <Table className="min-w-full overflow-x-auto">
          <TableHeader className="border-t-1">
            <TableRow className="bg-light-blue rounded-lg  ">


              <TableHead className="text-white font-medium text-sm text-left">
                User Id
              </TableHead>
              <TableHead className="text-white font-medium text-sm text-left flex items-center gap-1">
                User Name
              </TableHead>
              <TableHead className="text-white font-medium text-sm text-left">
                Email Address
              </TableHead>


              <TableHead className="text-white font-medium text-sm text-left">
                Phone Number
              </TableHead>

              <TableHead className="text-white font-medium text-sm flex items-center gap-1 text-center justify-center">
                Status
              </TableHead>
              <TableHead className="text-white font-medium text-sm text-center">
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
                  className="bg-white hover:bg-white "
                >

                  <TableCell
                  >
                    <span className="text-black-3 font-normal text-sm text-left truncate...">
                      {item?._id || "N/A"}
                    </span>
                  </TableCell>
                  <TableCell
                  >
                    <span className="text-black-3 font-normal text-sm text-left truncate...">
                      {(item?.firstName || item?.lastName) ? `${item?.firstName || ""} ${item?.lastName || ""}` : "N/A"}
                    </span>
                  </TableCell>
                  <TableCell
                  >
                    <span className="text-black-3 font-normal text-sm text-left truncate...">

                      {item.email || "N/A"}
                    </span>
                  </TableCell>

                  <TableCell
                  >
                    <span className="text-black-3 font-normal text-sm text-left truncate...">

                      {item.phone || "N/A"}
                    </span>
                  </TableCell>



                  <TableCell className="text-center ">
                    <button
                      className={`cursor-pointer py-1 px-3 rounded-lg text-sm border-2 ${item?.status === "active"
                          ? "text-success font-normal border-success"
                          : "text-red-500 font-normal border-red-500"
                        }`}
                      onClick={() => openModal(item._id, item?.status)}
                    >
                      {item?.status === "active" ? "Active" : "Suspended"}
                    </button>

                  </TableCell>
                  <TableCell className="flex justify-center items-center">
                    <Link href={`/user-management/${item._id}`}>
                      <span className="text-black-3 font-normal text-sm text-left truncate...">View</span>

                    </Link>
                  </TableCell>

                </TableRow>
              ))
            )}
          </TableBody>
        </Table>

        <Pagination pagination={pagination} setPagination={setPagination} />


        {showModal && (
          <div className="fixed z-50 inset-0 flex items-center justify-center bg-gray-500 bg-opacity-70">
            <div className="bg-white px-9 py-8 rounded-lg shadow-lg w-96">

              <div className="flex justify-between items-center">

                <h2 className="text-lg text-black-1 font-semibold">
                  {selectedUser?.status === "active" ? "Suspend User?" : "Activate User?"}
                </h2>
                <button className="text-black text-3xl flex mt-[-30px] justify-end" onClick={closeModal}>×</button>
              </div>
              <p className="text-grey-1 mt-2">
                Are you sure you want to {selectedUser?.status === "active" ? "suspend" : "activate"} this user?
              </p>

              {/* Buttons */}
              <div className="flex justify-center space-x-3 mt-5">
                <button
                  className="py-2 w-1/2 px-5 border-2 border-primary text-primary rounded-lg"
                  onClick={closeModal}
                >
                  No
                </button>
                <button
                  className="py-2 w-1/2 px-5 bg-primary text-white rounded-lg flex items-center justify-center"
                  onClick={() => handleToggleStatus(selectedUser.userId)}
                  disabled={isProcessing}
                >
                  {isProcessing ? <ClipLoader color="white" size={20} /> : "Yes"}
                </button>
              </div>
            </div>
          </div>
        )}                                                                                     

      </div>
    </>
  );
};

export default UserTable;
