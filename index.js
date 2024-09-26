const express = require("express");
const app = express();
const path = require("path");
const cookie = require("cookie-parser");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const usermodel = require("./models/user");
const postmodel = require("./models/post");

const upload = require("./config/multer");
const { render } = require("ejs");
const post = require("./models/post");

app.set("view engine", "ejs");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use(cookie());


function call(req) {
  let token = req.cookies.token 
   if (token === " " || !token)
   {
    return 1;
   }else{
    return 0;
   }
}



app.get("/", (req, res, next) => {
  let flag = call(req); 
  res.render("index",{ flag });
});

app.get("/register",(req,res,next)=>{
   
    res.render("register");
})

app.post("/register", async (req,res,next)=>
{
    let {username,name,email,password} = req.body;
    let user = await usermodel.findOne({ email });
    if (user) return res.status(400).send("You are already registered");
 
    bcrypt.genSalt(10, (err, salt) => {
        bcrypt.hash(password, salt, async (err, hash) => {
          let newUser = await usermodel.create({
            username,
            name,
            email,
            password: hash,
          });
          let token = jwt.sign({ username: email, userId: newUser._id }, "shhhhh");
          res.cookie("token", token);
          res.redirect("/login");
        });
      });
})

app.get("/login",(req,res,next)=>
{
  res.render("login");
})


app.get("/article",isLoggedin,async(req,res,next)=>{
  let flag =call(req)

  let post = await postmodel.find().populate("user")

  res.render("post",{ flag , post });

})

app.get("/courses", isLoggedin , async(req,res,next)=>
    {
        let user = await usermodel.findOne({email:req.user.username});
       let flag = call(req);
      res.render("courses",{flag,user});
    })

 app.get("/porfile", isLoggedin,async(req,res,next)=>{
  
  let user =  await usermodel.findOne({email:req.user.username}).populate("post");
  let flag = call(req)
      res.render("porfile",{flag , user});
})

app.get("/add", isLoggedin,async(req,res,next)=>{
  
  let flag = call(req)
      res.render("add",{flag });
})

app.get("/finance", isLoggedin,async(req,res,next)=>{
  
      let flag = call(req)
      res.render("finance",{flag });
})
app.post("/login", async (req, res, next) => {
    let { email, password } = req.body;
  
    let user = await usermodel.findOne({ email });
    if (!user) return res.status(400).send("User not found");
  
    bcrypt.compare(password, user.password, function (err, result) {
      if (result) {
        let token = jwt.sign({ username: email, userId: user._id }, "shhhhh");
        res.cookie("token", token);
        res.redirect("/");
      } else {
        res.redirect("/login");
      }
    });
  });

  app.get("/logout", (req, res, next) => {
    res.cookie("token", " ");
    res.redirect("/login");
  });
  

app.post("/add",isLoggedin,upload.single("img"),async(req,res,next)=>
{
 let photo = req.file ? req.file.filename : null;
   let {title ,discription} = req.body;
  let user = await usermodel.findOne({email:req.user.username});
  
  let post = await postmodel.create({
    post:photo,
    title:title,
    discription:discription,
    user:user._id,
  })

 user.post.push(post._id);
  await user.save();
  res.redirect("/add");
})



function isLoggedin(req, res, next) {
  const token = req.cookies.token;

  if (!token || token === " ") {
    return res.redirect("/login");
  }

  try {
    let data = jwt.verify(token, "shhhhh"); 
    req.user = data; 
    next();
  } catch (err) {
    console.error("JWT Verification failed:", err);
    return res.redirect("/login");
  }
}

app.post("/por-img",isLoggedin,upload.single("img"),async(req,res,next)=>{
 
  let  photo = req.file.filename;
  let user = await usermodel.findOne({email:req.user.username});

  user.profile = photo;
  await user.save();

res.redirect('/porfile')
});

app.get("/economic",isLoggedin,(req,res,next)=>{
 let  flag =  call(req)
res.render("economic",{flag});

})

app.get("/trading",isLoggedin,(req,res,next)=>{
  let  flag =  call(req)
 res.render("trading",{flag});
 
 })


app.listen(3000, function (err) {
  if (!err) {
    console.log("Server is running on port 3000");
  } else {
    console.log("somrthing is wrong");
  }
});
