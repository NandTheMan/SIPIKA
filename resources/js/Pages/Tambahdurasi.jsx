import React, { useState } from 'react';



const popup = () => {
    const [Tampil, setTampil] = useState(false);

    // Fungsi untuk membuka dan menutup modal
    const openTampil = () => setTampil(true);
    const closeTampil = () => setTampil(false);
    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-gray-900 p-4">
            <button
                className="bg-blue-500 text-white font-bold py-2 px-4 rounded-md"
                onClick={openTampil}
            >
                Tambah durasi
            </button>
            {Tampil && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="bg-gray-800 text-white p-6 rounded-lg max-w-md w-full">
                        <h2 className="text-l font-bold mb-2 text-center">Penamabahan Durasi Peminjaman Ruang 1.1</h2>
                        <div className="mb-4">
                            <p className="font-semibold">Waktu Peminjaman Berlangsung:</p>
                            <p className="bg-gray-700 text-white rounded-md px-4 py-2 mt-1">
                                08.00 AM - 08.50 AM
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold">Durasi Peminjaman Sebelumnya:</p>
                            <p className="bg-gray-700 text-white rounded-md px-4 py-2 mt-1">
                                1 SKS (50 menit)
                            </p>
                        </div>
                        <div className="mb-4">
                            <p className="font-semibold">Durasi Peminjaman Berikutnya:</p>
                            <p className="bg-gray-700 text-white rounded-md px-4 py-2 mt-1">
                                2 SKS (100 menit)
                            </p>
                        </div>
                        <div className="flex flex-col items-center gap-4">
                            <button className="bg-[#2D3C93] text-white font-bold px-4 py-2 rounded-lg hover:bg-[#0E122D]">
                                Konfirmasi
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
    )
}

export default popup;

