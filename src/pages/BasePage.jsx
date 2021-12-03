import React from "react";
import SectionDisplay from "../components/SectionDisplay";
import Fade from "react-reveal";
import VideoDisplay from "../components/VideoDisplay";
import LogoImage from "../assets/darklogo.png";
import { useNavigate } from "react-router-dom";

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
    <div>
      <div className="flex flex-row w-screen overflow-x-hidden">
        <div className="relative w-1/3 h-screen flex flex-col ">
          {selectedSection != null ? (
            props.selectedWorkout.sections.map((section, index) => {
              return (
                <div key={index}>
                  {sectionIndex === index ? (
                    <Fade>
                      <SectionDisplay
                        selectedSection={
                          props.selectedWorkout.sections[sectionIndex]
                        }
                      />
                    </Fade>
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

        <div className="w-2/3 h-screen flex flex-col">
          {selectedSection != null ? (
            props.selectedWorkout.sections.map((section, index) => {
              return (
                <div key={index} className="w-full h-full ">
                  {sectionIndex === index ? (
                    <Fade>
                      <VideoDisplay
                        selectedSection={
                          props.selectedWorkout.sections[sectionIndex]
                        }
                        {...props}
                      />
                    </Fade>
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
            className="mx-auto top-0 mt-10"
          />
        </button>
      )}
    </div>
  );
}
