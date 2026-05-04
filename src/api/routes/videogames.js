const { uploadVideogames } = require("../../middlewares/file");
const { isAuth, isAdmin } = require("../../middlewares/isAuth");

const {
  getVideogames,
  postVideogame,
  updateVideogame,
  deleteVideogame,
} = require("../controllers/videogames");

const videogamesRouter = require("express").Router();

videogamesRouter.get("/", getVideogames);
videogamesRouter.post(
  "/",
  isAuth,
  isAdmin,
  uploadVideogames.single("videogameImg"),
  postVideogame,
);
videogamesRouter.put(
  "/:id",
  isAuth,
  isAdmin,
  uploadVideogames.single("videogameImg"),
  updateVideogame,
);
videogamesRouter.delete("/:id", isAuth, isAdmin, deleteVideogame);

module.exports = videogamesRouter;
