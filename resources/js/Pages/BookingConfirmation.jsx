import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faBars, faCheckCircle } from "@fortawesome/free-solid-svg-icons";

export default function BookingConfirmation({ booking }) {
    const [lineHeight1, setLineHeight1] = useState(0);
    const [lineHeight2, setLineHeight2] = useState(0);
    const step1Ref = useRef(null);
    const step2Ref = useRef(null);
    const step3Ref = useRef(null);

    useEffect(() => {
        const calculateHeights = () => {
            if (step1Ref.current && step2Ref.current) {
                const step1Bottom = step1Ref.current.getBoundingClientRect().bottom;
                const step2Top = step2Ref.current.getBoundingClientRect().top;
                setLineHeight1(step2Top - step1Bottom);
            }

            if (step2Ref.current && step3Ref.current) {
                const step2Bottom = step2Ref.current.getBoundingClientRect().bottom;
                const step3Top = step3Ref.current.getBoundingClientRect().top;
                setLineHeight2(step3Top - step2Bottom);
            }
        };

        calculateHeights();
        window.addEventListener('resize', calculateHeights);
        return () => window.removeEventListener('resize', calculateHeights);
    }, []);

    return (
        <div className="min-h-screen bg-lightGradient">
            {/* Header */}
            <header className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] px-6 py-10 sm:px-8 sm:py-12 flex justify-between items-center relative'>
                <div className="absolute top-8 left-4 sm:top-8 sm:left-8">
                    <Link href="/" className="text-4xl sm:text-5xl font-philosopher text-white hover:opacity-80">
                        SIPIKA
                    </Link>
                </div>
            </header>

            <div className="flex bg-lightGradient">
                {/* Progress Steps */}
                <div className="w-1/16 min-w-[80px] h-[52rem] place-self-center items-center justify-center border-1.5 border-white/60 bg-lightGradient shadow-xl rounded-lg p-4 my-12 ml-6 relative">
                    <div className="relative flex flex-col items-center h-full">
                        <div ref={step1Ref} className="relative z-10 mt-2">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white hover:bg-blue-700 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>

                        <div style={{height: `${lineHeight1}px`}} className="absolute top-16 w-1 bg-buttonBlue left-1/2 -translate-x-1/2 transition-all duration-500"/>

                        <div ref={step2Ref} className="relative z-10 mt-auto">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white hover:bg-blue-700 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>

                        <div style={{height: `${lineHeight2}px`}} className="absolute top-32 w-1 bg-buttonBlue left-1/2 -translate-x-1/2 transition-all duration-500"/>

                        <div ref={step3Ref} className="relative z-10 mt-auto mb-2">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white hover:bg-blue-700 transition-colors duration-300">
                                <span className="text-white font-bold">3</span>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8">
                    <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-xl p-8">
                        <div className="text-center mb-8">
                            <FontAwesomeIcon
                                icon={faCheckCircle}
                                className="text-green-500 text-6xl mb-4"
                            />
                            <h2 className="text-3xl font-bold text-gray-800">Booking Confirmed!</h2>
                            <p className="text-gray-600 mt-2">Your room has been successfully booked</p>
                        </div>

                        <div className="space-y-4">
                            <div className="border-t border-b py-4">
                                <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <p className="text-gray-600">Classroom</p>
                                        <p className="font-semibold">{booking.classroom}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Date</p>
                                        <p className="font-semibold">{booking.date}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Class Time</p>
                                        <p className="font-semibold">{booking.startTime} - {booking.endTime}</p>
                                    </div>
                                    <div>
                                        <p className="text-gray-600">Duration</p>
                                        <p className="font-semibold">{booking.duration} SKS</p>
                                    </div>
                                </div>
                            </div>

                            <div className="border-b pb-4">
                                <h3 className="text-lg font-semibold mb-4">Check-in Window</h3>
                                <p className="text-gray-600">
                                    You can check in between <span className="font-semibold">{booking.checkInWindow.earliest}</span> and{' '}
                                    <span className="font-semibold">{booking.checkInWindow.latest}</span>
                                </p>
                                <p className="text-sm text-gray-500 mt-1">
                                    (15 minutes before until 15 minutes after class start time)
                                </p>
                            </div>

                            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                <div className="flex items-start">
                                    <div className="flex-shrink-0 mt-0.5">
                                        <FontAwesomeIcon
                                            icon={faCheckCircle}
                                            className="text-blue-500 text-lg"
                                        />
                                    </div>
                                    <div className="ml-3">
                                        <h4 className="text-blue-800 font-medium">Important Reminders</h4>
                                        <ul className="mt-2 text-blue-700 text-sm list-disc list-inside space-y-1">
                                            <li>Take a photo of the classroom when you start</li>
                                            <li>Take another photo when you finish</li>
                                            <li>Keep the classroom clean and tidy</li>
                                            <li>Report any issues immediately</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            <div className="flex justify-center space-x-4 mt-8">
                                <Link
                                    href={`/book-room/check-in/${booking.id}`}
                                    className="bg-buttonBlue text-white px-8 py-4 rounded-lg hover:bg-blue-700 transition-colors font-medium text-lg"
                                >
                                    Start Check-in Process
                                </Link>
                                <Link
                                    href="/"
                                    className="bg-gray-500 text-white px-6 py-4 rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Back to Home
                                </Link>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
