import { Nav } from "../components";
//with {}: default export (even if default export from the original file,
// but still using named export if from an index file), without {} named export
import { Outlet } from "react-router-dom";

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
