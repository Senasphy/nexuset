import React from "react";

const AnimatedBackground = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-gradient-to-b from-sky-400 to-blue-100">
      {/* Clouds */}
      <div className="absolute top-1/4 left-[-200px] w-40 h-24 bg-cloud bg-cover opacity-80 animate-cloud1"></div>
      <div className="absolute top-1/2 left-[-300px] w-48 h-28 bg-cloud bg-cover opacity-80 animate-cloud2"></div>
      <div className="absolute top-3/4 left-[-400px] w-32 h-20 bg-cloud bg-cover opacity-80 animate-cloud3"></div>

      {/* Stars */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="w-full h-full bg-stars animate-twinkle"></div>
      </div>
    </div>
  );
};  

export default AnimatedBackground;
