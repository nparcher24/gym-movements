import React from "react";

export default function Temp(props) {
  const timerDef = [
    {
      countDown: true,
      totalTime: 5,
      sound: true,
      repeat: false,
    },
    {
      countDown: true,
      totalTime: 10,
      sound: true,
      repeat: true,
    },
  ];
  //Time in seconds
  const [running, setRunning] = React.useState(false);
  const [timerIndex, setTimerIndex] = React.useState(0);
  const [selectedTimer, setSelectedTimer] = React.useState(
    timerDef[timerIndex]
  );
  const [time, setTime] = React.useState(
    selectedTimer.countDown ? selectedTimer.totalTime : 0
  );

  //start timer
  function startTimer() {
    setRunning(true);
  }

  //timer end
  function stopTimer() {
    setRunning(false);
  }

  function resetTimer() {
    if (!selectedTimer.repeat) {
      setRunning(false);
    }

    setTime(selectedTimer.countDown ? selectedTimer.totalTime : 0);
  }

  function timerEnded() {
    let oldIndex = timerIndex;
    if (selectedTimer.repeat) {
      console.log("TIMER ENDED, REPEATING");
      setTime(selectedTimer.countDown ? selectedTimer.totalTime : 0);
    } else if (oldIndex + 1 === timerDef.length) {
      console.log("TIMER ENDED, STOPPING");
      stopTimer();
    } else {
      console.log("TIMER ENDED, MOVING TO NEXT TIMER");
      setTimerIndex(oldIndex + 1);
      let newTimer = timerDef[oldIndex + 1];
      setSelectedTimer(newTimer);
      console.log(newTimer);
      setTime(newTimer.countDown ? newTimer.totalTime : 0);
      console.log("NEW TIME", time);
    }
  }

  React.useEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => {
        let oldTime = time;
        let newTime = selectedTimer.countDown ? oldTime - 1 : oldTime + 1;

        if (selectedTimer.totalTime != null) {
          if (selectedTimer.countDown && newTime < 0) {
            console.log("TIMER ENDED");
            timerEnded();
          } else if (
            !selectedTimer.countDown &&
            newTime === selectedTimer.totalTime + 1
          ) {
            console.log("TIMER ENDED");
            timerEnded();
          } else {
            setTime(newTime);
          }
        }
      }, 1000);
    } else if (!running) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [running, time, selectedTimer]);

  function sec2str(t) {
    var h = ("0" + (Math.floor(t / 3600) % 24)).slice(-2),
      m = ("0" + (Math.floor(t / 60) % 60)).slice(-2),
      s = ("0" + (t % 60)).slice(-2);

    return (h > 0 ? h + ":" : "") + (m > 0 ? m + ":" : "00:") + s;
  }

  return (
    <div className="w-screen h-screen overflow-hidden bg-blue-500 items-center justify-center flex flex-col space-y-6">
      <h1 className="font-timer text-8xl text-red-600 bg-black p-4">
        {sec2str(time)}
      </h1>
      {!running ? (
        <button
          className="p-4 bg-green-500 text-white rounded-md border-2 border-gray-200"
          onClick={() => {
            startTimer();
          }}
        >
          Start Timer
        </button>
      ) : (
        <button
          className="p-4 bg-red-500 text-white rounded-md border-2 border-gray-200"
          onClick={() => {
            stopTimer();
          }}
        >
          Stop Timer
        </button>
      )}
      <button
        className="p-4 bg-gray-500 text-white rounded-md border-2 border-gray-200"
        onClick={() => {
          resetTimer();
        }}
      >
        Reset Timer
      </button>
    </div>
  );
}
