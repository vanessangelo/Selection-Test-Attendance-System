import "./App.css";
import { useEffect, useState } from "react";
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

function App() {
  const dispatch = useDispatch()

  useEffect(() => {
    if (localStorage.getItem("token")) {
      dispatch(keep(localStorage.getItem("token")));
    }
  }, [dispatch])


  return (
    <Router>
      <Routes>
        {/* public */}
        <Route element={<PublicWrapper />}>
          <Route path="/login" element={<LogIn />} />
        </Route>
        <Route path="/staff/setup/:token" element={<SetAccount />} />

        {/* private */}
        <Route path="/profile" element={<Profile />} />

        {/* private and admin */}
        <Route element={<PrivateWrapper />}>
          <Route path="/" element={<Home />} />
          <Route path="/register-staff" element={<RegisterUser />} />
        </Route>

        {/* private and staff */}
        <Route path="/live-attendance" element={<LiveAttendance />} />
      </Routes>
    </Router>
  );
}

export default App;
