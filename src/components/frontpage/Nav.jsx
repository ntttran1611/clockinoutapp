import { Link, useLocation } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { AiOutlineClockCircle } from "react-icons/ai";
import dayjs from "dayjs";
import { useEffect, useRef } from "react";
import { clockSync } from "../../lib/time";

export default function Nav() {
  const clockRef = useRef();
  const location = useLocation();
  const isInStaffLogin = location.pathname === "/";

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
    <div className=" bg-bar flex items-center p-5 w-full justify-between">
      <img src="/logo.png" />
      <div className=" font-vietnam font-medium text-mocha">
        <Link to={isInStaffLogin ? "adminlogin" : "/"} className="underline">
          {isInStaffLogin ? (
            <p className="flex items-center gap-1">
              <RiAdminFill />
              Go to Admin
            </p>
          ) : (
            <p className="flex items-center gap-1">
              <AiOutlineClockCircle />
              Go to Staff Clock In/Out
            </p>
          )}
        </Link>
        <div className="font-vietnam text-end text-xs text-text-secondary font-light italic mt-1">
          <p ref={clockRef}></p>
        </div>
      </div>
    </div>
  );
}
