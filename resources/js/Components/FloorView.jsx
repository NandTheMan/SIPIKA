// resources/js/Components/FloorView.jsx
import React from 'react';
import { Link } from '@inertiajs/react';

export default function FloorView({ floorNumber, classrooms, onClose }) {
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-4xl w-full max-h-[80vh] overflow-y-auto relative">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
                >
                    ×
                </button>

                <h2 className="text-2xl font-bold mb-6">Lantai {floorNumber}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {classrooms.map((classroom) => (
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
                                    {classroom.facilities.map((facility, index) => (
                                        <span
                                            key={index}
                                            className="bg-white px-2 py-1 rounded text-xs"
                                        >
                                            {facility}
                                        </span>
                                    ))}
                                </div>
                            </div>

                            {classroom.currentBooking && (
                                <div className="mt-2 text-red-600 text-sm">
                                    Terpakai sampai: {classroom.currentBooking.endTime}
                                    <br />
                                    Jumlah: {classroom.currentBooking.userCount} orang
                                </div>
                            )}

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
