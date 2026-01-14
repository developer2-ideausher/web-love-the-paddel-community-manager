import React, { useState } from 'react';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { cn } from '@/lib/utils';

const CardboxWithFilters = ({ title, subTitle, isFilter,setFilter, className, children }) => {
    const [selectedFilter, setSelectedFilter] = useState("Weekly"); // Default value

    const handleFilterChange = (value) => {
        setSelectedFilter(value); // Update the selected value
        setFilter(value);
       
    };

    return (
        <div className={cn("rounded-lg bg-white min-w-96 h-96", className)}>
            <div className={'flex gap-3 items-center justify-between px-5 py-3 h-16 border-b'}>
                <h4 className='font-semibold text-base'>
                    {title} {subTitle && <span className='font-normal text-base'>({subTitle})</span>}
                </h4>
                {isFilter === true && (
                    <Select onValueChange={handleFilterChange}>
                        <SelectTrigger className="w-fit min-w-[100px]">
                            <SelectValue placeholder={selectedFilter} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="weekly">Weekly</SelectItem>
                            <SelectItem value="monthly">Monthly</SelectItem>
                            <SelectItem value="yearly">Yearly</SelectItem>
                        </SelectContent>
                    </Select>
                )}
            </div>
            <div>{children}</div>
        </div>
    );
};

export default CardboxWithFilters;
