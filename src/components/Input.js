"use client";
import { cn } from "@/Utilities/cn";
import { cva } from "class-variance-authority";
import React from "react";

export default function Input({
  children,
  variant,
  invalidmessage,
  type,
  className,
  ...attributes
}) {
  return (
    <>
      <input
        type={type}
        {...attributes}
        className={cn(inputVariants({ variant, type, className }))} 
      />
      {invalidmessage && (
        <span className="w-full my-1 hidden peer-invalid:block text-danger text-sm">
          {invalidmessage}
        </span>
      )}
    </>
  );
}

const inputVariants = cva("w-full peer focus:outline-none", {
  variants: {
    variant: {
      thrive:
        "font-inter text-base bg-neutral-1000 text-black placeholder-shown:text-neutral4 ",
    },
    type: {
      email: "focus:border-neutral-1000",
      text: "focus:border-neutral-1000 bg-grey-6 rounded-lg", 
      password: "focus:border-neutral-1000",
      number: "focus:border-neutral-1000 bg-grey-6 rounded-lg", 
      date: "focus:border-neutral-1000 focus:border-2 disable-scroller",
      time: "focus:border-neutral-1000 focus:border-2 disable-scroller",
    },
  },
  defaultVariants: {
    variant: "thrive",
    type: "email",
  },
});
