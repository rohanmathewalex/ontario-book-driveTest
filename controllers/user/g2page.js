
const User = require("../../models/User");

const g2Page = async (req, res) => {
    const user = await User.findById(req.session.userId).populate(
      "appointmentId"
    );
    res.render("g2", { user });
  };
  module.exports = g2Page;