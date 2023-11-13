"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Exercise {
  _id: string;
  name: string;
  // Include other properties of Exercise as needed
}

interface Workout {
  _id: string;
  name: string;
  exercises: Exercise[];
  // Include other properties as per your data model
}

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const searchParams = useSearchParams();

  useEffect(() => {
    const fetchData = async () => {
      const categoryId = searchParams.get("categoryId");

      if (categoryId) {
        try {
          const response = await fetch(
            `/api/workouts?categoryId=${categoryId}`
          );
          if (!response.ok) {
            console.error(
              "Error in network response:",
              response.status,
              response.statusText
            );
            throw new Error(`HTTP Error: ${response.status}`);
          }

          const data = await response.json();
          if (data.workouts && data.workouts.length > 0) {
            setWorkouts(data.workouts);
          } else {
            console.log("Received empty workouts array");
          }
        } catch (error) {
          console.error("Error fetching workouts:", error);
        }
      } else {
        console.log("categoryId is missing");
      }
    };

    fetchData();
  }, [searchParams]);

  return (
    <main className="m-6">
      <h1 className="font-bold text-2xl flex justify-center">
        Workout Collection
      </h1>
      {workouts.map((workout) => (
        <section key={workout._id} className="flex flex-col justify-center m-4">
          <Link
            href={{
              pathname: "/exercises",
              query: { workoutId: workout._id },
            }}
          >
            <div className="flex flex-col justify-center items-center border-2 border-solid border-white p-4 rounded-xl m-4">
              <h2 className="font-bold text-xl">{workout.name}</h2>
              {workout.exercises.map((exercise) => (
                <div key={exercise._id} className="text-lg">
                  {exercise.name}
                </div>
              ))}
            </div>
          </Link>
        </section>
      ))}
    </main>
  );
};

export default Workouts;
