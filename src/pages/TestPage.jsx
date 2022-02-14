import React from "react";

export default function TestPage(props) {
  function upHandler(event) {
    console.log("EVENT");
    console.log(event);
  }

  React.useEffect(() => {
    window.addEventListener("keyup", upHandler);
    return () => {
      window.removeEventListener("keyup", upHandler);
    };
  });

  return (
    <div className="w-screen h-screen text-center justify-center bg-green-100 align-middle">
      <h1 className="my-auto h-full ">test page</h1>
    </div>
  );
}
