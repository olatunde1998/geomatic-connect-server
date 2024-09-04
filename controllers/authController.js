import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";
import {
  createJwt,
  generateOTP,
  generateRandomPassword,
} from "../utils/index.js";
import Otp from "../models/otp.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user)
      return res.status(401).json({
        message: "User Already Exists",
      });

    const hashPassword = await bcrypt.hash(password, 10);

    user = {
      name,
      email,
      password: hashPassword,
    };

    const createdUser = await User.create(user);
    res.status(201).json({
      message: "User Registered",
      user: {
        _id: createdUser.id,
        name: createdUser.name,
        email: createdUser.email,
        role: createdUser.role,
      },
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const verifyUser = async (req, res) => {
  try {
    const { otp, activationToken } = req.body;

    jwt.verify(
      activationToken,
      process.env.ACTIVATION_SECRET,
      async (err, payload) => {
        try {
          if (!payload)
            return res.status(400).json({
              message: "Otp expired",
            });

          if (payload.otp !== +otp)
            return res.status(400).json({
              message: "Wrong Otp",
            });

          const otpDoc = await Otp.findOne({ email });
          await otpDoc.deleteOne();

          const user = {
            name: payload.user.name,
            email: payload.user.email,
            password: payload.user.password,
          };

          await User.create(user);
          res.json({ message: "User Registered" });
        } catch (error) {
          console.error(error);
          res.status(500).json({ message: "An error occurred" });
        }
      }
    );
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user)
      return res.status(401).json({
        message: "Invalid Credentials",
      });

    if (!user.active) {
      return res.status(401).json({
        status: false,
        message: "User account has been deactivated, contact the administrator",
      });
    }

    const matchPassword = await bcrypt.compare(password, user.password);
    // console.log("user", user._id);
    if (user && matchPassword) {
      createJwt(res, user._id);
      user.password = undefined;
      return res.status(200).json(user);
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Invalid credentials" });
    }
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const logoutUser = async (req, res) => {
  try {
    res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
    res.status(200).json({ message: "Logout successfull" });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  const { userId } = req.user;

  try {
    const { oldPassword, newPassword } = req.body;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const isPasswordMatch = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordMatch) {
      return res.status(401).json({
        message: "Incorrect password",
      });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    res.status(200).json({ message: "Password changed successfully" });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const resendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const existingOtp = await Otp.findOne({ email });

    if (existingOtp) {
      const now = new Date();
      if (now > existingOtp.expiresAt) {
        const newOtp = generateOTP();

        await Otp.findOneAndUpdate(
          { email },
          { otp: newOtp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
        );

        await sendMail(
          email,
          "Request for New Otp",
          `Please Verify your Account using otp, Your New otp is ${newOtp}`
        );

        res.json({ message: "OTP resent successfully" });
      } else {
        const newOtp = generateOTP();

        await Otp.findOneAndUpdate(
          { email },
          { otp: newOtp, expiresAt: new Date(Date.now() + 10 * 60 * 1000) }
        );

        await sendMail(
          email,
          "Request for New Otp",
          `Please Verify your Account using otp, Your New otp is ${newOtp}`
        );

        res.json({ message: "OTP resent successfully" });
      }
    } else {
      res.status(404).json({ message: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const forgetPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }
    const newPassword = generateRandomPassword(6);

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;

    await user.save();

    await sendMail(
      email,
      "New Password Code",
      `Please Login to the app with your new password, Your Password is ${newPassword}`
    );

    res.status(200).json({
      status: "Succesfull",
      message: "Your new password is sent to your mail",
    });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getMyProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { role } = req.user;

    const user = await User.findById(id).select(
      role === "Company"
        ? "name email ministry active state city LGA passport linkedin"
        : role === "Student"
        ? "name email active state city LGA sex DOB passport skills description linkedin github institution"
        : "name email role sex"
    );
    const creationDate = user.createdAt;
    res.status(200).json({ user, creationDate });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const updateMyProfile = async () => {
  try {
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};
