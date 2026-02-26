import React, { useState } from "react";
import { FiUser, FiMail, FiLock, FiCheckCircle } from "react-icons/fi";
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import toast from "react-hot-toast";

export default function Register() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const registerSchema = zod
    .object({
      name: zod
        .string()
        .nonempty("Username is required")
        .min(3, "Name must be at least 3 values")
        .max(13, "Name must be Maximum 13 values"),
      email: zod
        .string()
        .nonempty("Email is required")
        .regex(/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/, " Email is not in format "),
      password: zod
        .string()
        .nonempty("Password is required")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must be 8+ characters and include uppercase, lowercase, number, and special character.",
        ),
      rePassword: zod
        .string()
        .nonempty("Password confirmation is required")
        .regex(
          /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/,
          "Password must be 8+ characters and include uppercase, lowercase, number, and special character.",
        ),
      dateOfBirth: zod.coerce
        .date("Invalid Date")
        .refine(function (value) {
          return new Date().getFullYear() - value.getFullYear() >= 18;
        }, "Age must be at least 18..")
        .transform(function (date) {
          return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
        }),
      gender: zod.enum(["male", "female"]),
    })
    .refine(
      function (obj) {
        return obj.password === obj.rePassword;
      },
      { path: ["rePassword"], error: "Password Unmatched" },
    );

  const { handleSubmit, register, formState } = useForm({
    defaultValues: {
      name: "",
      username: "",
      email: "",
      password: "",
      rePassword: "",
      dateOfBirth: "",
      gender: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(registerSchema),
  });

  async function myHandleSubmit(values) {
    console.log("llll", values);

    setIsLoading(true);
    axios
      .post("https://route-posts.routemisr.com/users/signup", values)
      .then(function (resp) {
        console.log("res", resp.data);
        toast.success("Account Created Succesfully");
        navigate("/login");
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
    <div className="min-h-screen p-4 sm:p-8 w-full flex items-center justify-center bg-black relative overflow-hidden font-sans pt-15">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-red-600/20 rounded-full blur-[120px] pointer-events-none translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 left-0 w-[300px] h-[300px] bg-red-900/10 rounded-full blur-[100px] pointer-events-none -translate-x-1/3 translate-y-1/3" />

      {/* CONTENT WRAPPER */}
      <div className="w-full max-w-4xl grid grid-cols-1 lg:grid-cols-5 bg-zinc-900/30 backdrop-blur-sm border border-zinc-800 rounded-3xl overflow-hidden shadow-2xl shadow-red-900/10 relative z-10">
        <div className="hidden lg:flex lg:col-span-2 bg-gradient-to-br from-red-600 to-red-900 p-10 flex-col justify-between relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10"></div>
          <div className="z-10">
            <h1 className="text-5xl font-black text-white leading-tight tracking-tighter uppercase mb-2">
              Step
              <br />
              Into
              <br />
              Your World
            </h1>
            <div className="h-1 w-20 bg-black mt-4"></div>
          </div>
          <p className="z-10 text-red-100 font-medium text-sm leading-relaxed opacity-90">
            "Create your account — let your social journey begin"
          </p>
          {/* Decorative Circle */}
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-black/20 rounded-full blur-2xl"></div>
        </div>

        <div className="col-span-1 lg:col-span-3 p-8 md:p-12 relative">
          <div className="lg:hidden mb-8 text-center">
            <h1 className="text-4xl font-black text-white tracking-tighter uppercase">
              Create Account
            </h1>
            <p className="text-red-500 font-bold tracking-widest text-xs uppercase mt-2">
              Start your journey
            </p>
          </div>

          <form onSubmit={handleSubmit(myHandleSubmit)} className="space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Full Name
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                  <input
                    {...register("name")}
                    type="text"
                    placeholder="Mariam Tarek"
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                  />
                </div>
                {formState.errors.name && (
                  <p className="text-red-500 text-xs font-bold">
                    {formState.errors.name.message}
                  </p>
                )}
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Username
                </label>
                <div className="relative">
                  <FiUser className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                  <input
                    {...register("username")}
                    type="text"
                    placeholder="Mariam433 (optional)"
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                  />
                </div>
                {formState.errors.username && (
                  <p className="text-red-500 text-xs font-bold">
                    {formState.errors.username.message}
                  </p>
                )}
              </div>
            </div>

            {/* Email */}
            <div className="group space-y-2">
              <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                Email Address
              </label>
              <div className="relative">
                <FiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                <input
                  {...register("email")}
                  type="email"
                  placeholder="Mariam@example.com"
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                />
              </div>
              {formState.errors.email && (
                <p className="text-red-500 text-xs font-bold">
                  {formState.errors.email.message}
                </p>
              )}
            </div>

            {/* Passwords */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Password
                </label>
                <div className="relative">
                  <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                  <input
                    {...register("password")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                  />
                </div>
                {formState.errors.password && (
                  <p className="text-red-500 text-xs font-bold">
                    {formState.errors.password.message}
                  </p>
                )}
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Confirm
                </label>
                <div className="relative">
                  <FiCheckCircle className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
                  <input
                    {...register("rePassword")}
                    type="password"
                    placeholder="••••••••"
                    className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
                  />
                </div>
                {formState.errors.rePassword && (
                  <p className="text-red-500 text-xs font-bold">
                    {formState.errors.rePassword.message}
                  </p>
                )}
              </div>
            </div>

            {/* Date and Gender */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div className="group space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Date of Birth
                </label>
                <input
                  type="date"
                  {...register("dateOfBirth")}
                  className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 px-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all [color-scheme:dark]"
                />
                {formState.errors.dateOfBirth && (
                  <p className="text-red-500 text-xs font-bold">
                    {formState.errors.dateOfBirth.message}
                  </p>
                )}
              </div>

              <div className="group space-y-2">
                <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">
                  Gender
                </label>
                <div className="flex h-[46px] items-center gap-4">
                  <label className="flex items-center gap-2 cursor-pointer group/radio">
                    <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-zinc-600 group-hover/radio:border-red-500 transition-colors">
                      <input
                        type="radio"
                        value="male"
                        {...register("gender")}
                        className="peer appearance-none w-full h-full absolute cursor-pointer"
                      />
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-zinc-400 group-hover/radio:text-white transition-colors">
                      Male
                    </span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer group/radio">
                    <div className="relative flex items-center justify-center w-5 h-5 rounded-full border border-zinc-600 group-hover/radio:border-red-500 transition-colors">
                      <input
                        type="radio"
                        value="female"
                        {...register("gender")}
                        className="peer appearance-none w-full h-full absolute cursor-pointer"
                      />
                      <div className="w-2.5 h-2.5 rounded-full bg-red-600 opacity-0 peer-checked:opacity-100 transition-opacity" />
                    </div>
                    <span className="text-sm text-zinc-400 group-hover/radio:text-white transition-colors">
                      Female
                    </span>
                  </label>
                </div>
                {formState.errors.gender && (
                  <p className="text-red-500 text-xs font-bold">
                    {formState.errors.gender.message}
                  </p>
                )}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-4">
              <button
                type="submit"
                className="w-full py-4 rounded-lg bg-red-600 hover:bg-red-700 text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-red-900/30"
              >
                {isLoading ? (
                  <span className="flex items-center justify-center gap-2">
                    <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                    Please wait...
                  </span>
                ) : (
                  "Create Account"
                )}
              </button>
            </div>

            {errorMessage && (
              <div className="bg-red-900/20 border border-red-500/20 p-3 rounded-lg flex items-center gap-3">
                <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                <p className="text-red-200 text-sm">{errorMessage}</p>
              </div>
            )}

            <p className="text-center text-zinc-500 text-xs mt-6">
              Already a member?{" "}
              <Link
                to="/login"
                className="text-red-500 hover:text-red-400 font-bold underline decoration-transparent hover:decoration-red-500 transition-all"
              >
                Log In
              </Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
