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
        { ruang: "Ruang 1.1", peminjam: "A - Informatika 23", waktu: "11.00 - 11.50" },
        { ruang: "Ruang 1.1", peminjam: "A - Informatika 23", waktu: "11.00 - 11.50" },
        { ruang: "Ruang 1.1", peminjam: "A - Informatika 23", waktu: "11.00 - 11.50" },
        { ruang: "Ruang 1.1", peminjam: "A - Informatika 23", waktu: "11.00 - 11.50" },
        { ruang: "Ruang 1.1", peminjam: "A - Informatika 23", waktu: "11.00 - 11.50" },
        { ruang: "Ruang 1.1", peminjam: "A - Informatika 23", waktu: "11.00 - 11.50" }
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
                <div className='pt-[116px]'>
                    <Title>Lihat Jadwal</Title>
                    <div className='py-3 flex items-center gap-5'>
                        <Calendar onChange={onChange} value={date} id="e-calendar"></Calendar>
                        <div className='w-fit bg-white p-5 flex-1'>
							<table>
                                <tr>
                                    <th>Ruang</th>
                                    <th>Peminjam</th>
                                    <th>Waktu</th>
                                    <th></th>
                                </tr>
                                {dataPeminjaman.map((item)=>(
                                    <tr className='grid '>
                                        <td>{item.ruang}</td>
                                        <td>{item.peminjam}</td>
                                        <td>{item.waktu}</td>
                                        <td><FontAwesomeIcon icon={faEye}/></td>
                                    </tr>
                                ))}
                            </table>
						</div>
                    </div>
                </div>
            </main>
        </div>
    )
}
