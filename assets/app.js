/* RSI Atlas: a static, source-preserving research catalog. */
'use strict';
const CATEGORY={methods:'Methods · 方法',evaluation:'Evaluation · 评估',dataset:'Dataset · 数据集',theory:'Theory · 理论'};
const METHODS={harness:'Harness 进化',artifact:'产物进化',weights:'模型参数进化',joint:'Harness + 模型参数进化'};
const GROUPS = [
 ['priority','阅读优先级',['C','K','R']],
 ['content','历史笔记深度',['完整专题解读','原记录详细笔记','结构化介绍']],
 ['verified','历史全文复核',['原文关键段落已复核','沿用原记录']],
 ['target','什么在变',['HarnessCode','Prompt','Context','MemoryContent','MemoryMechanism','Skill','Tool','Workflow','Subagent','Evaluator','Data','Weights','Improver']],
 ['modifier','谁来改',['SameModel','SeparateEvolver','StrongerBuilder','LearnedUpdater','JointEvolution']],
 ['feedback','反馈来源',['ExecutableVerifier','EnvironmentReward','BenchmarkScore','GoldLabel','LLMJudge','SelfFeedback','HumanDemo','PairwiseFeedback','ProcessReward']],
 ['evolution','进化方式',['OfflineSearch','Online','Prequential','Archive','Population','Sequential','CoEvolution','Continual','Streaming']],
 ['protocol','评估隔离',[]],['depth','改进层级（笔记口径）',['M0','M1','M2','M3','未明确']],
 ['reading','原始收录状态',['原记录 · 详细介绍','原记录 · 横向定位','新增 · 方法与实验设置核对','新增 · 摘要核对']]
];
const LABELS={C:'Core · 代表作',K:'Key · 重点',R:'Related · 相关',EditorWeights:'修改者的参数',HarnessCode:'Harness code',MemoryContent:'Memory 内容',MemoryMechanism:'Memory 机制',SameModel:'同一模型',SeparateEvolver:'独立 Evolver',StrongerBuilder:'更强 Builder',LearnedUpdater:'训练过的 Updater',JointEvolution:'联合进化',ExecutableVerifier:'可执行 Verifier',EnvironmentReward:'环境 Reward',BenchmarkScore:'Benchmark 分数',GoldLabel:'Gold label / 答案',LLMJudge:'LLM judge',SelfFeedback:'模型自反馈',HumanDemo:'人类示范',PairwiseFeedback:'成对偏好',ProcessReward:'过程 Reward'};
Object.assign(LABELS,{"HarnessCode": "运行框架代码", "Prompt": "提示词", "Context": "上下文", "MemoryContent": "记忆内容", "MemoryMechanism": "记忆管理机制", "Skill": "技能说明", "Tool": "工具", "Workflow": "工作流程", "Subagent": "子代理", "Evaluator": "评估器", "Data": "学习数据", "Weights": "模型参数", "Improver": "修改机制", "SameModel": "同一模型修改", "SeparateEvolver": "独立修改者", "StrongerBuilder": "更强模型构建", "LearnedUpdater": "经过训练的修改者", "ExecutableVerifier": "程序检查任务结果", "EnvironmentReward": "环境给出的奖励", "BenchmarkScore": "基准评测分数", "GoldLabel": "标准标签或答案", "LLMJudge": "模型按要求评审", "ProcessReward": "中间步骤奖励", "OfflineSearch": "部署前搜索", "Online": "执行任务时更新", "Prequential": "先做当前任务，再用其反馈学习", "Archive": "保存历史版本", "Population": "同时维护多个候选", "Sequential": "逐轮更新", "CoEvolution": "共同进化", "Continual": "持续学习", "Streaming": "连续任务流"});
Object.assign(LABELS,{"B-RSI":"递归改进评测","B-Reliability":"可靠性评测","CapabilityCeiling":"基础能力上限","CrossBenchmark":"跨评测任务迁移","CrossModel":"跨模型迁移","HeldOut":"使用留出数据","LongHorizon":"长程任务","RegressionGate":"接受修改前检查旧能力","RewardHacking":"评分规则被利用","SameSet":"同一题集参与改进与评价"});
Object.assign(LABELS,{"M0":"M0 · 经验内容更新","M1":"M1 · 任务机制更新","M2":"M2 · 修改机制也更新","M3":"M3 · 完整自指的理论设想","Artifact / 非 harness":"当前产物的改进","Online / continual":"连续任务中学习","Prequential":"先做任务，再用该题反馈学习","Prequential + held-out":"先做后学，并另设留出评价","Same-set adaptive":"同一题集反复适应","Train → selection → test":"进化、选版本、测试分阶段","Within-instance":"同一任务内调整","有 held-out 报告":"报告了留出任务结果"});
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
  if(el.tagName==='A'&&href){el.href=safeURL(href);if(new URL(el.href).origin!==location.origin){el.target='_blank';el.rel='noopener noreferrer';}}
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
function readURL(){const u=new URLSearchParams(location.search);state.q=u.get('q')||'';state.category=CATEGORY[u.get('category')]?u.get('category'):'';state.quick=['all','harness','artifact','weights','joint','core','isolated','new'].includes(u.get('quick'))?u.get('quick'):'all';state.sort=['priority','newest','oldest','title'].includes(u.get('sort'))?u.get('sort'):'priority';state.year=u.get('year')||'';state.page=Math.max(1,parseInt(u.get('page'))||1);state.tags=u.getAll('tag');state.facets={};for(const [g]of GROUPS)state.facets[g]=u.getAll(g);if(METHODS[state.quick])state.category='methods';if(state.quick==='core'){state.facets.priority=['C'];state.quick='all';}if(state.quick==='isolated'){state.facets.protocol=['Train → selection → test'];state.quick='all';}state.paper=u.get('paper')||'';state.view=state.paper?'paper':(['framework','notes','guide'].includes(u.get('view'))?u.get('view'):'library');}
function writeURL(){const u=new URLSearchParams();for(const k of ['q','category','year','paper'])if(state[k])u.set(k,state[k]);if(state.quick!=='all')u.set('quick',state.quick);if(state.sort!=='priority')u.set('sort',state.sort);if(state.page>1)u.set('page',state.page);if(!['library','paper'].includes(state.view))u.set('view',state.view);for(const [g,vs]of Object.entries(state.facets))vs.forEach(v=>u.append(g,v));state.tags.forEach(t=>u.append('tag',t));history.replaceState(null,'',location.pathname+(u.size?'?'+u:''));}
function syncControls(){ $('.quick-filters').hidden=!!state.category&&state.category!=='methods'; $('#search').value=state.q;$('#year').value=state.year;$('#sort').value=state.sort;document.querySelectorAll('[data-quick]').forEach(b=>b.classList.toggle('selected',b.dataset.quick===state.quick));document.querySelectorAll('[data-category]').forEach(b=>b.classList.toggle('selected',b.dataset.category===state.category));document.querySelectorAll('[data-group]').forEach(el=>el.checked=(state.facets[el.dataset.group]||[]).includes(el.value));}
function buildFilters(){
 const icons={'':'▦',methods:'⚙',evaluation:'✓',dataset:'▤',theory:'∑'};
 $('#category-shortcuts').innerHTML=Object.entries({'':'全部论文',...CATEGORY}).map(([id,name])=>`<button data-category="${id}"><span aria-hidden="true">${icons[id]}</span> ${name} <small>${papers.filter(p=>!id||p.category===id).length}</small></button>`).join('');
 $('#categories').innerHTML=`<button class="category" data-category=""><span>全部论文</span><span class="count">${papers.length}</span></button>`+Object.entries(CATEGORY).map(([id,name])=>`<button class="category" data-category="${id}"><span>${name}</span><span class="count">${papers.filter(p=>p.categories.includes(id)).length}</span></button>`).join('');
 GROUPS.find(g=>g[0]==='protocol')[2]=[...new Set(papers.map(p=>p.protocol))].sort();
 $('#facets').innerHTML=GROUPS.map(([id,title,values],i)=>`<details class="facet" ${i===0||id==='content'?'open':''}><summary>${title}</summary><div class="facet-options">${values.map(v=>`<label><input type="checkbox" data-group="${id}" value="${escapeHTML(v)}"><span>${escapeHTML(LABELS[v]||v)}</span><small>${papers.filter(p=>groupValues(p,id).includes(v)).length}</small></label>`).join('')}</div></details>`).join('');
 $('#year').innerHTML='<option value="">全部年份</option>'+[...new Set(papers.map(p=>p.year))].sort().reverse().map(y=>`<option>${escapeHTML(y)}</option>`).join('');
 $('#total').textContent=papers.length;$('#updated').textContent=dataset.updated;
}
function caution(p){return /Same-set|混合|参与|重试/.test(p.protocol);}
function fieldSources(p,f){return [...new Map((f.sources||[]).map(r=>[r.url,r])).values()].map(r=>`<a href="${escapeHTML(safeURL(r.url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(r.label)} ↗</a>`).join('<br>');}
function profileTable(p){
 const rows=p.profile.fields.flatMap(f=>f.key==='verdict'&&p.profile.feedbackCases?.length
  ? p.profile.feedbackCases.map(c=>`<tr class="feedback-case"><th scope="row">反馈 / 判分<br><small>${escapeHTML(c.label)}</small></th><td><p><strong>使用数据：</strong>${markdownInline(c.data)}</p><p><strong>判分机制：</strong>${markdownInline(c.judgment)}</p><p><strong>具体检查与比对：</strong>${markdownInline(c.scoring)}</p><p><strong>返回哪些信息：</strong>${markdownInline(c.visible)}</p><p><strong>用于哪一步：</strong>${markdownInline(c.use)}</p></td><td>${fieldSources(p,c)}</td></tr>`)
  : [`<tr><th scope="row">${escapeHTML(f.label)}</th><td>${markdown(f.value)}</td><td>${fieldSources(p,f)}</td></tr>`]);
 return `<section class="profile-block"><div class="table-scroll"><table class="profile-table"><thead><tr><th>研究维度</th><th>具体说明</th><th>原文位置</th></tr></thead><tbody>${rows.join('')}</tbody></table></div></section>`;
}
function feedbackOverview(p){
 return p.profile.feedbackCases.map(c=>`<p><strong>${escapeHTML(c.label)}：</strong>${markdownInline(c.judgment)}。 <a class="feedback-source" href="${escapeHTML(safeURL(c.sources[0].url))}" target="_blank" rel="noopener noreferrer" title="${escapeHTML(c.sources[0].label)}">原文 ↗</a></p>`).join('');
}
function research(p){
 const labels={object:'什么在进化',executor:'谁执行',modifier:'谁来改',verdict:'反馈是什么',seed:'基础 harness 是什么'};
 const selected=Object.keys(labels).map(key=>p.profile.fields.find(f=>f.key===key));
 return `<dl class="research-fields">${selected.map(f=>`<div><dt>${labels[f.key]}</dt><dd>${f.key==='verdict'?feedbackOverview(p):`${markdown(p.overview.fields[f.key]||f.value)}<small class="field-source">${fieldSources(p,f)}</small>`}</dd></div>`).join('')}</dl><details class="mechanism"><summary>查看更新规则与全部研究维度</summary>${profileTable(p)}</details>`;
}
function tldr(p){
 const labels={gap:'研究缺口（作者判断）',position:'本文定位',conclusion:'关键设计与结论'};
 const feature=p.profile.fields.find(f=>f.key==='novelty');
 return `<section class="paper-tldr" aria-label="论文 TL;DR"><h3>TL;DR</h3><ol>${p.overview.tldr.map(f=>`<li><strong>${labels[f.key]}</strong><div>${f.key==='conclusion'?`<div class="tldr-design"><b>关键设计：</b>${markdownInline(feature.value)}<small class="field-source">${fieldSources(p,feature)}</small></div><b>贡献 / 结论：</b>`:''}${markdown(f.value)}<small class="field-source">${fieldSources(p,f)}</small></div></li>`).join('')}</ol></section>`;
}
function card(p){
 return `<article class="paper-card"><div class="card-main"><div class="card-meta"><span>${CATEGORY[p.category]}${p.methodType?' / '+METHODS[p.methodType]:''}</span><span class="level level-${p.priority}">${LEVEL[p.priority]}</span>${p.publicationType==='project-report'?'<span>官方项目报告</span>':''}<time class="date">${p.publicationType==='project-report'?'项目首发 ':''}${escapeHTML(p.date)}</time></div><h2><button class="paper-title" data-paper="${p.id}">${escapeHTML(p.title)}</button></h2>${tldr(p)}${research(p)}</div><div class="card-foot"><div class="tags">${p.tags.filter(t=>!/^M[0-3]$/.test(t)).map(t=>`<button class="tag" data-tag="${escapeHTML(t)}">#${escapeHTML(LABELS[t]||t)}</button>`).join('')}</div><div class="card-links"><a href="${escapeHTML(safeURL(p.url))}" target="_blank" rel="noopener noreferrer">${p.publicationType==='project-report'?'官方报告':'论文'} ↗</a><button class="read-action" data-paper="${p.id}">查看研究表 →</button></div></div></article>`;
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
function prepareDocument(){
 const content=$('#document-content');
 content.querySelectorAll('table').forEach(table=>{
  table.classList.add('reading-table');
  const labels=[...table.querySelectorAll('thead th')].map(h=>h.textContent);
  table.querySelectorAll('tbody tr').forEach(row=>[...row.children].forEach((cell,i)=>cell.dataset.label=labels[i]||''));
 });
 content.querySelectorAll('h2').forEach((h,i)=>h.id='reading-section-'+(i+1));
 const headings=[...content.querySelectorAll('h2')];
 const nav=document.createElement('nav');nav.className='reading-toc';nav.setAttribute('aria-label','本页目录');
 headings.forEach((h,i)=>{const b=document.createElement('button');b.className='secondary';b.dataset.section=h.id;b.textContent=h.textContent;nav.append(b);});
 content.querySelector('h1')?.after(nav);
}
function showView(){$('.page-heading').hidden=state.view==='paper';if(state.view==='library')state.paper='';if(state.view==='paper'){renderReading();return;}const library=state.view==='library';$('#library-view').hidden=!library;$('#document-view').hidden=library;document.querySelectorAll('.topbar [data-view]').forEach(b=>b.classList.toggle('nav-active',b.dataset.view===state.view));if(!library){if(['guide','notes'].includes(state.view)){$('#document-content').innerHTML=markdown(state.view==='guide'?dataset.readingGuide:dataset.researchMap);prepareDocument();return;}const extra=state.view==='framework'?`## 网站阅读口径\n\n原记录：${dataset.originalCount} 篇；本轮补充：${papers.length-dataset.originalCount} 篇。每篇维护一张原文定位表，拆开进化、调试和最终测试。历史笔记保留下载。\n\n- **代表性**沿用原记录的 C / K / R，不与证据强度合并。\n- **Train → selection → test**为已明确记录三阶段边界的条目；“有留出结果”不自动等于完全隔离的最终测试。混合协议必须看任务级描述。\n- **标签**来自原始显式标签与按同篇字段整理的标注；缺标签表示待补全，不表示机制不存在。\n- **新增文章**标注核对范围与原始来源。初步定位不自动升为 Core。\n- **日期**保留原记录精度；arXiv 文章使用首次提交时间，官方项目报告单独标注项目首发日期。\n\n`:'';$('#document-content').innerHTML=markdown(extra+(state.view==='framework'?'## 分类与标签\n\n一级：Methods、Evaluation、Dataset、Theory。\n\nMethods 按变化对象分为 Harness 进化、产物进化（不改 harness 和模型参数）、模型参数进化、Harness + 模型参数进化。联合进化架构不等于已验证多代联合闭环，需逐篇看证据。\n\nCore / Key 是阅读优先级；反馈、执行者、改进层级和数据隔离是独立筛选维度。Dataset 当前没有独立收录项，不把所有评测框架硬归为数据集。\n\n原始笔记保留供追溯；全部条目统一使用逐行来源表。原文缺项与协议冲突明确列出，推断不作为论文事实。':dataset.conclusions));}}
function reset(){state={...state,q:'',category:'',quick:'all',year:'',page:1,facets:{},tags:[],paper:'',view:'library'};render();}
function readingSections(p){return [{title:'全部研究维度',body:p.profile.fields.map(f=>f.label+'：'+f.value).join('\n\n')}];}
function renderReading(){const p=papers.find(p=>p.id===state.paper);if(!p){state.view='library';state.paper='';showView();return;}
 $('#library-view').hidden=true;$('#document-view').hidden=false;document.querySelectorAll('.topbar [data-view]').forEach(b=>b.classList.remove('nav-active'));
 $('#document-content').innerHTML=`<div class="reader-top"><button class="secondary" data-view="library">← 返回论文列表</button><span>${CATEGORY[p.category]}${p.methodType?' / '+METHODS[p.methodType]:''}</span><time>${escapeHTML(p.date)}</time></div><h1 class="reader-title">${escapeHTML(p.title)}</h1><div class="detail-links"><a href="${escapeHTML(safeURL(p.url))}" target="_blank" rel="noopener noreferrer">${p.publicationType==='project-report'?'阅读官方报告':'阅读论文'} ↗</a><button id="copy-link" class="text-button">复制此篇链接</button><button class="text-button" data-view="guide">概念与实验分数说明</button></div>${tldr(p)}${research(p)}<footer class="reader-sources"><p>每行“原文位置”指向对应章节；不同实验的数据协议分别说明。原文没有明确交代或口径冲突的内容列在证据边界中。</p><a href="data/updated-research-notes.md" download>历史详细笔记（保留原始版本） ↓</a></footer>`;
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
 if(b.dataset.view){state.paper='';state.view=b.dataset.view;render();$('#main').scrollIntoView({block:'start'});return;}
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
async function init(){try{const r=await fetch('data/papers.json?v=feedback-20260911');if(!r.ok)throw new Error('data');dataset=await r.json();papers=dataset.papers.map(p=>({...p,searchText:text(JSON.stringify(p)).toLowerCase()}));readURL();buildFilters();bind();render();if(state.paper)openPaper(state.paper);}catch(e){$('#result-count').textContent='论文数据加载失败';$('#results').innerHTML='<div class="empty"><p>请刷新页面重试，或下载原始记录。</p><a href="data/research-notes.md">打开 Markdown 记录 →</a></div>';console.error(e);}}
// Export pure query behavior for non-browser tests.
if(typeof module!=='undefined'&&module.exports)module.exports={matches,text,readingSections,card,research,tldr};else init();
