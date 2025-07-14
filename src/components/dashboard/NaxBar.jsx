import dayjs from "dayjs";
import { FiClock } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiChatSmile3Line } from "react-icons/ri";
import { useRef, useEffect } from "react";
import { clockSync } from "../../lib/time";
export default function NavBar({ title }) {
  const clockRef = useRef();
  function handleLogOut() {
    localStorage.removeItem("staff");
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
    <div className="flex p-10 w-full justify-between font-vietnam items-center">
      <div className=" text-light-pink font-bold text-2xl flex gap-1 items-center">
        <RiChatSmile3Line />
        {title}
      </div>
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
