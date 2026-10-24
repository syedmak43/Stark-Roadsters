import { createServer } from "node:http";
import { existsSync,readFileSync,statSync } from "node:fs";
import { join,resolve,extname,normalize } from "node:path";
const root=resolve(import.meta.dirname,"..");
const preview=process.argv[2]==="dist";
const base=join(root,preview?"dist":"src");
const mime={".html":"text/html; charset=utf-8",".js":"text/javascript; charset=utf-8",
".css":"text/css; charset=utf-8",".json":"application/json; charset=utf-8",
".png":"image/png",".svg":"image/svg+xml",".txt":"text/plain"};
const port=Number(process.env.PORT)||4173;
createServer((req,res)=>{
  const pathname=decodeURIComponent(new URL(req.url,"http://localhost").pathname);
  const requestPath=pathname==="/"?"/index.html":pathname;
  const safe=normalize(requestPath).replace(/^(\.\.(\/|\\|$))+/,"").replace(/^[/\\]+/,"");
  const candidateRoots=preview?[base]:[base,join(root,"public"),root];
  let file;
  for(const candidateRoot of candidateRoots){
    const p=resolve(candidateRoot,safe);
    if(!p.startsWith(resolve(candidateRoot)+"/"))continue;
    if(existsSync(p)&&statSync(p).isFile()){file=p;break;}
  }
  if(!file){res.writeHead(404,{"Content-Type":"text/plain"});res.end("Not found");return;}
  res.writeHead(200,{"Content-Type":mime[extname(file)]||"application/octet-stream","Cache-Control":"no-cache"});
  res.end(readFileSync(file));
}).listen(port,"0.0.0.0",()=>console.log(`Stark Roadsters ${preview?"production preview":"development"} at http://localhost:${port}`));
