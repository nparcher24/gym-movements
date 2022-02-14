import React from "react";
// import Swoop from "../assets/swoop.svg";
import Timer from "./Timer";

export default function SectionDisplay(props) {
  return (
    <div
      className="h-full flex flex-col overflow-y-hidden  justify-between pt-8 bg-gray-800 bg-opacity-90 rounded-2xl mx-2 pb-4 text-white shadow-2xl"
      style={{
        maxHeight: "80vh",
      }}
    >
      <div className="h-full relative flex flex-col space-y-6 .py-4 pl-4 ">
        <div className="ml-4">
          <h1 className="text-6xl font-heading tracking-widest">
            {props.selectedSection.name?.toUpperCase()}
          </h1>
          <h1 className="text-4xl font-subHeading -mt-2">
            {props.selectedSection.duration}
          </h1>
        </div>
        {props.selectedSection.movements.map((movement, index) => {
          return (
            <div key={index} className="ml-4">
              <div>
                <h1
                  className={`${
                    props.selectedSection.movements.length > 6
                      ? "text-4xl"
                      : "text-4xl"
                  } font-extrabold inline`}
                >
                  {
                    movement.showNumber ? movement.number + " - " : ""
                    // index + 1 + "  -  "
                  }
                </h1>

                <h1
                  className={`${
                    props.selectedSection.movements.length > 6
                      ? "text-4xl"
                      : "text-4xl"
                  } font-extrabold inline`}
                >
                  {movement.name?.toUpperCase()}
                </h1>
              </div>
              <h2
                className={`${
                  props.selectedSection.movements.length > 6
                    ? "text-4xl"
                    : "text-4xl"
                } font-bold text-gray-300 ml-6`}
              >
                {movement.duration}
              </h2>
              <h2
                className={`${
                  props.selectedSection.movements.length > 6
                    ? "text-4xl"
                    : "text-4xl"
                } font-bold text-gray-300 ml-10`}
              >
                {movement.equipment}
              </h2>
            </div>
          );
        })}
      </div>
    </div>
  );
}
