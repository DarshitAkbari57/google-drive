import React, { forwardRef } from "react";

const Input = forwardRef(
  ({ label, error, icon, className = "", ...props }, ref) => {
    return (
      <div className="space-y-2">
        {label && (
          <label
            htmlFor={props.id}
            className="block text-sm font-medium text-gray-700 dark:text-gray-300"
          >
            {label}
          </label>
        )}
        <div className="relative">
          {icon && (
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              {icon}
            </div>
          )}
          <input
            ref={ref}
            className={`
              w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm 
              placeholder-gray-400 shadow-sm transition-colors
              focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/20
              disabled:cursor-not-allowed disabled:opacity-50
              dark:border-gray-700 dark:bg-gray-800 dark:text-white dark:placeholder-gray-500
              ${icon ? "pl-10" : ""}
              ${
                error
                  ? "border-red-500 focus:border-red-500 focus:ring-red-500/20"
                  : ""
              }
              ${className}
            `}
            {...props}
          />
        </div>
        {error && <p className="text-sm text-red-500 mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
