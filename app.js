if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

// ========= import required modules =====================
const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
// require config ;
process.env.SUPPRESS_NO_CONFIG_WARNING = "y";
const config = require("config");

const fs = require("fs");
const fileUpload = require("express-fileupload");

const port = process.env.PORT || 3000;

//========== connect to mongodb =====================
const DATABASE_URL =
  "mongodb+srv://admin:admin@influencer-cluster.bcp2q.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
  })
  .then(() => {
    console.log("MongoDB Connected .....");
  })
  .catch((err) => {
    console.log(err.message);
  });

// ========= set view engine ==================
app.set("view engine", "ejs");
app.set("views", "views");

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(fileUpload());

// ========= set session ==================
const session = require("express-session");
const sessionStore = require("connect-mongodb-session")(session);
const flash = require("connect-flash");
const store = new sessionStore({
  uri: process.env.DATABASE_URL,
  collection: "sessions",
});

app.use(
  session({
    secret: "secret",
    cookie: { maxAge: 1000 * 60 * 60 * 24 * 7 },
    saveUninitialized: false,
    resave: true,
    store: store,
  })
);
app.use(flash());

// ========= import routes ==================
const homeRout = require("./routes/homeRout");
// const loginRoutes = require("./routes/loginRoutes");
// const adminRoute = require("./routes/adminRoute");
// const userRoute = require("./routes/userRoute");

// ========= use routes ==================
app.use("/", homeRout);
// app.use("/login", loginRoutes);
// app.use("/admin", adminRoute);
// app.use("/user", userRoute);
app.get("/", (req, res) => {
  res.send("<h1>Hello World</h1>");
});

//
app.listen(port, (err) => {
  console.log(`server is runnin on http://localhost:${port}`);
});
