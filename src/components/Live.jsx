// components/Live.jsx
import React from 'react';

const Live = () => {
  return (
    <div className="relative w-full h-full flex items-center justify-center bg-gray-900">
      {/* Container for the phone screen background and fallback content */}
      <div className="relative w-[300px] h-[600px] overflow-hidden flex flex-col items-center justify-center">
        {/* Phone screen background image */}
        <img
          src="/phonescreen.png"
          alt="Phone Screen Background"
          className="absolute inset-0 w-full h-full object-contain pointer-events-none z-10"
        />
        
        {/* Fallback content message */}
        <div 
          className="absolute z-0 text-white text-center p-4"
          style={{
            top: '38px',
            left: '20px',
            width: '260px',
            height: '520px',
            borderRadius: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          }}
        >
          <p>
            Error: Telegram does not allow its website to be embedded.
            Please use the actual Telegram app or web client to view this.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Live;