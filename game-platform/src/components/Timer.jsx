import { useEffect, useState } from "react";

export default function Timer({ timeLeft, setTimeLeft, gameOver }) {
  useEffect(() => {
    if (gameOver) return;

    const timer = setInterval(() => {
      setTimeLeft((t) => t - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [gameOver]);

  return <span>⏱ {timeLeft}s</span>;
}
