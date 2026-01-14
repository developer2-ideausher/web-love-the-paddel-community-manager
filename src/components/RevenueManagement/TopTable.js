import Image from 'next/image'
import React from 'react'

const TopTable = ({ data }) => {
    return (
        <ul className='w-full'>

            {data?.length > 0 ? data?.map((item, index) => {
                return (

                    <ul key={item._id || index} className='flex  w-full items-center justify-between px-4 py-2 pt-4'>
                        <div className='flex w-3/4 items-center gap-2'>
                            <div>{index + 1}</div>
                            <div className='border border-black3 w-[32px] h-[32px] rounded-full overflow-hidden'>
                                <img
                                    src={item?.profilePic?.url || './images/dummyUser.png'}
                                    width={32}
                                    height={32}
                                    className='w-full h-full object-cover'
                                    alt='some Image'
                                />
                            </div>

                            <p className='font-medium text-sm text-black-1'>{item.businessName || "--"} </p>

                        </div>
                        <div className='mr-6 w-1/4 flex items-center justify-center'>
                            <p className='font-medium text-sm text-black-1'>
                                {item?.totalRedemptions } {" "} Coupons</p>
                        </div>
                    </ul>

                )
            }) : <div className='flex  w-full min-h-[250px] items-center justify-center px-4 py-2 pt-4'>No Data Available</div>}
        </ul>
    )
}

export default TopTable;
