import { useEffect, useState } from "react";
import { Navigate, Route, Routes, useNavigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";

function Protected({ children }) {
  return localStorage.getItem("careerforge_token") ? children : <Navigate to="/login" replace />;
}

export default function App() {
  const [user, setUser] = useState(() => JSON.parse(localStorage.getItem("careerforge_user") || "null"));

  const saveAuth = (data) => {
    localStorage.setItem("careerforge_token", data.token);
    localStorage.setItem("careerforge_user", JSON.stringify(data.user));
    setUser(data.user);
  };

  const logout = () => {
    localStorage.removeItem("careerforge_token");
    localStorage.removeItem("careerforge_user");
    setUser(null);
  };

  return (
    <Routes>
      <Route path="/login" element={user ? <Navigate to="/" /> : <Login onAuth={saveAuth} />} />
      <Route path="/register" element={user ? <Navigate to="/" /> : <Register onAuth={saveAuth} />} />
      <Route path="/" element={<Protected><Dashboard user={user} onLogout={logout} /></Protected>} />
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
