import { GoogleLogin } from "@react-oauth/google";
import React from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";
import { useDispatch } from "react-redux";
import { fetchUser } from "../Redux/Slices/AuthSlice";

function Login() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const handleGoogleSuccess = async (credentialResponse) => {
    try {
      const res = await axios.post(
        "http://localhost:5001/api/auth/login",
        {
          idToken: credentialResponse.credential,
        },
        { withCredentials: true },
      );
      dispatch(fetchUser());
      navigate("/dashboard");
      
      toast.success("login done", {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });

    } catch (error) {
      toast.error(error.message, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "dark",
      });
    }
  };
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-blue-50">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold text-blue-700 mb-2">Login to IMS</h1>

        <p className="text-sm text-gray-500 mb-6 text-center">
          Continue using Google
        </p>

        <GoogleLogin
          onSuccess={handleGoogleSuccess}
          onError={() => console.log("Google Login Failed")}
          width="300"
        />

        <div className="flex items-center w-full my-6">
          <div className="flex-1 h-px bg-gray-200"></div>
          <span className="px-3 text-sm text-gray-400">OR</span>
          <div className="flex-1 h-px bg-gray-200"></div>
        </div>

        <p className="text-sm text-gray-600">
          Don’t have an account?{" "}
          <span
            onClick={() => navigate(`/signup`)}
            className="text-blue-600 font-medium cursor-pointer hover:underline"
          >
            Sign up first
          </span>
        </p>
      </div>
    </div>
  );
}

export default Login;
