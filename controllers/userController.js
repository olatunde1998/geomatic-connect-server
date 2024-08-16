export const sample = async (req, res) => {
  try {
  } catch (error) {
    return res.status(400).json({ status: false, message: error.message });
  }
};
