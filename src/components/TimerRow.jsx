import React from "react";
// import { FormikContext, useFormik } from "formik";
// import * as Yup from "yup";
import { ArrowDownIcon, ArrowUpIcon } from "@heroicons/react/solid";

export default function TimerRow(props) {
  // const [isEditing, setIsEditing] = React.useState(
  //   props.timer.totalTime.length === 0
  // );

  // const formik = useFormik({
  //   initialValues: {
  //     countDown: props.timer.countDown ? "Count Down" : "Count Up",
  //     totalTime: props.timer.totalTime,
  //     sound: props.timer.sound,
  //     repeat: props.timer.repeat,
  //     showNumber: props.timer.showNumber,
  //     startCount: props.timer.startCount,
  //     date: new Date(),
  //   },

  //   validationSchema: Yup.object({
  //     totalTime: Yup.number()
  //       .positive("Must be positive")
  //       .integer("Must be in seconds")
  //       .required("Required"),
  //     date: Yup.date(),
  //   }),

  //   onSubmit: (values) => {
  //     var newValues = { ...values };
  //     newValues["countDown"] = values.countDown === "Count Up" ? false : true;
  //     newValues["totalTime"] = parseInt(values.totalTime);

  //     // alert(JSON.stringify(newValues, null, 2));
  //     props.updateTimer(values, props.timerIndex);
  //   },
  // });

  function handleChange(e) {
    const oldTimer = props.timer;

    if (e.target.id === "totalTime") {
      const time = parseInt(e.target.value);
      if ((Number.isInteger(time) && time > 0) || e.target.value === "") {
        oldTimer["totalTime"] = parseInt(e.target.value);
      }
    } else if (e.target.id === "countDown") {
      oldTimer["countDown"] = e.target.value === "Count Up" ? false : true;
    } else if (e.target.type === "checkbox") {
      oldTimer[e.target.id] = e.target.checked;
    } else {
      oldTimer[e.target.id] = e.target.value;
    }

    props.updateTimer(oldTimer, props.timerIndex);
  }

  return (
    <tr
      key={props.timerIndex}
      className={props.timerIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {props.timer.number != null ? props.timer.number : ""}
      </td>
      <td className="px-6 py-4 text-gray-500">
        <div>
          <input
            type="number"
            name="totalTime"
            id="totalTime"
            onChange={(e) => {
              handleChange(e);
            }}
            // onBlur={formik.handleBlur}
            value={props.timer.totalTime}
            className=" block shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
          {/* {formik.touched.totalTime && formik.errors.totalTime ? (
            <h1 className="text-red-600">{formik.errors.totalTime}</h1>
          ) : null} */}
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <select
            name="countDown"
            id="countDown"
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
            onChange={handleChange}
            value={props.timer.countDown ? "Count Down" : "Count Up"}
          >
            {["Count Down", "Count Up"].map((file, index) => {
              return <option key={index}>{file}</option>;
            })}
          </select>
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <input
            type="checkbox"
            name="sound"
            id="sound"
            onChange={handleChange}
            checked={props.timer.sound}
            className=" block ml-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <input
            type="checkbox"
            name="showNumber"
            id="showNumber"
            // disabled={!isEditing}
            onChange={(e) => {
              handleChange(e);
              props.updateTimerNumbers();
            }}
            value={props.timer.showNumber}
            checked={props.timer.showNumber}
            className=" block  shadow-sm ml-4 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <input
            type="checkbox"
            name="restartNumber"
            id="restartNumber"
            // disabled={!isEditing}
            onChange={(e) => {
              handleChange(e);
              props.updateTimerNumbers();
            }}
            value={props.timer.restartNumber}
            checked={props.timer.restartNumber}
            className=" block  shadow-sm ml-4 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <input
            type="checkbox"
            name="group"
            id="group"
            // disabled={!isEditing}
            onChange={(e) => {
              handleChange(e);
              props.updateTimerNumbers();
            }}
            value={props.timer.group}
            checked={props.timer.group}
            className=" block  shadow-sm ml-4 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <input
            type="checkbox"
            name="autoStart"
            id="autoStart"
            // disabled={!isEditing}
            onChange={(e) => {
              handleChange(e);
            }}
            value={props.timer.autoStart}
            checked={props.timer.autoStart}
            className=" block  shadow-sm ml-4 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div className="">
          <input
            type="checkbox"
            name="startCount"
            id="startCount"
            onChange={handleChange}
            value={props.timer.startCount}
            checked={props.timer.startCount}
            className=" block  shadow-sm ml-8 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
        </div>
      </td>

      <td className="flex space-x-2 justify-end px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        <div className="flex space-x-2">
          <button
            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-red-700 bg-red-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
            onClick={() => {
              const oldTimers = [...props.timers];

              const filtered = oldTimers.filter(function (value, index, arr) {
                return index !== props.timerIndex;
              });

              props.setTimers(filtered);
            }}
          >
            Delete
          </button>
        </div>

        <button
          onClick={() => {
            props.moveUp(props.timerIndex);
          }}
          disabled={props.timerIndex === 0}
        >
          <ArrowUpIcon
            className={` h-5 w-5 ${
              props.timerIndex === 0 ? "text-gray-300" : "text-blue-600"
            }`}
          />
        </button>
        <button
          onClick={() => {
            props.moveDown(props.timerIndex);
          }}
          disabled={props.timerIndex >= props.timers.length - 1}
        >
          <ArrowDownIcon
            className={` h-5 w-5 ${
              props.timerIndex >= props.timers.length - 1
                ? "text-gray-300"
                : "text-blue-600"
            }`}
          />
        </button>
      </td>
    </tr>
  );
}
