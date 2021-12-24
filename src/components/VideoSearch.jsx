import React from "react";
import { ref, listAll } from "firebase/storage";

export default function VideoSearch(props) {
  const [filenames, setFilenames] = React.useState([]);
  const [filtered, setFiltered] = React.useState([]);

  function updateFilter(string) {
    if (string.length === 0) {
      setFiltered([...filenames]);
    } else {
      const temp = filenames.filter((file) => {
        return file.toLowerCase().includes(string.toLowerCase());
      });
      setFiltered(temp);
    }
  }

  React.useEffect(() => {
    const listRef = ref(props.storage, "movement-videos");
    return listAll(listRef)
      .then((res) => {
        var fileNames = [];
        res.items.forEach((itemRef) => {
          // All the items under listRef.
          // console.log(itemRef.name);
          fileNames.push(itemRef.name);
        });
        fileNames.unshift("NONE");
        setFilenames(fileNames);
        setFiltered(fileNames);
        // console.log("SUCCESSFULLY FETCHED FILENAMES");
      })
      .catch((error) => {
        console.log("ERROR getting list of movements: ", error);
      });
  }, []);

  return (
    <div>
      <label
        htmlFor="email"
        className="block text-sm font-medium text-gray-700"
      >
        Video Name
      </label>
      <div className="mt-1">
        <input
          type="email"
          onChange={(evt) => {
            updateFilter(evt.target.value);
          }}
          name="email"
          id="email"
          className="shadow-sm py-2 border-2 px-4 focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
          placeholder="Search"
        />
      </div>
      <ul className="divide-y divide-gray-200 h-64 overflow-y-auto">
        {filtered.map((filename) => (
          <li key={filename} className="py-4 flex">
            <div className="ml-3">
              <button
                onClick={() => {
                  //   alert("aldkfjalsdkjfl");
                  props.videoSelected(filename);
                }}
                className="text-sm font-medium text-gray-900"
              >
                {filename}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}
