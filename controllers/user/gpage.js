
const User = require("../../models/User");

const gPage = async (req, res) => {
    const user = await User.findById(req.session.userId).populate(
      "appointmentIdG"
    );
    if (user?.licenseNo) {
      res.render("g", { user });
    } else if (user) {
      res.render("g2", { user });
    } else {
      res.render("login");
    }
  };
  module.exports = gPage;