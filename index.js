//const http = require("http");
//const gfName = require("./filemoduleexport");
import http from "http";
import gfName, { gfName1, gfName2 } from "./filemoduleexport.js";  //specify extension and change require syntax to import type=module     { names here should match to exported ones}
import { fn } from "./filemoduleexport.js"; //importing a fn
//import{} from "./filemoduleexport.js";
import * as Obj from "./filemoduleexport.js"; //access as Obj.gfname2

import fs from "fs";  //to read files
import path from "path";

//console.log(path.extname("/home/") teels dirname,pathname etc

const home = fs.readFileSync("./index.html",()=>{  //home has the file now read file synchronously so server wont start until file is read so it can be rendered if just fileread thats async so put file read fn in if api condition
  console.log("File Read");
});

console.log(gfName);
console.log(gfName1);
console.log(gfName2);
console.log(fn());

const server = http.createServer((req,res)=>{  //WRITE A FUNCTION INSIDE THIS FUNCTION AS RESPONSE WHENEVER SOMEONE VISITS PORT 5000//1st para is request and 2nd is resp names doesnt matter
  console.log(req.url); //unlimited reloads when listening is this is blank and server listens this prints/some action only when someone visits 5000 port no action unlimited refreshing
  //req.url prints which api ur requesting by typing in browser by def its '/' 
  if(req.url=='/')
  res.end(home);
  // fs.readFile("./index.html",(err,home)=>{ M2 for async
  //   res.end(home);  //home has the file now read file synchronously so server wont start until file is read so it can be rendered if just fileread thats async so put file read fn in if api condition
  //   console.log("File Read");
  // });   //stops indf reloading and renders content on screen  reading and sending a file to home url
  else if(req.url=="/about")
  res.end(`<h1>Love is ${fn()}</h1>`);
  else
  res.end("<h1>Page Not Found</h1>");
});
 //res.method are GET,PUT,UPDATE,DELETE
server.listen(5000,()=>{
  console.log("Server is working");
});