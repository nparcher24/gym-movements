import React from "react";
import "./App.css";
import BasePage from "./pages/BasePage";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import SetupPage from "./pages/SetupPage";

function App() {
  const [workouts, setWorkouts] = React.useState([
    // More people...
  ]);

  const [selectedWorkout, setSelectedWorkout] = React.useState(null);

  const addWorkout = (newWorkout) => {
    const newWorkouts = [...workouts];
    newWorkouts.push(newWorkout);
    setWorkouts(newWorkouts);
  };

  const updateWorkout = (workout, index) => {
    const newWorkouts = [...workouts];
    newWorkouts[index] = workout;
    setWorkouts(newWorkouts);
  };

  return (
    <div>
      <Router>
        <Routes>
          <Route
            path="/setup"
            element={
              <SetupPage
                workouts={workouts}
                setWorkouts={setWorkouts}
                addWorkout={addWorkout}
                updateWorkout={updateWorkout}
                selectedWorkout={selectedWorkout}
                setSelectedWorkout={setSelectedWorkout}
              />
            }
          />
          <Route
            path="/"
            element={<BasePage selectedWorkout={selectedWorkout} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
