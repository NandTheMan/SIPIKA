import React, { useState } from 'react';

export default function Laporanditerima() {
  const [jenisPelanggaran, setJenisPelanggaran] = useState('');
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
          {/* Container utama dengan efek kaca (Lebih halus blur) */}
          <div className="max-w-xl w-full mx-auto bg-white/20 backdrop-blur-md border border-white/40 shadow-lg rounded-3xl p-8">
            {/* Heading */}
            <h2 className="text-center text-white text-3xl font-bold mb-6">
              Laporan Diterima
            </h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Input Jenis Pelanggaran */}
              <div>
                <label className="block text-sm font-medium mb-2 text-white">
                  Jenis Pelanggaran
                </label>
                <input
                  type="text"
                  value={jenisPelanggaran}
                  onChange={(e) => setJenisPelanggaran(e.target.value)}
                  placeholder="Kerusakan Fasilitas"
                  className="w-full p-3 rounded-3xl bg-[#58629C]/30 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#58629C]"
                />
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
                  className="w-full p-3 rounded-3xl bg-[#58629C]/30 text-white placeholder:text-white focus:outline-none focus:ring-2 focus:ring-[#58629C]"
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
                  className="w-full p-3 rounded-3xl bg-[#58629C]/30 text-white focus:outline-none focus:ring-2 focus:ring-[#58629C]"
                />
              </div>

              {/* Tombol Ajukan Banding */}
              <button
                type="submit"
                className="w-full py-3 rounded-3xl bg-[#58629C] text-white font-semibold hover:bg-opacity-90"
              >
                Ajukan Banding
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
