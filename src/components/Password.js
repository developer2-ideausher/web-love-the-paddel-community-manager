"use client";
import React, { useState } from 'react';
import Input from './Input';

export default function Password({ children, ...attributes }) {
  const [show, setShow] = useState(false);

  return (
    <div className="w-full flex items-center relative">
      {/* Password Input */}
      <Input
        type={show ? "text" : "password"}
        {...attributes}
        className="w-full outline-none" 
      />

      {/* Toggle Visibility Icon */}
      <span
        className="absolute right-4 top-1/2 transform -translate-y-1/2 flex items-center justify-center cursor-pointer"
        role="button"
        aria-label="Show Password"
        title="Show Password"
        onClick={() => setShow((prev) => !prev)}
      >
        {/* Toggle between eye-open and eye-closed icons */}
        {show ? (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#787878"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-eye"
          >
            <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8Z" />
            <circle cx="12" cy="12" r="3" />
          </svg>
        ) : (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="#787878"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="lucide lucide-eye-off"
          >
            <path d="M10.733 5.076a10.744 10.744 0 0 1 11.205 6.575 1 1 0 0 1 0 .696 10.747 10.747 0 0 1-1.444 2.49" />
            <path d="M14.084 14.158a3 3 0 0 1-4.242-4.242" />
            <path d="M17.479 17.499a10.75 10.75 0 0 1-15.417-5.151 1 1 0 0 1 0-.696 10.75 10.75 0 0 1 4.446-5.143" />
            <path d="m2 2 20 20" />
          </svg>
        )}
      </span>
    </div>
  );
}
