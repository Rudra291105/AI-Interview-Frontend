import { Routes, Route } from "react-router-dom";
import Login          from "../pages/Login";
import Signup         from "../pages/Signup";
import ForgotPassword from "../pages/ForgotPassword";
import ResetPassword  from "../pages/ResetPassword";

// Note: Full routing including Dashboard is handled in App.jsx
// This component is kept for reference only.
function AppRoutes() {
  return (
    <Routes>
      <Route path="/login"           element={<Login />} />
      <Route path="/signup"          element={<Signup />} />
      <Route path="/forgot-password" element={<ForgotPassword />} />
      <Route path="/reset-password"  element={<ResetPassword />} />
    </Routes>
  );
}

export default AppRoutes;
