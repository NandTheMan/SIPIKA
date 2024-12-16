import React, { useState } from 'react';
import { Head, Link } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import {
    faBars,
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
        switch(status) {
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
                    icon: faCircleCheck,
                    text: status,
                    color: 'text-gray-600',
                    bgColor: 'bg-gray-100'
                };
        }
    };

    const config = getStatusConfig(status);

    return (
        <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium ${config.color} ${config.bgColor}`}>
            <FontAwesomeIcon icon={config.icon} className={status === 'in_progress' ? 'animate-spin' : ''} />
            {config.text}
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

            <main className="container mx-auto px-4 py-12">
                <Head title="My Bookings" />

                <div className="max-w-6xl mx-auto">
                    {/* Quick Actions */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                        <Link
                            href="/quick-book"
                            className="flex items-center gap-4 bg-gradient-to-r from-green-500 to-emerald-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                        >
                            <div className="p-3 bg-white/20 rounded-lg">
                                <FontAwesomeIcon icon={faGaugeHigh} className="text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">Quick Book</h3>
                                <p className="text-white/80">Instantly find and book available rooms</p>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} className="ml-auto text-xl" />
                        </Link>

                        <Link
                            href="/book-room"
                            className="flex items-center gap-4 bg-gradient-to-r from-blue-500 to-indigo-600 p-6 rounded-xl text-white shadow-lg hover:shadow-xl transition-all duration-300 hover:translate-y-[-2px]"
                        >
                            <div className="p-3 bg-white/20 rounded-lg">
                                <FontAwesomeIcon icon={faCalendarPlus} className="text-2xl" />
                            </div>
                            <div>
                                <h3 className="text-xl font-bold">New Booking</h3>
                                <p className="text-white/80">Choose your preferred classroom</p>
                            </div>
                            <FontAwesomeIcon icon={faArrowRight} className="ml-auto text-xl" />
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
                                                        <p>{booking.date}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Time</p>
                                                        <p>{booking.start_time} - {booking.end_time}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Duration</p>
                                                        <p>{booking.duration}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3">
                                                {booking.status === 'pending' && (
                                                    <>
                                                        <form
                                                            onSubmit={(e) => {
                                                                e.preventDefault();
                                                                router.post(`/my-bookings/${booking.id}/cancel`);
                                                            }}
                                                            className="inline-block"
                                                        >
                                                        </form>
                                                        <Link
                                                            href={`/book-room/check-in/${booking.id}`}  // Changed from /bookings/${booking.id}/start-photo
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
                                                    <FontAwesomeIcon icon={faEye} />
                                                    Details
                                                </Link>
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <FontAwesomeIcon icon={faCalendarPlus} className="text-2xl text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-lg">No active bookings</p>
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
                                                        <p>{booking.date}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Time</p>
                                                        <p>{booking.start_time} - {booking.end_time}</p>
                                                    </div>
                                                    <div>
                                                        <p className="text-sm font-medium text-gray-500">Duration</p>
                                                        <p>{booking.duration}</p>
                                                    </div>
                                                </div>
                                            </div>
                                            <Link
                                                href={`/my-bookings/${booking.id}`}
                                                className="inline-flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                                            >
                                                <FontAwesomeIcon icon={faEye} />
                                                Details
                                            </Link>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <div className="text-center py-12">
                                    <div className="bg-gray-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                                        <FontAwesomeIcon icon={faCalendarPlus} className="text-2xl text-gray-400" />
                                    </div>
                                    <p className="text-gray-500 text-lg">No past bookings</p>
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
