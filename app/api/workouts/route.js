import { NextResponse } from "next/server";
import connectDb from "../../../libs/database";
import Category from "../../../database/category.models";
import Workout from "../../../database/workout.models";
import Exercise from "../../../database/exercise.models";

export async function POST(request) {
  await connectDb();

  const { name, categoryId } = await request.json();

  const workout = await Workout.create({
    name,
    category: categoryId,
  });

  await Category.findByIdAndUpdate(
    categoryId,
    { $push: { workouts: workout._id } },
    { new: true, useFindAndModify: false }
  );

  return NextResponse.json(
    { message: "Workout created and added to category" },
    { status: 201 }
  );
}

export async function GET(request) {
  await connectDb();

  const categoryId = request.nextUrl.searchParams.get("categoryId");

  if (!categoryId) {
    return new Response(JSON.stringify({ error: "Category ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    const workouts = await Workout.find({ category: categoryId })
      .populate("category")
      .populate("exercises");

    return new Response(JSON.stringify({ workouts }), {
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Error in GET API:", error);
    return new Response(JSON.stringify({ error: "Internal Server Error" }), {
      status: 500,
      headers: { "Content-Type": "application/json" },
    });
  }
}

export async function DELETE(request) {
  await connectDb();

  const { workoutId } = await request.json();

  if (!workoutId) {
    return NextResponse.json(
      { message: "Workout ID is required" },
      { status: 400 }
    );
  }

  try {
    await Category.updateOne(
      { workouts: workoutId },
      { $pull: { workouts: workoutId } }
    );

    const deletedWorkout = await Workout.findByIdAndDelete(workoutId);

    if (!deletedWorkout) {
      return NextResponse.json(
        { message: "Workout not found" },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { message: "Workout deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Error in DELETE API:", error);
    return NextResponse.json(
      { message: "Error deleting workout", error: error.message },
      { status: 500 }
    );
  }
}
