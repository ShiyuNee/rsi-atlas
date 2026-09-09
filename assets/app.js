/* RSI Atlas: a static, source-preserving research catalog. */
'use strict';
const CATEGORY={methods:'Methods · 方法',evaluation:'Evaluation · 评估',dataset:'Dataset · 数据集',theory:'Theory · 理论'};
const METHODS={harness:'Harness 进化',artifact:'产物进化',weights:'模型参数进化',joint:'Harness + 模型参数进化'};
const GROUPS = [
 ['gaps','待补查的维度',[]],
 ['priority','阅读优先级',['C','K','R']],
 ['content','介绍深度',['完整专题解读','原记录详细笔记','结构化介绍']],
 ['verified','核对范围',['原文关键段落已复核','沿用原记录']],
 ['target','什么在变',['HarnessCode','Prompt','Context','MemoryContent','MemoryMechanism','Skill','Tool','Workflow','Subagent','Evaluator','Data','Weights','Improver']],
 ['modifier','谁来改',['SameModel','SeparateEvolver','StrongerBuilder','LearnedUpdater','JointEvolution']],
 ['feedback','Feedback 来源',['ExecutableVerifier','EnvironmentReward','BenchmarkScore','GoldLabel','LLMJudge','SelfFeedback','HumanDemo','PairwiseFeedback','ProcessReward']],
 ['evolution','进化方式',['OfflineSearch','Online','Prequential','Archive','Population','Sequential','CoEvolution','Continual','Streaming']],
 ['protocol','评估隔离',[]],['depth','Meta-depth',['M0','M1','M2','M3','未明确']],
 ['reading','阅读状态',['原记录 · 详细介绍','原记录 · 横向定位','新增 · 方法与实验设置核对','新增 · 摘要核对']]
];
const LABELS={C:'Core · 代表作',K:'Key · 重点',R:'Related · 相关',EditorWeights:'修改者的参数',HarnessCode:'Harness code',MemoryContent:'Memory 内容',MemoryMechanism:'Memory 机制',SameModel:'同一模型',SeparateEvolver:'独立 Evolver',StrongerBuilder:'更强 Builder',LearnedUpdater:'训练过的 Updater',JointEvolution:'联合进化',ExecutableVerifier:'可执行 Verifier',EnvironmentReward:'环境 Reward',BenchmarkScore:'Benchmark 分数',GoldLabel:'Gold label / 答案',LLMJudge:'LLM judge',SelfFeedback:'模型自反馈',HumanDemo:'人类示范',PairwiseFeedback:'成对偏好',ProcessReward:'过程 Reward'};
const LEVEL={C:'Core',K:'Key',R:'Related'};
const PAGE_SIZE=12;
let dataset, papers=[],state={q:'',category:'',quick:'all',year:'',sort:'priority',page:1,facets:{},tags:[],paper:'',view:'library',paper:''};
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
function groupValues(p,id){if(id==='gaps')return p.profile?.missing||[];if(id==='content')return [p.readingNote?'完整专题解读':p.details.length?'原记录详细笔记':'结构化介绍'];if(id==='priority')return [p.priority];if(id==='verified')return [p.reviewed?'原文关键段落已复核':'沿用原记录'];if(id==='protocol')return [p.protocol];if(id==='depth')return p.depth;if(id==='reading')return [p.review];return p.tags;}
function matches(p,s){
 if(s.category&&!p.categories.includes(s.category))return false;
 if(METHODS[s.quick]&&p.methodType!==s.quick)return false;
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
function readURL(){const u=new URLSearchParams(location.search);state.q=u.get('q')||'';state.category=CATEGORY[u.get('category')]?u.get('category'):'';state.quick=['all','harness','artifact','weights','joint','core','isolated','new'].includes(u.get('quick'))?u.get('quick'):'all';state.sort=['priority','newest','oldest','title'].includes(u.get('sort'))?u.get('sort'):'priority';state.year=u.get('year')||'';state.page=Math.max(1,parseInt(u.get('page'))||1);state.tags=u.getAll('tag');state.facets={};for(const [g]of GROUPS)state.facets[g]=u.getAll(g);if(METHODS[state.quick])state.category='methods';if(state.quick==='core'){state.facets.priority=['C'];state.quick='all';}if(state.quick==='isolated'){state.facets.protocol=['Train → selection → test'];state.quick='all';}state.paper=u.get('paper')||'';state.view=state.paper?'paper':(['framework','notes'].includes(u.get('view'))?u.get('view'):'library');}
function writeURL(){const u=new URLSearchParams();for(const k of ['q','category','year','paper'])if(state[k])u.set(k,state[k]);if(state.quick!=='all')u.set('quick',state.quick);if(state.sort!=='priority')u.set('sort',state.sort);if(state.page>1)u.set('page',state.page);if(!['library','paper'].includes(state.view))u.set('view',state.view);for(const [g,vs]of Object.entries(state.facets))vs.forEach(v=>u.append(g,v));state.tags.forEach(t=>u.append('tag',t));history.replaceState(null,'',location.pathname+(u.size?'?'+u:''));}
function syncControls(){ $('.quick-filters').hidden=!!state.category&&state.category!=='methods'; $('#search').value=state.q;$('#year').value=state.year;$('#sort').value=state.sort;document.querySelectorAll('[data-quick]').forEach(b=>b.classList.toggle('selected',b.dataset.quick===state.quick));document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('selected',b.dataset.category===state.category));document.querySelectorAll('[data-group]').forEach(el=>el.checked=(state.facets[el.dataset.group]||[]).includes(el.value));}
function buildFilters(){
 const icons={'':'▦',methods:'⚙',evaluation:'✓',dataset:'▤',theory:'∑'};
 $('#category-shortcuts').innerHTML=Object.entries({'':'全部论文',...CATEGORY}).map(([id,name])=>`<button data-category="${id}"><span aria-hidden="true">${icons[id]}</span> ${name} <small>${papers.filter(p=>!id||p.category===id).length}</small></button>`).join('');
 $('#categories').innerHTML=`<button class="category" data-category=""><span>全部论文</span><span class="count">${papers.length}</span></button>`+Object.entries(CATEGORY).map(([id,name])=>`<button class="category" data-category="${id}"><span>${name}</span><span class="count">${papers.filter(p=>p.categories.includes(id)).length}</span></button>`).join('');
 GROUPS.find(g=>g[0]==='gaps')[2]=[...new Set(papers.flatMap(p=>p.profile?.missing||[]))];
 GROUPS.find(g=>g[0]==='protocol')[2]=[...new Set(papers.map(p=>p.protocol))].sort();
 $('#facets').innerHTML=GROUPS.map(([id,title,values],i)=>`<details class="facet" ${i===0||id==='content'?'open':''}><summary>${title}</summary><div class="facet-options">${values.map(v=>`<label><input type="checkbox" data-group="${id}" value="${escapeHTML(v)}"><span>${escapeHTML(LABELS[v]||v)}</span><small>${papers.filter(p=>groupValues(p,id).includes(v)).length}</small></label>`).join('')}</div></details>`).join('');
 $('#year').innerHTML='<option value="">全部年份</option>'+[...new Set(papers.map(p=>p.year))].sort().reverse().map(y=>`<option>${escapeHTML(y)}</option>`).join('');
 $('#total').textContent=papers.length;$('#updated').textContent=dataset.updated;
}
function caution(p){return /Same-set|混合|参与|重试/.test(p.protocol);}
function profileTable(p){const profile=p.profile;const statuses={recorded:'已记录',partial:'信息合并 / 待细分',missing:'待核查','not-applicable':'不适用'};
 return `<section class="profile-block"><h2>研究维度对照</h2><p class="reading-scope">“已记录”表示有对应说明，不等于已完成原文逐项验证。每篇的原文核对范围见下方。</p><div class="table-scroll"><table class="profile-table"><thead><tr><th>研究问题</th><th>具体说明</th><th>信息状态</th></tr></thead><tbody>${profile.fields.map(f=>`<tr><th scope="row">${escapeHTML(f.label)}</th><td>${f.value?markdown(f.value):'<span class="unknown-value">本轮尚未确认；不推断论文没有涉及。</span>'}</td><td><span class="field-status ${f.status}">${statuses[f.status]}</span>${f.value?`<small>${escapeHTML(f.source)}</small>`:''}</td></tr>`).join('')}</tbody></table></div></section>`;
}
function sourceCheck(p){const c=p.profile.sourceCheck;return `<div class="source-check"><b>原文核对 · ${escapeHTML(c.date)}</b><p>${escapeHTML(c.scope)}</p>${p.focusedReview?`<p>${escapeHTML(p.brief.reading)}</p>`:''}<a href="${escapeHTML(safeURL(c.url))}" target="_blank" rel="noopener noreferrer">原文 / 作者来源 ↗</a>${p.focusedReview?(p.brief.sources||[]).map(u=>` · <a href="${escapeHTML(safeURL(u))}" target="_blank" rel="noopener noreferrer">定向补查来源 ↗</a>`).join(''):''}</div>`;}
function research(p){
 const labels={executor:'谁执行',modifier:'谁来改',object:'什么在进化',verdict:'反馈是什么',seed:'基础 harness 是什么'};
 const missing={executor:'尚未核实执行任务的模型与运行系统。',modifier:'尚未核实修改由哪个模型或程序提出和实施。',object:'尚未核实具体允许修改的对象。',verdict:'尚未核实谁给反馈、怎样判对错，以及修改者能看到哪些结果。',seed:'尚未核实初始系统包含的工具、运行流程和缺少的功能。'};
 const selected=Object.keys(labels).map(key=>p.profile.fields.find(f=>f.key===key));
 return `<dl class="research-fields">${selected.map(f=>`<div><dt>${labels[f.key]}</dt><dd>${f.value?markdown(f.value):`<span class="unknown-value">${missing[f.key]}</span>`}</dd></div>`).join('')}</dl><details class="mechanism"><summary>查看数据、更新规则与全部研究维度</summary>${profileTable(p)}${sourceCheck(p)}</details>`;
}
function card(p){const b=p.brief,n=p.readingNote;const intro=n?n.intro:b.summary;const conclusion=n?n.index.tldr:b.novelty;
 return `<article class="paper-card"><div class="card-main"><div class="card-meta"><span>${CATEGORY[p.category]}${p.methodType?' / '+METHODS[p.methodType]:''}</span><span class="level level-${p.priority}">${LEVEL[p.priority]}</span>${n?'<span class="reading-badge">完整专题解读 · 6 节</span>':''}<time class="date">${escapeHTML(p.date)}</time></div><h2><button class="paper-title" data-paper="${p.id}">${escapeHTML(p.title)}</button></h2><div class="intro-copy">${markdown(intro)}</div>${conclusion?`<div class="card-takeaway"><span>这篇的特点与区别</span>${markdown(conclusion)}</div>`:b.novelty&&b.novelty!==b.summary?`<div class="novelty">${markdown(b.novelty)}</div>`:''}${research(p)}${n?notesCaveats(n):''}</div><div class="card-foot"><div class="tags">${p.tags.filter(t=>!/^M[0-3]$/.test(t)).map(t=>`<button class="tag" data-tag="${escapeHTML(t)}">#${escapeHTML(t)}</button>`).join('')}</div><div class="card-links"><a href="${escapeHTML(safeURL(p.url))}" target="_blank" rel="noopener noreferrer">论文 ↗</a><button class="read-action" data-paper="${p.id}">${n?'阅读全文解读':p.details.length?'阅读详细笔记':'阅读研究记录'} →</button></div></div></article>`;
}
function markdownInline(s){return markdown(s).replace(/^<p>/,'').replace(/<\/p>\n?$/,'');}
function notesCaveats(n){return (n.caveats||[]).map(c=>`<p class="source-caveat"><b>原文口径补注：</b>${escapeHTML(c.text)} <a href="${escapeHTML(safeURL(c.url))}" target="_blank" rel="noopener noreferrer">核对来源 ↗</a></p>`).join('');}
function render(){
 const items=filtered(),max=Math.max(1,Math.ceil(items.length/PAGE_SIZE));state.page=Math.min(state.page,max);syncControls();
 $('#result-count').innerHTML=`<strong>${items.length}</strong> 篇论文 <span style="color:var(--muted)">/ 共 ${papers.length} 篇</span>`;
 $('#results').innerHTML=items.length?items.slice((state.page-1)*PAGE_SIZE,state.page*PAGE_SIZE).map(card).join(''):'<div class="empty"><h3>没有匹配的论文</h3><p>试试更宽的关键词，或减少筛选条件。未标注标签不代表论文没有该机制。</p><button class="secondary" data-reset>清除全部筛选</button></div>';
 let chips=[];if(state.q)chips.push(['q',state.q]);if(state.category)chips.push(['category',CATEGORY[state.category]]);if(METHODS[state.quick])chips.push(['quick',METHODS[state.quick]]);if(state.year)chips.push(['year',state.year]);for(const [g,values]of Object.entries(state.facets))values.forEach(v=>chips.push([g,v]));state.tags.forEach(t=>chips.push(['tag',t]));
 $('#active-filters').innerHTML=chips.map(([g,v])=>`<button class="remove-filter" data-remove="${g}" data-value="${escapeHTML(v)}">${escapeHTML(LABELS[v]||v)} ×</button>`).join('');
 $('#pagination').innerHTML=max>1?`<button data-page="${state.page-1}" ${state.page===1?'disabled':''}>←</button>`+Array.from({length:max},(_,i)=>i+1).filter(n=>n===1||n===max||Math.abs(n-state.page)<2).map((n,i,ns)=>(i&&n>ns[i-1]+1?'<span>…</span>':'')+`<button data-page="${n}" ${n===state.page?'aria-current="page"':''}>${n}</button>`).join('')+`<button data-page="${state.page+1}" ${state.page===max?'disabled':''}>→</button>`:'';
 showView();writeURL();
}
function showView(){$('.page-heading').hidden=state.view==='paper';if(state.view==='library')state.paper='';if(state.view==='paper'){renderReading();return;}const library=state.view==='library';$('#library-view').hidden=!library;$('#document-view').hidden=library;document.querySelectorAll('.topbar [data-view]').forEach(b=>b.classList.toggle('nav-active',b.dataset.view===state.view));if(!library){const extra=state.view==='framework'?`## 网站阅读口径\n\n原记录：${dataset.originalCount} 篇；本轮补充：${papers.length-dataset.originalCount} 篇。新增逐篇定位核对范围；详细参数和实验仍按字段标明待核查。更新笔记另提供 9 篇完整专题解读。\n\n- **代表性**沿用原记录的 C / K / R，不与证据强度合并。\n- **Train → selection → test**为已明确记录三阶段边界的条目；“有 held-out 报告”不自动等于 sealed test。混合协议必须看任务级描述。\n- **标签**来自原始显式标签与按同篇字段整理的标注；缺标签表示待补全，不表示机制不存在。\n- **新增文章**标注核对范围与原始来源。初步定位不自动升为 Core。\n- **日期**保留原记录精度；新增日期使用 arXiv 首次提交时间。\n\n`:'';$('#document-content').innerHTML=markdown(extra+(state.view==='framework'?'## 分类与标签\n\n一级：Methods、Evaluation、Dataset、Theory。\n\nMethods 按变化对象分为 Harness 进化、产物进化（不改 harness 和模型参数）、模型参数进化、Harness + 模型参数进化。联合进化架构不等于已验证多代联合闭环，需逐篇看证据。\n\nCore / Key 是阅读优先级；反馈、执行者、meta-depth 和数据隔离是独立筛选维度。Dataset 当前没有独立收录项，不把所有评测框架硬归为数据集。\n\n原始笔记保留供追溯；25 篇本轮核对了原文方法与实验关键段落，其余不宣称逐篇复核。':dataset.conclusions));}}
function reset(){state={...state,q:'',category:'',quick:'all',year:'',page:1,facets:{},tags:[],paper:'',view:'library'};render();}
function readingSections(p){if(p.readingNote)return p.readingNote.sections;
 const b=p.brief,fs=p.profile.fields;const answer=keys=>fs.filter(f=>keys.includes(f.key)&&f.value).map(f=>`### ${f.label}\n\n${f.value}`).join('\n\n');
 const evaluation=p.category==='evaluation',theory=p.category==='theory';
 return [{title:evaluation?'1. 测什么，为什么这样测':theory?'1. 理论问题与构造':'1. 方法机制与区别',body:b.summary+'\n\n'+b.novelty},
 {title:evaluation?'2. 被测系统、反馈与评估控制':theory?'2. 可变对象、搜索与证明条件':'2. 执行者、修改者与反馈链路',body:answer(['object','executor','modifier','seed','fixed','verdict','diagnosis','update','acceptance'])},
 {title:'3. 数据与实验边界',body:answer(['protocol'])||'本轮尚未核实具体数据划分，不能把未知当成无隔离。'},
 {title:'4. 结果与证据边界',body:[b.result,b.takeaway].filter(Boolean).join('\n\n')||'本轮尚未完成结果、消融和限制的逐项补查；上方方法定位不等于其效果已经被充分验证。'},
 ...(p.details.length?[{title:'5. 原记录的详细论述',body:'保留原始分析供对照；不同来源的配置或结论可能需要继续核实。\n\n'+p.details.map(d=>`### ${d.label}\n\n${d.text}`).join('\n\n')}]:[])];
}
function renderReading(){const p=papers.find(p=>p.id===state.paper);if(!p){state.view='library';state.paper='';showView();return;}
 $('#library-view').hidden=true;$('#document-view').hidden=false;document.querySelectorAll('.topbar [data-view]').forEach(b=>b.classList.remove('nav-active'));
 const n=p.readingNote,sections=readingSections(p);
 $('#document-content').innerHTML=`<div class="reader-top"><button class="secondary" data-view="library">← 返回论文列表</button><span>${CATEGORY[p.category]}${p.methodType?' / '+METHODS[p.methodType]:''}</span><time>${escapeHTML(p.date)}</time></div><h1 class="reader-title">${escapeHTML(p.title)}</h1><p class="reading-scope">${n?'根据你提供的更新调研笔记整理；保留具体实验、消融、作者结论与调研评判。':escapeHTML(p.brief.reading)}</p><div class="detail-links"><a href="${escapeHTML(safeURL(p.url))}" target="_blank" rel="noopener noreferrer">阅读论文 ↗</a><button id="copy-link" class="text-button">复制此篇链接</button>${n?'<a href="data/updated-research-notes.md" download>下载更新笔记 ↓</a>':''}</div>${n?notesCaveats(n):''}${sourceCheck(p)}<div class="reader-intro">${markdown(n?n.intro:p.brief.summary)}</div>${profileTable(p)}<nav class="reader-outline" aria-label="文章目录">${sections.map((sec,i)=>`<button data-section="reading-section-${i}">${escapeHTML(sec.title)}</button>`).join('')}</nav>${sections.map((sec,i)=>`<section class="reading-section" id="reading-section-${i}"><h2>${escapeHTML(sec.title)}</h2>${markdown(sec.body)}</section>`).join('')}<footer class="reader-sources"><b>来源与阅读范围</b><p>${n?'主体内容来自用户更新调研笔记；本轮接入不等于重新逐项核实所有数值。涉及原文口径差异的部分已单列补注。':escapeHTML(p.brief.reading)}</p>${(p.brief.sources||[]).map((u,i)=>`<a href="${escapeHTML(safeURL(u))}" target="_blank" rel="noopener noreferrer">原文来源 ${i+1} ↗</a>`).join(' · ')}<p><a href="data/research-notes.md" download>最初调研记录 ↓</a></p></footer><button class="secondary" data-view="library">← 返回论文列表</button>`;
}
function openPaper(id){if(!papers.some(p=>p.id===id))return;state.paper=id;state.view='paper';render();$('#document-view').scrollIntoView({block:'start'});}
function bind(){
 document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
 if(b.dataset.paper){openPaper(b.dataset.paper);return;}
 if(b.id==='mobile-filter'){const panel=$('#filter-panel');panel.open=!panel.open;b.setAttribute('aria-expanded',String(panel.open));if(panel.open)panel.scrollIntoView({block:'start',behavior:'smooth'});return;}
 if(b.id==='close-dialog'){$('#paper-dialog').close();return;}
 if(b.id==='copy-link'){try{await navigator.clipboard.writeText(location.href);b.textContent='已复制';}catch{b.textContent='请复制浏览器地址栏链接';}return;}
 if(b.dataset.reading){state.facets.content=['完整专题解读'];state.paper='';state.view='library';state.page=1;render();return;}
 if(b.dataset.section){document.getElementById(b.dataset.section)?.scrollIntoView({block:'start',behavior:'smooth'});return;}
 if(b.dataset.view){state.paper='';state.view=b.dataset.view;render();return;}
 if(b.hasAttribute('data-category')){state.category=b.dataset.category;state.quick='all';state.paper='';state.view='library';state.page=1;render();return;}
 if(b.dataset.quick){state.quick=b.dataset.quick;state.category='methods';state.page=1;render();return;}
 if(b.dataset.tag){if(!state.tags.includes(b.dataset.tag))state.tags.push(b.dataset.tag);state.page=1;render();return;}
 if(b.dataset.page){state.page=+b.dataset.page;render();$('#results').scrollIntoView({block:'start'});return;}
 if(b.dataset.remove){const g=b.dataset.remove,v=b.dataset.value;if(g==='quick')state.quick='all';else if(['q','category','year'].includes(g))state[g]='';else if(g==='tag')state.tags=state.tags.filter(t=>t!==v);else state.facets[g]=(state.facets[g]||[]).filter(t=>t!==v);state.page=1;render();return;}
 if(b.id==='clear-side'||b.hasAttribute('data-reset'))reset();
 });
 document.addEventListener('change',e=>{const t=e.target;if(t.dataset.group){const g=t.dataset.group;state.facets[g]=state.facets[g]||[];state.facets[g]=t.checked?[...state.facets[g],t.value]:state.facets[g].filter(v=>v!==t.value);state.page=1;state.view='library';render();}if(t.id==='year'||t.id==='sort'){state[t.id]=t.value;state.page=1;render();}});
 $('#search').addEventListener('input',e=>{state.q=e.target.value;state.page=1;render();});
 $('#paper-dialog').addEventListener('close',()=>{state.paper='';writeURL();});
 $('#paper-dialog').addEventListener('click',e=>{if(e.target===$('#paper-dialog')){const r=e.target.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)e.target.close();}});
 document.addEventListener('keydown',e=>{if(e.key==='/'&&!['INPUT','TEXTAREA','SELECT'].includes(document.activeElement.tagName)&&!$('#paper-dialog').open){e.preventDefault();state.view='library';render();$('#search').focus();}});
 window.addEventListener('popstate',()=>{readURL();render();if(state.paper)openPaper(state.paper);else if($('#paper-dialog').open)$('#paper-dialog').close();});
 $('#filter-panel').addEventListener('toggle',()=>$('#mobile-filter').setAttribute('aria-expanded',String($('#filter-panel').open)));
 const media=matchMedia('(max-width:760px)');$('#filter-panel').open=!media.matches;media.addEventListener('change',e=>$('#filter-panel').open=!e.matches);
}
async function init(){try{const r=await fetch('data/papers.json');if(!r.ok)throw new Error('data');dataset=await r.json();papers=dataset.papers.map(p=>({...p,searchText:text(JSON.stringify(p)).toLowerCase()}));readURL();buildFilters();bind();render();if(state.paper)openPaper(state.paper);}catch(e){$('#result-count').textContent='论文数据加载失败';$('#results').innerHTML='<div class="empty"><p>请刷新页面重试，或下载原始记录。</p><a href="data/research-notes.md">打开 Markdown 记录 →</a></div>';console.error(e);}}
// Export pure query behavior for non-browser tests.
if(typeof module!=='undefined'&&module.exports)module.exports={matches,text,readingSections};else init();
