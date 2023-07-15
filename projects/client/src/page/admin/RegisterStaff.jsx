import React, { useState, useEffect } from "react";
import dayjs from "dayjs";
import Sidebar from "../../component/Sidebar";
import Navbar from "../../component/Navbar";
import Footer from "../../component/Footer";
import { Formik, Form, Field, ErrorMessage } from 'formik';
import * as Yup from 'yup';
import axios from 'axios';
import { useSelector } from "react-redux";

export default function RegisterUser() {
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

    const token = useSelector((state) => state.auth.token)

    const initialValue = {
        email: '',
        full_name: '',
        birth_date: '',
        join_date: '',
        basic_salary: '',
    }

    const validationSchema = Yup.object().shape({
        email: Yup.string().email('Please use a valid email format').required('Email is required'),
        full_name: Yup.string().required("Full Name is required"),
        birth_date: Yup.date().max(new Date(), "Birth date can't be in the future").required("Birth date is required"),
        join_date: Yup.date().max(new Date(), "Join date can't be in the future").required("Join date is required"),
        basic_salary: Yup.number("Enter number format").required('Salary is required'),
    });

    const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
        try {
            const response = await axios.post('http://localhost:8000/api/admin/register-staff', values, { headers: { Authorization: `Bearer ${token}` } });

            if (response.status === 201) {
                resetForm();
                setStatus({ success: true, message: response.data.message });
                console.log(response.data.message)
            }

        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                const { message } = response.data;
                setStatus({ success: false, message });
            }

            if (response.status === 500) {
                setStatus({ success: false, message: "Internal Server Error" });
            }

        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="min-h-full bg-gray-200">
                <div className="h-15 w-full grid justify-center sticky top-0 z-50 bg-white">
                    <Navbar />
                </div>
                <div className="grid grid-flow-col grid-rows-5 gap-4 p-4 min-h-full">
                    <div className="col-span-4 bg-white shadow-md">
                        <h1 className="text-xl font-bold px-4 py-2">{greeting}!</h1>
                        <p className="px-4 py-3 font-mont">
                            Hi, {fullName}!
                            <br />
                            It's {currentTime.format("dddd, DD MMMM YYYY")}
                        </p>
                    </div>
                    <div className="row-span-4 col-span-4 flex gap-4">
                        <div className="basis-1/4 bg-white shadow-md p-4 grid">
                            <Sidebar />
                        </div>
                        <div className="basis-3/4 bg-white shadow-md">
                            <div className="flex p-4 h-full w-full justify-center">
                                <Formik initialValues={initialValue} validationSchema={validationSchema} onSubmit={handleSubmit} >
                                    {({ isSubmitting, status }) => (
                                        <Form>
                                            <div className='grid grid-flow-row gap-1 justify-center'>
                                                <h3 className='text-xl text-center font-mont mt-4 tracking-wide font-semibold sm:text-2xl'>Staff Registration</h3>
                                                <h3 className='text-xs text-center font-mont mb-4 tracking-wide sm:text-sm'>Please fill in the information below:</h3>
                                                <div className='w-full grid grid-flow-row gap-3'>
                                                    {status && status.success && (
                                                        <p className="font-open text-sm text-center text-greenn">{status.message}</p>
                                                    )}
                                                    {status && !status.success && (
                                                        <p className="font-open text-sm text-center text-redd">{status.message}</p>
                                                    )}
                                                    <div className='font-open relative mt-4'>
                                                        <ErrorMessage name='email' component='div' className='text-redd text-xs absolute -top-5' />
                                                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkpurple focus:ring-0' type='email' name='email' placeholder='john.doe@gmail.com' />
                                                    </div>
                                                    <div className='font-open relative mt-4'>
                                                        <ErrorMessage name='full_name' component='div' className='text-redd text-xs absolute -top-5' />
                                                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkpurple focus:ring-0' type='text' name='full_name' placeholder='John Doe' />
                                                    </div>
                                                    <div className='font-open relative mt-4'>
                                                        <ErrorMessage name='birth_date' component='div' className='text-redd text-xs absolute -top-5' />
                                                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkpurple focus:ring-0 py-0 px-2' type='date' name='birth_date' placeholder='Birthdate' />
                                                    </div>
                                                    <div className='font-open relative mt-4'>
                                                        <ErrorMessage name='join_date' component='div' className='text-redd text-xs absolute -top-5' />
                                                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkpurple focus:ring-0 py-0 px-2' type='date' name='join_date' placeholder='Join Date' />
                                                    </div>
                                                    <div className='font-open relative mt-4'>
                                                        <ErrorMessage name='basic_salary' component='div' className='text-redd text-xs absolute -top-5' />
                                                        <Field className='border border-gray-300 h-6 text-xs w-full focus:border-darkpurple focus:ring-0' type='text' name='basic_salary' placeholder='Salary' />
                                                    </div>
                                                </div>
                                                <button
                                                    className='w-full sm:w-10/12 mx-auto py-2 my-4 text-xs font-mont tracking-wide border rounded-md hover:bg-darkpurple hover:text-gray-50 hover:font-bold hover:border-none'
                                                    type='submit'
                                                    disabled={isSubmitting}
                                                >
                                                    Register Staff
                                                </button>
                                            </div>
                                        </Form>
                                    )}
                                </Formik>
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