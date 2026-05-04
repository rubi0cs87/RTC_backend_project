const { deleteFile } = require("../../utils/deletefile");
const Videogame = require("../models/videogames");
const User = require("../models/user");

const getVideogames = async (req, res, next) => {
  try {
    const videogames = await Videogame.find();
    return res.status(200).json(videogames);
  } catch (error) {
    console.log("Error in getVideogames controller:", error);
    return res.status(400).json({ error: error.message });
  }
};

const postVideogame = async (req, res, next) => {
  try {
    const newVideogame = new Videogame(req.body); 
    const VideogameExists = await Videogame.findOne({title: newVideogame.title });

    if (VideogameExists) {
      return res.status(400).json({ message: "Videogame already exists" });
    }

    if (req.file) {
      newVideogame.videogameImg = req.file.secure_url;
    }

    const videogameSaved = await newVideogame.save();
    return res.status(201).json(videogameSaved);
    
  } catch (error) {
    console.log("Error in postVideogame controller:", error);
    return res.status(400).json({ error: error.message });
  }
};

const updateVideogame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const existingVideogame = await Videogame.findById(id);

    if (!existingVideogame) {
      return res.status(404).json({ message: "Videogame not found" });
    }

    if (req.file) {
      await deleteFile(existingVideogame.videogameImg);
      req.body.videogameImg = req.file.secure_url;
    }

    const videogameUpdated = await Videogame.findByIdAndUpdate(
      id,
      req.body,
      { new: true },
    );
    return res.status(200).json(videogameUpdated);
  } catch (error) {
    console.log("Error in updateVideogame controller:", error);
    return res.status(400).json({ error: error.message });
  }
};

const deleteVideogame = async (req, res, next) => {
  try {
    const { id } = req.params;
    const videogameDeleted = await Videogame.findByIdAndDelete(id);

    if (!videogameDeleted) {
      return res.status(404).json({ message: "Videogame not found" });
    }

    await User.updateMany(
      { library: id },
      { $pull: { library: videogameDeleted._id } },
    );

    await deleteFile(videogameDeleted.videogameImg);

    return res.status(200).json({
      message: "Videogame deleted successfully",
      elemento: videogameDeleted,
    });
  } catch (error) {
    console.log("Error in deleteVideogame controller:", error);
    return res.status(400).json({ error: error.message });
  }
};

module.exports = {
  getVideogames,
  postVideogame,
  updateVideogame,
  deleteVideogame,
};
