const express = require("express");
const app = express();
const session = require("express-session");
var flash = require('connect-flash');
const path = require("path");

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

const sessionOptions = {
  secret: 'keyboard cat',
  resave: false,
  saveUninitialized: true,
  // cookie: { secure: true }
};
// app.set('trust proxy', 1) // trust first proxy
app.use(session(sessionOptions));
app.use(flash());

app.use((req,res,next)=>{
  res.locals.successMsg = req.flash("success");
  res.locals.failureMsg = req.flash("error");
  next();
});


// app.get("/register",(req,res)=>{
//   let {name="anonymous"} = req.query;
//   req.session.name = name;
//   console.log(req.session.name);
//   res.send(name);
//   res.redirect("/hello");
// });

app.get("/flashroute",(req,res)=>{
let {name= "Priyanka" } = req.query;
req.session.name = name;
if(name==="Priyanka"){
  req.flash("success","Flash is working ");
}
else{
  req.flash("error","Flash is not working!!");
}
res.redirect("/hello");
});

app.get("/hello",(req,res)=>{
// console.log(req.flash("flash"));
res.render("../exp_views/exp_views.ejs",{name: req.session.name});
});

app.get("/test",(req,res)=>{
  res.send("Test Successful!");
})
// app.get("/hello",(req,res)=>{
// res.send(`Hello ${req.session.name}`);
// });

// app.get("/reqcount",(req,res)=>{
//   if(req.session.count){
//     req.session.count++;
//   }
//   else{
//     req.session.count =1;
//   }
// res.send(`You sent a request ${req.session.count}`);
// });

  
app.listen(8080, () => {
    console.log("Server is listerning to port 8080");
  });
  






















