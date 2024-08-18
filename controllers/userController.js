import User from "../models/user.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import sendMail from "../middlewares/sendMail.js";

export const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    let user = await User.findOne({ email });

    if (user)
      return res.status(400).json({
        message: "User Already Exists",
      });

    const hashPassword = await bcrypt.hash(password, 10);

    user = {
      name,
      email,
      password: hashPassword,
    };

    // const otp = Math.floor(Math.random() * 1000000);
    const otp = Math.floor(Math.random() * 1000000);
    console.log("otp", otp);

    const activationToken = jwt.sign(
      { user, otp },
      process.env.Activation_Secret,
      {
        expiresIn: "5m", // 5 minutes
      }
    );

    await sendMail(
      email,
      "Email Verification Code",
      `Please Verify your Account using otp, Your otp is ${otp}`
    );

    res.status(200).json({
      message: "otp send to your mail",
      activationToken,
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

    let jwtPayload = undefined;
    jwt.verify(
      activationToken,
      process.env.Activation_Secret,
      async (err, payload) => {
        // console.log("payload", payload);
        try {
          if (!payload)
            return res.status(400).json({
              message: "Otp expired",
            });
          if (payload.otp !== +otp)
            return res.status(400).json({
              message: "Wrong Otp",
            });

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

    // console.log("jwtPayload", jwtPayload);

    // await User.create({
    //   name: jwtPayload.user.name,
    //   email: jwtPayload.user.email,
    //   password: jwtPayload.user.password,
    // });

    // res.json({
    //   message: "User Registered",
    // });
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
      return res.status(400).json({
        message: "Invalid Credentials",
      });

    const matchPassword = await bcrypt.compare(password, user.password);

    if (!matchPassword)
      return res.status(400).json({
        message: "Invalid Credentials",
      });

    const token = jwt.sign({ _id: user._id }, process.env.JWT_SEC, {
      expiresIn: "15d", //15 days
    });

    res.json({
      message: `welcome back ${user.name}`,
      token,
      user,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
