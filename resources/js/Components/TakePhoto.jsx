import React, { useState, useRef, useEffect } from 'react';
import { Head, Link, useForm } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser } from "@fortawesome/free-regular-svg-icons";
import { Camera, Clock, Users, AlertTriangle, X } from 'lucide-react';
import MenuDropdown from '@/Components/MenuDropdown';
import NotificationPopover from '@/Components/NotificationPopover';

const TakePhoto = ({ auth, booking, checkInWindow }) => {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
        timeZone: 'Asia/Singapore'
    }));

    const { data, setData, post, processing, errors } = useForm({
        image: null,
    });

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

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/book-room/check-in/${booking.id}`, {
            onSuccess: () => {
                window.location.href = `/book-room/check-out/${booking.id}`;
            },
        });
    };

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
                <Head title="Start Check-in" />

                <div className="max-w-4xl mx-auto">
                    <div className="bg-white rounded-xl shadow-xl p-8">
                        <h2 className="text-3xl font-bold text-gray-900 mb-2">Start Check-in</h2>
                        <p className="text-gray-600 mb-8">Take a photo of the classroom's current condition</p>

                        {/* Booking Details */}
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-4">Booking Details</h3>
                                <div className="space-y-3">
                                    <div className="flex items-center gap-2">
                                        <Users className="w-5 h-5 text-gray-500" />
                                        <p>Room: {booking.classroom_name}</p>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Clock className="w-5 h-5 text-gray-500" />
                                        <p>Time: {booking.start_time} - {booking.end_time}</p>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-gray-50 p-6 rounded-lg">
                                <h3 className="font-semibold text-gray-800 mb-4">Check-in Window</h3>
                                <div className="space-y-3">
                                    <p>Current Time: {currentTime}</p>
                                    <p>Check-in Period: {checkInWindow.earliest} - {checkInWindow.latest}</p>
                                </div>
                            </div>
                        </div>

                        {/* Photo Upload Section */}
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer
                  ${preview ? 'border-green-400 bg-green-50' : 'border-gray-300 hover:border-blue-400 hover:bg-blue-50'}`}
                            >
                                {preview ? (
                                    <div className="space-y-4">
                                        <img
                                            src={preview}
                                            alt="Preview"
                                            className="mx-auto max-h-64 rounded-lg"
                                        />
                                        <p className="text-sm text-gray-600">Click to change image</p>
                                    </div>
                                ) : (
                                    <div className="space-y-2">
                                        <Camera className="w-12 h-12 text-gray-400 mx-auto" />
                                        <p className="text-gray-600">Click to take or upload classroom photo</p>
                                        <p className="text-sm text-gray-500">
                                            (JPG, PNG, or GIF up to 5MB)
                                        </p>
                                    </div>
                                )}
                                <input
                                    type="file"
                                    ref={fileInputRef}
                                    className="hidden"
                                    onChange={handleImageChange}
                                    accept="image/*"
                                />
                            </div>
                            {errors.image && (
                                <p className="text-sm text-red-600">{errors.image}</p>
                            )}

                            {/* Guidelines */}
                            <div className="bg-blue-50 border-l-4 border-blue-400 p-4 rounded">
                                <div className="flex items-start">
                                    <AlertTriangle className="w-5 h-5 text-blue-500 mt-0.5 mr-3" />
                                    <div>
                                        <p className="text-blue-700 font-medium">Important:</p>
                                        <ul className="mt-2 space-y-1 text-blue-600 text-sm">
                                            <li>• Take a clear photo of the entire classroom</li>
                                            <li>• Ensure all facilities are visible</li>
                                            <li>• Document any existing damage or issues</li>
                                            <li>• Check the cleanliness of the room</li>
                                        </ul>
                                    </div>
                                </div>
                            </div>

                            {/* Action Buttons */}
                            <div className="flex justify-end gap-4">
                                <Link
                                    href="/my-bookings"
                                    className="px-6 py-3 bg-gray-500 text-white rounded-lg hover:bg-gray-600 transition-colors"
                                >
                                    Cancel
                                </Link>
                                <button
                                    type="submit"
                                    disabled={!data.image || processing}
                                    className="px-8 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-blue-300"
                                >
                                    {processing ? 'Processing...' : 'Start Class'}
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
        </div>
    );
};

export default TakePhoto;
