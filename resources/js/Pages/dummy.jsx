import React from 'react';
import { Link } from '@inertiajs/react';

export default function Dummy(props) {
    return (
        <div className='flex justify-center space-x-4'>
            <Link href="/" className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Homepage
            </Link>
            <Link href="/signin" className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Sign In
            </Link>
            <Link href="/central" className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Central
            </Link>
            <Link href="/booking" className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Booking
            </Link>
            <Link href="/dashboard" className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Dashboard
            </Link>
            <Link href="/profile" className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Profile
            </Link>
            <Link href="/classroom" className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm'>
                Classrooms
            </Link>
        </div>
    );
}
