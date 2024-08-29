
if(process.env.NODE_ENV != "production"){
  require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodoverride = require("method-override");
const ejsmate = require("ejs-mate");
app.engine("ejs", ejsmate);



app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.static(path.join(__dirname, "/public")));
app.use(methodoverride("_method"));
app.use(express.urlencoded({ extended: true }));

const expresserror = require("./utils/ExpressErr.js");
const expsession = require("express-session");
const MongoStore = require('connect-mongo');
var flash = require("connect-flash");
const passport = require("passport");
const Localstrategy = require("passport-local");
const User = require("./models/user.js");

const dbUrl = process.env.ATLASDB_URL;

main()
  .then(() => {
    console.log("Connected to Data Base");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(dbUrl);
}

const store = MongoStore.create({
  mongoUrl: dbUrl,
  crypto: {
    secret: process.env.SECRET,
  },
  touchAfter: 24*3600,

})


store.on("error",()=>{
console.log("ERROR IN MONGO SESSION STORE ",err);
})


const sessionOptions = {
  store,
  secret: process.env.SECRET,
  resave: false,
  saveUninitialized: true,

  cookie: {
    expires: Date.now() + 15 * 24 * 60 * 60 * 1000,
    maxAge: 15 * 24 * 60 * 60 * 1000,
    httponly: true,
  },
};



app.use(expsession(sessionOptions));
app.use(flash());
app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
  res.locals.successMsg = req.flash("success");
  res.locals.failureMsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
});

const listings = require("./routes/listings.js");
const reviews = require("./routes/reviews.js");
const UserRoute = require("./routes/routeuser.js");

app.use("/listings", listings);
app.use("/listings/:id/reviews", reviews);
app.use("/",UserRoute);

app.all("*", (req, res, next) => {
  next(new expresserror(404, "Page not found!"));
});

app.use((err, req, res, next) => {
  let { status = 500, message = "Something went wrong" } = err;
  res.status(status).render("errorpage.ejs", { message });
});

app.listen(3000, () => {
  console.log("Server is listerning to port 3000");
});


