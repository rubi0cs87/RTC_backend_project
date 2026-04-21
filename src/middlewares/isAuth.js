const User = require("../api/models/user");
const { verifyToken } = require("../utils/jwt");

const isAuth = async (req, res, next) => {
  try {
    const [, token] = req.headers.authorization.split(" ");

    const { id } = verifyToken(token);

    const user = await User.findById(id);

    user.password = null;
    req.user = user;
    next();
  } catch (error) {
    return res.status(401).json("Unauthorized");
  }
};

const isAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Admin role required" });
  }

  next();
};

module.exports = { isAuth, isAdmin };
