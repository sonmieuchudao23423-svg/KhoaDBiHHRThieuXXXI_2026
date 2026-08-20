import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';

// Tạo ra các đốm lửa/đom đóm bay ngẫu nhiên
const generateEmbers = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    left: `${Math.random() * 100}%`,
    animationDuration: 6 + Math.random() * 10, // Bay từ 6-16s
    delay: Math.random() * 5,
    size: 2 + Math.random() * 4,
    opacity: 0.3 + Math.random() * 0.7,
  }));
};

export const ScoutBackground = () => {
  const [embers, setEmbers] = useState<any[]>([]);

  useEffect(() => {
    setEmbers(generateEmbers(35));
  }, []);

  return (
    <div className="absolute inset-0 w-full h-full pointer-events-none overflow-hidden bg-[#041c10]">
      
      {/* 1. Lưới Toạ độ (rất mờ) tượng trưng cho bản đồ hành quân / la bàn */}
      <div 
        className="absolute inset-0 opacity-[0.04]" 
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          backgroundSize: '40px 40px'
        }}
      />

      {/* 1.5 Watermark Chéo 2 Logo Xen Kẽ */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-0" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="watermark-pattern" x="0" y="0" width="500" height="500" patternUnits="userSpaceOnUse" patternTransform="rotate(-25)">
            {/* Hàng 1 */}
            <image href="/watermark-1.png" x="50" y="50" width="150" height="150" opacity="0.12" preserveAspectRatio="xMidYMid meet" />
            <image href="/watermark-2.png" x="300" y="50" width="150" height="150" opacity="0.12" preserveAspectRatio="xMidYMid meet" />
            {/* Hàng 2 (Đổi chỗ xen kẽ) */}
            <image href="/watermark-2.png" x="50" y="300" width="150" height="150" opacity="0.12" preserveAspectRatio="xMidYMid meet" />
            <image href="/watermark-1.png" x="300" y="300" width="150" height="150" opacity="0.12" preserveAspectRatio="xMidYMid meet" />
          </pattern>
        </defs>
        <rect x="0" y="0" width="100%" height="100%" fill="url(#watermark-pattern)" />
      </svg>

      {/* 2. Ánh lửa bập bùng (Campfire Glow) ở phía dưới đại diện cho Đêm Lửa Trại */}
      <div className="absolute -bottom-[20%] left-1/2 -translate-x-1/2 w-[80%] h-[60%] bg-orange-600/15 blur-[150px] rounded-[100%]" />
      <div className="absolute -bottom-[10%] left-1/2 -translate-x-1/2 w-[50%] h-[40%] bg-yellow-500/10 blur-[100px] rounded-[100%]" />
      
      {/* 3. Ánh sáng xuyên qua tán lá (Forest light rays) ở phía trên đỉnh đầu */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[30%] bg-emerald-400/10 blur-[120px]" />

      {/* 4. Đốm lửa tàn / Đom đóm (Embers / Fireflies) bay lên từ đống lửa */}
      {embers.map((ember) => (
        <motion.div
          key={ember.id}
          initial={{ 
            y: '100vh', 
            x: 0,
            opacity: 0 
          }}
          animate={{ 
            y: '-10vh', 
            x: [0, Math.random() * 60 - 30, Math.random() * -60 + 30, 0], // Bay lượn zíc zắc nhẹ
            opacity: [0, ember.opacity, 0] 
          }}
          transition={{
            duration: ember.animationDuration,
            delay: ember.delay,
            repeat: Infinity,
            ease: 'linear'
          }}
          className="absolute bottom-0 rounded-full bg-orange-400 shadow-[0_0_10px_#f59e0b]"
          style={{
            left: ember.left,
            width: ember.size,
            height: ember.size,
          }}
        />
      ))}
    </div>
  );
};
