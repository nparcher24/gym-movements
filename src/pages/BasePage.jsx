import React from "react";
import SectionDisplay from "../components/SectionDisplay";
import Fade from "react-reveal";
import VideoDisplay from "../components/VideoDisplay";
import LogoImage from "../assets/darklogo.png";
import { useNavigate } from "react-router-dom";
import ProgressBar from "../components/ProgressBar";
import Timer from "../components/Timer";
import SummaryPage from "./SummaryPage";

export default function BasePage(props) {
  const navigate = useNavigate();

  const [sectionIndex, setSectionIndex] = React.useState(-1);
  const [isStarted, setIsStarted] = React.useState(false);
  const [showSummary, setShowSummary] = React.useState(true);

  const upHandler = ({ key }) => {
    if (props.selectedWorkout != null) {
      const max = props.selectedWorkout.sections.length;

      if (key === ".") {
        if (sectionIndex < max - 1) {
          setSectionIndex(sectionIndex + 1);
          if (sectionIndex + 1 > -1) {
            setShowSummary(false);
          }
        }
      } else if (key === ",") {
        if (sectionIndex > -1) {
          setSectionIndex(sectionIndex - 1);
          if (sectionIndex - 1 === -1) {
            setShowSummary(true);
          }
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
      {showSummary ? (
        <SummaryPage selectedWorkout={props.selectedWorkout} />
      ) : (
        <div />
      )}

      {(props.selectedWorkout != null
        ? props.selectedWorkout.sections[sectionIndex]
        : null) != null ? (
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
      <div className="flex flex-row w-full overflow-x-hidden h-full pt-16 ">
        <div className="relative w-1/3 h-full flex flex-col">
          {(props.selectedWorkout != null
            ? props.selectedWorkout.sections[sectionIndex]
            : null) != null ? (
            props.selectedWorkout.sections.map((section, index) => {
              return (
                <Fade key={index}>
                  {sectionIndex === index ? (
                    <SectionDisplay
                      selectedSection={
                        props.selectedWorkout.sections[sectionIndex]
                      }
                    />
                  ) : (
                    <div />
                  )}
                </Fade>
              );
            })
          ) : (
            <div />
          )}

          {props.selectedWorkout != null && !showSummary ? (
            <Timer
              timers={
                props.selectedWorkout.timers != null
                  ? props.selectedWorkout.timers
                  : []
              }
            />
          ) : (
            <div />
          )}
        </div>

        <div className="w-2/3 flex flex-col h-full relative ">
          {(props.selectedWorkout != null
            ? props.selectedWorkout.sections[sectionIndex]
            : null) != null ? (
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
      ) : !showSummary ? (
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
      ) : (
        <div />
      )}
    </div>
  );
}
