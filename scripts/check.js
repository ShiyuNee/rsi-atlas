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
assert(get('2604.25850').brief.seed.toLowerCase().includes('bash'));
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
const tables=require('../data/research-tables.json');
assert.equal(Object.keys(tables).length,papers.length);
const expected=['executor','modifier','object','verdict','seed','cycle','train','debug','test','isolation','novelty'];
for(const p of papers){
 assert.deepEqual(p.profile.fields.map(f=>f.key),expected,p.id);
 for(const f of p.profile.fields){
  assert(f.value.trim().length>4,p.id+':'+f.key);
  assert(!/待核|待补|未核实|原记录未|本轮尚/.test(f.value),p.id+':'+f.key);
  assert(f.sources.length>0,p.id+':'+f.key);
  for(const r of f.sources){assert(r.label&&r.url.startsWith('https://'),p.id);assert(!/Report GitHub|reporting errors|^References$/.test(r.label),p.id);}
 }
 assert.deepEqual(p.profile.fields,tables[p.id].fields,p.id);
 assert.equal(readingSections(p).length,1);
}
const field=(id,k)=>get(id).profile.fields.find(f=>f.key===k).value;
assert(field('2603.18743','train').includes('788'));
assert(field('2603.18743','test').includes('342'));
assert(field('2607.00272','train').includes('51–65'));
assert(field('2607.00272','test').includes('1–50'));
assert(field('2608.02276','test').includes('1300')||field('2608.02276','test').includes('1,300'));
assert(field('2608.02276','test').includes('1270')||field('2608.02276','test').includes('1,270'));
assert(field('2608.13951','isolation').includes('公开用例'));
assert(field('2608.31100','isolation').includes('不写入'));
assert.equal(get('2605.09998').methodType,'joint');
console.log('Passed: All maintained tables, all dimensions, per-row sources, no research placeholders, and experiment-specific regression checks.');

// Keep execution, modification and judging models distinct when rebuilding notes.
for(const p of papers){
 assert(/^\d{4}-\d{2}-\d{2}$/.test(tables[p.id].roleAuditDate),p.id);
 for(const k of ['executor','modifier','verdict']) assert.equal(p.brief[k],field(p.id,k),p.id+':'+k);
 assert(!/^LLM actor。|^修改后的同一 agent。|^同 agent 后续执行。/.test(field(p.id,'executor')),p.id);
}
assert(field('2608.31111','modifier').includes('Qwen3.5-4B'));
assert(field('2608.31111','modifier').includes('GPT-5.6'));
assert(field('2410.04444','executor').includes('gpt-3.5-turbo-0125'));
assert(field('2410.04444','modifier').includes('gpt-4o-2024-05-13'));
assert(field('2604.20087','executor').includes('Claude Sonnet 4.6'));
assert(field('2603.18743','executor').includes('Gemini-3.1-Flash'));
assert(field('2603.18743','executor').includes('不是答题模型'));
assert(field('2606.04455','executor').includes('Qwen3-8B'));
assert(field('2606.04455','executor').includes('Claude Haiku 4.5'));
assert(field('2608.06301','executor').includes('grok-build'));
console.log('Passed: all role audits; matching card/table text; explicit executor, modifier and router identities.');

const overviews=require('../data/overviews.json');
assert.equal(Object.keys(overviews).length,papers.length);
const overviewKeys=['object','executor','modifier','verdict','seed'];
for(const p of papers){
 assert.deepEqual(p.overview,overviews[p.id],p.id);
 assert.deepEqual(p.overview.tldr.map(f=>f.key),['gap','position','conclusion'],p.id);
 for(const f of p.overview.tldr){
  assert(f.value.length>=15,p.id+':'+f.key);
  assert(f.sources.length>0&&f.sources.every(s=>s.label&&s.url.startsWith('https://')),p.id);
  assert(!/RQ\s*\d|§|最干净的理论 M3|当前记录未/.test(f.value),p.id);
 }
 assert(Object.keys(p.overview.fields).every(k=>overviewKeys.includes(k)),p.id);
 for(const k of overviewKeys){
  const v=p.overview.fields[k]||field(p.id,k);
  assert(!/RQ\s*\d|§|\bM[012](?:[-+/：])|当前记录未|本轮尚/.test(v),p.id+':'+k);
 }
}
// Research descriptions must remain understandable without the paper's question numbers.
for(const p of papers){
 assert(!/\bRQ\s*[-–]?\s*\d/i.test(JSON.stringify({overview:p.overview,fields:p.profile.fields,feedback:p.profile.feedbackCases})),p.id);
}
assert(field('2608.31111','executor').includes('参数更新实验'));
assert(field('2608.31111','executor').includes('运行框架实验'));
assert(!overviews['2608.31111'].fields.executor.includes('RQ2'));
assert(overviews['2608.31111'].fields.executor.includes('Qwen3.5-9B'));
assert(overviews['2608.31111'].fields.modifier.includes('GPT-5.6'));
console.log('Passed: All sourced three-point TL;DRs; plain overview fields; technical detail retained in research tables.');

// Feedback must remain benchmark-specific in both catalog views.
const feedback=require('../data/feedback-protocols.json');
assert.deepEqual(Object.keys(feedback).sort(),papers.map(p=>p.id).sort());
for(const p of papers){
 const cases=p.profile.feedbackCases;
 assert.deepEqual(cases,feedback[p.id],p.id);
 assert(cases.length>0,p.id);
 assert.equal(new Set(cases.map(c=>c.label)).size,cases.length,p.id);
 for(const c of cases){
  for(const k of ['label','data','scoring','visible','use']) assert(typeof c[k]==='string'&&c[k].trim().length>(k==='label'?0:3),p.id+':'+k);
  assert(c.sources.length>0&&c.sources.every(s=>s.label&&s.url.startsWith('https://')),p.id);
  assert(!/待核|待补|本轮尚|\ufffd/.test(JSON.stringify(c)),p.id);
 }
}
const feedbackText=id=>JSON.stringify(feedback[id]);
assert(feedbackText('2608.09819').includes('tests/test.sh'));
assert(feedbackText('2608.09819').includes('Claude Opus 4.6'));
assert(feedbackText('2608.09819').includes('GLM-5.2'));
assert(feedbackText('2608.31111').includes('八项检查表'));
assert(feedbackText('2608.31111').includes('不返回试题'));
assert(feedbackText('2608.31100').includes('不返回代理'));
assert(feedbackText('2608.11350').includes('只用于诊断'));
assert(feedbackText('2603.18743').includes('参考答案'));
assert(feedbackText('2608.13951').includes('不是')||feedbackText('2608.13951').includes('不能'));
assert(query({q:'五级进展评分'}).some(p=>p.id==='2608.11350'));
console.log(`Passed: ${papers.length} sourced feedback protocols, ${Object.values(feedback).flat().length} experiment rows; feedback access and judging distinctions preserved.`);

// RSI-Exam includes task-specific artifact and information boundaries.
assert.equal(get('rsi-exam').category,'evaluation');
assert.equal(get('rsi-exam').priority,'C');
assert.equal(get('rsi-exam').publicationType,'project-report');
assert.equal(get('rsi-exam').profile.feedbackCases.length,7);
assert(field('rsi-exam','isolation').includes('最终问题本身可见'));
assert(field('rsi-exam','object').includes('学生模型'));
assert(query({q:'RSI-Exam',facets:{priority:['C']}}).some(p=>p.id==='rsi-exam'));
