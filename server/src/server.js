import express from "express";
import cors from "cors";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import fs from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const root = path.dirname(fileURLToPath(import.meta.url));
const dataDir = path.join(root, "../data");
const usersFile = path.join(dataDir, "users.json");
const appsFile = path.join(dataDir, "applications.json");
const PORT = 5000;
const SECRET = "careerforge-local-secret-2026";

const app = express();
app.use(cors({origin:"http://localhost:5173"}));
app.use(express.json());

const makeId=()=>Date.now()+"-"+Math.random().toString(36).slice(2,8);
async function init(){
  await fs.mkdir(dataDir,{recursive:true});
  for(const f of [usersFile,appsFile]){
    try{await fs.access(f)}catch{await fs.writeFile(f,"[]")}
  }
}
const read=f=>fs.readFile(f,"utf8").then(JSON.parse);
const write=(f,d)=>fs.writeFile(f,JSON.stringify(d,null,2));
const auth=(req,res,next)=>{
  const t=(req.headers.authorization||"").replace("Bearer ","");
  if(!t)return res.status(401).json({message:"Authentication required"});
  try{req.user=jwt.verify(t,SECRET);next()}catch{return res.status(401).json({message:"Session expired"})}
};

app.get("/api/health",(_,res)=>res.json({ok:true,message:"CareerForge API is running"}));

app.post("/api/auth/register",async(req,res)=>{
  try{
    const {name,email,password}=req.body;
    if(!name?.trim()||!email?.trim()||!password)return res.status(400).json({message:"All fields are required"});
    if(password.length<6)return res.status(400).json({message:"Password must be at least 6 characters"});
    const users=await read(usersFile), e=email.trim().toLowerCase();
    if(users.some(u=>u.email===e))return res.status(409).json({message:"Email already registered"});
    const u={id:makeId(),name:name.trim(),email:e,password:await bcrypt.hash(password,10)};
    users.push(u);await write(usersFile,users);
    res.status(201).json({token:jwt.sign({id:u.id,email:u.email},SECRET,{expiresIn:"7d"}),user:{id:u.id,name:u.name,email:u.email}});
  }catch(e){console.error(e);res.status(500).json({message:"Unable to create account"})}
});

app.post("/api/auth/login",async(req,res)=>{
  try{
    const users=await read(usersFile), e=req.body.email?.trim().toLowerCase();
    const u=users.find(x=>x.email===e);
    if(!u||!(await bcrypt.compare(req.body.password||"",u.password)))return res.status(401).json({message:"Invalid email or password"});
    res.json({token:jwt.sign({id:u.id,email:u.email},SECRET,{expiresIn:"7d"}),user:{id:u.id,name:u.name,email:u.email}});
  }catch(e){console.error(e);res.status(500).json({message:"Unable to login"})}
});

app.get("/api/applications",auth,async(req,res)=>{
  const a=await read(appsFile);res.json(a.filter(x=>x.userId===req.user.id).reverse());
});
app.post("/api/applications",auth,async(req,res)=>{
  const {company,role,status="Applied",location=""}=req.body;
  if(!company?.trim()||!role?.trim())return res.status(400).json({message:"Company and role are required"});
  const a=await read(appsFile), item={id:makeId(),userId:req.user.id,company:company.trim(),role:role.trim(),status,location:location.trim(),createdAt:new Date().toISOString()};
  a.push(item);await write(appsFile,a);res.status(201).json(item);
});
app.delete("/api/applications/:id",auth,async(req,res)=>{
  const a=await read(appsFile), next=a.filter(x=>!(x.id===req.params.id&&x.userId===req.user.id));
  await write(appsFile,next);res.json({ok:true});
});

init().then(()=>app.listen(PORT,()=>console.log(`CareerForge API running at http://localhost:${PORT}`)))
.catch(e=>{console.error("Startup failed",e);process.exit(1)});
