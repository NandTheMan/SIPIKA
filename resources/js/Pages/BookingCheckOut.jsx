import React, { useEffect, useRef, useState } from 'react';
import { Link, useForm, router } from '@inertiajs/react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faSignOutAlt } from "@fortawesome/free-solid-svg-icons";
import { faClock, faImage, faCheckCircle } from "@fortawesome/free-solid-svg-icons";
import MenuDropdown from '@/Components/MenuDropdown';

export default function BookingCheckOut({ booking, auth }) {
    const [isNotificationOpen, setIsNotificationOpen] = useState(false);
    const [preview, setPreview] = useState(null);
    const fileInputRef = useRef(null);
    const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit',
        hour12: false
    }));
    const [lineHeight1, setLineHeight1] = useState(0);
    const [lineHeight2, setLineHeight2] = useState(0);
    const step1Ref = useRef(null);
    const step2Ref = useRef(null);
    const step3Ref = useRef(null);

    const { data, setData, post, processing, errors } = useForm({
        image_end: null,
    });

    useEffect(() => {
        const calculateHeights = () => {
            if (step1Ref.current && step2Ref.current) {
                const step1Bottom = step1Ref.current.getBoundingClientRect().bottom;
                const step2Top = step2Ref.current.getBoundingClientRect().top;
                setLineHeight1(step2Top - step1Bottom);
            }

            if (step2Ref.current && step3Ref.current) {
                const step2Bottom = step2Ref.current.getBoundingClientRect().bottom;
                const step3Top = step3Ref.current.getBoundingClientRect().top;
                setLineHeight2(step3Top - step2Bottom);
            }
        };

        calculateHeights();
        window.addEventListener('resize', calculateHeights);

        // Update current time every minute
        const timer = setInterval(() => {
            setCurrentTime(new Date().toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                hour12: false
            }));
        }, 60000);

        return () => {
            window.removeEventListener('resize', calculateHeights);
            clearInterval(timer);
        };
    }, []);

    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setData('image_end', file);
            const reader = new FileReader();
            reader.onloadend = () => setPreview(reader.result);
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        post(`/book-room/check-out/${booking.id}`);
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

            <div className="flex bg-lightGradient">
                {/* Progress Steps */}
                <div className="w-1/16 min-w-[80px] h-[52rem] place-self-center items-center justify-center border-1.5 border-white/60 bg-lightGradient shadow-xl rounded-lg p-4 my-12 ml-6 relative">
                    <div className="relative flex flex-col items-center h-full">
                        <div ref={step1Ref} className="relative z-10 mt-2">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>

                        <div style={{height: `${lineHeight1}px`}} className="absolute top-16 w-1 bg-buttonBlue left-1/2 -translate-x-1/2"/>

                        <div ref={step2Ref} className="relative z-10 mt-auto">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>

                        <div style={{height: `${lineHeight2}px`}} className="absolute top-32 w-1 bg-buttonBlue left-1/2 -translate-x-1/2"/>

                        <div ref={step3Ref} className="relative z-10 mt-auto mb-2">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="container mx-auto px-4 py-8 flex flex-col items-center">
                    <div className="w-full max-w-4xl bg-white rounded-lg shadow-xl p-8">
                        <div className="text-center mb-8">
                            <h2 className="text-3xl font-bold text-gray-800">Class Check-out</h2>
                            <p className="text-gray-600 mt-2">Upload a photo of the classroom's final condition</p>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
                            {/* Booking Details */}
                            <div className="space-y-6">
                                <div className="border-t border-b py-4">
                                    <h3 className="text-lg font-semibold mb-4">Booking Details</h3>
                                    <div className="space-y-2">
                                        <div>
                                            <p className="text-gray-600">Classroom</p>
                                            <p className="font-semibold">{booking.classroom}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Date</p>
                                            <p className="font-semibold">{booking.date}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Class Time</p>
                                            <p className="font-semibold">{booking.startTime} - {booking.endTime}</p>
                                        </div>
                                        <div>
                                            <p className="text-gray-600">Current Time</p>
                                            <p className="font-semibold">{currentTime}</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Initial Condition */}
                                <div>
                                    <h3 className="text-lg font-semibold mb-4">Initial Condition</h3>
                                    {booking.startPhoto ? (
                                        <img
                                            src={booking.startPhoto}
                                            alt="Initial classroom condition"
                                            className="w-full rounded-lg shadow"
                                        />
                                    ) : (
                                        <div className="bg-gray-100 rounded-lg p-4 text-center text-gray-500">
                                            No start photo available
                                        </div>
                                    )}
                                </div>
                            </div>

                            {/* Check-out Form */}
                            <div className="space-y-6">
                                <form onSubmit={handleSubmit} className="space-y-6">
                                    <div>
                                        <h3 className="text-lg font-semibold mb-4">Final Condition</h3>
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
                                                    <FontAwesomeIcon icon={faImage} className="text-4xl text-gray-400"/>
                                                    <p className="text-gray-600">Click to upload final condition photo</p>
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
                                        {errors.image_end && (
                                            <p className="mt-2 text-sm text-red-600">
                                                {errors.image_end}
                                            </p>
                                        )}
                                    </div>

                                    {!booking.isEndTimeReached && (
                                        <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 rounded">
                                            <div className="flex">
                                                <div className="flex-shrink-0">
                                                    <FontAwesomeIcon icon={faClock} className="text-yellow-400"/>
                                                </div>
                                                <div className="ml-3">
                                                    <p className="text-yellow-700">
                                                        You are ending this booking early. Make sure the classroom is in proper condition.
                                                    </p>
                                                </div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded">
                                        <div className="flex">
                                            <div className="flex-shrink-0">
                                                <FontAwesomeIcon icon={faCheckCircle} className="text-blue-500"/>
                                            </div>
                                            <div className="ml-3">
                                                <p className="text-blue-700">
                                                    Before checking out, ensure:
                                                </p>
                                                <ul className="list-disc list-inside mt-2 text-blue-600 text-sm space-y-1">
                                                    <li>All equipment is turned off</li>
                                                    <li>The room is clean and tidy</li>
                                                    <li>All personal belongings are removed</li>
                                                    <li>Windows and doors are properly closed</li>
                                                </ul>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="flex justify-center space-x-4 mt-8">
                                        <button
                                            type="submit"
                                            disabled={!data.image_end || processing}
                                            className={`px-8 py-4 rounded-lg text-white font-medium text-lg transition-colors
                                                ${data.image_end && !processing
                                                ? 'bg-buttonBlue hover:bg-blue-700'
                                                : 'bg-gray-400 cursor-not-allowed'}`}
                                        >
                                            {processing ? 'Processing...' : 'End Class'}
                                        </button>
                                        <Link
                                            href="/"
                                            className="bg-gray-500 text-white px-6 py-4 rounded-lg hover:bg-gray-600 transition-colors"
                                        >
                                            Cancel
                                        </Link>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
