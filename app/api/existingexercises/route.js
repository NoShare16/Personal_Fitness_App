import { NextResponse } from "next/server";
import connectDb from "../../../libs/database";
import Exercise from "../../../database/exercise.models";
import Workout from "../../../database/workout.models";

export async function PATCH(request) {
  await connectDb();

  const { workoutId, exerciseId } = await request.json();

  if (!workoutId || !exerciseId) {
    return NextResponse.json(
      { message: "Workout ID and Exercise ID are required" },
      { status: 400 }
    );
  }

  const updatedWorkout = await Workout.findByIdAndUpdate(
    workoutId,
    { $push: { exercises: exerciseId } },
    { new: true, useFindAndModify: false }
  );

  const updatedExercise = await Exercise.findByIdAndUpdate(
    exerciseId,
    { workout: workoutId },
    { new: true, useFindAndModify: false }
  );

  if (!updatedWorkout) {
    return NextResponse.json({ message: "Workout not found" }, { status: 404 });
  }

  return NextResponse.json(
    { message: "Exercise added to workout", data: updatedWorkout },
    { status: 200 }
  );
}
