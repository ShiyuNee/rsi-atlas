/* Problem-led synthesis; paper facts retain links to their maintained evidence. */
'use strict';
function problemMembers(map,id){return Object.entries(map.entries).filter(([,e])=>e.primary===id||e.related.includes(id)).map(([id])=>id);}
function problemName(map,id){return map.groups.find(g=>g.id===id)?.short||id;}
function problemBadges(p){
 const map=dataset.problemMap,e=map?.entries[p.id];if(!e)return '';
 return `<p class="problem-context"><span>研究问题</span> ${[e.primary,...e.related].map(id=>`<a href="?view=notes&problem=${id}">${escapeHTML(problemName(map,id))} ↗</a>`).join(' · ')}</p>`;
}
function renderProblemOverview(){
 const map=dataset.problemMap,byId=new Map(papers.map(p=>[p.id,p]));
 const selected=map.groups.find(g=>g.id===state.problem)||map.groups.find(g=>g.id==='harness');
 const group=id=>map.groups.find(g=>g.id===id);
 const name=id=>map.entries[id]?.name||byId.get(id)?.title.split(':')[0]||id;
 const paperLink=id=>`<a href="?paper=${encodeURIComponent(id)}">${escapeHTML(name(id))}</a>`;
 const links=ids=>ids.map(paperLink).join(' · ');
 const sources=(refs)=>fieldSources(null,{sources:refs});
 const comparison=id=>{const e=map.entries[id],p=byId.get(id);return `<tr><th scope="row">${paperLink(id)}<small>${escapeHTML(p.date)} · ${escapeHTML(CATEGORY[p.category])}</small></th><td>${escapeHTML(e.contrast)}<details class="map-evidence"><summary>原文依据</summary>${sources(e.contrastSources)}</details></td></tr>`;};
 const primary=Object.entries(map.entries).filter(([,e])=>e.primary===selected.id).map(([id])=>id);
 const related=Object.entries(map.entries).filter(([,e])=>e.related.includes(selected.id)).map(([id])=>id);
 const featured=new Set(selected.branches.flatMap(b=>b.representatives));
 const rest=primary.filter(id=>!featured.has(id));
 const indexRow=id=>{const e=map.entries[id],p=byId.get(id);return `<li><div>${paperLink(id)} <small>${escapeHTML(p.date)} · ${escapeHTML(CATEGORY[p.category])}</small></div><p>${escapeHTML(e.question)}</p><details class="map-evidence"><summary>定位依据</summary>${sources(e.sources)}</details></li>`;};
 const directions=map.directions.filter(d=>d.groups.includes(selected.id));
 return `<div class="problem-overview">${reviewNavigation('tree')}
 <header class="map-hero"><div class="eyebrow">RSI · A MAP OF RESEARCH QUESTIONS</div><h1>RSI 在解决哪些问题？</h1><p class="map-lead">一条主线：<strong>做对一次 → 学会复用 → 更会改进</strong>。</p><p>先看四个主干，再展开具体瓶颈和论文。重点是：为什么要解决、不同方法差在哪、还缺什么证据。</p><nav class="map-jumps" aria-label="全景导航"><a href="#problem-map">树状脉络图</a><a href="#problem-detail">路线与论文对照</a><a href="#research-directions">下一步研究</a><a href="#field-history">发展线索</a><a href="#reading-paths">阅读顺序</a></nav><small>全景整理：${map.updated} · 资料库 ${papers.length} 条，收录更新至 ${map.corpusUpdated}。本轮重组已有资料，未进行新文普查。</small></header>
 <section id="problem-map"><h2>一棵树看清：问题怎样分解，研究怎样深入</h2>${renderResearchTree(map,byId,selected.id)}</section>
 <section id="problem-detail" tabindex="-1" aria-label="所选研究问题"><div class="map-detail-head"><div class="eyebrow">${escapeHTML(selected.short)}</div><h2>${escapeHTML(selected.title)}</h2><a class="map-filter" href="?question=${selected.id}">在资料库看相关 ${primary.length+related.length} 条 →</a><p class="map-reading"><a href="?view=review#review-${selected.id==='perspectives'?'synthesis':selected.id}">阅读这一方向的综述：问题如何演变，方法有何不同 →</a></p></div><dl class="map-framing"><div><dt>为什么要解决</dt><dd>${escapeHTML(selected.problem)}</dd></div><div><dt>问题如何展开</dt><dd>${escapeHTML(selected.progress)}</dd></div><div><dt>还需要证明什么</dt><dd>${escapeHTML(selected.limit)}</dd></div></dl><p class="map-reading">建议先读：${links(selected.route)}。顺序表示阅读路径。</p>
 ${selected.branches.map((b,i)=>`<section class="map-branch"><h3><span>${i+1}</span>${escapeHTML(b.title)}</h3><p>${escapeHTML(b.question)}</p><table class="map-comparison"><thead><tr><th>代表工作</th><th>对同一问题，做法有什么不同？</th></tr></thead><tbody>${b.representatives.map(comparison).join('')}</tbody></table></section>`).join('')}
 ${rest.length?`<details class="map-more"><summary>本路线其余 ${rest.length} 条：各自在解决什么问题</summary><ul class="map-index">${rest.sort((a,b)=>byId.get(b).date.localeCompare(byId.get(a).date)).map(indexRow).join('')}</ul></details>`:''}
 ${related.length?`<details class="map-more"><summary>交叉阅读 ${related.length} 条：主问题在其他路线</summary><ul class="map-index">${related.map(indexRow).join('')}</ul></details>`:''}
 <p class="map-policy">每条资料有一个主归属，用于避免统计重复；交叉关联保留。归组是本站的阅读组织方式，论文原有 Methods／Evaluation 分类不变。</p></section>
 <section id="research-directions"><h2>沿这条路线，下一步可以研究什么？</h2><p>以下是从对照中提出的<strong>研究建议</strong>，不是已证实的空白或创新性判断。默认显示与当前路线相关的方向；选题前仍需补查最新工作。</p>${directions.length?directions.map(d=>`<details class="map-direction"><summary>${escapeHTML(d.title)}</summary><p><b>待检验的问题：</b>${escapeHTML(d.question)}</p><p>${escapeHTML(d.basis)} ${links(d.papers)}</p><dl><dt>一个可做的实验</dt><dd>${escapeHTML(d.experiment)}</dd><dt>必须比较的基线</dt><dd>${escapeHTML(d.baseline)}</dd><dt>什么结果会否定判断</dt><dd>${escapeHTML(d.falsifier)}</dd></dl></details>`).join(''):'<p>从上方的问题地图进入具体方法或评测路线，查看对应实验建议。</p>'}</section>
 <section id="field-history"><h2>发展线索：研究问题如何扩展</h2><p>这是本库的阅读时间线。后出现的问题没有替代早期问题，它们至今仍然并行。</p><div class="map-timeline">${map.eras.map(e=>`<div><strong>${escapeHTML(e.period)}</strong><p>${escapeHTML(e.text)}</p><small>${links(e.papers)}</small></div>`).join('')}</div></section>
 <section id="reading-paths"><h2>带着目标读，不必从头读完全部论文</h2><div class="map-paths">${map.readingPaths.map(r=>`<article><h3>${escapeHTML(r.title)}</h3><p>${escapeHTML(r.why)}</p><ol>${r.papers.map(id=>`<li>${paperLink(id)}</li>`).join('')}</ol></article>`).join('')}</div></section>
 <footer class="map-method"><strong>这张地图如何维护</strong><p>${escapeHTML(map.policy)} 本轮对关键转折的原始摘要作了定向复核；逐篇定位与实验依据沿用各条目的来源表，不把归组表述为对全部论文重新全文审读。原文缺项仍在单篇研究表中说明。</p><p><a href="data/problem-map.json">问题归属与比较数据 ↓</a> · <a href="data/research-map.md">旧版逐路线阅读笔记 ↓</a></p></footer></div>`;
}
if(typeof module!=='undefined'&&module.exports)module.exports={problemMembers,problemName};
