import { suspendUser } from "@/services/userServices";
import { calculateAge, formatDate } from "@/Utilities/helpers";
import { ArrowRight, ChevronRight } from "lucide-react";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
export default function UserProfile({ data, couponsRedeemed }) {
  const route = useRouter()
  const { id } = route.query;
  const [userdetails, setUserdetails] = useState(data);
  const [showModal, setShowModal] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [showAllClubs, setShowAllClubs] = useState(false);

  useEffect(() => {
    setUserdetails(data);
  }, [data]);
  // Open modal
  const openModal = (userId, isBlocked) => {
    setSelectedUser({ userId, isBlocked });
    setShowModal(true);
  };

  // Close modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleToggleStatus = async () => {
    if (!selectedUser) return;
    setIsProcessing(true);

    await suspendUser(selectedUser.userId);

    setUserdetails((prev) => ({
      ...prev,
      isBlocked: !prev.isBlocked,
    }));

    setIsProcessing(false);
    closeModal();
  };
  return (
    <div className="p-4 border rounded-lg pt-7 bg-white">
      {/* User Image */}
      <img
        src={
          userdetails?.profilePic?.url ? userdetails?.profilePic?.url : "/images/dummyUser.png"
        }
        alt={userdetails?.name}
        className="w-32 h-32 mx-auto "
      />

      {/* User Name */}
      <h2 className="font-semibold text-black-4 text-center pt-4 text-xl ">
        {userdetails?.firstName || "N/A"} {" "}  {userdetails?.lastName}
      </h2>

      <div className="space-y-6 mt-7">
        <div className="flex flex-col">
          <p className="text-sm font-normal text-grey-1  leading-5">
            Email Address
          </p>

          <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">

            {userdetails?.email || "N/A"}

          </p>
        </div>
        <div className="flex flex-col">
          <p className="text-sm font-normal text-grey-1  leading-5">
            Phone Number
          </p>

          <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
            {userdetails?.phone || "N/A"}

          </p>
        </div>

        <div className="flex flex-col">
          <p className="font-medium text-base text-black-1">Playing Preferences :</p>
          <p className="text-sm font-normal text-grey-1  leading-5">

            Playing level
          </p>
          <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
            {userdetails?.Playinglevel || "N/A"}

          </p>
          <p className="text-sm font-normal text-grey-1  leading-5">
            Preferred Hand
          </p>
          <p className="text-sm font-medium text-black-1 leading-6 pt-1 ">
            {userdetails?.handedPlayer || "N/A"}

          </p>

        </div>

        <div className="flex flex-col">
          <p className="text-sm font-normal text-grey-1  leading-5">
            Preferred Court Side
          </p>
          <p className="text-sm font-medium text-black-1 leading-6 pt-1 capitalize">
            {userdetails?.preferredCourtside || "N/A"}

          </p>
        </div>

        <div className="flex flex-col">
          <p className="text-sm font-normal text-grey-1 leading-5">
            Favorite Clubs
          </p>

          {/* Clubs List */}
          <div className="flex flex-col">
            {(userdetails?.favoriteClubs || [])
              .slice(0, showAllClubs ? userdetails.favoriteClubs.length : 3)
              .map((favClub) => (
                <p
                  key={favClub?._id}
                  className="text-sm font-medium text-black-1 leading-6 pt-1 capitalize"
                >
                  {favClub?.clubName || "N/A"}
                </p>
              ))}

            {/* View All / Show Less Button */}
            {userdetails?.favoriteClubs?.length > 3 && (
            <div className="pt-3"> 
              <button
                className="mt-2 text-base text-primary font-semibold flex underline self-start"
                onClick={() => setShowAllClubs(!showAllClubs)}
              >
                {showAllClubs ? "Show Less" : "View All"} <ChevronRight/>
              </button> </div>
            )}
          </div>
        </div>

      </div>
      {/* Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-700 bg-opacity-75 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-semibold">
                {selectedUser?.isBlocked ? "Activate User?" : "Suspend User?"}
              </h2>
              <button className="text-black text-3xl flex mt-[-30px] justify-end" onClick={closeModal}>×</button>

            </div>
            <p className="text-gray-600 mt-2">
              Are you sure you want to {selectedUser?.isBlocked ? "activate" : "suspend"} this user?
            </p>

            {/* Buttons */}
            <div className="flex justify-end space-x-3 mt-5">
              <button
                className="py-2 w-1/2 px-5 border-2 border-red-500 text-red-500 rounded-lg"
                onClick={closeModal}
              >
                No
              </button>
              <button
                className="py-2 w-1/2 px-5 bg-red-500 text-white rounded-lg flex items-center justify-center"
                onClick={handleToggleStatus}
                disabled={isProcessing}
              >
                {isProcessing ? <ClipLoader color="white" size={20} /> : " Yes"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
