import { cn } from "@/Utilities/cn";
import { getInitials } from "@/Utilities/helpers";
import NotificationDropdown from "@/components/NotificationDropdown";
import Navbar from "@/modules/Navbar";
import { getProfile } from "@/services/profileServices";
import { Bell } from "lucide-react";
import Link from "next/link";
import { useState, useEffect } from "react";

export default function Layout({ children, className, title }) {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  return (
    <>
      <div className={cn("wrapper h-screen overflow-hidden flex", className)}>
        <aside className="w-64 shrink-0 sticky top-0 h-screen overflow-y-auto overscroll-contain z-40">
          <Navbar />
        </aside>

        <main className="flex-1 h-screen overflow-y-auto">
          <div className="w-full bg-white flex items-center justify-between h-16 pt-5 pb-5 px-8 shadow-lg sticky top-0 z-50">
            <div className="text-center">
              <h1 className="font-bold text-black-1 text-xl">{title}</h1>
            </div>
            <div className="flex items-center space-x-7 bg-neutral-1000 border-neutral-1000 rounded-lg pt-3 pb-3 pr-4 pl-4">
              <div className="relative">
                <NotificationDropdown />
              </div>
            </div>
          </div>

          <div className="w-full my-4 px-6">{children}</div>
        </main>
      </div>

    </>
  );
}

