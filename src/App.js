import React from "react";
import "./App.css";
import BasePage from "./pages/BasePage";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { initializeApp } from "firebase/app";
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc } from "firebase/firestore";
import { getStorage, ref, getDownloadURL } from "firebase/storage";
import Dexie from "dexie";
import { useLiveQuery } from "dexie-react-hooks";
import ProgressModal from "./components/ProgressModal";
import LoginForm from "./components/LoginForm";
import NewSetupPage from "./pages/NewSetupPage";
import TestPage from "./pages/TestPage";
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
  const firebaseApp = initializeApp(firebaseConfig);
  const auth = getAuth(firebaseApp);
  const db = getFirestore(firebaseApp);
  const storage = getStorage(firebaseApp);
  const allItems = useLiveQuery(() => ldb.videos.toArray(), []);
  const [selectedWID, setSelectedWID] = React.useState(null);
  const [selectedWorkout, setSelectedWorkout] = React.useState(null);
  const [downloadedVideos, setDownloadedVideos] = React.useState([]);
  const [finished, setFinished] = React.useState(false);

  const handleLoginSuccess = () => {
    // Navigate to setup page after successful login
    window.location.href = "/setup";
  };

  const [isSignedIn, setIsSignedIn] = React.useState(false); // Local signed-in state.

  // Listen to the Firebase Auth state and set the local state.
  React.useEffect(() => {
    const unregisterAuthObserver = onAuthStateChanged(auth, (user) => {
      setIsSignedIn(!!user);
    });
    return () => unregisterAuthObserver(); // Make sure we un-register Firebase observers when the component unmounts.
  }, [auth]);

  React.useEffect(() => {
    async function fetchMyWorkout() {
      if (selectedWID !== null) {
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

          console.log("JUST SET THE WORKOUT");
          setSelectedWorkout(aworkout);

          // console.log(aworkout);
        } else {
          console.log("NO SUCH DOCUMENT");
        }
      }
    }

    fetchMyWorkout();
  }, [selectedWID, db]);

  // function addToDownloadedVids(video) {
  //   setDownloadedVideos((old) => [...old, video]);
  // }

  React.useEffect(() => {
    //Download all new
    if (selectedWorkout !== null) {
      //Create a list of files to download
      setDownloadProgress(0.0);

      console.log("STARTED DOWNLOADING ALL VIDEOS");

      //Delete all local items
      // allItems.map((item) => {
      //   ldb.videos.delete(item.id);
      //   return null;
      // });

      var total = 0;
      //Determine total number of videos to download
      selectedWorkout.sections.map((section) => {
        let aSection = section.movements.filter(
          (movement) => movement.videoName !== "NONE"
        );
        total = total + aSection.length;
        return null;
      });

      var progress = 0.0;

      setDownloadedVideos([]);

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

                setDownloadedVideos((old) => [
                  ...old,
                  { name: movement.videoName, data: blob },
                ]);

                progress = progress + 1 / total;

                if (progress >= 1.0) {
                  setFinished(true);
                }

                setDownloadProgress(progress);
              };

              xhr.open("GET", url);
              xhr.send();
            });
            return null;
          }
        });
        return null;
      });

      // console.log("Names to download: ", tempNames);
    }
  }, [selectedWorkout, storage]);

  if (!isSignedIn) {
    return (
      <div className="flex flex-col w-screen h-screen bg-gray-800 items-center justify-center px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-4xl text-white font-bold mb-2">WORKOUT LOGIN</h1>
            <p className="text-xl text-white">Please sign in to proceed</p>
          </div>
          <LoginForm 
            auth={auth} 
            onLoginSuccess={handleLoginSuccess}
          />
        </div>
      </div>
    );
  }

  return (
    <div>
      <Router>
        <Routes>
          {/* <Route
            path="/summary"
            element={
              <SummaryPage
                downloadedVideos={downloadedVideos}
                selectedWorkout={selectedWorkout}
              />
            }
          /> */}
          <Route path="/test" element={<TestPage />} />
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
                downloadedVideos={downloadedVideos}
                selectedWorkout={selectedWorkout}
                allItems={allItems}
                finished={finished}
                ldb={ldb}
              />
            }
          />
        </Routes>
      </Router>
      {downloadProgress < 0.99 ? (
        <ProgressModal progress={downloadProgress} />
      ) : (
        <div />
      )}
    </div>
  );
}

export default App;
