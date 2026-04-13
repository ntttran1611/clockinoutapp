import { BrowserRouter, Routes, Route } from "react-router-dom";
import Frontpage from "./pages/Frontpage";
import StaffLogin from "./pages/StaffLogin";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import PageNotFound from "./pages/PageNotFound";
import AdminDashboard from "./pages/AdminDashboard";
import StaffManager from "./pages/StaffManager";
import ClockManager from "./pages/ClockManager";
import StatManager from "./pages/StatManager";
import { UserProvider } from "./context/UserContext";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <UserProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Frontpage />}>
              <Route index element={<StaffLogin />} />
              <Route path="adminlogin" element={<AdminLogin />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/admin" element={<AdminDashboard />}>
              <Route index element={<ClockManager />} />
              <Route path="clocks" element={<ClockManager />} />
              <Route path="staff" element={<StaffManager />} />
              <Route path="stat" element={<StatManager />} />
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </UserProvider>
    </QueryClientProvider>
  );
}

export default App;
