import React from "react";
import "./App.css";
import BasePage from "./pages/BasePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import SetupPage from "./pages/SetupPage";
import { StyledFirebaseAuth } from "react-firebaseui";
import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import { collection, query, onSnapshot, doc, getDoc } from "firebase/firestore";
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import ProgressModal from "./components/ProgressModal";
// import Temp from "./pages/Temp";
import Timer from "./components/Timer";
import NewSetupPage from "./pages/NewSetupPage";
import NewAddWorkout from "./pages/NewAddWorkout";
import VideoSearch from "./components/VideoSearch";
const ldb = new Dexie("videos");
ldb.version(1).stores({ videos: "++id,name,data" });

function App() {
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

  const [downloadProgress, setDownloadProgress] = React.useState(1.0);
  const firebaseApp = firebase.initializeApp(firebaseConfig);
  const db = getFirestore();
  const storage = getStorage(firebaseApp);
  const allItems = useLiveQuery(() => ldb.videos.toArray(), []);
  const [selectedWID, setSelectedWID] = React.useState(null);
  const [selectedWorkout, setSelectedWorkout] = React.useState(null);

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

  React.useEffect(() => {
    async function fetchMyWorkout() {
      if (selectedWID !== null) {
        const q = query(collection(db, "workouts"));
        const docRef = doc(db, "workouts", selectedWID);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          // console.log("Document Data: ", docSnap.data());
          var aworkout = docSnap.data();
          // console.log(aworkout);
          aworkout["dateMade"] = aworkout.dateMade.toDate();
          if (aworkout.workoutDate != null) {
            // aworkout["workoutDate"] = "asdf";
            aworkout["workoutDate"] = aworkout.workoutDate.toDate();
          }
          aworkout["id"] = doc.id;

          setSelectedWorkout(aworkout);
          // console.log(aworkout);
        } else {
          console.log("NO SUCH DOCUMENT");
        }
      }
    }

    fetchMyWorkout();
  }, [selectedWID]);

  React.useEffect(() => {
    //Download all new
    if (selectedWorkout !== null) {
      //Create a list of files to download
      setDownloadProgress(0.0);

      var tempNames = [];

      //Delete all local items
      allItems.map((item) => {
        ldb.videos.delete(item.id);
        return null;
      });

      var total = 0;
      //Determine total number of videos to download
      selectedWorkout.sections.map((section) => {
        let aSection = section.movements.filter(
          (movement) => movement.videoName !== "NONE"
        );
        total = total + aSection.length;
        return null;
      });
      // console.log("TOTAL WORKOUTS TO DOWNLOAD: ", total);

      var progress = 0.0;

      selectedWorkout.sections.forEach((section) => {
        section.movements.forEach((movement) => {
          if (movement.videoName !== "NONE") {
            const tempRef = ref(
              storage,
              `movement-videos/${movement.videoName}`
            );

            getDownloadURL(tempRef).then((url) => {
              const xhr = new XMLHttpRequest();
              xhr.responseType = "blob";
              xhr.onload = (event) => {
                const blob = xhr.response;
                //Persist locally
                event.preventDefault();
                ldb.videos.add({ name: movement.videoName, data: blob });
                // console.log(blob);
                // console.log("DOWNLOADED: " + movement.videoName + " from " + url);
                progress = progress + 1 / total;
                setDownloadProgress(progress);
                // console.log("Progress: ", progress);
              };
              xhr.open("GET", url);
              xhr.send();

              tempNames.push(url);
            });
            return null;
          }
        });
        return null;
      });
      // console.log("Names to download: ", tempNames);
    }
  }, [selectedWorkout]);

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
            path="/test"
            element={
              <div className="w-96 mx-auto ">
                <VideoSearch storage={storage} />
              </div>
            }
          />
          <Route path="/timer" element={<Timer />} />
          <Route
            path="/setup"
            element={
              <NewSetupPage //</Router>SetupPage
                selectedWorkout={selectedWorkout}
                setSelectedWID={setSelectedWID}
                db={db}
                storage={storage}
                setSele
              />
            }
          />
          <Route
            path="/"
            element={
              <BasePage
                selectedWorkout={selectedWorkout}
                allItems={allItems}
                ldb={ldb}
              />
            }
          />
        </Routes>
      </Router>
      {downloadProgress < 1.0 ? (
        <ProgressModal progress={downloadProgress} />
      ) : (
        <div />
      )}
    </div>
  );
}

export default App;
