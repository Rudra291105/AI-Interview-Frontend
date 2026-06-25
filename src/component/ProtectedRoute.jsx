import { Navigate } from "react-router-dom";
import { getAccessToken } from "../utils/api";

function ProtectedRoute({ children }) {
  const token = getAccessToken();
  if (!token) {
    return <Navigate to="/login" replace />;
  }
  return children;
}

export default ProtectedRoute;
