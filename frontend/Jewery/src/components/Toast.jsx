// src/components/Toast.jsx
import { useEffect, useState } from "react";

export default function Toast({ message, duration = 3000, onClose }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Fade out before closing
    const timer = setTimeout(() => setVisible(false), duration - 500);
    const closeTimer = setTimeout(() => onClose(), duration);

    return () => {
      clearTimeout(timer);
      clearTimeout(closeTimer);
    };
  }, [duration, onClose]);

  return (
    <div
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2
                  bg-[#FCE3E3] text-[#915858] font-semibold
                  px-8 py-4 rounded-2xl shadow-xl
                  transition-all duration-500
                  ${visible ? "opacity-100 scale-100" : "opacity-0 scale-90"}`}
    >
      {message}
    </div>
  );
}
