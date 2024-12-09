import React, { useState } from 'react';

const RoomsPage = () => {
    const [currentFloor, setCurrentFloor] = useState(1);
    const [showModal, setShowModal] = useState(false);
    const [selectedRoom, setSelectedRoom] = useState(null);

    const handleFloorClick = (floor) => {
        setCurrentFloor(floor);
    };

    const handleRoomClick = (room) => {
        setSelectedRoom(room);
        setShowModal(true);
    };

    const closeModal = () => {
        setShowModal(false);
        setSelectedRoom(null);
    };

    const kembaliClick = () => {

    };



    const rooms = [
        `Ruang ${currentFloor}.1`,
        `Ruang ${currentFloor}.2`,
        `Ruang ${currentFloor}.3`,
        `Ruang ${currentFloor}.4`,
    ];

    return (
        <div className="flex items-center justify-center h-screen bg-gray-200">
            <div className="flex flex-col items-center justify-center w-96 h-auto bg-gray-800 p-4 rounded-lg">
                <div className="flex justify-center mb-5">
                    {[1, 2, 3].map((floor) => (
                        <button
                            key={floor}
                            className={`bg-gray-600 text-white px-4 py-2 rounded-md mx-2 ${
                                currentFloor === floor ? 'bg-gray-700' : ''
                            }`}
                            onClick={() => handleFloorClick(floor)}
                        >
                            Lantai {floor}
                        </button>
                    ))}
                </div>

                <div className="grid grid-cols-3 gap-5">
                    {rooms.map((room, index) => (
                        <button
                            key={index}
                            className="bg-gray-600 text-white px-5 py-3 rounded-lg hover:bg-gray-700"
                            onClick={() => handleRoomClick(room)}
                        >
                            {room}
                        </button>
                    ))}
                </div>

                {showModal && (
                    <div
                        className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="bg-gray-800 text-white p-8 rounded-lg max-w-md w-full">
                            <h2 className="text-2xl font-bold mb-4">{selectedRoom}</h2>
                            <p>Ini adalah konten untuk {selectedRoom}.</p>
                            <button
                                className="bg-gray-600 text-white px-4 py-2 rounded-md mt-4"
                                onClick={closeModal}
                            >
                                Kembali
                            </button>
                        </div>
                    </div>
                )}
                <div className="flex items-center justify-center mx-2 sm:mx-4 mt-10 ">
                    <button
                        className="bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-4 px-16 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm "
                        onclick={kembaliClick}
                    >
                        Kembali
                    </button>
                </div>
            </div>
        </div>
            );
            };

            export default RoomsPage;
