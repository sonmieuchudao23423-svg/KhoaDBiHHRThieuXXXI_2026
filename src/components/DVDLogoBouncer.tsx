import { useEffect, useRef, useState } from 'react';

import { LOGOS } from '../constants/logos';

export const DVDLogoBouncer = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLImageElement>(null);
  const outerGlowRef = useRef<HTMLDivElement>(null);
  const innerGlowRef = useRef<HTMLDivElement>(null);
  
  const [currentIndex, setCurrentIndex] = useState(0);
  
  // Vận tốc và vị trí hiện tại
  const pos = useRef({ x: 50, y: 50 });
  const vel = useRef({ x: 1.2, y: 1.2 }); 

  const isDragging = useRef(false);
  const lastMousePos = useRef({ x: 0, y: 0 });

  const handlePointerDown = (e: React.PointerEvent<HTMLImageElement>) => {
    isDragging.current = true;
    lastMousePos.current = { x: e.clientX, y: e.clientY };
    
    // Ngăn hành vi drag ảnh mặc định của trình duyệt
    (e.target as HTMLImageElement).setPointerCapture(e.pointerId);

    const handlePointerMove = (moveEvent: PointerEvent) => {
      if (!isDragging.current) return;
      
      const dx = moveEvent.clientX - lastMousePos.current.x;
      const dy = moveEvent.clientY - lastMousePos.current.y;
      
      pos.current.x += dx;
      pos.current.y += dy;
      
      // Ghi nhận hướng kéo chuột (chỉ cập nhật nếu có di chuyển)
      if (Math.abs(dx) > 0 || Math.abs(dy) > 0) {
        vel.current = { x: dx, y: dy };
      }

      lastMousePos.current = { x: moveEvent.clientX, y: moveEvent.clientY };
    };

    const handlePointerUp = (upEvent: PointerEvent) => {
      isDragging.current = false;
      (upEvent.target as HTMLImageElement).releasePointerCapture(upEvent.pointerId);
      
      let speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
      const DEFAULT_SPEED = 1.2; // Tốc độ mặc định không đổi
      
      // Chuẩn hoá tốc độ về mức DEFAULT_SPEED
      if (speed > 0) {
        vel.current.x = (vel.current.x / speed) * DEFAULT_SPEED;
        vel.current.y = (vel.current.y / speed) * DEFAULT_SPEED;
      } else {
        vel.current.x = DEFAULT_SPEED;
        vel.current.y = DEFAULT_SPEED;
      }

      // Đảm bảo không có trục nào di chuyển quá chậm (góc nảy quá hẹp khiến nó trượt song song cạnh)
      // Tối thiểu mỗi trục phải chịu 40% vận tốc
      const MIN_AXIS = DEFAULT_SPEED * 0.4; 
      if (Math.abs(vel.current.x) < MIN_AXIS) vel.current.x = vel.current.x >= 0 ? MIN_AXIS : -MIN_AXIS;
      if (Math.abs(vel.current.y) < MIN_AXIS) vel.current.y = vel.current.y >= 0 ? MIN_AXIS : -MIN_AXIS;

      // Chuẩn hoá lại lần 2 để tốc độ tổng luôn luôn chính xác 1.2
      speed = Math.sqrt(vel.current.x ** 2 + vel.current.y ** 2);
      vel.current.x = (vel.current.x / speed) * DEFAULT_SPEED;
      vel.current.y = (vel.current.y / speed) * DEFAULT_SPEED;

      window.removeEventListener('pointermove', handlePointerMove);
      window.removeEventListener('pointerup', handlePointerUp);
    };

    window.addEventListener('pointermove', handlePointerMove);
    window.addEventListener('pointerup', handlePointerUp);
  };

  useEffect(() => {
    let animationFrameId: number;

    const animate = () => {
      if (!containerRef.current || !logoRef.current || !outerGlowRef.current || !innerGlowRef.current) return;

      const containerRect = containerRef.current.getBoundingClientRect();
      const logoRect = logoRef.current.getBoundingClientRect();

      if (containerRect.width < logoRect.width || containerRect.height < logoRect.height) return;

      if (!isDragging.current) {
        pos.current.x += vel.current.x;
        pos.current.y += vel.current.y;

        let hitEdge = false;

        // Xử lý chạm biên phải/trái (Chỉ nảy khi nó đang đâm vào viền)
        if (pos.current.x + logoRect.width >= containerRect.width && vel.current.x > 0) {
          pos.current.x = containerRect.width - logoRect.width;
          vel.current.x = -Math.abs(vel.current.x);
          hitEdge = true;
        } else if (pos.current.x <= 0 && vel.current.x < 0) {
          pos.current.x = 0;
          vel.current.x = Math.abs(vel.current.x);
          hitEdge = true;
        }

        // Xử lý chạm biên dưới/trên
        if (pos.current.y + logoRect.height >= containerRect.height && vel.current.y > 0) {
          pos.current.y = containerRect.height - logoRect.height;
          vel.current.y = -Math.abs(vel.current.y);
          hitEdge = true;
        } else if (pos.current.y <= 0 && vel.current.y < 0) {
          pos.current.y = 0;
          vel.current.y = Math.abs(vel.current.y);
          hitEdge = true;
        }

        if (hitEdge) {
          setCurrentIndex((prev) => (prev + 1) % LOGOS.length);
        }
      } else {
        // Khi đang kéo, chỉ chặn không cho logo văng ra khỏi màn hình (không tính là nảy)
        if (pos.current.x + logoRect.width > containerRect.width) pos.current.x = containerRect.width - logoRect.width;
        if (pos.current.x < 0) pos.current.x = 0;
        if (pos.current.y + logoRect.height > containerRect.height) pos.current.y = containerRect.height - logoRect.height;
        if (pos.current.y < 0) pos.current.y = 0;
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
        src={LOGOS[currentIndex]}
        alt="DVD Bouncing Logo"
        // Thêm pointer-events-auto và cursor-grab để có thể kéo thả
        className="absolute top-0 left-0 w-[160px] md:w-[200px] h-auto object-contain z-50 pointer-events-auto cursor-grab active:cursor-grabbing"
        style={{ willChange: 'transform', touchAction: 'none' }}
        onPointerDown={handlePointerDown}
        draggable={false} // Chống drag ảnh mặc định của HTML
      />
    </div>
  );
};
