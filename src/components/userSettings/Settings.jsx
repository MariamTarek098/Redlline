import React, { useState } from 'react';
import { FiKey, FiLock } from 'react-icons/fi';
import { useForm } from "react-hook-form";
import * as zod from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import axios from "axios";
import toast from "react-hot-toast";

export default function Settings() {
  const [errorMessage, setErrorMessage] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const passwordRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$/;
  
  const changePasswordSchema = zod.object({
    password: zod.string().nonempty("Current password is required"),
    newPassword: zod.string()
      .nonempty("New password is required")
      .regex(
        passwordRegex,
        "Password must be 8+ chars and include uppercase, lowercase, number, and special character."
      ),
    confirmPassword: zod.string().nonempty("Please confirm your new password"),
  }).refine((data) => data.newPassword === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"], // Puts the error under the confirm password field
  });

  const { handleSubmit, register, formState, reset } = useForm({
    defaultValues: {
      password: "",
      newPassword: "",
      confirmPassword: "",
    },
    mode: "onSubmit",
    resolver: zodResolver(changePasswordSchema),
  });

  async function myHandleSubmit(values) {
    setIsLoading(true);
    setErrorMessage(null);

    const apiPayload = {
      password: values.password,
      newPassword: values.newPassword
    };

    axios
      .patch("https://route-posts.routemisr.com/users/change-password", apiPayload, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("tkn")}`, 
        },
      })
      .then(function (resp) {
        toast.success("Password changed successfully!");
        reset(); 
      })
      .catch(function (error) {
        console.log("error", error.response?.data?.message);
        setErrorMessage("Failed to update password. Please try again.");
        setTimeout(() => {
          setErrorMessage(null);
        }, 5000);
      })
      .finally(function () {
        setIsLoading(false);
      });
  }

  return (
    <div className='min-h-screen bg-[#050505] text-zinc-200 pt-24 sm:pt-32 pb-10 px-4 sm:px-6 flex justify-center items-start'>

      <div className="w-full max-w-xl bg-zinc-900 border border-zinc-800 rounded-[2rem] shadow-2xl p-6 sm:p-10 relative overflow-hidden">

        <div className="absolute -top-20 -right-20 w-64 h-64 bg-red-600/10 rounded-full blur-[80px] pointer-events-none" />

        <div className="flex items-center gap-4 mb-8 relative z-10">
          <div className="bg-red-500/10 p-3.5 rounded-full text-red-500 shrink-0 border border-red-500/20">
            <FiKey size={24} />
          </div>
          <div>
            <h2 className="text-2xl font-extrabold text-white">Change Password</h2>
            <p className="text-sm text-zinc-400 mt-1">
              Keep your account secure by using a strong password.
            </p>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(myHandleSubmit)} className="flex flex-col gap-6 relative z-10">
          
          {/* Current Password */}
          <div className="group space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Current Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
              <input
                {...register("password")}
                type="password"
                placeholder="Enter current password"
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
              />
            </div>
            {formState.errors.password && <p className="text-red-500 text-xs font-bold">{formState.errors.password.message}</p>}
          </div>

          {/* New Password */}
          <div className="group space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">New Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
              <input
                {...register("newPassword")}
                type="password"
                placeholder="Enter new password"
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
              />
            </div>
            {formState.errors.newPassword ? (
              <p className="text-red-500 text-xs font-bold">{formState.errors.newPassword.message}</p>
            ) : (
              <p className="text-[10px] text-zinc-500 font-medium">
                At least 8 characters with uppercase, lowercase, number, and special character.
              </p>
            )}
          </div>

          {/* Confirm New Password */}
          <div className="group space-y-2">
            <label className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest">Confirm New Password</label>
            <div className="relative">
              <FiLock className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-500 group-focus-within:text-red-500 transition-colors" />
              <input
                {...register("confirmPassword")}
                type="password"
                placeholder="Re-enter new password"
                className="w-full bg-black/50 border border-zinc-800 rounded-lg py-3 pl-11 pr-4 text-white placeholder-zinc-700 focus:outline-none focus:border-red-600 focus:ring-1 focus:ring-red-600 transition-all"
              />
            </div>
            {formState.errors.confirmPassword && <p className="text-red-500 text-xs font-bold">{formState.errors.confirmPassword.message}</p>}
          </div>

          {/* Error Message Alert (From API) */}
          {errorMessage && (
            <div className="bg-red-900/20 border border-red-500/20 p-3 rounded-lg flex items-center gap-3 mt-2">
              <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
              <p className="text-red-200 text-sm font-medium">{errorMessage}</p>
            </div>
          )}

          <div className="pt-2">
            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 rounded-lg bg-red-600 hover:bg-red-700 disabled:bg-red-900/50 disabled:text-zinc-500 disabled:cursor-not-allowed text-white font-bold text-sm tracking-widest uppercase transition-all duration-300 transform active:scale-[0.98] shadow-lg shadow-red-900/30"
            >
              {isLoading ? (
                <span className="flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/20 border-t-white rounded-full animate-spin" />
                  Updating...
                </span>
              ) : (
                "Update Password"
              )}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}