import { BrowserRouter, Routes, Route ,Navigate} from "react-router-dom";
import AdminRequest from "./pages/admin_portal";
import LandingPage      from "./pages/LandingPage";
import Login            from "./pages/Login";
import Signup           from "./pages/Signup";
import ForgotPassword   from "./pages/ForgotPassword";
import ResetPassword    from "./pages/ResetPassword";
import Dashboard        from "./pages/dashboard";
import VirtualInterview from "./pages/virtualinterview";
import ProtectedRoute   from "./component/ProtectedRoute";
import Admin            from "./pages/admin";
import Practice from "./pages/practice";
import CompanyPage from "./pages/CompanyPage";
import PracticeQuestions from "./pages/PracticeQuestions";
function AdminProtectedRoute({ children }) {
  const role = localStorage.getItem("role");

  if (role !== "admin") {
    return <Navigate to="/login" />;
  }

  return children;
}
function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login"element={<Login />} />
        <Route path="/signup"element={<Signup />} />
        <Route path="/forgot-password"element={<ForgotPassword />} />
        <Route path="/reset-password"element={<ResetPassword />} />
        <Route path="/admin"element={<AdminProtectedRoute><Admin /></AdminProtectedRoute>}/>
        <Route path="/admin_portal" element={<AdminRequest/>}/>
        <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>}/>
        <Route path="/practice" element={<ProtectedRoute><Practice /></ProtectedRoute>}/>
        <Route path="/virtual-interview"element={<ProtectedRoute><VirtualInterview /></ProtectedRoute>}/>
        <Route path="/practice/:companyName" element={<CompanyPage />} />  
        <Route path="/practice/:companyName/questions"element={<PracticeQuestions />}/>      
      </Routes>
    </BrowserRouter>
  );
}

export default App;
