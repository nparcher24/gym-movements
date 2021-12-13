import React from "react";

export default function ProgressBar(props) {
  const [progress, setProgress] = React.useState(0.0);
  const [running, setRunning] = React.useState(false);
  const [time, setTime] = React.useState(60 * 60);

  React.useEffect(() => {
    let interval = null;
    if (running) {
      interval = setInterval(() => {
        let oldTime = time;
        setTime(oldTime - 1);
        setProgress(1 - oldTime / 3600);
        if (oldTime - 1 <= 0) {
          setRunning(false);
        }
      }, 1000);
    } else if (!running) {
      // setTime(0);
    }
    return () => clearInterval(interval);
  }, [running, time]);

  function resetCountdown() {
    setRunning(false);
    setTime(3600);
    setProgress(0.0);
  }

  function sec2str(t) {
    var h = ("" + (Math.floor(t / 3600) % 24)).slice(-2),
      m = ("0" + (Math.floor(t / 60) % 60)).slice(-2),
      s = ("0" + (t % 60)).slice(-2);

    return (h > 0 ? h + ":" : "") + (m > 0 ? m + ":" : "00:") + s;
  }

  const upHandler = ({ key }) => {
    if (key === "r") {
      resetCountdown();
    } else if (key === "s") {
      setRunning(true);
    }
  };

  React.useEffect(() => {
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  });

  return (
    <div className="flex flex-row w-full pt-6 px-4">
      <div className="relative shadow-lg overflow-hidden w-full h-8 mb-4 rounded-full text-xs flex bg-gray-200 border-2 border-gray-800">
        <div className="w-1/6 bg-white inline">
          <h1 className="h-full text-center text-black font-heading text-2xl justify-center align-middle">
            {sec2str(time > 50 * 60 ? time - 50 * 60 : 0)}
          </h1>
        </div>
        <div className="w-2/3 bg-TARed inline">
          <h1 className="h-full text-center text-white font-heading text-2xl justify-center align-middle">
            {sec2str(
              time > 50 * 60
                ? 40 * 60
                : time <= 50 * 60 && time > 10 * 60
                ? time - 10 * 60
                : 0
            )}
          </h1>
        </div>
        <div className="w-1/6 bg-TABlue inline">
          <h1 className="h-full text-center text-black font-heading text-2xl justify-center align-middle">
            {sec2str(time >= 10 * 60 ? 10 * 60 : time)}
          </h1>
        </div>
        <div
          style={{
            width: `${(1 - progress) * 100}%`,
            backgroundColor: `${
              progress <= 10 / 60
                ? "#E1E1E1"
                : progress >= 50 / 60
                ? "#304890"
                : "#AB0000"
            }`,
          }}
          className="absolute right-0 top-0 h-full shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center border-l-8 border-black opacity-60"
        />
      </div>
      <h1 className="h-full text-center text-black font-heading text-2xl w-24 justify-center align-middle pt-1 pl-6">
        {sec2str(time)}
      </h1>
    </div>
  );
}
