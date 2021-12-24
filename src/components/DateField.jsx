import React from "react";
import { connectField } from "uniforms";
import MobileDatePicker from "@mui/lab/MobileDatePicker";
import TextField from "@mui/material/TextField";
import AdapterDateFns from "@mui/lab/AdapterDateFns";
import LocalizationProvider from "@mui/lab/LocalizationProvider";

function MyDate({ onChange, value }) {
  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <MobileDatePicker
        label="Date mobile"
        inputFormat="MM/dd/yyyy"
        value={new Date()}
        onChange={() => {}}
        renderInput={(params) => <TextField {...params} />}
      />
    </LocalizationProvider>
  );
}

export default connectField(MyDate);
