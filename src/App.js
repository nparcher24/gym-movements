import React from "react";
import "./App.css";
import BasePage from "./pages/BasePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SetupPage from "./pages/SetupPage";
// import { getAnalytics } from "firebase/analytics";
import { StyledFirebaseAuth } from "react-firebaseui";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import { writeBatch, doc, deleteDoc } from "firebase/firestore";

function App() {
  const [workouts, setWorkouts] = React.useState([
    // More people...
  ]);

  //Fetch workouts from firestore
  const firebaseConfig = {
    apiKey: "AIzaSyD3S0yeE5zI5gaA-IaC2HE8ZEd9wdiyvSs",
    authDomain: "leaderboard-d5992.firebaseapp.com",
    projectId: "leaderboard-d5992",
    storageBucket: "leaderboard-d5992.appspot.com",
    messagingSenderId: "76465362834",
    appId: "1:76465362834:web:99057759e8dc4ca3e2534b",
    measurementId: "G-QDCWRPP56R",
  };

  firebase.initializeApp(firebaseConfig);
  const db = getFirestore();

  const saveToCloud = () => {
    alert("aldkfj");
    const batch = writeBatch(db);

    workouts.forEach((workout) => {
      const aRef = doc(db, "workouts", workout.name);
      batch.set(aRef, workout);
    });

    batch.commit();
  };

  const deleteFromCloud = (toDelete) => {
    deleteDoc(doc(db, "workouts", toDelete.name));
  };

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

  const uiConfig = {
    // Popup signin flow rather than redirect flow.
    signInFlow: "popup",
    // Redirect to /signedIn after sign in is successful. Alternatively you can provide a callbacks.signInSuccess function.
    signInSuccessUrl: "/setup",
    // We will display Google and Facebook as auth providers.
    signInOptions: [firebase.auth.EmailAuthProvider.PROVIDER_ID],
  };

  const [isSignedIn, setIsSignedIn] = React.useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  React.useEffect(() => {
    const unregisterAuthObserver = firebase
      .auth()
      .onAuthStateChanged((user) => {
        setIsSignedIn(!!user);
      });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, []);

  if (!isSignedIn) {
    return (
      <div className="flex flex-col w-screen h-screen bg-gray-800 items-center space-y-4 py-24">
        <h1 className="text-4xl text-white font-bold">WORKOUT LOGIN</h1>
        <p className="text-xl text-white">Please sign in to proceed</p>
        <StyledFirebaseAuth
          uiConfig={uiConfig}
          firebaseAuth={firebase.auth()}
        />
      </div>
    );
  }

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
                saveToCloud={saveToCloud}
                deleteFromCloud={deleteFromCloud}
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
