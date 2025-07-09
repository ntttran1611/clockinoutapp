import { BrowserRouter, Routes, Route } from "react-router-dom";
import Frontpage from "./pages/Frontpage";
import StaffLogin from "./pages/StaffLogin";
import Dashboard from "./pages/Dashboard";
import AdminLogin from "./pages/AdminLogin";
import PageNotFound from "./pages/PageNotFound";
import { StaffProvider } from "./context/StaffContext";
function App() {
  return (
    <StaffProvider>
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
    </StaffProvider>
  );
}

export default App;
