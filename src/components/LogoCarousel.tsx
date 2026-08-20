import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

import { LOGOS } from '../constants/logos';

export const LogoCarousel = () => {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      // Đảm bảo chỉ lặp khi trình duyệt (tab) đang được hiển thị.
      // Điều này ngăn chặn bộ đếm thời gian bị dồn ứ (desync queue) khi treo máy nhiều tiếng đồng hồ.
      if (!document.hidden) {
        setCurrentIndex((prev) => (prev + 1) % LOGOS.length);
      }
    }, 10000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full h-[300px] md:h-[350px] flex items-center justify-center overflow-visible perspective-1000">
      
      {/* Vòng sáng rực rỡ lót bên dưới */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] md:w-[500px] h-[350px] md:h-[500px] bg-emerald-500/20 blur-[80px] rounded-full pointer-events-none z-0" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[250px] md:w-[350px] h-[250px] md:h-[350px] bg-yellow-400/20 blur-[100px] rounded-full pointer-events-none z-0" />

      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ 
            opacity: 0, 
            scale: 3, // To bự ở ngoài
            x: '-100vw', // Chắc chắn nằm ngoài màn hình bên trái
            rotate: -180, // Xoay ngược
          }}
          animate={{ 
            opacity: 1, 
            scale: 1, // Nhỏ dần vừa màn hình
            x: 0, // Di chuyển vào giữa
            rotate: 0, // Dừng xoay khi ở giữa
            transition: { delay: 1, duration: 2.5, ease: "easeInOut" } // Đợi 1s sau khi logo cũ bay ra xong mới bắt đầu bay vào
          }}
          exit={{ 
            opacity: 0, 
            scale: 3, // Ra thì to dần
            x: '100vw', // Lướt ra ngoài màn hình bên phải
            rotate: 180, // Tiếp tục xoay
            transition: { duration: 2.5, ease: "easeInOut" } // Đi ra ngay lập tức
          }}
          className="absolute z-20 flex items-center justify-center"
        >
          {/* Chỉ hiển thị Logo trần, không khung viền */}
          <img
            src={LOGOS[currentIndex]}
            alt={`Logo ${currentIndex + 1}`}
            className="w-[240px] md:w-[320px] h-auto object-contain"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
};
