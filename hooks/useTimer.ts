import { useState, useEffect } from "react";

const useTimer = () => {
  const [timeoutIds, setTimeoutIds] = useState<any>({});
  const [isRunning, setIsRunning] = useState<any>({});
  const [isTimesUp, setIsTimesUp] = useState<any>({});
  const [remainingTime, setRemainingTime] = useState<any>({});

  // Function to start the timer
  const startTimer = (name: string, interval: number) => {
    /* if (!isRunning[name]) {
      setIsRunning({ ...isRunning, [name]: true });
      const id = setTimeout(() => {
        setIsRunning({ ...isRunning, [name]: false });
        setIsTimesUp({ ...isTimesUp, [name]: true });
      }, interval);
      setTimeoutIds({ ...timeoutIds, [name]: id });
    } */

    if (!isRunning[name]) {
      setIsRunning((prevState: any) => ({ ...prevState, [name]: true }));
      setIsTimesUp((prevState: any) => ({ ...prevState, [name]: false }));
      setRemainingTime((prevState: any) => ({
        ...prevState,
        [name]: interval,
      }));

      const intervalId = setInterval(() => {
        setRemainingTime((prevTime: any) => {
          const newTime = { ...prevTime, [name]: prevTime[name] - 1000 };
          if (newTime[name] <= 0) {
            clearInterval(intervalId);
            setIsRunning((prevState: any) => ({ ...prevState, [name]: false }));
            setIsTimesUp((prevState: any) => ({ ...prevState, [name]: true }));
          }
          return newTime;
        });
      }, 1000);

      const timeoutId = setTimeout(() => {
        clearInterval(intervalId);
      }, interval);

      setTimeoutIds((prevState: any) => ({
        ...prevState,
        [name]: { timeoutId, intervalId },
      }));
    }
  };

  // Function to stop the timer
  const stopTimer = (name: string) => {
    /* setIsRunning({ ...isRunning, [name]: false });
    setIsTimesUp({ ...isTimesUp, [name]: false });
    if (timeoutIds[name]) {
      clearTimeout(timeoutIds[name]);
      setTimeoutIds({ ...timeoutIds, [name]: null });
    } */

    setIsRunning((prevState: any) => ({ ...prevState, [name]: false }));
    setIsTimesUp((prevState: any) => ({ ...prevState, [name]: false }));
    setRemainingTime((prevState: any) => ({ ...prevState, [name]: null }));

    if (timeoutIds[name]) {
      clearTimeout(timeoutIds[name].timeoutId);
      clearInterval(timeoutIds[name].intervalId);
      setTimeoutIds((prevState: any) => ({ ...prevState, [name]: null }));
    }
  };

  // Effect to clean up timers when the component unmounts
  useEffect(() => {
    /* return () => {
      Object.values(timeoutIds).forEach((id: any) => {
        if (id) {
          clearTimeout(id);
        }
      });
    }; */
    return () => {
      Object.values(timeoutIds).forEach(({ timeoutId, intervalId }: any) => {
        if (timeoutId) {
          clearTimeout(timeoutId);
        }
        if (intervalId) {
          clearInterval(intervalId);
        }
      });
    };
  }, []);

  return { startTimer, isTimesUp, stopTimer, remainingTime };
  // Return the startTimer, isTimesUp, and stopTimer functions remainingTime
};

export default useTimer;
