const mongoose = require("mongoose");
const Videogame = require("../../api/models/videogames.js");
const videogames = require("../../data/videogames_data.js");

const launchSeed = async () => {
  try {
    await mongoose.connect(
      "mongodb://ssanchiz:oP4WiiMcP9Iujhdv@ac-2v2fa9x-shard-00-00.ddkycc2.mongodb.net:27017,ac-2v2fa9x-shard-00-01.ddkycc2.mongodb.net:27017,ac-2v2fa9x-shard-00-02.ddkycc2.mongodb.net:27017/?ssl=true&replicaSet=atlas-mho4e7-shard-0&authSource=admin&appName=Cluster0",
    );
    console.log("Connected to MongoDB");
    await Videogame.collection.drop();
    console.log("Collection dropped");
    await Videogame.insertMany(videogames);
    console.log("Data inserted");
    await mongoose.disconnect();
    console.log("Disconnected from MongoDB");
  } catch (error) {
    console.error("Error in launchSeed:", error.message);
  }
};

launchSeed();
