# coding: utf-8
"""Import complete user-authored readings without adopting document taxonomy as site policy."""
import re
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def attach_readings(papers):
 source=(ROOT/'data/updated-research-notes.md').read_text()
 starts=list(re.finditer(r'^#{3,4} ([^\n]+)\n\n- \*\*链接\*\*：([^\n]+)',source,re.M))
 index={}
 for line in source.splitlines():
  if line.startswith('| 2026-'):
   cells=[v.strip() for v in line.strip('|').split('|')]
   if len(cells)==8:
    m=re.search(r'\]\((https://[^)]+)\)',cells[1])
    if m:index[m[1]]=dict(zip(['date','paper','executor','modifier','feedback','evolve','eval','tldr'],cells))
 count=0
 for i,m in enumerate(starts):
  url=m[2].strip();p=next((p for p in papers if p['url']==url),None)
  assert p is not None,url
  body=source[m.end():starts[i+1].start() if i+1<len(starts) else len(source)]
  # Group headings/index tables between papers are not part of a paper's reading.
  body=re.split(r'^## [AB]\. ',body,flags=re.M)[0].strip()
  core=re.search(r'^- \*\*核心定位\*\*：(.*)',body,re.M)
  headers=list(re.finditer(r'^#{4,5} ((?:[1-5]\. |总评).*)$',body,re.M))
  sections=[]
  for j,h in enumerate(headers):
   content=body[h.end():headers[j+1].start() if j+1<len(headers) else len(body)].strip()
   content=re.sub(r'(?:\n\s*---\s*)+$','',content).strip()
   sections.append({'title':h[1], 'body':content})
  assert len(sections)==6,(url,len(sections))
  p['readingNote']={'source':'data/updated-research-notes.md','attribution':'用户更新调研笔记','intro':core[1] if core else '', 'index':index[url], 'sections':sections, 'caveats':[]}
  count+=1
 assert count==9,count
 for p in papers:
  if p['id']=='2604.25850':
   p['readingNote']['caveats']=[{'text':'模型设置的原文口径不一致：正文 §4.1 称三个角色均用 GPT-5.4 high；附录 A 表 4 的 reference-run 配置却列出 Code Agent 为 high、Evolve Agent 为 xhigh。下文沿用新笔记及附录的 xhigh，并保留这一差异；此前网站统一写成 high 过于确定。','url':'https://arxiv.org/html/2604.25850v4#A1'}]
   p['brief']['modifier']='GPT-5.4 Evolve Agent：附录 A 表 4 为 xhigh，正文 §4.1 称 high，原文口径不一致；Agent Debugger 提供结构化诊断。'
  if p['id']=='2608.12307':
   p['readingNote']['caveats']=[{'text':'样本数口径需区分：论文 §3.1 定义 5% validation / 其余 hidden test，§4.1 又称 3,900-item hidden test 并另列 195 validation，结果分析使用 full-set accuracy。下文保留笔记和论文报告的 3,900，不能仅凭这些表述把 3,900 与 195 当成已核实的互斥集合大小。','url':'https://arxiv.org/html/2608.12307v1'}]
 return count
