import React from "react";
import { VideoCameraIcon } from "@heroicons/react/outline";
import { AutoField, AutoForm, SubmitField } from "uniforms-material";
import MaterialTable, { MTableBodyRow } from "@material-table/core";
import Ajv from "ajv";
import { JSONSchemaBridge } from "uniforms-bridge-json-schema";

import { Dialog, Transition } from "@headlessui/react";
import VideoSearch from "./VideoSearch";

const schema = {
  title: "Section",
  type: "object",
  properties: {
    name: { type: "string" },
    duration: { type: "string" },
  },
  required: ["name"],
};

const ajv = new Ajv({ allErrors: true, useDefaults: true });

function createValidator(schema) {
  const validator = ajv.compile(schema);

  return (model) => {
    validator(model);
    return validator.errors?.length ? { details: validator.errors } : null;
  };
}

const schemaValidator = createValidator(schema);

export const bridge = new JSONSchemaBridge(schema, schemaValidator);

export default function NewAddSection(props) {
  const [showVideoSelection, setShowVideoSelection] = React.useState(false);
  const [videoIndex, setVideoIndex] = React.useState(null);
  const [movements, setMovements] = React.useState(
    props.sectionIndex != null &&
      props.sections[props.sectionIndex]?.movements != null
      ? props.sections[props.sectionIndex].movements
      : []
  );

  const DragState = {
    row: -1,
    dropIndex: -1, // drag target
  };

  const offsetIndex = (from, to, arr = []) => {
    if (from < to) {
      let start = arr.slice(0, from),
        between = arr.slice(from + 1, to + 1),
        end = arr.slice(to + 1);
      return [...start, ...between, arr[from], ...end];
    }
    if (from > to) {
      let start = arr.slice(0, to),
        between = arr.slice(to, from),
        end = arr.slice(from + 1);
      return [...start, arr[from], ...between, ...end];
    }
    return arr;
  };

  const reOrderRow = (from, to) => {
    let newtableData = offsetIndex(from, to, [...movements]);
    //Update react state
    setMovements(newtableData);
  };

  function videoSelected(videoname) {
    setShowVideoSelection(false);
    const oldMovement = [...movements];
    oldMovement[videoIndex] = {
      ...oldMovement[videoIndex],
      videoName: videoname,
    };

    setMovements(oldMovement);
  }

  function updateTimerNumbers(oldMovements) {
    console.log("Called Update Movements");
    const newMovements = [];
    var lastIndex = 1;
    oldMovements.forEach((movement) => {
      const oldMovement = movement;
      if (oldMovement.restartNumber) {
        lastIndex = 2;
        oldMovement.number = 1;
        oldMovement.showNumber = true;
      } else if (oldMovement.showNumber) {
        if (oldMovement.group) {
          oldMovement.number = lastIndex - 1;
        } else {
          oldMovement.number = lastIndex;
          lastIndex = lastIndex + 1;
        }
      } else if (!oldMovement.showNumber) {
        oldMovement.number = null;
      }
      newMovements.push(oldMovement);
    });
    return newMovements;
    // setTimers(newTimers);
  }

  return (
    <div>
      <AutoForm
        schema={bridge}
        model={props.section !== null ? props.section : {}}
        onSubmit={(val) => {
          const values = val;
          values["movements"] = [...movements];

          var oldSections = [...props.sections];
          if (props.sectionIndex === null) {
            oldSections.push(values);
            props.setSections(oldSections);
          } else {
            oldSections[props.sectionIndex] = values;
            props.setSections(oldSections);
          }
          props.setShowAddSection(false);
        }}
      >
        <AutoField name="name" />
        <AutoField name="duration" />

        <div className="mt-6">
          <MaterialTable
            title="MOVEMENTS"
            columns={[
              {
                title: "#",
                field: "number",
                type: "numeric",
                editable: "never",
              },
              { title: "NAME", field: "name", type: "string" },
              { title: "DURATION", field: "duration", type: "string" },
              { title: "EQUIPMENT", field: "equipment", type: "string" },
              {
                title: "SHOW NUMBER",
                field: "showNumber",
                type: "boolean",
                initialEditValue: true,
              },
              {
                title: "VIDEO",
                field: "videoName",
                editable: "never",
                initialEditValue: "NONE",
              },
            ]}
            data={movements}
            options={{
              search: false,
              actionsColumnIndex: -1,
            }}
            editable={{
              onRowAdd: (changes) => {
                return new Promise((resolve, reject) => {
                  if (Object.keys(changes).length > 0) {
                    const oldMovements = [...movements];
                    const newMovement = changes;
                    // newMovement["showNumber"] = !changes.showNumber;
                    oldMovements.push(newMovement);
                    const newMovements = updateTimerNumbers(oldMovements);
                    setMovements(newMovements);
                  }
                  resolve();
                });
              },
              onBulkUpdate: (changes) => {
                return new Promise((resolve, reject) => {
                  if (Object.keys(changes).length > 0) {
                    const oldMovements = [...movements];
                    Object.keys(changes).forEach((index) => {
                      const changedMovement = changes[index].newData;
                      delete changedMovement["tableData"];
                      oldMovements[index] = changedMovement;
                      console.log(changedMovement);
                    });
                    const newMovements = updateTimerNumbers(oldMovements);
                    setMovements(newMovements);
                  }
                  resolve();
                });
              },
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  // console.log(oldData);
                  var oldMovements = [...movements];
                  oldMovements.splice(oldData.tableData.id, 1);
                  const newMovements = updateTimerNumbers(oldMovements);
                  setMovements(newMovements);
                  resolve();
                }),
            }}
            components={{
              Row: (props) => (
                <MTableBodyRow
                  {...props}
                  draggable="true"
                  onDragStart={(e) => {
                    // console.log("onDragStart");
                    DragState.row = props.data.tableData.id;
                  }}
                  onDragEnter={(e) => {
                    e.preventDefault();
                    if (props.data.tableData.id !== DragState.row) {
                      DragState.dropIndex = props.data.tableData.id;
                      // console.log("onDragEnter" + props.data.tableData.id);
                    }
                  }}
                  onDragEnd={(e) => {
                    // console.log(`onDragEnd`);
                    if (DragState.dropIndex !== -1) {
                      reOrderRow(DragState.row, DragState.dropIndex);
                    }
                    DragState.row = -1;
                    DragState.dropIndex = -1;
                  }}
                />
              ),
            }} // components
            actions={[
              // {
              //   icon: "add",
              //   tooltip: "Add Section",
              //   isFreeAction: true,
              //   onClick: (event) => {
              //     setMovements([
              //       ...movements,
              //       {
              //         name: "",
              //         duration: "",
              //         equipment: "",
              //         videoName: "NONE",
              //       },
              //     ]);
              //   },
              // },
              {
                icon: () => {
                  return (
                    <VideoCameraIcon className="h-6 w-6" />
                    // <button
                    //   type="button"
                    //   className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-TADarkBlue bg-indigo-100 "
                    // >
                    //   CHOOSE VIDEO
                    // </button>
                  );
                },
                tooltip: "Select Video",
                onClick: (event, rowData) => {
                  //   console.log(rowData);
                  setVideoIndex(rowData.tableData.id);
                  setShowVideoSelection(true);
                },
              },
            ]}
            localization={{
              header: {
                actions: "",
              },
            }}
          />
        </div>

        <div className="flex flex-row  mt-10 mb-10 space-x-4">
          <SubmitField label="Done" />
        </div>
      </AutoForm>

      <Transition.Root show={showVideoSelection} as={React.Fragment}>
        <Dialog
          as="div"
          className="fixed z-10 inset-0 overflow-y-auto"
          onClose={setShowVideoSelection}
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
                style={{ maxHeight: "60vh", maxWidth: "90vw" }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-7xl sm:w-full sm:p-6 overflow-y-auto"
              >
                <div>
                  <VideoSearch {...props} videoSelected={videoSelected} />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>
    </div>
  );
}
