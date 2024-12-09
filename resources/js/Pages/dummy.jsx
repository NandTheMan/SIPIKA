import React, {useState} from 'react';
import { Head, Link } from '@inertiajs/react';

export default function dummy(props) {
    return (
        <div className='flex justify-center'>
            <button className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Homepage
            </button>
            <button className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Sing In
            </button>
            <button className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Log In
            </button>
            <button className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Booking
            </button>
        </div>
    )
}
