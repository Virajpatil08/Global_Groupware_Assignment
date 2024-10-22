import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { postRequest } from "../services/apiService";
import login_image from "../assests/Login_image.jpg";
import { FaEye, FaEyeSlash } from "react-icons/fa";

const Login = () => {
  const [passwordVisible, setPasswordVisible] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const navigate = useNavigate();

  const initialValues = {
    email: "",
    password: "",
  };

  const validationSchema = Yup.object().shape({
    email: Yup.string().email("Invalid email format").required("Email is required"),
    password: Yup.string().min(8, "Password must be at least 8 characters").required("Password is required"),
  });

  const togglePasswordVisibility = () => {
    setPasswordVisible((prev) => !prev);
  };

  const handleLogin = async (values) => {
    try {
      const response = await postRequest("/api/login", values); // API call for login
      if (response.token) {
        localStorage.setItem("token", response.token);


        if (rememberMe) {
          localStorage.setItem("rememberMe", "true");
          localStorage.setItem("email", values.email);
          localStorage.setItem("password", values.password);
        } else {
          localStorage.removeItem("rememberMe");
          localStorage.removeItem("email");
          localStorage.removeItem("password");
        }

        toast.success("Login Successful!", { theme: "dark" });
        setTimeout(() => {
          navigate("/users");
        }, 1000);
      }
    } catch (error) {
      toast.error("Invalid credentials. Please try again.", { theme: "dark" });
    }
  };

  useEffect(() => {
    const remember = localStorage.getItem("rememberMe") === "true";
    const savedEmail = localStorage.getItem("email");
    const savedPassword = localStorage.getItem("password");

    if (remember && savedEmail && savedPassword) {
      initialValues.email = savedEmail;
      initialValues.password = savedPassword;
      setRememberMe(true);
    }
  }, []);

  return (
    <div className="flex w-screen h-screen bg-gray-50">
      <div className="hidden md:flex md:w-1/2 justify-center items-center bg-blue-500">
        <img src={login_image} alt="Login Illustration" className="w-3/4 h-auto" />
      </div>

      <div className="w-full md:w-1/2 p-8 md:p-[3.5rem] lg:p-[8rem] bg-white flex flex-col justify-center">
        <div className="border-2 border-gray-200 rounded-lg shadow-lg p-8 md:p-16">
          <h2 className="text-2xl font-bold text-center text-gray-800">Log In</h2>
          <p className="text-sm text-center text-gray-500 mt-2">
            Welcome back! Please enter your credentials to access your account securely.
          </p>

          <Formik
            initialValues={initialValues}
            validationSchema={validationSchema}
            onSubmit={handleLogin}
            enableReinitialize={true}
          >
            {({ errors, touched }) => (
              <Form className="space-y-6 mt-6">
                <div>
                  <label htmlFor="email" className="text-sm text-gray-600">Email ID <span className="text-red-500">*</span></label>
                  <Field
                    name="email"
                    type="email"
                    className={`w-full px-4 py-2 mt-2 border rounded-md focus:ring focus:ring-opacity-40 ${errors.email && touched.email
                        ? "border-red-500 focus:ring-red-300"
                        : "focus:ring-blue-400 focus:border-blue-400"
                      } text-xs placeholder-gray-400`}
                    placeholder="Email ID"
                  />
                  <ErrorMessage name="email" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="relative">
                  <label htmlFor="password" className="text-sm text-gray-600">Password <span className="text-red-500">*</span></label>
                  <div className="relative mt-2">
                    <Field
                      name="password"
                      type={passwordVisible ? "text" : "password"}
                      className={`w-full px-4 py-2 border rounded-md focus:ring focus:ring-opacity-40 pr-10 ${errors.password && touched.password
                          ? "border-red-500 focus:ring-red-300"
                          : "focus:ring-blue-400 focus:border-blue-400"
                        } text-xs placeholder-gray-400`}
                      placeholder="Password"
                    />
                    <button
                      type="button"
                      onClick={togglePasswordVisibility}
                      className="absolute inset-y-0 right-0 px-3 py-2 text-gray-600"
                    >
                      {passwordVisible ? <FaEye /> : <FaEyeSlash />}
                    </button>
                  </div>
                  <ErrorMessage name="password" component="div" className="text-red-500 text-sm mt-1" />
                </div>

                <div className="flex items-center mt-4">
                  <input
                    type="checkbox"
                    id="rememberMe"
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                    checked={rememberMe}
                    onChange={() => setRememberMe(!rememberMe)}
                  />
                  <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600">
                    Remember Me
                  </label>
                </div>

                <button
                  type="submit"
                  className="w-full px-4 py-2 mt-8 mb-4 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-opacity-40 focus:ring-blue-400 transition-all duration-200 ease-in-out"
                >
                  Log In
                </button>
              </Form>
            )}
          </Formik>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Login;
