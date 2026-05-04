const mongoose = require("mongoose");
const cloudinary = require("cloudinary");
const dotenv = require("dotenv");
const path = require("node:path");
dotenv.config();
const Videogame = require("../../api/models/videogames.js");
const videogames = require("../../data/videogames_data.js");

const launchSeed = async () => {
  try {
    await mongoose.connect(process.env.DB_URL);
    console.log("Connected to MongoDB");
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
    await Videogame.collection.drop();
    console.log("Collection dropped");
    } catch (error) {
      console.log("No collection to drop");
    }
    
    console.log("Uploading images to Cloudinary...");
      for (const videogame of videogames) {
        const localImagePath = path.resolve(__dirname, "../../data", videogame.videogameImg);
        const result = await cloudinary.v2.uploader.upload(localImagePath, {
          folder: "videogames",
          public_id: path.parse(videogame.videogameImg).name,
          overwrite: true,
        });
        videogame.videogameImg = result.secure_url;
        console.log(`Image for ${videogame.title} uploaded`);
      }
      
    await Videogame.insertMany(videogames);
    console.log("Data inserted");

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error in launchSeed:", error.message);
  }
};

launchSeed();
