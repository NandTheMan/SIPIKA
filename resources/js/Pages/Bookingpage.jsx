import React from 'react';

export default function BookingPage() {
    return (
        <div className="flex h-screen bg-lightGradient">
            {/* Sidebar: Stepper */}
            <div className="hidden md:flex w-1/12 h-[90vh] place-self-center items-center justify-center bg-white shadow-md rounded-lg p-4">
                <div className="flex flex-col justify-between h-full items-center">
                    {/* Step 1 */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-blue-600 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-white"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="flex-grow h-full w-1 bg-blue-600"></div>
                    </div>

                    {/* Step 2 */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                        <div className="flex-grow h-full w-1 bg-gray-300"></div>
                    </div>

                    {/* Step 3 */}
                    <div className="flex flex-col items-center">
                        <div className="w-12 h-12 rounded-full bg-gray-300 flex items-center justify-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-6 h-6 text-gray-600"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="2"
                                    d="M5 13l4 4L19 7"
                                />
                            </svg>
                        </div>
                    </div>
                </div>
            </div>


            {/* Main Content */}
            <main className="w-4/5 p-6 grid grid-cols-12 gap-4">
                {/* Floor Selection */}
                <div className="col-span-4 bg-white shadow-md rounded-lg p-4">
                    <div className="space-y-4">
                        <button className="w-full py-3 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-left pl-4">
                            Lantai 1
                        </button>
                        <button className="w-full py-3 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-left pl-4">
                            Lantai 2
                        </button>
                        <button className="w-full py-3 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-left pl-4">
                            Lantai 3
                        </button>
                        <button className="w-full py-3 rounded-lg bg-gray-200 hover:bg-blue-500 hover:text-white text-left pl-4">
                            View All
                        </button>
                    </div>
                </div>

                {/* Calendar */}
                <div className="col-span-4 bg-white shadow-md rounded-lg p-4">
                    <label htmlFor="date" className="block text-sm font-semibold mb-2">
                        Pilih Tanggal
                    </label>
                    <input
                        id="date"
                        name="date"
                        type="date"
                        className="w-full border border-gray-300 rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                {/* Room Tiles */}
                <div className="col-span-12 grid grid-cols-6 gap-4">
                    {[1, 2, 3, 4, 5, 6].map((room) => (
                        <div
                            key={room}
                            className="room-tile bg-gray-100 rounded-lg p-4 shadow hover:bg-gray-200"
                        >
                            <p className="font-bold text-gray-700 text-center">
                                Ruang Kelas 1.{room}
                            </p>
                        </div>
                    ))}
                </div>

                {/* Room Details & Next Button */}
                <div className="col-span-12 bg-white shadow-md rounded-lg p-4 flex justify-between">
                    <div>
                        <p>
                            <strong>Kapasitas:</strong> <span id="room-capacity">20</span>
                        </p>
                        <p>
                            <strong>Fasilitas:</strong>
                            <span id="room-facilities" className="ml-2">
                <span className="bg-gray-200 px-2 py-1 rounded-lg mr-2">
                  Air Conditioner
                </span>
                <span className="bg-gray-200 px-2 py-1 rounded-lg">
                  Projector
                </span>
              </span>
                        </p>
                        <p>
                            <strong>Jam:</strong> <span id="room-time">08:00 - 10:00</span>
                        </p>
                    </div>
                    <button className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700">
                        Next →
                    </button>
                </div>
            </main>
        </div>
    );
}
