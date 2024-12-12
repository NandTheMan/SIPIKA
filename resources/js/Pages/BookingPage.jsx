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
        if (selectedRoom && selectedDate && selectedTime) {
            checkAvailability();
        }
    }, [selectedRoom, selectedDate, selectedTime]);

    const checkAvailability = () => {
        if (!selectedTime) return;

        const timeString = moment(selectedTime).format('HH:mm');
        axios.post('/booking/check-availability', {
            roomId: selectedRoom,
            date: moment(selectedDate).format('YYYY-MM-DD'),
            time: timeString
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
        setCurrentStep(Math.max(currentStep, 2));
    };

    const handleTimeChange = (time) => {
        setSelectedTime(moment(time));
        setCurrentStep(Math.max(currentStep, 2));
    };

    const handleRoomSelect = (roomId) => {
        setSelectedRoom(roomId);
        setCurrentStep(3);
    };

    const handleNextClick = () => {
        if (!isAvailable) {
            alert('The selected room is not available at the chosen time.');
            return;
        }

        if (!selectedTime) {
            alert('Please select a time for your booking.');
            return;
        }

        axios.post('/booking/create', {
            roomId: selectedRoom,
            date: moment(selectedDate).format('YYYY-MM-DD'),
            startTime: moment(selectedTime).format('HH:mm'),
            duration: 2 // Default to 2 SKS
        }).then(response => {
            if (response.data.success) {
                router.visit(response.data.redirect);
            }
        }).catch(error => {
            console.error('Error creating booking:', error);
            alert('Failed to create booking. Please try again.');
        });
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
                        <div className="border-white/40 border bg-glassGradient backdrop-blur-xl shadow-md rounded-3xl p-6 space-y-4">
                            {floors.map((floor) => (
                                <button
                                    key={floor}
                                    onClick={() => handleFloorChange(floor)}
                                    disabled={viewAll}
                                    className={`w-full ${
                                        viewAll
                                            ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                            : currentFloor === floor
                                                ? "bg-buttonBlueHover"
                                                : "bg-buttonBlue hover:bg-buttonBlueHover"
                                    } text-white font-bold py-6 px-6 rounded-full focus:outline-none focus:shadow-outline font-montserrat text-left pl-4`}
                                >
                                    Lantai {floor}
                                </button>
                            ))}

                            <button
                                onClick={() => setViewAll(!viewAll)}
                                className={`w-full ${
                                    viewAll ? "bg-red-600 hover:bg-red-700" : "bg-textBoxBlue hover:bg-buttonBlue"
                                } justify-center align-middle text-white font-bold py-6 px-6 rounded-full focus:outline-none focus:shadow-outline font-montserrat text-center`}
                            >
                                {viewAll ? "Kembali" : "Lihat Semua"}
                            </button>
                        </div>

                        <Calendar
                            onChange={handleDateChange}
                            value={selectedDate}
                            className="reactCalendar overflow-hidden"
                            minDate={new Date()}
                        />
                    </div>

                    <div className="flex flex-col gap-6 w-full h-[98%] px-1 py-1">
                        <div className="bg-glassGradient backdrop-blur-xl shadow-lg rounded-3xl p-6 overflow-y-auto flex-grow">
                            {viewAll ? (
                                <div className="bg-white rounded-lg shadow-lg w-full h-full">
                                    <div className="space-y-6 p-6">
                                        {Object.entries(classroomsByFloor).map(([floor, rooms]) => (
                                            <div key={floor} className="bg-gray-50 rounded-lg p-4">
                                                <h3 className="text-lg font-semibold mb-4 text-gray-700">Lantai {floor}</h3>
                                                <div className="bg-white rounded-lg shadow">
                                                    <table className="table-auto w-full text-left">
                                                        <thead className="bg-gray-100">
                                                        <tr>
                                                            <th className="px-6 py-3 font-bold text-gray-700">Room Name</th>
                                                            <th className="px-6 py-3 font-bold text-gray-700">Capacity</th>
                                                            <th className="px-6 py-3 font-bold text-gray-700">Facilities</th>
                                                            <th className="px-6 py-3 font-bold text-gray-700">Status</th>
                                                        </tr>
                                                        </thead>
                                                        <tbody>
                                                        {rooms.map((room) => (
                                                            <tr
                                                                key={room.id}
                                                                className="border-t cursor-pointer hover:bg-gray-50 transition-colors"
                                                                onClick={() => handleRoomSelect(room.id)}
                                                            >
                                                                <td className="px-6 py-3 text-gray-600">{room.name}</td>
                                                                <td className="px-6 py-3 text-gray-600">{room.capacity} orang</td>
                                                                <td className="px-6 py-3">
                                                                    <div className="flex flex-wrap gap-2">
                                                                        {room.facilities.map((facility, idx) => (
                                                                            <span
                                                                                key={idx}
                                                                                className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded"
                                                                            >
                                                                                    {facility}
                                                                                </span>
                                                                        ))}
                                                                    </div>
                                                                </td>
                                                                <td className="px-6 py-3">
                                                                        <span className={`px-2 py-1 rounded text-sm ${
                                                                            room.isBooked
                                                                                ? 'bg-red-100 text-red-800'
                                                                                : 'bg-green-100 text-green-800'
                                                                        }`}>
                                                                            {room.isBooked ? 'Terpakai' : 'Tersedia'}
                                                                        </span>
                                                                </td>
                                                            </tr>
                                                        ))}
                                                        </tbody>
                                                    </table>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
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
                                                    <span key={index} className="bg-gray-200 px-3 py-1 rounded-lg text-sm">
                                                        {facility}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    </>
                                )}
                                <div>
                                    <strong>Waktu:</strong>
                                    <div className="mt-1 space-y-2">
                                        <div className="flex items-center space-x-2">
                                            <div className="flex-1">
                                                <label className="block text-sm text-gray-600 mb-1">Jam Mulai</label>
                                                <Datetime
                                                    value={selectedTime}
                                                    onChange={handleTimeChange}
                                                    dateFormat={false}
                                                    timeFormat="HH:mm"
                                                    inputProps={{
                                                        className: "w-full rounded-lg border-gray-300 bg-white px-3 py-2",
                                                        placeholder: "Pilih Waktu Mulai"
                                                    }}
                                                />
                                            </div>
                                        </div>
                                        {selectedTime && (
                                            <div className="bg-blue-50 p-3 rounded-lg text-sm">
                                                <div className="flex justify-between text-blue-800">
                                                    <span>Durasi:</span>
                                                    <span>2 SKS (80 menit)</span>
                                                </div>
                                                <div className="flex justify-between text-blue-800 mt-1">
                                                    <span>Selesai:</span>
                                                    <span>{moment(selectedTime).add(80, 'minutes').format('HH:mm')}</span>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-col justify-center ml-4">
                                {isAvailable !== null && (
                                    <div className={"font-medium mb-3 " + (isAvailable ? "text-green-600" : "text-red-600")}>
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
