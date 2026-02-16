import { Navigate, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const location = useLocation();
  const token = localStorage.getItem("token");

  // treat empty string or "null" as not logged in
  const isAuthenticated =
    token && token !== "null" && token.trim().length > 0;

  if (!isAuthenticated) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
