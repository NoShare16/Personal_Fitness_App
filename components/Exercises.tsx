"use client";

import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import React from "react";

interface Set {
  weight: number;
  reps: number;
}

interface Exercise {
  _id: string;
  name: string;
  sets: Set[];
}

const Exercises: React.FC = () => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const workoutId = searchParams.get("workoutId");

      if (workoutId) {
        try {
          const response = await fetch(`/api/exercises?workoutId=${workoutId}`);
          if (!response.ok) {
            console.error(
              "Error in network response:",
              response.status,
              response.statusText
            );
            throw new Error(`HTTP Error: ${response.status}`);
          }

          const data = await response.json();
          if (data.exercises && data.exercises.length > 0) {
            setExercises(data.exercises);
          } else {
            console.log("Received empty exercises array");
          }
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      } else {
        console.log("workoutId is missing");
      }
    };
    fetchData();
  }, [searchParams]);
  return (
    <main className="m-6">
      <h1 className="font-bold text-2xl flex justify-center">Exercises</h1>
      {exercises.map((exercise) => (
        <div key={exercise._id}>
          <div className="border-2 border-solid rounded-xl p-6 m-2">
            <h2 className="font-bold text-xl flex justify-center">
              {exercise.name}
            </h2>
            {exercise.sets.map((set, index) => (
              <div key={index} className="flex justify-between">
                <div>
                  <span className="font-bold"> Set {index + 1}: </span>{" "}
                  <span className="text-teal-300">Weight =</span> {set.weight}{" "}
                  kg <span className="text-cyan-300">Reps = </span>
                  {set.reps}
                </div>
                <input type="checkbox" />
              </div>
            ))}
          </div>
        </div>
      ))}
    </main>
  );
};

export default Exercises;
