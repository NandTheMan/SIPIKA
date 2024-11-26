
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import LogCard from "@/Components/LoginPage/LogCard.jsx";

export default function Homepage(props) {
    return (
        <div className='min-h-screen bg-gradient-to-r from-blue-700 from-10% via-blue-900 via-30% to-black ]'>
            <head className='font-family: "Philosopher", serif flex left-3 text-white '>SIPIKA</head>
            <LogCard></LogCard>
        </div>
    )
}
