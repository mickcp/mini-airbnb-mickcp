const express = require("express");
const app = express();

const cookieparser =  require('cookie-parser');


// signed cookies 
app.use(cookieparser("secretecode"));

app.get("/getsignedcookies",(req,res)=>{
  res.cookie("name","arijit", {signed: true});
  res.send("Singed cookie sent");
});

app.get("/verify",(req,res)=>{
console.log(req.signedCookies);
res.send("verified");

})

app.get("/getcookies",(req,res)=>{
res.cookie("Name","Priyanka");
console.dir(req.cookies);
res.send("Sent some cookies");
});

app.get("/",(req,res)=>{
console.dir(req.cookies);
});

app.get("/great",(req,res)=>{
  let{Name}= req.cookies;
  res.send(`Hi this is ${Name}`);

});

  
app.listen(8080, () => {
    console.log("Server is listerning to port 8080");
  });
  




























