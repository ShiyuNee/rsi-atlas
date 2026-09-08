/* RSI Atlas: a static, source-preserving research catalog. */
'use strict';
const CATEGORY = {'H-Full':'完整 Harness / Agent 程序','H-Skill':'Skill / Tool / Workflow','H-Mem':'Memory / Experience','H-Prompt':'Prompt / Context','Meta':'Improver / Meta-evolution','M-Weight':'Model / Policy 权重','M-Data':'Data / Training loop','Hybrid':'Model–Harness 联合进化','B-Harness':'Harness 优化评测','B-Lifelong':'Continual / Lifelong 评测','B-Reliability':'可靠性 / 归因评测','B-RSI':'RSI / AI-R&D 评测','F':'理论与程序前驱','Feedback':'Feedback / Self-correction','Artifact':'Artifact improvement 对照'};
const GROUPS = [
 ['target','什么在变',['HarnessCode','Prompt','Context','MemoryContent','MemoryMechanism','Skill','Tool','Workflow','Subagent','Evaluator','Data','Weights','Improver']],
 ['modifier','谁来改',['SameModel','SeparateEvolver','StrongerBuilder','LearnedUpdater','JointEvolution']],
 ['feedback','Feedback 来源',['ExecutableVerifier','EnvironmentReward','BenchmarkScore','GoldLabel','LLMJudge','SelfFeedback','HumanDemo','PairwiseFeedback','ProcessReward']],
 ['evolution','进化方式',['OfflineSearch','Online','Prequential','Archive','Population','Sequential','CoEvolution','Continual','Streaming']],
 ['protocol','评估隔离',[]],['depth','Meta-depth',['M0','M1','M2','M3','未明确']],
 ['reading','阅读状态',['原记录 · 详细介绍','原记录 · 横向定位','新增 · 方法与实验设置核对','新增 · 摘要核对']]
];
const LABELS={HarnessCode:'Harness code',MemoryContent:'Memory 内容',MemoryMechanism:'Memory 机制',SameModel:'同一模型',SeparateEvolver:'独立 Evolver',StrongerBuilder:'更强 Builder',LearnedUpdater:'训练过的 Updater',JointEvolution:'联合进化',ExecutableVerifier:'可执行 Verifier',EnvironmentReward:'环境 Reward',BenchmarkScore:'Benchmark 分数',GoldLabel:'Gold label / 答案',LLMJudge:'LLM judge',SelfFeedback:'模型自反馈',HumanDemo:'人类示范',PairwiseFeedback:'成对偏好',ProcessReward:'过程 Reward'};
const LEVEL={C:'Core',K:'Key',R:'Related'};
const PAGE_SIZE=18;
let dataset, papers=[],state={q:'',category:'',quick:'all',year:'',sort:'priority',page:1,facets:{},tags:[],view:'library',paper:''};
const $=s=>document.querySelector(s);
const escapeHTML=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
function text(s){return String(s??'').replace(/\[([^\]]+)\]\([^\s]+\)/g,'$1').replace(/<br\s*\/?>/gi,' ').replace(/[*`$]/g,'').replace(/<[^>]*>/g,'');}
function safeURL(url){try{const u=new URL(url,location.href);return ['https:','http:'].includes(u.protocol)?u.href:'#';}catch{return '#';}}
function markdown(s){
 const t=document.createElement('template');t.innerHTML=marked.parse(String(s??''));
 const allowed=new Set('P BR STRONG EM CODE PRE BLOCKQUOTE UL OL LI A TABLE THEAD TBODY TR TD TH H1 H2 H3 H4 H5 H6 HR DEL SUP SUB'.split(' '));
 for(const el of [...t.content.querySelectorAll('*')]){
  if(!allowed.has(el.tagName)){el.replaceWith(document.createTextNode(el.textContent));continue;}
  const href=el.getAttribute('href');for(const a of [...el.attributes])el.removeAttribute(a.name);
  if(el.tagName==='A'&&href){el.href=safeURL(href);el.target='_blank';el.rel='noopener noreferrer';}
 }
 const d=document.createElement('div');d.append(t.content);return d.innerHTML;
}
function field(p,...keys){for(const key of keys){if(p.fields[key])return p.fields[key];}return '';}
function groupValues(p,id){if(id==='protocol')return [p.protocol];if(id==='depth')return p.depth;if(id==='reading')return [p.review];return p.tags;}
function matches(p,s){
 if(s.category&&!p.categories.includes(s.category))return false;
 if(s.quick==='harness'&&!p.categories.some(c=>c.startsWith('H-')))return false;
 if(s.quick==='core'&&p.priority!=='C')return false;
 if(s.quick==='isolated'&&p.protocol!=='Train → selection → test')return false;
 if(s.quick==='new'&&p.source!=='addition')return false;
 if(s.year&&p.year!==s.year)return false;
 if(!s.q.toLowerCase().trim().split(/\s+/).every(w=>p.searchText.includes(w)))return false;
 if(!s.tags.every(t=>p.tags.includes(t)))return false;
 return Object.entries(s.facets).every(([g,values])=>!values.length||values.some(v=>groupValues(p,g).includes(v)));
}
function filtered(){return papers.filter(p=>matches(p,state)).sort((a,b)=>{
 if(state.sort==='title')return a.title.localeCompare(b.title);
 if(state.sort==='priority'){const order={C:0,K:1,R:2};if(a.priority!==b.priority)return order[a.priority]-order[b.priority];}
 return state.sort==='oldest'?a.date.localeCompare(b.date):b.date.localeCompare(a.date);
});}
function readURL(){const u=new URLSearchParams(location.search);state.q=u.get('q')||'';state.category=CATEGORY[u.get('category')]?u.get('category'):'';state.quick=['all','harness','core','isolated','new'].includes(u.get('quick'))?u.get('quick'):'all';state.sort=['priority','newest','oldest','title'].includes(u.get('sort'))?u.get('sort'):'priority';state.year=u.get('year')||'';state.page=Math.max(1,parseInt(u.get('page'))||1);state.tags=u.getAll('tag');state.facets={};for(const [g]of GROUPS)state.facets[g]=u.getAll(g);state.paper=u.get('paper')||'';state.view=['framework','notes'].includes(u.get('view'))?u.get('view'):'library';}
function writeURL(){const u=new URLSearchParams();for(const k of ['q','category','year','paper'])if(state[k])u.set(k,state[k]);if(state.quick!=='all')u.set('quick',state.quick);if(state.sort!=='priority')u.set('sort',state.sort);if(state.page>1)u.set('page',state.page);if(state.view!=='library')u.set('view',state.view);for(const [g,vs]of Object.entries(state.facets))vs.forEach(v=>u.append(g,v));state.tags.forEach(t=>u.append('tag',t));history.replaceState(null,'',location.pathname+(u.size?'?'+u:''));}
function syncControls(){ $('#search').value=state.q;$('#year').value=state.year;$('#sort').value=state.sort;document.querySelectorAll('[data-quick]').forEach(b=>b.classList.toggle('selected',b.dataset.quick===state.quick));document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('selected',b.dataset.category===state.category));document.querySelectorAll('[data-group]').forEach(el=>el.checked=(state.facets[el.dataset.group]||[]).includes(el.value));}
function buildFilters(){
 $('#categories').innerHTML=`<button class="category" data-category=""><span>全部论文</span><span class="count">${papers.length}</span></button>`+Object.entries(CATEGORY).map(([id,name])=>`<button class="category" data-category="${id}"><span>${name}</span><span class="count">${papers.filter(p=>p.categories.includes(id)).length}</span></button>`).join('');
 GROUPS.find(g=>g[0]==='protocol')[2]=[...new Set(papers.map(p=>p.protocol))].sort();
 $('#facets').innerHTML=GROUPS.map(([id,title,values],i)=>`<details class="facet" ${i===0?'open':''}><summary>${title}</summary><div class="facet-options">${values.map(v=>`<label><input type="checkbox" data-group="${id}" value="${escapeHTML(v)}"><span>${escapeHTML(LABELS[v]||v)}</span><small>${papers.filter(p=>groupValues(p,id).includes(v)).length}</small></label>`).join('')}</div></details>`).join('');
 $('#year').innerHTML='<option value="">全部年份</option>'+[...new Set(papers.map(p=>p.year))].sort().reverse().map(y=>`<option>${escapeHTML(y)}</option>`).join('');
 $('#total').textContent=papers.length;$('#new-count').textContent=papers.filter(p=>p.source==='addition').length;$('#updated').textContent=dataset.updated;
}
function caution(p){return /Same-set|混合|参与|重试/.test(p.protocol);}
function card(p){const brief=field(p,'本质定位','我们的定位：什么在变、真正新点');const change=field(p,'什么在变')||p.categories.map(c=>CATEGORY[c]).join(' / ');const actor=field(p,'谁来改 / 谁执行','谁来改 → 谁执行；基础 harness','被测系统 / seed harness / feedback','被测系统 / feedback');const feedback=field(p,'Feedback','Feedback / evidence','证据边界与关键结论');
 return `<article class="paper-card"><div class="card-main"><div class="card-meta"><span class="level level-${p.priority}">${LEVEL[p.priority]}</span><span>${escapeHTML(p.categories.join(' / '))}</span><span class="protocol ${caution(p)?'caution':''}" title="${escapeHTML(p.protocolBasis)}">${escapeHTML(p.protocol)}</span>${p.source==='addition'?'<span class="new-label">NEW</span>':''}<time class="date">${escapeHTML(p.date||'日期待补')}</time></div><h2 style="margin:0"><button class="paper-title" data-paper="${p.id}">${escapeHTML(p.title)}</button></h2><p class="summary">${escapeHTML(text(brief))}</p><div class="card-grid"><div class="mini-field"><span>EDITABLE OBJECT</span><p>${escapeHTML(text(change))}</p></div><div class="mini-field"><span>改 → 执行</span><p>${escapeHTML(text(actor)||'原记录未明确，待补充')}</p></div><div class="mini-field"><span>FEEDBACK</span><p>${escapeHTML(text(feedback)||'原记录未单列，见详情')}</p></div></div></div><div class="card-foot"><div class="tags">${p.tags.filter(t=>!/^M[0-3]$/.test(t)).slice(0,5).map(t=>`<button class="tag" data-tag="${t}" title="筛选 ${t}">#${t}</button>`).join('')}${!p.tags.length?'<span class="tag">标签待补全</span>':''}</div><div class="card-links"><a href="${escapeHTML(safeURL(p.url))}" target="_blank" rel="noopener noreferrer">论文 ↗</a><button data-paper="${p.id}">${p.details.length?'详细笔记':'研究记录'} →</button></div></div></article>`;
}
function render(){
 const items=filtered(),max=Math.max(1,Math.ceil(items.length/PAGE_SIZE));state.page=Math.min(state.page,max);syncControls();
 $('#result-count').innerHTML=`<strong>${items.length}</strong> 篇论文 <span style="color:var(--muted)">/ 共 ${papers.length} 篇</span>`;
 $('#results').innerHTML=items.length?items.slice((state.page-1)*PAGE_SIZE,state.page*PAGE_SIZE).map(card).join(''):'<div class="empty"><h3>没有匹配的论文</h3><p>试试更宽的关键词，或减少筛选条件。未标注标签不代表论文没有该机制。</p><button class="secondary" data-reset>清除全部筛选</button></div>';
 let chips=[];if(state.q)chips.push(['q',state.q]);if(state.category)chips.push(['category',CATEGORY[state.category]]);if(state.year)chips.push(['year',state.year]);for(const [g,values]of Object.entries(state.facets))values.forEach(v=>chips.push([g,v]));state.tags.forEach(t=>chips.push(['tag',t]));
 $('#active-filters').innerHTML=chips.map(([g,v])=>`<button class="remove-filter" data-remove="${g}" data-value="${escapeHTML(v)}">${escapeHTML(LABELS[v]||v)} ×</button>`).join('');
 $('#pagination').innerHTML=max>1?`<button data-page="${state.page-1}" ${state.page===1?'disabled':''}>←</button>`+Array.from({length:max},(_,i)=>i+1).filter(n=>n===1||n===max||Math.abs(n-state.page)<2).map((n,i,ns)=>(i&&n>ns[i-1]+1?'<span>…</span>':'')+`<button data-page="${n}" ${n===state.page?'aria-current="page"':''}>${n}</button>`).join('')+`<button data-page="${state.page+1}" ${state.page===max?'disabled':''}>→</button>`:'';
 showView();writeURL();
}
function showView(){const library=state.view==='library';$('#library-view').hidden=!library;$('#document-view').hidden=library;document.querySelectorAll('.topbar [data-view]').forEach(b=>b.classList.toggle('nav-active',b.dataset.view===state.view));if(!library){const extra=state.view==='framework'?`## 网站阅读口径\n\n原记录：${dataset.originalCount} 篇；本轮补充：${papers.length-dataset.originalCount} 篇。原文未逐篇重新验证。\n\n- **代表性**沿用原记录的 C / K / R，不与证据强度合并。\n- **Train → selection → test**为已明确记录三阶段边界的条目；“有 held-out 报告”不自动等于 sealed test。混合协议必须看任务级描述。\n- **标签**来自原始显式标签与按同篇字段整理的标注；缺标签表示待补全，不表示机制不存在。\n- **新增文章**标注核对范围与原始来源。初步定位不自动升为 Core。\n- **日期**保留原记录精度；新增日期使用 arXiv 首次提交时间。\n\n`:'';$('#document-content').innerHTML=markdown(extra+(state.view==='framework'?dataset.framework:dataset.conclusions));}}
function reset(){state={...state,q:'',category:'',quick:'all',year:'',page:1,facets:{},tags:[],view:'library'};render();}
function openPaper(id){const p=papers.find(p=>p.id===id);if(!p)return;state.paper=id;
 const f=p.fields;const rows=Object.entries(f).filter(([k])=>k!=='本质定位');
 $('#paper-content').innerHTML=`<div class="card-meta"><span class="level level-${p.priority}">${LEVEL[p.priority]}</span><span>${escapeHTML(p.review)}</span><time class="date">${escapeHTML(p.date)}</time></div><h2 id="paper-title">${escapeHTML(p.title)}</h2><div class="detail-links"><a href="${escapeHTML(safeURL(p.url))}" target="_blank" rel="noopener noreferrer">阅读论文 ↗</a>${(p.links||[]).map(l=>`<a href="${escapeHTML(safeURL(l.url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(l.label)} ↗</a>`).join('')}<button id="copy-link" class="text-button">复制此论文链接</button></div><div class="tags">${p.tags.map(t=>`<span class="tag">#${escapeHTML(t)}</span>`).join('')}</div><div class="detail-note"><strong>${escapeHTML(p.protocol)}</strong><br>${escapeHTML(p.protocolBasis)}${p.updateNote?'<br>'+escapeHTML(p.updateNote):''}</div><div class="detail-section">${markdown(f['本质定位']||'')}<dl class="detail-fields">${rows.map(([k,v])=>`<dt>${escapeHTML(k)}</dt><dd>${markdown(v)}</dd>`).join('')}</dl></div>${p.details.length?`<section class="detail-section"><h3>详细调研笔记</h3><dl class="detail-fields">${p.details.map(d=>`<dt>${escapeHTML(d.label)}</dt><dd>${markdown(d.text)}</dd>`).join('')}</dl></section>`:''}<section class="source-details"><strong>来源与阅读范围</strong><p>${escapeHTML(p.review)} · ${p.source==='original'?'沿用用户调研记录；未在本轮逐篇重审':'2026-09-08 补查，详见来源'}</p>${(p.sources||[]).map((u,i)=>`<p><a href="${escapeHTML(safeURL(u))}" target="_blank" rel="noopener noreferrer">${p.source==='original'?'补充核对':'原始来源'} ${i+1} ↗</a></p>`).join('')}${p.occurrences.length?`<details><summary>查看原始表格记录 · ${p.occurrences.length} 处</summary>${p.occurrences.map(o=>`<div class="source-record"><strong>${escapeHTML(o.section)} · L${o.line}</strong><dl>${Object.entries(o.fields).map(([k,v])=>`<dt>${escapeHTML(k)}</dt><dd>${markdown(v)}</dd>`).join('')}</dl></div>`).join('')}</details>`:''}</section>`;
 if(!$('#paper-dialog').open)$('#paper-dialog').showModal();$('#paper-dialog').scrollTop=0;writeURL();
}
function bind(){
 document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.paper){openPaper(b.dataset.paper);return;}
 if(b.id==='close-dialog'){$('#paper-dialog').close();return;}
 if(b.id==='copy-link'){try{await navigator.clipboard.writeText(location.href);b.textContent='已复制';}catch{b.textContent='请复制浏览器地址栏链接';}return;}
 if(b.dataset.view){state.view=b.dataset.view;render();return;}
 if(b.hasAttribute('data-category')){state.category=b.dataset.category;state.quick='all';state.view='library';state.page=1;render();return;}
 if(b.dataset.quick){state.quick=b.dataset.quick;state.category='';state.page=1;render();return;}
 if(b.dataset.tag){if(!state.tags.includes(b.dataset.tag))state.tags.push(b.dataset.tag);state.page=1;render();return;}
 if(b.dataset.page){state.page=+b.dataset.page;render();$('#results').scrollIntoView({block:'start'});return;}
 if(b.dataset.remove){const g=b.dataset.remove,v=b.dataset.value;if(['q','category','year'].includes(g))state[g]='';else if(g==='tag')state.tags=state.tags.filter(t=>t!==v);else state.facets[g]=(state.facets[g]||[]).filter(t=>t!==v);state.page=1;render();return;}
 if(b.id==='clear-side'||b.hasAttribute('data-reset'))reset();
 });
 document.addEventListener('change',e=>{const t=e.target;if(t.dataset.group){const g=t.dataset.group;state.facets[g]=state.facets[g]||[];state.facets[g]=t.checked?[...state.facets[g],t.value]:state.facets[g].filter(v=>v!==t.value);state.page=1;state.view='library';render();}if(t.id==='year'||t.id==='sort'){state[t.id]=t.value;state.page=1;render();}});
 $('#search').addEventListener('input',e=>{state.q=e.target.value;state.page=1;render();});
 $('#paper-dialog').addEventListener('close',()=>{state.paper='';writeURL();});
 $('#paper-dialog').addEventListener('click',e=>{if(e.target===$('#paper-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#paper-dialog').open){e.preventDefault();state.view='library';render();$('#search').focus();}});
 window.addEventListener('popstate',()=>{readURL();render();if(state.paper)openPaper(state.paper);else if($('#paper-dialog').open)$('#paper-dialog').close();});
 const media=matchMedia('(max-width:760px)');$('#filter-panel').open=!media.matches;media.addEventListener('change',e=>$('#filter-panel').open=!e.matches);
}
async function init(){try{const r=await fetch('data/papers.json');if(!r.ok)throw new Error('data');dataset=await r.json();papers=dataset.papers.map(p=>({...p,searchText:text(JSON.stringify(p)).toLowerCase()}));readURL();buildFilters();bind();render();if(state.paper)openPaper(state.paper);}catch(e){$('#result-count').textContent='论文数据加载失败';$('#results').innerHTML='<div class="empty"><p>请刷新页面重试，或下载原始记录。</p><a href="data/research-notes.md">打开 Markdown 记录 →</a></div>';console.error(e);}}
// Export pure query behavior for non-browser tests.
if(typeof module!=='undefined'&&module.exports)module.exports={matches,text};else init();
