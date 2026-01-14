import { useState, useEffect, useRef } from "react";
import { Bell } from "lucide-react";
import Button from "./Button";
import { useNotification } from "@/context/NotificationContext";
import { useRouter } from "next/router";
import Link from "next/link";
import { readUnreadNotification } from "@/services/notificationServices";

export default function NotificationDropdown() {
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [pageloading, setPageLoading] = useState(false);
  const { unreadData, loading, refreshNotifications } = useNotification();
  const toggleDropdown = () => setOpen((v) => !v);

  const router = useRouter();
  const containerRef = useRef(null);
  useEffect(() => {
    const handleClickAway = (e) => {
      if (!containerRef.current) return;
      if (!containerRef.current.contains(e.target)) setOpen(false);
    };

    const handleKey = (e) => {
      if (e.key === "Escape") setOpen(false);
    };

    document.addEventListener("mousedown", handleClickAway);
    document.addEventListener("touchstart", handleClickAway, { passive: true });
    document.addEventListener("keydown", handleKey);

    return () => {
      document.removeEventListener("mousedown", handleClickAway);
      document.removeEventListener("touchstart", handleClickAway);
      document.removeEventListener("keydown", handleKey);
    };
  }, []);

  useEffect(() => {
    const closeOnRoute = () => setOpen(false);
    router.events?.on("routeChangeStart", closeOnRoute);
    return () => router.events?.off("routeChangeStart", closeOnRoute);
  }, [router.events]);


  const handleNotificationClick = async (notification) => {
    try {
      const payload = {
        ids: [notification._id],
      };
      await readUnreadNotification(payload);
      await refreshNotifications();
      setOpen(false);
    } catch (err) {
      console.error("Failed to mark notification as read", err);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const allIds = unreadData?.unreadNotifications?.map((n) => n._id) || [];
      if (allIds.length === 0) return;

      const payload = { ids: allIds };

      await readUnreadNotification(payload);
      await refreshNotifications();
    } catch (err) {
      console.error("Failed to mark all notifications as read", err);
    }
  };


  return (
    <div className="relative" ref={containerRef}>
      <div onClick={toggleDropdown} className="cursor-pointer relative">
        <Bell className="w-6 h-6 text-[#252b37]" />
        {unreadData?.unreadCount > 0 && (
          <span className="absolute -top-3 -right-4 bg-red-600 text-white text-xs font-semibold px-1.5 py-0.5 rounded-full shadow-md min-w-[20px] text-center">
            {unreadData?.unreadCount}
          </span>
        )}
      </div>

      {open && (
        <div className="absolute px-2 right-0 mt-2 w-96 bg-white shadow-lg rounded-lg z-50 max-h-96 overflow-y-auto">
          <div className="flex border-b items-center justify-between">
            <div className="p-4 font-semibold text-base text-black-1">Notifications</div>
            {unreadData?.unreadNotifications.length > 0 && (
              <div
                className="p-4 font-semibold text-sm text-[#121416] underline cursor-pointer"
                onClick={handleMarkAllAsRead}
              >
                Mark all as read
              </div>
            )}
          </div>


          {!loading && unreadData?.unreadNotifications?.length === 0 && (
            <div className="px-4 py-2 text-center text-base text-gray-500">
              No new notifications
            </div>
          )}

          {!loading && unreadData?.unreadNotifications.length > 0 && (
            <>
              <ul>
                {unreadData?.unreadNotifications.map((item, i) => (
                  <li
                    key={i}
                    onClick={() => handleNotificationClick(item)}
                    className="cursor-pointer px-4 py-2 hover:bg-gray-100 border-b"
                  >
                    <div className="flex justify-between">
                      <span className="font-semibold text-sm text-primary">{item?.title}</span>
                      <span className="text-xs text-gray-400">{item.timeAgo}</span>
                    </div>
                    <p className="text-sm text-black-2 pt-2">{item.description}</p>
                  </li>
                ))}
              </ul>

            </>
          )}

          <Link href={`/notifications`} >
            <Button className={"mt-5 mb-6  px-4 py-2"}> See all notifications </Button> </Link>
        </div>
      )}

    </div>

  );
}
