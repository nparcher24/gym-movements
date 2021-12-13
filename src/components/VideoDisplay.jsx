import React from "react";
import Fade from "react-reveal";

export default function VideoDisplay(props) {
  const [playIndex, setPlayIndex] = React.useState(0);

  //   const [vid, setVid] = React.useState(props.allItems.find(hasName).data);

  // function hasName(localVid) {
  //   return (
  //     localVid.name === props.selectedSection.movements[playIndex].videoName
  //   );
  // }

  setTimeout(function () {
    nextVideo();
  }, 10000);

  function nextVideo() {
    const max = Math.ceil(props.selectedSection.movements.length / 4);
    const index = playIndex;
    if (index + 1 < max) {
      setPlayIndex(index + 1);
      //   setVid(props.allItems.find(hasName).data);
    } else {
      setPlayIndex(0);
      //   setVid(props.allItems.find(hasName).data);
    }
  }

  return (
    <div className="absolute inset-0">
      <div className="flex flex-wrap -mx-2 overflow-hidden justify-left pl-5 items-center h-full ">
        {props.selectedSection.movements.map((movement, index) => {
          return props.allItems.find((obj) => {
            return obj.name === movement.videoName;
          }) != null &&
            index >= playIndex * 4 &&
            index < (playIndex + 1) * 4 ? (
            <Fade key={index}>
              <div
                style={{
                  height:
                    props.selectedSection.movements.length === 1
                      ? "80%"
                      : props.selectedSection.movements.length === 3
                      ? "42vh"
                      : "40vh",
                  width:
                    props.selectedSection.movements.length === 1 ? "" : "40%",
                }}
                className="mx-2 relative pt-8 overflow-hidden rounded-xl border-2 border-black bg-white shadow-xl"
              >
                <video
                  className="w-full h-full"
                  autoPlay
                  loop
                  muted
                  src={window.URL.createObjectURL(
                    props.allItems.find((obj) => {
                      return obj.name === movement.videoName;
                    }).data
                  )}
                />
                <h1 className=" absolute py-2 top-0 w-full text-center font-heading tracking-wider text-4xl ">
                  {movement.name.toUpperCase()}
                </h1>
              </div>
            </Fade>
          ) : (
            <div key={index} />
          );
        })}
      </div>
    </div>
  );
}
