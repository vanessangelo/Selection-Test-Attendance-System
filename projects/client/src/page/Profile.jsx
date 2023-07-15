import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Sidebar from "../component/Sidebar";
import Navbar from "../component/Navbar";
import Footer from "../component/Footer";

export default function Profile() {
    const fullName = "John Doe"; // Replace with user's full name

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

    return (
        <>
            <div className="min-h-full bg-gray-200">
                <div className="h-15 w-full grid justify-center sticky top-0 z-50 bg-white shadow-md">
                    <Navbar />
                </div>
                <div className="grid grid-flow-col grid-rows-4 gap-4 p-4 min-h-full">
                    <div className="col-span-4 bg-white shadow-md">
                        <h1 className="text-xl font-bold px-4 py-2">{greeting}!</h1>
                        <p className="px-4 py-3 font-mont">
                            Hi, {fullName}!
                            <br />
                            It's {currentTime.format("dddd, DD MMMM YYYY")}
                        </p>
                    </div>
                    <div className="row-span-3 col-span-4 flex gap-4">
                        <div className="basis-1/4 bg-white shadow-md p-4 grid">
                            <Sidebar />
                        </div>
                        <div className="basis-3/4 bg-white shadow-md">
                            <div className="grid p-4 h-full">
                                this is profile
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