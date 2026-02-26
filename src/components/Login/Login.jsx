import React, { useContext, useState } from "react";
import { FiMail, FiLock } from "react-icons/fi"; // Removed unused icons
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { authContext } from "../context/AuthContext";
import toast from "react-hot-toast";


export default function Login() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

 const { setAuthUserToken, setUser } = useContext(authContext);



  const loginSchema = zod.object({
    email: zod
      .string()
      .nonempty("Email is required")
      .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, " Email is not in format "),
    password: zod
      .string()
      .nonempty("Password is required")
      .regex(
        /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
        "Password must be 8+ characters and include uppercase, lowercase, number, and special character."
      ),
  });

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(loginSchema),
  });

async function myHandleSubmit(values) {
  setIsLoading(true);
  axios
    .post("https://route-posts.routemisr.com/users/signin", values)
    .then(function (resp) {
      const token = resp.data.data.token;
      const userData = resp.data.data.user; 

      setAuthUserToken(token);
      localStorage.setItem("tkn", token);

      setUser(userData);
      localStorage.setItem("userData", JSON.stringify(userData)); 
        toast.success(`Welcome Back ${userData.name}`);
      navigate("/home");
    })
    .catch(function (error) {
      console.log("error", error.response?.data?.message);
      setErrorMessage(error.response?.data?.message);
      setTimeout(() => {
        setErrorMessage(null);
      }, 5000);
    })
    .finally(function () {
      setIsLoading(false);
    });
}

  return (
    <div className="min-h-screen p-4 sm:p-8 w-full flex items-center justify-center bg-black relative overflow-hidden font-sans selection:bg-red-600 selection:text-white">

      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/10 relative z-10">

        <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-red-600 to-red-900 p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          
          <div className="z-10 mt-10">
            <h1 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase mb-2">
              Welcome<br/>Back.
            </h1>
            <div className="h-1 w-20 bg-black mt-4"></div>
          </div>
          
          <p className="z-10 text-red-100 font-medium text-sm leading-relaxed opacity-90 mb-10">
            Share moments, create memories, stay connected
          </p>

          <div className="absolute -top-10 -right-10 w-40 h-40 bg-black/20 rounded-full blur-2xl"></div>
        </div>

        <div className="col-span-1 lg:col-span-3 p-8 md:p-12 relative flex flex-col justify-center">

          <div className="lg:hidden mb-8 text-center">
             <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Log In
            </h1>
            <p className="text-red-500 font-bold tracking-widest text-xs uppercase mt-2">Enter your world</p>
          </div>

          <form onSubmit={handleSubmit(myHandleSubmit)} className="space-y-6">
            
            {/* Email */}
            <div className="group space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Email Address</label>
              <div className="relative">
                 <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Mariam@example.com"
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
              </div>
               {formState.errors.email && <p className="text-red-500 text-xs font-bold">{formState.errors.email.message}</p>}
            </div>

            {/* Password */}
            <div className="group space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Password</label>
              <div className="relative">
                <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                <input
                  {...register("password")}
                  type="password"
                  placeholder="••••••••"
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
              </div>
               {formState.errors.password && <p className="text-red-500 text-xs font-bold">{formState.errors.password.message}</p>}
            </div>

            <div className="pt-2">
               <button
                type="submit"
                className="w-full py-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-red-900/30"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Please Wait...
                  </span>
                ) : (
                  "Log In"
                )}
              </button>
            </div>

            {/* Error Message */}
            {errorMessage && (
              <div className="bg-red-900/20 border border-red-500/20 p-3 rounded-lg flex items-center gap-3">
                 <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                 <p className="text-red-200 text-sm">{errorMessage}</p>
              </div>
            )}

            <p className="text-center text-zinc-500 text-xs mt-6">
              Don't have an account?{" "}
              <Link to="/register" className="text-red-500 hover:text-red-400 font-bold underline decoration-transparent hover:decoration-red-500 transition-all">
                Sign up
              </Link>
            </p>

          </form>
        </div>
      </div>
    </div>
  );
}
