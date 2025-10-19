import { useEffect, useRef } from "react";
import { message } from "antd";

interface OrderNotificationProps {
  orders: any[];
}

export const OrderNotification: React.FC<OrderNotificationProps> = ({
  orders,
}) => {
  const previousOrderCountRef = useRef<number>(0);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio on mount - try multiple sound sources
  useEffect(() => {
    // Create a simple beep sound using Web Audio API as fallback
    const createBeepSound = () => {
      try {
        const audioContext = new (window.AudioContext ||
          (window as any).webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = 800;
        oscillator.type = "sine";

        gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(
          0.01,
          audioContext.currentTime + 0.5
        );

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.5);
      } catch (error) {
        console.error("Failed to create beep sound:", error);
      }
    };

    // Try to load audio file, fallback to beep
    const audio = new Audio();

    // Try multiple paths
    const soundPaths = [
      "/notification.wav",
      "/notification.mp3",
      "/public/notification.wav",
      "/sounds/notification.wav",
    ];

    let soundLoaded = false;

    const tryLoadSound = async () => {
      for (const path of soundPaths) {
        try {
          audio.src = path;
          await audio.load();
          soundLoaded = true;
          console.log(`Notification sound loaded from: ${path}`);
          break;
        } catch (error) {
          console.log(`Failed to load sound from ${path}`);
        }
      }

      if (!soundLoaded) {
        console.log("Using Web Audio API beep as fallback");
        audioRef.current = null; // Use beep instead
      } else {
        audio.volume = 0.5;
        audioRef.current = audio;
      }
    };

    tryLoadSound();

    return () => {
      if (audioRef.current) {
        audioRef.current.pause();
        audioRef.current = null;
      }
    };
  }, []);

  // Play sound when new orders arrive
  useEffect(() => {
    if (orders && orders.length > 0) {
      const currentOrderCount = orders.filter(
        (o) => o.status === "PENDING"
      ).length;

      // Play sound if new pending orders detected
      if (
        previousOrderCountRef.current > 0 &&
        currentOrderCount > previousOrderCountRef.current
      ) {
        const newOrdersCount =
          currentOrderCount - previousOrderCountRef.current;

        // Try to play audio file
        if (audioRef.current) {
          audioRef.current.play().catch((err) => {
            console.error("Failed to play notification sound:", err);
            // Fallback to beep
            playBeep();
          });
        } else {
          // Use beep sound
          playBeep();
        }

        message.info({
          content: `${newOrdersCount} new order${
            newOrdersCount > 1 ? "s" : ""
          } received! ${currentOrderCount} pending orders.`,
          style: { marginTop: "80px" },
        });
      }

      previousOrderCountRef.current = currentOrderCount;
    }
  }, [orders]);

  const playBeep = () => {
    try {
      const audioContext = new (window.AudioContext ||
        (window as any).webkitAudioContext)();
      const oscillator = audioContext.createOscillator();
      const gainNode = audioContext.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(audioContext.destination);

      oscillator.frequency.value = 800;
      oscillator.type = "sine";

      gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(
        0.01,
        audioContext.currentTime + 0.5
      );

      oscillator.start(audioContext.currentTime);
      oscillator.stop(audioContext.currentTime + 0.5);
    } catch (error) {
      console.error("Failed to play beep:", error);
    }
  };

  return null; // This component doesn't render anything
};
