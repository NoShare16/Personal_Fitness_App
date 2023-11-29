import { NextResponse } from "next/server";
import connectDb from "../../../libs/database";
import Exercise from "../../../database/exercise.models";
import Workout from "../../../database/workout.models";

export async function POST(request) {
  await connectDb();

  const { name, workoutId, sets } = await request.json();

  if (!name) {
    return NextResponse.json(
      { message: "Exercise name is required" },
      { status: 400 }
    );
  }

  if (!Array.isArray(sets) || sets.length === 0) {
    return NextResponse.json(
      { message: "At least one set is required" },
      { status: 400 }
    );
  }

  try {
    const exercise = await Exercise.create({ name, workout: workoutId, sets });
    console.log("Exercise created:", exercise);

    const updatedWorkout = await Workout.findByIdAndUpdate(
      workoutId,
      { $push: { exercises: exercise._id } },
      { new: true, useFindAndModify: false }
    );

    if (!updatedWorkout) {
      console.log("Workout not found with ID:", workoutId);
      return NextResponse.json(
        { message: "Workout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Exercise created and added to workout",
        data: exercise,
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Error in creating exercise:", error);
    return NextResponse.json(
      { message: "Error creating exercise", error: error.message },
      { status: 500 }
    );
  }
}

export async function GET(request) {
  await connectDb();

  const workoutId = request.nextUrl.searchParams.get("workoutId");

  if (!workoutId) {
    return new Response(JSON.stringify({ error: "workout ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const exercises = await Exercise.find({ workout: workoutId }).populate(
      "workout"
    );

    return new Response(JSON.stringify({ exercises }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function PATCH(request) {
  await connectDb();

  const { exerciseId, sets } = await request.json();

  if (!exerciseId) {
    return NextResponse.json(
      { message: "Exercise ID is required" },
      { status: 400 }
    );
  }

  if (!Array.isArray(sets) || sets.length === 0) {
    return NextResponse.json(
      { message: "At least one set is required" },
      { status: 400 }
    );
  }

  try {
    const updatedExercise = await Exercise.findByIdAndUpdate(
      exerciseId,
      { sets },
      { new: true, runValidators: true, useFindAndModify: false }
    );

    if (!updatedExercise) {
      return NextResponse.json(
        { message: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      {
        message: "Exercise updated successfully",
        data: updatedExercise,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in updating exercise:", error);
    return NextResponse.json(
      { message: "Error updating exercise", error: error.message },
      { status: 500 }
    );
  }
}

export async function DELETE(request) {
  await connectDb();

  const { exerciseId } = await request.json();

  if (!exerciseId) {
    return NextResponse.json(
      { message: "Exercise ID is required" },
      { status: 400 }
    );
  }

  try {
    const deletedExercise = await Exercise.findByIdAndDelete(exerciseId);

    if (!deletedExercise) {
      return NextResponse.json(
        { message: "Exercise not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Exercise deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in deleting exercise:", error);
    return NextResponse.json(
      { message: "Error deleting exercise", error: error.message },
      { status: 500 }
    );
  }
}
