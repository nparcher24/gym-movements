import React from "react";
import Swoop from "../assets/swoop.svg";
import Timer from "./Timer";

export default function SectionDisplay(props) {
  return (
    <div className="h-screen flex flex-col overflow-y-hidden relative justify-between">
      <div className="h-full relative flex flex-col justify-evenly inset-0 py-4 pl-4 ">
        <img
          className="absolute h-screen w-full opacity-10 object-left"
          src={Swoop}
          alt="104010 Swoosh"
        />
        <div className="ml-4">
          <h1 className="text-5xl font-heading tracking-widest">
            {props.selectedSection.name.toUpperCase()}
          </h1>
          <h1 className="text-xl font-subHeading -mt-2">
            {props.selectedSection.duration}
          </h1>
        </div>
        {/* <div className="absolute mt-24 flex flex-col"> */}
        {props.selectedSection.movements.map((movement, index) => {
          return (
            <div key={index} className="ml-4">
              <div>
                <h1
                  className={`${
                    props.selectedSection.movements.length > 8
                      ? "text-xl"
                      : "text-3xl"
                  } font-subHeading inline`}
                >
                  {index + 1 + "  -  "}
                </h1>

                <h1
                  className={`${
                    props.selectedSection.movements.length > 8
                      ? "text-xl"
                      : "text-3xl"
                  } font-subHeading inline`}
                >
                  {movement.name.toUpperCase()}
                </h1>
              </div>
              <h2
                className={`${
                  props.selectedSection.movements.length > 8
                    ? "text-md"
                    : "text-lg"
                } font-body ml-6`}
              >
                {movement.duration}
              </h2>
              <h2
                className={`${
                  props.selectedSection.movements.length > 8
                    ? "text-md"
                    : "text-lg"
                } font-body ml-6`}
              >
                {movement.equipment}
              </h2>
            </div>
          );
        })}
        {/* </div> */}
      </div>
      <Timer selectedSection={props.selectedSection} />
    </div>
  );
}
