import React from "react";
// import useAudio from "../components/SoundPlayer";
import useSound from "use-sound";

import shortSound from "../assets/shortbeep.m4a";
import longSound from "../assets/longbeep.m4a";

export default function Timer(props) {
  const timerDef = props.selectedSection.timers;

  //   const timerDef = [
  //     {
  //       countDown: true,
  //       totalTime: 5,
  //       sound: true,
  //       repeat: false,
  //     },
  //     {
  //       countDown: true,
  //       totalTime: 10,
  //       sound: true,
  //       repeat: true,
  //     },
  //   ];

  //Time in seconds
  const [running, setRunning] = React.useState(false);
  const [timerIndex, setTimerIndex] = React.useState(0);
  const [selectedTimer, setSelectedTimer] = React.useState(
    timerDef[timerIndex]
  );

  const [time, setTime] = React.useState(
    selectedTimer.countDown ? selectedTimer.totalTime : 0
  );

  const [playShort] = useSound(shortSound);
  const [playLong] = useSound(longSound);

  function started() {
    console.log("STARTED");
    const newTimer = {
      isStartCount: true,
      countDown: true,
      totalTime: 5,
      sound: true,
      repeat: false,
    };
    setSelectedTimer(newTimer);
    setTime(newTimer.countDown ? newTimer.totalTime : 0);
  }

  //start timer
  function startTimer() {
    if (!running) {
      setRunning(true);
      if (selectedTimer.startCount) {
        started();
      }
    }
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

  function totalReset() {
    setRunning(false);
    setTimerIndex(0);
    let startTimer = timerDef[0];
    setSelectedTimer(startTimer);
    setTime(startTimer.countDown ? startTimer.totalTime : 0);
  }

  function timerEnded() {
    let oldIndex = timerIndex;
    if (selectedTimer.repeat) {
      console.log("TIMER ENDED, REPEATING");
      setTime(selectedTimer.countDown ? selectedTimer.totalTime : 0);
    } else if (
      oldIndex + 1 === timerDef.length &&
      !selectedTimer.isStartCount
    ) {
      console.log("TIMER ENDED, STOPPING");
      stopTimer();
    } else {
      console.log("TIMER ENDED, MOVING TO NEXT TIMER");
      let newTimer = timerDef[oldIndex + 1];

      if (selectedTimer.isStartCount) {
        //start count ended
        newTimer = timerDef[oldIndex];
        setSelectedTimer(newTimer);
        setTime(newTimer.countDown ? newTimer.totalTime : 0);
      } else {
        //Determine if we should start a countdown
        if (newTimer.startCount) {
          console.log("THIS WORKED");
          started();
          setTimerIndex(oldIndex + 1);
        } else {
          console.log("THIS DIDNT");
          setSelectedTimer(newTimer);
          setTime(newTimer.countDown ? newTimer.totalTime : 0);
        }
      }

      //Start the timer

      //   if (selectedTimer.isStartCount) {
      //     setSelectedTimer(newTimer);
      //     setTime(newTimer.countDown ? newTimer.totalTime : 0);
      //   } else if (newTimer.startCount) {
      //     started();
      //   } else {
      //     setTimerIndex(oldIndex + 1);
      //     setSelectedTimer(newTimer);
      //     setTime(newTimer.countDown ? newTimer.totalTime : 0);
      //   }
    }
  }

  const upHandler = ({ key }) => {
    if (props.selectedSection != null) {
      if (key === "ArrowUp") {
        startTimer();
      } else if (key === "ArrowDown") {
        // resetTimer();
        totalReset();
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  });

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
            if (selectedTimer.sound) {
              if (newTime > 0 && newTime <= 3) {
                console.log("Number is: ", newTime);
                playShort();
              } else if (newTime === 0) {
                playLong();
              }
            }
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
    <div className="items-center flex justify-center  p-2 w-full overflow-x-hidden mb-2">
      <h1 className="w-full text-center rounded-2xl font-timer text-8xl text-red-500 bg-gray-800 py-2 shadow-2xl">
        {selectedTimer.isStartCount ? (
          <div>{time}</div>
        ) : (
          <div>
            <span className="text-blue-400 mr-10">{timerIndex + 1}</span>
            {sec2str(time)}
          </div>
        )}
      </h1>
    </div>
  );
}
