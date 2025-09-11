import React from "react";
import StudyAbroadList from "../components/StudyAbroad/StudyAbroadList";

export default function StudyAbroad() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Study Abroad</h1>
          <p className="text-gray-600 mt-2">
            Manage universities and study abroad programs
          </p>
        </div>
      </div>

      <StudyAbroadList />
    </div>
  );
}
