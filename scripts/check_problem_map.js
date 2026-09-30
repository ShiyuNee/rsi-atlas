'use strict';
const assert=require('node:assert/strict');
const data=require('../data/papers.json');
const map=require('../data/problem-map.json');
const {problemMembers}=require('../assets/problem-map.js');
const {matches,text}=require('../assets/app.js');
const papers=new Map(data.papers.map(p=>[p.id,p]));
assert.deepEqual(data.problemMap,map);
assert.deepEqual(Object.keys(map.entries).sort(),[...papers.keys()].sort());
const groups=new Set(map.groups.map(g=>g.id));
const all=[];
for(const g of map.groups){
 for(const b of g.branches){
  assert(b.papers.length&&b.representatives.length);
  for(const id of b.papers){all.push(id);const e=map.entries[id];assert.equal(e.primary,g.id);assert.equal(e.branch,b.id);assert(e.sources.length);assert(e.question.length>15);assert(e.related.every(x=>groups.has(x)&&x!==g.id));}
  for(const id of b.representatives){assert(b.papers.includes(id));assert(map.entries[id].contrastSources.length);assert(map.entries[id].contrast);}
 }
 assert(g.route.every(id=>papers.has(id)));
 const actual=data.papers.filter(p=>matches({...p,searchText:text(JSON.stringify(p))},{q:'',category:'',quick:'all',year:'',facets:{},tags:[],question:g.id})).map(p=>p.id).sort();
 assert.deepEqual(actual,problemMembers(map,g.id).sort());
}
assert.equal(all.length,papers.size);assert.equal(new Set(all).size,papers.size);
for(const e of map.relations){assert(groups.has(e.from_)&&groups.has(e.to));assert(e.papers.every(id=>papers.has(id)));}
for(const d of map.directions){assert(d.papers.every(id=>papers.has(id)));assert(d.groups.every(id=>groups.has(id)));assert(d.experiment&&d.baseline&&d.falsifier);}
for(const item of [...map.eras,...map.readingPaths])assert(item.papers.every(id=>papers.has(id)));
for(const p of papers.values()){const e=map.entries[p.id];assert.deepEqual(p.researchProblems,[e.primary,...e.related]);}
console.log(`Passed: ${papers.size} problem assignments, sourced comparisons, cross-links, question filters and research suggestions.`);
const {treeLeafIds}=require('../assets/research-tree.js');
assert.deepEqual(treeLeafIds(map).sort(),[...papers.keys()].sort());
const treeQuestions=map.tree.pillars.flatMap(p=>p.groups);
assert.equal(new Set(treeQuestions).size,7);
assert.deepEqual(treeQuestions.slice().sort(),map.groups.filter(g=>g.id!=='perspectives').map(g=>g.id).sort());
for(const p of map.tree.pillars)assert(p.evidence.every(id=>papers.has(id)));
for(const [id,n] of Object.entries(map.tree.nodes)){assert(groups.has(id));assert(n.papers.every(id=>papers.has(id)));assert(n.insight&&n.fork);}
for(const b of map.tree.bridges){assert(groups.has(b.from)&&groups.has(b.to));assert(b.papers.every(id=>papers.has(id)));}
assert.equal(map.tree.evidenceSteps.length,3);
for(const e of map.tree.evidenceSteps)assert(e.papers.every(id=>papers.has(id)));
console.log('Passed: connected tree covers all records, seven questions, cross-branch links and sourced evidence distinctions.');
