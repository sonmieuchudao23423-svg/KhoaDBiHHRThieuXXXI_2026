import { useEffect, useState, useRef } from 'react';
import YouTube from 'react-youtube';

interface BackgroundMusicProps {
  videoIds: string[];
}

// Hàm xáo trộn mảng (Fisher-Yates Shuffle)
const shuffleArray = (array: string[]) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

export function BackgroundMusic({ videoIds }: BackgroundMusicProps) {
  const [player, setPlayer] = useState<any>(null);
  
  // Hàng đợi các bài hát chưa phát
  const queueRef = useRef<string[]>([]);
  
  // Xáo trộn ban đầu, chọn bài đầu tiên và đưa phần còn lại vào hàng đợi
  const [currentVideoId, setCurrentVideoId] = useState(() => {
    const shuffled = shuffleArray(videoIds);
    const firstId = shuffled.shift()!; // Lấy bài đầu
    queueRef.current = shuffled; // Giữ lại phần còn lại trong hàng đợi
    return firstId;
  });

  useEffect(() => {
    console.log("🎵 Nhạc nền được bốc ngẫu nhiên là ID:", currentVideoId);
  }, [currentVideoId]);

  const onReady = (event: any) => {
    setPlayer(event.target);
  };

  const onEnd = (event: any) => {
    if (videoIds.length > 1) {
      // Nếu hàng đợi đã hết bài, ta xáo trộn lại từ đầu
      if (queueRef.current.length === 0) {
        let newShuffled;
        do {
          newShuffled = shuffleArray(videoIds);
        } while (newShuffled[0] === currentVideoId); // Đảm bảo bài đầu tiên của list mới không trùng bài vừa hát xong
        queueRef.current = newShuffled;
      }
      
      const nextId = queueRef.current.shift()!; // Rút bài tiếp theo từ hàng đợi
      
      setCurrentVideoId(nextId);
      
      // Ép YouTube tải bài mới và PHÁT NGAY LẬP TỨC 
      // (Vì người dùng đã chạm vào web từ bài 1 rồi nên trình duyệt sẽ không chặn nữa)
      event.target.loadVideoById(nextId);
    } else {
      // Nếu chỉ có 1 bài thì phát lại từ đầu
      event.target.playVideo();
    }
  };

  useEffect(() => {
    if (!player) return;

    // Hàm để thử phát nhạc khi có tương tác
    const playAudio = () => {
      // Chỉ phát nếu video chưa phát (1 = playing)
      if (player.getPlayerState() !== 1) {
        player.unMute();
        player.playVideo();
        console.log("Đã kích hoạt phát nhạc nền.");
      }
    };

    // Các sự kiện tương tác của người dùng
    const events = ['click', 'touchstart', 'scroll', 'keydown'];
    
    const handleInteraction = () => {
      playAudio();
      // Sau khi tương tác lần đầu thì xoá lắng nghe sự kiện
      events.forEach(e => document.removeEventListener(e, handleInteraction));
    };

    // Thêm lắng nghe
    events.forEach(e => document.addEventListener(e, handleInteraction, { once: true }));

    return () => {
      events.forEach(e => document.removeEventListener(e, handleInteraction));
    };
  }, [player]);

  const opts = {
    height: '1',
    width: '1',
    playerVars: {
      autoplay: 1, // Thử tự phát
      controls: 0,
      showinfo: 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1, // Ngăn iOS / Android mở video player gốc toàn màn hình
    },
  };

  return (
    <div className="fixed top-0 left-0 w-[1px] h-[1px] opacity-0 pointer-events-none -z-50 overflow-hidden">
      <YouTube 
        videoId={currentVideoId} 
        opts={opts} 
        onReady={onReady} 
        onEnd={onEnd}
      />
    </div>
  );
}
