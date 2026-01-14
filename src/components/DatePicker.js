import React from 'react';

const DatePicker = ({ label, value, onChange }) => {
    const formattedDate = value ? value.toISOString().split('T')[0] : '';
    return (
        <div className='flex flex-col gap-y-2'>
            <label className='font-helveticaNeue font-medium leading-[150%] text-sm text-primary-text'>{label}</label>

            <input
                type="date"
                value={formattedDate}
            //    min = { new Date().toISOString().split('T')[0] }
                onChange={(e) => {
                    const selectedDate = new Date(e.target.value);
                    onChange && onChange(selectedDate);
                }}
                className={`bg-primary-50 border border-primary-75 font-helveticaNeue p-4 rounded-lg font-medium text-sm placeholder:font-normal ${value ? 'text-black' : 'text-tertiary-text'
                    }`}
            />
        </div>
    );
};

export default DatePicker;
