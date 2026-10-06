/* A question-first outline for the narrative review, with focused method comparisons. */
'use strict';
const reviewTreeState={selected:null,focus:'',expanded:false};
function reviewTreePaperIds(tree){return [...new Set([...tree.nodes.flatMap(n=>n.routes.flatMap(r=>r.papers)),...tree.boundary.papers])];}
function reviewTreeCoverage(tree,catalog,map){
 const featured=new Set(reviewTreePaperIds(tree));
 const other=map.groups.map(g=>({id:g.id,title:g.title,papers:g.branches.filter(b=>b.id!=='foundations').flatMap(b=>b.papers).filter(id=>!featured.has(id))}));
 other.push({id:'foundations',title:'理论基础：可自修改系统与递归改进',papers:map.groups.flatMap(g=>g.branches.filter(b=>b.id==='foundations').flatMap(b=>b.papers)).filter(id=>!featured.has(id))});
 return {total:catalog.length,featured:[...featured],other:other.filter(g=>g.papers.length)};
}
function reviewTreeNodeFromHash(tree,hash){return tree.nodes.find(n=>'#review-tree-'+n.id===hash)?.id||null;}
function reviewTreePaperName(id){return dataset.problemMap.entries[id]?.name||papers.find(p=>p.id===id)?.title.split(':')[0]||id;}
function reviewTreePaperLink(id){return `<a href="?paper=${encodeURIComponent(id)}">${escapeHTML(reviewTreePaperName(id))}</a>`;}
function renderReviewTreePaper(id){
 const p=papers.find(p=>p.id===id),entry=dataset.problemMap.entries[id],field=p.profile.fields.find(f=>f.key==='novelty')||p.overview.tldr.find(f=>f.key==='conclusion');
 const description=entry.contrast||field.value,refs=entry.contrast?entry.contrastSources:field.sources;
 return `<li><strong>${reviewTreePaperLink(id)}</strong><p>${escapeHTML(description)}</p><div class="review-tree-sources">${refs.map(s=>`<a href="${escapeHTML(safeURL(s.url))}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.label)} ↗</a>`).join(' · ')}</div></li>`;
}
function renderReviewTreeCoverage(){
 const tree=dataset.reviewTree,b=tree.boundary,c=reviewTreeCoverage(tree,papers,dataset.problemMap),other=c.other.reduce((s,g)=>s+g.papers.length,0);
 return `<div class="review-tree-supplements"><details class="review-tree-boundary"><summary>${escapeHTML(b.title)}</summary><p>${escapeHTML(b.description)}</p><ul class="review-tree-paper-details">${b.papers.map(renderReviewTreePaper).join('')}</ul><a class="review-tree-scope-link" href="?view=review#review-${b.chapter}">阅读概念与边界 →</a></details><details class="review-tree-coverage"><summary>覆盖范围：图中 ${c.featured.length} 项 · 全库 ${c.total} 项</summary><p>图中按研究问题精选代表工作；未作代表不表示未收录。下列 ${other} 项仍可阅读，按完整索引中的问题归类。理论、综述、博客与基础设施另列，避免与具体方法混淆。本次检查针对现有资料库，不表示穷尽领域文献。</p>${c.other.map(g=>`<section><h4>${escapeHTML(g.title)} <span>${g.papers.length}</span></h4><div class="review-route-papers">${g.papers.map(reviewTreePaperLink).join('<span aria-hidden="true">·</span>')}</div></section>`).join('')}<a class="review-tree-scope-link" href="?view=notes#research-tree">查看完整文献索引 →</a></details></div>`;
}
function renderReviewTreeDetail(id){
 const tree=dataset.reviewTree,node=tree.nodes.find(n=>n.id===id),branch=tree.branches.find(b=>b.nodes.includes(id));
 const paper=renderReviewTreePaper;
 return `<article id="review-tree-${node.id}" class="review-tree-selection" tabindex="-1"><header><button class="review-tree-close" data-review-tree-close>收起对照，返回总览 ↑</button><span>${escapeHTML(branch.number+' '+branch.title)} / ${escapeHTML(node.number)}</span><h3>${escapeHTML(node.title)}</h3><p>${escapeHTML(node.gap)}</p></header><aside class="review-route-relation"><strong>${escapeHTML(node.relation.label)}</strong><p>${escapeHTML(node.relation.text)}</p></aside><ol class="review-routes">${node.routes.map((r,i)=>`<li class="review-route"><div class="review-route-title"><span>${escapeHTML(r.kind)} ${i+1}</span><h4>${escapeHTML(r.title)}</h4></div><div><p>${escapeHTML(r.approach)}</p><div class="review-route-papers">${r.papers.map(reviewTreePaperLink).join('<span aria-hidden="true">·</span>')}</div><details><summary>逐篇对照与原文依据（${r.papers.length} 篇）</summary><ul class="review-tree-paper-details">${r.papers.map(paper).join('')}</ul></details></div></li>`).join('')}</ol><aside class="review-tree-insight"><strong>这一分支的关键判断 · 本站综合分析</strong><p>${escapeHTML(node.insight)}</p></aside><div class="review-tree-reading"><a href="?view=review#review-${node.chapter}">阅读这一章的完整论述 →</a><a href="?view=review#review-tree">回到全树 ↑</a></div></article>`;
}
function renderReviewTree(){
 const tree=dataset.reviewTree,fromHash=reviewTreeNodeFromHash(tree,location.hash);
 if(fromHash){reviewTreeState.selected=fromHash;if(reviewTreeState.focus&&!tree.branches.find(b=>b.id===reviewTreeState.focus)?.nodes.includes(fromHash))reviewTreeState.focus='';}
 else if(location.hash==='#review-tree')reviewTreeState.selected=null;
 const esc=escapeHTML;
 const branchHTML=id=>{
  const b=tree.branches.find(b=>b.id===id);
  return `<li class="review-tree-branch review-branch-${b.id}" data-review-branch="${b.id}" ${reviewTreeState.focus&&reviewTreeState.focus!==b.id?'hidden':''}><header><h3><span>${b.number}</span>${esc(b.title)}</h3><p>${esc(b.subtitle)}</p><div class="review-branch-relation">${esc(b.relationLabel)}</div></header><ol>${b.nodes.map(id=>{const n=tree.nodes.find(n=>n.id===id);return `<li><button class="review-question" data-review-node="${id}" aria-pressed="${reviewTreeState.selected===id}" aria-expanded="${reviewTreeState.selected===id}" aria-controls="review-tree-detail"><strong>${esc(n.title)}</strong><span class="review-question-gap">${esc(n.gap)}</span><span class="review-question-examples">${n.preview.map(id=>esc(reviewTreePaperName(id))).join(' · ')}</span></button></li>`;}).join('')}</ol><p class="review-branch-relation-detail">${esc(b.relation)}</p></li>`;
 };
 const layers=tree.layers.map(l=>`<li class="review-tree-layer review-layer-${l.id}" data-review-layer="${l.id}" ${reviewTreeState.focus&&!l.branches.includes(reviewTreeState.focus)?'hidden':''}><header><strong>${esc(l.title)}</strong><p>${esc(l.description)}</p></header><ol class="review-tree-branches">${l.branches.map(branchHTML).join('')}</ol></li>`).join('');
 return `<section class="review-tree ${reviewTreeState.expanded?'review-tree-expanded':'review-tree-compact'} ${reviewTreeState.focus?'review-tree-focused':''}" id="review-tree" aria-label="RSI 综述问题树">
 <div class="review-tree-heading"><h2>RSI 研究问题总览</h2><div class="review-tree-tools"><button data-review-tree-expand aria-expanded="${reviewTreeState.expanded}" aria-controls="review-tree-branches">${reviewTreeState.expanded?'收起解释':'展开解释'}</button><label>聚焦 <select id="review-tree-focus" aria-label="聚焦综述主干"><option value="">全领域</option>${tree.branches.map(b=>`<option value="${b.id}" ${reviewTreeState.focus===b.id?'selected':''}>${esc(b.title)}</option>`).join('')}</select></label><button data-review-tree-fullscreen>全屏 ⛶</button></div></div>
 <p class="review-tree-orientation">先分清任务层与元层，再用评测检验两层。<a href="?view=review#review-mainline">主线导读 ↑</a></p>
 <div class="review-tree-root"><h3>${esc(tree.title)}</h3></div>
 <ol id="review-tree-branches" class="review-tree-layers">${layers}</ol>
 <div class="review-tree-guide"><span id="review-tree-status" role="status" aria-live="polite">点击问题，查看方法关系与论文对照。</span><span>编号用于导航 · 不表示必经阶段</span><a href="?view=notes#research-tree">完整文献索引 ↗</a></div>
 ${renderReviewTreeCoverage()}<div id="review-tree-detail" ${reviewTreeState.selected?'':'hidden'}>${reviewTreeState.selected?renderReviewTreeDetail(reviewTreeState.selected):''}</div>
 <details class="review-tree-connections"><summary>跨分支关系：配合、层级变化与评测约束</summary><p>${esc(tree.note)}</p><p>内容、执行机制与参数可以共同更新；元层单独追问产生更新的机制是否也在学习。两层都需要评测。本图选取 ${reviewTreePaperIds(tree).length} 项代表材料，包含方法、评测及产物优化对照。</p><div>${tree.connections.map(c=>`<article><span class="review-connection-kind">${esc(c.kind)}</span><h4>${esc(c.title)}</h4><p>${esc(c.text)}</p><button data-review-node="${c.from_}">${esc(tree.nodes.find(n=>n.id===c.from_).title)}</button><span aria-hidden="true"> ${esc(c.symbol)} </span><button data-review-node="${c.to}">${esc(tree.nodes.find(n=>n.id===c.to).title)}</button></article>`).join('')}</div></details></section>`;
}
function selectReviewTreeNode(id,{scroll=true,updateURL=true}={}){
 const root=document.getElementById('review-tree');if(!root||!dataset.reviewTree.nodes.some(n=>n.id===id))return;
 if(reviewTreeState.focus&&!dataset.reviewTree.branches.find(b=>b.id===reviewTreeState.focus).nodes.includes(id))applyReviewTreeFocus('');
 reviewTreeState.selected=id;
 root.querySelectorAll('.review-question').forEach(b=>{const selected=b.dataset.reviewNode===id;b.setAttribute('aria-pressed',String(selected));b.setAttribute('aria-expanded',String(selected));});
 const detail=root.querySelector('#review-tree-detail');detail.hidden=false;detail.innerHTML=renderReviewTreeDetail(id);root.querySelector('#review-tree-status').textContent='当前展开：'+dataset.reviewTree.nodes.find(n=>n.id===id).title;
 if(updateURL)history.replaceState(null,'',location.pathname+location.search+'#review-tree-'+id);
 if(scroll){const target=detail.firstElementChild;target.focus({preventScroll:true});target.scrollIntoView({block:'start'});}
}
function closeReviewTreeDetail({scroll=false}={}){
 const root=document.getElementById('review-tree');if(!root)return;const previous=reviewTreeState.selected;reviewTreeState.selected=null;
 root.querySelector('#review-tree-detail').hidden=true;root.querySelector('#review-tree-detail').innerHTML='';
 root.querySelectorAll('.review-question').forEach(b=>{b.setAttribute('aria-pressed','false');b.setAttribute('aria-expanded','false');});
 root.querySelector('#review-tree-status').textContent='点击问题，查看方法关系与论文对照。';
 history.replaceState(null,'',location.pathname+location.search+'#review-tree');
 if(scroll){root.scrollIntoView({block:'start'});root.querySelector(`.review-question[data-review-node="${previous}"]`)?.focus({preventScroll:true});}
}
function applyReviewTreeFocus(value){
 const root=document.getElementById('review-tree');if(!root)return;reviewTreeState.focus=value;root.querySelector('#review-tree-focus').value=value;root.classList.toggle('review-tree-focused',Boolean(value));
 root.querySelectorAll('[data-review-branch]').forEach(b=>b.hidden=!!value&&b.dataset.reviewBranch!==value);
 root.querySelectorAll('[data-review-layer]').forEach(l=>l.hidden=!!value&&!dataset.reviewTree.layers.find(x=>x.id===l.dataset.reviewLayer).branches.includes(value));
 if(value&&reviewTreeState.selected&&!dataset.reviewTree.branches.find(b=>b.id===value).nodes.includes(reviewTreeState.selected))closeReviewTreeDetail();
 root.querySelector('#review-tree-status').textContent=value?'聚焦：'+dataset.reviewTree.branches.find(b=>b.id===value).title:'点击问题，查看方法关系与论文对照。';
}
function bindReviewTree(){
 document.addEventListener('click',async e=>{const b=e.target.closest('button');if(!b)return;
  if(b.dataset.reviewNode){selectReviewTreeNode(b.dataset.reviewNode);return;}
  const root=document.getElementById('review-tree');if(!root)return;
  if(b.hasAttribute('data-review-tree-close')){closeReviewTreeDetail({scroll:true});return;}
  if(b.hasAttribute('data-review-tree-expand')){reviewTreeState.expanded=!reviewTreeState.expanded;root.classList.toggle('review-tree-expanded',reviewTreeState.expanded);root.classList.toggle('review-tree-compact',!reviewTreeState.expanded);b.setAttribute('aria-expanded',String(reviewTreeState.expanded));b.textContent=reviewTreeState.expanded?'收起解释':'展开解释';}
  if(b.hasAttribute('data-review-tree-fullscreen')){try{if(document.fullscreenElement)await document.exitFullscreen();else await root.requestFullscreen();}catch{root.classList.toggle('review-tree-wide');}}
 });
 document.addEventListener('change',e=>{if(e.target.id==='review-tree-focus')applyReviewTreeFocus(e.target.value);});
 document.addEventListener('fullscreenchange',()=>{const b=document.querySelector('[data-review-tree-fullscreen]');if(b)b.textContent=document.fullscreenElement?'退出全屏 ⛶':'全屏 ⛶';});
 document.addEventListener('keydown',e=>{if(e.key==='Escape')document.getElementById('review-tree')?.classList.remove('review-tree-wide');});
}
if(typeof module!=='undefined'&&module.exports)module.exports={reviewTreePaperIds,reviewTreeNodeFromHash,reviewTreeCoverage};
