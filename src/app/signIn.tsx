import React, { useEffect } from "react";
import { useNavigate } from "react-router";
import { useFormik } from "formik";
import StatusAlert, { StatusAlertService } from 'react-status-alert'
import clsx from "clsx";
import { useAppDispatch, useAppSelector } from "../store/store";
import {
  loginFailure,
  loginStart,
  loginSuccess,
} from "../store/slices/authSlice";
import { AuthStatus } from "../types/auth";
import { loginValidationSchema } from "../tools/ValidationSchemas";

const ACCESS_LOGIN = import.meta.env.VITE_ACCESS_LOGIN;
const ACCESS_PASSWORD = import.meta.env.VITE_ACCESS_PASSWORD;


const SignInPage: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
    const isDarkMode = useAppSelector((state) => state.darkMode.isDarkMode);
    const {isAuthenticated, status} = useAppSelector((state) => state.auth);

  React.useEffect(() => {
    if (isAuthenticated) navigate("/");
  }, [isAuthenticated, navigate]);

  const formik = useFormik({
    initialValues: { email: "", password: "" },
    validationSchema: loginValidationSchema,
    onSubmit: async (values, { setSubmitting }) => {
      dispatch(loginStart());

      await new Promise((resolve) => setTimeout(resolve, 1000));

      console.log(formik.values);
      
      if (formik.values.email === ACCESS_LOGIN && formik.values.password === ACCESS_PASSWORD) {
        dispatch(
          loginSuccess({
            email: values.email,
            name: values.email.split("@")[0],
			      password: values.password,
            id: Math.random(),
            role: "user",
          })
        );
      } else {
        dispatch(loginFailure("Please fill all fields"));
      }
      setSubmitting(false);
    },
  });

  useEffect(() => {
    if(status === AuthStatus.FAILED) {
      StatusAlertService.showError('User not found');
    }
  }, [status])

  return (
    <div className={clsx("h-screen flex items-center justify-center", isDarkMode ? "bg-neutral-900" : "bg-gray-50")}>
    <div className="w-full max-w-md">
      <div className={clsx("shadow-md rounded-xl p-8", isDarkMode ? "bg-neutral-800 text-white" : "bg-white text-gray-800")}>
        <h1 className="text-2xl font-bold text-center mb-6">Sign In</h1>
  
        <form onSubmit={formik.handleSubmit}>
          {/* Email Input */}
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium mb-2">Email address</label>
            <input
              type="email"
              id="email"
              {...formik.getFieldProps("email")}
              className={clsx(
                "py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500",
                isDarkMode ? "bg-neutral-700 text-white border-neutral-600" : "bg-white text-gray-900 border-gray-200",
                formik.touched.email && formik.errors.email && "border-red-500"
              )}
            />
            {formik.touched.email && formik.errors.email && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.email}</p>
            )}
          </div>
  
          {/* Password Input */}
          <div className="mb-6">
            <label htmlFor="password" className="block text-sm font-medium mb-2">Password</label>
            <input
              type="password"
              id="password"
              {...formik.getFieldProps("password")}
              className={clsx(
                "py-3 px-4 block w-full rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500",
                isDarkMode ? "bg-neutral-700 text-white border-neutral-600" : "bg-white text-gray-900 border-gray-200",
                formik.touched.password && formik.errors.password && "border-red-500"
              )}
            />
            {formik.touched.password && formik.errors.password && (
              <p className="text-red-500 text-sm mt-1">{formik.errors.password}</p>
            )}
          </div>
  
          {/* Submit Button */}
          <button
            type="submit"
            className={clsx(
              "w-full py-3 px-4 inline-flex justify-center items-center gap-x-2 text-sm font-semibold rounded-lg border border-transparent",
              isDarkMode ? "bg-blue-500 text-white hover:bg-blue-600" : "bg-blue-600 text-white hover:bg-blue-700",
              formik.isSubmitting && "disabled:opacity-50 disabled:pointer-events-none"
            )}
            disabled={formik.isSubmitting}
          >
            {formik.isSubmitting ? "Signing in..." : "Sign in"}
          </button>
  
          <StatusAlert />
        </form>
      </div>
    </div>
  </div>
  );
};

export default SignInPage;