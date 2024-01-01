import { useEffect, useRef } from 'react';
 
export default function useInterval(callback: () => void) {
  const hasRun = useRef(false)
 
  useEffect(() => {
    if (!hasRun.current) {
        callback()
        hasRun.current = true
    }
  }, []);
}
