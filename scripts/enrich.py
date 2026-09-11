# coding: utf-8
"""Explicit research taxonomy and readable records. Labels never determine evidence."""
import re,json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
TAXONOMY={
 'methods':{'label':'Methods · 方法','description':'按持久改进的对象进一步区分四类。'},
 'evaluation':{'label':'Evaluation · 评估','description':'评测框架、诊断与实证分析。'},
 'dataset':{'label':'Dataset · 数据集','description':'以可复用数据集为主要贡献；不把所有 benchmark 归入数据集。'},
 'theory':{'label':'Theory · 理论','description':'形式定义、自指与程序搜索基础。'}
}
METHOD_TYPES={'harness':'Harness 进化','artifact':'产物进化','weights':'模型参数进化','joint':'Harness + 模型参数进化'}
EXPLICIT={
 'theory':'cs-0309048 doi.org-10.1016-S0065-2458-08-60418-0 people.idsia.ch-juergen cs-0207097 1805.06610',
 'support':'2203.11171 2303.17651 2305.11738 2305.20050 2309.11495 2310.01798 2310.04406 2509.19349 2609.01481',
 'model':'2511.10395 2607.14777 2506.10943 2607.28568 2607.21971 2606.19980 endlessfrontier.tech-assets-paper.pdf',
 'coupled':'2608.09819 2608.13951 2606.14249 2603.21877 2605.27276 2510.16079 2603.18620 2607.26784 2608.05446',
 'evaluation':'rsi-exam 2606.17546 2607.25886 2608.09096 2608.31111 2609.01437 2608.03764 2602.22480 2606.04455 2608.06301 2505.11942 2507.05257 2508.19005 2510.17281 2511.20857 2604.17308 2604.20087 2605.18421 2606.05661 2607.05202 2608.00155 2608.01149 2608.03874 2608.04003 2608.06144 2603.08640 2604.10547 2606.04261 2606.05080 2607.05155 2505.19955 2605.08678 2608.17271 2608.31100 2608.10178',
 'harness':'2303.11366 2305.16291 2505.22954 2603.19461 2603.28052 2604.25850 2606.09498 2607.15524 2608.02276 2608.05144 2607.05297 2608.15071 2408.08435 2410.04444 2604.23472 2606.04465 2606.26294 2608.07645 2403.03186 2409.07429 2502.12110 2508.06433 2509.25140 2604.10923 2604.16839 2608.16114 2608.24876 2606.01314 2606.17220 2608.22793 2608.23397 2608.23552 2605.09998 2605.24539 2606.06324 2607.13683 2309.03409 2309.16797 2310.03714 2310.02304 2406.07496 2410.10762 2507.03616 2305.10250 2308.10144 2409.00872 2510.04618 2512.18746 2602.07755 2402.17574 2510.23601 2603.13131 2603.18000 2603.18743 2604.15097 2604.20133 2605.23904 2607.00272 2608.11350 2504.15228 2603.03329 2607.14159 2608.01918 2608.08466 2608.09380 2608.12307 2608.24735 2507.19457 2609.00829 2608.27311'
}
# Object tags are independent of the single research category.
OBJECTS={
 'Prompt':'2309.03409 2309.16797 2310.03714 2406.07496 2606.04465 2606.17220 2402.17574 2507.19457 2607.15524',
 'Workflow':'2410.10762 2507.03616 2607.15524 2408.08435 2409.07429',
 'MemoryContent':'2303.11366 2305.10250 2308.10144 2409.00872 2502.12110 2508.06433 2509.25140 2510.04618 2403.03186 2604.16839 2608.23552 2608.23397',
 'MemoryMechanism':'2512.18746 2602.07755',
 'Skill':'2305.16291 2605.23904 2608.15071 2607.05297 2510.23601 2603.13131 2603.18000 2603.18743 2604.15097 2604.20133 2607.00272 2608.11350',
 'Improver':'2309.16797 2310.02304 2410.04444 2505.22954 2603.19461 2607.05297 2604.23472 2606.04465 2606.26294 2504.15228',
 'LearnedUpdater':'2608.02276 2607.28568 2607.21971',
 'EditorWeights':'2608.02276 2607.28568 2607.21971',
 'Weights':'2511.10395 2607.14777 2506.10943',
 'Data':'endlessfrontier.tech-assets-paper.pdf 2607.25886 2606.04261 2603.08640'
}
UNKNOWN='原记录未单列；尚未核对到足够信息。'
def clean(s):
 s=re.sub(r'<br\s*/?>','；',s,flags=re.I)
 s=re.sub(r'\[([^]]+)\]\([^\s]+\)',r'\1',s)
 return re.sub(r'[*`]', '', s).strip()
