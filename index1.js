import express from "express";
import fs from "fs";
import path, { join } from "path";
import mongoose from "mongoose";    //for mongoDB Connection
import cookieparser from "cookie-parser";
import jwt from "jsonwebtoken";
import bcrypt from "bcrypt";
                  //string doesnt work here get it from cmd of mongodb location
mongoose.connect("mongodb://127.0.0.1:27017",{//we will use atlas ka link if backend is on cloud 
  dbName:"backend",   //random db name
}).then(()=>console.log("Database Connected")).catch((e)=>console.log(e)); //to catch error if any msg logs only after connected 

  const userSchema = new mongoose.Schema({ //schema for DB
    name:String,
    email:String,
    password:String,
  });

  const User = mongoose.model("User",userSchema);  //model to create collections with a schema

const server = express();   //server created!!  write scripts and run server as npm run keyword (dev/start)
//here instead of server.method direct server.get/post/put can be used

server.use(express.static(path.join(path.resolve(),"public"))); //making index.html as static
//express.static is middleware cannot be used independently use server.use static folder serves as public directle access as /index.html at localhost 5000

//res.sendFile("index"/"index.html"); possible now as its static
// all html,css and java files created in public are public can be accessed directly 5000/.html,.css,.js as are served static publicly
server.use(express.urlencoded({extended:true})); //to render data from form to here
server.use(cookieparser()); //we can access tokens of cookies here
server.set("view engine","ejs");//set up view engine



           //MIDDLEWARE
const isAuthenticated = async(req,res,next)=>{
  const {token} = req.cookies;
 if(token){
  const decoded = jwt.verify(token,"qwerty"); //should be same as object id in DB
  //console.log(decoded);
  req.user = await User.findById(decoded._id); //if token present get user id in middleware itself now use req.user in other apis once logged in to access other details
  //req.user does not exists we created it
  next();
 }
 else{
  res.redirect("/login"); 
}
};



server.get("/",isAuthenticated,(req,res)=>{   //if user logged in if satisfied, next() occurs goes to the next handler i.e to render logout
 //res.render("index",{name:"Saketh"});  //ejs files needs engine or extension dynamic data can be pass and acc here in html<%=JS var name here%>
 //console.log(req.cookies); //to access cookies of the req cannot be done without a cookieparser
//  const {token} = req.cookies;
//  if(token){
//  res.render("logout");   //logout if token exists
//  }
//  else{
//   res.render("login"); 
//  } 
//console.log(req.user)
res.render("logout",{name:req.user.name});
});
server.get("/login",(req,res)=>{
  res.render("login");
});
server.get("/register",(req,res)=>{   
 res.render("register");
 });
server.post("/login",async(req,res)=>{
  const {email,password} = req.body;
  let user = await User.findOne({email});
  if(!user) return res.redirect("/register");
  const isMatch = await bcrypt.compare(password,user.password); //hashing entered password to compare with DB PassWord
  if(!isMatch) return res.render("login",{email,message:"Incorrect Password"});
  const token = jwt.sign({_id:user._id},"qwerty"); 
  res.cookie("token",token,{  
    httpOnly:true,expires:new Date(Date.now()+60*1000) 
  });   
  res.redirect("/"); 
});

// server.post("/login",async(req,res)=>{
//   const {name,email} = req.body;

//   let user = await User.findOne({email}) //only 1 user
//   if(!user){
//     return res.redirect("/register");
//   }
//      user = await User.create({
//     name: name,   //lhs as per schema 
//     email:email,
//   });

  server.post("/register",async(req,res)=>{
    const {name,email,password} = req.body;
  
    let user = await User.findOne({email}) //only 1 user  same email cannot be used for other user for login
    if(user){
      return res.redirect("/login");
    }
    const hashedpassword = await bcrypt.hash(password,10); //hash pw in mongodb
       user = await User.create({
      name: name,   //lhs as per schema 
      email:email,
      password:hashedpassword,
    });
  const token = jwt.sign({_id:user._id},"qwerty"); //qwerty is secret key jwt is signing the user id else object id in DB displayed in cookie is user._id used
  //console.log(token);
  res.cookie("token",token,{  //to access id 
    httpOnly:true,expires:new Date(Date.now()+60*1000) //httponly is more secure only server can access it date is given for time to expire
  });   //cookies are stored as key-value  pair
  res.redirect("/");    //if login is successful cookie is created and redirect back to login page
});
server.get("/logout",(req,res)=>{  //logout doesnt req any input usually so get method
  res.cookie("token","NULL",{  //removes cookie and expire immediately
    httpOnly:true,expires:new Date(Date.now()) //httponly is more secure only server can access it date is given for time to expire
  });   //cookies are stored as key-value  pair
  res.redirect("/");    //if login is successful cookie is created and redirect back to login page
});
//const users=[]  //this will become empty the moment server restarts  DEPRECATED!!
// server.post("/",async(req,res)=>{
//  // console.log(req.body);
//  // users.push({username:req.body.name,email:req.body.email}); //DEPRECATED!!
//  //const messageData  = {username:req.body.name,email:req.body.email};//DEPRECATED!!!
//  const {name,email} = req.body;
//  //await Message.create({name:req.body.name,email:req.body.email});  //lhs: should be same as is schema M1)
//  await Message.create({name:name,email:email}); //M2)
// // console.log(messageData);
//   res.render("success"); //res.redirect("./success") also possible success here is success.ejs
// });

// server.get("/add",async (req,res)=>{  DEPRECATED FOR THE PROJECT!!!
//   //All methods are from MongoDB pass data to create i/p as per schema  async await better way to write over then
//   await Message.create({name:"Saketh2",email:"Saketh2@gmail.com"})//.then(()=>{
//     res.send("Nice");  //we will get Nice only after data is created
//  // });
// });

// server.get("/users",(req,res)=>{
//   res.json({
//     users,
//   });
// });

// server.get("/about",(req,res)=>{
//   res.send("Home");   //send better than end  .json can send json data o/p .sendfile sends html file as o/p .sendstatus(no.)sends o/p  res.status(400).send("Hi");
//   res.json({
//     success:true,
//     products:[]    //prints this json object  
//   })
// });

// server.get("/getproducts",(req,res)=>{
//  // const file = fs.readFileSync("./index.html");
//      //res.sendFile(file);  //this needs fs imported to work path must be a string to res.sendFile
//      const pathlocation = path.resolve();
//      res.sendFile(path.join(pathlocation,"./index.html"));  //join to form string of dir+filename 
// });
server.listen(5000,()=>{
  console.log("Server is working");
});