import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function TimerRow(props) {
  const [isEditing, setIsEditing] = React.useState(
    props.timer.totalTime.length === 0
  );

  console.log(props.timer);

  const formik = useFormik({
    initialValues: {
      countDown: props.timer.countDown ? "Count Down" : "Count Up",
      totalTime: props.timer.totalTime,
      sound: props.timer.sound,
      repeat: props.timer.repeat,
      startCount: props.timer.startCount,
      date: new Date(),
    },

    validationSchema: Yup.object({
      totalTime: Yup.number()
        .positive("Must be positive")
        .integer("Must be in seconds")
        .required("Required"),
      date: Yup.date(),
    }),

    onSubmit: (values) => {
      var newValues = { ...values };
      newValues["countDown"] = values.countDown === "Count Up" ? false : true;
      newValues["totalTime"] = parseInt(values.totalTime);

      // alert(JSON.stringify(newValues, null, 2));
      props.updateTimer(values, props.timerIndex);
      setIsEditing(false);
    },
  });

  return (
    <tr
      key={props.timer.email}
      className={props.timerIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {props.timerIndex + 1}
      </td>
      <td className="px-6 py-4 text-gray-500">
        {isEditing ? (
          <div>
            <input
              type="number"
              name="totalTime"
              id="totalTime"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.totalTime}
              className=" block shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
            />
            {formik.touched.totalTime && formik.errors.totalTime ? (
              <h1 className="text-red-600">{formik.errors.totalTime}</h1>
            ) : null}
          </div>
        ) : (
          props.timer.totalTime
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {isEditing ? (
          <div>
            <select
              name="countDown"
              id="countdown"
              className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.countDown}
            >
              {["Count Down", "Count Up"].map((file) => {
                return <option>{file}</option>;
              })}
            </select>
          </div>
        ) : (
          props.timer.countDown
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <input
            type="checkbox"
            name="sound"
            id="sound"
            disabled={!isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.sound}
            checked={formik.values.sound}
            className=" block ml-4 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <input
            type="checkbox"
            name="repeat"
            id="repeat"
            disabled={!isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.repeat}
            checked={formik.values.repeat}
            className=" block  shadow-sm ml-4 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
        </div>
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        <div>
          <input
            type="checkbox"
            name="startCount"
            id="startCount"
            disabled={!isEditing}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startCount}
            checked={formik.values.startCount}
            className=" block  shadow-sm ml-8 focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
          />
        </div>
      </td>

      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
        {isEditing ? (
          <div className="flex space-x-2">
            <button
              className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              onClick={() => {
                formik.submitForm();
              }}
            >
              Save
            </button>
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
        ) : (
          <button
            onClick={() => {
              setIsEditing(true);
            }}
            className="text-indigo-600 hover:text-indigo-900"
          >
            Edit
          </button>
        )}
      </td>
    </tr>
  );
}
