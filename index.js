require("dotenv").config();
const express = require("express");
const userRouter = require("./src/api/routes/user");
const videogamesRouter = require("./src/api/routes/videogames");
const { connectDB } = require("./src/config/db");
const { connectCloudinary } = require("./src/config/cloudinary");

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
