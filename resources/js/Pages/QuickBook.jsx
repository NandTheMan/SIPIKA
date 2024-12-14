import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import MenuDropdown from '@/Components/MenuDropdown.jsx';
import NotificationPopover from '@/Components/NotificationPopover.jsx';
import { Calendar as CalendarIcon, Clock, Users, ChevronRight, Info, Loader2 } from 'lucide-react'; // Added Loader2 icon
import Calendar from 'react-calendar';
import Datetime from 'react-datetime';
import moment from 'moment';

const QuickBook = ({ auth, userInfo, sksDurations }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [showTimeSelect, setShowTimeSelect] = useState(false);
    const { data, setData, post, processing, errors } = useForm({
        date: moment().format('YYYY-MM-DD'),
        start_time: moment().format('HH:mm'),
        sks_duration: '2',  // Default to 2 SKS
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/quick-book/store', {
            preserveScroll: true,
            onError: (errors) => {
                console.error('Booking error:', errors);
                // Improved error handling (see below)
            }
        });
    };

    const isValidTime = (currentTime) => {
        const selectedDateTime = moment(data.date).set({
            hour: currentTime.hour(),
            minute: currentTime.minute()
        });
        const now = moment();

        // If selected date is today, only allow times after current time
        if (selectedDateTime.isSame(now, 'day')) {
            return currentTime.isAfter(now);
        }

        // For future dates, allow all times between 7 AM and 5 PM
        const hour = currentTime.hour();
        return hour >= 7 && hour < 17;
    };

    return (
        <div className="min-h-screen bg-lightGradient font-inter">
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
                <Head title="Quick Book" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-lg p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick Book</h2>
                        <p className="text-gray-600 mb-8">
                            Automatically find and book a suitable classroom for your class
                        </p>

                        {/* Class Info Card */}
                        <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-8">
                            <div className="flex items-start justify-between">
                                <div className='flex items-start gap-4'>
                                    <Users className="w-6 h-6 text-blue-600 flex-shrink-0" />
                                    <div>
                                        <h3 className="font-semibold text-blue-800 flex items-center gap-2">
                                            Your Class Information
                                        </h3>
                                        <p className="text-blue-700">Class Size: <span className="font-medium">{userInfo.class_size} students</span></p>
                                        <p className="text-blue-700">Major: <span className="font-medium">{userInfo.major}</span></p>
                                        <p className="text-blue-700">Year: <span className="font-medium">{userInfo.year}</span></p>
                                    </div>
                                </div>
                                {userInfo.is_penalized && (
                                    <div className="bg-red-100 text-red-700 px-4 py-2 rounded-lg shadow-md">
                                        <p className="font-semibold">Account Penalized</p>
                                        <p className="text-sm">Some booking restrictions may apply</p>
                                    </div>
                                )}
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-8">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div>
                                    <label className="block text-gray-700 font-medium mb-2">
                                        <CalendarIcon className="w-5 h-5 inline-block mr-2" />
                                        Date
                                    </label>
                                    <div className='border border-gray-300 rounded-lg p-3'>
                                        <Calendar
                                            onChange={(value) => setData('date', moment(value).format('YYYY-MM-DD'))}
                                            value={new Date(data.date)}
                                            minDate={new Date()}
                                            className="w-full calendar-custom"
                                        />
                                    </div>
                                    {errors.date && (
                                        <p className="mt-1 text-sm text-red-600">{errors.date}</p>
                                    )}
                                </div>

                                <div className="space-y-6">
                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">
                                            <Clock className="w-5 h-5 inline-block mr-2" />
                                            Start Time
                                        </label>
                                        <Datetime
                                            value={moment(data.start_time, 'HH:mm')}
                                            onChange={(value) => setData('start_time', moment(value).format('HH:mm'))}
                                            dateFormat={false}
                                            timeFormat="HH:mm"
                                            isValidTime={isValidTime}
                                            className="time-picker-custom"
                                            inputProps={{
                                                className: "w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent",
                                                placeholder: "Select time"
                                            }}
                                        />
                                        {errors.start_time && (
                                            <p className="mt-1 text-sm text-red-600">{errors.start_time}</p>
                                        )}
                                    </div>

                                    <div>
                                        <label className="block text-gray-700 font-medium mb-2">Duration</label>
                                        <select
                                            value={data.sks_duration}
                                            onChange={e => setData('sks_duration', e.target.value)}
                                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        >
                                            {sksDurations.map((sks) => (
                                                <option key={sks.value} value={sks.value}>
                                                    {sks.label}
                                                </option>
                                            ))}
                                        </select>
                                        {errors.sks_duration && (
                                            <p className="mt-1 text-sm text-red-600">{errors.sks_duration}</p>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Validation Error Summary (New) */}
                            {Object.keys(errors).length > 0 && (
                                <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                                    <p className="font-bold text-red-700">Please fix the following error(s):</p>
                                    <ul className="list-disc list-inside text-red-600">
                                        {Object.values(errors).map((error, index) => (
                                            <li key={index}>{error}</li>
                                        ))}
                                    </ul>
                                </div>
                            )}

                            {/* Information Box */}
                            <div className="bg-blue-50 rounded-lg p-6 space-y-4 border border-blue-200">
                                <div className='flex gap-2 items-center'>
                                    <Info className="w-5 h-5 text-blue-500 flex-shrink-0" />
                                    <h4 className="font-semibold text-gray-700">How Quick Book Works:</h4>
                                </div>
                                <ul className="space-y-2 text-gray-600">
                                    <li className="flex items-start gap-2">
                                        <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        We'll automatically find a classroom that fits your class size ({userInfo.class_size} students)
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        Rooms are assigned based on best fit - you'll get the smallest suitable room available
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        You can check in 15 minutes before your booking time
                                    </li>
                                    <li className="flex items-start gap-2">
                                        <ChevronRight className="w-5 h-5 text-blue-500 flex-shrink-0 mt-0.5" />
                                        Late check-in (more than 15 minutes) will result in automatic cancellation
                                    </li>
                                </ul>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-between pt-4">
                                <Link
                                    href="/home"
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2"
                                >
                                    {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                    {processing ? 'Finding Room...' : 'Find & Book Classroom'}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </main>

            <NotificationPopover
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                pinnedClassrooms={[]}
            />

            {/* Custom CSS for react-calendar */}
            <style global jsx>{`
                .calendar-custom .react-calendar__navigation {
                    margin-bottom: 1.5em; /* Increased margin */
                    display: flex;
                    align-items: center; /* Center align navigation elements */
                }
                .calendar-custom .react-calendar__navigation__label {
                    font-size: 1em;
                    font-weight: bold;
                    padding: 0.5em; /* Added padding */
                }
                .calendar-custom .react-calendar__navigation__label__divider {
                    margin: 0 0.5em; /* Added margin for divider */
                }
                .calendar-custom .react-calendar__navigation__arrow {
                    font-size: 1.2em; /* Increased arrow size */
                    font-weight: bold;
                    padding: 0.5em; /* Added padding */
                }
                .calendar-custom .react-calendar__month-view__days__day--weekend {
                    color: #d10000;
                }
                .calendar-custom .react-calendar__tile--now {
                    background: #e6f2ff; /* Light blue background for today */
                }
                .calendar-custom .react-calendar__tile--active {
                    background: #006edc; /* Dark blue background for selected day */
                    color: white;
                }
            `}</style>
        </div>
    );
};

export default QuickBook;
