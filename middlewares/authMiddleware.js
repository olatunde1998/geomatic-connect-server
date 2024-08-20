import jwt from "jsonwebtoken";
import User from "../models/user.js";

const protectedRoute = async (req, res, next) => {
  try {
    let token = req.cookies?.token;

    console.log("req.cookies", req.cookies);
    console.log("token", token);
    console.log("jwt_secret", process.env.Activation_Secret);
    if (token) {
      const decodedToken = jwt.verify(token, process.env.Activation_Secret);
      console.log("decodedToken", decodedToken);
      const resp = await User.findById(decodedToken.userId).select(
        "role email"
      );

      req.user = {
        email: resp.email,
        role: resp.role,
        userId: decodedToken.userId,
      };

      next();
    } else {
      return res
        .status(401)
        .json({ status: false, message: "Not authorized. Try login again." });
    }
  } catch (error) {
    console.error(error);
    return res
      .status(401)
      .json({ status: false, message: "Not authorized. Try login again." });
  }
};

export { protectedRoute };
