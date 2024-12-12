import React, { useState } from "react";

const CustomDropdown = ({ options, selected, setSelected, placeholder }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative w-full">
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="cursor-pointer p-3 rounded-full bg-white/10 text-white placeholder-gray-300 border border-white/40 flex items-center justify-between"
      >
        <span>{selected || placeholder}</span>
        {/* Ikon Panah ke Bawah menggunakan SVG */}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 20 20"
          fill="currentColor"
          className="w-5 h-5 text-white"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>
      {isOpen && (
        <div className="absolute top-12 left-0 w-full bg-white text-black rounded-xl shadow-md border border-gray-300 z-10">
          {options.map((option, idx) => (
            <div
              key={idx}
              onClick={() => {
                setSelected(option);
                setIsOpen(false);
              }}
              className="p-3 cursor-pointer hover:bg-gray-200"
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const RegistrationForm = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    nim: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const [jabatan, setJabatan] = useState("");
  const [programStudi, setProgramStudi] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleReset = () => {
    setFormData({
      name: "",
      email: "",
      nim: "",
      phone: "",
      password: "",
      confirmPassword: "",
    });
    setJabatan("");
    setProgramStudi("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      alert("Password dan Konfirmasi Password tidak cocok!");
      return;
    }

    if (!jabatan || !programStudi) {
      alert("Mohon pilih Jabatan dan Program Studi!");
      return;
    }

    alert("Registrasi berhasil!");
    console.log({ ...formData, jabatan, programStudi });
  };

  return (
    <div
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#212436] to-[#2D3C93]"
    >
      <div className="max-w-4xl mx-auto bg-white/10 backdrop-blur-xl border border-white/40 shadow-md rounded-3xl p-8 relative">
        <h2 className="text-center text-white text-4xl font-bold mb-2">
          Registrasi Akun{" "}
          <span className="font-philosopher text-white">SIPIKA</span>
        </h2>
        <p className="text-center text-white text-base mb-6">
          Lengkapi informasi akun
        </p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <label htmlFor="name" className="text-white text-sm">
                Nama
              </label>
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                placeholder="Masukkan Nama"
                className="w-full mt-1 p-3 rounded-full bg-white/10 text-white placeholder-gray-300 border border-white/40 focus:outline-none focus:border-white"
                required
              />
            </div>
            <div>
              <label htmlFor="email" className="text-white text-sm">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Masukkan Email"
                className="w-full mt-1 p-3 rounded-full bg-white/10 text-white placeholder-gray-300 border border-white/40 focus:outline-none focus:border-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <label htmlFor="nim" className="text-white text-sm">
                NIM/NIP
              </label>
              <input
                type="text"
                name="nim"
                value={formData.nim}
                onChange={handleChange}
                placeholder="Masukkan NIM/NIP"
                className="w-full mt-1 p-3 rounded-full bg-white/10 text-white placeholder-gray-300 border border-white/40 focus:outline-none focus:border-white"
                required
              />
            </div>
            <div>
              <label htmlFor="phone" className="text-white text-sm">
                No Telepon
              </label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="Masukkan No Telepon"
                className="w-full mt-1 p-3 rounded-full bg-white/10 text-white placeholder-gray-300 border border-white/40 focus:outline-none focus:border-white"
                required
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <label htmlFor="jabatan" className="text-white text-sm">
                Jabatan
              </label>
              <CustomDropdown
                options={["Koordinator Mata Kuliah", "Admin", "Dosen"]}
                selected={jabatan}
                setSelected={setJabatan}
                placeholder="Pilih Jabatan"
              />
            </div>
            <div>
              <label htmlFor="program_studi" className="text-white text-sm">
                Program Studi
              </label>
              <CustomDropdown
                options={[
                  "Informatika",
                  "Biologi",
                  "Matematika",
                  "Kimia",
                  "Fisika",
                  "Farmasi",
                ]}
                selected={programStudi}
                setSelected={setProgramStudi}
                placeholder="Pilih Program Studi"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 items-start">
            <div>
              <label htmlFor="password" className="text-white text-sm">
                Password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="********"
                className="w-full mt-1 p-3 rounded-full bg-white/10 text-white placeholder-gray-300 border border-white/40 focus:outline-none focus:border-white"
                required
              />
            </div>
            <div>
              <label htmlFor="confirmPassword" className="text-white text-sm">
                Konfirmasi Password
              </label>
              <input
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="********"
                className="w-full mt-1 p-3 rounded-full bg-white/10 text-white placeholder-gray-300 border border-white/40 focus:outline-none focus:border-white"
                required
              />
            </div>
          </div>

          <div className="flex flex-col gap-4 mt-6">
            <button
              type="submit"
              className="w-full p-3 bg-white/10 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-white/30 transition"
            >
              Registrasi
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="w-full p-3 bg-white/10 text-white font-semibold rounded-full backdrop-blur-sm hover:bg-white/30 transition"
            >
              Batal
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegistrationForm;