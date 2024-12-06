
import React from 'react';
import logo from '../../../public/logo.png'
import { Head, Link } from '@inertiajs/react';

export default function Homepage(props) {
    return (
        <div>
            <header className='w-full h-fit bg-gradient-to-r from-[#0E122D] to-[#2D3C93] p-[51px] flex justify-between'>
                <div className='left-header'>
                    <img src={logo} alt="logo-sipika" width={146} />
                </div>
                <div className='right-header'>
                    <p className='text-white'>Anak Agung Gede Ngurah Ananda Wirasena ( Mahasiswa )</p>
                </div>
            </header>
        </div>
    )
}
