import { DocumentDuplicateIcon } from "@heroicons/react/outline";
import MaterialTable from "@material-table/core";
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
