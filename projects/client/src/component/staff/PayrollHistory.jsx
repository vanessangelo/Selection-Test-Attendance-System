import React, { useState, useEffect } from "react";
import axios from 'axios';
import { useSelector } from "react-redux";

export default function PayrollHistoryStaff() {
    const token = useSelector((state) => state.auth.token)

    const [payrollData, setPayrollData] = useState([]);
    const [msg, setMsg] = useState("")
    const [filter, setFilter] = useState({
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
    })

    const fetchPayrollData = async () => {
        try {
            const response = await axios.get(`http://localhost:8000/api/staff/my-payroll?year=${filter.year}&month=${filter.month}`, { headers: { Authorization: `Bearer ${token}` } });
            setPayrollData(response.data.data);
        } catch (error) {
            console.error(error.message);
        }
    };
    useEffect(() => {
        fetchPayrollData();
    }, [token, filter]);

    const handleFilterChange = (e) => {
        setFilter({
            ...filter,
            [e.target.name]: e.target.value
        });
    };

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
                    </div>
                </div>
                <div className="basis-4/5 flex flex-col text-center p-2">
                    <div className="basis-1/4 font-rob tracking-wide font-semibold"> My Payroll </div>
                    <div className="basis-3/4">
                        <div className=" grid gap-2">
                            <table className="border-collapse border w-full text-xs sm:text-base">
                                <thead>
                                    <tr className="bg-gray-200">
                                        <th className="py-2 px-4 hidden sm:table-cell">Year</th>
                                        <th className="py-2 px-4">Month</th>
                                        <th className="py-2 px-4 hidden sm:table-cell">Basic Salary</th>
                                        <th className="py-2 px-4">Payroll</th>
                                        <th className="py-2 px-4 hidden sm:table-cell">Deduction</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {payrollData ? (
                                        <tr className="hover:bg-gray-100">
                                            <td className="py-2 px-4 hidden sm:table-cell">{payrollData.year}</td>
                                            <td className="py-2 px-4 "> {payrollData.month} </td>
                                            <td className="py-2 px-4 hidden sm:table-cell">{payrollData["User.Salary.basic_salary"] ? `Rp ${payrollData["User.Salary.basic_salary"].toLocaleString('id-ID')}` : ""}</td>
                                            <td className="py-2 px-4">{payrollData.total_amount ? `Rp ${payrollData.total_amount.toLocaleString('id-ID')}` : ""}</td>
                                            <td className="py-2 px-4 hidden sm:table-cell">{payrollData.deduction ? `Rp ${payrollData.deduction.toLocaleString('id-ID')}` : ""}</td>
                                        </tr>
                                    ) : (
                                        <tr>
                                            <td colSpan="5" className="py-4 text-center">No Data Found</td>
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