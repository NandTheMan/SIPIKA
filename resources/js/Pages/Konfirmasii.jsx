import React from "react";

export default function Konfirmasi() {
  const handleConfirm = () => {
    alert("Anda telah mengonfirmasi tindakan ini!");
  };

  const handleCancel = () => {
    alert("Anda membatalkan tindakan ini!");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="bg-white/10 backdrop-blur-md rounded-xl px-12 py-8 border border-white/20 shadow-lg">
        <p className="text-center text-white text-lg font-semibold mb-8">
          Yakin untuk melanjutkan tindakan Anda?
        </p>
        <div className="flex justify-center gap-8">
          {/* Tombol "Iya" */}
          <button
            onClick={handleConfirm}
            className="w-52 py-3 bg-[#58629C] text-white font-medium rounded-full backdrop-blur-sm hover:brightness-110 transition"
          >
            Iya
          </button>

          {/* Tombol "Tidak" */}
          <button
            onClick={handleCancel}
            className="w-52 py-3 bg-transparent text-white font-medium rounded-full border border-white/20 hover:bg-[#58629C] hover:text-white transition"
          >
            Tidak
          </button>
        </div>
      </div>
    </div>
  );
}
