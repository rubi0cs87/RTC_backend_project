const cloudinary = require("cloudinary");
const multer = require("multer");
const CloudinaryStorage = require("multer-storage-cloudinary");

const storageVideogames = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "videogames",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
  },
});

const storageUserAvatar = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: "userAvatar",
    allowed_formats: ["jpg", "jpeg", "png", "gif", "webp"],
  },
});

const uploadVideogames = multer({ storage: storageVideogames });
const uploadUserAvatar = multer({ storage: storageUserAvatar });

module.exports = { uploadVideogames, uploadUserAvatar };