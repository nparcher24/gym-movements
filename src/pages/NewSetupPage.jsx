import React from "react";
import MaterialTable from "@material-table/core";
import { ThemeProvider } from "@material-ui/core";
import { MuiTheme } from "../components/MuiTheme";
import { useNavigate } from "react-router-dom";
import { doc, deleteDoc } from "firebase/firestore";

import { Dialog, Transition } from "@headlessui/react";
import { XIcon } from "@heroicons/react/outline";
import AddWorkout from "./AddWorkout";
import NewAddWorkout from "./NewAddWorkout";

export default function NewSetupPage(props) {
  const navigate = useNavigate();

  let tableColumns = [
    { title: "Name", field: "name" },
    {
      title: "Workout Date",
      field: "workoutDate",
      type: "date",
      defaultSort: "desc",
    },
    { title: "Description", field: "description" },
    {
      title: "Last Updated",
      field: "dateMade",
      type: "date",
    },
  ];

  const [open, setOpen] = React.useState(false);
  const [editWorkout, setEditWorkout] = React.useState(null);
  const [workoutIndex, setWorkoutIndex] = React.useState(null);

  function containsObject(obj, list) {
    var i;
    for (i = 0; i < list.length; i++) {
      if (list[i].dateMade === obj.dateMade) {
        return true;
      }
    }
    return false;
  }

  const saveWorkout = (workout) => {
    setOpen(false);
    // See if element already exist

    if (containsObject(workout, props.workouts)) {
      //   alert("EXISTS");
    } else {
      //   alert("DOESNT EXIST");
      props.addWorkout(workout);
    }
  };

  const updateWorkout = (oldWorkout, index) => {
    setOpen(false);
    props.updateWorkout(oldWorkout, index);
  };

  return (
    <div>
      <div className="flex justify-center px-6 py-6  bg-gray-100 h-screen">
        <div className="w-full max-w-6xl my-auto z-0">
          <ThemeProvider theme={MuiTheme}>
            <MaterialTable
              title="WOROUTS"
              columns={tableColumns}
              data={props.workouts}
              actions={[
                {
                  icon: "edit",
                  tooltip: "Edit Workout",
                  onClick: (event, workout) => {
                    // console.log(event);
                    setEditWorkout(workout);
                    // setWorkoutIndex(workoutIdx);
                    setOpen(true);
                  },
                },
                {
                  icon: "delete",
                  tooltip: "Delete Workout",
                  onClick: (event, rowData) => {
                    if (
                      window.confirm(
                        "Are you sure you want to delete: " + rowData.name
                      )
                    ) {
                      deleteDoc(doc(props.db, "workouts", rowData.id)).then(
                        (error) => {
                          if (error != null) {
                            alert("ERROR DELETING DOC: ", error);
                          }
                        }
                      );
                    }
                  },
                },
                {
                  icon: () => {
                    return (
                      <div
                        type="button"
                        className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-TADarkBlue bg-indigo-100 "
                      >
                        START
                      </div>
                    );
                  },
                  tooltip: "Start Workout",
                  onClick: (event, rowData) => {
                    props.setSelectedWorkout(rowData);
                    navigate("/");
                  },
                },
                {
                  icon: "add",
                  tooltip: "Add Workout",
                  isFreeAction: true,
                  onClick: (event) => {
                    setEditWorkout(null);
                    // setWorkoutIndex(workoutIdx);
                    setOpen(true);
                  },
                },
              ]}
              options={{
                actionsColumnIndex: -1,
              }}
            />
          </ThemeProvider>
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
                <div className="w-screen max-w-lg">
                  <div className="h-full flex flex-col py-6 bg-white shadow-xl overflow-y-scroll">
                    <div className="px-4 sm:px-6">
                      <div className="flex items-start justify-between">
                        <Dialog.Title className="text-2xl tracking-wider font-bold text-gray-900">
                          ADD WORKOUT
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
                      {/* Replace with your content */}

                      <NewAddWorkout
                        {...props}
                        saveWorkout={saveWorkout}
                        workout={editWorkout}
                        workoutIndex={workoutIndex}
                        updateWorkout={updateWorkout}
                        setShowAddWorkout={setOpen}
                      />
                      {/* /End replace */}
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
