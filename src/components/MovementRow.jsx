import React from "react";
import { useFormik } from "formik";
import * as Yup from "yup";

export default function MovementRow(props) {
  const [isEditing, setIsEditing] = React.useState(
    props.movement.name.length == 0
  );

  const formik = useFormik({
    initialValues: {
      name: props.movement.name,
      duration: props.movement.duration,
      equipment: props.movement.equipment,
      videoName: props.movement.videoName,
      date: new Date(),
    },
    validationSchema: Yup.object({
      name: Yup.string().max(60, "Too long").required("Required"),
      duration: Yup.string().max(60, "Too long"),
      equipment: Yup.string().max(60, "Too long"),
      videoName: Yup.string().required("Required"),
      date: Yup.date(),
    }),
    onSubmit: (values) => {
      //   alert(JSON.stringify(values, null, 2));
      props.updateMovement(values, props.movementIndex);
      setIsEditing(false);
    },
  });

  return (
    <tr
      key={props.movement.email}
      className={props.movementIndex % 2 === 0 ? "bg-white" : "bg-gray-50"}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {props.movementIndex + 1}
      </td>
      <td className="px-6 py-4 text-gray-500">
        {isEditing ? (
          <div>
            <input
              type="text"
              name="name"
              id="name"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.name}
              className=" block shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
            />
            {formik.touched.name && formik.errors.name ? (
              <h1 className="text-red-600">{formik.errors.name}</h1>
            ) : null}
          </div>
        ) : (
          props.movement.name
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {isEditing ? (
          <div>
            <input
              type="text"
              name="duration"
              id="duration"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.duration}
              className=" block  shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
            />
            {formik.touched.duration && formik.errors.duration ? (
              <h1 className="text-red-600">{formik.errors.duration}</h1>
            ) : null}
          </div>
        ) : (
          props.movement.duration
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {isEditing ? (
          <div>
            <input
              type="text"
              name="equipment"
              id="equipment"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.equipment}
              className="block  shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md  p-2"
            />
            {formik.touched.equipment && formik.errors.equipment ? (
              <h1 className="text-red-600">{formik.errors.equipment}</h1>
            ) : null}
          </div>
        ) : (
          props.movement.equipment
        )}
      </td>
      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
        {isEditing ? (
          <div>
            <input
              type="text"
              name="videoName"
              id="videoName"
              onChange={formik.handleChange}
              onBlur={formik.handleBlur}
              value={formik.values.videoName}
              className="block  shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:max-w-xs sm:text-sm border-gray-300 border-2 rounded-md p-2"
            />
            {formik.touched.videoName && formik.errors.videoName ? (
              <h1 className="text-red-600">{formik.errors.videoName}</h1>
            ) : null}
          </div>
        ) : (
          props.movement.videoName
        )}
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
                const oldMovements = [...props.movements];

                const filtered = oldMovements.filter(function (
                  value,
                  index,
                  arr
                ) {
                  return index != props.movementIndex;
                });

                props.setMovements(filtered);
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
