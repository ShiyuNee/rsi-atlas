# coding: utf-8
"""A question-led reading layer. Missing data stays missing; source checks are scoped."""
import json,re
from pathlib import Path
from enrich import clean
ROOT=Path(__file__).resolve().parents[1]
LABELS={'object':'谁在变 / 具体改什么','executor':'谁执行任务','modifier':'谁提出与实施修改','seed':'基础 harness / 初始系统','fixed':'哪些部分保持固定','verdict':'做对做错如何判断','diagnosis':'如何定位错误','update':'如何生成改动','acceptance':'如何接受、拒绝或回退','protocol':'进化、选模与测试数据','novelty':'与相近工作的区别','takeaway':'证据边界与局限'}
BAD=re.compile(r'原记录未|尚未核对|当前记录未|未单独标注|见上方机制|见机制介绍|未明确|待补|待全文|待正文|待核对')
def useful(s):
 if not s:return False
 return not re.match(r'^(?:原记录未|尚未核对|当前记录未|未单独标注$|见上方机制|原记录没有|见机制介绍$|未明确$)',s)
def attach_profiles(papers):
 changes=json.loads((ROOT/'data/dimension-updates.json').read_text())
 distinctions=json.loads((ROOT/'data/distinctions.json').read_text())
 checks=json.loads((ROOT/'data/source-checks.json').read_text())
 audit=[]
 for p in papers:
  b=p['brief'];f=p['fields'];pid=p['id'];n=p.get('readingNote')
  if pid in changes:b.update(changes[pid]);p['focusedReview']=True
  if pid in distinctions:b['novelty']=distinctions[pid]
  if pid=='2605.09998':
   p['methodType']='joint';p['tags']=sorted(set(p['tags']+['Weights','JointEvolution']))
   b['object']='包含两种设置：冻结模型时改 prompt/skills/memory/subagents；open-source co-learning 阶段同时更新模型参数。'
   b['novelty']='同一条不重置的游戏进程中持续改 harness，并扩展到参数共同学习；联合阶段包含 teacher relabel 与 SFT，不能概括为纯 frozen-model harness evolution。'
   b['protocolDetail']='co-learning 每轮先做 256 steps rollout，再用过程奖励和 Gemini-3.1-pro teacher 重标低奖励窗口，做 soft SFT；下一轮接着同一 emulator state。这是单条 reset-free 训练轨迹，不是独立 held-out episodes 的平均分。'
  if pid=='people.idsia.ch-juergen':
   p['url']='https://people.idsia.ch/~juergen/diploma.html'
   b['takeaway']='原论文摘要明确说其初步实验不足以展示具体 self-reference，受当时计算能力限制，主要是启发性构造；不能把高阶可编辑设计直接当成已验证的多代自改进。'
   b['novelty']='原作者区分 meta-level GP 与 PSALM：前者递归寻找更好的程序修改程序，后者让生成、连接和分配 credit 的 agents 竞争，且总 credit 受守恒约束。'
  # Recover typed values from detailed notes rather than showing a placeholder beside real information.
  if n:
   rows={}
   for section in n['sections'][:2]:
    for line in section['body'].splitlines():
     if line.startswith('|'):
      cols=[x.strip() for x in line.strip('|').split('|')]
      if len(cols)==2:rows[clean(cols[0])]=cols[1]
   for key,aliases in {'object':['什么在进化','设计上什么在进化'],'executor':['谁来执行','被改对象'],'modifier':['谁来改'],'verdict':['Feedback'],'update':['迭代','Stage 2：self-evolving loop','核心流程']}.items():
    if not useful(b.get(key,'')):
     b[key]=next((rows[a] for a in aliases if a in rows),b.get(key,''))
  if b.get('novelty')==b.get('summary'):b['novelty']=''
  if b.get('update')==b.get('summary'):b['update']=''
  # Meta-depth is not a description of fixed components.
  if re.match(r'^(?:M[0-3]|model-level|Evaluation only|non-harness|improver-level)',b.get('fixed','')):
   parts=re.split(r'[；;。]',b['fixed']);b['fixed']='；'.join(x for x in parts if re.search(r'fixed|冻结|固定|不变',x))
  protocol=b.get('protocolDetail') or f.get('Evolution → Eval') or f.get('证据边界与关键结论') or f.get('证据边界','')
  actual=[e for e in b['experiments'] if e['name']!='实验协议（保留原记录口径）']
  if actual:protocol='\n\n'.join(f"**{e['name']}**：进化 {e['evolve']}；选模 {e['selection']}；测试 {e['test']}。{e['isolation']}。{e.get('note','')}" for e in actual)
  if n:protocol='**进化**：'+n['index']['evolve']+'\n\n**评估**：'+n['index']['eval']+'\n\n详见下方实验章节及原文口径补注。'
  fields=[]
  for key,label in LABELS.items():
   value=protocol if key=='protocol' else b.get(key,'')
   if key in ('executor','modifier') and not useful(value) and useful(b.get('roleContext','')):
    value=b['roleContext'];status='partial'
   else:status=('partial' if re.search(r'未核实|待补|待核对|待全文|待正文',value or '') else 'recorded') if useful(value) else 'missing'
   if key=='protocol' and not actual and not n and value:status='partial'
   if not useful(value) and status=='missing':value=''
   if p['category']=='evaluation':
    label={'object':'被测的变化 / 能力','modifier':'被测系统如何更新','seed':'被测系统 / 参照基线','verdict':'评测如何判分','diagnosis':'如何分析失败与归因','update':'评测开放哪些更新方式','acceptance':'候选选模 / 评估控制','protocol':'任务组织与评估隔离'}.get(key,label)
    if key in ('modifier','update') and not value:
     value='由被测方法决定；此条贡献是评估协议，不假设 benchmark 自身修改。';status='not-applicable'
   fields.append(dict(key=key,label=label,value=value,status=status,source='原文定向补查' if pid in changes and (key in changes[pid] or (key=='protocol' and 'experiments' in changes[pid])) else '更新笔记' if n else '现有记录 / 定位对照'))
  missing=[x['label'] for x in fields if x['status']=='missing']
  partial=[x['label'] for x in fields if x['status']=='partial']
  p['profile']={'fields':fields,'missing':missing,'partial':partial,'sourceCheck':checks[pid], 'focus':b.get('novelty') or b['summary']}
  audit.append({'id':pid,'title':p['title'],'url':p['url'],'missing':missing,'partial':partial,'scope':checks[pid]['scope']})
 (ROOT/'data/coverage.json').write_text(json.dumps(audit,ensure_ascii=False,indent=2)+'\n')
 return {'total':len(papers),'focusedSupplements':len(changes),'withMissingFields':sum(bool(a['missing']) for a in audit)}
