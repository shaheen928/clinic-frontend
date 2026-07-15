import React from "react";
import { Outlet, Link } from "react-router-dom";
import Header from "../../copmponents/userCopmponents/Header";
import { FiLock, FiArrowUpRight } from "react-icons/fi";

const UserLayout = () => {
  return (
    <div
      className="min-h-screen bg-slate-50 flex flex-col justify-between"
      dir="ltr"
    >
      <Header />

      <main className="flex-1 w-full box-border">
        <Outlet />
      </main>

      <footer className="relative w-full mt-auto border-t border-slate-800/80 bg-slate-950/60 backdrop-blur-xl py-8 box-border overflow-hidden">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-px bg-linear-to-r from-transparent via-teal-500/30 to-transparent pointer-events-none" />

        <div className="max-w-7xl mx-auto px-6 flex flex-col sm:flex-row justify-between items-center gap-6 relative z-10">
          <p className="text-sm font-light text-slate-400 tracking-wide text-center sm:text-left">
            &copy; {new Date().getFullYear()}{" "}
            <span className="font-semibold text-transparent bg-clip-text bg-linear-to-r from-teal-400 to-emerald-400">
              ShifaClick
            </span>
            . All rights reserved.
          </p>

          <div className="flex items-center gap-4">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-widest hidden xs:inline-block">
              Internal Link
            </span>

            <Link
              to="/login"
              className="group flex items-center gap-2.5 px-4 py-2 text-xs font-medium text-slate-300 rounded-xl 
                       bg-slate-900/40 border border-slate-800 hover:border-teal-500/40 
                       hover:text-teal-400 shadow-lg shadow-black/20 backdrop-blur-md 
                       transition-all duration-300 ease-out hover:-translate-y-0.5"
            >
              <FiLock className="w-3.5 h-3.5 text-teal-500 group-hover:rotate-12 transition-transform duration-300" />
              <span>Staff Portal</span>
              <FiArrowUpRight className="w-3.5 h-3.5 text-slate-500 opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all duration-300" />
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserLayout;
