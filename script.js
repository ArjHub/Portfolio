(function(){
var d=document,r=d.documentElement,$=function(s,e){return(e||d).querySelector(s)},$$=function(s){return[].slice.call(d.querySelectorAll(s))};
var tg=$('.menu-toggle'),menu=$('#nav-menu');
function closeMenu(){tg.setAttribute('aria-expanded','false');tg.setAttribute('aria-label','Open navigation');menu.classList.remove('open')}
tg.addEventListener('click',function(){var o=tg.getAttribute('aria-expanded')==='true';tg.setAttribute('aria-expanded',String(!o));tg.setAttribute('aria-label',o?'Open navigation':'Close navigation');menu.classList.toggle('open',!o)});
$$('#nav-menu a').forEach(function(a){a.addEventListener('click',closeMenu)});
d.addEventListener('keydown',function(e){if(e.key==='Escape'&&menu.classList.contains('open')){closeMenu();tg.focus()}});
var th=$('.theme-toggle');
function setLabel(){th.setAttribute('aria-label',r.dataset.theme==='dark'?'Switch to light theme':'Switch to dark theme')}
th.addEventListener('click',function(){var n=r.dataset.theme==='dark'?'light':'dark';r.dataset.theme=n;try{localStorage.setItem('theme',n)}catch(e){}setLabel()});setLabel();
var y=$('#year');if(y)y.textContent=new Date().getFullYear();
var img=$('#portrait');function fb(){img.parentElement.classList.add('fallback')}
img.addEventListener('error',fb);if(img.complete&&img.naturalWidth===0)fb();
var cp=$('[data-copy]'),st=$('.status');
cp.addEventListener('click',function(){var t=cp.dataset.copy;(navigator.clipboard?navigator.clipboard.writeText(t):Promise.reject()).then(function(){st.textContent='Email copied.'},function(){st.textContent=t})});
if('IntersectionObserver' in window){
var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('in');io.unobserve(e.target)}})},{threshold:.1});
$$('.reveal').forEach(function(s){io.observe(s)});
var links=$$('#nav-menu a[href^="#"]');
var so=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){links.forEach(function(a){var on=a.getAttribute('href')==='#'+e.target.id;a.classList.toggle('active',on);if(on)a.setAttribute('aria-current','true');else a.removeAttribute('aria-current')})}})},{rootMargin:'-40% 0px -55% 0px'});
$$('main section[id]').forEach(function(s){so.observe(s)});
}else{$$('.reveal').forEach(function(s){s.classList.add('in')})}
})();
