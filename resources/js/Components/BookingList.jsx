import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import { faBars, faClock, faEye } from "@fortawesome/free-solid-svg-icons";
import MenuDropdown from '@/Components/MenuDropdown';
import NotificationPopover from '@/Components/NotificationPopover';

const BookingList = ({ auth, activeBookings = [], pastBookings = [] }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Singapore'
    }));

    // Update time every minute
    React.useEffect(() => {
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

    return (
        <div className="min-h-screen bg-lightGradient">
            {/* Header */}
            <header className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] px-6 py-10 sm:px-8 sm:py-12 flex justify-between items-center relative'>
                <div className="absolute top-8 left-4 sm:top-8 sm:left-8">
                    <Link href="/" className="text-4xl sm:text-6xl font-philosopher text-white hover:opacity-80">
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
                <Head title="My Bookings" />

                <div className="max-w-5xl mx-auto">
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        {/* Header Section */}
                        <div className="flex justify-between items-center mb-8">
                            <div className="flex items-center space-x-4">
                                <h2 className="text-2xl font-bold">My Bookings</h2>
                                <div className="space-x-2">
                                    <Link
                                        href="/bookings/quick-book"
                                        className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                                    >
                                        Quick Book
                                    </Link>
                                    <Link
                                        href="/book-room"
                                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                    >
                                        New Booking
                                    </Link>
                                </div>
                            </div>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Current Time</p>
                                <p className="font-mono">{currentTime}</p>
                            </div>
                        </div>

                        <div className="space-y-8">
                            {/* Active Bookings Section */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Active Bookings</h3>
                                <div className="space-y-4">
                                    {activeBookings.length > 0 ? (
                                        activeBookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className={`border rounded-lg p-4 ${
                                                    booking.status === 'pending' ? 'bg-yellow-50' : 'bg-blue-50'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <h4 className="text-lg font-semibold">{booking.classroom_name}</h4>
                                                        <div className="text-gray-600">
                                                            <p>{booking.date}</p>
                                                            <p>{booking.start_time} - {booking.end_time}</p>
                                                            <p>Duration: {booking.duration}</p>
                                                            <p className="mt-2">
                                                                Status:
                                                                <span className={`font-medium ml-1 ${
                                                                    booking.status === 'pending'
                                                                        ? 'text-yellow-600'
                                                                        : 'text-blue-600'
                                                                }`}>
                                  {booking.status === 'pending' ? 'Pending' : 'In Progress'}
                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div className="space-x-2">
                                                        {booking.status === 'pending' && (
                                                            <>
                                                                <button
                                                                    onClick={() => {}} // Will implement cancel functionality
                                                                    className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                                                                >
                                                                    Cancel
                                                                </button>
                                                                <Link
                                                                    href={`/bookings/${booking.id}/start-photo`}
                                                                    className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                                                                >
                                                                    Start Check-in
                                                                </Link>
                                                            </>
                                                        )}
                                                        <Link
                                                            href={`/bookings/${booking.id}`}
                                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No active bookings.</p>
                                    )}
                                </div>
                            </div>

                            {/* Past & Cancelled Bookings Section */}
                            <div>
                                <h3 className="text-xl font-semibold mb-4">Past & Cancelled Bookings</h3>
                                <div className="space-y-4">
                                    {pastBookings.length > 0 ? (
                                        pastBookings.map((booking) => (
                                            <div
                                                key={booking.id}
                                                className={`border rounded-lg p-4 ${
                                                    booking.status === 'cancelled' ? 'bg-red-50' : 'bg-gray-50'
                                                }`}
                                            >
                                                <div className="flex justify-between items-start">
                                                    <div className="space-y-2">
                                                        <h4 className="text-lg font-semibold">{booking.classroom_name}</h4>
                                                        <div className="text-gray-600">
                                                            <p>{booking.date}</p>
                                                            <p>{booking.start_time} - {booking.end_time}</p>
                                                            <p>Duration: {booking.duration}</p>
                                                            <p className="mt-2">
                                                                Status:
                                                                <span className={`font-medium ml-1 ${
                                                                    booking.status === 'cancelled'
                                                                        ? 'text-red-600'
                                                                        : 'text-green-600'
                                                                }`}>
                                  {booking.status === 'cancelled' ? 'Cancelled' : 'Finished'}
                                </span>
                                                            </p>
                                                        </div>
                                                    </div>
                                                    <div>
                                                        <Link
                                                            href={`/bookings/${booking.id}`}
                                                            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                                        >
                                                            View Details
                                                        </Link>
                                                    </div>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-gray-500 text-center py-4">No past or cancelled bookings.</p>
                                    )}
                                </div>
                            </div>
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

export default BookingList;
