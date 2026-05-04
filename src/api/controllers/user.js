const getOrCreateDefaultAvatar = require("../../utils/defaultAvatar");
const { deleteFile } = require("../../utils/deletefile");
const { generateToken } = require("../../utils/jwt");
const User = require("../models/user");
const Videogame = require("../models/videogames");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");


const register = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }
    const user = new User({ ...req.body, role: "user" });
    const userExists = await User.findOne({ email: user.email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    if (req.file) {
      user.avatar = req.file.secure_url; 
    } else {
      user.avatar = await getOrCreateDefaultAvatar();
    }

    const userSaved = await user.save();
    const userResponse = userSaved.toObject();
    delete userResponse.password;
    return res.status(201).json(userResponse);
  } catch (error) {
    return res.status(500).json({ message: "Error registering user" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user._id);
      const { password: _pw, ...userResponse } = user.toObject();
      return res.status(200).json({ token, user: userResponse });

    } else {
      return res.status(400).json({ message: "Invalid credentials" });
    }
  } catch (error) {
    return res.status(500).json({ message: "Error logging in" });
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find().populate("library", "title");
    res.status(200).json(users);
  } catch (error) {
    res.status(400).json({ message: "Error getting users" });
  }
};

const updateUser = async (req, res, next) => {
  try {
    const currentUser = await User.findById(req.user._id);
    if (!currentUser) {
      return res.status(404).json({ message: "User not found" });
    }

    if (req.file) {
      if (currentUser.avatar) {
        await deleteFile(currentUser.avatar);
      }
      currentUser.avatar = req.file.secure_url;
    } else {
      if (currentUser.avatar && !currentUser.avatar.includes("userDefault")) {
        await deleteFile(currentUser.avatar);
      }
      currentUser.avatar = await getOrCreateDefaultAvatar();
    }
    
    const userUpdated = await User.findByIdAndUpdate(
      currentUser._id,
      { avatar: currentUser.avatar },
      { new: true }
    );
    
    return res.status(200).json(userUpdated);
  } catch (error) {
    return res.status(400).json({ message: "Error updating user" });
  }
};

const changeRole = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if(user.role === "user") {
      user.role = "admin";
    await user.save();

    return res.status(200).json({
      message: "User upgraded to admin successfully",
      user: {
        email: user.email,
        role: user.role,
      },
    });
    } 
      return res.status(400).json({
        message: "User is already an admin and cannot be demoted", 
      });
      
  } catch (error) {
    res.status(500).json({ message: "Error updating role" });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { email } = req.params;
    const userToEliminate = await User.findOne({ email });

    if (!userToEliminate) {
      return res.status(404).json({ message: "User not found" });
    }

    const isAdmin = req.user.role === "admin";
    const isSelf = req.user.email === email;

    if (!isSelf && !(isAdmin && userToEliminate.role === "user")) {
      return res.status(403).json({ message: "Invalid operation, you can only delete your own account or an admin can delete a user" });
    }

    if (userToEliminate.role === "admin") {
      const adminCount = await User.countDocuments({ role: "admin" });
      if (adminCount <= 1) {
        return res.status(400).json({ message: "Cannot delete the last admin" });
      }
    }

    if (userToEliminate.avatar) {
      await deleteFile(userToEliminate.avatar);
    }

    await User.findByIdAndDelete(userToEliminate._id);
  

    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Error deleting user" });
  }
};

const putLibrary = async (req, res, next) => {
  try {
    const { videogameId } = req.body;

    if (!videogameId) {
      return res.status(400).json({ message: "videogameId is required" });
    }

    if (!mongoose.Types.ObjectId.isValid(videogameId)) {
      return res.status(400).json({ message: "Invalid videogameId format" });
    }

    const videogameExists = await Videogame.findById(videogameId);
    if (!videogameExists) {
      return res.status(404).json({ message: "Videogame not found" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, library: { $ne: videogameId } },
      { $addToSet: { library: videogameId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Videogame already in library" });
    }

    res.status(200).json({
      message: "Library updated successfully",
      library: updatedUser.library,
    });

  } catch (error) {
    res.status(500).json({ message: "Error updating library", error: error.message });
  }
};

const deleteLibrary = async (req, res, next) => {
  try {
    const {videogameId} = req.body;
    if (!videogameId) {
      return res.status(400).json({ message: "videogameId is required" });
    }
    if (!mongoose.Types.ObjectId.isValid(videogameId)) {
      return res.status(400).json({ message: "Invalid videogameId format" });
    }
    const videogameExists = await Videogame.findById(videogameId);
    if (!videogameExists) {
      return res.status(404).json({ message: "Videogame not found" });
    }

    const updatedUser = await User.findOneAndUpdate(
      { _id: req.user._id, library: videogameId },
      { $pull: { library: videogameId } },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(400).json({ message: "Videogame not in library" });
    }
    res.status(200).json({
      message: "Videogame removed from library successfully",
      library: updatedUser.library,
    });
  } catch (error) {
    res.status(500).json({ message: "Error removing videogame from library", error: error.message });
  }
}

module.exports = {
  register,
  login,
  getUsers,
  changeRole,
  putLibrary,
  deleteUser,
  updateUser,
  deleteLibrary,
};
