(function(){
  "use strict";
  const root=document.documentElement;
  const theme=document.querySelector(".theme-button");
  function label(){if(theme)theme.setAttribute("aria-label",root.dataset.theme==="dark"?"Switch to light theme":"Switch to dark theme");}
  if(theme){theme.addEventListener("click",function(){const next=root.dataset.theme==="dark"?"light":"dark";root.dataset.theme=next;try{localStorage.setItem("ap-theme",next)}catch(e){}label()});label();}
  const search=document.querySelector("#post-search");
  const filters=Array.from(document.querySelectorAll("[data-filter]"));
  const rows=Array.from(document.querySelectorAll(".post-row"));
  const count=document.querySelector("#post-count");
  const empty=document.querySelector("#no-results");
  let active="all";
  function filter(){
    const q=(search?.value||"").trim().toLowerCase();let shown=0;
    rows.forEach(row=>{const matchCategory=active==="all"||row.dataset.category===active;const matchSearch=!q||row.dataset.search.includes(q);const visible=matchCategory&&matchSearch;row.hidden=!visible;if(visible)shown++;});
    if(count)count.textContent=shown+" "+(shown===1?"article":"articles");
    if(empty)empty.hidden=shown!==0;
  }
  filters.forEach(btn=>btn.addEventListener("click",()=>{active=btn.dataset.filter;filters.forEach(b=>{const on=b===btn;b.classList.toggle("active",on);b.setAttribute("aria-pressed",String(on));});filter();}));
  search?.addEventListener("input",filter);
})();