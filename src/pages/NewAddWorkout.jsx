import React from "react";
import { AutoField, AutoForm, SubmitField } from "uniforms-material";
import { ThemeProvider } from "@material-ui/core";
import { MuiTheme } from "../components/MuiTheme";
import Ajv from "ajv";
import { JSONSchemaBridge } from "uniforms-bridge-json-schema";
import moment from "moment";
import TimerTable from "../components/TimerTable";
import TimerBuilder from "../components/TimerBuilder";
import { doc, setDoc, addDoc, collection, deleteDoc } from "firebase/firestore";
import MaterialTable, { MTableBodyRow } from "@material-table/core";
import NewAddSection from "../components/NewAddSection";
import { Dialog, Transition } from "@headlessui/react";
import { DocumentDuplicateIcon } from "@heroicons/react/outline";
import { v4 as uuidv4 } from "uuid";

const schema = {
  title: "Workout",
  type: "object",
  properties: {
    name: { type: "string" },
    description: { type: "string" },
    workoutDate: { type: "string" },
  },
  required: ["name", "workoutDate"],
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

export default function NewAddWorkout(props) {
  const [showTimerSetup, setShowTimerSetup] = React.useState(false);
  const [showAddSection, setShowAddSection] = React.useState(false);
  const [selectedSection, setSelectedSection] = React.useState(null);
  const [selectedSectionIndex, setSelectedSectionIndex] = React.useState(null);
  const [sections, setSections] = React.useState(
    props.workout?.sections != null ? props.workout.sections : []
  );
  const [timers, setTimers] = React.useState(
    props.workout?.timers != null ? props.workout.timers : []
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
    let newtableData = offsetIndex(from, to, [...sections]);
    //Update react state
    setSections(newtableData);
  };

  return (
    <div className="">
      {/* <ThemeProvider theme={MuiTheme}> */}
      <AutoForm
        schema={bridge}
        model={
          props.workout !== null
            ? {
                ...props.workout,
                workoutDate:
                  props.workout.workoutDate != null
                    ? moment(props.workout.workoutDate).format("YYYY-MM-DD")
                    : "",
              }
            : {
                workoutDate: moment().format("YYYY-MM-DD"),
              }
        }
        onSubmit={(val) => {
          const values = val;
          values.workoutDate = moment(val.workoutDate, "YYYY-MM-DD").toDate();
          values["dateMade"] = new Date();

          values["sections"] = [...sections];
          values["timers"] = [...timers];

          if (props.workout != null) {
            values["id"] = props.workout.id;

            setDoc(doc(props.db, "workouts", values.id), values).then(
              (error) => {
                if (error != null) {
                  alert("ERROR SAVING: ", error);
                } else {
                  console.log("SUCCESSFULLY SAVED");
                }
              }
            );
          } else {
            const docRef = addDoc(collection(props.db, "workouts"), values);
            console.log("New document written with ID: ", docRef.id);
          }
          props.setShowAddWorkout(false);
        }}
      >
        <AutoField name="name" />
        <AutoField name="description" />
        <p className="mt-4 text-xs text-TADarkBlue">Workout date</p>
        <AutoField name="workoutDate" label="" type="date" />

        <div className="mt-6">
          <MaterialTable
            title="SECTIONS"
            columns={[{ title: "Name", field: "name" }]}
            data={sections}
            options={{
              search: false,
              actionsColumnIndex: -1,
              // pageSizeOptions: [],
              // pageSize: 5,
            }}
            editable={{
              onRowDelete: (oldData) =>
                new Promise((resolve, reject) => {
                  // console.log(oldData);
                  const oldSections = [...sections];
                  oldSections.splice(oldData.tableData.id, 1);
                  setSections(oldSections);
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
              {
                icon: "add",
                tooltip: "Add Section",
                isFreeAction: true,
                onClick: (event) => {
                  setSelectedSection(null);
                  setSelectedSectionIndex(null);
                  setShowAddSection(true);
                  console.log(sections);
                },
              },
              {
                icon: "edit",
                tooltip: "Edit Section",
                onClick: (event, rowData) => {
                  // alert(JSON.stringify(rowData.tableData));
                  setSelectedSection(sections[rowData.tableData.id]);

                  setSelectedSectionIndex(rowData.tableData.id);
                  // alert(JSON.stringify(rowData.tableData.id));
                  setShowAddSection(true);
                },
              },
              {
                icon: () => {
                  return <DocumentDuplicateIcon className="h-6 w-6" />;
                },
                tooltip: "Duplicate Section",
                onClick: (event, rowData) => {
                  const oldSections = [...sections];
                  const newSection = sections[rowData.tableData.id];
                  oldSections.splice(rowData.tableData.id, 0, newSection);
                  setSections(oldSections);
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
          <SubmitField label="Save" />
          <button
            type="button"
            className=" bg-TADarkBlue hover:bg-blue-900 hover:shadow-xl text-white px-4 rounded-lg shadow-md duration-200 transition"
            onClick={() => {
              setShowTimerSetup(true);
            }}
          >
            TIMER SETUP
          </button>
        </div>
      </AutoForm>

      <TimerBuilder
        show={showTimerSetup}
        setShow={setShowTimerSetup}
        timers={timers}
        setTimers={setTimers}
      />

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
                style={{ maxHeight: "80vh", maxWidth: "90vw" }}
                className="inline-block align-bottom bg-white rounded-lg px-4 pt-5 pb-4 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle max-w-7xl sm:w-full sm:p-6 overflow-y-auto"
              >
                <div>
                  <NewAddSection
                    {...props}
                    showAddSection={showAddSection}
                    setShowAddSection={setShowAddSection}
                    section={selectedSection}
                    sections={sections}
                    setSections={setSections}
                    sectionIndex={selectedSectionIndex}
                  />
                </div>
              </div>
            </Transition.Child>
          </div>
        </Dialog>
      </Transition.Root>

      {/* </ThemeProvider> */}
    </div>
  );
}
