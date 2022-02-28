import React from "react";
// import TimerRow from "../components/TimerRow";
// import { PlusSmIcon as PlusSmIconSolid } from "@heroicons/react/solid";
import { Dialog, Transition } from "@headlessui/react";
import TimerTable from "./TimerTable";
// import { useFormik } from "formik";
// import * as Yup from "yup";

export default function TimerBuilder(props) {
  //   const [timers, setTimers] = React.useState(props.timers);

  // const submit = () => {
  //   props.setShow(false);
  // };

  // const addTimer = () => {
  //   props.setTimers([
  //     ...props.timers,

  //     {
  //       countDown: true,
  //       totalTime: "",
  //       sound: true,
  //       repeat: false,
  //       showNumber: false,
  //       restartNumber: false,
  //       number: null,
  //       group: false,
  //       startCount: false,
  //       autoStart: true,
  //       date: Date(),
  //     },
  //   ]);
  // };

  // const updateTimer = (newTimer, index) => {
  //   const oldTimers = [...props.timers];
  //   oldTimers[index] = newTimer;
  //   props.setTimers(oldTimers);
  // };

  return (
    <div>
      <Transition.Root show={props.show} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={() => {}} //{props.setShow}
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
                  <div className="flex flex-col rounded-md border-gray-300 border mx-6">
                    <div className="-my-2 overflow-x-auto sm:-mx-6 lg:-mx-8">
                      <div className="py-2 align-middle inline-block min-w-full sm:px-6 lg:px-8">
                        <div className="shadow overflow-hidden border-b border-gray-200 sm:rounded-lg">
                          <TimerTable timers={props.timers} {...props} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex flex-row w-full my-6 px-6">
                  <button
                    onClick={() => {
                      // props.setTimers(timers);
                      props.setShow(false);
                    }}
                    className="bg-TADarkBlue py-2 ml-auto hover:bg-blue-900 hover:shadow-xl text-white px-4 rounded-lg shadow-md duration-200 transition"
                  >
                    DONE
                  </button>
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
