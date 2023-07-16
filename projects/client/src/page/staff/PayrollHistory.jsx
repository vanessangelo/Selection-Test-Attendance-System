import React, { useState, useEffect } from "react";
import Footer from "../../component/Footer";
import Navbar from "../../component/Navbar";
import dayjs from "dayjs";
import Sidebar from "../../component/Sidebar";
import Welcoming from "../../component/Welcoming";
import { useSelector } from "react-redux";
import axios from "axios";
import PayrollHistoryStaff from "../../component/staff/PayrollHistory";

export default function Payroll() {
    const [currentTime, setCurrentTime] = useState(dayjs());
    const [greeting, setGreeting] = useState("");

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(dayjs());
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    useEffect(() => {
        const currentHour = currentTime.hour();
        let text = "";

        if (currentHour >= 5 && currentHour < 12) {
            text = "Good Morning";
        } else if (currentHour >= 12 && currentHour < 18) {
            text = "Good Afternoon";
        } else {
            text = "Good Night";
        }

        setGreeting(text);
    }, [currentTime]);

    const [userData, setUserData] = useState([]);
    const token = useSelector((state) => state.auth.token)

    const fetchUserData = async (token) => {
        try {
            const response = await axios.get("http://localhost:8000/api/auth/profile", {
                headers: { Authorization: `Bearer ${token}` },
            });
            const user = response.data.data;
            setUserData(user);
        } catch (error) {
            console.log(error.message);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserData(token);
        }
    }, [token]);
    return (
        <>
            <div className="min-h-full bg-gray-200">
                <div className="h-15 w-full grid justify-center sticky top-0 z-50 bg-white shadow-md">
                    <Navbar />
                </div>
                <div className="grid grid-flow-col grid-rows-5 gap-4 p-4 min-h-full">
                    <div className="col-span-4 bg-white shadow-md">
                        <Welcoming greeting={greeting} currentTime={currentTime.format("dddd, DD MMMM YYYY")} />
                    </div>
                    <div className="row-span-4 col-span-4 flex gap-4">
                        <div className="basis-1/6 bg-white shadow-md p-4 grid">
                            <Sidebar userRole={userData.role_id} />
                        </div>
                        <div className="basis-5/6 bg-white shadow-md">
                            <div className="grid p-4 h-full">
                                <PayrollHistoryStaff />
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <Footer bgColor="bg-gray-100" />
                </div>
            </div>
        </>
    );
}

