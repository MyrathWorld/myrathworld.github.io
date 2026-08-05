const body=document.body,$=id=>document.getElementById(id),root=document.documentElement;
const key=`${body.dataset.book}/${body.dataset.chapter}`,chapterIndex=Number(body.dataset.index),chapterTotal=Number(body.dataset.total);
const completedKey="myrath-completed";
let completed=[];
try{completed=JSON.parse(localStorage.getItem(completedKey)||"[]")}catch{}
function saveCompleted(){localStorage.setItem(completedKey,JSON.stringify(completed))}
function markOptions(){document.querySelectorAll("#chapter-select option").forEach(option=>{const base=option.textContent.replace(/ ✓$/,"");option.textContent=completed.includes(option.dataset.key)?base+" ✓":base})}
function updateStatus(){const done=completed.includes(key);$("completion-status").textContent=done?"Concluído ✓":"";$("complete-chapter").textContent=done?"Remover conclusão":"Marcar como concluído";markOptions()}
$("chapter-select").addEventListener("change",event=>location.href=event.target.value);
let size=Number(localStorage.getItem("myrath-font")||19);
function setSize(){size=Math.max(16,Math.min(25,size));root.style.setProperty("--reader-size",size+"px");localStorage.setItem("myrath-font",size)}
$("decrease").onclick=()=>{size--;setSize()};$("increase").onclick=()=>{size++;setSize()};setSize();
const theme=$("theme");
function setTheme(dark){body.classList.toggle("dark",dark);theme.setAttribute("aria-pressed",String(dark));theme.setAttribute("aria-label",dark?"Ativar tema claro":"Ativar tema escuro");localStorage.setItem("myrath-theme",dark?"dark":"light")}
setTheme(localStorage.getItem("myrath-theme")==="dark");theme.onclick=()=>setTheme(!body.classList.contains("dark"));
const aside=$("reader-index"),toggle=$("index-toggle");
function setIndex(open){aside.classList.toggle("open",open);toggle.setAttribute("aria-expanded",String(open));toggle.querySelector("span").textContent=open?"−":"＋"}
toggle.onclick=()=>setIndex(!aside.classList.contains("open"));document.addEventListener("keydown",event=>{if(event.key==="Escape")setIndex(false)});
$("complete-chapter").onclick=()=>{if(completed.includes(key))completed=completed.filter(item=>item!==key);else completed.push(key);saveCompleted();updateStatus();$("action-status").textContent=completed.includes(key)?"Capítulo concluído.":"Conclusão removida."};
$("reset-progress").onclick=()=>{localStorage.removeItem("myrath-position-"+key);completed=completed.filter(item=>item!==key);saveCompleted();scrollTo({top:0,behavior:"smooth"});updateStatus();$("action-status").textContent="Progresso deste capítulo reiniciado."};
$("share-chapter").onclick=async()=>{const data={title:document.title,text:"Leia este capítulo de Myrath",url:location.href};try{if(navigator.share)await navigator.share(data);else if(navigator.clipboard){await navigator.clipboard.writeText(location.href);$("action-status").textContent="Link copiado."}else $("action-status").textContent="Copie o endereço exibido no navegador."}catch(error){if(error.name!=="AbortError")$("action-status").textContent="Não foi possível compartilhar neste navegador."}};
const search=$("chapter-search"),searchResult=$("search-result"),paragraphs=[...document.querySelectorAll("#chapter-body p")];
function escapeHtml(value){return value.replace(/[&<>"']/g,char=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#039;"}[char]))}
function clearSearch(){paragraphs.forEach(p=>p.innerHTML=escapeHtml(p.textContent));searchResult.textContent=""}
function runSearch(){const query=search.value.trim();clearSearch();if(query.length<2){searchResult.textContent=query?"Digite pelo menos 2 caracteres.":"";return}const pattern=new RegExp(query.replace(/[.*+?^${}()|[\]\\]/g,"\\$&"),"gi");let count=0,first=null;paragraphs.forEach(p=>{const text=p.textContent;const matches=text.match(pattern);if(matches){count+=matches.length;p.innerHTML=escapeHtml(text).replace(pattern,match=>`<mark>${match}</mark>`);if(!first)first=p.querySelector("mark")}});searchResult.textContent=count?`${count} ocorrência${count===1?"":"s"}.`:"Nenhuma ocorrência.";if(first)first.scrollIntoView({behavior:"smooth",block:"center"})}
$("search-button").onclick=runSearch;search.addEventListener("keydown",event=>{if(event.key==="Enter")runSearch()});search.addEventListener("search",()=>{if(!search.value)clearSearch()});
let ticking=false;
function updateProgress(){const max=document.documentElement.scrollHeight-innerHeight,progress=max>0?Math.min(1,scrollY/max):0;$("progress").style.width=progress*100+"%";$("book-progress").textContent=Math.round((chapterIndex+progress)/chapterTotal*100)+"% do livro";localStorage.setItem("myrath-last-reading",body.dataset.readerHref);localStorage.setItem("myrath-position-"+key,String(Math.round(scrollY)));if(progress>=.9&&!completed.includes(key)){completed.push(key);saveCompleted();updateStatus()}ticking=false}
addEventListener("scroll",()=>{if(!ticking){requestAnimationFrame(updateProgress);ticking=true}},{passive:true});
const saved=Number(localStorage.getItem("myrath-position-"+key)||0);if(saved>100)requestAnimationFrame(()=>scrollTo(0,saved));updateStatus();updateProgress();