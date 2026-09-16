'use strict';
const assert=require('node:assert/strict');
const data=require('../data/papers.json');
const records=require('../data/library-additions.json');
const {matches,text}=require('../assets/app.js');
const all=data.papers.map(p=>({...p,searchText:text(JSON.stringify(p)).toLowerCase()}));
const query=s=>all.filter(p=>matches(p,{q:'',category:'',quick:'all',year:'',tags:[],facets:{},...s}));
assert.equal(all.length,142+records.length);
assert.equal(new Set(all.map(p=>p.id)).size,all.length);
assert.equal(new Set(all.map(p=>p.url)).size,all.length);
assert.equal(records.length,24);
for(const e of records){
 const p=all.find(p=>p.id===e.id);assert(p&&p.curated);
 assert(data.contentTypes[p.contentType]);assert(data.taxonomy[p.category]);
 assert.equal(p.category==='methods',Object.hasOwn(data.methodTypes,p.methodType));
 assert(/^\d{4}-\d{2}(-\d{2})?$/.test(p.date));assert(p.dateLabel);
 assert.deepEqual(p.overview.tldr.map(f=>f.key),['gap','position','conclusion']);
 for(const f of [...p.overview.tldr,...p.profile.fields]){
  assert(f.value.length>=(f.key==='author'?3:15),p.id+':'+f.key);assert(f.sources.length);
  assert(!/待核|待补|本轮尚|RQ\d|\ufffd/.test(f.value));
  for(const s of f.sources){assert(s.label&&s.url.startsWith('https://'));}
 }
 assert(p.visibleKeys.every(k=>p.profile.fields.some(f=>f.key===k)));
 if(['methods','evaluation'].includes(p.category))assert.deepEqual(p.visibleKeys,['object','executor','modifier','verdict','seed']);
 else assert(!p.profile.fields.some(f=>['train','debug','test'].includes(f.key)));
 for(const a of p.attributions){assert(data.attributionCatalog[a.tag]);assert(a.sources.length);assert(p.tags.includes(a.tag));}
}
assert.equal(query({facets:{type:['repository']}}).length,1);
assert.equal(query({facets:{type:['blog']}}).length,13);
assert.equal(query({facets:{type:['survey']}}).length,3);
assert.equal(query({facets:{type:['repository','blog']}}).length,14);
assert.equal(query({facets:{type:['blog'],institution:['org:openai']}})[0].id,'openai-research-acceleration');
assert.equal(query({category:'methods',facets:{type:['report']}}).filter(p=>p.curated).length,3);
assert.equal(query({facets:{institution:['org:washington']}}).length,3);
assert.equal(query({facets:{institution:['org:bytedance-seed']}}).length,4);
const f=(id,k)=>all.find(p=>p.id===id).profile.fields.find(f=>f.key===k).value;
assert(f('2608.26530','cycle').includes('verifier 不参与撰写'));
assert(f('2607.12227','train').includes('45'));
assert(f('2609.00768','verdict').includes('GPT-4o'));
assert(f('2609.08183','isolation').includes('十项'));
assert(f('icoder-27b','train').includes('28,952'));
assert(f('metarsi-v1','test').includes('100'));
console.log('Passed: 24 sourced library entries, content types, dimension scope, combined filters and data/feedback distinctions.');
