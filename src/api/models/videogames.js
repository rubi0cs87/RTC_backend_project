const { genSalt } = require("bcrypt");
const mongoose = require("mongoose");
const { platform } = require("node:os");

const videogameSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    platform: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    img: { type: String, required: true },
  },
  {
    timestamps: true,
  },
);

const Videogame = mongoose.model("videogames", videogameSchema, "videogames");

module.exports = Videogame;
