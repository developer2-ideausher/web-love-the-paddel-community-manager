"use client"
import React from 'react'
import { cva } from 'class-variance-authority'
import { cn } from '@/Utilities/cn'

export default function Button({children,variant, buttontype,size, className, loading=false, ...attributes}) {
  return (
    <button type='button' className={cn(buttonVariants({variant,buttontype,size,className}),loading?"cursor-not-allowed":"")} disabled={loading} {...attributes}>
        {children}

        {loading && <svg className='animate-spin ml-2' xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
            <path d="M18.364 5.63604L16.9497 7.05025C15.683 5.7835 13.933 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19C15.866 19 19 15.866 19 12H21C21 16.9706 16.9706 21 12 21C7.02944 21 3 16.9706 3 12C3 7.02944 7.02944 3 12 3C14.4853 3 16.7353 4.00736 18.364 5.63604Z" fill="white"/>
        </svg>}
    </button>
  )
}

const buttonVariants = cva("font-medium rounded-lg text-base flex items-center justify-center font-inter",{
    variants:{
        variant:{
            primary:"bg-primary text-white rounded-full hover:bg-moderate-orange border-none",
            secondary: "bg-light-red text-danger border-none",
            danger:"bg-danger text-white hover:bg-[#dd0404]",
            success:"bg-success text-white hover:bg-success",
            "secondary-with-border": "bg-white rounded-full border-[1px] border-primary text-primary hover:bg-primary hover:text-white",
            "outline-primary2": "bg-white text-primary hover:bg-primary hover:text-white border-1.5 border-primary",
            "active-primary2": "bg-primary4 text-white border-none",
            "active-secondary": "bg-neutral3 text-black border-none",
            "disable-primary2": "bg-primary2 text-white border-none",
            "disable-secondary": "bg-neutral2 text-neutral3 border-none",
            "black": "bg-neutral5 text-white border-none hover:bg-black",
            plane: "text-primary2 border-2 border-primary2 rounded-lg text-base hover:bg-primary2 hover:text-white",
        },
        buttontype:{
            sm: "text-sm px-3 py-2 rounded-full",
            md: "text-base px-4 py-2 rounded-full",
            lg: "text-base px-4 py-2 rounded-full",
            submit: "text-base px-4 py-2 rounded-full"
        },
        size:{
            fw:"w-full",
            cw: "w-max"
        }
    },
    defaultVariants:{
        variant: "primary",
        buttontype: "lg",
        size: "fw"
    }
})