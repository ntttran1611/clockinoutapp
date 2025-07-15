/**
 * TODO:
 * 1/ Clean up folders
 * 1/ Create a sidebar for the admin page including: clocks, staff, statistics
 * 2/ Set Routes for these breadcrumbs
 * 3/ Authentication
 * 4/ Display clock table
 *
 */

import SideBar from "../components/dashboard/SideBar";

export default function AdminDashboard() {
  return (
    <div className="h-screen">
      <div>
        <SideBar></SideBar>
      </div>
    </div>
  );
}
