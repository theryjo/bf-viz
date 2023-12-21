import { useEffect, useRef } from 'react';
 
export default function useInterval(
    callback: () => void,
    delay: number,
    reset: symbol
) {
  const savedCallback = useRef<() => void>();
 
  // Cache the most recent callback.
  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  // Set up the interval.
  useEffect(() => {
    function tick() {
      savedCallback.current?.();
    }
    if (delay !== null) {
      const id = window.setInterval(tick, delay);
      return () => {
        window.clearInterval(id);
      }
    }
  }, [delay, reset]);
}
