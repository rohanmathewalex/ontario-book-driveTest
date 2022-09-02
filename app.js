const express = require("express");
const ejs = require("ejs");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const fileUpload = require("express-fileupload");
const expressSession = require("express-session");
const flash = require("connect-flash");

mongoose.connect(
  "mongodb+srv://rohanmathewalex:1234567890@cluster0.xsvvzwo.mongodb.net/?retryWrites=true&w=majority"
);
mongoose.connection.on("connected", function (err) {
  if (err) {
    console.log(err);
  }
  console.log("Application is connected database.");
});

global.loggedIn = null;
global.userType = null;
const app = new express();
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(fileUpload());
app.use(
  expressSession({
    secret: "This is a secret",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(flash());
app.use("*", (req, res, next) => {
  global.loggedIn = req.session.userId;
  global.userType = req.session.userType;
  next();
});
app.set("view engine", "ejs");
const port = process.env.Port || 4000
app.listen(port, () => {
  console.log("App listening on port 4000");
});

//  Middleware
const authMiddleware = require("./middleware/auth/authMiddleware");
const adminMiddleware = require("./middleware/admin/adminMiddleware");
const examinerMiddleware = require("./middleware/examiner/examinerMiddleware");
const hasLoggedMiddleware = require("./middleware/login/hasLoggedMiddleware");

//Admin Controllers
const findTimeslot = require("./controllers/admin/findtimeslot");
const saveTimeslots = require("./controllers/admin/savetimeslots");

//Examiner Controller
const loadUser = require("./controllers/examiner/loaduser");
const comment = require("./controllers/examiner/comment");

//User Controller
const homePage = require("./controllers/user/homepage");
const loginPage = require("./controllers/user/loginpage");
const driverPage = require("./controllers/user/driverpage");
const gPage = require("./controllers/user/gpage");
const g2Page = require("./controllers/user/g2page");
const appointmentPage = require("./controllers/user/appointmentpage");
const examinerPage = require("./controllers/user/examinerpage");
const signup = require("./controllers/user/signup");
const isUserNameExist = require("./controllers/user/isusernameexist");
const login = require("./controllers/user/login");
const logout = require("./controllers/user/logout");
const updateUser = require("./controllers/user/updateuser");
const findAvailableTimeslot = require("./controllers/user/findavailabletimeslot");

// API
app.get("/", homePage);
app.get("/login", hasLoggedMiddleware, loginPage);
app.get("/driver", driverPage);
app.get("/g", authMiddleware, gPage);
app.get("/g2", authMiddleware, g2Page);
app.get("/appointment", adminMiddleware, appointmentPage);
app.get("/examiner", examinerMiddleware, examinerPage);
app.get("/users/signup/preCheck", isUserNameExist);
app.get("/users/logout", logout);
app.get("/users/timeslot", authMiddleware, findAvailableTimeslot);
app.get("/admin/timeslot", adminMiddleware, findTimeslot);
app.get("/examiner/userList", examinerMiddleware, loadUser);

app.post("/users/signup", hasLoggedMiddleware, signup);
app.post("/users/login", hasLoggedMiddleware, login);
app.post("/users/update", authMiddleware, updateUser);
app.post("/admin/timeslot/save", adminMiddleware, saveTimeslots);
app.post("/examiner/comment", examinerMiddleware, comment);
