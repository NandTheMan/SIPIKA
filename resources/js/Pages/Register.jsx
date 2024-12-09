import { useState } from 'react';

export default function Register() {
    const [data, setData] = useState({
        name: '',
        email: '',
        nim_nip: '',
        phone: '',
        position: '',
        program: '',
        password: '',
        password_confirmation: '',
    });

    const [errors, setErrors] = useState({});
    const [processing, setProcessing] = useState(false);

    // Fungsi untuk meng-handle perubahan pada input field
    const handleChange = (e) => {
        setData({
            ...data,
            [e.target.name]: e.target.value,
        });
    };

    // Fungsi untuk menangani submit form
    const handleSubmit = (e) => {
        e.preventDefault();

        // Menyaring error jika ada
        const newErrors = {};

        if (!data.name) newErrors.name = 'Nama harus diisi';
        if (!data.email) newErrors.email = 'Email harus diisi';
        if (!data.password) newErrors.password = 'Password harus diisi';
        if (data.password !== data.password_confirmation) newErrors.password_confirmation = 'Password tidak cocok';

        setErrors(newErrors);

        // Jika tidak ada error, tampilkan success message
        if (Object.keys(newErrors).length === 0) {
            alert('Form berhasil disubmit!');
        }
    };

    return (
        <div className="max-w-lg mx-auto p-6 bg-white shadow-md rounded-lg">
            <h1 className="text-2xl font-bold text-center mb-4">Registrasi Akun SIPIKA</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="name" className="block text-sm font-medium">Nama</label>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={data.name}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.name && <p className="text-red-500 text-sm">{errors.name}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium">Email</label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={data.email}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="nim_nip" className="block text-sm font-medium">NIM/NIP</label>
                    <input
                        type="text"
                        id="nim_nip"
                        name="nim_nip"
                        value={data.nim_nip}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="phone" className="block text-sm font-medium">No Telepon</label>
                    <input
                        type="text"
                        id="phone"
                        name="phone"
                        value={data.phone}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="position" className="block text-sm font-medium">Jabatan</label>
                    <select
                        id="position"
                        name="position"
                        value={data.position}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Pilih Jabatan</option>
                        <option value="Koordinator Mata Kuliah">Koordinator Mata Kuliah</option>
                        <option value="Dosen">Dosen</option>
                        <option value="Mahasiswa">Mahasiswa</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="program" className="block text-sm font-medium">Program Studi</label>
                    <select
                        id="program"
                        name="program"
                        value={data.program}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                    >
                        <option value="">Pilih Program Studi</option>
                        <option value="Informatika">Informatika</option>
                        <option value="Sistem Informasi">Sistem Informasi</option>
                        <option value="Teknik Elektro">Teknik Elektro</option>
                    </select>
                </div>

                <div className="mb-4">
                    <label htmlFor="password" className="block text-sm font-medium">Password</label>
                    <input
                        type="password"
                        id="password"
                        name="password"
                        value={data.password}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>

                <div className="mb-4">
                    <label htmlFor="password_confirmation" className="block text-sm font-medium">Konfirmasi Password</label>
                    <input
                        type="password"
                        id="password_confirmation"
                        name="password_confirmation"
                        value={data.password_confirmation}
                        onChange={handleChange}
                        className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded"
                    />
                    {errors.password_confirmation && <p className="text-red-500 text-sm">{errors.password_confirmation}</p>}
                </div>

                <div className="flex items-center justify-between">
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                        disabled={processing}
                    >
                        {processing ? 'Memproses...' : 'Registrasi'}
                    </button>
                </div>
            </form>
        </div>
    );
}