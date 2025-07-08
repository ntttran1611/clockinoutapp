import { BrowserRouter, Routes, Route } from "react-router-dom";
import Frontpage from "./pages/Frontpage";
import StaffLogin from "./pages/StaffLogin";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import PageNotFound from "./pages/PageNotFound";
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Frontpage />}>
          <Route index path="/" element={<StaffLogin />} />
          <Route path="adminlogin" element={<AdminLogin />} />
        </Route>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
