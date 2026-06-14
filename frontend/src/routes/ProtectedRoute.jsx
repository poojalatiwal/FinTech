import { Navigate } from "react-router-dom";

export default function ProtectedRoute({
  children,
  role
}) {

  const token =
    localStorage.getItem("token");

  const user =
    JSON.parse(
      localStorage.getItem("user") || "{}"
    );

  const userRole =
    user.role;

  // Not logged in
  if (!token) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Role check
  if (
    role &&
    userRole !== role
  ) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  return children;
}