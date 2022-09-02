const User = require("../../models/User");

const signup = (req, res) => {
    User.create(
      {
        userName: req.body.userName,
        password: req.body.password,
        userType: req.body.userType,
      },
      (error, user) => {
        if (error == null) {
          res.render("login", {
            code: 200,
            errors: [],
            username: "",
            password: "",
            loginUserName: "",
            loginPassword: "",
          });
        } else {
          const validationErrors = Object.keys(error.errors).map(
            (key) => error.errors[key].message
          );
          req.flash("validationErrors", validationErrors);
          req.flash("data", req.body);
          res.redirect("/login");
        }
      }
    );
  };
module.exports = signup;  