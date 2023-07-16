import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";

export default function AttendanceLogStaff() {
    const token = useSelector((state) => state.auth.token)

    const [attendanceData, setAttendanceData] = useState([]);
    const [filter, setFilter] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        state: ["fullday", "halfday", "absence"],
        sort: "DESC"
    })

    useEffect(() => {
        const fetchAttendanceData = async () => {
            try {
                const response = await axios.get(`http://localhost:8000/api/staff/my-attendances?year=${filter.year}&month=${filter.month}&state=${filter.state.join(",")}&sort=${filter.sort}`, { headers: { Authorization: `Bearer ${token}` } });
                setAttendanceData(response.data.data);
            } catch (error) {
                console.error(error.message);
            }
        };
        fetchAttendanceData();
    }, [token, filter]);

    const handleFilterChange = (e) => {
        setFilter({
            ...filter, [e.target.name]: e.target.value
        })
    }

    const handleStatusChange = (e) => {
        if (e.target.checked) {
            setFilter((prev) => ({
                ...prev, state: [...prev.state, e.target.value]
            }))
        } else {
            setFilter((prev) => ({
                ...prev, state: prev.state.filter((state) => state !== e.target.value)
            }))
        }
    }
    return (
        <>
            <div className="flex flex-col p-4 h-full w-full justify-center gap-4">
                <div className="basis-1/5 grid shadow-md text-xs sm:text-base">
                    <div className="row-span-1 text-center p-2 flex flex-col md:flex-row h-fit gap-3 mx-auto">
                        <div className="justify-start sm:justify-center items-center">
                            Year: <input type="number" name="year" value={filter.year} onChange={handleFilterChange} className="py-0 ml-2 w-20 md:w-fit text-sm md:text-base my-1 sm:my-0" />
                        </div>
                        <div className="justify-start sm:justify-center items-center">
                            Month: <input type="number" name="month" min="1" max="12" value={filter.month} onChange={handleFilterChange} className="py-0 ml-2 w-20 md:w-fit text-sm md:text-base my-1 sm:my-0" />
                        </div>
                        <div className="justify-start sm:justify-center items-center">
                            Sort: <select name="sort" value={filter.sort} onChange={handleFilterChange} className="py-0 ml-2 text-sm md:text-base my-1 sm:my-0">
                                <option value="DESC"> Latest </option>
                                <option value="ASC"> Oldest </option>
                            </select>
                        </div>
                    </div>
                    <div className="row-span-1 flex h-fit justify-start sm:justify-center items-center px-2 my-1 sm:my-0">
                        State:
                        <div className="px-3 flex flex-col sm:block">
                            <label className="mr-2">
                                <input
                                    type="checkbox"
                                    value="fullday"
                                    checked={filter.state.includes("fullday")}
                                    onChange={handleStatusChange}
                                    className="mr-1"
                                />
                                <span>Full-Day</span>
                            </label>
                            <label className="mr-2">
                                <input
                                    type="checkbox"
                                    value="halfday"
                                    checked={filter.state.includes("halfday")}
                                    onChange={handleStatusChange}
                                    className="mr-1"
                                />
                                <span>Half-Day</span>
                            </label>
                            <label className="mr-2">
                                <input
                                    type="checkbox"
                                    value="absence"
                                    checked={filter.state.includes("absence")}
                                    onChange={handleStatusChange}
                                    className="mr-1"
                                />
                                <span>Absense</span>
                            </label>
                        </div>
                    </div>
                </div>
                <div className="basis-4/5 flex flex-col text-center p-2">
                    <div className="basis-1/4 font-rob tracking-wide font-semibold"> Attendance History </div>
                    <div className="basis-3/4">
                        <div className=" grid gap-2">
                            <table className="border-collapse border w-full text-xs sm:text-base">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="py-2 px-4">Date</th>
                                        <th className="py-2 px-4 hidden sm:table-cell">Clock In</th>
                                        <th className="py-2 px-4 hidden sm:table-cell">Clock Out</th>
                                        <th className="py-2 px-4">State</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {attendanceData.length !== 0 && attendanceData.map((item) => (
                                        <tr key={item.id} className="hover:bg-gray-100">
                                            <td className="py-2 px-4">{new Date(item.date).toLocaleDateString()}</td>
                                            <td className="py-2 px-4 hidden sm:table-cell">{item.clock_in ? new Date(item.clock_in).toLocaleTimeString() : "-"}</td>
                                            <td className="py-2 px-4 hidden sm:table-cell">{item.clock_out ? new Date(item.clock_out).toLocaleTimeString() : "-"}</td>
                                            <td className="py-2 px-4">{item.state}</td>
                                        </tr>
                                    ))}
                                    {attendanceData.length === 0 && (
                                        <tr>
                                            <td colSpan="4" className="py-4 text-center">No Data Found</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}