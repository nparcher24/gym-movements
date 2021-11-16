import { useFormik } from "formik";
import * as Yup from "yup";
import React from "react";
import { PlusSmIcon as PlusSmIconSolid } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import AddSection from "./AddSection";

export default function AddWorkout(props) {
  const [showAddSection, setShowAddSection] = React.useState(false);
  const [sections, setSections] = React.useState(
    props.workout?.sections != null ? props.workout.sections : []
  );
  const [editIndex, setEditIndex] = React.useState(null);

  const formik = useFormik({
    initialValues: {
      name: props.workout == null ? "" : props.workout.name,
      description: props.workout == null ? "" : props.workout.description,
      dateMade: new Date(),
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      description: Yup.string(),
      //   dateMade: Yup.date(),
    }),
    onSubmit: (values) => {
      values["sections"] = [...sections];

      if (props.workout == null) {
        props.saveWorkout(values);
      } else {
        props.updateWorkout(values, props.workoutIndex);
      }

      console.log("Saved a workout");
      props.saveToCloud();
    },
  });

  return (
    <div>
      <form onSubmit={formik.handleSubmit}>
        <div className="overflow-hidden">
          <div className="bg-white py-6 px-4 space-y-6 sm:p-6">
            <div className="grid grid-cols-6 gap-6">
              <div className="col-span-6 sm:col-span-8">
                <label
                  htmlFor="workout-title"
                  className="block text-sm font-medium text-gray-700"
                >
                  Workout Name
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
                  <h1 className="text-TARed">{formik.errors.name}</h1>
                ) : null}
              </div>

              <div className="col-span-6 sm:col-span-8">
                <label
                  htmlFor="last-name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Description
                </label>
                <div className="mt-1">
                  <textarea
                    id="description"
                    name="description"
                    onChange={formik.handleChange}
                    value={formik.values.description}
                    rows={3}
                    className="max-w-lg shadow-sm block w-full focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm border border-gray-300 rounded-md p-2"
                    defaultValue={""}
                  />
                  {formik.touched.description && formik.errors.description ? (
                    <h1 className="text-TADarkRed">
                      {formik.errors.description}
                    </h1>
                  ) : null}
                </div>
              </div>
            </div>
          </div>

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
                          Section name
                        </th>
                        <th scope="col" className="relative px-6 py-3">
                          <button
                            type="button"
                            onClick={() => {
                              setEditIndex(null);
                              setShowAddSection(true);
                            }}
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
                      {sections.map((section, sectionIdx) => (
                        <tr
                          key={section.email}
                          className={
                            sectionIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                          }
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {sectionIdx + 1}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {section.name}
                          </td>

                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button
                              type="button"
                              onClick={() => {
                                setEditIndex(sectionIdx);
                                setShowAddSection(true);
                              }}
                              className="text-indigo-600 hover:text-indigo-900"
                            >
                              Edit
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>

          <div className="px-4 py-3 bg-gray-50 text-right sm:px-6">
            <button
              type="button"
              onClick={() => {
                if (props.workoutIndex != null) {
                  const oldWorkouts = [...props.workouts];

                  const filtered = oldWorkouts.filter(function (
                    value,
                    index,
                    arr
                  ) {
                    return index !== props.workoutIndex;
                  });

                  props.deleteFromCloud(props.workouts[props.workoutIndex]);
                  props.setWorkouts(filtered);
                  props.setShowAddWorkout(false);
                } else {
                  props.setShowAddWorkout(false);
                }
              }}
              className="bg-TADarkRed border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 mx-4"
            >
              Delete
            </button>
            <button
              type="submit"
              className="bg-TADarkBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save
            </button>
          </div>
        </div>
      </form>

      <Transition.Root show={showAddSection} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setShowAddSection}
        >
          <div className="flex items-end justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0"
              enterTo="opacity-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100"
              leaveTo="opacity-0"
            >
              <Dialog.Overlay className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
            </Transition.Child>

            {/* This element is to trick the browser into centering the modal contents. */}
            <span
              className="hidden sm:inline-block sm:align-middle sm:h-screen"
              aria-hidden="true"
            >
              &#8203;
            </span>
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <div
                style={{ maxHeight: "90vh" }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-7xl sm:w-full sm:p-6"
              >
                <div>
                  <AddSection
                    sections={sections}
                    setSections={setSections}
                    sectionIndex={editIndex}
                    setShowAddSection={setShowAddSection}
                  />
                </div>
                {/* <div className="mt-5 sm:mt-6">
                  <button
                    type="submit"
                    className="inline-flex justify-center w-full rounded-md border border-transparent shadow-sm px-4 py-2 bg-TADarkBlue text-base font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:text-sm"
                    onClick={() => setShowAddSection(false)}
                  >
                    Save
                  </button>
                </div> */}
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
