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
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();

        if (!agreedToTerms) {
            alert('Mohon setujui syarat dan ketentuan peminjaman');
            return;
        }

        router.post('/booking/create', {
            roomId: bookingData.roomId,
            date: bookingData.date,
            startTime: bookingData.startTime,
            duration: parseInt(duration),
            description: description,
        });
    };

    const handleCancel = () => {
        router.get('/book-room');
    };

    return (
        <div className="min-h-screen bg-lightGradient flex flex-col">
            {/* Header */}
            <header className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-[51px] flex justify-between relative'>
                <div className="absolute top-4 left-4 sm:top-6 sm:left-8">
                    <Link href="/" className="text-4xl sm:text-6xl font-philosopher text-white hover:opacity-80">
                        SIPIKA
                    </Link>
                </div>
                <div className='absolute top-12 right-6 flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUser} style={{color: "#F1F1F1"}}/>
                        <p className='text-white font-sfproreg text-[#F1F1F1]'>
                            {auth.user.username} ({auth.user.major})
                        </p>
                    </div>
                    <FontAwesomeIcon icon={faBell} style={{color: "#F1F1F1"}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#F1F1F1"}}/>
                </div>
            </header>

            {/* Main Content */}
            <div className="flex bg-lightGradient flex-grow">
                {/* Stepper Section */}
                <div className="w-1/16 h-[52rem] place-self-center items-center justify-center border-1.5 border-white/60 bg-lightGradient shadow-md rounded-lg p-4 my-12 ml-6 relative">
                    <div className="relative flex flex-col items-center h-full">
                        {/* Step indicators */}
                        <div ref={step1Ref} className="relative z-10 mt-2">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white">
                                <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                </svg>
                            </div>
                        </div>

                        {/* Lines */}
                        <div style={{height: `${lineHeight1}px`}} className="absolute top-12 w-1 bg-buttonBlue left-1/2 -translate-x-1/2"></div>
                        <div ref={step2Ref} className="relative z-10 mt-auto">
                            <div className="w-12 h-12 rounded-full bg-buttonBlue flex items-center justify-center shadow-lg border-4 border-white">
                                <span className="text-white font-bold">2</span>
                            </div>
                        </div>
                        <div style={{height: `${lineHeight2}px`}} className="absolute top-24 w-1 bg-gray-200 left-1/2 -translate-x-1/2"></div>
                        <div ref={step3Ref} className="relative z-10 mt-auto mb-2">
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center shadow-lg border-4 border-white">
                                <span className="text-gray-500 font-bold">3</span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Form Section */}
                <div className="border border-white/40 bg-glassGradient backdrop-blur-xl shadow-md rounded-3xl p-8 w-full max-w-md h-[52rem] my-auto mx-auto">
                    <form onSubmit={handleSubmit} className="space-y-6 text-center">
                        <div>
                            <h2 className="text-3xl font-bold mb-6 text-gray-900">
                                Peminjaman {bookingData.roomName}
                            </h2>
                        </div>

                        <div className="space-y-4">
                            <div>
                                <label htmlFor="tanggal" className="block text-md font-semibold mb-2 text-left">
                                    Hari dan Tanggal Peminjaman
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="tanggal"
                                        value={bookingData.formattedDate}
                                        readOnly
                                        className="w-full bg-blue-800/80 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="absolute top-1/2 transform -translate-y-1/2 right-4 text-white">📅</span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="jam" className="block text-md font-semibold mb-2 text-left">
                                    Jam Mulai Peminjaman
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        id="jam"
                                        value={bookingData.startTime}
                                        readOnly
                                        className="w-full bg-blue-800/80 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    />
                                    <span className="absolute top-1/2 transform -translate-y-1/2 right-4 text-white">⏰</span>
                                </div>
                            </div>

                            <div>
                                <label htmlFor="duration" className="block text-md font-semibold mb-2 text-left">
                                    Durasi Peminjaman
                                </label>
                                <select
                                    id="duration"
                                    value={duration}
                                    onChange={(e) => setDuration(e.target.value)}
                                    className="w-full bg-blue-800/80 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                >
                                    <option value="1">1 SKS (40 menit)</option>
                                    <option value="2">2 SKS (80 menit)</option>
                                    <option value="3">3 SKS (120 menit)</option>
                                    <option value="4">4 SKS (160 menit)</option>
                                </select>
                            </div>

                            <div>
                                <label htmlFor="purpose" className="block text-md font-semibold mb-2 text-left">
                                    Keperluan Peminjaman
                                </label>
                                <input
                                    type="text"
                                    id="purpose"
                                    placeholder="Masukkan keperluan Anda"
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="w-full bg-blue-800/80 text-white px-4 py-3 rounded-lg focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            <div className="text-left">
                                <label className="flex items-center">
                                    <input
                                        type="checkbox"
                                        checked={agreedToTerms}
                                        onChange={(e) => setAgreedToTerms(e.target.checked)}
                                        className="form-checkbox bg-blue-600 text-white border-blue-800 rounded focus:ring-blue-500 mr-2"
                                    />
                                    <span className="text-sm">
                                        Saya setuju untuk bertanggung jawab menjaga infrastruktur dan kebersihan ruangan selama peminjaman
                                    </span>
                                </label>
                            </div>
                        </div>

                        <div className="flex space-x-4 mt-6">
                            <button
                                type="submit"
                                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-3 rounded-lg transition-colors"
                            >
                                Pinjam
                            </button>
                            <button
                                type="button"
                                onClick={handleCancel}
                                className="flex-1 bg-gray-600 hover:bg-gray-700 text-white px-4 py-3 rounded-lg transition-colors"
                            >
                                Batal
                            </button>
                        </div>

                        <div className="text-sm text-center mt-6">
                            Ingin melaporkan peminjam sebelumnya?{" "}
                            <Link href="/reports/create" className="text-blue-400 hover:font-bold">
                                Laporkan Sekarang
                            </Link>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
