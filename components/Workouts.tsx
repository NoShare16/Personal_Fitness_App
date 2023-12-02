"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";

interface Exercise {
  _id: string;
  name: string;
}

interface Workout {
  _id: string;
  name: string;
  exercises: Exercise[];
}

const Workouts: React.FC = () => {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [newWorkoutName, setNewWorkoutName] = useState("");
  const searchParams = useSearchParams();
  const categoryId = searchParams.get("categoryId");

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

  const createWorkout = async () => {
    if (!newWorkoutName.trim()) return;

    try {
      const response = await fetch("/api/workouts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: newWorkoutName, categoryId }),
      });

      if (!response.ok) {
        console.error("Error creating workout:", response.statusText);
        return;
      }

      const newWorkout = await response.json();
      setWorkouts([...workouts, newWorkout]);
      setNewWorkoutName("");

      window.location.reload();
    } catch (error) {
      console.error("Error adding new workout:", error);
    }
  };

  const deleteWorkout = async (workoutId: string) => {
    try {
      const response = await fetch(`/api/workouts`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ workoutId }),
      });

      if (!response.ok) {
        console.error("Error deleting workout:", response.statusText);
        return;
      }

      setWorkouts(workouts.filter((workout) => workout._id !== workoutId));
    } catch (error) {
      console.error("Error in deleteWorkout function:", error);
    }
  };

  return (
    <main className="m-6">
      <h1 className="font-bold text-2xl flex justify-center">
        Workout Collection
      </h1>

      <div className="my-4 border-2 border-solid rounded-xl flex flex-col gap-2 m-4 p-4 ">
        <input
          type="text"
          value={newWorkoutName}
          onChange={(e) => setNewWorkoutName(e.target.value)}
          placeholder=" New Workout "
          className="bg-black "
        />
        <button onClick={createWorkout} className="text-yellow-300">
          Create Workout
        </button>
      </div>

      {workouts &&
        workouts.map((workout) => (
          <section
            key={workout._id}
            className="flex flex-col justify-center m-4"
          >
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
            <button
              onClick={() => deleteWorkout(workout._id)}
              className="text-red-500 font-bold"
            >
              Delete Workout
            </button>
          </section>
        ))}
    </main>
  );
};

export default Workouts;
