import { Routes, Route, Navigate } from "react-router-dom";
import ProtectedRoute from "./components/ProtectedRoute";
import Layout from "./layouts/Layout";

import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Dashboard";
import Upload from "./pages/Upload";
import Interview from "./pages/Interview";
import Profile from "./pages/Profile";

/* helper — check auth */
function PublicOnly({ children }) {
  const token = localStorage.getItem("token");
  return token ? <Navigate to="/" replace /> : children;
}

function App() {
  return (
    <Routes>

      {/* ---------------- PUBLIC ROUTES ---------------- */}

      <Route
        path="/login"
        element={
          <PublicOnly>
            <Login />
          </PublicOnly>
        }
      />

      <Route
        path="/signup"
        element={
          <PublicOnly>
            <Signup />
          </PublicOnly>
        }
      />

      {/* ---------------- PROTECTED ROUTES ---------------- */}

      <Route
        path="/"
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        <Route path="upload" element={<Upload />} />
        <Route path="interview" element={<Interview />} />
        <Route path="profile" element={<Profile />} />
      </Route>

      {/* ---------------- FALLBACK ---------------- */}

      <Route path="*" element={<Navigate to="/" replace />} />

    </Routes>
  );
}

export default App;
