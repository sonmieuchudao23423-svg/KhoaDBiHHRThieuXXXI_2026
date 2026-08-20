import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { LogoCarousel } from './components/LogoCarousel';
import { ScoutBackground } from './components/ScoutBackground';
import { DVDLogoBouncer } from './components/DVDLogoBouncer';

export function App() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  // Lắng nghe sự thay đổi URL đơn giản để thay đổi hiệu ứng (cho chức năng /dvd)
  useEffect(() => {
    const handleLocationChange = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handleLocationChange);
    return () => window.removeEventListener('popstate', handleLocationChange);
  }, []);

  const isDvdEffect = currentPath === '/dvd';

  return (
    <div className="relative min-h-screen w-full flex flex-col items-center justify-center overflow-hidden bg-[#041c10] text-emerald-50 font-jakarta selection:bg-emerald-500/30">

      {/* Scout Theme Background (Campfire, Forest, Topographic) */}
      <ScoutBackground hideCampfireGlow={isDvdEffect} />

      <main className="relative z-10 flex flex-col items-center justify-center w-full max-w-7xl mx-auto px-6 py-8 space-y-6 flex-1">

        {/* Course Title Section */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="text-center space-y-4 md:space-y-5 max-w-6xl mt-4 md:mt-8 w-full px-4"
        >
          <h1 className="font-black tracking-tight leading-snug md:leading-tight text-transparent bg-clip-text bg-gradient-to-r from-yellow-100 via-yellow-400 to-yellow-600 drop-shadow-sm font-cinzel px-2 py-1">
            <span className="block whitespace-nowrap text-[min(5.5vw,4rem)]">KHÓA DỰ BỊ HHR NGÀNH THIẾU</span>
            <span className="block mt-1 md:mt-2 whitespace-nowrap text-[min(5vw,3.5rem)]">TRẦN QUỐC TOẢN XXXI</span>
          </h1>
          <div className="text-emerald-100/90 font-medium tracking-wider text-sm md:text-base pt-2 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-4">
            <span className="text-center">TP.Đà Nẵng</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden md:block"></span>
            <span className="text-center">Khu du lịch sinh thái Hà Gia</span>
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 hidden md:block"></span>
            <span className="text-center font-bold text-emerald-300">28 - 30.08.2026</span>
          </div>
        </motion.div>

        {/* 3D Loop Logo Carousel (chỉ hiện nếu KHÔNG ở trang /dvd) */}
        {!isDvdEffect && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
            className="w-full flex-1 flex items-center justify-center"
          >
            <LogoCarousel />
          </motion.div>
        )}

      </main>

      {/* Hiệu ứng DVD Logo Bouncer nảy khắp màn hình (chỉ hiện nếu ở trang /dvd) */}
      {isDvdEffect && <DVDLogoBouncer />}
    </div>
  );
}

export default App;
