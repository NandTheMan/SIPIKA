import React, { useEffect, useRef, useState } from 'react';
import { Link } from '@inertiajs/react';
import './BookingPage.css';
import Calendar from 'react-calendar';
import axios from 'axios';
import Datetime from 'react-datetime';
import moment from 'moment';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faUser } from '@fortawesome/free-regular-svg-icons';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { router } from '@inertiajs/core';

export default function BookingPage({ userName, userMajor, classroomsByFloor }) {
    // State Management
    const [currentFloor, setCurrentFloor] = useState(1);
    const [selectedDate, setSelectedDate] = useState(new Date());
    const [selectedTime, setSelectedTime] = useState(null);
    const [selectedRoom, setSelectedRoom] = useState(null);
    const [roomData, setRoomData] = useState(null);
    const [isAvailable, setIsAvailable] = useState(null);
    const [viewAll, setViewAll] = useState(false);
    const [currentStep, setCurrentStep] = useState(1);
    const [floors, setFloors] = useState(Object.keys(classroomsByFloor || {}).sort());
    const [timeError, setTimeError] = useState('');

    // Refs for step visualization
    const step1Ref = useRef(null);
    const step2Ref = useRef(null);
    const step3Ref = useRef(null);
    const [lineHeight1, setLineHeight1] = useState(0);
    const [lineHeight2, setLineHeight2] = useState(0);

    // Calculate step lines on mount and window resize
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
        return () => window.removeEventListener('resize', calculateHeights);
    }, []);

    // Fetch room details when a room is selected
    useEffect(() => {
        if (selectedRoom) {
            axios.get(`/booking/rooms/${selectedRoom}`).then(response => {
                setRoomData(response.data);
            }).catch(error => console.error('Error fetching room details:', error));
        }
    }, [selectedRoom]);

    // Check availability when room, date, or time changes
    useEffect(() => {
        const checkAvailability = async () => {
            if (selectedRoom && selectedDate && selectedTime) {
                const dateString = moment(selectedDate).format('YYYY-MM-DD');
                const timeString = moment(selectedTime).format('HH:mm');
                const selectedDateTime = moment(`${dateString} ${timeString}`);
                const now = moment();

                // Reset availability status first
                setIsAvailable(null);

                // Only check availability if selected time is after current time
                if (selectedDateTime.isAfter(now)) {
                    try {
                        const response = await axios.post('/book-room/api/check-availability', {
                            roomId: selectedRoom,
                            date: dateString,
                            time: timeString,
                        });
                        console.log('Availability response:', response.data); // Debug log
                        setIsAvailable(response.data.isAvailable);
                    } catch (error) {
                        console.error('Error checking availability:', error);
                        setIsAvailable(false);
                    }
                } else {
                    setIsAvailable(false);
                }
            } else {
                // Reset availability if any required field is missing
                setIsAvailable(null);
            }
        };

        checkAvailability();
    }, [selectedRoom, selectedDate, selectedTime]);

    const checkAvailability = () => {
        if (!selectedTime) return;

        const timeString = moment(selectedTime).format('HH:mm');
        const dateString = moment(selectedDate).format('YYYY-MM-DD');

        axios.post('/book-room/api/check-availability', {
            roomId: selectedRoom,
            date: dateString,
            time: timeString,
        }).then(response => {
            setIsAvailable(response.data.isAvailable);
        }).catch(error => {
            console.error('Error checking availability:', error);
            setIsAvailable(false);
        });
    };

    const handleFloorChange = (floor) => {
        setCurrentFloor(floor);
        setCurrentStep(1);
    };

    const handleDateChange = (date) => {
        setSelectedDate(date);
    };

    const handleTimeChange = (time) => {
        const selectedDateTime = moment(selectedDate).set({
            hour: time.hour(),
            minute: time.minute()
        });
        const now = moment();

        if (selectedDateTime.isSameOrBefore(now)) {
            setTimeError('Mohon pilih waktu setelah waktu saat ini');
            setSelectedTime(null);
            return;
        }

        setTimeError('');
        setSelectedTime(moment(time));

        // Reset availability check when time changes
        setIsAvailable(null);
    };

    const handleRoomSelect = (roomId) => {
        setSelectedRoom(roomId);
    };

    const handleNextClick = () => {
        const selectedDateTime = moment(selectedDate).set({
            hour: moment(selectedTime).hour(),
            minute: moment(selectedTime).minute()
        });

        if (selectedDateTime.isSameOrBefore(moment())) {
            setTimeError('Please select a time after the current time');
            return;
        }

        if (!isAvailable || !selectedRoom || !selectedTime) {
            alert('Please select a valid room and time first');
            return;
        }

        router.visit('/book-room/details', {
            method: 'get',
            data: {
                roomId: selectedRoom,
                date: moment(selectedDate).format('YYYY-MM-DD'),
                startTime: moment(selectedTime).format('HH:mm'),
            },
            preserveState: true,
            preserveScroll: true,
        });
    };

    const isValidTime = (currentTime) => {
        const selectedDateTime = moment(selectedDate).set({
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
        <div className="h-screen">
            <header className="w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-[51px] flex justify-between">
                <div className="absolute top-4 left-4 sm:top-6 sm:left-8">
                    <Link href="/" className="hover:opacity-80 transition-opacity">
                        <h1 className="text-4xl sm:text-6xl font-philosopher text-white">SIPIKA</h1>
                    </Link>
                </div>
                <div className="absolute top-12 right-6 flex items-center gap-4">
                    <div className="flex items-center gap-2">
                        <FontAwesomeIcon icon={faUser} style={{color: "#F1F1F1"}}/>
                        <p className="text-white font-sfproreg">{userName} ({userMajor})</p>
                    </div>
                    <FontAwesomeIcon icon={faBell} style={{color: "#F1F1F1"}}/>
                    <FontAwesomeIcon icon={faBars} style={{color: "#F1F1F1"}}/>
                </div>
            </header>

            <div className="flex bg-lightGradient">
                {/* Progress Steps */}
                <div className="hidden md:flex w-1/16 h-[84vh] place-self-center items-center justify-center border-1.5 border-white/60 bg-lightGradient shadow-md rounded-lg p-4 my-12 ml-6 relative">
                    <div className="relative flex flex-col items-center h-full">
                        <div ref={step1Ref} className="relative z-10 mt-2">
                            <div className={`w-12 h-12 rounded-full ${currentStep >= 1 ? 'bg-buttonBlue' : 'bg-gray-200'} flex items-center justify-center shadow-lg border-4 ${currentStep >= 1 ? 'border-white' : 'border-gray-300'}`}>
                                {currentStep > 1 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                    </svg>
                                ) : (
                                    <span className={currentStep >= 1 ? 'text-white' : 'text-gray-500'}>1</span>
                                )}
                            </div>
                        </div>

                        <div style={{height: `${lineHeight1}px`}} className={`absolute top-12 w-1 ${currentStep > 1 ? 'bg-buttonBlue' : 'bg-gray-300'} left-1/2 -translate-x-1/2`} />

                        <div ref={step2Ref} className="relative z-10 mt-auto">
                            <div className={`w-12 h-12 rounded-full ${currentStep >= 2 ? 'bg-buttonBlue' : 'bg-gray-200'} flex items-center justify-center shadow-lg border-4 ${currentStep >= 2 ? 'border-white' : 'border-gray-300'}`}>
                                {currentStep > 2 ? (
                                    <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="3" d="M5 13l4 4L19 7"/>
                                    </svg>
                                ) : (
                                    <span className={currentStep >= 2 ? 'text-white' : 'text-gray-500'}>2</span>
                                )}
                            </div>
                        </div>

                        <div style={{height: `${lineHeight2}px`}} className={`absolute top-24 w-1 ${currentStep > 2 ? 'bg-buttonBlue' : 'bg-gray-300'} left-1/2 -translate-x-1/2`} />

                        <div ref={step3Ref} className="relative z-10 mt-auto mb-2">
                            <div className={`w-12 h-12 rounded-full ${currentStep >= 3 ? 'bg-buttonBlue' : 'bg-gray-200'} flex items-center justify-center shadow-lg border-4 ${currentStep >= 3 ? 'border-white' : 'border-gray-300'}`}>
                                <span className={currentStep >= 3 ? 'text-white' : 'text-gray-500'}>3</span>
                            </div>
                        </div>
                    </div>
                </div>

                <main className="w-full p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="mt-8 flex flex-col gap-4">
                        <div className="border-white/40 border bg-glassGradient backdrop-blur-xl shadow-md rounded-3xl p-6 flex flex-col gap-4">
                            {floors.map((floor) => (
                                <button
                                    key={floor}
                                    onClick={() => handleFloorChange(floor)}
                                    disabled={viewAll}
                                    className={`floor-button ${
                                        viewAll
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : currentFloor === floor
                                                ? "bg-buttonBlueHover"
                                                : "bg-buttonBlue hover:bg-buttonBlueHover"
                                    }`}
                                >
                                    Lantai {floor}
                                </button>
                            ))}

                            <button
                                onClick={() => setViewAll(!viewAll)}
                                className={`w-full ${
                                    viewAll ? "bg-red-600 hover:bg-red-700" : "bg-green-600 hover:bg-green-800"
                                } justify-center align-middle text-white font-bold py-6 px-6 rounded-full focus:outline-none focus:shadow-outline font-montserrat text-center`}
                            >
                                {viewAll ? "Kembali" : "Lihat Detail"}
                            </button>
                        </div>

                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="react-calendar"
                            minDate={new Date()}
                            view="month"
                            formatMonthYear={(locale, date) => {
                                const month = date.toLocaleString('default', { month: 'long' });
                                const year = date.getFullYear();
                                return `${month} ${year}`;
                            }}
                            navigationLabel={({ date, label, locale, view }) => {
                                const month = date.toLocaleString('default', { month: 'long' });
                                const year = date.getFullYear();
                                return `${month} ${year}`;
                            }}
                            tileContent={({ date, view }) => {
                                // Add custom content to tiles if needed
                                return null;
                            }}
                        />
                    </div>

                    <div className="flex flex-col gap-6 w-full h-[98%] px-1 py-1">
                        <div className="bg-glassGradient backdrop-blur-xl shadow-lg rounded-3xl p-6 overflow-y-auto flex-grow">
                            {viewAll ? (
                                <div className="bg-white rounded-xl shadow-lg p-6 w-full h-full">
                                    <div className="space-y-6">
                                        {Object.entries(classroomsByFloor).map(([floor, rooms]) => (
                                            <div key={floor} className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold mb-4 text-[#2D3C93]">Lantai {floor}</h3>
                                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                                    {rooms.map((room) => (
                                                        <div
                                                            key={room.id}
                                                            onClick={() => handleRoomSelect(room.id)}
                                                            className={`bg-white rounded-lg p-4 shadow-md border transition-all duration-200 hover:shadow-lg cursor-pointer
                                    ${selectedRoom === room.id ? 'border-buttonBlue' : 'border-transparent'}`}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div>
                                                                    <h4 className="font-bold text-gray-800">{room.name}</h4>
                                                                    <p className="text-sm text-gray-600">Kapasitas: {room.capacity} orang</p>
                                                                </div>
                                                                <span className={`px-2 py-1 text-xs rounded-full ${
                                                                    room.isBooked
                                                                        ? 'bg-red-100 text-red-800'
                                                                        : 'bg-green-100 text-green-800'
                                                                }`}>
                                        {room.isBooked ? 'Terpakai' : 'Tersedia'}
                                    </span>
                                                            </div>

                                                            <div className="mt-3">
                                                                <p className="text-sm font-medium text-gray-600">Fasilitas:</p>
                                                                <div className="flex flex-wrap gap-1 mt-1">
                                                                    {room.facilities.map((facility, idx) => (
                                                                        <span
                                                                            key={idx}
                                                                            className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs"
                                                                        >
                                                {facility}
                                            </span>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        ))}
                                    </div>

                                    <button
                                        className="mt-6"
                                    >
                                    </button>
                                </div>
                            ) : (
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-6 p-6">
                                    {(classroomsByFloor[currentFloor] || []).map((room) => (
                                        <div
                                            key={room.id}
                                            onClick={() => handleRoomSelect(room.id)}
                                            className={`room-tile ${
                                                selectedRoom === room.id
                                                    ? 'bg-buttonBlue text-white'
                                                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                            } rounded-lg px-6 py-6 shadow-lg cursor-pointer transition-colors duration-200 flex items-center justify-center text-center`}
                                        >
                                            <p className="font-bold text-lg">{room.name}</p>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>
                        <div className="border-white/40 border bg-glassGradient backdrop-blur-xl shadow-md rounded-3xl p-6 flex flex-col sm:flex-row justify-between mt-1 w-full">
                            <div className="space-y-3">
                                {roomData && (
                                    <>
                                        <p>
                                            <strong>Kapasitas:</strong> {roomData.capacity} orang</p>
                                        <div>
                                            <strong>Fasilitas:</strong>
                                            <div className="flex flex-wrap gap-2 mt-1">
                                                {roomData.facilities.map((facility, index) => (
                                                    <span key={index}
                                                          className="bg-gray-200 px-3 py-1 rounded-lg text-sm">
                                                        {facility}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div className="mt-4">
                                    <strong className="text-gray-700 text-lg">Waktu Mulai:</strong>
                                    <div className="mt-2">
                                        <div className="relative">
                                            <Datetime
                                                value={selectedTime}
                                                onChange={handleTimeChange}
                                                dateFormat={false}
                                                timeFormat="HH:mm"
                                                className="time-picker-custom"
                                                timeConstraints={{
                                                    hours: {min: 8, max: 23},
                                                    minutes: {step: 5}
                                                }}
                                                isValidTime={isValidTime}
                                                inputProps={{
                                                    className: "w-full bg-white text-gray-700 px-4 py-3 rounded-lg border border-gray-200 shadow-sm focus:border-buttonBlue focus:ring-1 focus:ring-buttonBlue focus:outline-none font-medium text-lg",
                                                    placeholder: "Pilih waktu mulai",
                                                    readOnly: true,
                                                    value: selectedTime ? moment(selectedTime).format('HH:mm') : ''
                                                }}
                                            />
                                            {timeError && (
                                                <div className="mt-2 bg-red-50 border-l-4 border-red-500 p-3 rounded">
                                                    <p className="text-sm text-red-700">
                                                        Mohon pilih waktu setelah waktu sekarang
                                                    </p>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center ml-4">
                                {isAvailable !== null && (
                                    <div
                                        className={"font-medium mb-3 " + (isAvailable ? "text-green-600" : "text-red-600")}>
                                        {isAvailable ? "Ruangan tersedia" : "Ruangan tidak tersedia"}
                                    </div>
                                )}

                                <button
                                    onClick={handleNextClick}
                                    disabled={!isAvailable || !selectedRoom || !selectedTime}
                                    className={"text-white px-8 py-4 rounded-lg transition-colors duration-200 " +
                                        (isAvailable && selectedRoom && selectedTime
                                            ? "bg-buttonBlue hover:bg-buttonBlueHover"
                                            : "bg-gray-400 cursor-not-allowed")}
                                >
                                    Next →
                                </button>
                            </div>
                        </div>
                    </div>
                </main>
            </div>
        </div>
    );
}