def get(f,*ks):return next((f[k] for k in ks if f.get(k)), '')
def split_roles(s):
 s=clean(s)
 m=re.search(r'(?:改/执行|同一个 fixed base model|同一 fixed base model)',s)
 if s.startswith('改/执行'):return s,s
 m=re.search(r'^(?:改|修改者)\s*[:：](.*?)\s*(?:[；。]?\s*执行\s*[:：])(.*)',s)
 if m:return m[2].strip(),m[1].strip()
 if '→' in s:
  a,b=s.split('→',1);return b.strip(),a.strip()
 return '', ''
def enrich(papers):
 ids={p['id'] for p in papers};mapping={}
 for cat,pids in EXPLICIT.items():
  for pid in pids.split():
   assert pid not in mapping,pid
   mapping[pid]=cat
 assert ids==set(mapping),(ids-set(mapping),set(mapping)-ids)
 reviewed=json.loads((ROOT/'data/reviews.json').read_text())
 for p in papers:
  f=p['fields'];p['legacyCategories']=p['categories'];old=mapping[p['id']];p['category']=old if old in ('evaluation','theory') else 'methods';p['methodType']={'harness':'harness','support':'artifact','model':'weights','coupled':'joint'}.get(old,'');p['categories']=[p['category']]
  if p['id']=='2310.01798':p['category']='evaluation';p['methodType']='';p['categories']=['evaluation']
  if p['id']=='2305.20050':p['methodType']='weights'
  details={x['label']:x['text'] for x in p['details']}
  summary=get(f,'本质定位') or get(details,'本质定位','定位 / 真正新点')
  summary=re.sub(r'^\*\*[^*]+\*\*[。.]?\s*','',summary) if re.match(r'^\*\*(?:H-|B-|F |Meta|Hybrid|M-)',summary) else summary
  roles=get(f,'谁来改 / 谁执行','谁来改 → 谁执行；基础 harness','被测系统 / seed harness / feedback','被测系统 / feedback')
  executor,modifier=split_roles(roles)
  novelty=get(f,'相对之前真正新增什么') or get(details,'真正新增','为什么经典','为什么经典 / 关键限制','为什么是经典 / 关键限制')
  if not novelty:novelty=summary
  p['brief']={
   'summary':summary,'novelty':novelty,'object':get(f,'什么在变') or '见上方机制介绍；原记录没有独立的可变对象字段。',
   'executor':executor or UNKNOWN,'modifier':modifier or UNKNOWN,'roleContext':roles,
   'seed':get(f,'基础 harness') or get(details,'基础 harness') or UNKNOWN,
   'fixed':get(f,'Meta-depth') or '当前记录未逐一列出固定部分。',
   'verdict':get(f,'Feedback','Feedback / evidence') or UNKNOWN,
   'diagnosis': '原记录未把“错误定位”与结果打分分开描述；见机制介绍。',
   'update':summary,'acceptance':'当前记录未单列 candidate acceptance / rollback 规则。',
   'experiments':[{'name':'实验协议（保留原记录口径）','evolve':get(f,'进化数据') or '未单独标注',
     'selection':get(f,'选模数据') or '未单独标注','test':get(f,'测试数据') or '未单独标注',
     'isolation':p['protocol'],'note':get(f,'Evolution → Eval','证据边界与关键结论','证据边界') or p['protocolBasis']}],
   'takeaway':get(details,'最关键限制 / 对我们的意义','对我们最重要','边界','关键缺口','为什么是经典 / 关键限制') or get(f,'证据边界与关键结论','证据边界') or '',
   'result':get(details,'主要结果','核心结果','最重要实证'),
   'reading':'本轮按原记录重新整理；未标为原文复核。','sources':p.get('sources',[]),
   'classificationReason':TAXONOMY[p['category']]['description']
  }
  for t,pids in OBJECTS.items():
   if p['id'] in pids.split():p['tags']=sorted(set(p['tags']+[t]))
  # M-depth is a separate qualified reading, never inferred from the fact that an editor is trained.
  if p['id']=='2607.15524':p['tags']=[t for t in p['tags'] if t!='HarnessCode']
  if p['id']=='2608.02276':p['tags']=[t for t in p['tags'] if t!='Weights']
  if p['id'] in reviewed:
   update=reviewed[p['id']].copy();overrides=update.pop('overrides',{});p.update(overrides);p['brief'].update(update)
  p['reviewed']=p['id'] in reviewed and bool(reviewed[p['id']].get('sources'))
 return TAXONOMY
