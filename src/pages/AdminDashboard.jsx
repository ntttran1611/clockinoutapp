import { useEffect, useState, useRef } from "react";
import { SideBar, NavBar } from "../components";
import TabLink from "../components/admindashboard/TabLink";
import { FaRegClock, FaStore } from "react-icons/fa";
import { IoBarChartOutline } from "react-icons/io5";
import { MdPeopleAlt } from "react-icons/md";
import { Outlet, useNavigate } from "react-router-dom";
import { useUser, UserProvider } from "../context/UserContext";

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
    setTabBgPos(tabSize.height * (tabOrder - 1));
  }, [tabOrder]);

  return tempUser ? (
    <UserProvider>
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
            <div className="flex-1">
              <hr className="text-mocha-30" />
              <Outlet />
            </div>
          </div>
        </div>
      </div>
    </UserProvider>
  ) : (
    <div className="h-screen flex items-center justify-center">
      <span className="loading loading-spinner loading-xl "></span>
    </div>
  );
}
