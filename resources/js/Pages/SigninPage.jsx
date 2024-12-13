import React, { useState } from 'react';
import { Head, useForm, Link } from '@inertiajs/react';

export default function SigninPage({ errors }) {
    const { data, setData, post, processing } = useForm({
        email: '',
        password: '',
    });

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/login');
    };

    return (
        <div
            className="relative min-h-screen bg-cover bg-center flex items-center justify-center"
            style={{
                backgroundImage:
                    "linear-gradient(to right, rgba(34, 39, 67), rgba(47, 47, 98), rgba(45, 60, 147, 0.1)), url('/images/BackgroundLogin.jpg')",
            }}
        >
            <Head title="Sign In" />

            {/* Logo */}
            <div className="absolute top-4 left-4 sm:top-6 sm:left-8">
                <h1 className="text-4xl sm:text-6xl font-philosopher text-white">SIPIKA</h1>
            </div>

            {/* Login Card */}
            <div
                className="border-white/40 border bg-glassGradient backdrop-blur-xl shadow-md rounded-3xl px-6 pt-6 pb-6 sm:px-8 sm:pt-8 sm:pb-8 w-11/12 sm:w-10/12 md:w-full max-w-md
                translate-x sm:translate-x-[-10%] md:translate-x-[-36%] xl:translate-x-[-52%]"
            >
                <form onSubmit={handleSubmit}>
                    <h2 className="text-2xl sm:text-3xl font-semibold text-center mb-2 mt-4 sm:mt-6 text-white">
                        Selamat Datang Kembali
                    </h2>
                    <p className="font-montserrat text-xs sm:text-sm text-center text-gray-300 mb-8 sm:mb-10">
                        Lengkapi informasi akun anda
                    </p>

                    {/* Email Input */}
                    <div className="mb-4 mx-2 sm:mx-4">
                        <label
                            className="block text-white font-bold font-montserrat text-xs sm:text-sm mb-1 sm:mb-2"
                            htmlFor="email"
                        >
                            Email
                        </label>
                        <input
                            className="shadow appearance-none border rounded-full bg-textBoxBlue/45 w-full py-2 px-3 text-white leading-tight focus:outline-none focus:shadow-outline font-montserrat text-sm"
                            id="email"
                            type="email"
                            value={data.email}
                            onChange={e => setData('email', e.target.value)}
                            placeholder="Enter your email"
                        />
                        {errors.email && (
                            <p className="text-red-500 text-xs italic mt-1">{errors.email}</p>
                        )}
                    </div>

                    {/* Password Input */}
                    <div className="mb-6 mx-2 sm:mx-4">
                        <label
                            className="block text-white font-bold font-montserrat text-xs sm:text-sm mb-1 sm:mb-2"
                            htmlFor="password"
                        >
                            Password
                        </label>
                        <input
                            className="shadow appearance-none border rounded-full bg-textBoxBlue/45 w-full py-2 px-3 text-white mb-3 leading-tight focus:outline-none focus:shadow-outline font-montserrat text-sm"
                            id="password"
                            type="password"
                            value={data.password}
                            onChange={e => setData('password', e.target.value)}
                            placeholder="********"
                        />

                        {/* Password Extra */}
                        <div className="flex justify-between mt-1">
                            {errors.password && (
                                <p className="text-red-500 text-xs font-montserrat italic">
                                    {errors.password}
                                </p>
                            )}
                            <a
                                className="inline-block align-baseline font-montserrat text-xs sm:text-sm text-gray-300 hover:text-white hover:font-bold"
                                href="#"
                            >
                                Lupa Password?
                            </a>
                        </div>
                    </div>

                    {/* Login Button */}
                    <div className="flex items-center justify-center mx-2 sm:mx-4">
                        <button
                            className="bg-buttonBlue hover:bg-buttonBlueHover text-white font-bold py-2 px-3 rounded-full w-full focus:outline-none focus:shadow-outline font-montserrat text-sm"
                            type="submit"
                            disabled={processing}
                        >
                            {processing ? 'Logging in...' : 'Log In'}
                        </button>
                    </div>
                </form>

                {/* Footer */}
                <p className="text-center text-white text-xs font-montserrat mt-6 mb-3">
                    Belum memiliki akun?{" "}
                    <Link
                        href="/register"
                        className="text-gray-300 hover:text-white hover:font-bold"
                    >
                        Daftar Sekarang
                    </Link>
                </p>
            </div>
        </div>
    );
}
