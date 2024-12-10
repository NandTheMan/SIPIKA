import React, { useState } from 'react';

const RoomPopup = () => {
    const [Tampil, setTampil] = useState(false);

    // Fungsi untuk membuka dan menutup modal
    const openTampil = () => setTampil(true);
    const closeTampil = () => setTampil(false);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            {/* Tombol untuk membuka popup */}
            <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
                onClick={openTampil}
            >
                Lihat Detail Ruang
            </button>

            {/* Modal (Popup) */}
            {Tampil && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-xl font-bold mb-2 text-center">Ruang 1.1</h2>
                        <p className="text-center text-sm mb-4">
                            <span className="font-semibold">Status:</span> <span className="text-green-400">SUDAH DIPINJAM</span>
                        </p>
                        <div className="mb-4">
                            <p className="font-semibold">Peminjam:</p>
                            <p className="bg-gray-700 text-white rounded-md px-4 py-2 mt-1">
                                I Gede Abhijomok (2308561001) - Informatika
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold">Hari dan Tanggal Peminjaman:</p>
                            <p className="bg-gray-700 text-white rounded-md px-4 py-2 mt-1">
                                Kamis, 30 October 2024
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold">Waktu Peminjaman:</p>
                            <p className="bg-gray-700 text-white rounded-md px-4 py-2 mt-1">
                                08:00 AM - 08:50 AM
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold">Keperluan Peminjaman:</p>
                            <p className="bg-gray-700 text-white rounded-md px-4 py-2 mt-1">
                                Kelas Basis Data Kelas A
                            </p>
                        </div>
                        <p className="text-center text-sm mb-4">Ingin mendapatkan notifikasi status ruangan ini? <a
                            className="font-montserrat text-center text-xs sm:text-sm text-gray-300 hover:text-white hover:font-bold"
                            href="#">Dapatkan Notifikasi</a>
                        </p>

                        <div className="flex flex-col items-center gap-4">
                            <button className="bg-[#2D3C93] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#0E122D]">
                                Laporkan Peminjaman
                            </button>
                            <button
                                className="text-gray-400 hover:text-gray-200"
                                onClick={closeTampil}
                            >
                                Batal
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default RoomPopup;
