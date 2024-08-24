import mongoose from "mongoose";
import jwt from "jsonwebtoken";

const dbConnection = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URL);
    console.log("Db connection established");
  } catch (error) {
    console.log("DB error:" + error);
  }
};
export default dbConnection;

export const createJwt = (res, userId) => {
  const token = jwt.sign({ userId }, process.env.Activation_Secret, {
    expiresIn: "1d",
  });
  console.log(token);
  res.cookie("token", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV !== "development",
    // secure: false,
    partitioned: true,
    // to prevent CSRF attack
    sameSite: "none",
    maxAge: 1 * 24 * 60 * 60 * 1000,
  });
};

export const generateRandomPassword = (length) => {
  const lowercase = "abcdefghijklmnopqrstuvwxyz";
  const uppercase = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  const numbers = "0123456789";
  const specialChars = "!@#$%^&*()_+";

  const allChars = lowercase + uppercase + numbers + specialChars;
  let password = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * allChars.length);
    password += allChars[randomIndex];
  }

  return password;
};

// Function to generate a random OTP
export const generateOTP = () => {
  return Math.floor(Math.random() * 1000000).toString();
};
