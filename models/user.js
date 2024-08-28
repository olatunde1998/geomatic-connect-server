import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: false,
    },
    fullName: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["User", "Admin", "Company"],
      default: "User",
    },
    active: {
      type: Boolean,
      default: true,
      required: true,
    },
    phone_number: {
      type: String,
      required: false,
    },
    DOB: {
      type: String,
      required: false,
    },
    sex: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    city: {
      type: String,
      required: false,
    },
    LGA: {
      type: String,
      required: false,
    },
    address: {
      type: String,
      required: false,
    },
    ministry: {
      type: String,
      required: false,
    },
    institution: {
      type: String,
      required: false,
    },
    linkedin: {
      type: String,
      required: false,
    },
    github: {
      type: String,
      required: false,
    },
    passport: {
      type: String,
      required: false,
    },
    skills: [String],
    description: {
      type: String,
      required: false,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
