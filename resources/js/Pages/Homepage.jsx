import React, {useState} from 'react';
import { Head, Link } from '@inertiajs/react';
import logo from '../../../public/images/logo.png'
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';

import Title from '@/Components/general/Title';

import lantai1 from '../../../public/images/lantai1.png'
import lantai2 from '../../../public/images/lantai2.png'
import lantai3 from '../../../public/images/lantai3.png'
import lantai4 from '../../../public/images/lantai4.png'

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {faUser, faBell, faEye} from '@fortawesome/free-regular-svg-icons'
import {faBars, faClock, faGauge, faMagnifyingGlass} from '@fortawesome/free-solid-svg-icons'

export default function Homepage() {
    const [date, setDate] = useState(new Date());
    const onChange = () => {
        setDate(date);
    }

    const dataPeminjaman = [
        {ruang: "Ruang 1.1", peminjam: "Agung Gede Ngurah Ananda Wirasena (Informatika)", waktu: "11.00 - 11.50" },
        {ruang: "Ruang 3.1", peminjam: "I Gusti Ayu Riyana Astarani (Farmasi)", waktu: "11.00 - 11.50" },
        {ruang: "Ruang 1.2", peminjam: "I Gede Abhijana (Farmasi)", waktu: "11.00 - 11.50" },
        {ruang: "Ruang 2.1", peminjam: "Akira Rian Satya (Informatika)", waktu: "11.00 - 11.50" },
        {ruang: "Ruang 3.3", peminjam: "Albert Effendi (Informatika)", waktu: "11.00 - 11.50" },
        {ruang: "Ruang 2.4", peminjam: "Asa Prameswari Karso (Informatika)", waktu: "11.00 - 11.50" },
        {ruang: "Ruang 2.2", peminjam: "I Gusti Ayu Riyani Astarani (Farmasi)", waktu: "11.00 - 11.50" },
        {ruang: "Ruang 1.4", peminjam: "Occa (Informatika)", waktu: "11.00 - 11.50" }
    ];

    return (
        <div>
            <header className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-[51px] flex justify-between'>
                <div className='left-header'>
                    <img src={logo} alt="logo-sipika" width={146} />
                </div>
                <div className='right-header flex items-center gap-4'>
                    <div className='flex items-center gap-2'>
                        <FontAwesomeIcon icon={faUser} style={{["color"] : "#F1F1F1"}}/>
                        <p className='text-white font-sfproreg text-[#F1F1F1]'>Agung Gede Ngurah Ananda Wirasena ( Mahasiswa )</p>
                    </div>
                    <FontAwesomeIcon icon={faBell} style={{["color"] : "#F1F1F1"}}/>
                    <FontAwesomeIcon icon={faBars} style={{["color"] : "#F1F1F1"}}/>
                </div>
            </header>
            <main className='px-[52px] py-[116px] bg-gradient-to-br from-white via-[#CCE0FF] via-[#EBF3FF] to-[#C8DEFF]'>
                {/* Pinjam Kelas */}
                <div>
                    {/* Judul, Deskripsi, Button Lihat Kelas */}
                    <div>
                        <Title>Pinjam Kelas</Title>
                        <p className='w-[554px] font-sfproreg py-3'>Platform peminjaman ruangan Gedung Dekanat Fakultas Matematika dan Ilmu Pengetahuan Alam, Universitas Udayana</p>
                        {/* Button Lihat Kelas */}
                        <div className='border-[2px] border-[#2D3C93] w-fit flex items-center gap-2 rounded-lg p-2.5'>
                            <FontAwesomeIcon icon={faClock} style={{["color"] : "#2D3C93"}}/>
                            <p className='text-[#2D3C93] font-sfpromed'>Lihat Kelas</p>
                        </div>
                    </div>
                    {/* Asset Gedung Dekanat */}
                    <div className='relative flex justify-center h-[842px]'>
                        <img className="absolute z-[10] focus:translate-x-[60px] duration-100" src={lantai4} alt="logo-sipika" width={580} tabindex="0"/>
                        <img className="absolute top-[300px] z-[9] focus:translate-x-[60px] duration-100" src={lantai3} alt="logo-sipika" width={580} tabindex='0' />
                        <img className="absolute top-[442px] z-[8] focus:translate-x-[60px] duration-100" src={lantai2} alt="logo-sipika" width={580} tabindex='0' />
                        <img className="absolute z-7 top-[584px] z-[7] focus:translate-x-[60px] duration-100" src={lantai1} alt="logo-sipika" width={580} tabindex='0' />
                    </div>
                    {/* Quick Book */}
                    <div className='flex justify-center mt-10 gap-3'>
                        <div className='flex bg-[#2D3C93] w-fit items-center gap-3 py-3 px-6 rounded-2xl'>
                            <FontAwesomeIcon icon={faGauge} className='fa-xl'style={{["color"] : "#FFF"}}/>
                            <p className='font-sfproreg text-white text-[24px]'>Quick Book</p>
                        </div>
                        <div className='w-fit h-100 bg-[#B6B6B6] px-6 flex items-center rounded-2xl hover:bg-green-500'>
                            <FontAwesomeIcon icon={faMagnifyingGlass} className='fa-xl'style={{["color"] : "#FFF"}}/>
                        </div>
                    </div>
                </div>
                {/* Lihat Kelas */}
                <div className='pt-[116px]'>
                    <Title>Lihat Jadwal</Title>
                    <div className='pt-[36px] flex items-center gap-5 justify-center'>
                        <Calendar onChange={onChange} value={date} id="e-calendar"></Calendar>
                        {/* Tabel Peminjaman */}
                        <div className='flex-1 bg-white p-5  rounded-xl shadow-lg ml-20 h-[350px] overflow-auto '>
							<table className='w-full table-auto table-fixed border-collapse text-center'>
                                <tr>
                                    <th className='pb-2 text-lg font-sfprobold text-[#2D3C93]'>Ruang</th>
                                    <th className='pb-2 text-lg font-sfprobold text-[#2D3C93]'>Peminjam</th>
                                    <th className='pb-2 text-lg font-sfprobold text-[#2D3C93]'>Waktu</th>
                                    <th className='pb-2 text-lg font-sfprobold text-[#2D3C93] w-14'></th>
                                </tr>
                                {dataPeminjaman.map((item)=>(
                                    <tr key={item.index} >
                                        <td className='py-2'>{item.ruang}</td>
                                        <td className='py-2'>{item.peminjam}</td>
                                        <td className='py-2'>{item.waktu}</td>
                                        <td className='py-2 text-left'><FontAwesomeIcon icon={faEye} className='fa-lg'/></td>
                                    </tr>
                                ))}
                            </table>
						</div>
                    </div>
                </div>
                {/* Review Kelas */}
                <div className='pt-[116px]'>
                    <Title>Review Kelas</Title>
                </div>
            </main>
        </div>
    );
}
