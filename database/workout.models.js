import { Schema, models, model } from "mongoose";

const WorkoutSchema = new Schema({
  name: { type: String, required: true },
  exercises: [{ type: Schema.Types.ObjectId, ref: "Exercise" }],
  category: { type: Schema.Types.ObjectId, ref: "Category" },
});

const Workout = models.Workout || model("Workout", WorkoutSchema);

export default Workout;
