import React from "react";

export default function SectionDisplay(props) {
  return (
    <div>
      {props.selectedWorkout != null ? props.selectedWorkout.name : "NOTHING"}
    </div>
  );
}
