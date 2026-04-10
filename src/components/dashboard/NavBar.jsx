import dayjs from "dayjs";
import { FiClock } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { Link, useLocation } from "react-router-dom";
import { useRef, useEffect } from "react";
import { clockSync } from "../../lib/time";
import { useUser } from "../../context/UserContext";
import { removeCookie, signOut } from "../../auth";
export default function NavBar() {
  const location = useLocation();
  const isInStaffLogin = location.pathname === "/dashboard";
  const { setUser } = useUser();
  const clockRef = useRef();
  function handleLogOut() {
    if (isInStaffLogin) {
      localStorage.removeItem("staff");
    } else {
      setUser(null);
      removeCookie("access_token");
      removeCookie("refresh_token");
      signOut();
    }
  }

  useEffect(() => {
    function displayTime() {
      const now = dayjs();
      if (clockRef.current) {
        clockRef.current.innerText = dayjs().format("DD/MM/YYYY, HH:mm");
      }
    }

    clockSync(displayTime);
  }, []);
  return (
    <div className="flex p-10 w-full justify-end font-vietnam items-center">
      <div className="font-extralight text-sm">
        <p className="flex items-center gap-1">
          <FiClock className="h-5 w-5 font-extrabold" />
          <span ref={clockRef}>{dayjs().format("DD/MM/YYYY, HH:mm")}</span> |
          <Link
            onClick={handleLogOut}
            to="/"
            className="flex items-center gap-1 text-alert font-bold underline"
          >
            <MdLogout />
            Log out
          </Link>
        </p>
      </div>
    </div>
  );
}
