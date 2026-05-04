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
      }
    );
    return result.secure_url;
  } catch (error) {
    return res.status(500).json({ message: "Error getting default avatar" });
    
  }
};

module.exports = getOrCreateDefaultAvatar;