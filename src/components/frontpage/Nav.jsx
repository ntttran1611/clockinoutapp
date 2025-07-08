import { Link, useLocation } from "react-router-dom";
import { RiAdminFill } from "react-icons/ri";
import { AiOutlineClockCircle } from "react-icons/ai";
import dayjs from "dayjs";
import { useEffect, useState } from "react";

export default function Nav() {
  const [currentTime, setCurrentTime] = useState(
    dayjs().format("DD/MM/YYYY HH:mm")
  );
  const location = useLocation();
  const isInStaffLogin = location.pathname === "/";

  useEffect(() => {
    setCurrentTime(dayjs().format("DD/MM/YYYY HH:mm"));

    const interval = setInterval(() => {
      setCurrentTime(dayjs().format("DD/MM/YYYY HH:mm"));
    }, 60000); //60000ms = 1m

    //cleanup on unmout
    return () => clearInterval(interval);
  });

  return (
    <div className=" bg-bar flex items-center p-5 w-full justify-between">
      <img src="/logo.png" />
      <div className=" font-vietnam font-medium text-deep-green ">
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
          <p>{currentTime}</p>
        </div>
      </div>
    </div>
  );
}
