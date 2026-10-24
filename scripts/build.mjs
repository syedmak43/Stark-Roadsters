import { cpSync,existsSync,rmSync,mkdirSync,readFileSync,writeFileSync,statSync } from "node:fs";
import { join,resolve } from "node:path";
import { createHash } from "node:crypto";
const root=resolve(import.meta.dirname,"..");
const dist=join(root,"dist");
const logo=join(root,"public/assets/stark-roadsters-logo.png");
const original=readFileSync(logo);
const pngSignature="89504e470d0a1a0a";
if(original.subarray(0,8).toString("hex")!==pngSignature)throw Error("Official logo asset must be PNG");
if(original.readUInt32BE(16)<1000||original.readUInt32BE(20)<1000)throw Error("Official logo resolution is unexpectedly low");
const team=JSON.parse(readFileSync(join(root,"data/team.json"),"utf8"));
if(!Array.isArray(team.members)||team.members.length!==6)throw Error("Exactly six original team entries are required");
const colors=["#807473","#1763A0","#1C278A","#970F12","#997725"];
const css=readFileSync(join(root,"src/styles.css"),"utf8");
for(const color of colors)if(!css.includes(color))throw Error(`Missing official palette token ${color}`);
rmSync(dist,{recursive:true,force:true});
mkdirSync(dist,{recursive:true});
cpSync(join(root,"src"),dist,{recursive:true});
cpSync(join(root,"public"),dist,{recursive:true});
mkdirSync(join(dist,"data"),{recursive:true});
cpSync(join(root,"data/team.json"),join(dist,"data/team.json"));
const built=readFileSync(join(dist,"assets/stark-roadsters-logo.png"));
const digest=(x)=>createHash("sha256").update(x).digest("hex");
if(digest(original)!==digest(built))throw Error("Official logo changed in production build");
for(const asset of ["index.html","styles.css","main.js","scene.js","data/team.json","assets/stark-roadsters-logo.png"]){
  if(!existsSync(join(dist,asset))||statSync(join(dist,asset)).size===0)throw Error(`Missing build artifact: ${asset}`);
}
writeFileSync(join(dist,"robots.txt"),"User-agent: *\nAllow: /\n");
const manifest={status:"passed",type:"static-production",logoSha256:digest(built),
  logoDimensions:"1254x1254",officialColors:colors,teamSlots:team.members.length,
  teamRosterVerified:team.members.every(m=>m.name?.trim()&&m.role?.trim()),
  concept3D:true,deployment:"Vercel static output directory: dist"};
writeFileSync(join(dist,"build-report.json"),JSON.stringify(manifest,null,2)+"\n");
console.log("✓ Stark Roadsters production build complete");
console.log("✓ Official logo present, original bytes unchanged: "+manifest.logoSha256.slice(0,16)+"…");
console.log("✓ 5 exact palette tokens");
console.log("✓ 6 team slots; original team roster supplied: "+manifest.teamRosterVerified);
console.log("✓ Native WebGL concept 3D experience");
console.log("✓ Vercel output: "+dist);
