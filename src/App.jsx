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
import { AuthProvider } from "./context";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import BranchManager from "./pages/BranchManager";
import { ProtectedRoute } from "./components";
function App() {
  return (
    <QueryClientProvider client={new QueryClient()}>
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Frontpage />}>
              <Route index element={<StaffLogin />} />
              <Route path="adminlogin" element={<AdminLogin />} />
            </Route>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route element={<ProtectedRoute allowedRole="admin" />}>
              <Route path="/admin" element={<AdminDashboard />}>
                <Route index element={<ClockManager />} />
                <Route path="clocks" element={<ClockManager />} />
                <Route path="staff" element={<StaffManager />} />
                <Route path="branches" element={<BranchManager />} />
                <Route path="analytics" element={<StatManager />} />
              </Route>
            </Route>
            <Route path="*" element={<PageNotFound />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;
