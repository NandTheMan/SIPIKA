import React, { useState } from 'react';

export default function Pelaporanpeminjaman() {
  const [jenisPelanggaran, setJenisPelanggaran] = useState('Kerusakan Fasilitas');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [deskripsiLaporan, setDeskripsiLaporan] = useState('');
  const [bukti, setBukti] = useState(null);
  const [isOpen, setIsOpen] = useState(true);

  const togglePopup = () => setIsOpen(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Jenis Pelanggaran:', jenisPelanggaran);
    console.log('Deskripsi Laporan:', deskripsiLaporan);
    console.log('Bukti:', bukti ? bukti.name : 'Tidak ada bukti');
    setIsOpen(false);
  };

  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 bg-black flex justify-center items-center z-50">
          {/* Container utama dengan efek kaca */}
          <div className="max-w-xl mx-auto bg-white/10 backdrop-blur-lg border border-white/30 shadow-lg rounded-3xl p-10">
            {/* Heading */}
            <h2 className="text-center text-white text-4xl font-bold mb-8">
              Pelaporan Peminjaman Ruang 1.1
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Dropdown Jenis Pelanggaran */}
              <div className="relative">
                <div
                  className="w-full p-4 rounded-3xl bg-[#58629C]/30 text-white cursor-pointer flex items-center justify-between focus:outline-none focus:ring-2 focus:ring-[#58629C]"
                  onClick={() => setDropdownOpen(!dropdownOpen)}
                >
                  {jenisPelanggaran}
                  {/* Ikon Panah Ke Bawah */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4 4a.75.75 0 01-1.06 0l-4-4a.75.75 0 01.02-1.06z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                {dropdownOpen && (
                  <div className="absolute w-full mt-2 bg-white rounded-3xl shadow-lg">
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-200 text-black rounded-t-3xl"
                      onClick={() => {
                        setJenisPelanggaran('Kerusakan Fasilitas');
                        setDropdownOpen(false);
                      }}
                    >
                      Kerusakan Fasilitas
                    </div>
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-200 text-black"
                      onClick={() => {
                        setJenisPelanggaran('Penyalahgunaan Ruangan');
                        setDropdownOpen(false);
                      }}
                    >
                      Penyalahgunaan Ruangan
                    </div>
                    <div
                      className="p-4 cursor-pointer hover:bg-gray-200 text-black rounded-b-3xl"
                      onClick={() => {
                        setJenisPelanggaran('Lainnya');
                        setDropdownOpen(false);
                      }}
                    >
                      Lainnya
                    </div>
                  </div>
                )}
              </div>

              {/* Input Deskripsi Laporan */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Deskripsi Laporan
                </label>
                <input
                  type="text"
                  value={deskripsiLaporan}
                  onChange={(e) => setDeskripsiLaporan(e.target.value)}
                  placeholder="Terdapat meja yang patah"
                  className="w-full p-4 rounded-3xl bg-[#58629C]/30 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#58629C]"
                />
              </div>

              {/* Input Unggah Bukti */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Unggah Bukti
                </label>
                <input
                  type="file"
                  onChange={(e) => setBukti(e.target.files[0])}
                  className="w-full p-4 rounded-3xl bg-[#58629C]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#58629C]"
                />
              </div>

              {/* Tombol Ajukan Banding */}
              <button
                type="submit"
                className="w-full py-3 rounded-3xl bg-[#58629C] text-white font-semibold hover:bg-opacity-90"
              >
                Batalkan Peminjaman
              </button>

              {/* Tombol Batal */}
              <button
                type="button"
                onClick={togglePopup}
                className="w-full py-3 rounded-3xl text-gray-400 bg-transparent hover:bg-[#58629C]/50 hover:text-white"
              >
                Batal
              </button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
