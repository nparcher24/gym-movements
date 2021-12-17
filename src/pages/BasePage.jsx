import React from "react";
import SectionDisplay from "../components/SectionDisplay";
import Fade from "react-reveal";
import VideoDisplay from "../components/VideoDisplay";
import LogoImage from "../assets/darklogo.png";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import Timer from "../components/Timer";

// import { useLiveQuery } from "dexie-react-hooks";

export default function BasePage(props) {
  const navigate = useNavigate();

  const [sectionIndex, setSectionIndex] = React.useState(0);

  const [selectedSection, setSelectedSection] = React.useState(
    props.selectedWorkout != null
      ? props.selectedWorkout.sections[sectionIndex]
      : null
  );

  const upHandler = ({ key }) => {
    if (props.selectedWorkout != null) {
      const max = props.selectedWorkout.sections.length;
      if (key === "ArrowRight") {
        if (sectionIndex < max - 1) {
          setSectionIndex(sectionIndex + 1);
          setSelectedSection(props.selectedWorkout.sections[sectionIndex + 1]);
        }
      } else if (key === "ArrowLeft") {
        if (sectionIndex > 0) {
          setSectionIndex(sectionIndex - 1);
          setSelectedSection(props.selectedWorkout.sections[sectionIndex - 1]);
        }
      }
    }
  };

  React.useEffect(() => {
    window.addEventListener("keyup", upHandler);

    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  });

  return (
    <div className="h-screen flex flex-col overflow-y-hidden bg-gray-200 bg-opacity-20">
      {selectedSection != null ? (
        <div className="w-full h-full absolute overflow-y-hidden ">
          <img
            src={LogoImage}
            alt="logo"
            width="6000px"
            style={{ left: "-40%", bottom: "-30%" }}
            className="absolute mx-auto opacity-10"
          />
          <ProgressBar />
        </div>
      ) : (
        <div />
      )}
      <div className="flex flex-row w-full overflow-x-hidden h-full pt-16">
        <div className="relative w-1/3 h-full flex flex-col ">
          {selectedSection != null ? (
            props.selectedWorkout.sections.map((section, index) => {
              return (
                <div key={index}>
                  <Fade>
                    {sectionIndex === index ? (
                      // <Fade className="h-full w-full">
                      <div className="absolute flex flex-col h-full w-full ">
                        <SectionDisplay
                          selectedSection={
                            props.selectedWorkout.sections[sectionIndex]
                          }
                        />
                        <Timer
                          selectedSection={
                            props.selectedWorkout.sections[sectionIndex]
                          }
                          timers={
                            props.selectedWorkout.timers != null
                              ? props.selectedWorkout.timers
                              : []
                          }
                        />
                      </div>
                    ) : (
                      // </Fade>
                      <div />
                    )}
                  </Fade>
                </div>
              );
            })
          ) : (
            <div />
          )}
        </div>

        <div className="w-2/3 flex flex-col h-full relative ">
          {selectedSection != null ? (
            props.selectedWorkout.sections.map((section, index) => {
              return (
                <div key={index}>
                  {sectionIndex === index ? (
                    <VideoDisplay
                      selectedSection={
                        props.selectedWorkout.sections[sectionIndex]
                      }
                      {...props}
                    />
                  ) : (
                    <div />
                  )}
                </div>
              );
            })
          ) : (
            <div />
          )}
        </div>
      </div>
      {props.selectedWorkout == null ? (
        <div className="w-screen h-screen absolute inset-0 flex">
          <div className="m-auto items-center flex flex-col space-y-4">
            <img src={LogoImage} alt="logo" width="500" height="500" />
            <button
              onClick={() => {
                navigate("/setup");
              }}
              className="bg-TADarkBlue px-4 py-2 rounded-md border-2 text-white text-xl transform duration-500 hover:bg-TABlue hover:border-gray-200"
            >
              SELECT WORKOUT
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => {
            navigate("/setup");
          }}
          className="absolute right-0 top-0 flex flex-col"
        >
          <img
            src={LogoImage}
            alt="logo"
            width="200"
            className="mx-auto top-0 mt-20"
          />
        </button>
      )}
    </div>
  );
}
