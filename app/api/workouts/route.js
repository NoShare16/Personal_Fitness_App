import { NextResponse } from "next/server";
import connectDb from "../../../libs/database";
import Category from "../../../database/category.models";
import Workout from "../../../database/workout.models";
import Exercise from "../../../database/exercise.models";

export async function POST(request) {
  await connectDb();

  // Parse the request body to get the workout data and category ID.
  const { name, categoryId } = await request.json();

  // Create a new Workout document.
  const workout = await Workout.create({
    name,
    category: categoryId,
  });

  // Find the corresponding Category and add the new Workout to it.
  await Category.findByIdAndUpdate(
    categoryId,
    { $push: { workouts: workout._id } },
    { new: true, useFindAndModify: false }
  );

  // Send the response back.
  return NextResponse.json(
    { message: "Workout created and added to category" },
    { status: 201 }
  );
}

export async function GET(request) {
  await connectDb();

  // Extract the category ID from the query parameters.
  const categoryId = request.nextUrl.searchParams.get("categoryId");

  if (!categoryId) {
    return new Response(JSON.stringify({ error: "Category ID is required" }), {
      status: 400,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Find the workouts that are linked to the given category ID.
    const workouts = await Workout.find({ category: categoryId })
      .populate("category")
      .populate("exercises");

    // Send the response back.
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
