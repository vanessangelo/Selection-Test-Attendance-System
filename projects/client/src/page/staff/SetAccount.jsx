import React, { useEffect, useState } from "react";
import axios from "axios";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { useParams, useNavigate } from "react-router-dom";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import Logo from "../../component/Logo";
import Footer from "../../component/Footer";

export default function SetAccount() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const { token } = useParams();
    const [showPassword, setShowPassword] = useState(false);

    const toggleShowPassword = (e) => {
        e.preventDefault();
        setShowPassword(!showPassword);
    };

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(
                    `http://localhost:8000/api/auth/not-setup/profile?token=${token}`
                );
                setUser(res.data.data);
            } catch (error) {
                console.error("Error fetching user:", error);
                navigate("/login");
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [token]);

    const handleSubmit = async (values, { setSubmitting, resetForm, setStatus }) => {
        try {
            await axios.patch(
                `http://localhost:8000/api/staff/setup?token=${token}`,
                values
            );
            alert("Changes saved successfully!");
            resetForm();
            navigate("/login");
        } catch (error) {
            const response = error.response;
            if (response.status === 400) {
                const { message } = response.data;
                setStatus({ success: false, message });
            }

            alert("An error occurred.");
            console.error("Error:", error);
        } finally {
            setSubmitting(false);
        }
    };

    const pwdRgx = /^(?=.*[A-Z])(?=.*[!@#$%^&*])(?=.*[0-9]).{8,}$/;

    const validationSchema = Yup.object().shape({
        full_name: Yup.string(),
        birth_date: Yup.date().max(new Date(), "Birth date can't be in the future"),
        password: Yup.string().matches(pwdRgx, 'At least 8 chars, 1 symbol, 1 caps, and 1 number'
        ).required('Password is required'),
        confirm_password: Yup.string()
            .oneOf([Yup.ref('password'), null], 'Passwords must match')
            .required('Confirm Password is required'),
    });

    return (
        <div className="h-screen bg-gradient-to-b from-white to-palepurple">
            <div className="h-15 w-full grid justify-center sticky top-0 z-50">
                <div>
                    <Logo textColor="text-black" />
                </div>
            </div>
            <div className="grid justify-center my-10">
                <div className="grid text-center p-5 w-full my-10">
                    {user && (
                        <Formik initialValues={{ full_name: user.full_name, birth_date: new Date(user.birth_date).toISOString().split("T")[0], password: "", confirm_password: "" }} validationSchema={validationSchema} onSubmit={handleSubmit} >
                            {({ isSubmitting }) => (
                                <Form className="relative">
                                    <div className="grid justify-center">
                                        <h2 className="w-72 text-center font-rob text-darkpurple sm:text-2xl">
                                            Set Up Your Account
                                        </h2>
                                    </div>
                                    <p className="text-xs text-center font-open mb-4 text-jetblack tracking-wide sm:text-sm">
                                        Check your information and change accordingly
                                        <br />
                                        note: One chance only!
                                    </p>
                                    <div className="grid grid-cols-1 mt-7 mb-1 pb-3">
                                        <div className="relative mt-4">
                                            <ErrorMessage name="full_name" component="div" className="text-redd text-xs absolute -top-5" />
                                            <Field className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0" type="text" name="full_name" placeholder={`Full Name: ${user.full_name}`} />
                                        </div>
                                        <div className="relative mt-4">
                                            <ErrorMessage name="birth_date" component="div" className="text-redd text-xs absolute -top-5" />
                                            <Field className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0 py-0 px-2" type="date" name="birth_date" placeholder={`Birth Date: ${new Date(user.birth_date).toISOString().split("T")[0]}`} />
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 mt-3">
                                        <div className="relative">
                                            <ErrorMessage name='password' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0" type={showPassword ? "text" : "password"} name="password" placeholder="Password" />
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
                                        <div className="relative mt-5">
                                            <ErrorMessage name='confirm_password' component='div' className='text-redd text-xs absolute -top-5' />
                                            <Field className="border border-gray-300 h-6 text-xs w-full focus:border-darkgreen focus:ring-0" type="password" name="confirm_password" placeholder="Confirm Password" />
                                        </div>
                                    </div>
                                    <button
                                        className="w-1/2 py-2 my-4 font-open text-sm rounded-md bg-purplee text-blush hover:bg-magnolia hover:text-darkpurple hover:border hover:border-darkpurple"
                                        type="submit"
                                        disabled={isSubmitting}
                                    >
                                        Set Up Account
                                    </button>
                                </Form>
                            )}
                        </Formik>
                    )}
                </div>
            </div>
            <div className="mt-auto fixed w-full bottom-0">
                <Footer bgColor="bg-transparent" />
            </div>
        </div>
    )
}