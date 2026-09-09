'use strict';
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const root = path.resolve(__dirname,'..');
const {matches,text}=require('../assets/app.js');
const data=JSON.parse(fs.readFileSync(path.join(root,'data/papers.json'),'utf8'));
const papers=data.papers.map(p=>({...p,searchText:text(JSON.stringify(p)).toLowerCase()}));
const state=()=>({q:'',category:'',quick:'all',year:'',tags:[],facets:{}});
const query=s=>papers.filter(p=>matches(p,{...state(),...s}));
const additions=JSON.parse(fs.readFileSync(path.join(root,'data/additions.json'),'utf8'));
assert.equal(query({}).length,data.originalCount+additions.length);
assert.equal(query({quick:'new'}).length,additions.length);
assert.equal(new Set(papers.map(p=>p.url)).size,papers.length);
assert.equal(new Set(papers.map(p=>p.id)).size,papers.length);
assert.equal(query({q:'does-not-exist-74591'}).length,0);
assert(query({q:'Terminus'}).some(p=>p.id==='2603.28052'));
assert(query({q:'GPT-5.4 NexAU'}).some(p=>p.id==='2604.25850'));
assert(query({quick:'isolated'}).every(p=>!['2606.09498','2604.25850','2603.28052'].includes(p.id)));
assert(query({facets:{modifier:['SameModel']}}).some(p=>p.id==='2606.09498'));
assert(query({facets:{modifier:['SameModel'],target:['HarnessCode']},quick:'core'}).some(p=>p.id==='2606.09498'));
assert(query({facets:{target:['Skill','HarnessCode']}}).length>=query({facets:{target:['Skill']}}).length);
assert(query({category:'methods',year:'2026'}).every(p=>p.category==='methods'&&p.year==='2026'));
assert(query({tags:['ExecutableVerifier','RegressionGate']}).every(p=>p.tags.includes('ExecutableVerifier')&&p.tags.includes('RegressionGate')));
for(const p of papers){assert(p.title&&p.date&&p.categories.length&&p.depth.length&&p.review);assert(p.url.startsWith('https://'));assert(p.fields['本质定位'],p.title);}
console.log(`Passed: ${papers.length} unique records; ${additions.length} additions; keyword, compound facets, date, evidence boundaries and source metadata.`);
const get=id=>papers.find(p=>p.id===id);
assert.deepEqual(Object.keys(data.taxonomy),['methods','evaluation','dataset','theory']);
assert.deepEqual(Object.keys(data.methodTypes),['harness','artifact','weights','joint']);
for(const p of papers){
 assert(Object.hasOwn(data.taxonomy,p.category),p.id);
 assert.equal(p.categories.length,1);
 assert.equal(p.category==='methods',Object.hasOwn(data.methodTypes,p.methodType),p.id);
 assert(p.brief.summary&&p.brief.experiments.length,p.id);
 assert(!JSON.stringify(p.brief).includes('\ufffd'),p.id);
}
assert.equal(get('2607.25886').category,'evaluation');
assert.equal(get('2608.09096').category,'evaluation');
assert.equal(get('2303.17651').methodType,'artifact');
assert.equal(get('2506.10943').methodType,'weights');
assert.equal(get('2603.21877').methodType,'joint');
assert.equal(get('2608.02276').methodType,'harness');
assert(get('2608.02276').tags.includes('EditorWeights'));
assert(!get('2607.15524').tags.includes('HarnessCode'));
assert(get('2410.10762').tags.includes('Workflow'));
assert(get('2604.25850').brief.seed.includes('bash'));
assert(get('2604.25850').brief.executor.includes('high'));
for(const type of Object.keys(data.methodTypes)){
 const selected=query({category:'methods',quick:type});assert(selected.length>0);
 assert(selected.every(p=>p.methodType===type));
}
assert(query({category:'evaluation',facets:{priority:['C']}}).length>0);
assert.equal(query({category:'dataset'}).length,0);
assert.equal(query({facets:{verified:['原文关键段落已复核']}}).length,25);
console.log('Passed: two-level taxonomy, independent priority, all four method types, primary-source corrections, 25 reviewed papers.');

const {readingSections}=require('../assets/app.js');
assert.equal(data.readingCount,9);
assert.equal(query({facets:{content:['完整专题解读']}}).length,9);
for(const p of papers.filter(p=>p.readingNote)){
 const sections=readingSections(p);assert.equal(sections.length,6,p.id);
 assert(sections.every(s=>s.body.length>100),p.id);
 assert(sections.reduce((n,s)=>n+s.body.length,0)>4000,p.id);
 assert(p.readingNote.index.executor&&p.readingNote.index.evolve&&p.readingNote.index.eval,p.id);
 assert(!sections.some(s=>s.body.includes('## B. Non-Harness')),p.id);
}
assert(readingSections(get('2608.15071')).some(s=>s.body.includes('论文没有实验')));
assert(readingSections(get('2607.14777')).some(s=>s.body.includes('1,440')));
assert(readingSections(get('2607.25886')).some(s=>s.body.includes('18/23')));
assert(get('2604.25850').readingNote.caveats.length>0);
assert(get('2608.12307').readingNote.caveats.length>0);
assert(query({q:'General Topic 跨 benchmark'}).some(p=>p.id==='2608.15071'));
console.log('Passed: 9 complete six-section readings; full mechanisms, results, caveats and search coverage.');
assert.equal(data.coverage.total,134);
for(const p of papers){
 assert.equal(p.profile.fields.length,12,p.id);
 assert(p.brief.novelty.length>15,p.id);
 assert.equal(p.profile.sourceCheck.date,'2026-09-09');
 assert(p.profile.sourceCheck.url.startsWith('https://'));
 assert(p.profile.fields.every(f=>['recorded','partial','missing','not-applicable'].includes(f.status)),p.id);
 assert(p.profile.fields.filter(f=>f.status==='missing').every(f=>f.value===''),p.id);
}
assert.equal(get('2605.09998').methodType,'joint');
assert(get('2606.01314').brief.experiments.some(e=>e.test==='205 test'));
assert(get('2608.24876').brief.experiments.some(e=>e.name==='SkillFlow'&&e.note.includes('没有 held-out')));
assert(get('2409.07429').brief.experiments.some(e=>e.name.includes('online')));
assert(get('2310.03714').brief.experiments[0].test.includes('validation'));
assert(query({facets:{gaps:['哪些部分保持固定']}}).length>0);
assert(!readingSections(get('2608.03764')).some(s=>s.title.includes('执行者、修改者')));
console.log('Passed: 134 question-led profiles; explicit source scopes, gaps, distinct mechanisms and protocol corrections.');

const audits=require('../data/system-data-audit.json');
assert.equal(Object.keys(audits).length,134);
for(const p of papers){
 const a=audits[p.id];assert(a&&a.seed&&a.protocol&&a.sections,p.id);
 assert.equal(p.brief.seed,a.seed,p.id);
 assert.equal(p.brief.protocolDetail,a.protocol,p.id);
 assert.equal(p.profile.fields.find(f=>f.key==='seed').value,a.seed,p.id);
 assert.equal(p.profile.fields.find(f=>f.key==='protocol').value,a.protocol,p.id);
 assert(a.source.startsWith('https://')&&a.sourceSha256.length===64,p.id);
}
assert(get('2507.19457').brief.protocolDetail.includes('PUPA'));
assert(get('2511.10395').brief.protocolDetail.includes('BFCL v3'));
console.log('Passed: all 134 source-linked dataset/harness audits reach generated profiles without stale overrides.');
