import User from "../models/user.js";

export const getUserList = async (req, res) => {
  try {
    const users = await User.find({ role: { $ne: "Admin" } }).select(
      "name email role active"
    );
    const response = {
      Number: users.length,
      users,
    };
    res.status(200).json(response);
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const getUser = async (req, res) => {
  try {
    const { id } = req.params;
      const user = await User.findById(id);
      res.status(200).json(user);
      
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const activateUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);
    if (user) {
      user.active = req.body.active;
      await user.save();

      res.status(201).json({
        status: true,
        message: `User account has been ${
          user?.active ? "activated" : "disabled"
        }`,
      });
    } else {
      res.status(404).json({ status: false, message: "User not found" });
    }
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};

export const deleteUserProfile = async (req, res) => {
  try {
    const { id } = req.params;
    await User.findByIdAndDelete(id);

    res
      .status(200)
      .json({ status: true, message: "User deleted successfully" });
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};
