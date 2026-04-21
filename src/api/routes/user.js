const {
  register,
  login,
  getUsers,
  changeRole,
  putLibrary,
  deleteUser,
} = require("../controllers/user");

const usersRouter = require("express").Router();
const { isAuth, isAdmin } = require("../../middlewares/isAuth");

usersRouter.post("/register", register);
usersRouter.post("/login", login);
usersRouter.get("/", isAuth, getUsers);
usersRouter.put("/change-role/:email", isAuth, isAdmin, changeRole);
usersRouter.put("/library/:email", isAuth, putLibrary);
usersRouter.delete("/:email", isAuth, deleteUser);

module.exports = usersRouter;
