import "./App.css";
import { useEffect, useState } from "react";
import axios from "axios";
import PrivateWrapper from "./wrapper/PrivateWrapper";
import PublicWrapper from "./wrapper/PublicWrapper";
import { useDispatch } from "react-redux";
import { keep } from "./store/reducer/authSlice";
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./page/Home";
import LogIn from "./page/LogIn";
import Profile from "./page/Profile";
import RegisterUser from "./page/admin/RegisterStaff";
import SetAccount from "./page/staff/SetAccount";
import LiveAttendance from "./page/staff/LiveAttendance";
import PrivateAdminWrapper from "./wrapper/PrivateAdminWrapper";
import PrivateStaffWrapper from "./wrapper/PrivateStaffWrapper";
import AttendanceLog from "./page/staff/AttendanceLog";
import Payroll from "./page/staff/PayrollHistory";

function App() {
  const dispatch = useDispatch()
  const token = localStorage.getItem("token");

  useEffect(() => {
    if (token) {
      dispatch(keep(token));
    }
  }, [dispatch, token]);

  return (
    <Router>
      <Routes>
        {/* public */}
        <Route element={<PublicWrapper />}>
          <Route path="/login" element={<LogIn />} />
          <Route path="/staff/setup/:token" element={<SetAccount />} />
        </Route>

        {/* private */}
        <Route element={<PrivateWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/profile" element={<Profile />} />
        </Route>

        <Route element={<PrivateAdminWrapper />}>
          <Route path="/register-staff" element={<RegisterUser />} />
        </Route>

        {/* private and staff */}
        <Route element={<PrivateStaffWrapper />}>
          <Route path="/live-attendance" element={<LiveAttendance />} />
          <Route path="/my-attendances" element={<AttendanceLog />} />
          <Route path="/my-payroll" element={<Payroll />} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
