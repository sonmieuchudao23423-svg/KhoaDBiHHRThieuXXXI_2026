import { useEffect, useRef, useState } from 'react';

const images = [
  '/logo-1.png',
  '/logo-2.png',
  '/logo-3.png'
];

export const DVDLogoBouncer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const outerGlowRef = useRef<HTMLDivElement>(null);
  const innerGlowRef = useRef<HTMLDivElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Vận tốc (Chậm lại) và vị trí hiện tại
  const pos = useRef({ x: 50, y: 50 });
  const vel = useRef({ x: 1.2, y: 1.2 }); // Giảm tốc độ di chuyển

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!containerRef.current || !logoRef.current || !outerGlowRef.current || !innerGlowRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const logoRect = logoRef.current.getBoundingClientRect();

      if (containerRect.width < logoRect.width || containerRect.height < logoRect.height) return;

      pos.current.x += vel.current.x;
      pos.current.y += vel.current.y;

      let hitEdge = false;

      // Xử lý chạm biên phải/trái
      if (pos.current.x + logoRect.width >= containerRect.width) {
        pos.current.x = containerRect.width - logoRect.width;
        vel.current.x = -Math.abs(vel.current.x);
        hitEdge = true;
      } else if (pos.current.x <= 0) {
        pos.current.x = 0;
        vel.current.x = Math.abs(vel.current.x);
        hitEdge = true;
      }

      // Xử lý chạm biên dưới/trên
      if (pos.current.y + logoRect.height >= containerRect.height) {
        pos.current.y = containerRect.height - logoRect.height;
        vel.current.y = -Math.abs(vel.current.y);
        hitEdge = true;
      } else if (pos.current.y <= 0) {
        pos.current.y = 0;
        vel.current.y = Math.abs(vel.current.y);
        hitEdge = true;
      }

      if (hitEdge) {
        setCurrentIndex((prev) => (prev + 1) % images.length);
      }

      // Vị trí trung tâm của logo để đặt vệt sáng
      const centerX = pos.current.x + logoRect.width / 2;
      const centerY = pos.current.y + logoRect.height / 2;

      // Di chuyển Logo
      logoRef.current.style.transform = `translate3d(${pos.current.x}px, ${pos.current.y}px, 0)`;
      
      // Di chuyển các vệt sáng hào quang
      outerGlowRef.current.style.transform = `translate3d(${centerX - 250}px, ${centerY - 250}px, 0)`;
      innerGlowRef.current.style.transform = `translate3d(${centerX - 125}px, ${centerY - 125}px, 0)`;

      animationFrameId = requestAnimationFrame(animate);
    };

    animationFrameId = requestAnimationFrame(animate);

    return () => cancelAnimationFrame(animationFrameId);
  }, []);

  return (
    // Xoá z-index ở container wrapper để phân rã lớp layer cho phần tử con
    <div ref={containerRef} className="absolute inset-0 w-full h-screen overflow-hidden pointer-events-none">
      
      {/* Outer Aura (Hào quang toả rộng) - z-0 để chìm DƯỚI chữ */}
      <div
        ref={outerGlowRef}
        className="absolute top-0 left-0 w-[500px] h-[500px] rounded-full bg-emerald-500/20 blur-[120px] mix-blend-screen z-0"
        style={{ willChange: 'transform' }}
      />
      
      {/* Inner Aura (Ánh sáng cốt lõi rực rỡ) - z-0 để chìm DƯỚI chữ */}
      <div
        ref={innerGlowRef}
        className="absolute top-0 left-0 w-[250px] h-[250px] rounded-full bg-yellow-400/40 blur-[60px] mix-blend-screen z-0"
        style={{ willChange: 'transform' }}
      />

      {/* Logo chính - z-50 để nổi TRÊN bề mặt chữ */}
      <img
        ref={logoRef}
        src={images[currentIndex]}
        alt="DVD Bouncing Logo"
        // Kích thước to hơn theo yêu cầu
        className="absolute top-0 left-0 w-[160px] md:w-[200px] h-auto object-contain drop-shadow-[0_0_40px_rgba(0,0,0,0.8)] z-50"
        style={{ willChange: 'transform' }}
      />
    </div>
  );
};
