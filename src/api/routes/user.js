const usersRouter = require("express").Router();
const { isAuth, isAdmin } = require("../../middlewares/isAuth");
const { uploadUserAvatar } = require ("../../middlewares/file")

const {
  register,
  login,
  getUsers,
  changeRole,
  putLibrary,
  deleteUser,
  updateUser,
  deleteLibrary,
} = require("../controllers/user");

usersRouter.post("/register", uploadUserAvatar.single("avatar"), register);
usersRouter.post("/login", login);
usersRouter.get("/", isAuth, getUsers);
usersRouter.put("/change-role/:email", isAuth, isAdmin, changeRole);
usersRouter.put("/library", isAuth, putLibrary);
usersRouter.delete("/library", isAuth, deleteLibrary);
usersRouter.delete("/:email", isAuth, deleteUser);
usersRouter.put("/", isAuth, uploadUserAvatar.single("avatar"), updateUser);


module.exports = usersRouter;
