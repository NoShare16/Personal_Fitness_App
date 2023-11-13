import { Schema, models, model } from "mongoose";

const ExerciseSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  workout: [{ type: Schema.Types.ObjectId, ref: "Workout" }],
  sets: [
    {
      weight: {
        type: Number,
        required: true,
        min: 0,
      },
      reps: {
        type: Number,
        required: true,
        min: 1,
      },
    },
  ],
});

const Exercise = models.Exercise || model("Exercise", ExerciseSchema);

export default Exercise;
