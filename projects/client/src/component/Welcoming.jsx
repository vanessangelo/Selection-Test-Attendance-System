import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux/";
import axios from "axios";


export default function Welcoming(props) {
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
            <h1 className="text-xl font-bold px-4 py-2">{props.greeting}, {userData.full_name}!</h1>
            <p className="px-4 py-3 font-mont">
                It's {props.currentTime}
            </p>
        </>
    )
}