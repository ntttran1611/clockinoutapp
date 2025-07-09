import dayjs from "dayjs";
import { FiClock } from "react-icons/fi";
import { MdLogout } from "react-icons/md";
import { Link } from "react-router-dom";
import { RiChatSmile3Line } from "react-icons/ri";
import { useStaff } from "../../context/StaffContext";
export default function NavBar({ title }) {
  const { setStaff } = useStaff();
  function handleLogOut() {
    setStaff(null);
  }
  return (
    <div className="flex p-10 w-full justify-between font-vietnam items-center">
      <div className=" text-light-pink font-bold text-2xl flex gap-1 items-center">
        <RiChatSmile3Line />
        {title}
      </div>
      <div className="font-extralight text-sm">
        <p className="flex items-center gap-1">
          <FiClock />
          {dayjs().format("DD/MM/YYYY, HH:mm")} |
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
