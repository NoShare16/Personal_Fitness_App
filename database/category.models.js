import { Schema, models, model } from "mongoose";

const CategorySchema = new Schema({
  name: { type: String, required: true, unique: true },
  workouts: [{ type: Schema.Types.ObjectId, ref: "Workout" }],
});

const Category = models.Category || model("Category", CategorySchema);

export default Category;
