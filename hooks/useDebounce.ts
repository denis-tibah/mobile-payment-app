import { useEffect, useRef } from "react";

type CallbackFunction = (...args: any[]) => void;

function useDebounce(callback: CallbackFunction, delay: number) {
  const timeoutRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (timeoutRef.current !== null) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const debouncedFunction = (...args: any[]) => {
    if (timeoutRef.current !== null) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = window.setTimeout(() => {
      callback(...args);
    }, delay);
  };

  return debouncedFunction;
}

export default useDebounce;
