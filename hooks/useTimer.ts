import { useState, useEffect } from "react";

const useTimer = () => {
  const [timeoutIds, setTimeoutIds] = useState<Record<string, NodeJS.Timeout>>(
    {}
  );
  const [isRunning, setIsRunning] = useState<Record<string, boolean>>({});
  const [isTimesUp, setIsTimesUp] = useState<Record<string, boolean>>({});
  const [remainingTimeCountDown, setRemainingTime] = useState<
    Record<string, number>
  >({});

  // Function to start the timer
  const startTimer = (name: string, interval: number) => {
    if (!isRunning[name]) {
      //console.log(`Starting timer: ${name} for interval: ${interval}`);
      setIsRunning((prevState) => ({ ...prevState, [name]: true }));
      setIsTimesUp((prevState) => ({ ...prevState, [name]: false }));
      setRemainingTime((prevState) => ({ ...prevState, [name]: interval }));

      const intervalId = setInterval(() => {
        setRemainingTime((prevTime) => {
          const currentTime = prevTime[name] ?? interval;
          const newTime = currentTime - 1000;

          // console.log(`Timer ${name} countdown: ${newTime}`);
          if (newTime <= 0) {
            clearInterval(intervalId);
            setIsRunning((prevState) => ({ ...prevState, [name]: false }));
            setIsTimesUp((prevState) => ({ ...prevState, [name]: true }));
            return { ...prevTime, [name]: 0 }; // Ensure it doesn't go below 0
          }

          return { ...prevTime, [name]: newTime };
        });
      }, 1000);

      setTimeoutIds((prevState) => ({
        ...prevState,
        [name]: intervalId,
      }));
    }
  };

  // Function to stop the timer
  const stopTimer = (name: string) => {
    //console.log(`Stopping timer: ${name}`);
    setIsRunning((prevState) => ({ ...prevState, [name]: false }));
    setIsTimesUp((prevState) => ({ ...prevState, [name]: false }));
    setRemainingTime((prevState) => ({ ...prevState, [name]: 0 }));

    if (timeoutIds[name]) {
      clearInterval(timeoutIds[name]);
      setTimeoutIds((prevState) => {
        const newTimeoutIds = { ...prevState };
        delete newTimeoutIds[name];
        return newTimeoutIds;
      });
    }
  };

  // Effect to clean up timers when the component unmounts
  useEffect(() => {
    return () => {
      Object.values(timeoutIds).forEach((intervalId) => {
        clearInterval(intervalId);
      });
    };
  }, [timeoutIds]);

  return { startTimer, isTimesUp, stopTimer, remainingTimeCountDown };
};

export default useTimer;
