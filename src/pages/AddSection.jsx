import React from "react";
import { Formik, useFormik } from "formik";
import * as Yup from "yup";
import { PlusSmIcon as PlusSmIconSolid } from "@heroicons/react/solid";
import MovementRow from "../components/MovementRow";

export default function AddSection(props) {
  const [movements, setMovements] = React.useState(
    props.editIndex != null &&
      props.sections[props.editIndex]?.movements != null
      ? props.sections[props.editIndex].movements
      : [
          {
            name: "",
            duration: "",
            equipment: "",
            videoName: "",
          },
        ]
  );

  const formik = useFormik({
    initialValues: {
      name: props.editIndex == null ? "" : props.sections[props.editIndex].name,
      duration:
        props.editIndex == null ? "" : props.sections[props.editIndex].name,
      date: new Date(),
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      duration: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      date: Yup.date(),
    }),
    onSubmit: (values) => {
      values["movements"] = [...movements];
      const oldSections = [...props.sections];
      if (props.editIndex == null) {
        oldSections.push(values);
        props.setSections(oldSections);
      } else {
        oldSections[props.editIndex] = values;
        props.setSections(oldSections);
      }
      props.setShowAddSection(false);
      //   alert(JSON.stringify(values, null, 2));
    },
  });

  const addMovement = () => {
    setMovements([
      ...movements,

      {
        name: "",
        duration: "",
        equipment: "",
        videoName: "",
        date: Date(),
      },
    ]);
  };

  const updateMovement = (newMovement, index) => {
    const oldMovements = [...movements];
    oldMovements[index] = newMovement;
    setMovements(oldMovements);
  };

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
          <div className="grid grid-cols-6 gap-6">
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="workout-title"
                className="block text-sm font-medium text-gray-700"
              >
                Section Name
              </label>
              <input
                type="text"
                name="name"
                id="name"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.name}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formik.touched.name && formik.errors.name ? (
                <h1 className="text-red-600">{formik.errors.name}</h1>
              ) : null}
            </div>
            <div className="col-span-6 sm:col-span-3">
              <label
                htmlFor="workout-title"
                className="block text-sm font-medium text-gray-700"
              >
                Section Duration
              </label>
              <input
                type="text"
                name="duration"
                id="duration"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.duration}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
              {formik.touched.duration && formik.errors.duration ? (
                <h1 className="text-red-600">{formik.errors.duration}</h1>
              ) : null}
            </div>
          </div>
        </div>
      </form>

      <h1 className="mx-6 text-md">Movements</h1>

      <div className="flex flex-col rounded-md border-gray-300 border mx-6">
        <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
          <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
            <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    ></th>

                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Name
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Duration
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Equipment
                    </th>
                    <th
                      scope="col"
                      className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                    >
                      Video Filename
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <button
                        type="button"
                        onClick={addMovement}
                        className="inline-flex items-center border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        <PlusSmIconSolid
                          className="h-10 w-10 text-indigo-500"
                          aria-hidden="true"
                        />
                      </button>
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {movements.map((movement, movementIndex) => (
                    <MovementRow
                      movement={movement}
                      movementIndex={movementIndex}
                      updateMovement={updateMovement}
                      setMovements={setMovements}
                      movements={movements}
                    />
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      <div className="px-4 py-3 bg-gray-50 text-right sm:px-6 space-x-2">
        <button
          onClick={() => {
            if (props.sectionIndex != null) {
              const oldSections = [...props.sections];

              const filtered = oldSections.filter(function (value, index, arr) {
                return index != props.sectionIndex;
              });

              props.setSections(filtered);
              props.setShowAddSection(false);
            } else {
              props.setShowAddSection(false);
            }
          }}
          className="bg-red-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete
        </button>
        <button
          onClick={formik.submitForm}
          className="bg-indigo-600 border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Save
        </button>
      </div>
    </div>
  );
}
