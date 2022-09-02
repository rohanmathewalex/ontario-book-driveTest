const bcrypt = require("bcrypt");
const User = require("../../models/User");

const login = (req, res) => {
    const { loginUserName, loginPassword } = req.body;
    User.findOne({ userName: loginUserName }, (error, user) => {
      if (user) {
        bcrypt.compare(loginPassword, user.password, (error, same) => {
          if (same) {
            // if passwords match
            req.session.userId = user._id;
            req.session.userType = user.userType;
            if (user.userType === "admin") {
              res.redirect("/appointment");
            } else if (user.userType === "examiner") {
              res.redirect("/examiner");
            } else {
              res.redirect("/driver");
            }
          } else {
            req.flash("validationErrors", ["Wrong user name or password"]);
            req.flash("data", req.body);
            res.redirect("/login");
          }
        });
      } else {
        req.flash("validationErrors", [
          "User doesn't exist, please signup first",
        ]);
        req.flash("data", req.body);
        res.redirect("/login");
      }
    });
  };

  module.exports = login;