import { DocumentDuplicateIcon } from "@heroicons/react/outline";
import MaterialTable, { MTableBodyRow } from "@material-table/core";
import React from "react";

export default function TimerTable(props) {
  const [justUpdated, setJustUpdated] = React.useState(false);

  const [columns, setColumns] = React.useState([
    { title: "#", field: "number", editable: "never" },
    {
      title: "Duration",
      field: "totalTime",
      type: "numeric",
      validate: (rowData) => rowData.totalTime > 0,
    },
    {
      title: "Direction",
      field: "countDown",
      lookup: { true: "Count Down", false: "Count Up" },
    },
    {
      title: "Sound",
      field: "sound",
      type: "boolean",
    },
    {
      title: "Show Number?",
      field: "showNumber",
      type: "boolean",
    },
    {
      title: "Restart Number?",
      field: "restartNumber",
      type: "boolean",
    },
    {
      title: "Group?",
      field: "group",
      type: "boolean",
    },
    {
      title: "Auto Start?",
      field: "autoStart",
      type: "boolean",
    },
    {
      title: "Start Countdown?",
      field: "startCount",
      type: "boolean",
    },
  ]);

  //   const [timers, setTimers] = React.useState(
  //     props.timers.length > 0
  //       ? props.timers
  //       : [
  //           {
  //             countDown: true,
  //             totalTime: 0,
  //             sound: true,
  //             repeat: false,
  //             showNumber: true,
  //             restartNumber: false,
  //             number: null,
  //             group: false,
  //             startCount: false,
  //             autoStart: true,
  //             date: Date(),
  //           },
  //         ]
  //   );

  const addTimer = () => {
    const oldTimers = [
      ...props.timers,
      {
        countDown: true,
        totalTime: 1,
        sound: true,
        repeat: false,
        showNumber: true,
        restartNumber: false,
        number: null,
        group: false,
        startCount: false,
        autoStart: true,
        date: Date(),
      },
    ];
    console.log(oldTimers);
    const newTimers = updateTimerNumbers(oldTimers);
    props.setTimers(newTimers);
  };

  function updateTimerNumbers(oldTimers) {
    console.log("Called Update Timers");
    const newTimers = [];
    var lastIndex = 1;
    oldTimers.forEach((timer) => {
      const newTimer = timer;
      if (newTimer.restartNumber) {
        lastIndex = 2;
        newTimer.number = 1;
        newTimer.showNumber = true;
      } else if (newTimer.showNumber) {
        if (newTimer.group) {
          newTimer.number = lastIndex - 1;
        } else {
          newTimer.number = lastIndex;
          lastIndex = lastIndex + 1;
        }
      } else if (!newTimer.showNumber) {
        newTimer.number = null;
      }
      newTimers.push(newTimer);
    });
    return newTimers;
    // setTimers(newTimers);
  }

  React.useEffect(() => {
    props.setTimers(updateTimerNumbers([...props.timers]));
  }, []);

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
    let newtableData = offsetIndex(from, to, [...props.timers]);
    //Update react state
    let final = updateTimerNumbers(newtableData);
    props.setTimers(final);
  };

  return (
    <MaterialTable
      title="Timers"
      columns={columns}
      data={Array.from(props.timers)}
      localization={{
        header: {
          actions: "",
        },
      }}
      options={{ search: false, actionsColumnIndex: -1 }}
      actions={[
        {
          icon: "add",
          tooltip: "Add Timer",
          isFreeAction: true,
          onClick: () => {
            addTimer();
          },
        },
        // {
        //   icon: "delete",
        //   tooltip: "Delete Timer",
        //   onClick: (event, rowData) => {
        //     alert("adlifjaldsjkf");
        //     // const oldTimers = props.timers;
        //     // oldTimers.splice(rowData.tableData.id, 1);
        //     // props.setTimers(oldTimers);
        //   },
        // },
        {
          icon: () => {
            return <DocumentDuplicateIcon className="h-6 w-6" />;
          },
          tooltip: "Duplicate Timer",
          onClick: (event, rowData) => {
            console.log("Duplicate" + rowData.tableData.id);
            const oldTimers = [...props.timers];
            const newTimer = oldTimers[rowData.tableData.id];
            oldTimers.splice(rowData.tableData.id, 0, newTimer);
            const updateTimers = updateTimerNumbers(oldTimers);

            props.setTimers(updateTimers);
          },
        },
      ]}
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
      }}
      editable={{
        onBulkUpdate: (changes) => {
          return new Promise((resolve, reject) => {
            resolve();

            if (Object.keys(changes).length > 0) {
              const oldTimers = [...props.timers];
              Object.keys(changes).forEach((index) => {
                console.log(index);
                const changedTimer = changes[index].newData;
                delete changedTimer["tableData"];
                oldTimers[index] = changedTimer;
                console.log(changedTimer);
              });
              const ts = updateTimerNumbers(oldTimers);
              console.log(ts);

              props.setTimers(ts);
            }
          });
        },

        onRowDelete: (oldData) =>
          new Promise((resolve, reject) => {
            console.log("delete ");
            console.log(oldData);
            const oldTimers = [...props.timers];
            oldTimers.splice(oldData.tableData.id, 1);
            const updates = updateTimerNumbers(oldTimers);
            props.setTimers(updates);
            resolve();
          }),
      }}
    />
  );
}
