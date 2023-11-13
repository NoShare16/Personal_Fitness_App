"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

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
  const [editableExercises, setEditableExercises] = useState<Exercise[]>([]);
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

  useEffect(() => {
    // Sync editableExercises state with exercises state
    setEditableExercises(exercises);
  }, [exercises]);

  const handleSetChange = (
    exerciseId: string,
    setIndex: number,
    key: keyof Set,
    value: number
  ) => {
    setEditableExercises(
      editableExercises.map((exercise) => {
        if (exercise._id === exerciseId) {
          const updatedSets = exercise.sets.map((set, index) => {
            if (index === setIndex) {
              return { ...set, [key]: value };
            }
            return set;
          });
          return { ...exercise, sets: updatedSets };
        }
        return exercise;
      })
    );
  };

  const saveSets = async (exerciseId: string) => {
    const exercise = editableExercises.find((ex) => ex._id === exerciseId);
    if (!exercise) return;

    try {
      const response = await fetch(`/api/exercises/`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ exerciseId, sets: exercise.sets }),
      });

      if (!response.ok) {
        // Handle response error...
        console.error("Error updating exercise:", response.statusText);
        return;
      }

      // Update the main exercises state with the new sets
      setExercises(
        exercises.map((ex) => (ex._id === exerciseId ? exercise : ex))
      );
    } catch (error) {
      console.error("Error saving sets:", error);
    }
  };

  // ... rest of your component

  return (
    <main className="m-6">
      <h1 className="font-bold text-2xl flex justify-center">Exercises</h1>
      {editableExercises.map((exercise) => (
        <div
          key={exercise._id}
          className="border-2 border-solid rounded-xl p-6 m-2"
        >
          <h2 className="font-bold text-xl flex justify-center">
            {exercise.name}
          </h2>
          {exercise.sets.map((set, index) => (
            <div key={index} className="flex justify-between">
              <div>
                <span className="font-bold">Set {index + 1}:</span>
                <label>
                  Weight (kg):
                  <input
                    type="number"
                    value={set.weight}
                    onChange={(e) =>
                      handleSetChange(
                        exercise._id,
                        index,
                        "weight",
                        Number(e.target.value)
                      )
                    }
                    className="bg-gray-100 text-black p-1" // Custom styles
                  />
                </label>
                <label>
                  Reps:
                  <input
                    type="number"
                    value={set.reps}
                    onChange={(e) =>
                      handleSetChange(
                        exercise._id,
                        index,
                        "reps",
                        Number(e.target.value)
                      )
                    }
                    className="bg-gray-100 text-black p-1" // Custom styles
                  />
                </label>
              </div>
            </div>
          ))}
          <button onClick={() => saveSets(exercise._id)}>Save Changes</button>
        </div>
      ))}
    </main>
  );
};

export default Exercises;
