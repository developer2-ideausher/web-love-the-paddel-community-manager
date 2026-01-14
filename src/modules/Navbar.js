import Link from "next/link";
import React from "react";
import { useRouter } from "next/router";
import { usePathname } from "next/navigation";

import {
  getUser,
  removeToken,
  removeUser,
} from "@/services/firebase-services/cookies";
import { BeatLoader } from "react-spinners";

const sidebarBtns = [
  { name: "Dashboard", path: "dashboard" },

  { name: "Sub-Communities", path: "/sub-communities" },
  {
    name: "Announcements",
    path: "/announcements",
  },
  { name: "Transactions", path: "/transactions" },
  { name: "Settings", path: "/settings" },
];
const SidebarBtn = ({ children, path, isActive, className = "" }) => {
  return (
    <Link
      href={path}
      replace
      className={` 
        group w-full flex items-center gap-2 py-2.5 px-4 text-left transition-all 
        hover:scale-[98%] hover:ease-in-out hover:duration-150 font-medium text-lg hover:text-primary
        ${
          isActive
            ? "bg-primary rounded-r-full text-primary border-primary"
            : "text-white"
        }
        ${className}
      `}
    >
      <span className="flex items-center gap-3 text-lg">{children}</span>
    </Link>
  );
};

export default function Navbar() {
  const router = useRouter();
  const [user, setUser] = React.useState(null);
  const [isReady, setIsReady] = React.useState(false);
  const pathname = usePathname();

  React.useEffect(() => {
    const userData = getUser();
    setUser(userData);
    setIsReady(true);
  }, []);

  const handleLogout = () => {
    removeToken();
    removeUser();
    router.push("/");
  };

  return (
    <div className="h-full bg-white min-h-screen flex flex-col shadow-sm">
      <div className="pt-2">
        <Link href="/admin">
          <img
            src={"/images/logo with bg.png"}
            alt="love the padel Logo"
            className="w-60 mx-auto "
          />
        </Link>
      </div>
      <div className=" mt-4 flex flex-col items-center justify-center  space-y-3 w-full">
        <div className="flex flex-col w-full">
          {isReady ? (
            sidebarBtns.map(({ name, path }) => {
              const isActive =
                path === "/"
                  ? pathname === path
                  : pathname &&
                    path &&
                    pathname.split("/")[1] === path.split("/")[1];

              return (
                <SidebarBtn
                  key={path}
                  path={path}
                  isActive={isActive}
                  className="my-1.5 py-2 hover:text-primary "
                >
                  <p
                    className={`text-base hover:text-primary font-medium  ${
                      isActive
                        ? "text-white hover:text-white py-1.5"
                        : "text-[#373737] "
                    }`}
                  >
                    {name}
                  </p>
                </SidebarBtn>
              );
            })
          ) : (
            <BeatLoader color="#fff" />
          )}
        </div>
      </div>

      <button
        onClick={handleLogout}
        className="sidebarBtn h-9 flex items-center gap-2 hover:bg-primary-2 cursor-pointer"
      >
        <p className="text-primary-6 text-body-1 text-base">Logout</p>
      </button>
    </div>
  );
}
