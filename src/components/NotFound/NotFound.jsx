import React from 'react';
import { Link } from 'react-router-dom';
import { FiHome, FiAlertTriangle } from 'react-icons/fi';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center relative overflow-hidden selection:bg-red-500/30">
      
      <div className="absolute top-1/4 left-1/4 w-[300px] md:w-[500px] h-[300px] md:h-[500px] bg-red-900/20 rounded-full blur-[120px] pointer-events-none animate-pulse" />
      <div className="absolute bottom-1/4 right-1/4 w-[250px] md:w-[400px] h-[250px] md:h-[400px] bg-red-600/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="relative z-10 flex flex-col items-center text-center p-6 animate-in fade-in zoom-in-95 duration-500">
        
        <div className="bg-red-500/10 p-4 rounded-full border border-red-500/20 mb-6 shadow-lg shadow-red-500/10">
          <FiAlertTriangle className="text-red-500 text-4xl" />
        </div>

        <h1 className="text-[8rem] md:text-[12rem] font-black leading-none text-transparent bg-clip-text bg-gradient-to-br from-white via-zinc-400 to-zinc-800 drop-shadow-2xl">
          404
        </h1>
        
        <h2 className="text-2xl md:text-3xl font-bold text-white mt-4 tracking-tight">
          Page not found
        </h2>
        <p className="text-zinc-400 mt-3 max-w-md text-sm md:text-base leading-relaxed">
          The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
        </p>

        <Link 
          to="/home" 
          className="mt-10 flex items-center gap-3 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-xl font-bold transition-all duration-300 shadow-xl shadow-red-600/20 hover:shadow-red-600/40 hover:-translate-y-1 active:translate-y-0"
        >
          <FiHome size={20} />
          Back to Homepage
        </Link>

      </div>
    </div>
  );
}