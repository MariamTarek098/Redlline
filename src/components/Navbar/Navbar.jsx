import React, { useState, useContext } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import {
  FiHome,
  FiUser,
  FiBell,
  FiSettings,
  FiLogOut,
  FiMenu,
} from "react-icons/fi";
import { authContext } from "../context/AuthContext";
import toast from "react-hot-toast";
import { createPortal } from "react-dom";

export default function Navbar() {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  const { token, clearToken, user, userPhoto } = useContext(authContext);
  const navigate = useNavigate();

  function handleLogout() {
    clearToken();
    navigate("/login");
    toast.success("You Are Logged out");
    setIsDropdownOpen(false);
  }

  const defaultAvatar =
    "https://pub-3cba56bacf9f4965bbb0989e07dada12.r2.dev/linkedPosts/default-profile.png";
  const displayPhoto = userPhoto || user?.photo || defaultAvatar;
  const userName = user?.name || "User";

  return (
    <>
      {!token ? (
        ""
      ) : (
        <nav className="fixed top-0 left-0 w-full z-50 bg-black/80 backdrop-blur-md border-b border-white/10 shadow-lg shadow-red-900/5">
          <div className="max-w-[1920px] mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex items-center justify-between h-20">
              <Link
                to="/home"
                className="flex items-center gap-3 group shrink-0"
              >
                <div className="w-10 h-10 bg-red-600 rounded-xl flex items-center justify-center text-white font-black text-xl shadow-[0_0_15px_rgba(220,38,38,0.5)] group-hover:scale-105 transition-transform duration-300">
                  R
                </div>
                <span className="hidden sm:inline text-2xl font-black text-white tracking-tighter">
                  <span className="text-red-500">Red</span>line
                </span>
              </Link>

              <div className="flex-1 flex justify-center px-2 sm:px-0">
                <div className="flex items-center gap-1 bg-zinc-900 border border-zinc-800 rounded-full p-1.5 shadow-inner">
                  <NavLink
                    to="/home"
                    className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 sm:px-6 rounded-full text-sm font-bold transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }
                `}
                  >
                    <FiHome className="text-xl sm:text-lg" />
                    <span className="hidden md:inline">Feed</span>
                  </NavLink>

                  <NavLink
                    to="/profile"
                    className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 sm:px-6 rounded-full text-sm font-bold transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }
                `}
                  >
                    <FiUser className="text-xl sm:text-lg" />
                    <span className="hidden md:inline">Profile</span>
                  </NavLink>

                  <NavLink
                    to="/notifications"
                    className={({ isActive }) => `
                  flex items-center gap-2 px-4 py-2.5 sm:px-6 rounded-full text-sm font-bold transition-all duration-300
                  ${
                    isActive
                      ? "bg-gradient-to-r from-red-600 to-red-700 text-white shadow-[0_0_20px_rgba(220,38,38,0.4)]"
                      : "text-zinc-400 hover:text-white hover:bg-white/5"
                  }
                `}
                  >
                    <FiBell className="text-xl sm:text-lg" />
                    <span className="hidden md:inline">Notifications</span>
                  </NavLink>
                </div>
              </div>

              <div className="relative shrink-0">
                <button
                  onClick={toggleDropdown}
                  className="flex items-center gap-2 sm:gap-3 pl-1 pr-1 sm:pl-2 sm:pr-4 py-1 sm:py-2 bg-transparent sm:bg-zinc-900 border-0 sm:border border-transparent sm:border-zinc-800 hover:border-red-500/50 rounded-full transition-all duration-300 group"
                >
                  <div className="relative w-9 h-9 sm:w-9 sm:h-9">
                    <img
                      src={displayPhoto}
                      alt={`${userName}'s Profile`}
                      className="w-full h-full rounded-full object-cover border-2 border-zinc-800 group-hover:border-red-500 transition-colors"
                    />
                    <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-zinc-900 rounded-full"></div>
                  </div>

                  {/* Name */}
                  <span className="text-white font-bold text-sm hidden lg:block group-hover:text-red-400 transition-colors">
                    {userName}
                  </span>

                  {/* Menu Icon */}
                  <div className="hidden sm:flex w-8 h-8 rounded-full bg-zinc-800 items-center justify-center text-zinc-400 group-hover:bg-red-600 group-hover:text-white transition-all">
                    <FiMenu />
                  </div>
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen &&
                  createPortal(
                    <>
                      {/* Overlay */}
                      <div
                        className="fixed inset-0 z-[999]"
                        onClick={() => setIsDropdownOpen(false)}
                      />

                      {/* Dropdown */}
                      <div className="fixed right-6 top-20 z-[1000] w-60 bg-zinc-900 border border-zinc-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.5)] overflow-hidden">
                        <div className="p-2 space-y-1">
                          <Link
                            to="/profile"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                          >
                            <FiUser /> Profile
                          </Link>

                          <Link
                            to="/settings"
                            onClick={() => setIsDropdownOpen(false)}
                            className="flex items-center gap-3 px-4 py-3 rounded-xl text-zinc-400 hover:text-white hover:bg-zinc-800 transition-all"
                          >
                            <FiSettings /> Settings
                          </Link>

                          <div className="h-px bg-zinc-800 my-1 mx-2"></div>

                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-red-500 hover:bg-red-900/20 hover:text-red-400 transition-all text-left"
                          >
                            <FiLogOut /> Logout
                          </button>
                        </div>
                      </div>
                    </>,
                    document.body,
                  )}
              </div>
            </div>
          </div>
        </nav>
      )}
    </>
  );
}
