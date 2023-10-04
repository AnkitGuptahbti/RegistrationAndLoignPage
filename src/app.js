 require("dotenv").config()
 const { log } = require("console");
const express=require("express");
 const app=express();
 const path=require("path");
 const hbs=require("hbs");
 const bcrypt=require("bcryptjs");const jwt=require("jsonwebtoken");
 const cookieparser=require('cookie-parser');
 require("./db/conn");
const Register=require("./models/registers")
const auth=require("./middleware/auth")
const port=process.env.PORT || 3000;

const static_path= path.join(__dirname,"../public");
const template_Path = path.join(__dirname, "../templates/views")
const partials_Path = path.join(__dirname, "../templates/partials")

// console.log(path.join(__dirname));
// console.log(path.join(__dirname,"../public"));

app.use(express.json())
app.use(cookieparser())
app.use(express.urlencoded({extended:false}))

// app.use(express.static(static_path))
app.set("view engine","hbs")

//changed ciews to tempeates
app.set("views",template_Path)
hbs.registerPartials(partials_Path)

app.use(express.static(static_path))

// console.log("HELLO "+process.env.SECRET_KEY);
 app.get("/",(req,res)=>{
    res.render("index")
 });
 app.get("/secret",auth,(req,res)=>{
   console.log("this is the cookie awesom in secret belllegu "+ req.cookies.jwt);

   res.render("secret")
});
 app.get("/register",(req,res)=>{
    res.render("register")
 });
 app.post("/register", async(req,res)=>{
    try{
      console.log("aur be");
      // console.log(req.body.fullname);
      // res.send(req.body.fullname)
      const registerEmployee=new Register({
         fullname:req.body.fullname,
         email: req.body.email,
         PhoneNumber:req.body.PhoneNumber,
         password: req.body.password
      })

      console.log("the succes part "+ registerEmployee);
      const token=await registerEmployee.generateAuthToken();
      // console.log( "the token part "+token)

      res.cookie("jwt",token,{
         expires:new  Date(Date.now()+50000),
         httpOnly:true
      })

      const registered= await registerEmployee.save()
      // console.log( "the token part "+token)

      // console.log(registered);
      res.status(201).render('afterregister')
      
    }catch(error){
      res.status(400).send(error)
    }
 });

 app.get("/login",(req,res)=>{
    res.render("login")
 });

   
//  app.post("/login",async(req,res)=>{
//    try{

//      const  email=req.body.email;
//      const  password= req.body.password;
//      //console.log(email);//console.log(password);
//      const useremail=await Register.findOne({email:email})
//      if(useremail.password===password){
//       res.status(201).render("index2")
//      }
//      else{
//       res.status(400).send("invalid login  password detail")
//      }

//    }catch{
//       res.status(400).send("Invalid login detail")
//    }
//  })
 app.post("/login",async(req,res)=>{
   try{

     const  email=req.body.email;
     const  password= req.body.password;
     //console.log(email);//console.log(password);
     const useremail=await Register.findOne({email:email})
       const isMatch=await bcrypt.compare(password,useremail.password);

       const token=await useremail.generateAuthToken();
       console.log( "the token part "+token)

       res.cookie("jwt",token,{
         expires:new  Date(Date.now()+5000000),
         httpOnly:true
      })
      // console.log("this is the cookie awesom "+ req.cookies.jwt);

     if(isMatch){
      res.status(201).render("afterlogin")
     }
     else{
      res.status(400).send("invalid login  password detail")
     }

   }catch{
      res.status(400).send("Invalid login detail")
   }
 })


//bcrypt concept=>
//  const  bcrypt=require("bcryptjs")
//   const securepassword= async(password)=>{
//    const passwordHash= await bcrypt.hash(password,10);
//    console.log(passwordHash);
//    const passwordmatch= await bcrypt.compare(password,passwordHash);
//    console.log(passwordmatch);
//   }
// //   $2a$10$o3MtSjIEVA7X9Zux2Uh/4erWY0/AANYn6S.vHMu3kiAu3pk5V6z.q
// securepassword("thapa@123")



//https://jwt.io/
// const jwt=require("jsonwebtoken")

// const createToken=async()=>{


//     const token=await  jwt.sign({_id:"64fdebb8fc693418d8a9ee80"},"mynameisankitguptamynameisankitgupta",{
//       expiresIn:"10 seconds"
//     })
//     console.log(token);
//     const userVer=await jwt.verify(token,"mynameisankitguptamynameisankitgupta")
//     console.log(userVer);

// }
// createToken();



 app.listen(port,()=>{
    console.log(`server is running at port no ${port}`);
 })
 