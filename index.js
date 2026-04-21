const cloudinary = require("cloudinary").v2;
require("dotenv").config();
const express = require("express");
const userRouter = require("./src/api/routes/user");
const videogamesRouter = require("./src/api/routes/videogames");
const { connectDB } = require("./src/config/db");
const { connectCloudinary } = require("./src/config/cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const app = express();

app.use(express.json());

app.use("/api/user", userRouter);
app.use("/api/videogames", videogamesRouter);

app.use(/.*/, (req, res, next) => {
  return res.status(404).json("Ruta no encontrada");
});

const startServer = async () => {
  try {
    await connectCloudinary();
    await connectDB();

    app.listen(3000, () => {
      console.log("Server running in: http://localhost:3000");
    });
  } catch (error) {
    console.log("Error starting server:", error);
  }
};

startServer();
