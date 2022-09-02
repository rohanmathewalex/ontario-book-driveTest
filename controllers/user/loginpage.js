
const loginPage = (req, res) => {
    let userName = "";
    let password = "";
    let loginUserName = "";
    let loginPassword = "";
    const data = req.flash("data")[0];
    if (typeof data != "undefined") {
      userName = data.userName;
      password = data.password;
      loginUserName = data.loginUserName;
      loginPassword = data.loginPassword;
    }
  
    res.render("login", {
      errors: req.flash("validationErrors"),
      username: userName,
      password: password,
      loginUserName: loginUserName,
      loginPassword: loginPassword,
    });
  };
  module.exports = loginPage;