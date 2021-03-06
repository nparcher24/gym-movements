import React from "react";
// import useAudio from "../components/SoundPlayer";
import useSound from "use-sound";

import shortSound from "../assets/shortbeep.m4a";
import longSound from "../assets/longbeep.m4a";

export default function Timer(props) {
  // const timerDef = [
  //   {
  //     countDown: true,
  //     totalTime: 5,
  //     sound: true,
  //     repeat: false,
  //   },
  //   {
  //     countDown: true,
  //     totalTime: 10,
  //     sound: true,
  //     repeat: true,
  //   },
  // ];

  //Time in seconds
  const [running, setRunning] = React.useState(false);
  const [timerIndex, setTimerIndex] = React.useState(0);
  const [selectedTimer, setSelectedTimer] = React.useState(
    props.timers[timerIndex]
  );

  const [time, setTime] = React.useState(
    selectedTimer?.countDown ? selectedTimer?.totalTime : 0
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
    console.log("adlkfjalksdjf");
    if (!running) {
      setRunning(true);
      if (selectedTimer?.startCount) {
        started();
      }
    }
  }

  //timer end
  function stopTimer() {
    setRunning(false);
  }

  // function resetTimer() {
  //   if (!selectedTimer.repeat) {
  //     setRunning(false);
  //   }

  //   setTime(selectedTimer.countDown ? selectedTimer.totalTime : 0);
  // }

  function resetAll() {
    setRunning(false);
    setTimerIndex(0);
    let startTimer = props.timers[0];
    setSelectedTimer(startTimer);
    setTime(startTimer.countDown ? startTimer.totalTime : 0);
  }

  function resetCurrent() {
    setRunning(false);
    // setTimerIndex(0);
    let startTimer = props.timers[timerIndex];
    setSelectedTimer(startTimer);
    setTime(startTimer.countDown ? startTimer.totalTime : 0);
  }

  function nextTimer() {
    console.log(timerIndex);
    if (timerIndex < props.timers.length - 1) {
      setRunning(false);
      let newIndex = timerIndex + 1;
      let newTimer = props.timers[newIndex];
      setSelectedTimer(newTimer);
      setTime(newTimer.countDown ? newTimer.totalTime : 0);
      setTimerIndex(newIndex);
    }
  }

  function prevTimer() {
    if (timerIndex > 0) {
      setRunning(false);
      let newIndex = timerIndex - 1;
      let newTimer = props.timers[newIndex];
      setSelectedTimer(newTimer);
      setTime(newTimer.countDown ? newTimer.totalTime : 0);
      setTimerIndex(newIndex);
    }
  }

  function timerEnded() {
    let oldIndex = timerIndex;
    if (oldIndex + 1 === props.timers.length && !selectedTimer?.isStartCount) {
      console.log("TIMER ENDED, STOPPING");
      setTime(0);
      stopTimer();
    } else {
      console.log("TIMER ENDED, MOVING TO NEXT TIMER");
      var newTimer = props.timers[oldIndex];

      if (selectedTimer?.isStartCount) {
        //start count ended
        console.log("Start Count Ended");
        // newTimer = props.timers[oldIndex];
        setSelectedTimer(newTimer);
        setTime(newTimer.countDown ? newTimer.totalTime : 0);
      } else {
        //Determine if we should start a countdown

        newTimer = props.timers[oldIndex + 1];
        if (!newTimer.autoStart) {
          console.log("Not Autostart");
          setRunning(false);
          // newTimer = props.timers[oldIndex + 1];
          setSelectedTimer(newTimer);
          setTime(newTimer.countDown ? newTimer.totalTime : 0);
          setTimerIndex(oldIndex + 1);
        } else if (newTimer.startCount) {
          console.log("Starting Start Count");
          started();
          setTimerIndex(oldIndex + 1);
        } else {
          console.log("THIS DIDNT");
          setSelectedTimer(newTimer);
          setTimerIndex(oldIndex + 1);
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
    if (key === "ArrowUp") {
      startTimer();
    } else if (key === "ArrowDown") {
      // resetTimer();
      resetCurrent();
    } else if (key === "ArrowLeft") {
      prevTimer();
    } else if (key === "ArrowRight") {
      nextTimer();
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
        let newTime = selectedTimer?.countDown ? oldTime - 1 : oldTime + 1;

        if (selectedTimer?.totalTime != null) {
          if (selectedTimer?.countDown && newTime <= 0) {
            // console.log("TIMER ENDED");
            if (selectedTimer.sound) {
              playLong();
            }
            timerEnded();
          } else if (
            !selectedTimer?.countDown &&
            newTime === selectedTimer.totalTime + 1
          ) {
            // console.log("TIMER ENDED");
            timerEnded();
          } else {
            if (selectedTimer?.sound) {
              if (newTime > 0 && newTime <= 3) {
                // console.log("Number is: ", newTime);
                playShort();
              }
              // else if (newTime === 0) {
              //   playLong();
              // }
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
    <div className="absolute bottom-0 items-center flex justify-center p-2 w-full overflow-x-hidden mb-2 ">
      <h1 className="w-full text-center rounded-2xl font-timer text-8xl text-red-500 bg-gray-800 py-2 shadow-2xl">
        {selectedTimer?.isStartCount ? (
          <div>{time}</div>
        ) : (
          <div>
            {selectedTimer?.showNumber ? (
              <span className="text-blue-400 mr-10">
                {selectedTimer?.number}
              </span>
            ) : (
              <div />
            )}
            {sec2str(time)}
          </div>
        )}
      </h1>
    </div>
  );
}
