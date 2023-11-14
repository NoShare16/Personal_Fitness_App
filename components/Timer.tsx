import React, { useState, useEffect } from "react";

const Timer = () => {
  const [selectedMinutes, setSelectedMinutes] = useState(1);
  const [timeLeft, setTimeLeft] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [timerPaused, setTimerPaused] = useState(false);

  useEffect(() => {
    let interval: any;
    if (timerActive && !timerPaused && timeLeft > 0) {
      interval = setInterval(() => {
        setTimeLeft((prevTimeLeft) => prevTimeLeft - 1);
      }, 1000);
    } else if (timeLeft === 0) {
      setTimerActive(false);
    }
    return () => clearInterval(interval);
  }, [timeLeft, timerActive, timerPaused]);

  useEffect(() => {
    // Update timeLeft when selectedMinutes changes and the timer is not active
    if (!timerActive) {
      setTimeLeft(selectedMinutes * 60);
    }
  }, [selectedMinutes, timerActive]);

  const startTimer = () => {
    setTimerActive(true);
    setTimerPaused(false);
    if (timeLeft === 0) {
      setTimeLeft(selectedMinutes * 60);
    }
  };

  const pauseTimer = () => {
    setTimerPaused(!timerPaused);
  };

  const resetTimer = () => {
    setTimerActive(false);
    setTimerPaused(false);
    setTimeLeft(selectedMinutes * 60);
  };

  const formatTime = () => {
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;
    return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
  };

  return (
    <div className="border border-solid rounded m-1">
      <div className="flex justify-around">
        <select
          value={selectedMinutes}
          onChange={(e) => setSelectedMinutes(Number(e.target.value))}
          className="bg-black"
          disabled={timerActive}
        >
          <option value="1">1 Minute</option>
          <option value="2">2 Minutes</option>
          <option value="3">3 Minutes</option>
          <option value="4">4 Minutes</option>
          <option value="5">5 Minutes</option>
        </select>
        {!timerActive ? (
          <button onClick={startTimer}>Start</button>
        ) : (
          <button onClick={pauseTimer}>
            {timerPaused ? "Resume" : "Pause"}
          </button>
        )}
        <button onClick={resetTimer} disabled={!timerActive && timeLeft === 0}>
          Reset
        </button>
      </div>
      <div className="font-semibold text-xl flex justify-center">
        {formatTime()}
      </div>
    </div>
  );
};

export default Timer;
