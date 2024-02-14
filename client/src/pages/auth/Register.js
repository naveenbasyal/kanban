import React, { useEffect, useState } from "react";
import { FaEye } from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { GoogleLogin } from "@react-oauth/google";
import { jwtDecode } from "jwt-decode";
import {
  LoginUser,
  RegisterUser,
  googleLogin,
} from "../../store/slices/authSlice";
import { AiOutlineLoading3Quarters } from "react-icons/ai";
import { toast } from "react-toastify";
import { registerValidation } from "../../validation/authValidation";
import { useFormik } from "formik";

const Register = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const {
    handleChange,
    handleSubmit,
    values,
    setValues,
    errors,
    touched,
    handleBlur,
  } = useFormik({
    initialValues: {
      username: "",
      email: "",
      password: "",
    },
    validationSchema: registerValidation,
    onSubmit: (values) => {
      handleRegister(values);
    },
  });

  const handleRegister = async (values) => {
    const data = await dispatch(
      RegisterUser({
        username: values.username,
        email: values.email,
        password: values.password,
      })
    );

    if (data?.payload?.message) {
      setMessage(data.payload.message);
    } else {
      console.log(data.payload, "error");
      setError(data.payload || data.payload.error);
    }
  };

  const continueWithGoogle = async (credential) => {
    const userData = jwtDecode(credential.credential);

    const data = await dispatch(
      googleLogin({
        clientId: credential.clientId,
        username: userData.name,
        email: userData.email,
        profilePicture: userData.picture,
        email_verified: userData.email_verified,
      })
    );
    if (data?.payload?.token) {
      navigate("/");
    } else {
      toast.error("Register Failed");
    }
  };
  return (
    <>
      <section className="bg-gray-50">
        <div className="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0">
          <a
            href="#"
            className="flex items-center mb-10 text-4xl font-semibold text-heading -900 "
          >
            <img
              className="w-10 h-10 mr-2"
              src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
              alt="logo"
            />
            Kanbuddy
          </a>
          <div className="w-full bg-white rounded-lg shadow max-w-2xl py-3 ">
            <div className="space-y-10 p-12">
              <h1 className="font-bold leading-tight tracking-tight text-heading text-4xl ">
                Create and account
              </h1>
              <form className="space-y-6" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-xl font-medium text-purple "
                  >
                    Your Name
                  </label>
                  <input
                    autoComplete="off"
                    type="username"
                    name="username"
                    id="username"
                    value={values.username}
                    onChange={handleChange}
                    className="bg-gray-50 border border-gray-300 text-purple -900 sm:text-xl rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-4 "
                    placeholder="John Doe"
                    onBlur={handleBlur}
                  />
                  {errors.username && touched.username && (
                    <p className="text-red-500 ml-1 my-1 text-lg font-[500]">
                      {errors.username && touched.username && errors.username}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-xl font-medium text-purple "
                  >
                    Your email
                  </label>
                  <input
                    autoComplete="off"
                    type="email"
                    name="email"
                    id="email"
                    value={values.email}
                    onChange={handleChange}
                    onBlur={handleBlur}
                    className="bg-gray-50 border border-gray-300 text-purple -900 sm:text-xl rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-4 "
                    placeholder="name@example.com"
                  />
                  {errors.email && touched.email && (
                    <p className="text-red-500 ml-1 my-1 text-lg font-[500]">
                      {errors.email && touched.email && errors.email}
                    </p>
                  )}
                </div>
                <div>
                  <label
                    htmlFor="password"
                    className="block relative mb-2 text-xl font-medium text-purple -900 "
                  >
                    Password
                    <FaEye
                      onClick={() => setShow(!show)}
                      className={`absolute right-4 top-14 text-3xl hover:text-blue-600 
                      ${show ? "text-blue-600" : "text-gray-500"}
                      cursor-pointer`}
                    />
                  </label>
                  <input
                    autoComplete="off"
                    type={show ? "text" : "password"}
                    name="password"
                    id="password"
                    onBlur={handleBlur}
                    value={values.password}
                    onChange={handleChange}
                    placeholder="password"
                    className={`bg-gray-50 border ${
                      errors.password && touched.password
                        ? "border-red-500"
                        : "border-gray-300"
                    } text-purple  sm:text-xl rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-4 `}
                  />
                </div>

                {/* check if the password security completion is done uppercase , 6characters, numbers and show it in ui using checkboxed*/}

                <div>
                  <div className="flex items-start">
                    <input
                      autoComplete="off"
                      type="checkbox"
                      disabled
                      name="uppercase"
                      checked={values.password.match(/[A-Z]/g)}
                      className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
                    />
                    <label
                      htmlFor="uppercase"
                      className="ml-3  text-lg text-purple cursor-pointer "
                    >
                      Include Uppercase
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      autoComplete="off"
                      type="checkbox"
                      disabled
                      name="sixCharacters"
                      checked={values.password.length > 5}
                      className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
                    />
                    <label
                      htmlFor="sixCharacters"
                      className="ml-3  text-lg text-purple cursor-pointer "
                    >
                      Minimum 6 Characters
                    </label>
                  </div>

                  <div className="flex items-start">
                    <input
                      autoComplete="off"
                      disabled
                      type="checkbox"
                      name="numbers"
                      checked={values.password.match(/[0-9]/g)}
                      className="w-5 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
                    />
                    <label
                      htmlFor="numbers"
                      className="ml-3  text-lg text-purple cursor-not-allowed"
                    >
                      Include Numbers
                    </label>
                  </div>
                </div>
                {message ? (
                  <p className="text-xl text-green-500 font-[500] ">
                    {message}
                  </p>
                ) : (
                  error && <p className="text-xl text-red-500 ">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={loading}
                  className={`w-full flex justify-center text-white
                  ${
                    loading
                      ? "bg-blue-400 cursor-not-allowed"
                      : "bg-blue-600 hover:bg-blue-700 "
                  }
                    focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-xl px-5 py-4 text-center `}
                >
                  {loading ? (
                    <AiOutlineLoading3Quarters
                      size={20}
                      className="animate-spin text-2xl "
                    />
                  ) : (
                    "Register"
                  )}
                </button>
                <p className="text-xl  text-purple -500 ">
                  Already have a new account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline "
                  >
                    Login here
                  </Link>
                </p>
              </form>
              <div className="flex items-center mt-0">
                <div className="h-[1.4px] w-[100%] bg-gray-300"></div>
                <div className="mx-2 text-pruple">or</div>
                <div className="h-[1.4px] w-[100%] bg-gray-300"></div>
              </div>
              <div className="w-full flex items-center justify-center">
                <GoogleLogin
                  size="large"
                  shape="pill"
                  text="continue_with"
                  width={250}
                  onSuccess={(credentialResponse) => {
                    continueWithGoogle(credentialResponse);
                  }}
                  onError={() => {
                    console.log("Register Failed");
                    toast.error("Register Failed");
                  }}
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Register;
