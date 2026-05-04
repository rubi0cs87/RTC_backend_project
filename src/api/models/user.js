const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const getOrCreateDefaultAvatar = require("../../utils/defaultAvatar")
const userSchema = new mongoose.Schema(
  {
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true, select: false },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    library: [{ type: mongoose.Types.ObjectId, ref: "videogames" }],
    avatar: { type: String },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", function () {
  if (this.isModified("password")) {
    this.password = bcrypt.hashSync(this.password, 10);
  }
});

const User = mongoose.model("users", userSchema, "users");

module.exports = User;
