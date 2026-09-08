#!/usr/bin/env python3
"""Lossless import of the research tables; optional reviewed additions live separately."""
import json
import re
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
LINK = re.compile(r'\[([^\]]+)\]\((https?://(?:[^()\s]|\([^()]*\))*)\)')

def plain(text):
    text = LINK.sub(r'\1', text)
    return re.sub(r'[*`$]', '', re.sub(r'<br\s*/?>', ' ', text)).strip()

def cells(line):
    return [x.strip().replace('\\|', '|') for x in re.split(r'(?<!\\)\|', line.strip().strip('|'))]

def key(url):
    return re.sub(r'[^a-zA-Z0-9.-]+', '-', url.replace('https://arxiv.org/abs/', '').replace('https://', '')).strip('-')

def build():
    source = (ROOT/'data/research-notes.md').read_text()
    papers = {}
    section = ''
    subsection = ''
    headers = []
    detail = None
    for n, line in enumerate(source.splitlines(), 1):
        if line.startswith('## '):
            section = line[3:]
            detail = None
        if line.startswith('###'):
            subsection = line.lstrip('# ')
            detail = None
            m = LINK.search(line)
            if m and section.startswith(('2.', '3.')):
                detail = m.group(2)
        if not line.startswith('|'):
            headers = []
            continue
        row = cells(line)
        if all(re.fullmatch(r'[-: ]+', c) for c in row):
            continue
        if not headers:
            headers = [plain(c) for c in row]
            continue
        if detail and detail in papers:
            papers[detail]['details'].append({'label':plain(row[0]), 'text':row[1]})
            continue
        if '论文' not in headers or len(row) != len(headers):
            continue
        record = dict(zip(headers,row))
        m = LINK.search(record['论文'])
        if not m:
            continue
        title, url = m.groups()
        p = papers.setdefault(url, dict(id=key(url), title=plain(title), url=url, date='', priority='R',
            categories=[], tags=[], fields={}, details=[], occurrences=[], source='original',
            review='原记录 · 横向定位', protocol='未明确', protocolBasis='尚未逐项标注；请阅读 Evolution → Eval 原文。'))
        p['occurrences'].append({'section':subsection,'line':n,'fields':record})
        if record.get('时间'):
            p['date'] = plain(record['时间'])
        level = plain(record.get('优先级', record.get('级别', '')))
        if level[:1] in ['C','K','R']:
            p['priority'] = level[0]
        p['tags'] = sorted(set(p['tags'] + re.findall(r'#([A-Za-z][A-Za-z0-9-]*)',record.get('标签',''))))
        if section.startswith('1.'):
            p['title'] = plain(title)
            p['fields'].update({k:v for k,v in record.items() if k not in ['论文','优先级','时间']})
            category = next((v for prefix,v in [('0A.','F'),('0B.','Feedback'),('A1.','H-Prompt'),('A2.','H-Mem'),('A3.','H-Skill'),('A4.','H-Full'),('B.','Hybrid'),('C.','B-RSI')] if subsection.startswith(prefix)), None)
            if category: p['categories'].append(category)
        elif section.startswith('0.5'):
            positioning = record.get('我们的定位：什么在变、真正新点', record.get('它真正测什么',''))
            first = re.match(r'\*\*(.*?)\*\*', positioning)
            if first:
                p['categories'] += re.findall(r'(?<![\w-])(?:H-Full|H-Mem|H-Skill|H-Prompt|M-Weight|M-Data|Meta|Hybrid|B-Harness|B-Lifelong|B-RSI|B-Reliability|F)(?![\w-])', first[1])
            p['fields'].setdefault('本质定位', positioning)
            for k,v in record.items():
                if k not in ['论文','时间','级别','标签','我们的定位：什么在变、真正新点','它真正测什么']:
                    p['fields'].setdefault(k,v)
    # Preserve source classes, including overlapping categories. No inferred positive evidence tags.
    for p in papers.values():
        p['categories'] = sorted(set(p['categories'])) or ['F']
        if p['details']: p['review'] = '原记录 · 详细介绍'
        p['year'] = p['date'][:4]
        meta = p['fields'].get('Meta-depth','')
        p['depth'] = sorted(set(re.findall(r'\bM[0-3]\b',meta) + [t for t in p['tags'] if re.fullmatch(r'M[0-3]',t)]))
        if not p['depth']: p['depth'] = ['未明确']
        if 'H-Prompt' in p['categories'] and 'H-Full' in p['categories']:
            pass
        if 'HeldOut' in p['tags']:
            p['protocol'] = '有 held-out 报告'
            p['protocolBasis'] = '原记录明确标注 #HeldOut；是否参与选模仍需结合协议原文。'
        if 'Prequential' in p['tags']:
            p['protocol'] = 'Prequential'
            p['protocolBasis'] = '原记录明确标注 #Prequential；经验只应影响后续任务。'
        if 'SameSet' in p['tags']:
            p['protocol'] = 'Same-set adaptive'
            p['protocolBasis'] = '原记录明确标注 #SameSet。'
    overrides_path = ROOT/'data/annotations.json'
    if overrides_path.exists():
        for pid, update in json.loads(overrides_path.read_text()).items():
            p = next((p for p in papers.values() if p['id']==pid), None)
            if p is None: raise ValueError('Annotation has no matching paper: '+pid)
            p.update(update)
    additions_path = ROOT/'data/additions.json'
    if additions_path.exists():
        for p in json.loads(additions_path.read_text()):
            if p['url'] in papers: raise ValueError('Duplicate addition: '+p['url'])
            p.setdefault('id',key(p['url']))
            p.setdefault('year',p['date'][:4])
            p.setdefault('details',[])
            p.setdefault('occurrences',[])
            p.setdefault('source','addition')
            papers[p['url']] = p
    output = dict(updated='2026-09-08',originalCount=sum(p['source']=='original' for p in papers.values()),
        papers=list(papers.values()), framework=source.split('## 0.5 ')[0],
        conclusions='## 4. '+source.split('## 4. ')[1])
    (ROOT/'data/papers.json').write_text(json.dumps(output,ensure_ascii=False,indent=2)+'\n')
    print(f"Built {len(papers)} papers ({output['originalCount']} original); {sum(bool(p['details']) for p in papers.values())} detailed records.")
    return output

if __name__ == '__main__': build()
