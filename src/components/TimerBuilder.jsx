import React from "react";
import TimerRow from "../components/TimerRow";
import { PlusSmIcon as PlusSmIconSolid } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
// import { useFormik } from "formik";
// import * as Yup from "yup";

export default function TimerBuilder(props) {
  //   const [timers, setTimers] = React.useState(props.timers);

  const submit = () => {
    props.setShow(false);
  };

  const addTimer = () => {
    props.setTimers([
      ...props.timers,

      {
        countDown: true,
        totalTime: "",
        sound: true,
        repeat: false,
        showNumber: false,
        restartNumber: false,
        number: null,
        group: false,
        startCount: false,
        autoStart: true,
        date: Date(),
      },
    ]);
  };

  const updateTimer = (newTimer, index) => {
    const oldTimers = [...props.timers];
    oldTimers[index] = newTimer;
    props.setTimers(oldTimers);
  };

  if (props.sectionIndex != null) {
    alert(props.sections[props.sectionIndex]);
  }

  React.useEffect(() => {
    props.updateTimerNumbers();
  }, []);

  return (
    <div>
      <Transition.Root show={props.show} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={props.setShow}
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
                style={{ maxHeight: "80vh", maxWidth: "90vw" }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-7xl sm:w-full sm:p-6 overflow-y-auto"
              >
                <div>
                  <h1 className="mx-6 text-2xl mb-6">Timer Setup</h1>

                  <div className="flex flex-col rounded-md border-gray-300 border mx-6">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <table className="min-w-full divide-y divide-gray-200 ">
                            <thead className="bg-gray-50">
                              <tr>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Number
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
                                  Direction
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Sound
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Show Number
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Restart Number
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Group
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Auto Start
                                </th>
                                <th
                                  scope="col"
                                  className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
                                >
                                  Start Countdown
                                </th>
                                <th
                                  scope="col"
                                  className="relative flex px-6 justify-end  py-3"
                                >
                                  <button
                                    type="button"
                                    onClick={addTimer}
                                    className="inline-flex items-center border border-transparent shadow-sm text-sm font-medium rounded-md text-white hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-TADarkBlue"
                                  >
                                    <PlusSmIconSolid
                                      className="h-10 w-10 text-TADarkBlue"
                                      aria-hidden="true"
                                    />
                                  </button>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {props.timers.map((timer, timerIndex) => (
                                <TimerRow
                                  key={timerIndex}
                                  timer={timer}
                                  timerIndex={timerIndex}
                                  updateTimer={updateTimer}
                                  {...props}
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
                      onClick={submit}
                      className="bg-TADarkBlue border border-transparent rounded-md shadow-sm py-2 px-4 inline-flex justify-center text-sm font-medium text-white hover:bg-TABlue transition duration-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-TADarkBlue"
                    >
                      Save
                    </button>
                  </div>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
