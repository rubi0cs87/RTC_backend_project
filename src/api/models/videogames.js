const mongoose = require("mongoose");

const videogameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    platform: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    videogameImg: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Videogame = mongoose.model("videogames", videogameSchema, "videogames");

module.exports = Videogame;
