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
