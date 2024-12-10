import React, { useState } from "react";
import logo from '../../../public/images/logo.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faBell, faEye} from '@fortawesome/free-regular-svg-icons'
import {faBars} from "@fortawesome/free-solid-svg-icons";

const Adminpage = () => {
    const [Tampil, setTampil] = useState("User");

    // Contoh data pengguna
    const users = [
        { id: 1, name: "I Gede Abhijomok", role: "Mahasiswa" },
        { id: 2, name: "Akora Riyan", role: "Mahasiswa" },
        { id: 3, name: "Gung Nanda", role: "Mahasiswa" },
    ];
    const laporan =[
        {id: 1, name: "Laporan Kelas A", date: "12-10-2025" , condition: "Selesai"},
        {id: 2, name: "Laporan Kelas B", date: "18-10-2025" , condition: "Belum Selesai"},
        {id: 3, name: "Laporan Kelas c", date: "20-10-2025" , condition: "Belum Selesai"},
    ];
    const ruangan =[
        {id: 1, name: "Ruangan 1.1", status: "Siap dipinjam"},
        {id: 2, name: "Ruangan 1.2", status: "Tidak siap dipinjam"},
        {id: 3, name: "Ruangan 1.3", status: "Tidak siap dipinjam"},
    ];

    // Fungsi untuk mengubah konten berdasarkan tombol yang ditekan
    const renderContent = () => {
        switch (Tampil) {
            case "User":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Daftar Pengguna</h2>
                        <ul className="space-y-4">
                            {users.map((user) => (
                                <li
                                    key={user.id}
                                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                                >
                                    <div>
                                        <p className="text-lg font-semibold">{user.name}</p>
                                        <p className="text-sm text-gray-600">{user.role}</p>
                                    </div>
                                    <button
                                        className="bg-[#2D3C93] text-white px-4 py-2 rounded-lg hover:bg-[#0E122D]"
                                        onClick={() => handleUserAction(user.id)}
                                    >
                                        Aksi
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            case "Laporan":
               return (
                <div>
                    <h2 className="text-xl font-bold mb-4">Daftar Laporan</h2>
                    <ul className="space-y-4">
                        {laporan.map((Laporan) => (
                            <li
                                key={Laporan.id}
                                className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                            >
                                <div>
                                    <p className="text-lg font-semibold">{Laporan.name}</p>
                                    <p className="text-sm text-gray-600">{Laporan.date}</p>
                                    <p className="text-sm text-gray-600">{Laporan.condition}</p>
                                </div>
                                <button
                                    className="bg-[#2D3C93] text-white px-4 py-2 rounded-lg hover:bg-[#0E122D]"
                                    onClick={() => handleLaporanAction(Laporan.id)}
                                >
                                    Aksi
                                </button>
                            </li>
                        ))}
                    </ul>
                </div>
            );
            case "Ruangan":
                return (
                    <div>
                        <h2 className="text-xl font-bold mb-4">Daftar Ruangan</h2>
                        <ul className="space-y-4">
                            {ruangan.map((room) => (
                                <li
                                    key={room.id}
                                    className="flex justify-between items-center bg-gray-100 p-4 rounded-lg shadow"
                                >
                                    <div>
                                        <p className="text-lg font-semibold">{room.name}</p>
                                        <p className="text-sm text-gray-600">{room.status}</p>
                                    </div>
                                    <button
                                        className="bg-[#2D3C93] text-white px-4 py-2 rounded-lg hover:bg-[#0E122D]"
                                        onClick={() => handleRuanganAction(room.id)}
                                    >
                                        Aksi
                                    </button>
                                </li>
                            ))}
                        </ul>
                    </div>
                );
            default:
                return <div className="text-xl font-bold">Pilih bagian</div>;
        }
    };

    // Fungsi untuk menangani aksi tombol pada user
    const handleUserAction = (userId) => {
        alert(`Aksi untuk pengguna dengan ID: ${userId}`);
    };
    const handleLaporanAction = (Laporanid) => {
        alert(`Aksi untuk laporan dengan ID: ${Laporanid}`);
    }
    const handleRuanganAction = (Ruanganid) => {
        alert(`Aksi untuk ruangan dengan ID: ${Ruanganid}`);
    }

    return (
        <div className="flex flex-col h-screen">
            {/* Header */}
            <div className="bg-gradient-to-r from-[#0E122D] to-[#2D3C93] text-white flex justify-between items-center px-6 py-3 shadow-md">
                <div className='left-header'>
                    <img src={logo} alt="logo-sipika" width={146}/>
                </div>
                <div className="flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                        <FontAwesomeIcon icon={faUser} style={{["color"] : "#F1F1F1"}}/>
                        <p className='text-white font-sfproreg text-[#F1F1F1]'>Agung Gede Ngurah Ananda Wirasena ( Admin )</p>
                    </div>
                    <FontAwesomeIcon icon={faBell} style={{["color"] : "#F1F1F1"}}/>
                    <FontAwesomeIcon icon={faBars} style={{["color"] : "#F1F1F1"}}/>
                </div>
            </div>
            <div className="flex h-screen">
                {/* Sidebar */}
                <div className="bg-gradient-to-r from-[#0E122D] to-[#2D3C93] text-white w-1/4 p-4">
                    <div className="flex flex-col space-y-4">
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                Tampil === "User" ? "bg-[#0E122D]" : "bg-[#2D3C93]"
                            }`}
                            onClick={() => setTampil("User")}
                        >
                            User
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                Tampil === "Laporan" ? "bg-[#0E122D]" : "bg-[#2D3C93]"
                            }`}
                            onClick={() => setTampil("Laporan")}
                        >
                            Laporan
                        </button>
                        <button
                            className={`py-2 px-4 rounded-lg ${
                                Tampil === "Ruangan" ? "bg-[#0E122D]" : "bg-[#2D3C93]"
                            }`}
                            onClick={() => setTampil("Ruangan")}
                        >
                            Ruangan
                        </button>
                    </div>
                </div>

                {/* Konten Utama */}
                <div className="flex-1 bg-gradient-to-b from-white via-[#CCE0FF] via-[#EBF3FF] to-[#C8DEFF]">
                    <div className="px-[52px] py-[116px] bg-gradient-to-br from-white via-[#CCE0FF] via-[#EBF3FF] to-[#C8DEFF]">
                        {renderContent()}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Adminpage;
