'use strict';
// End-to-end regression checks for overlapping objects and evidence-qualified roles.
const assert=require('node:assert/strict');
const fs=require('node:fs');
const path=require('node:path');
const root=path.resolve(__dirname,'..');
const {matches,text,methodTypes,methodLabel,modifierRoles,groupValues}=require('../assets/app.js');
const data=JSON.parse(fs.readFileSync(process.argv[2]||path.join(root,'data/papers.json'),'utf8'));
const papers=data.papers.map(p=>({...p,searchText:text(JSON.stringify(p)).toLowerCase()}));
const get=id=>{const p=papers.find(p=>p.id===id);assert(p,id);return p;};
const state=()=>({q:'',category:'',quick:'all',year:'',tags:[],facets:{}});
const query=options=>papers.filter(p=>matches(p,{...state(),...options}));
const ids=options=>new Set(query(options).map(p=>p.id));
const validTypes=new Set(Object.keys(data.methodTypes));
for(const p of papers){
 assert(Array.isArray(p.methodTypes),p.id);
 assert.equal(new Set(p.methodTypes).size,p.methodTypes.length,p.id);
 assert(p.methodTypes.every(t=>validTypes.has(t)),p.id);
 assert.equal(p.category==='methods',p.methodTypes.length>0,p.id);
 if(p.methodType)assert(p.methodTypes.includes(p.methodType),p.id);
 assert(Array.isArray(p.modifierRoles)&&Array.isArray(p.parameterTargets)&&Array.isArray(p.skillKinds),p.id);
 if(p.modifierRoles.includes('UnknownModifier'))assert.equal(p.modifierRoles.length,1,p.id);
 if(p.modifierRoles.some(r=>!['UnknownModifier','NotApplicableModifier'].includes(r)))assert(p.mechanismClassification.sources.length,p.id);
}
assert.equal(new Set(papers.map(p=>p.id)).size,papers.length);
assert.equal(Object.values(data.methodTypeCounts).reduce((a,b)=>a+b,0),papers.filter(p=>p.category==='methods').length);
for(const t of validTypes){
 assert.equal(data.methodObjectCounts[t],query({category:'methods',quick:t}).length,t);
 assert.equal(data.methodTypeCounts[t],papers.filter(p=>p.methodType===t).length,t);
}

// Searching by either displayed object must return this mixed-experiment paper.
assert.deepEqual(methodTypes(get('2509.19349')),['artifact','harness']);
assert(ids({category:'methods',quick:'artifact'}).has('2509.19349'));
assert(ids({category:'methods',quick:'harness'}).has('2509.19349'));
assert(methodLabel(get('2509.19349')).includes('产物进化'));
assert(methodLabel(get('2509.19349')).includes('Harness 进化'));
assert(ids({quick:'harness',facets:{harnessPart:['Workflow']}}).has('2509.19349'));

// A proposed weight update must not be presented as an executed joint update.
assert.equal(get('2608.13951').methodType,'harness');
assert.deepEqual(methodTypes(get('2608.13951')),['harness']);
assert(!ids({quick:'joint'}).has('2608.13951'));
assert(!get('2608.13951').tags.includes('Weights'));
assert.deepEqual(get('2608.13951').parameterTargets,[]);

// Source-qualified role metadata fixes the omissions and does not guess from old tags.
assert(ids({facets:{modifierRole:['SelfModifier','SelfArtifact']}}).has('2303.17651'));
for(const id of ['2406.07496','2308.10144','2607.13683','2606.14249']){
 assert(ids({facets:{modifierRole:['OtherModifier']}}).has(id),id);
 assert(ids({facets:{modifierRole:['OtherEditor']}}).has(id),id);
}
const unknown={id:'unconfirmed-role-fixture',category:'methods',methodType:'harness',tags:['SameModel','SeparateEvolver']};
assert.deepEqual(modifierRoles(unknown),['UnknownModifier']);
assert(!groupValues(unknown,'modifierRole').includes('SelfModifier'));
assert(!groupValues(unknown,'modifierRole').includes('OtherModifier'));
assert.deepEqual(modifierRoles(get('2203.11171')),['NotApplicableModifier']);

// Freezing the task LLM does not erase editor/router learning from the catalog.
assert(ids({facets:{parameters:['EditorWeights']}}).has('2608.02276'));
assert(!get('2608.02276').parameterTargets.includes('TaskModelWeights'));
assert(ids({facets:{parameters:['RouterWeights']}}).has('2603.18743'));
for(const kind of ['SkillDocument','SkillCode'])assert(ids({facets:{harnessPart:[kind]}}).has('2603.18743'));
assert(ids({facets:{harnessPart:['SkillCode']}}).has('2305.16291'));

for(const id of ['2203.11171','2303.17651','2305.11738','2305.20050','2309.11495','2310.01798','2310.04406']){
 assert.deepEqual(get(id).depth,['非持久／不适用'],id);
 assert(!get(id).tags.includes('M0'),id);
}
assert.deepEqual(get('2605.23904').depth,['M1']);
assert(!get('2605.23904').tags.includes('M2'));
assert(get('2605.23904').depthBasis.includes('meta guidance'));
console.log(`Passed: ${papers.length} source-qualified classifications; multi-object filters, role omissions, unknown actors, weight targets, skills and nonpersistent depth.`);
