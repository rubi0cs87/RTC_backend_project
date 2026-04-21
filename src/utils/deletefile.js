const cloudinary = require("cloudinary");

const deleteFile = async (url) => {
  try {
    const array = url.split("/");
    const name = array.at(-1).split(".")[0];

    let public_id = `${array.at(-2)}/${name}`;

    await cloudinary.v2.uploader.destroy(public_id, () => {
      console.log("Archivo eliminado de Cloudinary");
    });
  } catch (error) {
    console.error("Error al eliminar archivo en Cloudinary:", error.message);
  }
};

module.exports = { deleteFile };
