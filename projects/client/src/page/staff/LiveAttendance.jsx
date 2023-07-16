import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Sidebar from "../../component/Sidebar";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import axios from 'axios';
import { useSelector } from "react-redux";
import Welcoming from "../../component/Welcoming";

export default function LiveAttendance() {
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

    const token = useSelector((state) => state.auth.token)

    const [attendanceRecords, setAttendanceRecords] = useState([]);
    const [isClockedIn, setIsClockedIn] = useState(false);
    const [isClockedOut, setIsClockedOut] = useState(false);
    const [isWeekday, setIsWeekday] = useState(false);

    const fetchAttendanceRecords = async () => {
        try {
            const response = await axios.get("http://localhost:8000/api/staff/attendance", { headers: { Authorization: `Bearer ${token}` } });
            setAttendanceRecords(response.data.data);

            const isClockedInToday = response.data.data && response.data.data.clock_in;
            const isClockedOutToday = response.data.data && response.data.data.clock_out;
            setIsClockedIn(isClockedInToday);
            setIsClockedOut(isClockedOutToday);
        } catch (error) {
            console.error(error.message);
        }
    };

    useEffect(() => {
        const currentDay = currentTime.day();
        const isWeekday = currentDay >= 1 && currentDay <= 5;
        setIsWeekday(isWeekday);
        fetchAttendanceRecords();
    }, [token]);

    const handleClockIn = () => {
        axios.post('http://localhost:8000/api/staff/clock-in', null, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                setIsClockedIn(true);
                fetchAttendanceRecords();
            })
            .catch(error => {
                console.error(error);
            });
    };

    const handleClockOut = () => {
        axios.patch('http://localhost:8000/api/staff/clock-out', null, { headers: { Authorization: `Bearer ${token}` } })
            .then(response => {
                console.log(response.data);
                setIsClockedOut(true);
                fetchAttendanceRecords();
            })
            .catch(error => {
                console.error(error);
            });
    };

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
                            <Sidebar />
                        </div>
                        <div className="basis-5/6 bg-white shadow-md p-4">
                            <div className="flex flex-col p-4 h-full w-full justify-center gap-4">
                                <div className="basis-1/2 grid shadow-md">
                                    <div className="row-span-2 grid text-center p-2">
                                        <div className="row-span-1 text-xl font-bold sm:text-2xl mx-auto text-darkpurple tracking-wide">
                                            {currentTime.format("hh:mmA")}
                                        </div>
                                        <div className="row-span-1 text-center text-base">
                                            {currentTime.format("ddd, DD MMMM YYYY")}
                                        </div>
                                    </div>
                                    <div className="row-span-1 text-center p-2 flex flex-col sm:flex-row justify-center">
                                        <div className="px-2 text-sm sm:text-base">
                                            <button className={`bg-gray-200 font-bold py-2 px-4 rounded ${(isClockedIn || isClockedOut || !isWeekday) ? "text-gray-500 hover:bg-none" : "hover:bg-purplee"}`} onClick={handleClockIn} disabled={isClockedIn || isClockedOut || !isWeekday}>
                                                Clock In
                                            </button>
                                        </div>
                                        <div className="px-2 text-sm sm:text-base">
                                            <button className={`bg-gray-200 font-bold py-2 px-4  mt-2 sm:mt-0 rounded ${(!isClockedIn || isClockedOut || !isWeekday) ? "text-gray-500 hover:bg-none" : "hover:bg-purplee"}`} onClick={handleClockOut} disabled={!isClockedIn || isClockedOut || !isWeekday}>
                                                Clock Out
                                            </button>
                                        </div>
                                    </div>
                                </div>
                                <div className="basis-1/2 flex flex-col text-center p-2">
                                    <div className="basis-1/4 font-rob tracking-wide font-semibold"> Attendance Log </div>
                                    <div>
                                        <div className="basis-3/4 grid gap-2">
                                            <div className="flex justify-center">
                                                <div className="px-2 text-sm flex items-center font-bold"> Clock In </div>
                                                <div className="px-3 text-base"> {attendanceRecords && attendanceRecords.clock_in ? dayjs(attendanceRecords.clock_in).format("hh:mm A") : "-"} </div>
                                            </div>
                                            <div className="flex justify-center">
                                                <div className="px-2 text-sm flex items-center font-bold"> Clock Out </div>
                                                <div className="px-3"> {attendanceRecords && attendanceRecords.clock_out ? dayjs(attendanceRecords.clock_out).format("hh:mm A") : "-"} </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div className="">
                    <Footer bgColor="bg-gray-100" />
                </div>
            </div>
        </>
    )
}