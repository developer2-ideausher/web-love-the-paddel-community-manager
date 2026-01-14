import React from 'react'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select"
import { cn } from '@/lib/utils'


const CardboxWithRating = ({ title,subTitle, isFilter, className,children }) => {
    return (

        <div className={cn("rounded-lg bg-white min-w-96 h-96", className)}>
            <div className={'flex gap-3 items-center justify-between px-5 py-3 h-16 border-b'}>
                <h4 className='font-semibold text-base'>{title} {subTitle &&<span className='font-normal text-base'>({subTitle})</span>}</h4>
                {
                    (isFilter === true) &&
                    <Select>
                        <SelectTrigger className="w-fit min-w-[160px] pr-2">
                            <SelectValue placeholder="Highly Rated  " />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="Highly Rated">Highly Rated</SelectItem>
                            <SelectItem value="Most Coupons">Most Coupons</SelectItem>
                            <SelectItem value="Stamps Redeemed">Stamps Redeemed</SelectItem>
                        </SelectContent>
                    </Select>
                }
            </div>
            <div>
                {children}
            </div>
        </div>


    )
}

export default CardboxWithRating