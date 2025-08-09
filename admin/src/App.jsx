import React, { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Login from "./pages/Login";
import Navbar from "./components/Navbar";
import SideBar from "./components/SideBar";
import Dashboard from "./pages/admin/Dashboard";
import AllAppointment from "./pages/admin/AllAppointment";
import Doctorlist from "./pages/admin/Doctorlist";
import AddDoctor from "./pages/admin/AddDoctor";
import DoctorDashboard from "./pages/doctor/DoctorDashboard";
import DoctorAppointments from "./pages/doctor/DoctorAppointments";
import DoctorProfile from "./pages/doctor/doctorProfile";

const App = () => {
  const { atoken } = useSelector((state) => state.admin);
  const { dtoken } = useSelector((state) => state.doctor); // Consistent with doctorSlice
  const navigate = useNavigate();

  useEffect(() => {
    console.log(
      "App useEffect: atoken:",
      atoken,
      "dtoken:",
      dtoken,
      "pathname:",
      window.location.pathname
    );
    if (!atoken && !dtoken && window.location.pathname !== "/login") {
      console.log("Redirecting to /login");
      navigate("/login", { replace: true });
    } else if (atoken && window.location.pathname === "/login") {
      console.log("Redirecting to /admin-dashboard");
      navigate("/admin-dashboard", { replace: true });
    } else if (dtoken && window.location.pathname === "/login") {
      console.log("Redirecting to /doctor-dashboard");
      navigate("/doctor-dashboard", { replace: true });
    }
  }, [atoken, dtoken, navigate]);

  return (
    <>
      <ToastContainer />
      {atoken ? (
        // Admin Layout
        <>
          <Navbar />
          <div className="flex items-start">
            <SideBar />
            <Routes>
              <Route path="/admin-dashboard" element={<Dashboard />} />
              <Route path="/all-appointments" element={<AllAppointment />} />
              <Route path="/doctors-list" element={<Doctorlist />} />
              <Route path="/add-doctor" element={<AddDoctor />} />
              <Route
                path="*"
                element={<Navigate to="/admin-dashboard" replace />}
              />
            </Routes>
          </div>
        </>
      ) : dtoken ? (
        // Doctor Layout
        <>
          <Navbar />
          <div className="flex items-start">
            <SideBar />
            <Routes>
              <Route path="/doctor-dashboard" element={<DoctorDashboard />} />
              <Route
                path="/doctor-appointments"
                element={<DoctorAppointments />}
              />
              <Route path="/doctor-profile" element={<DoctorProfile />} />
              <Route
                path="*"
                element={<Navigate to="/doctor-dashboard" replace />}
              />
            </Routes>
          </div>
        </>
      ) : (
        // Unauthenticated Routes
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      )}
    </>
  );
};

export default App;
