import React, { useState, useEffect } from "react";
import { Head, Link, useForm } from '@inertiajs/react';
import "@fortawesome/fontawesome-svg-core/styles.css";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faChevronDown, faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";

const CustomDropdown = ({ options, selected, setSelected, placeholder, name, error }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <div className="relative w-full">
            <div
                onClick={() => setIsOpen(!isOpen)}
                className={`cursor-pointer p-3 rounded-full bg-white/10 text-white placeholder-gray-300 border ${
                    error ? 'border-red-500' : 'border-white/40'
                } flex items-center justify-between transition-colors hover:bg-white/20`}
            >
        <span className={selected ? 'text-white' : 'text-gray-400'}>
          {selected || placeholder}
        </span>
                <FontAwesomeIcon
                    icon={faChevronDown}
                    className={`text-white transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`}
                />
            </div>
            {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
            {isOpen && (
                <div className="absolute top-12 left-0 w-full bg-white text-gray-800 rounded-xl shadow-lg border border-gray-200 z-10 overflow-hidden">
                    {options.map((option, idx) => (
                        <div
                            key={idx}
                            onClick={() => {
                                setSelected(option);
                                setIsOpen(false);
                            }}
                            className="p-3 cursor-pointer hover:bg-gray-100 transition-colors"
                        >
                            {option}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

const Register = () => {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const { data, setData, post, processing, errors, reset } = useForm({
        name: '',
        email: '',
        nim: '',
        phone: '',
        jabatan: '',
        programStudi: '',
        password: '',
        password_confirmation: '',
    });

    // Close dropdowns when clicking outside
    useEffect(() => {
        const handleClickOutside = (event) => {
            const dropdowns = document.querySelectorAll('.dropdown-content');
            dropdowns.forEach(dropdown => {
                if (!dropdown.contains(event.target)) {
                    // Close the dropdown
                }
            });
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleSubmit = (e) => {
        e.preventDefault();
        post('/register', {
            onSuccess: () => {
                // Registration successful - redirect will be handled by the server
            },
        });
    };

    const handleReset = () => {
        reset();
    };

    return (
        <div className="min-h-screen bg-[url('/images/BackgroundLogin.jpg')] bg-cover bg-center bg-no-repeat">
            <div className="min-h-screen backdrop-blur-sm bg-gradient-to-br from-[#212436]/90 to-[#2D3C93]/90 flex items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
                <div className="max-w-4xl w-full">
                    {/* Logo */}
                    <div className="mb-8 text-center">
                        <Link href="/public" className="inline-block">
                            <h1 className="text-6xl font-philosopher text-white hover:opacity-80 transition-opacity">
                                SIPIKA
                            </h1>
                        </Link>
                    </div>

                    <div className="bg-white/10 backdrop-blur-xl border border-white/40 shadow-2xl rounded-3xl p-8 sm:p-12">
                        <Head title="Register" />

                        <div className="text-center mb-8">
                            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-2">
                                Registrasi Akun
                            </h2>
                            <p className="text-gray-300 text-base">
                                Lengkapi informasi akun Anda
                            </p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                                <div>
                                    <label htmlFor="name" className="block text-white text-sm font-medium mb-2">
                                        Nama Lengkap
                                    </label>
                                    <input
                                        type="text"
                                        id="name"
                                        value={data.name}
                                        onChange={e => setData('name', e.target.value)}
                                        className="w-full p-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                                        placeholder="Masukkan nama lengkap"
                                    />
                                    {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                                </div>

                                <div>
                                    <label htmlFor="email" className="block text-white text-sm font-medium mb-2">
                                        Email
                                    </label>
                                    <input
                                        type="email"
                                        id="email"
                                        value={data.email}
                                        onChange={e => setData('email', e.target.value)}
                                        className="w-full p-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                                        placeholder="Masukkan email"
                                    />
                                    {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
                                </div>

                                <div>
                                    <label htmlFor="nim" className="block text-white text-sm font-medium mb-2">
                                        NIM/NIP
                                    </label>
                                    <input
                                        type="text"
                                        id="nim"
                                        value={data.nim}
                                        onChange={e => setData('nim', e.target.value)}
                                        className="w-full p-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                                        placeholder="Masukkan NIM/NIP"
                                    />
                                    {errors.nim && <p className="text-red-500 text-xs mt-1">{errors.nim}</p>}
                                </div>

                                <div>
                                    <label htmlFor="phone" className="block text-white text-sm font-medium mb-2">
                                        No Telepon
                                    </label>
                                    <input
                                        type="tel"
                                        id="phone"
                                        value={data.phone}
                                        onChange={e => setData('phone', e.target.value)}
                                        className="w-full p-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                                        placeholder="Masukkan nomor telepon"
                                    />
                                    {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Jabatan
                                    </label>
                                    <CustomDropdown
                                        options={["Koordinator Mata Kuliah", "Admin", "Dosen"]}
                                        selected={data.jabatan}
                                        setSelected={(value) => setData('jabatan', value)}
                                        placeholder="Pilih jabatan"
                                        error={errors.jabatan}
                                    />
                                </div>

                                <div>
                                    <label className="block text-white text-sm font-medium mb-2">
                                        Program Studi
                                    </label>
                                    <CustomDropdown
                                        options={["Informatika", "Biologi", "Matematika", "Kimia", "Fisika", "Farmasi"]}
                                        selected={data.programStudi}
                                        setSelected={(value) => setData('programStudi', value)}
                                        placeholder="Pilih program studi"
                                        error={errors.programStudi}
                                    />
                                </div>

                                <div className="relative">
                                    <label htmlFor="password" className="block text-white text-sm font-medium mb-2">
                                        Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showPassword ? "text" : "password"}
                                            id="password"
                                            value={data.password}
                                            onChange={e => setData('password', e.target.value)}
                                            className="w-full p-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                                            placeholder="Masukkan password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowPassword(!showPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                                        >
                                            <FontAwesomeIcon icon={showPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                    {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password}</p>}
                                </div>

                                <div className="relative">
                                    <label htmlFor="password_confirmation" className="block text-white text-sm font-medium mb-2">
                                        Konfirmasi Password
                                    </label>
                                    <div className="relative">
                                        <input
                                            type={showConfirmPassword ? "text" : "password"}
                                            id="password_confirmation"
                                            value={data.password_confirmation}
                                            onChange={e => setData('password_confirmation', e.target.value)}
                                            className="w-full p-3 rounded-full bg-white/10 text-white placeholder-gray-400 border border-white/40 focus:outline-none focus:border-white focus:ring-1 focus:ring-white transition-colors"
                                            placeholder="Konfirmasi password"
                                        />
                                        <button
                                            type="button"
                                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                            className="absolute right-4 top-1/2 -translate-y-1/2 text-white"
                                        >
                                            <FontAwesomeIcon icon={showConfirmPassword ? faEyeSlash : faEye} />
                                        </button>
                                    </div>
                                    {errors.password_confirmation && <p className="text-red-500 text-xs mt-1">{errors.password_confirmation}</p>}
                                </div>
                            </div>

                            <div className="flex flex-col sm:flex-row gap-4 pt-6">
                                <button
                                    type="submit"
                                    disabled={processing}
                                    className="flex-1 p-3 bg-buttonBlue text-white font-semibold rounded-full hover:bg-buttonBlueHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                >
                                    {processing ? 'Processing...' : 'Registrasi'}
                                </button>
                                <button
                                    type="button"
                                    onClick={handleReset}
                                    className="flex-1 p-3 bg-gray-500 text-white font-semibold rounded-full hover:bg-gray-600 transition-colors"
                                >
                                    Batal
                                </button>
                            </div>
                        </form>

                        <p className="mt-8 text-center text-white">
                            Sudah memiliki akun?{' '}
                            <Link
                                href="/signin"
                                className="text-blue-300 hover:text-blue-200 font-medium"
                            >
                                Login di sini
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
