import React from 'react'
import { LoaderCircleIcon } from 'lucide-react'
import { cn } from '@/lib/utils'
import Button from './Button'

const ButtonWithLoader = ({ loading, className, children, ...props }) => {
    return (
        <Button className={cn("rounded-full",className)} {...props}>

            {children}
            {
                loading &&
                <span className="ml-2 animate-spin">
                    <LoaderCircleIcon />
                </span>
            }

        </Button>
    )
}

export default ButtonWithLoader