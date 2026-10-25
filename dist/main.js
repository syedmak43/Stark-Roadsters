import { createCarExperience } from "./scene.js";

const $=(selector)=>document.querySelector(selector);
const header=$("#site-header"),nav=$("#main-nav"),menu=$("#menu-toggle");
const canvas=$("#car-canvas"),section=$("#machine");
const motionToggle=$("#motion-toggle"),reset=$("#reset-view");
const progressLine=$("#experience-progress-bar");
const steps=[...document.querySelectorAll(".experience-step")];
const reducedMotion=window.matchMedia("(prefers-reduced-motion: reduce)");

function updateNav(){
  header.classList.toggle("scrolled",window.scrollY>25);
}
window.addEventListener("scroll",updateNav,{passive:true});
updateNav();
menu.addEventListener("click",()=>{
  const open=menu.getAttribute("aria-expanded")!=="true";
  menu.setAttribute("aria-expanded",String(open));
  menu.setAttribute("aria-label",open?"Close menu":"Open menu");
  nav.classList.toggle("open",open);
  document.body.classList.toggle("menu-open",open);
});
nav.querySelectorAll("a").forEach(a=>a.addEventListener("click",()=>{
  menu.setAttribute("aria-expanded","false");
  menu.setAttribute("aria-label","Open menu");
  nav.classList.remove("open");
  document.body.classList.remove("menu-open");
}));
document.addEventListener("keydown",e=>{
  if(e.key==="Escape"&&nav.classList.contains("open")){
    menu.click();
    menu.focus();
  }
});
$("#year").textContent=String(new Date().getFullYear());

let carExperience;
try {
  carExperience=createCarExperience(canvas,{reducedMotion:reducedMotion.matches});
  const observer=new IntersectionObserver(([entry])=>{
    carExperience.setVisible(entry.isIntersecting);
  },{rootMargin:"100px"});
  observer.observe(section);
}catch(error) {
  console.warn("3D renderer not available:",error);
  canvas.hidden=true;
  $("#canvas-fallback").hidden=false;
  reset.disabled=true;
  motionToggle.disabled=true;
  motionToggle.textContent="3D UNAVAILABLE";
  document.querySelector(".scene-instruction").hidden=true;
}

if(reducedMotion.matches) {
  motionToggle.textContent="MOTION OFF";
  motionToggle.setAttribute("aria-pressed","false");
}
reset.addEventListener("click",()=>carExperience?.reset());
motionToggle.addEventListener("click",()=>{
  if(!carExperience)return;
  const next=motionToggle.getAttribute("aria-pressed")!=="true";
  motionToggle.setAttribute("aria-pressed",String(next));
  motionToggle.textContent=next?"MOTION ON":"MOTION OFF";
  carExperience.setMotion(next);
});
const updateMotionPreference=()=>{
  if(reducedMotion.matches){
    motionToggle.setAttribute("aria-pressed","false");
    motionToggle.textContent="MOTION OFF";
    carExperience?.setMotion(false);
  }
};
reducedMotion.addEventListener?.("change",updateMotionPreference);

let lastStep=-1;
function updateExperience(){
  const rect=section.getBoundingClientRect();
  const scrollable=Math.max(1,rect.height-window.innerHeight);
  const progress=Math.max(0,Math.min(1,-rect.top/scrollable));
  carExperience?.setProgress(progress);
  progressLine.style.width=`${progress*100}%`;
  const active=progress<.33?0:progress<.67?1:2;
  if(active===lastStep)return;
  lastStep=active;
  steps.forEach((step,i)=>{
    const isActive=i===active;
    step.classList.toggle("active",isActive);
    step.setAttribute("aria-hidden",String(!isActive));
  });
}
window.addEventListener("scroll",updateExperience,{passive:true});
window.addEventListener("resize",updateExperience,{passive:true});
updateExperience();

// Only replace the following 6 entries with exact records from the original
// Race Pakistan project. Absent source data is shown as explicitly unverified.
async function loadExistingRoster(){
  try {
    const response=await fetch("/data/team.json",{cache:"no-cache"});
    if(!response.ok)throw new Error("Roster file not available");
    const data=await response.json();
    if(!Array.isArray(data.members)||data.members.length!==6)
      throw new Error("Exactly six original roster entries are required");
    const grid=$("#team-grid");
    const complete=data.members.every(m=>typeof m.name==="string"&&m.name.trim()&&typeof m.role==="string"&&m.role.trim());
    if(!complete){
      $("#team-grid").setAttribute("aria-label","Team roster pending verification");
      return;
    }
    const fragment=document.createDocumentFragment();
    data.members.forEach((m,i)=>{
      const article=document.createElement("article");
      article.className="team-card";
      const no=document.createElement("div");
      no.className="team-card-no";
      no.textContent=String(i+1).padStart(2,"0");
      const art=document.createElement("div");
      art.className="team-card-silhouette";
      art.setAttribute("aria-hidden","true");
      art.textContent="S/R";
      const title=document.createElement("h3");
      title.textContent=(typeof m.name==="string"&&m.name.trim())?m.name:`Original member ${no.textContent}`;
      const role=document.createElement("p");
      role.textContent=(typeof m.role==="string"&&m.role.trim())?m.role:"Awaiting existing role";
      article.append(no,art,title,role);
      fragment.appendChild(article);
    });
    grid.replaceChildren(fragment);
    grid.classList.add("has-roster");
    grid.setAttribute("aria-label","Six verified Stark Roadsters team members");
  }catch(error) {
    console.warn("Keeping the team roster unpublished until its source can be verified:",error);
  }
}
loadExistingRoster();

const revealTargets=document.querySelectorAll(".design-card,.team-card,.context-card");
if(!reducedMotion.matches&&"IntersectionObserver" in window){
  const observer=new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){
        entry.target.classList.add("on-screen");
        observer.unobserve(entry.target);
      }
    });
  },{threshold:.08});
  revealTargets.forEach(el=>observer.observe(el));
}
