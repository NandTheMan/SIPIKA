import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { Projector, Wind, MonitorSmartphone, BookOpen, Users, Clock } from 'lucide-react';
import MenuDropdown from '@/Components/MenuDropdown.jsx';
import NotificationPopover from '@/Components/NotificationPopover.jsx'

const getFacilityIcon = (facilityName) => {
    switch (facilityName.toLowerCase()) {
        case 'projector':
            return <Projector className="w-4 h-4 text-gray-600" />; // Added color to icons
        case 'air conditioner':
            return <Wind className="w-4 h-4 text-gray-600" />; // Added color to icons
        case 'computer':
            return <MonitorSmartphone className="w-4 h-4 text-gray-600" />; // Added color to icons
        case 'whiteboard':
            return <BookOpen className="w-4 h-4 text-gray-600" />; // Added color to icons
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
                        {/* Added user icon */}
                        <FontAwesomeIcon icon={faUser} className="mr-2" />
                        {auth.user.username} ({auth.user.major})
                    </div>
                    <button
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

            <main className="container mx-auto px-4 py-8">
                <Head title="Classroom Overview" />

                <div className="max-w-7xl mx-auto">
                    <div className="flex justify-between items-center mb-8">
                        <div>
                            <h1 className="text-3xl font-bold text-gray-900 leading-tight">Classroom Overview</h1>
                            <p className="text-gray-600 mt-2">Real-time overview of all classrooms and their current status</p>
                        </div>
                        <div className="text-right">
                            <p className="text-sm text-gray-500">Current Time</p>
                            <p className="font-mono text-lg text-gray-700">{currentTime}</p> {/* Added color for better visibility */}
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
                                } shadow-sm flex-shrink-0 font-semibold`} // Added font-semibold for better readability
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
                                                <h3 className="text-xl font-bold text-gray-900 leading-tight">
                                                    {classroom.name}
                                                </h3>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <Users className="w-4 h-4 text-gray-500" />
                                                    <span className="text-gray-600 text-sm"> {/* Added text-sm for capacity */}
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
                                                        <span className="font-medium">{facility}</span> {/* Added font-medium for facility name */}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Current Booking Info */}
                                        {currentBooking && (
                                            <div className="mt-4 p-4 bg-gray-50 rounded-lg border border-gray-200"> {/* Added border */}
                                                <h4 className="text-sm font-medium text-gray-700 mb-2">
                                                    Current Booking
                                                </h4>
                                                <div className="space-y-2">
                                                    <div className="flex items-center gap-2">
                                                        <Users className="w-4 h-4 text-gray-500" />
                                                        <p className="text-sm text-gray-600">
                                                            <span className="font-medium">{currentBooking.user_name}</span> ({currentBooking.user_major}) {/* Added font-medium for user name */}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Clock className="w-4 h-4 text-gray-500" />
                                                        <p className="text-sm text-gray-600">
                                                            Until <span className="font-medium">{currentBooking.end_time}</span> {/* Added font-medium for end time */}
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        )}

                                        {/* Action Button */}
                                        {!currentBooking && (
                                            <Link
                                                href={`/book-room?roomId=${classroom.id}`}
                                                className="mt-4 block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors font-medium" // Added font-medium
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
