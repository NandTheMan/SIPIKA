import React, { useState, useEffect } from 'react';
import { Head, Link, router } from '@inertiajs/react';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import ReportsCarousel from '@/Components/ReportsCarousel';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBell, faEye } from '@fortawesome/free-regular-svg-icons';
import { faBars, faClock, faGauge, faMagnifyingGlass, faSignOutAlt } from '@fortawesome/free-solid-svg-icons';
import NotificationPopover from '@/Components/NotificationPopover';
import PinButton from '@/Components/PinButton';
import axios from 'axios';
import MenuDropdown from '@/Components/MenuDropdown';

function FloorView({ floorNumber, classrooms, onClose, pinnedClassrooms, setPinnedClassrooms }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto relative shadow-xl">
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
                            className={`p-4 rounded-lg border transition-shadow duration-200 ${
                                classroom.isBooked
                                    ? 'bg-red-50 border-red-200 hover:shadow-red-200'
                                    : 'bg-green-50 border-green-200 hover:shadow-green-200'
                            } hover:shadow-lg`}
                        >
                            <div className="flex justify-between items-start mb-2">
                                <h3 className="font-bold text-lg">{classroom.name}</h3>
                                <PinButton
                                    classroomId={classroom.id}
                                    isPinned={pinnedClassrooms.includes(classroom.id)}
                                    onPinChange={(isPinned) => {
                                        if (isPinned) {
                                            setPinnedClassrooms([...pinnedClassrooms, classroom.id]);
                                        } else {
                                            setPinnedClassrooms(pinnedClassrooms.filter(id => id !== classroom.id));
                                        }
                                    }}
                                />
                            </div>

                            {/* Removed the duplicate room name */}
                            <p className="text-gray-600">Kapasitas: {classroom.capacity} orang</p>

                            <div className="mt-2">
                                <p className="text-sm font-semibold">Fasilitas:</p>
                                <div className="flex flex-wrap gap-1 mt-1">
                                    {classroom.facilities?.map((facility, index) => (
                                        <span
                                            key={index}
                                            className="bg-white border border-gray-200 px-2 py-1 rounded text-xs"
                                        >
                                            {facility}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {!classroom.isBooked && (
                                <Link
                                    href={`/book-room/`}
                                    className="mt-3 inline-block bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm transition-colors"
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

export default function Homepage({
                                     bookingData = [],
                                     reportData = [],
                                     userName,
                                     userMajor,
                                     classroomsByFloor = {},
                                     canBookRoom
                                 }) {
    const [date, setDate] = useState(new Date());
    const [selectedFloor, setSelectedFloor] = useState(null);
    const [dateBookings, setDateBookings] = useState(bookingData);
    const [isLoading, setIsLoading] = useState(false);
    const [pinnedClassrooms, setPinnedClassrooms] = useState([]);

    const handleDateChange = (newDate) => {
        setDate(newDate);
        fetchBookingsForDate(newDate);
    };

    const [isNotificationOpen, setIsNotificationOpen] = useState(false);

    useEffect(() => {
        const fetchPinnedClassrooms = async () => {
            try {
                const response = await axios.get('/api/pinned-classrooms');
                setPinnedClassrooms(response.data.map(pc => pc.classroom_id));
            } catch (error) {
                console.error('Error fetching pinned classrooms:', error);
            }
        };

        fetchPinnedClassrooms();
    }, []);

    const fetchBookingsForDate = async (selectedDate) => {
        setIsLoading(true);
        try {
            // Adjust the date to local timezone to prevent offset
            const localDate = new Date(selectedDate.getTime() - (selectedDate.getTimezoneOffset() * 60000))
                .toISOString()
                .split('T')[0];

            const response = await axios.get('/api/bookings', {
                params: {
                    date: localDate
                }
            });
            setDateBookings(response.data);
        } catch (error) {
            console.error('Error fetching bookings:', error);
            alert('Failed to fetch bookings. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleLogout = (e) => {
        e.preventDefault();
        router.post('/logout');
    };

    return (
        <div className="min-h-screen flex flex-col">
            <Head title="SIPIKA - Home" />
            <header className='w-full bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-6 flex justify-between items-center'>
                <div>
                    <Link href="/">
                        <img src="/images/logo.png" alt="logo-sipika" width={146} />
                    </Link>
                </div>
                <div className='flex items-center gap-6'>
                    <div className='text-white font-sfproreg'>
                        {userName} ({userMajor})
                    </div>
                    <button
                        onClick={handleLogout}
                        className="text-white hover:text-gray-200 transition-colors"
                    >
                        <FontAwesomeIcon icon={faSignOutAlt} className="text-xl"/>
                    </button>
                    <FontAwesomeIcon
                        icon={faBell}
                        className="text-white cursor-pointer hover:text-gray-200"
                        onClick={() => setIsNotificationOpen(true)}
                    />
                    <MenuDropdown />
                </div>
            </header>

            <main className='flex-1 px-10 py-16 bg-gradient-to-br from-white via-[#CCE0FF] via-[#EBF3FF] to-[#C8DEFF]'>
                {/* Pinjam Kelas Section */}
                <div className='max-w-7xl mx-auto'>
                    <div className="mb-16">
                        <h1 className="text-4xl font-extrabold mb-4 text-gray-800">Pinjam Kelas</h1>
                        <p className='w-full md:w-[554px] font-sfproreg py-3 text-gray-700'>
                            Platform peminjaman ruangan Gedung Dekanat Fakultas Matematika dan Ilmu Pengetahuan Alam, Universitas Udayana.
                        </p>
                        <Link
                            href="/classrooms-overview"
                            className='inline-flex items-center gap-2 rounded-lg px-4 py-3 border-2 border-[#2D3C93] text-[#2D3C93] hover:bg-[#2D3C93] hover:text-white transition-colors font-medium'
                        >
                            <FontAwesomeIcon icon={faClock} />
                            <span>Lihat Kelas</span>
                        </Link>
                    </div>

                    {/* Asset Gedung Dekanat */}
                    <div className='relative flex justify-center h-[842px] mb-16'>
                        {/*
                            Note: The hover animations (translate-x) are preserved.
                            You can further adjust transitions if desired.
                        */}
                        <img
                            className="absolute z-[10] hover:translate-x-[60px] transition-transform duration-300 cursor-pointer drop-shadow-xl"
                            src="/images/lantai4.png"
                            alt="Lantai 4"
                            width={580}
                        />
                        <img
                            className="absolute top-[300px] z-[9] hover:translate-x-[60px] transition-transform duration-300 cursor-pointer drop-shadow-xl"
                            src="/images/lantai3.png"
                            alt="Lantai 3"
                            width={580}
                            onClick={() => setSelectedFloor(3)}
                        />
                        <img
                            className="absolute top-[442px] z-[8] hover:translate-x-[60px] transition-transform duration-300 cursor-pointer drop-shadow-xl"
                            src="/images/lantai2.png"
                            alt="Lantai 2"
                            width={580}
                            onClick={() => setSelectedFloor(2)}
                        />
                        <img
                            className="absolute top-[584px] z-[7] hover:translate-x-[60px] transition-transform duration-300 cursor-pointer drop-shadow-xl"
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
                            pinnedClassrooms={pinnedClassrooms}
                            setPinnedClassrooms={setPinnedClassrooms}
                        />
                    )}

                    {/* Quick Book */}
                    <div className='flex justify-center mt-10 gap-3'>
                        <Link
                            href="/quick-book"
                            className='flex bg-[#2D3C93] w-fit items-center gap-3 py-3 px-6 rounded-2xl hover:bg-[#1e2a6a] transition-colors text-white font-semibold shadow'
                        >
                            <FontAwesomeIcon icon={faGauge} className='fa-xl'/>
                            <p className='text-[20px]'>Quick Book</p>
                        </Link>
                        <Link
                            href="/book-room"
                            className='w-fit h-100 bg-[#B6B6B6] px-6 flex items-center rounded-2xl hover:bg-[#8ea0c1] transition-colors text-white shadow'
                        >
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='fa-xl'/>
                        </Link>
                    </div>
                </div>

                <div className='max-w-7xl mx-auto pt-24'>
                    <h2 className="text-3xl font-bold mb-8 text-gray-800">Lihat Jadwal</h2>
                    <div className='pt-10 flex flex-col lg:flex-row items-start gap-8 justify-center'>
                        <div className="w-full lg:w-[400px] bg-white rounded-lg shadow-lg p-3 my-custom-calendar">
                            <Calendar
                                onChange={handleDateChange}
                                value={date}
                                className="w-full"
                                minDate={new Date()}
                            />
                        </div>

                        {/* Bookings Table */}
                        <div className='flex-1 w-full'>
                            <div className='bg-white p-5 rounded-xl shadow-lg'>
                                <h3 className="text-xl font-semibold mb-4 text-[#2D3C93]">
                                    Daftar Peminjaman {date.toLocaleDateString('id-ID', {
                                    weekday: 'long',
                                    year: 'numeric',
                                    month: 'long',
                                    day: 'numeric'
                                })}
                                </h3>
                                <div className='border border-gray-200 rounded-lg shadow-md overflow-auto max-h-[350px]'>
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
                                        {isLoading ? (
                                            <tr>
                                                <td colSpan="4" className="text-center py-4">
                                                    <div className="flex items-center justify-center">
                                                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                                                        <span className="ml-2">Loading...</span>
                                                    </div>
                                                </td>
                                            </tr>
                                        ) : dateBookings.length > 0 ? (
                                            dateBookings.map((item) => (
                                                <tr key={item.id} className="hover:bg-gray-100 transition-colors even:bg-gray-50">
                                                    <td className='py-2 px-4 whitespace-nowrap'>{item.ruang}</td>
                                                    <td className='py-2 px-4 whitespace-nowrap'>{item.peminjam}</td>
                                                    <td className='py-2 px-4 whitespace-nowrap'>{item.waktu}</td>
                                                    <td className='py-2 px-4 whitespace-nowrap text-center'>
                                                        <Link
                                                            href={`/my-bookings/${item.id}`}
                                                            className='inline-flex items-center gap-2 bg-[#2D3C93] text-white px-3 py-2 rounded hover:bg-[#1e2a6a] transition-colors text-sm font-medium'
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

                <div className='max-w-7xl mx-auto pt-24'>
                    <ReportsCarousel reports={reportData} />
                </div>
            </main>

            <footer className='w-full bg-gradient-to-r from-[#0E122D] to-[#2D3C93] text-white p-10 flex flex-col md:flex-row md:justify-between gap-10'>
                <div className='flex-1'>
                    <img src="/images/logo.png" alt="logo-sipika" width={200} className='mb-6'/>
                    <p className='text-gray-200 text-sm max-w-sm'>
                        Platform peminjaman ruangan Gedung Dekanat Fakultas Matematika dan Ilmu Pengetahuan Alam, Universitas Udayana
                    </p>
                </div>
                <div className='w-fit mr-20'>
                    <h4 className='font-bold mb-3'>Quick Links</h4>
                    <div className='flex flex-col gap-1 text-sm'>
                        <Link href="/" className="hover:text-gray-300 transition-colors">Home</Link>
                        <Link href="/bookings/create" className="hover:text-gray-300 transition-colors">Pinjam Kelas</Link>
                        <Link href="/classrooms" className="hover:text-gray-300 transition-colors">Lihat Kelas</Link>
                        <Link href="/reports/create" className="hover:text-gray-300 transition-colors">Lapor Kelas</Link>
                    </div>
                </div>
                <div className='flex-1 space-y-10'>
                    <div>
                        <h4 className='font-bold mb-3'>Further Information</h4>
                        <div className='border border-gray-500 rounded-lg flex overflow-hidden'>
                            <input
                                type="text"
                                className='bg-white text-black p-4 flex-1 text-sm focus:outline-none'
                                placeholder="Enter Email"
                            />
                            <button
                                type='submit'
                                className='bg-white text-black rounded-r-lg px-6 text-sm font-bold hover:bg-gray-200 transition-colors'
                            >
                                Submit
                            </button>
                        </div>
                    </div>
                    <p className='text-sm text-gray-200'>
                        Copyright© 2024 SIPIKA. All Rights Reserved
                    </p>
                </div>
            </footer>

            <NotificationPopover
                isOpen={isNotificationOpen}
                onClose={() => setIsNotificationOpen(false)}
                pinnedClassrooms={classroomsByFloor[selectedFloor]?.filter(classroom =>
                    pinnedClassrooms.includes(classroom.id)
                ) || []}
                onPin={async (classroomId) => {
                    try {
                        await axios.post('/api/classrooms/pin', { classroom_id: classroomId });
                        setPinnedClassrooms([...pinnedClassrooms, classroomId]);
                    } catch (error) {
                        console.error('Error pinning classroom:', error);
                    }
                }}
                onUnpin={async (classroomId) => {
                    try {
                        await axios.post('/api/classrooms/unpin', { classroom_id: classroomId });
                        setPinnedClassrooms(pinnedClassrooms.filter(id => id !== classroomId));
                    } catch (error) {
                        console.error('Error unpinning classroom:', error);
                    }
                }}
            />

            {/* Custom Styles */}
            <style>
                {`
                .my-custom-calendar .react-calendar__navigation__label {
                    display: flex;
                    flex-direction: column;
                    align-items: center;
                    line-height: 1.5;
                }

                .my-custom-calendar .react-calendar__navigation__label span {
                    margin-bottom: 0.5rem;
                }

                .my-custom-calendar .react-calendar__month-view__weekdays,
                .my-custom-calendar .react-calendar__month-view__days {
                    margin-top: 1rem;
                }

                .my-custom-calendar .react-calendar__tile--now {
                    background: #EBF3FF !important;
                    border-radius: 8px;
                }

                .my-custom-calendar .react-calendar__tile--active {
                    background: #2D3C93 !important;
                    color: white !important;
                    border-radius: 8px;
                }
            `}
            </style>
        </div>
    );
}
