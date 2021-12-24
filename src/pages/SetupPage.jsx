import React from "react";
import { format } from "date-fns";
import { PlusSmIcon } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import AddWorkout from "./AddWorkout";
import { useNavigate } from "react-router-dom";
import firebase from "firebase/compat/app";

export default function SetupPage(props) {
  const [open, setOpen] = React.useState(false);
  const [editWorkout, setEditWorkout] = React.useState(null);
  const [workoutIndex, setWorkoutIndex] = React.useState(null);
  const navigate = useNavigate();

  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].dateMade === obj.dateMade) {
        return true;
      }
    }

    return false;
  }

  const signOut = () => {
    firebase
      .auth()
      .signOut()
      .then(
        function () {
          console.log("Signed Out");
        },
        function (error) {
          console.error("Sign Out Error", error);
        }
      );
  };

  const saveToJSON = () => {};

  const saveWorkout = (workout) => {
    //See if element already exist
    if (containsObject(workout, props.workouts)) {
      alert("EXISTS");
    } else {
      props.addWorkout(workout);
    }

    setOpen(false);
    saveToJSON();
    // alert(workout);
  };

  const updateWorkout = (oldWorkout, index) => {
    setOpen(false);
    props.updateWorkout(oldWorkout, index);
    saveToJSON();
  };

  return (
    <div className="flex justify-center py-20">
      <div className="flex flex-col">
        <div className="flex py-8 justify-between">
          <h1 className="text-3xl">Workout Selection</h1>

          <button
            type="button"
            onClick={() => {
              setEditWorkout(null);
              setWorkoutIndex(null);
              setOpen(true);
            }}
            className="relative inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-TADarkRed hover:bg-TARed focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-gray-800 focus:ring-TADarkRed"
          >
            <PlusSmIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            <span>New Workout</span>
          </button>
        </div>
        <div className="flex flex-col max-w-6xl">
          <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
            <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
              <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
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
                        Description
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                      >
                        Date Updated
                      </th>

                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                      <th scope="col" className="relative px-6 py-3">
                        <span className="sr-only">Edit</span>
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {props.workouts.map((workout, workoutIdx) => (
                      <tr
                        key={workoutIdx}
                        className={
                          workoutIdx % 2 === 0 ? "bg-white" : "bg-gray-50"
                        }
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {workout.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workout.description}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {format(workout.dateMade, "dd MMM yyyy")}
                          {/* {typeof workout.dateMade} */}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {workout.role}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            onClick={() => {
                              setEditWorkout(workout);
                              setWorkoutIndex(workoutIdx);
                              setOpen(true);
                            }}
                            className="text-TADarkBlue hover:text-indigo-900"
                          >
                            Edit
                          </button>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <button
                            type="button"
                            onClick={() => {
                              // alert(JSON.stringify(props.workouts, null, 2));
                              props.setSelectedWorkout(workout);
                              navigate("/");
                            }}
                            className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-TADarkBlue bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                          >
                            START
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
      </div>

      <Transition.Root show={open} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed inset-0 overflow-hidden"
          onClose={setOpen}
        >
          <div className="absolute inset-0 overflow-hidden">
            <Dialog.Overlay className="absolute inset-0" />

            <div className="fixed inset-y-0 right-0 pl-10 max-w-full flex">
              <Transition.Child
                as={React.Fragment}
                enter="transform transition ease-in-out duration-500 sm:duration-700"
                enterFrom="translate-x-full"
                enterTo="translate-x-0"
                leave="transform transition ease-in-out duration-500 sm:duration-700"
                leaveFrom="translate-x-0"
                leaveTo="translate-x-full"
              >
                <div className="w-screen max-w-md">
                  <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-lg font-medium text-gray-900">
                          Add Workout
                        </Dialog.Title>
                        <div className="ml-3 h-7 flex items-center">
                          <button
                            type="button"
                            className="bg-white rounded-md text-gray-400 hover:text-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                            onClick={() => setOpen(false)}
                          >
                            <span className="sr-only">Close panel</span>
                            <XIcon className="h-6 w-6" aria-hidden="true" />
                          </button>
                        </div>
                      </div>
                    </div>
                    <div className="mt-6 relative flex-1 px-4 sm:px-6">
                      <AddWorkout
                        {...props}
                        saveWorkout={saveWorkout}
                        workout={editWorkout}
                        workoutIndex={workoutIndex}
                        updateWorkout={updateWorkout}
                        setShowAddWorkout={setOpen}
                      />
                    </div>
                  </div>
                </div>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
