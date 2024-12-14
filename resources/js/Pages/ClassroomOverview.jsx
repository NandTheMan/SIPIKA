import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react'; // Import 'router'
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons"; // Import faSignOutAlt
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Projector, Wind, MonitorSmartphone, BookOpen, Users, Clock } from 'lucide-react';
import MenuDropdown from '@/Components/MenuDropdown.jsx';
import NotificationPopover from '@/Components/NotificationPopover.jsx'

const getFacilityIcon = (facilityName) => {
    switch (facilityName.toLowerCase()) {
        case 'projector':
            return <Projector className="w-4 h-4" />;
        case 'air conditioner':
            return <Wind className="w-4 h-4" />;
        case 'computer':
            return <MonitorSmartphone className="w-4 h-4" />;
        case 'whiteboard':
            return <BookOpen className="w-4 h-4" />;
        default:
            return null;
    }
};

const ClassroomOverview = ({ auth, classroomsByFloor, currentBookings }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [selectedFloor, setSelectedFloor] = useState(1);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Singapore'
    }));

    // Update time every minute
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

    const floors = Object.keys(classroomsByFloor).sort();

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-lightGradient">
            {/* Header */}
            <header className='w-full bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-6 flex justify-between items-center'>
                <div>
                    <Link href="/">
                        <img src="/images/logo.png" alt="logo-sipika" width={146} />
                    </Link>
                </div>
                <div className='flex items-center gap-6'>
                    <div className='text-white font-sfproreg'>
                        {auth.user.username} ({auth.user.major})
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
                    </button>
                    <FontAwesomeIcon
                        icon={faBell}
                        className="text-white cursor-pointer hover:text-gray-200"
                        onClick={() => setIsNotificationOpen(true)}
                    />
                    <MenuDropdown />
                </div>
            </header>

            <main className="container mx-auto px-4 py-8">
                <Head title="Classroom Overview" />

                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900">Classroom Overview</h1>
                            <p className="text-gray-600 mt-2">Real-time overview of all classrooms and their current status</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Current Time</p>
                            <p className="font-mono text-lg">{currentTime}</p>
                        </div>
                    </div>

                    {/* Floor Selection */}
                    <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
                        {floors.map((floor) => (
                            <button
                                key={floor}
                                onClick={() => setSelectedFloor(parseInt(floor))}
                                className={`px-6 py-3 rounded-lg font-medium transition-colors ${
                                    selectedFloor === parseInt(floor)
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-white text-gray-600 hover:bg-gray-50'
                                } shadow-sm flex-shrink-0`}
                            >
                                Floor {floor}
                            </button>
                        ))}
                    </div>

                    {/* Classrooms Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {classroomsByFloor[selectedFloor]?.map((classroom) => {
                            const currentBooking = currentBookings.find(
                                booking => booking.classroom_id === classroom.id
                            );

                            return (
                                <div
                                    key={classroom.id}
                                    className={`bg-white rounded-xl shadow-md overflow-hidden border-l-4 ${
                                        currentBooking ? 'border-red-500' : 'border-green-500'
                                    }`}
                                >
                                    <div className="p-6">
                                        <div className="flex justify-between items-start mb-4">
                                            <div>
                                                <h3 className="text-xl font-bold text-gray-900">
                                                    {classroom.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Users className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600">
                            Capacity: {classroom.capacity} people
                          </span>
                                                </div>
                                            </div>
                                            <span
                                                className={`px-3 py-1 rounded-full text-sm font-medium ${
                                                    currentBooking
                                                        ? 'bg-red-100 text-red-800'
                                                        : 'bg-green-100 text-green-800'
                                                }`}
                                            >
                        {currentBooking ? 'In Use' : 'Available'}
                      </span>
                                        </div>

                                        {/* Facilities */}
                                        <div className="mb-4">
                                            <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                Facilities
                                            </h4>
                                            <div className="flex flex-wrap gap-2">
                                                {classroom.facilities.map((facility, index) => (
                                                    <span
                                                        key={index}
                                                        className="inline-flex items-center gap-1 px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm"
                                                    >
                            {getFacilityIcon(facility)}
                                                        {facility}
                          </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Current Booking Info */}
                                        {currentBooking && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg">
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Current Booking
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-gray-500" />
                                                        <p className="text-sm text-gray-600">
                                                            {currentBooking.user_name} ({currentBooking.user_major})
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                        <p className="text-sm text-gray-600">
                                                            Until {currentBooking.end_time}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        {!currentBooking && (
                                            <Link
                                                href={`/book-room?roomId=${classroom.id}`}
                                                className="mt-4 block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                Book Now
                                            </Link>
                                        )}
                                    </div>
                                </div>
                            );
                        })}
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

export default ClassroomOverview;
