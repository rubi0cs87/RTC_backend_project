const cloudinary = require("cloudinary");
const multer = require("multer");
const cloudinaryStorage = require("multer-storage-cloudinary");

const storage = cloudinaryStorage({
  cloudinary,
  folder: "videogames",
  allowedFormats: ["jpg", "jpeg", "png", "gif", "webp"],
});

const upload = multer({ storage });

module.exports = { upload };
