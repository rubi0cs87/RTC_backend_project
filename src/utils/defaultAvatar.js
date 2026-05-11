const cloudinary = require("cloudinary").v2;
const path = require("path");

const getOrCreateDefaultAvatar = async () => {
  try {
    const result = await cloudinary.uploader.upload(
      path.join(__dirname, "../assets/userDefault.png"),
      {
        public_id: "userDefault",
        folder: "userAvatar",
        overwrite: false,
      },
    );
    return result.secure_url;
  } catch (error) {
    console.error({ message: "Error getting default avatar", error });
    return null;
  }
};

module.exports = getOrCreateDefaultAvatar;
