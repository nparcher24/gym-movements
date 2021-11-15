import React from "react";
import SectionDisplay from "../components/SectionDisplay";

export default function BasePage(props) {
  return (
    <div>
      <div className="flex flex-row bg-green-500">
        <div className="w-1/3 h-screen bg-green-200">
          <SectionDisplay {...props} />
        </div>

        <div className="w-2/3 h-screen bg-red-200"></div>
      </div>
    </div>
  );
}
