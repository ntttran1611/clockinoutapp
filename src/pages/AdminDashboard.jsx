import { useEffect, useState, useRef } from "react";
import { SideBar, NavBar } from "../components";
import TabLink from "../components/admindashboard/TabLink";
import { FaRegClock, FaStore } from "react-icons/fa";
import { IoBarChartOutline } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { Outlet, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context";
import { getSession } from "../api";

const TAB_MAP = {
  clocks: 1,
  staff: 2,
  branches: 3,
  analytics: 4,
};

export default function AdminDashboard() {
  const navigate = useNavigate();
  const location = useLocation();
  const tabRef = useRef();
  const { user, role, loading } = useAuth();
  const [tabOrder, setTabOrder] = useState(() => {
    const saved = localStorage.getItem("adminTabOrder");
    return saved ? parseInt(saved) : 1;
  });
  const [tabSize, setTabSize] = useState({ height: 0, width: 0 });
  const [tabBgPos, setTabBgPos] = useState(0);

  useEffect(() => {
    if(!user || !role || role !== "admin"){
      navigate("/")
    }
  }, []);

  useEffect(() => {
    const pathSegments = location.pathname.split("/");
    const currentTab = pathSegments[pathSegments.length - 1];
    if (TAB_MAP[currentTab]) {
      setTabOrder(TAB_MAP[currentTab]);
    }
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem("adminTabOrder", tabOrder.toString());
  }, [tabOrder]);

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

    updateTabSize();
    const timer = setTimeout(updateTabSize, 50);

    window.addEventListener("resize", updateTabSize);
    return () => {
      clearTimeout(timer);
      window.removeEventListener("resize", updateTabSize);
    };
  }, [tabOrder]);

  useEffect(() => {
    setTabBgPos(tabSize.height * (tabOrder - 1));
  }, [tabOrder, tabSize.height]);

  return user ? (
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
              backgroundColor: "rgb(66, 43, 35, 0.8)",
              zIndex: -1,
              transition: "top 0.2s ease",
            }}
          ></div>
          <TabLink
            ref={tabRef}
            tabOrder={tabOrder}
            id={1}
            to="clocks"
            onClick={() => setTabOrder(1)}
            icon={FaRegClock}
            label="Clocks"
          />
          <TabLink
            tabOrder={tabOrder}
            id={2}
            to="staff"
            onClick={() => setTabOrder(2)}
            icon={MdPeopleAlt}
            label="Staff"
          />
          <TabLink
            tabOrder={tabOrder}
            id={3}
            to="branches"
            onClick={() => setTabOrder(3)}
            icon={FaStore}
            label="Branches"
          />
          <TabLink
            tabOrder={tabOrder}
            id={4}
            to="analytics"
            onClick={() => setTabOrder(4)}
            icon={IoBarChartOutline}
            label="Analytics"
          />
        </div>
      </SideBar>
      <div className="flex-1 h-screen hidden lg:block">
        <div className="flex flex-col h-full">
          <NavBar welcomeMessage={`Welcome back, is today a busy day?`} />
          <div className="flex-1 flex flex-col overflow-hidden">
            <hr className="text-mocha-30" />
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
