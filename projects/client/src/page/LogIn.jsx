import React, { useState } from "react";
import Footer from "../component/Footer";
import Logo from "../component/Logo";
import { useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import axios from "axios";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { keep } from "../store/reducer/authSlice";

export default function LogIn() {
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const dispatch = useDispatch();

    const toggleShowPassword = () => {
        setShowPassword(!showPassword);
    };

    const initialValues = {
        email: "",
        password: "",
    };

    const validationSchema = Yup.object().shape({
        email: Yup.string().required("Email is required"),
        password: Yup.string().required("Password is required"),
    });

    const handleSubmit = async (
        values,
        { setSubmitting, setFieldError, resetForm, setStatus }
    ) => {
        try {
            const response = await axios.post("http://localhost:8000/api/auth/login", values);

            if (response.status === 200) {
                const { token } = response.data;

                localStorage.setItem("token", token);
                dispatch(keep(token));
                resetForm();
                setStatus({ success: true, token });
                navigate("/");
            } else {
                throw new Error("Login failed");
            }
        } catch (error) {
            if (error.status === 404) {
                setFieldError("email", "User not found")
            }
            setFieldError("email", "Incorrect email and/or password");
            setStatus({ success: false });
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <>
            <div className="h-screen bg-gradient-to-b from-white to-palepurple">
                <div className="h-15 w-full grid justify-center sticky top-0 z-50">
                    <div>
                        <Logo textColor="text-black" />
                    </div>
                </div>
                <div className="grid justify-center my-10">
                    <div className="grid text-center p-5 w-full my-10">
                        <Formik
                            initialValues={initialValues}
                            validationSchema={validationSchema}
                            onSubmit={handleSubmit}
                        >
                            {({ isSubmitting }) => (
                                <Form className="relative">
                                    <div className="grid justify-center">
                                        <h2 className="w-72 text-center font-rob text-darkpurple sm:text-2xl">
                                            LOG IN
                                        </h2>
                                    </div>
                                    <p className="text-xs text-center font-open mb-4 text-jetblack tracking-wide sm:text-sm">
                                        Please enter your email and password:
                                    </p>
                                    <div className="grid grid-cols-1 mt-7 mb-1 pb-3">
                                        <div className="relative">
                                            <ErrorMessage name="email" component="div" className="text-redd text-xs absolute -top-5"
                                            />
                                            <Field
                                                className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                                                type="text"
                                                name="email"
                                                placeholder="Email"
                                            />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 mt-3">
                                        <div className="relative">
                                            <ErrorMessage name='password' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field
                                                className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0"
                                                type={showPassword ? "text" : "password"}
                                                name="password"
                                                placeholder="Password"
                                            />
                                            <div className="absolute right-1 top-1/2 transform pt-1 -translate-y-1/2">
                                                <button
                                                    type="button"
                                                    onClick={toggleShowPassword}
                                                    className="text-gray-500 focus:outline-none"
                                                >
                                                    {showPassword ? (
                                                        <AiOutlineEye size={15} />
                                                    ) : (
                                                        <AiOutlineEyeInvisible size={15} />
                                                    )}
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                    <button
                                        className="w-1/2 py-2 my-4 font-open text-sm rounded-md bg-purplee text-blush hover:bg-magnolia hover:text-darkpurple hover:border hover:border-darkpurple"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Log In
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    </div>
                </div>
                <div className="mt-auto fixed w-full bottom-0">
                    <Footer bgColor="bg-transparent" />
                </div>
            </div>
        </>
    )
}