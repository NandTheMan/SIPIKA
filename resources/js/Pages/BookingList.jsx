import React, { useState } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faSignOutAlt, faUser } from '@fortawesome/free-solid-svg-icons'; // Added faUser
import {
    faCalendarPlus,
    faGaugeHigh,
    faCircleCheck,
    faSpinner,
    faHourglassHalf,
    faBan,
    faEye,
    faArrowRight
} from "@fortawesome/free-solid-svg-icons";
import MenuDropdown from '@/Components/MenuDropdown';
import NotificationPopover from '@/Components/NotificationPopover';

const BookingStatus = ({ status }) => {
    const getStatusConfig = (status) => {
        switch (status) {
            case 'pending':
                return {
                    icon: faHourglassHalf,
                    text: 'Pending',
                    color: 'text-yellow-600',
                    bgColor: 'bg-yellow-100'
                };
            case 'in_progress':
                return {
                    icon: faSpinner,
                    text: 'In Progress',
                    color: 'text-blue-600',
                    bgColor: 'bg-blue-100'
                };
            case 'finished':
                return {
                    icon: faCircleCheck,
                    text: 'Finished',
                    color: 'text-green-600',
                    bgColor: 'bg-green-100'
                };
            case 'cancelled':
                return {
                    icon: faBan,
                    text: 'Cancelled',
                    color: 'text-red-600',
                    bgColor: 'bg-red-100'
                };
            default:
                return {
                    icon: faCircleCheck, // Consider a more neutral icon here, like faQuestionCircle
                    text: status,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold ${config.color} ${config.bgColor}`}>
            <FontAwesomeIcon icon={config.icon} className={`${status === 'in_progress' ? 'animate-spin' : ''} text-base`} /> {/* Increased icon size */}
            <span className="font-medium">{config.text}</span> {/* Made text bolder */}
        </span>
    );
};

const BookingList = ({ auth, activeBookings = [], pastBookings = [] }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Singapore'
    }));

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

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-lightGradient font-inter">
            {/* Header */}
            <header className="w-full bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-6 flex justify-between items-center">
                <div>
                    <Link href="/">
                        <img src="/images/logo.png" alt="logo-sipika" width={146} />
                    </Link>
                </div>
                <div className="flex items-center gap-6">
                    <div className="text-white font-sfproreg">
                        <FontAwesomeIcon icon={faUser} className="mr-2" /> {/* Added user icon */}
                        {auth.user.username} ({auth.user.major})
                    </div>
                    <button
                        type="button"
                        onClick={handleLogout}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
                    </button>
                    <div className="relative"> {/* Added relative positioning for the potential badge */}
                        <FontAwesomeIcon
                            icon={faBell}
                            className="text-white cursor-pointer hover:text-gray-200"
                            onClick={() => setIsNotificationOpen(true)}
                        />
                        {/* Example of a notification badge - uncomment and adjust as needed
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
                            3
                        </span>
                        */}
                    </div>
                    <MenuDropdown />
                </div>
            </header>

            <main className="container mx-auto px-4 py-12">
                <Head title="My Bookings" />

                <div className="max-w-6xl mx-auto">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <Link
                            href="/quick-book"
                            className="group flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                        >
                            <div className="p-3 bg-white/20 group-hover:bg-white/30 rounded-lg transition-colors duration-300">
                                <FontAwesomeIcon icon={faGaugeHigh} className="text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-white/90">Quick Book</h3>
                                <p className="text-white/80 group-hover:text-white/70">Instantly find and book available rooms</p>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} className="ml-auto text-xl transition-transform group-hover:translate-x-1" /> {/* Added animation on hover */}
                        </Link>

                        <Link
                            href="/book-room"
                            className="group flex items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                        >
                            <div className="p-3 bg-white/20 group-hover:bg-white/30 rounded-lg transition-colors duration-300">
                                <FontAwesomeIcon icon={faCalendarPlus} className="text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold group-hover:text-white/90">New Booking</h3>
                                <p className="text-white/80 group-hover:text-white/70">Choose your preferred classroom</p>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} className="ml-auto text-xl transition-transform group-hover:translate-x-1" /> {/* Added animation on hover */}
                        </Link>
                    </div>

                    {/* Active Bookings */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8 mb-8">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-2xl font-bold text-gray-800">Active Bookings</h2>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Current Time</p>
                                <p className="font-mono text-lg text-gray-700">{currentTime}</p>
                            </div>
                        </div>

                        <div className="space-y-4">
                            {activeBookings.length > 0 ? (
                                activeBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="bg-white rounded-xl border border-gray-100 shadow-md hover:shadow-lg transition-shadow p-6"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-xl font-bold text-gray-800">{booking.classroom_name}</h4>
                                                    <BookingStatus status={booking.status} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-gray-600">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Date</p>
                                                        <p className="font-medium">{booking.date}</p> {/* Made date bolder */}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Time</p>
                                                        <p className="font-medium">{booking.start_time} - {booking.end_time}</p> {/* Made time bolder */}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Duration</p>
                                                        <p className="font-medium">{booking.duration}</p> {/* Made duration bolder */}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                {booking.status === 'pending' && (
                                                    <>
                                                        {/* Cancel Form - Consider moving this to the details page for a cleaner UI
                                                        <form
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                router.post(`/my-bookings/${booking.id}/cancel`);
                                                            }}
                                                            className="inline-block"
                                                        >
                                                            <button
                                                                type="submit"
                                                                className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors font-medium"
                                                            >
                                                                Cancel
                                                            </button>
                                                        </form>
                                                        */}
                                                        <Link
                                                            href={`/book-room/check-in/${booking.id}`}
                                                            className="px-4 py-2 bg-yellow-500 text-white rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                                                        >
                                                            Start Check-in
                                                        </Link>
                                                    </>
                                                )}
                                                <Link
                                                    href={`/my-bookings/${booking.id}`}
                                                    className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                                >
                                                    <FontAwesomeIcon icon={faEye} className="text-sm" /> {/* Smaller icon */}
                                                    <span className="font-medium">Details</span> {/* Made text bolder */}
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <FontAwesomeIcon icon={faCalendarPlus} className="text-3xl text-gray-400" /> {/* Increased icon size */}
                                    </div>
                                    <p className="text-gray-500 text-lg font-medium">No active bookings</p> {/* Made text bolder */}
                                    <p className="text-gray-400 mt-1">Your current bookings will appear here</p>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Past Bookings */}
                    <div className="bg-white/80 backdrop-blur-lg rounded-2xl shadow-xl p-8">
                        <h2 className="text-2xl font-bold text-gray-800 mb-6">Past & Cancelled Bookings</h2>
                        <div className="space-y-4">
                            {pastBookings.length > 0 ? (
                                pastBookings.map((booking) => (
                                    <div
                                        key={booking.id}
                                        className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow p-6"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div className="space-y-3">
                                                <div className="flex items-center gap-3">
                                                    <h4 className="text-xl font-bold text-gray-800">{booking.classroom_name}</h4>
                                                    <BookingStatus status={booking.status} />
                                                </div>
                                                <div className="grid grid-cols-2 gap-4 text-gray-600">
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Date</p>
                                                        <p className="font-medium">{booking.date}</p> {/* Made date bolder */}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Time</p>
                                                        <p className="font-medium">{booking.start_time} - {booking.end_time}</p> {/* Made time bolder */}
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Duration</p>
                                                        <p className="font-medium">{booking.duration}</p> {/* Made duration bolder */}
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/my-bookings/${booking.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                            >
                                                <FontAwesomeIcon icon={faEye} className="text-sm" /> {/* Smaller icon */}
                                                <span className="font-medium">Details</span> {/* Made text bolder */}
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <FontAwesomeIcon icon={faCalendarPlus} className="text-3xl text-gray-400" /> {/* Increased icon size */}
                                    </div>
                                    <p className="text-gray-500 text-lg font-medium">No past bookings</p> {/* Made text bolder */}
                                    <p className="text-gray-400 mt-1">Your booking history will appear here</p>
                                </div>
                            )}
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
