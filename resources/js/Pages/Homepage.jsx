
import React from 'react';
import { Head, Link } from '@inertiajs/react';
import LogCard from "@/Components/LoginPage/LogCard.jsx";

export default function Homepage(props) {
    return (
        <div
            className='relative min-h-screen bg-cover bg-center flex items-center justify-center'
            style={{backgroundImage: "linear-gradient(to right, rgba(34, 39, 67), rgba(39, 47, 98) , rgba(45, 60, 147, 0.7)), url('/images/BackgroundLogin.jpg')"}}
        >
            {/* Logo */}
            <div className='absolute top-6 left-8'>
                <h1 className='text-6xl font-philosopher text-white'>SIPIKA</h1>
            </div>

            {/* Login Card */}
            <div
                className='border-white/40 border bg-gradient-to-br from-white/20 from-15% via-white/5 via-35% via-white/10 via-70% to-white/25 backdrop-blur-xl shadow-md rounded-3xl px-8 pt-6 pb-8 w-full max-w-md'>
                <form>
                    <h2 className='text-3xl font-semibold text-center mb-2 mt-6 text-white'>Selamat Datang Kembali</h2>
                    <p className='font-montserrat text-sm text-center text-gray-300 mb-10'>Lengkapi informasi akun
                        anda</p>

                    {/* Email Input */}
                    <div className='mb-4 mx-4'>
                        <label className='block text-white font-bold font-montserrat text-sm mb-2'
                               htmlFor="email">Email</label>
                        <input
                            className='shadow appearance-none border rounded-full bg-textBoxBlue w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline font-montserrat'
                            id="email" type="email" placeholder="Enter your email"
                        />
                    </div>

                    {/* Password Input */}
                    <div className='mb-6 mx-4'>
                        <label className='block text-white font-bold font-montserrat text-sm mb-2'
                               htmlFor="password">Password</label>
                        <input
                            className='shadow appearance-none border rounded-full bg-textBoxBlue/90 w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline font-montserrat'
                            id="password" type="password" placeholder="********"
                        />

                        {/* Password Extra */}
                        <div className='flex justify-between mt-1'>
                            <p className='text-red-500 text-xs font-montserrat italic'>Please choose a password.</p>
                            <a
                                className='inline-block align-baseline font-montserrat text-sm text-gray-300 hover:text-white hover:font-bold'
                                href="#"
                            >
                                Lupa Password?
                            </a>
                        </div>
                    </div>

                    {/* Login Button */}
                    <div className='flex items-center justify-center mx-4'>
                        <button
                            className='bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat'
                            type="submit"
                        >
                            Log In
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <p className='text-center text-white text-xs font-montserrat mt-6 mb-3'>
                    Belum memiliki akun? <a href="#" className='text-gray-300 hover:text-white hover:font-bold'>Hubungi
                    Admin</a>
                </p>
            </div>
        </div>

    )
}
