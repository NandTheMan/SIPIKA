import React, { useState, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell } from "@fortawesome/free-regular-svg-icons";
import { faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import MenuDropdown from '@/Components/MenuDropdown.jsx';
import NotificationPopover from '@/Components/NotificationPopover.jsx';

const BookingDetail = ({ booking, auth }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [endPhoto, setEndPhoto] = useState(null);
    const [showEndEarlyForm, setShowEndEarlyForm] = useState(false);

    // Add useForm hook
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

        // Create FormData
        const formData = new FormData();
        formData.append('image_end', endPhoto);
        formData.append('_method', 'PUT');

        console.log('Submitting end-early request:', {
            bookingId: booking.id,
            fileSize: endPhoto.size,
            fileName: endPhoto.name
        });

        // Change how we send the request
        post(`/my-bookings/${booking.id}/end-early`, formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
            forceFormData: true,
            preserveScroll: true,
            onSuccess: (response) => {
                console.log('Success response:', response);
                window.location.href = '/my-bookings';
            },
            onError: (errors) => {
                console.error('Submission error:', errors);
                alert(errors.error || 'Failed to end booking. Please try again.');
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
                        {auth.user.username} ({auth.user.major})
                    </div>
                    <button
                        type="button"
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
                                <>
                                    {!showEndEarlyForm ? (
                                        <button
                                            onClick={() => setShowEndEarlyForm(true)}
                                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                                        >
                                            End Early
                                        </button>
                                    ) : (
                                        <form
                                            onSubmit={handleEndEarly}
                                            encType="multipart/form-data"
                                            className="flex gap-2"
                                        >
                                            <input
                                                type="file"
                                                name="image_end"
                                                onChange={(e) => setEndPhoto(e.target.files[0])}
                                                accept="image/*"
                                                required
                                                className="block w-full text-sm text-gray-500
                        file:mr-4 file:py-2 file:px-4
                        file:rounded-full file:border-0
                        file:text-sm file:font-semibold
                        file:bg-blue-50 file:text-blue-700
                        hover:file:bg-blue-100"
                                            />
                                            <button
                                                type="submit"
                                                disabled={!endPhoto}
                                                className={`px-4 py-2 rounded ${
                                                    endPhoto
                                                        ? 'bg-blue-500 text-white hover:bg-blue-600'
                                                        : 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                                }`}
                                            >
                                                Submit
                                            </button>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    setShowEndEarlyForm(false);
                                                    setEndPhoto(null);
                                                }}
                                                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                                            >
                                                Cancel
                                            </button>
                                        </form>
                                    )}
                                </>
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
