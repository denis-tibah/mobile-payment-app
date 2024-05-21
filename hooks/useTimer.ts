import { useState, useEffect } from "react";

const useTimer = () => {
  const [timeoutIds, setTimeoutIds] = useState<any>({});
  const [isRunning, setIsRunning] = useState<any>({});
  const [isTimesUp, setIsTimesUp] = useState<any>({});

  // Function to start the timer
  const startTimer = (name: string, interval: number) => {
    if (!isRunning[name]) {
      setIsRunning({ ...isRunning, [name]: true });
      const id = setTimeout(() => {
        setIsRunning({ ...isRunning, [name]: false });
        setIsTimesUp({ ...isTimesUp, [name]: true });
      }, interval);
      setTimeoutIds({ ...timeoutIds, [name]: id });
    }
  };

  // Function to stop the timer
  const stopTimer = (name: string) => {
    setIsRunning({ ...isRunning, [name]: false });
    setIsTimesUp({ ...isTimesUp, [name]: false });
    if (timeoutIds[name]) {
      clearTimeout(timeoutIds[name]);
      setTimeoutIds({ ...timeoutIds, [name]: null });
    }
  };

  // Effect to clean up timers when the component unmounts
  useEffect(() => {
    return () => {
      Object.values(timeoutIds).forEach((id: any) => {
        if (id) {
          clearTimeout(id);
        }
      });
    };
  }, []);

  return { startTimer, isTimesUp, stopTimer }; // Return the startTimer, isTimesUp, and stopTimer functions
};

export default useTimer;
