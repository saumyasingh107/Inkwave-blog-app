import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupinput } from "../../../common/src/index";
import axios from "axios";
import { BAKCEND_URL } from "../Config";
import { Bounce, ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const Auth = ({ type }: { type: "signin" | "signup" }) => {
  const [inputs, setInputs] = useState<signupinput>({
    name: "",
    username: "",
    password: "",
  });

  const [showPassword, setShowPassword] = useState(false);  // State for toggling password visibility
  const navigate = useNavigate();

  const sendRequest = async () => {
    try {
      const response = await axios.post(
        `${BAKCEND_URL}/api/v1/user/${type === "signup" ? "signup" : "signin"}`,
        inputs
      );
      const jwt = response.data.token;
      console.log(response.data);
      localStorage.setItem("token", jwt);

      toast.success(`${type === "signup" ? "Registered Successfully" : "Login Successfully"}`, {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });

      setTimeout(() => {
        navigate("/blogs");
      }, 2000);
    } catch (e) {
      console.error("Error during request:", e);
      toast.error("Something went wrong, please try again!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "colored",
        transition: Bounce,
      });
    }
  };

  return (
    <div className="h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-6">
            <div className="text-3xl font-extrabold">
              {type === "signup" ? "Create an account" : "Login account"}
            </div>
            <div className="text-slate-400">
              {type === "signup"
                ? "Already have an account?"
                : "Don't have an account"}
              <Link
                className="underline pl-2"
                to={type === "signup" ? "/signin" : "/"}
              >
                {type === "signup" ? "Sign in" : "Sign up"}
              </Link>
            </div>
          </div>

          {type === "signup" && (
            <Labeled
              label="Name"
              type="text"
              placeholder="abc"
              onchange={(e) => {
                setInputs({ ...inputs, name: e.target.value });
              }}
            />
          )}

          <Labeled
            label="Email"
            type="text"
            placeholder="abc@gmail.com"
            onchange={(e) => {
              setInputs({ ...inputs, username: e.target.value });
            }}
          />

          <div className="max-w-sm">
            <label className="block mb-2 text-sm font-medium">Password</label>
            <div className="relative">
              <input
                onChange={(e) => {
                  setInputs({ ...inputs, password: e.target.value });
                }}
                id="hs-toggle-password"
                type={showPassword ? "text" : "password"} 
                className="border text-sm rounded-lg block w-full  p-2.5 border-gray-500 dark:placeholder-gray-400"
                placeholder="Enter password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)} 
                className="absolute inset-y-0 end-0 flex items-center z-20 px-3 cursor-pointer text-gray-400 rounded-e-md focus:outline-none focus:text-blue-600 dark:text-neutral-600 dark:focus:text-blue-500"
              >
                {showPassword ? (
                  <svg
                    className="shrink-0 size-3.5"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                    <circle cx="12" cy="12" r="3"></circle>
                  </svg>
                ) : (
                  <svg
                    className="shrink-0 size-3.5"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                    <line x1="2" x2="22" y1="2" y2="22"></line>
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="button"
            onClick={sendRequest}
            className="text-white w-full bg-gray-800 mt-4 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
          >
            {type === "signup" ? "Sign up" : "Sign in"}
          </button>
        </div>
      </div>
      <ToastContainer />
    </div>
  );
};

export default Auth;

interface labeltype {
  label: string;
  placeholder: string;
  onchange: (e: ChangeEvent<HTMLInputElement>) => void;
  type: string;
}
export const Labeled = ({ label, placeholder, onchange, type }: labeltype) => {
  return (
    <div className="p-1">
      <label htmlFor="first_name" className="block mb-2 text-sm font-medium">
        {label}
      </label>
      <input
        onChange={onchange}
        type={type}
        id="first_name"
        className="border text-sm rounded-lg block w-full p-2.5 border-gray-500 dark:placeholder-gray-400"
        placeholder={placeholder}
        required
      />
    </div>
  );
};
