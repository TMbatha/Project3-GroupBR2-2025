import React from "react";

export default function PaymentCompleteScreen() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-black">
      <div className="w-[360px] rounded-lg bg-[#D1C9C6] p-4 shadow-lg">
        {/* Header */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-center flex-1 font-bold text-white text-lg">
            PAYMENT
          </h1>
          <div className="w-6 h-6 rounded-full bg-white flex items-center justify-center text-red-500 text-xs font-bold">
            ●
          </div>
        </div>

        {/* Dots */}
        <div className="flex justify-center gap-1 mb-12">
          <span className="w-2 h-2 rounded-full bg-black"></span>
          <span className="w-2 h-2 rounded-full bg-black"></span>
          <span className="w-2 h-2 rounded-full bg-black"></span>
        </div>

        {/* Payment Complete Box */}
        <div className="bg-white rounded-2xl p-6 shadow-md mb-12 flex flex-col items-center">
          <div className="bg-pink-300 text-white rounded-full px-6 py-4 flex flex-col items-center justify-center">
            <span className="font-semibold">PAYMENT COMPLETE</span>
            <span className="text-2xl mt-2">✔</span>
          </div>
        </div>

        {/* Done Button */}
        <button className="w-full py-3 rounded-full bg-pink-200 text-white font-semibold hover:bg-pink-300 transition">
          DONE
        </button>
      </div>
    </div>
  );
}
