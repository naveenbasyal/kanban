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

const Register = () => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.auth);
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const [values, setValues] = useState({
    username: "",
    email: "",
    password: "",
  });

  const handleRegister = async () => {
    const data = await dispatch(
      RegisterUser({
        username: values.username,
        email: values.email,
        password: values.password,
      })
    );
    if (data?.payload?.token) {
      navigate("/login");
      toast.success("Please login to continue");
      setValues({ username: "", email: "", password: "" });
    } else {
      toast.error("Register Failed");
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
              <form
                className="space-y-6"
                onSubmit={(e) => {
                  e.preventDefault();
                  handleRegister();
                }}
              >
                <div>
                  <label
                    htmlFor="username"
                    className="block mb-2 text-xl font-medium text-purple "
                  >
                    Your Name
                  </label>
                  <input
                    type="username"
                    name="username"
                    id="username"
                    value={values.username}
                    onChange={(e) =>
                      setValues({ ...values, username: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-purple -900 sm:text-xl rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-4 "
                    placeholder="John Doe"
                    required
                  />
                </div>
                <div>
                  <label
                    htmlFor="email"
                    className="block mb-2 text-xl font-medium text-purple "
                  >
                    Your email
                  </label>
                  <input
                    type="email"
                    name="email"
                    id="email"
                    value={values.email}
                    onChange={(e) =>
                      setValues({ ...values, email: e.target.value })
                    }
                    className="bg-gray-50 border border-gray-300 text-purple -900 sm:text-xl rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-4 "
                    placeholder="name@example.com"
                    required
                  />
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
                    type={show ? "text" : "password"}
                    name="password"
                    id="password"
                    value={values.password}
                    onChange={(e) =>
                      setValues({ ...values, password: e.target.value })
                    }
                    placeholder="password"
                    className="bg-gray-50 border border-gray-300 text-purple -900 sm:text-xl rounded-lg focus:ring-blue-600 focus:border-blue-600 block w-full p-4 "
                    required
                  />
                </div>

                <div className="flex items-start">
                  <div className="flex items-center ">
                    <input
                      id="terms"
                      aria-describedby="terms"
                      type="checkbox"
                      className="w-5 mt-1 h-5 border border-gray-300 rounded bg-gray-50 focus:ring-3 focus:ring-blue-300 "
                      required
                    />
                  </div>
                  <div className="ml-3 text-xl">
                    <label
                      htmlFor="terms"
                      className="font-light text-purple -500 "
                    >
                      I accept the{" "}
                      <a
                        className="font-medium text-blue-600 hover:underline "
                        href="#"
                      >
                        Terms and Conditions
                      </a>
                    </label>
                  </div>
                </div>
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
                <p className="text-xl font-light text-purple -500 ">
                  Already have a new account?{" "}
                  <Link
                    to="/login"
                    className="font-medium text-blue-600 hover:underline "
                  >
                    Login here
                  </Link>
                </p>
              </form>
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
