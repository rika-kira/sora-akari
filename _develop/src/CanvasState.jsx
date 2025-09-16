import { useEffect, useRef, useState } from 'react';
import React from 'react';

function CanvasState({key},{startSeconds}){
  const [seconds, setSeconds] = useState(startSeconds);
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    if (!visible) return;

    if (seconds <= 0) {
      setVisible(false); // カウント終了 → 非表示
      return;
    }

    const timer = setInterval(() => {
      setSeconds(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer); // クリーンアップ
  }, [seconds, visible]);

  if (!visible) return null; // 非表示

  return (
    <span>
      ..{seconds} 
    </span>
  );
};

export default CanvasState;
