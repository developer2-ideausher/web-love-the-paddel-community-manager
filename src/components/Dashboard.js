import { InputWithLabel } from "@/components/ui/InputWithLabel";
import {
  ArrowUpDown,
  ChevronDown,
  Download,
  Eye,
  EyeIcon,
  LocateIcon,
  MapPin,
  SearchIcon,
  Trash2,
} from "lucide-react";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "./ui/table";
import Link from "next/link";
import { formatDate, downloadCSV } from "@/Utilities/helpers";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import {
  deleteCampaign,
  getCampaignList,
  suspendCampaign,
} from "@/services/promotionServices";
import Loader from "./ui/Loader";
import { ClipLoader } from "react-spinners";
import Pagination from "./Paignation";
import Button from "./Button";
import { deleteAmeneties } from "@/services/amenetiesServices";
import Popuplist from "./Popuplist";
import PromoCard from "./discountManagement/PromoCard";
import { deleteCoupon, getCouponsList } from "@/services/discountServices";
import TableNoHeader from "./ui/TableNoHeader";
const sampleMatches = [
  {
    id: "1",
    name: "Weeknend Paddlers tournament",
    location: "Downtown Paddlers club",
    dateTime: "12th June 2024, 5:00 PM",
    playersCurrent: 8,
    playersMax: 16,
    type: "Friendly",
  },
  // Add more objects...
];
const Dashboard = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    totalPages: 1,
  });
  const [sortBy, setSortBy] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedDeleteFaq, setSelectedDeleteFaq] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const router = useRouter();
  let searchTimeout;

  // const fetchCouponDetails = async () => {
  //   setLoading(true);
  //   const payload = {
  //     page: pagination.page,
  //     limit: pagination.limit,
  //   };
  //   const res = await getCouponsList(payload);

  //   if (res.status) {
  //     setData(res?.data?.results);
  //     setPagination({
  //       page: res?.data?.page,
  //       limit: res?.data?.limit,
  //       totalPages: res?.data?.totalPages,
  //     });
  //   }
  //   setLoading(false);
  // };

  // useEffect(() => {
  //   fetchCouponDetails();
  // }, [pagination.page, pagination.limit]);
  // useEffect(() => {
  //   if (searchTimeout) clearTimeout(searchTimeout);

  //   searchTimeout = setTimeout(() => {
  //     setPagination((prev) => ({
  //       ...prev,
  //       page: 1,
  //     }));
  //     fetchCouponDetails();
  //   }, 1000);

  //   return () => clearTimeout(searchTimeout);
  // }, [searchTerm]);

  const openDeleteModal = (faqId) => {
    setSelectedDeleteFaq(faqId);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedDeleteFaq(null);
  };

  const handleDeleteCoupon = async () => {
    setIsProcessing(true);
    try {
      await deleteCoupon(selectedDeleteFaq);
      fetchCouponDetails();
      closeDeleteModal();
    } catch (error) {
      console.error("Failed to delete amenity:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const openModal = (userId, isActive) => {
    setSelectedUser({ userId, isActive });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = async (id) => {
    setIsProcessing(true);
    await suspendCampaign(id);
    fetchCouponDetails();
    setIsProcessing(false);
    closeModal();
  };

  return (
    <>
      <Loader loading={loading} />
      <div className="flex flex-col justify-between gap-[16px] mt-8 mb-6">
        <h1 className="text-2xl font-semibold ">Welcome,Community Manager</h1>
        <p className="text-base">
          {" "}
          Manage your communities, matches, and announcements{" "}
        </p>
      </div>
      <PromoCard />
      <div className="flex flex-row gap-[25px]">
        <div className="w-2/3">
          <TableNoHeader
            data={sampleMatches}
            onViewAll={() => router.push("/matches")}
          />
        </div>

        <div className="w-1/3 p-6 mt-10 bg-white shadow-lg rounded-3xl">
          <h2 className="mb-4 text-xl font-normal font-helvetica">
            Recent Activity
          </h2>

          <ul className="space-y-4">
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-500" />
                <span className="text-gray-700">
                  New community "Downtown Paddlers" created.
                </span>
              </div>
              <span className="text-sm text-gray-400">2 hrs ago</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <LocateIcon className="text-gray-500" />
                <span className="text-gray-700">
                  Match "Weekend Paddlers Tournament" scheduled.
                </span>
              </div>
              <span className="text-sm text-gray-400">5 hrs ago</span>
            </li>
            <li className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <MapPin className="text-gray-500" />
                <span className="text-gray-700">
                  Transaction of $150 completed in "City Paddlers" community.
                </span>
              </div>
              <span className="text-sm text-gray-400">1 day ago</span>
            </li>
          </ul>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
