"use client";

import { useState, useRef, useEffect } from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
export default function DynamicDropdown({
  data,
  placeholder,
  callback,
  value,
}) {
  const [isOpen, setIsOpen] = useState(false); 
  const [selectedValue, setSelectedValue] = useState(value || null);
  const ref = useRef(null);
  useEffect(() => {
    if (value) {
      setSelectedValue(value);
    }
  }, [value]); 
  const handler = (item) => {
    setSelectedValue(item); 
    callback(item);
    setIsOpen(false); 
  };
  const toggleDropdown = () => {
    setIsOpen((prev) => !prev); 
  };

  return (
    <div className="w-full relative">
      <div
        onClick={toggleDropdown}
        className=" cursor-pointer w-full flex items-center justify-between py-3 pl-5 rounded-lg focus:outline-none focus:border-2 focus:border-[#D0D0D0] bg-grey-6"
      >
        <span
          className={`capitalize ${
            selectedValue ? "text-black" : "text-[#6E6E6E]"
          } text-sm font-normal`}
        >
          {selectedValue ? selectedValue.title : placeholder}
        </span>
        <span className="absolute top-3 right-2">
          {isOpen ? <ChevronUp color={"#686868"} /> : <ChevronDown color={"#686868"} />}
        </span>
      </div>

      {isOpen && (
         <ul className="absolute left-0 w-full mt-1 border border-[#D0D0D0] bg-white rounded-lg shadow-lg z-10 max-h-48 overflow-y-auto mb-7">
         {data &&
           data.map((item, index) => (
             <li
               key={`${placeholder}-${index}`}
               onClick={() => handler(item)}
               className="cursor-pointer py-2 px-4 hover:bg-gray-100 capitalize text-black text-sm font-normal"
             >
               {item.title}
             </li>
           ))}
       </ul>
      )}
    </div>
  );
}
