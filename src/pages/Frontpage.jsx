import Nav from "../components/frontpage/Nav";
import { Outlet } from "react-router-dom";
import Staff from "../data/Staff.js";

export default function Frontpage() {
  return (
    <div className="bg-primary-bg h-screen flex flex-col">
      <div className="">
        <Nav />
      </div>
      <div className="flex-1">
        <Outlet />
      </div>
    </div>
  );
}
