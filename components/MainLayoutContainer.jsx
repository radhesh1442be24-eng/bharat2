import React from 'react';

export const MainLayoutContainer = ({ children }) => {
  return (
    <div
      className="min-h-screen bg-cover bg-center bg-fixed bg-no-repeat text-white flex flex-col antialiased selection:bg-[#087FEA] selection:text-white"
      style={{ backgroundImage: "url('/spaceship-bg.png')" }}
    >
      {/* Full Responsive Shell */}
      <div className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 flex flex-col gap-5 sm:gap-6">
        {children}
      </div>
    </div>
  );
};
