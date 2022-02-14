import React from "react";
import LogoImage from "../assets/darklogo.png";
import { useNavigate } from "react-router-dom";

export default function SummaryPage(props) {
  const navigate = useNavigate();
  return (
    <div className="w-screen h-screen absolute inset-0 flex overflow-hidden">
      <button
        onClick={() => {
          navigate("/setup");
        }}
        className="absolute right-0 top-0 flex flex-col z-50"
      >
        <img
          src={LogoImage}
          alt="logo"
          width="200"
          className="mx-auto top-0 mt-6"
        />
      </button>

      <img
        src={LogoImage}
        alt="logo"
        width="6000px"
        style={{ left: "-40%", bottom: "-30%" }}
        className="absolute mx-auto opacity-10"
      />

      {props.selectedWorkout !== null ? (
        <div className="inset-0 absolute items-center block ">
          {/* <div className="absolute inset-x-40 bottom-10 top-36 rounded-3xl border-8 shadow-2xl border-TARed bg-gray-900"></div> */}
          <h1 className="text-6xl pt-8 font-heading w-full text-center flex-none ">
            {props.selectedWorkout.name}
          </h1>
          <h1 className="text-4xl font-subHeading w-full text-center flex-none">
            {"(" + props.selectedWorkout.description + ")"}
          </h1>
          <div
            className="absolute bottom-12 top-48 bg-gray-800 border-TARed border-8 rounded-3xl"
            style={{
              width: "1200px",
              left: "50%",
              transform: "translate(-50%, 0)",
            }}
          >
            <div className="flex flex-col flex-wrap w-full h-full py-2 px-2 bg-gray-800 rounded-2xl  text-white">
              {props.selectedWorkout.sections.map((section, index) => {
                return (
                  <div key={index} className="flex-initial">
                    <div className="p-4 space-y-2">
                      <h1 className="text-xl pl-2 font-chalkHeading max-w-xs">
                        {index + 1 + " - " + section.name}
                      </h1>
                      <h1 className="text-2xl font-chalkSubheading pl-4">
                        {section.duration}
                      </h1>
                      {section.movements.map((movement, index) => {
                        return (
                          <div className="ml-6" key={index}>
                            <h1 className="text-xl font-chalkSubheading">
                              {movement.name?.toUpperCase()}

                              {movement.duration?.length > 0 ? (
                                <span className="text-xl font-chalk">
                                  {" - " + movement.duration}
                                </span>
                              ) : (
                                <div />
                              )}
                            </h1>

                            <h1 className="text-xl font-chalk">
                              {movement.equipment}
                            </h1>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      ) : (
        <div />
      )}
    </div>
  );
}
