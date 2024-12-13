import React, { useState, useRef, useEffect } from 'react';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBell, faUser, faBars } from "@fortawesome/free-solid-svg-icons";
import { Link, router } from '@inertiajs/react';

export default function BookingDetailsPage({ auth, bookingData }) {
    const [currentStep, setCurrentStep] = useState(2);
    const [lineHeight1, setLineHeight1] = useState(0);
    const [lineHeight2, setLineHeight2] = useState(0);
    const [duration, setDuration] = useState("1 SKS (40 menit)");
    const [description, setDescription] = useState("");
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    const step1Ref = useRef(null);
    const step2Ref = useRef(null);
    const step3Ref = useRef(null);

    useEffect(() => {
        const calculateLineHeights = () => {
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

        calculateLineHeights();
        window.addEventListener('resize', calculateLineHeights);

        return () => window.removeEventListener('resize', calculateLineHeights);
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!agreedToTerms) {
            alert('Mohon setujui syarat dan ketentuan peminjaman');
            return;
        }

        router.post('/book-room/create', {
            roomId: bookingData.roomId,
            date: bookingData.date,
            startTime: bookingData.startTime,
            duration: parseInt(duration),
            description: description,
        }, {
            preserveScroll: true,
            onSuccess: () => {
                // Handle success - router will automatically redirect on successful response
            },
            onError: (errors) => {
                // Handle validation errors
                if (errors.error) {
                    alert(errors.error);
                }
            }
        });
    };

    const handleCancel = () => {
        router.get('/book-room');
    };

    return (
        <div className="min-h-screen bg-lightGradient flex flex-col font-sfproreg">
            {/* Header */}
            <header className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] px-6 py-10 sm:px-8 sm:py-12 flex justify-between items-center relative'>
                <div className="absolute top-8 left-4 sm:top-8 sm:left-8">
                    <Link href="/" className="text-4xl sm:text-5xl font-philosopher text-white hover:opacity-80">
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
                    <FontAwesomeIcon icon={faBell} className="text-white text-lg sm:text-xl cursor-pointer hover:text-gray-300" />
                    <FontAwesomeIcon icon={faBars} className="text-white text-lg sm:text-xl cursor-pointer hover:text-gray-300" />
                </div>
            </header>

            {/* Main Content */}
            <div className="flex bg-lightGradient flex-grow">
                {/* Stepper Section */}
                <div className="w-1/16 min-w-[80px] h-[52rem] place-self-center items-center justify-center border-1.5 border-white/60 bg-lightGradient shadow-xl rounded-lg p-4 my-12 ml-6 relative">
                    <div className="relative flex flex-col items-center h-full">
                        {/* Step indicators */}
                        <div ref={step1Ref} className="relative z-10 mt-2">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white hover:bg-blue-700 transition-colors duration-300">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        </div>

                        {/* Lines */}
                        <div style={{ height: `${lineHeight1}px` }} className="absolute top-16 w-1 bg-buttonBlue left-1/2 -translate-x-1/2 transition-all duration-500"></div>
                        <div ref={step2Ref} className="relative z-10 mt-auto">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white hover:bg-blue-700 transition-colors duration-300">
                                <span className="text-white font-bold">2</span>
                            </div>
                        </div>
                        <div style={{ height: `${lineHeight2}px` }} className="absolute top-32 w-1 bg-gray-200 left-1/2 -translate-x-1/2 transition-all duration-500"></div>
                        <div ref={step3Ref} className="relative z-10 mt-auto mb-2">
                            <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center shadow-lg border-4 border-white hover:bg-gray-400 transition-colors duration-300">
                                <span className="text-gray-600 font-bold">3</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="border border-white/40 bg-glassGradient backdrop-blur-xl shadow-2xl rounded-3xl p-8 w-full max-w-md h-[52rem] my-auto mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className='text-center'>
                            <h2 className="text-3xl font-bold text-gray-900">
                                Peminjaman {bookingData.roomName}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="tanggal" className="block text-lg font-medium mb-2 text-gray-700">
                                    Hari dan Tanggal Peminjaman
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="tanggal"
                                        value={bookingData.formattedDate}
                                        readOnly
                                        className="w-full bg-blue-800/80 text-white placeholder-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <span className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="jam" className="block text-lg font-medium mb-2 text-gray-700">
                                    Jam Mulai Peminjaman
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="jam"
                                        value={bookingData.startTime}
                                        readOnly
                                        className="w-full bg-blue-800/80 text-white placeholder-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                    />
                                    <span className="absolute top-1/2 transform -translate-y-1/2 right-4 text-gray-300">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                        </svg>
                                    </span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-lg font-medium mb-2 text-gray-700">
                                    Durasi Peminjaman
                                </label>
                                <select
                                    id="duration"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full bg-blue-800/80 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                                >
                                    <option value="1">1 SKS (40 menit)</option>
                                    <option value="2">2 SKS (80 menit)</option>
                                    <option value="3">3 SKS (120 menit)</option>
                                    <option value="4">4 SKS (160 menit)</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="purpose" className="block text-lg font-medium mb-2 text-gray-700">
                                    Keperluan Peminjaman
                                </label>
                                <textarea
                                    id="purpose"
                                    placeholder="Masukkan keperluan Anda"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-blue-800/80 text-white placeholder-gray-300 px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none resize-none"
                                    rows="3"
                                    required
                                />
                            </div>

                            <div className="text-left">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="form-checkbox h-5 w-5 text-buttonBlue bg-white border-gray-300 rounded focus:ring-buttonBlue"
                                    />
                                    <span className="ml-2 text-gray-700">
                                        Saya setuju untuk bertanggung jawab menjaga infrastruktur dan kebersihan ruangan selama peminjaman
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-6">
                            <button
                                type="submit"
                                className="flex-1 bg-buttonBlue hover:bg-blue-700 text-white font-bold px-4 py-3 rounded-lg transition-colors duration-300"
                            >
                                Pinjam
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-bold px-4 py-3 rounded-lg transition-colors duration-300"
                            >
                                Batal
                            </button>
                        </div>

                        <div className="text-sm text-center mt-6">
                            Ingin melaporkan peminjam sebelumnya?{" "}
                            <Link href="/reports/create" className="text-blue-500 hover:underline">
                                Laporkan Sekarang
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
