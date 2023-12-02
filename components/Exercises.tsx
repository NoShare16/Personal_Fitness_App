"use client";

import React, { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import Timer from "./Timer";

interface Set {
  weight: number;
  reps: number;
}

interface Exercise {
  _id: string;
  name: string;
  sets: Set[];
}

const Exercises: React.FC = (exercise) => {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [editableExercises, setEditableExercises] = useState<Exercise[]>([]);
  const [sets, setSets] = useState<Set[]>([]);
  const [newExerciseName, setNewExerciseName] = useState("");

  const searchParams = useSearchParams();
  const workoutId = searchParams.get("workoutId");

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
    setEditableExercises(exercises);
  }, [exercises]);

  const addNewExercise = async () => {
    if (!newExerciseName.trim()) return;

    try {
      const initialSet = { weight: 1, reps: 1 };
      const response = await fetch("/api/exercises", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: newExerciseName,
          workoutId: workoutId,
          sets: [initialSet],
        }),
      });

      if (!response.ok) {
        console.error("Error creating exercise:", response.statusText);
        return;
      }

      const newExercise = await response.json();
      setExercises([...exercises, newExercise]);
      setNewExerciseName("");

      window.location.reload();
    } catch (error) {
      console.error("Error adding new exercise:", error);
    }
  };

  const deleteExercise = async (exerciseId: string) => {
    try {
      const response = await fetch(`/api/exercises`, {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ exerciseId }),
      });

      if (!response.ok) {
        console.error("Error deleting exercise:", response.statusText);
        return;
      }

      setExercises(exercises.filter((exercise) => exercise._id !== exerciseId));
    } catch (error) {
      console.error("Error in deleteExercise function:", error);
    }
  };

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

  const addNewSet = (exerciseId: string) => {
    const newSet = { weight: 1, reps: 0 };
    setEditableExercises(
      editableExercises.map((exercise) => {
        if (exercise._id === exerciseId) {
          return { ...exercise, sets: [...exercise.sets, newSet] };
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
        console.error("Error updating exercise:", response.statusText);
        return;
      }

      setExercises(
        exercises.map((ex) => (ex._id === exerciseId ? exercise : ex))
      );
    } catch (error) {
      console.error("Error saving sets:", error);
    }
  };

  const deleteSet = (exerciseId: string, setIndex: number) => {
    setEditableExercises(
      editableExercises.map((exercise) => {
        if (exercise._id === exerciseId) {
          const updatedSets = exercise.sets.filter(
            (_, index) => index !== setIndex
          );
          return { ...exercise, sets: updatedSets };
        }
        return exercise;
      })
    );
  };

  return (
    <main className="m-6 flex items-center flex-col">
      <h1 className="font-bold text-2xl flex justify-center">Exercises</h1>
      <div className="my-4 flex-col flex m-2 border-2 border-solid rounded p-2 max-w-lg">
        <input
          type="text"
          value={newExerciseName}
          onChange={(e) => setNewExerciseName(e.target.value)}
          placeholder="Exercise Name"
          className="bg-black"
        />
        <button
          onClick={addNewExercise}
          className="border-2 border-solid rounded font-semibold text-yellow-300 "
        >
          Add Exercise
        </button>
      </div>

      {editableExercises.map((exercise) => (
        <div
          key={exercise._id}
          className="border-2 border-solid rounded-xl p-6 m-2 max-w-lg "
        >
          <h2 className="font-bold text-xl flex justify-center">
            {exercise.name}
          </h2>
          <Timer />
          {exercise.sets.map((set, index) => (
            <div key={index}>
              <div className="border border-solid rounded m-1 mt-5">
                <span className="font-bold p-2">Set {index + 1}:</span>
                <button
                  onClick={() => deleteSet(exercise._id, index)}
                  className="text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
                <label>
                  <div className="flex justify-around">
                    <span className="text-teal-300 p-2 w-60">Weight(kg):</span>
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
                      className="bg-black text-teal-300 p-1 border border-solid rounded w-full"
                    />
                    <input type="checkbox" className="m-2 w-9" />
                  </div>
                </label>
                <label>
                  <div className="flex justify-around">
                    <span className="text-cyan-300 p-2 w-60">Reps:</span>
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
                      className="bg-black text-cyan-300 p-1 border border-solid rounded w-full"
                    />
                    <input type="checkbox" className="m-2 w-9" />
                  </div>
                </label>
              </div>
            </div>
          ))}
          <div className="flex-col flex gap-4 mt-2">
            <button
              className="text-black bg-white border border-solid rounded font-semibold "
              onClick={() => addNewSet(exercise._id)}
            >
              Add Set
            </button>
            <button
              className="text-black bg-white border border-solid rounded font-semibold"
              onClick={() => saveSets(exercise._id)}
            >
              Save Changes
            </button>
            <button
              className="text-red-500 border border-solid rounded"
              onClick={() => deleteExercise(exercise._id)}
            >
              Delete Exercise
            </button>
          </div>
        </div>
      ))}
    </main>
  );
};

export default Exercises;
