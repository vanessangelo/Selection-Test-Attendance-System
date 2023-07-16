import { Navigate, Outlet, useLocation } from "react-router";
import { useSelector } from "react-redux";
import axios from "axios";
import { useState, useEffect } from "react";

const PrivateStaffWrapper = () => {
    const location = useLocation();
    const [userData, setUserData] = useState({});
    const token = useSelector((state) => state.auth.token)

    const fetchUserData = async () => {
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

    if (!token) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    if (!userData || !userData.role_id) {
        return null;
    }

    if (userData.role_id !== 2) {
        return <Navigate to="/" state={{ from: location }} replace />;
    }
    return <Outlet />;
};

export default PrivateStaffWrapper;