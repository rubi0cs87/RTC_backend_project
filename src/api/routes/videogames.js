const { upload } = require("../../middlewares/file");
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
  upload.single("img"),
  isAuth,
  isAdmin,
  postVideogame,
);
videogamesRouter.put(
  "/:id",
  upload.single("img"),
  isAuth,
  isAdmin,
  updateVideogame,
);
videogamesRouter.delete("/:id", isAuth, isAdmin, deleteVideogame);

module.exports = videogamesRouter;
