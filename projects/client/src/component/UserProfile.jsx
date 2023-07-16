import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux/";
import axios from "axios";
import dayjs from "dayjs";

export default function UserProfile() {
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
            <div className="grid grid-row-6">
                <div className="row-span-1 text-center text-2xl flex items-center justify-center font-bold">
                    My Profile
                </div>
                <div className="row-span-5 flex flex-col font-rob sm:w-96 sm:mx-auto">
                    <div className="flex justify-center mb-2 flex-col sm:flex-row">
                        <div className="w-32 font-bold">Full Name:</div>
                        <div className="flex-grow ml-2">{userData?.full_name}</div>
                    </div>
                    <div className="flex justify-center mb-2 flex-col sm:flex-row">
                        <div className="w-32 font-bold">Email:</div>
                        <div className="flex-grow ml-2">{userData?.email}</div>
                    </div>
                    <div className="flex justify-center mb-2 flex-col sm:flex-row">
                        <div className="w-32 font-bold">Birth Date:</div>
                        <div className="flex-grow ml-2">{dayjs(userData.birth_date).format('DD MMMM YYYY')}</div>
                    </div>
                    <div className="flex justify-center mb-2 flex-col sm:flex-row">
                        <div className="w-32 font-bold">Join Date:</div>
                        <div className="flex-grow ml-2">{dayjs(userData?.join_date).format('DD MMMM YYYY')}</div>
                    </div>
                </div>
            </div>
        </>
    )
}