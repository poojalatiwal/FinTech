import {
  BrowserRouter,
  Routes,
  Route,
  Navigate
} from "react-router-dom";

import OAuthSuccess from "./pages/OAuthSuccess";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Expenses from "./pages/Expenses";
import AdminDashboard from "./pages/Admin/AdminDashboard";

import ProtectedRoute from "./routes/ProtectedRoute";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>

        <Route
          path="/"
          element={<Navigate to="/login" />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/oauth-success"
          element={<OAuthSuccess />}
        />

        {/* USER ROUTES */}

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />

        <Route
          path="/expenses"
          element={
            <ProtectedRoute>
              <Expenses />
            </ProtectedRoute>
          }
        />

        {/* ADMIN ROUTE */}

        <Route
          path="/admin/dashboard"
          element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          }
        />

        {/* INVALID ROUTE */}

        <Route
          path="*"
          element={<Navigate to="/login" />}
        />

      </Routes>
    </BrowserRouter>
  );
}