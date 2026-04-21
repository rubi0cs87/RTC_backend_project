const { generateToken } = require("../../utils/jwt");
const User = require("../models/user");
const Videogame = require("../models/videogames");
const bcrypt = require("bcrypt");

const register = async (req, res, next) => {
  try {
    const user = new User(req.body);
    const userExists = await User.findOne({ email: user.email });

    if (userExists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const userSaved = await user.save();
    return res.status(201).json(userSaved);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Error registering user" });
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }
    if (bcrypt.compareSync(password, user.password)) {
      const token = generateToken(user._id);
      return res.status(200).json({ token, user });
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

const changeRole = async (req, res, next) => {
  try {
    const { email } = req.params;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.role = user.role === "user" ? "admin" : "user";

    await user.save();

    res.status(200).json({
      message: "Role updated successfully",
      user: {
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating role" });
  }
};

const deleteUser = async (req, res, next) => {
  try {
    const { email } = req.params;

    const isAdmin = req.user.role === "admin";
    const isSelf = req.user.email === email;

    if (!isAdmin && !isSelf) {
      return res.status(403).json({
        message: "You can only delete your own account or you must be an admin",
      });
    }

    const userDeleted = await User.findOneAndDelete({ email });

    if (!userDeleted) {
      return res.status(404).json({ message: "User not found" });
    }
    return res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: "Error deleting user" });
  }
};

const putLibrary = async (req, res, next) => {
  try {
    const { email } = req.params;
    const { videogameId } = req.body;

    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (req.user.email !== email) {
      return res
        .status(403)
        .json({ message: "You can only update your own library" });
    }

    const videogame = await Videogame.findById(videogameId);

    if (!videogameId) {
      return res.status(404).json({ message: "Videogame not found" });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    if (user.library.some((id) => id.toString() === videogameId)) {
      return res.status(400).json({ message: "Videogame already in library" });
    }

    user.library.push(videogameId);
    await user.save();

    res.status(200).json({
      message: "Videogame added to library successfully",
      library: user.library,
    });
  } catch (error) {
    res.status(500).json({ message: "Error updating library" });
  }
};

module.exports = {
  register,
  login,
  getUsers,
  changeRole,
  putLibrary,
  deleteUser,
};
