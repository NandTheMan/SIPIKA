import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons"; // Added faUser
import { faSignOutAlt, faBan } from "@fortawesome/free-solid-svg-icons"; // Added faBan for penalized status
import { Calendar as CalendarIcon, Clock, Users, ChevronRight, Info, Loader2 } from 'lucide-react';
import Calendar from 'react-calendar';
import Datetime from 'react-datetime';
import moment from 'moment';
import MenuDropdown from '@/Components/MenuDropdown';
import NotificationPopover from '@/Components/NotificationPopover';

const QuickBook = ({ auth, userInfo, sksDurations }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        date: moment().format('YYYY-MM-DD'),
        start_time: moment().format('HH:mm'),
        sks_duration: '2',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/quick-book/store', {
            preserveScroll: true,
            onError: (errors) => {
                console.error('Booking error:', errors);
            },
            onSuccess: () => {
                // Reset the form after successful submission
                reset();
            },
        });
    };

    const isValidTime = (currentTime) => {
        const selectedDateTime = moment(data.date).set({
            hour: currentTime.hour(),
            minute: currentTime.minute()
        });
        const now = moment();

        if (selectedDateTime.isSame(now, 'day')) {
            return currentTime.isAfter(now);
        }

        const hour = currentTime.hour();
        return hour >= 7 && hour < 17;
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen bg-lightGradient font-inter">
            <Head title="Quick Book" />

            {/* Header */}
            <header className='w-full bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-6 flex justify-between items-center'>
                <div>
                    <Link href="/">
                        <img src="/images/logo.png" alt="logo-sipika" width={146} />
                    </Link>
                </div>
                <div className='flex items-center gap-6'>
                    <div className='text-white font-sfproreg'>
                        <FontAwesomeIcon icon={faUser} className="mr-2" /> {/* Added user icon */}
                        {auth.user.username} ({auth.user.major})
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl" />
                    </button>
                    <div className="relative">
                        <FontAwesomeIcon
                            icon={faBell}
                            className="text-white cursor-pointer hover:text-gray-200"
                            onClick={() => setIsNotificationOpen(true)}
                        />
                        {/* Notification Badge - Uncomment and adjust as needed
                        <span className="absolute top-0 right-0 -mt-1 -mr-1 px-1.5 py-0.5 bg-red-500 text-white rounded-full text-xs">
                            3
                        </span>
                        */}
                    </div>
                    <MenuDropdown />
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="bg-white rounded-xl shadow-lg p-8 md:p-12">
                    <h2 className="text-3xl font-bold text-gray-900 mb-2">Quick Book</h2>
                    <p className="text-gray-600 mb-8">
                        Automatically find and book a suitable classroom for your class
                    </p>

                    {/* Class Info Card */}
                    <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded-lg mb-8 flex items-center justify-between">
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
                            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-2 rounded-lg shadow-sm flex items-center gap-2">
                                <FontAwesomeIcon icon={faBan} className="h-5 w-5 text-red-400" />
                                <div>
                                    <p className="font-semibold text-red-800">Account Penalized</p>
                                    <p className="text-sm text-red-600">Some booking restrictions may apply</p>
                                </div>
                            </div>
                        )}
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-8">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                            <div>
                                <label className="block text-gray-700 font-medium mb-2">
                                    <CalendarIcon className="w-5 h-5 inline-block mr-2 text-gray-600" /> {/* Added color to icon */}
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
                                        <Clock className="w-5 h-5 inline-block mr-2 text-gray-600" /> {/* Added color to icon */}
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

                        {/* Validation Error Summary */}
                        {Object.keys(errors).length > 0 && (
                            <div className="bg-red-50 border-l-4 border-red-400 p-4 rounded-lg">
                                <p className="font-semibold text-red-700">Please fix the following error(s):</p>
                                <ul className="list-disc list-inside text-red-600 mt-1">
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
                                <h4 className="font-medium text-gray-700">How Quick Book Works:</h4>
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
                                className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors font-medium"
                            >
                                Cancel
                            </Link>
                            <button
                                type="submit"
                                disabled={processing}
                                className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center gap-2 font-medium"
                            >
                                {processing && <Loader2 className="h-4 w-4 animate-spin" />}
                                {processing ? 'Finding Room...' : 'Find & Book Classroom'}
                            </button>
                        </div>
                    </form>
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
                    display: flex;
                    align-items: center; /* Center align navigation elements */
                    margin-bottom: 1.5em;
                }

                /* Add margin above the navigation (month/year) */
                .calendar-custom .react-calendar__navigation {
                    margin-top: 1.5em; /* Adjust this value as needed */
                    margin-bottom: 1.5em; /* Increased margin */
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
