/* A semantic, collapsible research tree. Connectors express problem hierarchy. */
'use strict';
const researchTreeState={open:new Set(),focus:''};
function treeLeafIds(map){return map.groups.flatMap(g=>g.branches.flatMap(b=>b.papers));}
function renderResearchTree(map,byId,selected){
 const esc=escapeHTML;
 const entry=id=>map.entries[id];
 const name=id=>entry(id).name||byId.get(id).title.split(':')[0];
 const links=ids=>ids.map(id=>`<a href="?paper=${encodeURIComponent(id)}">${esc(name(id))}</a>`).join(' · ');
 const open=id=>researchTreeState.open.has(id)?' open':'';
 const sources=refs=>fieldSources(null,{sources:refs});
 const leaf=(id,featured)=>{const e=entry(id),p=byId.get(id);return `<li class="tree-paper" data-tree-paper="${esc(id)}"><span class="tree-paper-type">${esc(CATEGORY[p.category])} · ${esc(p.date)}</span><a class="tree-paper-title" href="?paper=${encodeURIComponent(id)}">${esc(featured?name(id):p.title)} ↗</a><p>${esc(featured?e.contrast:e.question)}</p><details class="tree-source"><summary>原文依据</summary>${sources(featured?e.contrastSources:e.sources)}</details></li>`;};
 const branch=(g,b,i)=>{const id=g.id+'/'+b.id,rest=b.papers.filter(id=>!b.representatives.includes(id));return `<li class="tree-subproblem"><details data-tree-id="${id}" data-tree-kind="branch"${open(id)}><summary><span class="tree-toggle" aria-hidden="true"></span><span><span class="tree-node-meta">子问题 ${i+1} · ${b.papers.length} 条</span><strong>${esc(b.title)}</strong><span class="tree-node-desc">${esc(b.question)}</span></span></summary><ol class="tree-leaves">${b.representatives.map(id=>leaf(id,true)).join('')}${rest.length?`<li class="tree-rest"><details data-tree-id="${id}/rest" data-tree-kind="rest"${open(id+'/rest')}><summary>展开其余 ${rest.length} 条及研究问题</summary><ol class="tree-leaves">${rest.map(id=>leaf(id,false)).join('')}</ol></details></li>`:''}</ol></details></li>`;};
 const question=g=>{const n=map.tree.nodes[g.id],id=g.id;return `<li class="tree-question ${selected===id?'tree-current':''}" data-tree-question="${id}"><details data-tree-id="${id}" data-tree-kind="question"${open(id)}><summary><span class="tree-toggle" aria-hidden="true"></span><span><span class="tree-node-meta">${esc(n.kicker)}</span><strong>${esc(g.title)}</strong><span class="tree-node-desc">${esc(n.fork)}</span></span></summary><div class="tree-question-body"><p class="tree-bottleneck"><b>为什么要解决</b>${esc(g.problem)}</p><ol class="tree-subproblems">${g.branches.map((b,i)=>branch(g,b,i)).join('')}</ol><aside class="tree-insight"><b>阅读判断 · 还缺什么证据</b><p>${esc(n.insight)}</p><small>对照：${links(n.papers)}</small></aside><button class="tree-route-link" data-problem="${id}">查看这条路线的完整对照与研究建议 →</button></div></details></li>`;};
 const groups=new Map(map.groups.map(g=>[g.id,g]));
 return `<section class="research-tree" id="research-tree" aria-label="RSI 研究问题树状脉络图"><div class="tree-toolbar"><div class="tree-depth-controls" role="group" aria-label="树的展开层次"><button data-tree-depth="trunk">主干</button><button data-tree-depth="branches">方法分支</button><button data-tree-depth="papers">代表论文</button></div><label>聚焦 <select id="tree-focus" aria-label="只展开一条研究路线"><option value="">全领域</option>${map.groups.filter(g=>g.id!=='perspectives').map(g=>`<option value="${g.id}" ${researchTreeState.focus===g.id?'selected':''}>${esc(g.short)}</option>`).join('')}</select></label><button class="tree-fullscreen" data-tree-fullscreen aria-label="全屏查看脉络图">全屏查看 ⛶</button></div><p class="tree-help">点击节点展开：主干 → 研究问题 → 方法分歧 → 具体论文。<span id="tree-status" role="status" aria-live="polite">全领域 · ${map.entries?Object.keys(map.entries).length:0} 条资料均有入口</span></p>
 <div class="tree-diagram"><header class="tree-root"><span>共同目标</span><h2>${esc(map.tree.title)}</h2><p>${esc(map.tree.subtitle)}</p></header><ol class="tree-pillars">${map.tree.pillars.map((p,i)=>`<li class="tree-pillar pillar-${p.id}" data-tree-pillar="${p.id}"><header class="tree-pillar-head"><span>问题主干 ${i+1}</span><h3>${esc(p.title)}</h3><p>${esc(p.why)}</p></header><ol class="tree-questions">${p.groups.map(id=>question(groups.get(id))).join('')}</ol><aside class="tree-pillar-insight"><b>这条主干的关键判断</b><p>${esc(p.insight)}</p><small>${links(p.evidence)}</small></aside></li>`).join('')}</ol></div>
 <aside class="tree-evaluation-band"><strong>评测贯穿整棵树</strong><span>每条方法路线都要回答：反馈从哪来？修改在哪些数据上发生？最终测试是否参与选版本？增加了多少总成本？</span><button data-tree-focus="evaluation">展开评测分支 →</button></aside>
 <section class="tree-bridges" aria-label="跨分支联系"><h3>树枝之间如何衔接？</h3><p>同级分支可以并行；以下连线说明问题怎样深入或相互配合。</p><div>${map.tree.bridges.map(b=>`<article><span>${esc(b.label)}</span><div class="tree-bridge-nodes"><button data-tree-focus="${b.from}">${esc(groups.get(b.from).short)}</button><span aria-hidden="true">${b.label==='双向配合'?'↔':'→'}</span><button data-tree-focus="${b.to}">${esc(groups.get(b.to).short)}</button></div><p>${esc(b.text)}</p><small>${links(b.papers)}</small></article>`).join('')}</div></section>
 <section class="tree-proof" aria-label="证据层次"><h3>读完一篇论文，判断它的证据走到了哪一步</h3><p>这是三个需要区分的结论。声称更进一步，就需要额外的对照实验。</p><ol>${map.tree.evidenceSteps.map((e,i)=>`<li><span>${i+1}</span><strong>${esc(e.title)}</strong><p>${esc(e.claim)}</p><p class="tree-proof-check">${esc(e.check)}</p><small>${links(e.papers)}</small></li>`).join('')}</ol></section>
 <details class="tree-background" data-tree-id="background" data-tree-kind="background"${open('background')}><summary>背景分支：概念、综述、博客与基础设施</summary><ol class="tree-questions">${question(groups.get('perspectives'))}</ol></details><p class="tree-method-note">树的组织及“关键判断”是本站对已有工作所作的分析；论文做法和结论附原文依据。完整实验设置仍在单篇研究表中。背景材料保留其证据性质，不作为方法实验证明。</p></section>`;
}
function applyResearchTreeFocus(value){
 researchTreeState.focus=value;
 const root=document.getElementById('research-tree');if(!root)return;
 const select=root.querySelector('#tree-focus');select.value=value;
 root.classList.toggle('tree-focused',Boolean(value));
 root.querySelectorAll('[data-tree-pillar]').forEach(p=>{
  const questions=[...p.querySelectorAll('[data-tree-question]')];
  p.hidden=!!value&&!questions.some(q=>q.dataset.treeQuestion===value);
  questions.forEach(q=>{q.hidden=!!value&&q.dataset.treeQuestion!==value;});
 });
 if(value){const detail=root.querySelector(`details[data-tree-id="${value}"]`);if(detail){detail.open=true;researchTreeState.open.add(value);}}
 root.querySelector('#tree-status').textContent=value?'当前聚焦：'+select.selectedOptions[0].textContent:'全领域 · 点击节点逐层展开';
}
function setResearchTreeDepth(depth){
 const root=document.getElementById('research-tree');if(!root)return;
 if(depth==='trunk')applyResearchTreeFocus('');
 root.querySelectorAll('details[data-tree-id]').forEach(d=>{
  const kind=d.dataset.treeKind;
  const open=depth!=='trunk'&&(kind==='question'&&d.dataset.treeId!=='perspectives'||depth==='papers'&&kind==='branch'&&!d.dataset.treeId.startsWith('perspectives/'));
  d.open=open;if(open)researchTreeState.open.add(d.dataset.treeId);else researchTreeState.open.delete(d.dataset.treeId);
 });
 root.querySelector('#tree-status').textContent=({trunk:'已收起：先看四个主干和七个问题',branches:'已展开子问题：点击分支查看具体论文',papers:'已展开代表论文：可聚焦单条路线阅读'})[depth];
}
function bindResearchTree(){
 document.addEventListener('toggle',e=>{const d=e.target;if(d.tagName==='DETAILS'&&d.dataset.treeId){if(d.open)researchTreeState.open.add(d.dataset.treeId);else researchTreeState.open.delete(d.dataset.treeId);}},true);
 document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.treeDepth)setResearchTreeDepth(b.dataset.treeDepth);
  if(b.dataset.treeFocus){applyResearchTreeFocus(b.dataset.treeFocus);document.getElementById('research-tree').scrollIntoView({block:'start'});}
  if(b.hasAttribute('data-tree-fullscreen')){const root=document.getElementById('research-tree');try{if(document.fullscreenElement)await document.exitFullscreen();else if(root.requestFullscreen)await root.requestFullscreen();else root.classList.toggle('tree-wide');}catch{root.classList.toggle('tree-wide');}}
 });
 document.addEventListener('change',e=>{if(e.target.id==='tree-focus')applyResearchTreeFocus(e.target.value);});
 document.addEventListener('fullscreenchange',()=>{const b=document.querySelector('[data-tree-fullscreen]');if(b)b.textContent=document.fullscreenElement?'退出全屏 ⛶':'全屏查看 ⛶';});
}
if(typeof module!=='undefined'&&module.exports)module.exports={treeLeafIds};
