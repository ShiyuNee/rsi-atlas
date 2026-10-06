'use strict';
const assert=require('node:assert/strict');
const data=require('../data/papers.json');
const review=require('../data/field-review.json');
const {reviewCitations}=require('../assets/field-review.js');
assert.deepEqual(data.fieldReview,review,'Rebuild the published review after editing its source.');
const papers=new Map(data.papers.map(p=>[p.id,p]));
const groups=new Set(data.problemMap.groups.map(g=>g.id));
const references=new Map(review.references.map(r=>[r.number,r]));
assert.equal(references.size,review.references.length,'Duplicate reference anchors.');
assert.equal(new Set(review.chapters.map(c=>c.id)).size,review.chapters.length,'Duplicate chapter anchors.');
const cited=new Set();
for(const chapter of review.chapters){
 assert(chapter.groups.every(g=>groups.has(g)),`${chapter.id}: broken problem link`);
 const citations=reviewCitations(chapter.body);
 for(const n of citations){assert(references.has(n),`${chapter.id}: broken citation ${n}`);cited.add(n);}
 for(const m of chapter.body.matchAll(/\]\(\?paper=([^\)]+)\)/g)){
  assert(papers.has(m[1]),`${chapter.id}: broken paper link ${m[1]}`);
  assert(citations.some(n=>references.get(n).paper===m[1]),`${chapter.id}: linked paper has no chapter source`);
 }
}
assert.deepEqual([...cited].sort((a,b)=>a-b),[...references.keys()].sort((a,b)=>a-b),'Orphaned reference.');
for(const reference of references.values()){
 const p=papers.get(reference.paper);assert(p,`Unknown paper ${reference.paper}`);
 assert.equal(reference.url,p.url);
 assert(reference.sources.length,`${reference.paper}: missing source locations`);
 const maintained=p.overview.tldr.concat(p.profile.fields).flatMap(f=>f.sources);
 for(const source of reference.sources){
  assert(source.label&&source.url.startsWith('https://'));
  assert(maintained.some(s=>s.label===source.label&&s.url===source.url),`${reference.paper}: source location diverges from its research table`);
 }
}
assert.equal(review.paperCount,new Set(review.references.map(r=>r.paper)).size);
console.log(`Passed: ${review.chapters.length} review chapters, ${references.size} referenced works, paragraph citations, source locations and chapter-to-problem links.`);

const tree=require('../data/review-tree.json');
const {reviewTreePaperIds,reviewTreeNodeFromHash,reviewTreeCoverage}=require('../assets/review-tree.js');
assert.deepEqual(data.reviewTree,tree);
const nodes=new Set(tree.nodes.map(n=>n.id));
const assigned=tree.branches.flatMap(b=>b.nodes);
assert.equal(nodes.size,tree.nodes.length);
assert.deepEqual(assigned.slice().sort(),[...nodes].sort(),'Every question belongs to exactly one trunk.');
assert(nodes.has(tree.defaultNode));
const chapters=new Set(review.chapters.map(c=>c.id));
const referencedPapers=new Set(review.references.map(r=>r.paper));
for(const node of tree.nodes){
 assert(chapters.has(node.chapter),`Broken chapter link: ${node.id}`);
 assert.equal(reviewTreeNodeFromHash(tree,'#review-tree-'+node.id),node.id);
 const nodePapers=node.routes.flatMap(r=>r.papers);
 assert(node.preview.every(id=>nodePapers.includes(id)),`Preview must come from this question's methods: ${node.id}`);
 for(const route of node.routes){
  assert(route.papers.length&&route.approach);
  for(const id of route.papers){
   assert(referencedPapers.has(id),`Tree work not covered by the sourced review: ${id}`);
   const p=papers.get(id),e=data.problemMap.entries[id];
   const f=p.profile.fields.find(f=>f.key==='novelty')||p.overview.tldr.find(f=>f.key==='conclusion');
   assert(e.contrast?e.contrastSources.length:f.value&&f.sources.length,`Missing sourced method comparison: ${id}`);
  }
 }
}
assert.equal(reviewTreeNodeFromHash(tree,'#review-tree-unknown'),null);
assert.equal(reviewTreeNodeFromHash(tree,'#review-harness'),null);
for(const c of tree.connections)assert(nodes.has(c.from_)&&nodes.has(c.to));
assert.deepEqual(tree.branches.map(b=>b.id),data.problemMap.tree.pillars.map(p=>p.id),'Review and full index should share their top-level structure.');
assert(chapters.has(tree.boundary.chapter));
assert(tree.boundary.title&&tree.boundary.description);
for(const id of tree.boundary.papers){
 assert(referencedPapers.has(id),`Boundary example lacks a review source: ${id}`);
 const p=papers.get(id),e=data.problemMap.entries[id];
 const f=p.profile.fields.find(f=>f.key==='novelty')||p.overview.tldr.find(f=>f.key==='conclusion');
 assert(e.contrast?e.contrastSources.length:f.value&&f.sources.length,`Boundary comparison lacks a source: ${id}`);
}
const coverage=reviewTreeCoverage(tree,data.papers,data.problemMap);
const coverageIds=[...coverage.featured,...coverage.other.flatMap(g=>g.papers)];
assert.equal(coverage.total,papers.size);
assert.equal(coverageIds.length,new Set(coverageIds).size,'Featured and supplementary lists must not duplicate records.');
assert.deepEqual(coverageIds.slice().sort(),[...papers.keys()].sort(),'Every catalog record must have a visible path from the overview.');
console.log(`Passed: interactive review tree, ${nodes.size} questions, ${reviewTreePaperIds(tree).length} works, source-backed comparisons, chapter links and shared trunk structure.`);
console.log(`Passed: artifact boundary and coverage disclosure account for all ${coverage.total} catalog records.`);

// The reading guide and both trees must agree on the task/meta distinction.
assert.deepEqual(tree.layers,data.problemMap.tree.layers);
assert.deepEqual(tree.layers.map(l=>[l.id,l.branches]),[
 ['task',['signal','retain']],['meta',['improve']],['evidence',['evaluate']]
]);
assert.deepEqual(tree.layers.flatMap(l=>l.branches).sort(),tree.branches.map(b=>b.id).sort());
assert.deepEqual(review.guide.steps.map(s=>s.id),tree.branches.map(b=>b.id));
assert.deepEqual(review.chapters.map(c=>c.id),[
 'scope',...review.guide.steps.flatMap(s=>s.chapters),'synthesis'
],'The chapter order must follow the reading guide without omitting or repeating chapters.');
for(const step of review.guide.steps){
 assert(step.chapters.every(id=>chapters.has(id)),`Broken guide link: ${step.id}`);
 assert(step.title&&step.text&&step.label);
}
for(const chapter of review.chapters)assert(chapter.mainline,`${chapter.id}: missing place in the main argument`);
for(const branch of tree.branches)assert(branch.relationLabel&&branch.relation);
for(const node of tree.nodes){
 assert(node.relation?.label&&node.relation.text,`${node.id}: unexplained method relationships`);
 for(const route of node.routes)assert(route.kind,`${node.id}: unlabeled method or evidence role`);
}
for(const connection of tree.connections){
 assert(connection.kind&&['→','↔'].includes(connection.symbol),'Cross-branch links need a relationship type and direction.');
}
console.log('Passed: task/meta/evaluation grouping, mainline chapter order and links, explicit relationships within and across branches.');
