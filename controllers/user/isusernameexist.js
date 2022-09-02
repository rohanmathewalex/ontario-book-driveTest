
const User = require("../../models/User");
const existUserName = (req, res) => {
    User.findOne({ userName: req.query.name }, (error, user) => {
      res.json({ exist: !!user });
    });
  };
  module.exports = existUserName;