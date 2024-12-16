import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faTimesCircle, faUser } from "@fortawesome/free-regular-svg-icons"; // faCamera removed from here
import { faSignOutAlt, faArrowLeft, faCheckCircle, faExclamationTriangle, faSpinner, faCamera } from '@fortawesome/free-solid-svg-icons'; // faCamera added here
import MenuDropdown from '@/Components/MenuDropdown.jsx';
import NotificationPopover from '@/Components/NotificationPopover.jsx';

const BookingDetail = ({ booking, auth }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [endPhoto, setEndPhoto] = useState(null);
    const [showEndEarlyForm, setShowEndEarlyForm] = useState(false);
    const [isCancelling, setIsCancelling] = useState(false); // Added state for cancelling

    const { post, processing } = useForm();
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

    const handleEndEarly = (e) => {
        e.preventDefault();

        if (!endPhoto) {
            alert('Please select an image first');
            return;
        }

        const formData = new FormData();
        formData.append('image_end', endPhoto);
        formData.append('_method', 'PUT');

        post(`/my-bookings/${booking.id}/end-early`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (response) => {
                window.location.href = '/my-bookings';
            },
            onError: (errors) => {
                alert(errors.error || 'Failed to end booking. Please try again.');
            },
        });
    };

    const handleCancelBooking = () => {
        setIsCancelling(true); // Set cancelling state to true

        router.post(route('my-bookings.cancel', booking.id), {
            preserveScroll: true,
            onSuccess: () => {
                window.location.href = '/my-bookings';
            },
            onError: (errors) => {
                alert(errors.error || 'Failed to cancel booking. Please try again.');
            },
            onFinish: () => {
                setIsCancelling(false); // Reset cancelling state
            },
        });
    };

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

            <main className="container mx-auto px-4 py-8">
                <Head title="Booking Details" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-lg shadow-xl p-8">
                        <div className="flex justify-between items-center mb-8">
                            <h2 className="text-2xl font-bold text-gray-800">Booking Details</h2>
                            <div className="text-right">
                                <p className="text-sm text-gray-500">Current Time</p>
                                <p className="font-mono text-lg text-gray-700">{currentTime}</p>
                            </div>
                        </div>

                        {/* Status Badge */}
                        <div className={`inline-block px-4 py-2 rounded-full border text-sm font-semibold ${getStatusBadgeClass(booking.status)} mb-6`}>
                            {booking.status === 'pending' && (
                                <>
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="mr-2" />
                                    Pending
                                </>
                            )}
                            {booking.status === 'in_progress' && (
                                <>
                                    <FontAwesomeIcon icon={faSpinner} className="animate-spin mr-2" />
                                    In Progress
                                </>
                            )}
                            {booking.status === 'finished' && (
                                <>
                                    <FontAwesomeIcon icon={faCheckCircle} className="mr-2" />
                                    Finished
                                </>
                            )}
                            {booking.status === 'cancelled' && (
                                <>
                                    <FontAwesomeIcon icon={faTimesCircle} className="mr-2" />
                                    Cancelled
                                </>
                            )}
                        </div>

                        {/* Booking Information */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Classroom Information</h3>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="font-bold text-gray-800">{booking.classroom.name}</p>
                                    <p className="text-gray-600">Floor {booking.classroom.floor}</p>
                                    <p className="text-gray-600">Capacity: {booking.classroom.capacity} people</p>
                                    <div className="mt-2">
                                        <p className="font-medium text-gray-700">Facilities:</p>
                                        <div className="flex flex-wrap gap-2 mt-1">
                                            {booking.classroom.facilities.map((facility, index) => (
                                                <span
                                                    key={index}
                                                    className="bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full font-medium"
                                                >
                                                    {facility}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <h3 className="text-lg font-semibold text-gray-700 mb-2">Booking Time</h3>
                                <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                                    <p className="font-medium text-gray-700">Date:</p>
                                    <p className="text-gray-600">{booking.date}</p> {/* Made date bolder */}
                                    <p className="font-medium text-gray-700 mt-2">Time:</p>
                                    <p className="text-gray-600">{booking.start_time} - {booking.end_time}</p> {/* Made time bolder */}
                                    <p className="font-medium text-gray-700 mt-2">Duration:</p>
                                    <p className="text-gray-600">{booking.duration}</p> {/* Made duration bolder */}
                                    {booking.check_in_window && (
                                        <p className="mt-2 text-gray-600">
                                            <span className="font-medium text-gray-700">Check-in Window:</span><br />
                                            <span className="font-bold">{booking.check_in_window.earliest} - {booking.check_in_window.latest}</span> {/* Made check-in window bolder */}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Photos Section */}
                        <div className="space-y-6">
                            <h3 className="text-lg font-semibold text-gray-700">Room Photos</h3>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {/* Start Photo */}
                                <div>
                                    <p className="font-medium text-gray-700 mb-2">Start Condition:</p>
                                    {booking.start_photo ? (
                                        <img
                                            src={booking.start_photo}
                                            alt="Start condition"
                                            className="w-full rounded-lg shadow-lg border border-gray-200"
                                        />
                                    ) : (
                                        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500 border border-gray-200">
                                            No start photo available
                                        </div>
                                    )}
                                </div>

                                {/* End Photo */}
                                <div>
                                    <p className="font-medium text-gray-700 mb-2">End Condition:</p>
                                    {booking.end_photo ? (
                                        <img
                                            src={booking.end_photo}
                                            alt="End condition"
                                            className="w-full rounded-lg shadow-lg border border-gray-200"
                                        />
                                    ) : (
                                        <div className="bg-gray-100 rounded-lg p-8 text-center text-gray-500 border border-gray-200">
                                            No end photo available
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex flex-wrap justify-end items-center gap-4 mt-8">
                            {booking.can_cancel && (
                                <button
                                    onClick={handleCancelBooking}
                                    disabled={isCancelling}
                                    className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition-colors font-medium flex items-center gap-2 ${
                                        isCancelling ? 'opacity-50 cursor-not-allowed' : ''
                                    }`}
                                >
                                    {isCancelling && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                                    Cancel Booking
                                </button>
                            )}

                            {booking.can_start && (
                                <Link
                                    href={`/book-room/check-in/${booking.id}`} // Changed to the new route for check-in
                                    className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 transition-colors font-medium"
                                >
                                    Start Check-in
                                </Link>
                            )}

                            {booking.can_end_early && (
                                <>
                                    {!showEndEarlyForm ? (
                                        <button
                                            onClick={() => setShowEndEarlyForm(true)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors font-medium"
                                        >
                                            End Early
                                        </button>
                                    ) : (
                                        <form
                                            onSubmit={handleEndEarly}
                                            encType="multipart/form-data"
                                            className="flex gap-2 items-center"
                                        >
                                            <label htmlFor="end-photo-upload" className="cursor-pointer">
                                                <div className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg transition-colors inline-flex items-center gap-2">
                                                    <FontAwesomeIcon icon={faCamera} />
                                                    <span>{endPhoto ? 'Change Photo' : 'Select Photo'}</span>
                                                </div>
                                                <input
                                                    id="end-photo-upload"
                                                    type="file"
                                                    name="image_end"
                                                    onChange={(e) => setEndPhoto(e.target.files[0])}
                                                    accept="image/*"
                                                    required
                                                    className="hidden"
                                                />
                                            </label>
                                            {endPhoto && (
                                                <span className="text-sm text-gray-500">
                                                    {endPhoto.name}
                                                </span>
                                            )}
                                            <button
                                                type="submit"
                                                disabled={!endPhoto || processing}
                                                className={`px-4 py-2 rounded-lg font-medium flex items-center gap-2 ${
                                                    endPhoto
                                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                } ${processing ? 'opacity-50 cursor-not-allowed' : ''}`}
                                            >
                                                {processing && <FontAwesomeIcon icon={faSpinner} className="animate-spin" />}
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowEndEarlyForm(false);
                                                    setEndPhoto(null);
                                                }}
                                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    )}
                                </>
                            )}

                            <Link
                                href="/my-bookings"
                                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600 transition-colors font-medium flex items-center gap-2"
                            >
                                <FontAwesomeIcon icon={faArrowLeft} />
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
