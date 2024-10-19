import { Schema, model, Types } from "mongoose";

const gameSchema = new Schema({
  name: {
    type: String,
    required: true,
    minLength: [4, "Need to be at least 4 char long!"]
  },
  image: {
    type: String,
    required: true,
    validate: /^https?:\/\//
  },
  price: {
    type: Number,
    required: true,
    min: [0, "Should be positive number!"]
  },
  description: {
    type: String,
    required: true,
    minLength: [10, "Min length is ten char long!"]
  },
  genre: {
    type: String,
    required: true,
    minLength: [2, "Min length is two char!"]
  },
  platform: {
    type: String,
    required: true,
    enum: ["PC", "Nintendo", "PS4", "PS5", "XBOX"],
  },
  boughtBy: [
    {
      type: Types.ObjectId,
      ref: "User",
    },
  ],
  owner: {
    type: Types.ObjectId,
    ref: "User",
  },
});

const Game = model("Game", gameSchema);

export default Game;
