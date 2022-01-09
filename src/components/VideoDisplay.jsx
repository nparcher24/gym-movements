import React from "react";
import Fade from "react-reveal";

export default function VideoDisplay(props) {
  const [playIndex, setPlayIndex] = React.useState(0);
  const [videos, setVideos] = React.useState([]);

  React.useState(() => {
    const filtered = props.selectedSection.movements.filter((movement) => {
      var exists = false;
      props.downloadedVideos.forEach((item) => {
        if (movement.videoName === item.name) {
          exists = true;
        }
      });
      return exists;
    });

    setVideos(filtered);
  }, [props.selectedSection, props.downloadedVideos]);

  setTimeout(function () {
    nextVideo();
  }, 10000);

  function nextVideo() {
    const max = Math.ceil(videos.length / 4);
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
      <div className="flex flex-wrap -mx-2 overflow-hidden justify-center pr-28 pl-5 items-center h-full ">
        {videos.map((movement, index) => {
          return props.downloadedVideos.find((obj) => {
            return obj.name === movement.videoName;
          }) != null &&
            index >= playIndex * 4 &&
            index < (playIndex + 1) * 4 ? (
            <Fade key={index}>
              <div
                style={{
                  height: "44vh",
                  // props.selectedSection.movements.length === 1
                  //   ? "80%"
                  //   : props.selectedSection.movements.length === 3
                  //   ? "42vh"
                  //   : "40vh",
                  width: "40%",
                }}
                className="mx-2 px-4 relative  overflow-hidden rounded-xl border-2 border-black bg-white shadow-xl"
              >
                <h1 className="py-2 w-full text-center font-heading tracking-wider text-4xl">
                  {movement.name.toUpperCase()}
                </h1>
                <video
                  className="w-full bg-white"
                  autoPlay
                  loop
                  muted
                  src={window.URL.createObjectURL(
                    props.downloadedVideos.find((obj) => {
                      return obj.name === movement.videoName;
                    }).data
                  )}
                />
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
