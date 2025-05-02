import React from "react";
import { LogIn, Key } from "lucide-react";

const AuthLayout = ({ children, title, subtitle, type }) => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex flex-col justify-center py-12 sm:px-6 lg:px-8 relative overflow-hidden">
      {/* Background pattern */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-700/25 bg-[bottom_1px_center] dark:[mask-image:linear-gradient(transparent,#000)] -z-10" />

      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute -top-48 -right-48 md:-top-72 md:-right-72 w-96 h-96 md:w-[40rem] md:h-[40rem] rounded-full bg-blue-400/20 blur-3xl" />
        <div className="absolute -bottom-48 -left-48 md:-bottom-72 md:-left-72 w-96 h-96 md:w-[40rem] md:h-[40rem] rounded-full bg-indigo-400/20 blur-3xl" />
      </div>

      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-white">
          {title}
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 dark:text-gray-400 max-w">
          {subtitle}
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10 transition-all duration-200 hover:shadow-md">
          {children}
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
