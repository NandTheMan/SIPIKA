import React, { useState, useEffect } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import { faBars, faClock } from "@fortawesome/free-solid-svg-icons";
import MenuDropdown from '@/Components/MenuDropdown.jsx';
import NotificationPopover from '@/Components/NotificationPopover.jsx';

const BookingDetail = ({ booking, auth }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Singapore'
    }));

    useEffect(() => {
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false,
                timeZone: 'Asia/Singapore'
            }));
        }, 60000);

        return () => clearInterval(timer);
    }, []);

    const getStatusBadgeClass = (status) => {
        switch (status) {
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 border-yellow-300';
            case 'in_progress':
                return 'bg-blue-100 text-blue-800 border-blue-300';
            case 'finished':
                return 'bg-green-100 text-green-800 border-green-300';
            case 'cancelled':
                return 'bg-red-100 text-red-800 border-red-300';
            default:
                return 'bg-gray-100 text-gray-800 border-gray-300';
        }
    };

    return (
        <div className="min-h-screen bg-lightGradient">
            {/* Header */}
            <header className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] px-6 py-10 sm:px-8 sm:py-12 flex justify-between items-center relative'>
                <div className="absolute top-8 left-4 sm:top-8 sm:left-8">
                    <Link href="/home" className="text-4xl sm:text-6xl font-philosopher text-white hover:opacity-80">
                        SIPIKA
                    </Link>
                </div>
                <div className='absolute top-8 right-6 sm:top-8 sm:right-8 flex items-center gap-4 sm:gap-6'>
                    <div className='flex items-center gap-2 sm:gap-3'>
                        <FontAwesomeIcon icon={faUser} className="text-white text-lg sm:text-xl" />
                        <p className='text-white text-sm sm:text-base'>
                            {auth.user.username} ({auth.user.major})
                        </p>
                    </div>
                    <FontAwesomeIcon
                        icon={faBell}
                        className="text-white text-lg sm:text-xl cursor-pointer hover:text-gray-300"
                        onClick={() => setIsNotificationOpen(true)}
                    />
                    <MenuDropdown />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Head title="Booking Details" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold">Booking Details</h2>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Current Time</p>
                                <p className="font-mono">{currentTime}</p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`inline-block px-4 py-2 rounded-full border ${getStatusBadgeClass(booking.status)} mb-6`}>
                            {booking.status === 'pending' && 'Pending'}
                            {booking.status === 'in_progress' && 'In Progress'}
                            {booking.status === 'finished' && 'Finished'}
                            {booking.status === 'cancelled' && 'Cancelled'}
                        </div>

                        {/* Booking Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-lg font-semibold mb-2">Classroom</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p className="font-medium">{booking.classroom.name}</p>
                                    <p className="text-gray-600">Floor {booking.classroom.floor}</p>
                                    <p className="text-gray-600">Capacity: {booking.classroom.capacity} people</p>
                                    <div className="mt-2">
                                        <p className="font-medium">Facilities:</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {booking.classroom.facilities.map((facility, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 text-sm px-2 py-1 rounded"
                                                >
                          {facility}
                        </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold mb-2">Booking Time</h3>
                                <div className="bg-gray-50 p-4 rounded-lg">
                                    <p><span className="font-medium">Date:</span> {booking.date}</p>
                                    <p><span className="font-medium">Time:</span> {booking.start_time} - {booking.end_time}</p>
                                    <p><span className="font-medium">Duration:</span> {booking.duration}</p>
                                    {booking.check_in_window && (
                                        <p className="mt-2">
                                            <span className="font-medium">Check-in Window:</span><br />
                                            {booking.check_in_window.earliest} - {booking.check_in_window.latest}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Photos Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold">Room Photos</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Start Photo */}
                                <div>
                                    <p className="font-medium mb-2">Start Condition:</p>
                                    {booking.start_photo ? (
                                        <img
                                            src={booking.start_photo}
                                            alt="Start condition"
                                            className="w-full rounded-lg shadow-lg"
                                        />
                                    ) : (
                                        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                                            No start photo available
                                        </div>
                                    )}
                                </div>

                                {/* End Photo */}
                                <div>
                                    <p className="font-medium mb-2">End Condition:</p>
                                    {booking.end_photo ? (
                                        <img
                                            src={booking.end_photo}
                                            alt="End condition"
                                            className="w-full rounded-lg shadow-lg"
                                        />
                                    ) : (
                                        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500">
                                            No end photo available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex justify-end space-x-4 mt-8">
                            {booking.can_cancel && (
                                <Link
                                    href={route('my-bookings.cancel', booking.id)}
                                    method="post"
                                    as="button"
                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                >
                                    Cancel Booking
                                </Link>
                            )}

                            {booking.can_start && (
                                <Link
                                    href={`/bookings/${booking.id}/start-photo`}
                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                >
                                    Start Check-in
                                </Link>
                            )}

                            {booking.can_end_early && (
                                <Link
                                    href={`/bookings/${booking.id}/end-photo`}
                                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                >
                                    End Early
                                </Link>
                            )}

                            <Link
                                href="/my-bookings"
                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                            >
                                Back to Bookings
                            </Link>
                        </div>
                    </div>
                </div>
            </main>

            <NotificationPopover
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                pinnedClassrooms={[]}
            />
        </div>
    );
};

export default BookingDetail;
