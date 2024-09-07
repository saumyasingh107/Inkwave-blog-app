import { ChangeEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupinput } from "../../../common/src/index";
import axios from "axios";
import { BAKCEND_URL } from "../Config";

const Auth = ({ type }: { type: "signin" | "signup" }) => {
  // const [username,setUsername]=useState("");
  // const [password,setPassword]=useState("");
  // const [name,setName]=useState("");
  const [inputs, setInputs] = useState<signupinput>({
    name: "",
    username: "",
    password: "",
  });
  const navigate=useNavigate()
  const sendRequest=async ()=>{
    try{

        const response=await axios.post(`${BAKCEND_URL}/api/v1/user/${type==="signup"?"signup":"signin"}`,inputs);
        const jwt= response.data.token;
        console.log(response.data)
        localStorage.setItem("token",jwt);
        navigate("/blogs")
    }catch(e){

    }
  }
  return (
    <div className=" h-screen flex justify-center flex-col">
      <div className="flex justify-center">
        <div>
          <div className="px-6">
            <div className="text-3xl font-extrabold">
              {type === "signup" ? "Create an acount" : "Login account"}
            </div>
            <div className="text-slate-400">
              {type === "signup"
                ? "Already have an accunt?"
                : "Dont have an account"}
              <Link
                className=" underline pl-2"
                to={type === "signup" ? "/signin" : "/signup"}
              >
                {" "}
                {type === "signup" ? "Sign in" : "Sign up"}
              </Link>
            </div>
          </div>
          <div>
           {type==="signup"? <Labeled
              label="Name"
              type="text"
              placeholder="abc"
              onchange={(e) => {
                setInputs({
                  ...inputs,
                  name: e.target.value,
                });
              }}
            />:null}
            <Labeled
              label="Username"
              type="text"
              placeholder="abc@gmail.com"
              onchange={(e) => { setInputs({
                  ...inputs,
                  username: e.target.value,
                });}}
            />
            <Labeled
              label="Password"
              type="password"
              placeholder="*****"
              onchange={(e) => { setInputs({
                  ...inputs,
                  password: e.target.value,
                });}}
            />
            <button
              type="button"
              onClick={sendRequest}
              className="text-white w-full bg-gray-800 mt-4 hover:bg-gray-900 focus:outline-none focus:ring-4 focus:ring-gray-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 dark:bg-gray-800 dark:hover:bg-gray-700 dark:focus:ring-gray-700 dark:border-gray-700"
            >
              {type === "signup" ? "Sign up" : "Sign in"}
            </button>
          </div>
        </div>
      </div>
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
        className=" border text-sm rounded-lg  block w-full p-2.5  border-gray-500 dark:placeholder-gray-400  "
        placeholder={placeholder}
        required
      />
    </div>
  );
};
