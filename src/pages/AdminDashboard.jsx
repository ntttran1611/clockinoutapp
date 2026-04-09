/**
 * TODO:
 * 1/ Clean up folders - DONE
 * 1/ Create a sidebar for the admin page including: clocks, staff, statistics - DONE
 * 2/ Set Routes for these breadcrumbs - DONE
 * 2/ Implement background color of tabs changes as routes changing - DONE
 * 3/ Authentication - DONE
 * 4/ Display clock table
 *
 */

import { useEffect, useState, useRef } from "react";
import { SideBar, NavBar } from "../components";
import { FaRegClock } from "react-icons/fa";
import { IoBarChartOutline } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { Link, Outlet, useNavigate } from "react-router-dom";
import { useUser } from "../context/UserContext";

export default function AdminDashboard() {
  const navigate = useNavigate();
  const tabRef = useRef();
  const { tempUser } = useUser();
  const [tabOrder, setTabOrder] = useState(1);
  const [tabSize, setTabSize] = useState({ height: 0, width: 0 });
  const [tabBgPos, setTabBgPos] = useState(0);
  useEffect(() => {
    if (!tempUser) {
      navigate("/");
    }
  }, []);
  useEffect(() => {
    function updateTabSize() {
      if (tabRef.current) {
        setTabSize((prev) => ({
          ...prev,
          height: tabRef.current.getBoundingClientRect().height,
          width: tabRef.current.getBoundingClientRect().width,
        }));
      }
    }
    (updateTabSize(), window.addEventListener("resize", updateTabSize));
    return () => window.removeEventListener("resize", updateTabSize);
  }, []);

  useEffect(() => {
    if (document.getElementById("tabs")) {
      const tabList = document.getElementById("tabs").children;
      for (let tab of tabList) {
        tab.className = "";
      }
      document.getElementById(`${tabOrder}`).className =
        "text-white font-medium";
      setTabBgPos(tabSize.height * (tabOrder - 1));
    }
  }, [tabOrder]);
  return tempUser ? (
    <div className="h-screen flex font-vietnam">
      <SideBar footer="Sweeties Administrator">
        <div id="tabs" className="relative w-full font-light">
          <div
            style={{
              top: tabBgPos,
              left: 0,
              width: tabSize.width,
              height: tabSize.height,
              position: "absolute",
              backgroundColor: "#8ba888",
              zIndex: -1,
              transition: "top 0.2s ease",
            }}
          ></div>
          <Link
            ref={tabRef}
            id="1"
            to="clocks"
            onClick={() => setTabOrder(1)}
            className="text-white font-medium"
          >
            <div className="flex w-full items-center justify gap-2 px-5 py-3">
              <FaRegClock className="h-5 w-5" /> <p>Clocks</p>
            </div>
          </Link>
          <Link id="2" className="" to="staff" onClick={() => setTabOrder(2)}>
            <div className="flex w-full items-center justify gap-2 px-5 py-3 ">
              <MdPeopleAlt className="h-5 w-5" /> <p>Staff</p>
            </div>
          </Link>
          <Link id="3" className="" to="stat" onClick={() => setTabOrder(3)}>
            <div className="flex w-full items-center justify gap-2 px-5 py-3 ">
              <IoBarChartOutline className="h-5 w-5" /> <p>Statistics</p>
            </div>
          </Link>
        </div>
      </SideBar>
      <div className="flex-1 h-screen hidden lg:block">
        <div className="flex flex-col h-full">
          <div className="basis-1/6">
            <NavBar title={`Welcome back, Sweeties Admin!`} />
          </div>
          <div className="basis-5/6">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-xl "></span>
    </div>
  );
}
