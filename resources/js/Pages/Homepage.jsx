import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEye } from '@fortawesome/free-regular-svg-icons';
import { faBars, faClock, faGauge, faMagnifyingGlass, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';

function FloorView({ floorNumber, classrooms, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700 text-2xl font-bold"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-6">Lantai {floorNumber}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classrooms?.map((classroom) => (
                        <div
                            key={classroom.id}
                            className={`p-4 rounded-lg border ${
                                classroom.isBooked ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'
                            }`}
                        >
                            <h3 className="font-bold text-lg mb-2">{classroom.name}</h3>
                            <p className="text-gray-600">Kapasitas: {classroom.capacity} orang</p>

                            <div className="mt-2">
                                <p className="text-sm font-semibold">Fasilitas:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {classroom.facilities?.map((facility, index) => (
                                        <span
                                            key={index}
                                            className="bg-white px-2 py-1 rounded text-xs"
                                        >
                                            {facility}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {!classroom.isBooked && (
                                <Link
                                    href={`/bookings/create?classroom=${classroom.id}`}
                                    className="mt-3 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 text-sm"
                                >
                                    Pesan Ruangan
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default function Homepage({ bookingData = [], reportData = [], userName, userMajor, classroomsByFloor = {}, canBookRoom }) {
    const [date, setDate] = useState(new Date());
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [dateBookings, setDateBookings] = useState(bookingData);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        fetchBookingsForDate(newDate);
    };

    const fetchBookingsForDate = async (selectedDate) => {
        try {
            const response = await axios.get('/api/bookings', {
                params: {
                    date: selectedDate.toISOString().split('T')[0]
                }
            });
            setDateBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div>
            <Head title="SIPIKA - Home" />
            <header className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-[51px] flex justify-between'>
                <div className='left-header'>
                    <Link href="/">
                        <img src="/images/logo.png" alt="logo-sipika" width={146} />
                    </Link>
                </div>
                <div className='right-header flex items-center gap-4'>
                    <div className='text-white font-sfproreg'>
                        {userName} ({userMajor})
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl"/>
                    </button>
                    <FontAwesomeIcon icon={faBell} className="text-white cursor-pointer hover:text-gray-200 transition-colors"/>
                    <FontAwesomeIcon icon={faBars} className="text-white cursor-pointer hover:text-gray-200 transition-colors"/>
                </div>
            </header>

            <main
                className='px-[52px] py-[116px] bg-gradient-to-br from-white via-[#CCE0FF] via-[#EBF3FF] to-[#C8DEFF] min-h-screen'>
                {/* Pinjam Kelas */}
                <div>
                    <div>
                        <h1 className="text-4xl font-bold mb-4">Pinjam Kelas</h1>
                        <p className='w-[554px] font-sfproreg py-3'>Platform peminjaman ruangan Gedung Dekanat Fakultas
                            Matematika dan Ilmu Pengetahuan Alam, Universitas Udayana</p>
                        <Link
                            href="/book-room"
                            className='border-[2px] border-[#2D3C93] w-fit flex items-center gap-2 rounded-lg p-2.5 hover:bg-[#2D3C93] hover:text-white group transition-colors'
                        >
                            <FontAwesomeIcon icon={faClock} className="group-hover:text-white"
                                             style={{color: "#2D3C93"}}/>
                            <span className='text-[#2D3C93] font-sfpromed group-hover:text-white'>Lihat Kelas</span>
                        </Link>
                    </div>

                    {/* Asset Gedung Dekanat */}
                    <div className='relative flex justify-center h-[842px]'>
                        <img
                            className="absolute z-[10] hover:translate-x-[60px] duration-300 cursor-pointer"
                            src="/images/lantai4.png"
                            alt="Lantai 4"
                            width={580}
                            onClick={() => setSelectedFloor(4)}
                        />
                        <img
                            className="absolute top-[300px] z-[9] hover:translate-x-[60px] duration-300 cursor-pointer"
                            src="/images/lantai3.png"
                            alt="Lantai 3"
                            width={580}
                            onClick={() => setSelectedFloor(3)}
                        />
                        <img
                            className="absolute top-[442px] z-[8] hover:translate-x-[60px] duration-300 cursor-pointer"
                            src="/images/lantai2.png"
                            alt="Lantai 2"
                            width={580}
                            onClick={() => setSelectedFloor(2)}
                        />
                        <img
                            className="absolute z-7 top-[584px] z-[7] hover:translate-x-[60px] duration-300 cursor-pointer"
                            src="/images/lantai1.png"
                            alt="Lantai 1"
                            width={580}
                            onClick={() => setSelectedFloor(1)}
                        />
                    </div>

                    {selectedFloor && classroomsByFloor && (
                        <FloorView
                            floorNumber={selectedFloor}
                            classrooms={classroomsByFloor[selectedFloor]}
                            onClose={() => setSelectedFloor(null)}
                        />
                    )}

                    {/* Quick Book */}
                    <div className='flex justify-center mt-10 gap-3'>
                        <Link
                            href="/bookings/quick-book"
                            className='flex bg-[#2D3C93] w-fit items-center gap-3 py-3 px-6 rounded-2xl hover:bg-[#1e2a6a] transition-colors'
                        >
                            <FontAwesomeIcon icon={faGauge} className='fa-xl' style={{color: "#FFF"}}/>
                            <p className='font-sfproreg text-white text-[24px]'>Quick Book</p>
                        </Link>
                        <Link
                            href="/classrooms"
                            className='w-fit h-100 bg-[#B6B6B6] px-6 flex items-center rounded-2xl hover:bg-green-500 transition-colors'
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='fa-xl' style={{color: "#FFF"}}/>
                        </Link>
                    </div>
                </div>

                <div className='pt-[116px]'>
                    <h2 className="text-3xl font-bold mb-8">Lihat Jadwal</h2>
                    <div className='pt-[36px] flex items-start gap-8 justify-center'>
                        <div className="w-[400px] bg-white rounded-lg shadow-lg p-3 my-custom-calendar">
                            <Calendar
                                onChange={handleDateChange}
                                value={date}
                                className="w-full"
                                minDate={new Date()}
                            />
                        </div>

                        {/* Bookings Table */}
                        <div className='flex-1'>
                            <div className='bg-white p-5 rounded-xl shadow-lg'>
                                <h3 className="text-xl font-semibold mb-4 text-[#2D3C93]">
                                    Daftar Peminjaman {date.toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                </h3>
                                <div
                                    className='border border-gray-200 rounded-lg shadow-md overflow-auto max-h-[350px]'>
                                    <table className='w-full table-auto border-collapse'>
                                        <thead className='bg-[#2D3C93] text-white'>
                                        <tr>
                                            <th className='py-3 px-4 text-left font-semibold'>Ruang</th>
                                            <th className='py-3 px-4 text-left font-semibold'>Peminjam</th>
                                            <th className='py-3 px-4 text-left font-semibold'>Waktu</th>
                                            <th className='py-3 px-4 font-semibold text-center w-[16%]'>Aksi</th>
                                        </tr>
                                        </thead>
                                        <tbody className='divide-y divide-gray-200'>
                                        {dateBookings.length > 0 ? (
                                            dateBookings.map((item) => (
                                                <tr key={item.id}
                                                    className="hover:bg-gray-100 transition-colors even:bg-gray-50">
                                                    <td className='py-2 px-4 whitespace-nowrap'>{item.ruang}</td>
                                                    <td className='py-2 px-4 whitespace-nowrap'>{item.peminjam}</td>
                                                    <td className='py-2 px-4 whitespace-nowrap'>{item.waktu}</td>
                                                    <td className='py-2 px-4 whitespace-nowrap text-center'>
                                                        <Link
                                                            href={`/bookings/${item.id}`}
                                                            className='inline-flex items-center gap-2 bg-[#2D3C93] text-white px-3 py-2 rounded hover:bg-[#1e2a6a] transition-colors'
                                                        >
                                                            <FontAwesomeIcon icon={faEye} className='fa-sm'/>
                                                            <span>Lihat</span>
                                                        </Link>
                                                    </td>
                                                </tr>
                                            ))
                                        ) : (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4 text-gray-500">
                                                    Tidak ada peminjaman untuk tanggal ini
                                                </td>
                                            </tr>
                                        )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </main>

            <footer className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] text-white p-[54px] flex'>
                <div className='flex-1'>
                    <img src="/images/logo.png" alt="logo-sipika" width={291} className='mb-[38px]'/>
                    <p>Platform peminjaman ruangan Gedung Dekanat Fakultas Matematika dan Ilmu Pengetahuan Alam,
                        Universitas Udayana</p>
                </div>
                <div className='mx-10 w-fit mr-20'>
                    <h4 className='font-sfprobold mb-3'>Quick Links</h4>
                    <div className='flex flex-col gap-1'>
                        <Link href="/" className="hover:text-gray-200 transition-colors">Home</Link>
                        <Link href="/bookings/create" className="hover:text-gray-200 transition-colors">Pinjam
                            Kelas</Link>
                        <Link href="/classrooms" className="hover:text-gray-200 transition-colors">Lihat Kelas</Link>
                        <Link href="/reports/create" className="hover:text-gray-200 transition-colors">Lapor
                            Kelas</Link>
                    </div>
                </div>
                <div className='flex-1 space-y-10'>
                    <div>
                        <h4 className='font-sfprobold mb-3'>Further Information</h4>
                        <div className='border rounded-lg flex'>
                            <input type="text" className='bg-[#0000000A] border-none p-4 flex-1'
                                   placeholder="Enter Email"/>
                            <button type='submit'
                                    className='w-fit bg-white text-black rounded-r-lg px-8 font-sfprobold'>Submit
                            </button>
                        </div>
                    </div>
                    <p>Copyright © all right reserved</p>
                </div>
            </footer>

            {/* Custom Styles */}
            <style>
                {`
                /* Increase line spacing and separate month & year lines in the calendar navigation */
                .my-custom-calendar .react-calendar__navigation__label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    line-height: 1.5;
                }

                .my-custom-calendar .react-calendar__navigation__label span {
                    margin-bottom: 0.5rem; /* Adds space between month and year lines */
                }

                /* Adjust spacing for weekdays and days to reduce empty space */
                .my-custom-calendar .react-calendar__month-view__weekdays,
                .my-custom-calendar .react-calendar__month-view__days {
                    margin-top: 1rem;
                }
            `}
            </style>
        </div>
    );
}
