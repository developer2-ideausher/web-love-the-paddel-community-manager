import React, { useState } from 'react';
import { ListFilter } from 'lucide-react'; // Lucide filter icon

const Dropdown = ({ Title, filterArray, setHandleFilter, selectedValue }) => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  const handleFilterSelection = (value) => {
    setHandleFilter?.(value);
    setIsOpen(false); // close dropdown after selecting a filter
  };

  return (
    <div className="relative inline-block text-left">
      <button
        type="button"
        className="flex items-center gap-2 px-4 py-[10px] text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-full shadow-sm hover:bg-gray-50 focus:outline-none transition"
        onClick={toggleDropdown}
      >
        <ListFilter size={16} className="text-primary" />
        <span className="text-base font-medium text-primary">Filters</span>
      </button>

      {isOpen && (
        <div className="w-40 bg-white pb-3 pt-1 px-3 rounded-md absolute top-12 border border-[#ededed] z-50 right-0 left-0">
          <ul className="py-1 text-lg text-gray-700">
            {filterArray && filterArray.map((item, index) => (
              <label
                key={index}
                className="w-full flex items-center gap-2 mt-4 cursor-pointer"
              >
                <input
                  checked={selectedValue === item.value} 
                  onChange={() => handleFilterSelection(item.value)} 
                  type="radio"
                  name="filter"
                  value={item.value}
                  className="accent-gray-700"
                />
                <span className="text-sm text-black font-normal">
                  {item.label}
                </span>
              </label>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default Dropdown;
