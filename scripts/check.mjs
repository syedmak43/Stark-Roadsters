import { readFileSync,existsSync } from "node:fs";
import { resolve,join } from "node:path";
const root=resolve(import.meta.dirname,"..");
const dist=join(root,"dist");
if(!existsSync(join(dist,"build-report.json")))throw Error("Run npm run build first");
const report=JSON.parse(readFileSync(join(dist,"build-report.json"),"utf8"));
if(report.status!=="passed")throw Error("Build report invalid");
for(const name of ["index.html","styles.css","main.js","scene.js","assets/stark-roadsters-logo.png","assets/stark-roadsters-palette.png"]){
  if(!existsSync(join(dist,name)))throw Error("Missing "+name);
}
const markup=readFileSync(join(dist,"index.html"),"utf8");
for(const name of ["top","identity","machine","details","team","context"]){
  if(!markup.includes(`id="${name}"`))throw Error("Missing "+name+" section");
}
if((markup.match(/stark-roadsters-logo\.png/g)||[]).length<4)throw Error("Official logo not referenced enough");
if(!markup.includes("ILLUSTRATIVE CONCEPT — NOT THE TEAM'S CAR"))throw Error("Concept vehicle disclaimer missing");
if(!markup.includes("TEAM ROSTER IN VERIFICATION"))throw Error("Honest roster status missing");
if(markup.includes("Original member 01"))throw Error("Unverified member placeholders must not be published");
if(!markup.includes("https://github.com/syedmak43/Stark-Roadsters"))throw Error("Public source link missing");
console.log("✓ Production artifact checks passed");
if(!report.teamRosterVerified)console.warn("! Verified team roster not supplied; roster remains unpublished until confirmed.");
