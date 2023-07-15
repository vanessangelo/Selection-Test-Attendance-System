import React from "react";
import { HiUser, HiUserAdd, HiClock, HiCalendar, HiCreditCard } from "react-icons/hi"
import { FaSignOutAlt } from "react-icons/fa"
import { Link, useLocation, useNavigate } from "react-router-dom";
import { remove } from "../store/reducer/authSlice"
import { useDispatch } from "react-redux";

const adminRoutes = [
    { to: "/profile", icon: HiUser, name: "Profile" },
    { to: "/register-staff", icon: HiUserAdd, name: "Register Staff" }
]

const staffRoutes = [
    { to: "/profile", icon: HiUser, name: "Profile" },
    { to: "/live-attendance", icon: HiClock, name: "Live Attendance" },
    { to: "/my-attendance", icon: HiCalendar, name: "My Attendance" },
    { to: "/my-payroll", icon: HiCreditCard, name: "My Payroll" }
]

export default function Sidebar() {
    const dummyRole = "staff"
    const role = "admin"

    const location = useLocation();
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const routes = role === dummyRole ? adminRoutes : staffRoutes;

    const handleLogout = () => {
        localStorage.removeItem("token");
        dispatch(remove());
        navigate("/login");
    };
    return (
        <>
            <div className="font-rob text-base grid content-between">
                <div>
                    {routes.map(({ to, icon: Icon, name }, idx) => (
                        <Link key={idx} to={to} className={`mx-2 flex h-14 text-darkpurple bg-white items-center hover:bg-purplee hover:text-magnolia my-1 py-2 rounded-2xl ${location.pathname === to ? "border-b-2 border-purplee rounded-none" : ""}`}>
                            <div className="w-8 h-8 flex items-center justify-center mx-2">
                                <Icon size={30} />
                            </div>
                            <div className={`hidden sm:block ml-1`}>{name}</div>
                        </Link>
                    ))}
                </div>
                <div className="border-t-2">
                    <div className="mx-2 flex h-14 text-darkpurple bg-white items-center hover:bg-purplee hover:text-magnolia my-1 py-2 rounded-2xl hover:cursor-pointer" onClick={handleLogout}>
                        <div className="w-8 h-8 flex items-center justify-center mx-2">
                            <FaSignOutAlt size={25} />
                        </div>
                        <div className="hidden sm:block ml-1">
                            Log Out
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}