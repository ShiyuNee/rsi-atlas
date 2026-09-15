"""Compile source-linked papers, repositories and editorial resources into one index."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
LABELS={'object':'什么在进化','executor':'谁执行','modifier':'谁来改','verdict':'反馈是什么','seed':'基础 harness','cycle':'更新规则','train':'训练／进化数据','debug':'调试／选版本数据','test':'测试数据与判分','isolation':'数据隔离与证据边界','novelty':'方法特点','scope':'关注范围','framework':'分析框架','feedback':'反馈与证据','evidence':'证据来源','reading':'怎么读','limits':'适用范围与局限','data':'使用的数据','use':'如何使用','actors':'谁在做研究'}
TYPES={'paper':'论文','report':'技术报告','survey':'综述','repository':'仓库','blog':'博客'}
def attach_library_additions(output):
    records=json.loads((ROOT/'data/library-additions.json').read_text())
    ids={p['id'] for p in output['papers']}
    for e in records:
        assert e['id'] not in ids,e['id']
        ids.add(e['id'])
        refs=e['references']
        def sourced(x):
            assert x['value'] and x['refs']
            return dict(value=x['value'],sources=[refs[k] for k in x['refs']])
        fields=[dict(key=k,label=LABELS[k],status='recorded',**sourced(x)) for k,x in e['dimensions'].items()]
        fieldmap={f['key']:f for f in fields}
        tldr=[dict(key=k,**sourced(e['tldr'][k])) for k in ['gap','position','conclusion']]
        assert all(k in fieldmap for k in e['visibleKeys'])
        if e['category'] in ('methods','evaluation'):
            assert all(k in fieldmap for k in ['object','executor','modifier','verdict','seed','train','debug','test','isolation'])
        kind=e['contentType']
        p=dict(id=e['id'],title=e['title'],date=e['date'],dateLabel=e['dateLabel'],year=e['date'][:4],url=e['url'],priority=e['priority'],priorityBasis=e.get('priorityBasis','按主题相关性与阅读价值标注'),category=e['category'],categories=[e['category']],methodType=e['methodType'],contentType=kind,curated=True,source='addition',depth=['未明确'],tags=e['tags'].copy(),details=[],occurrences=[],review='新增 · 原文定向核对',reviewed=True,links=e['links'],sources=list(refs.values()),fields={'本质定位':e['tldr']['position']['value']},protocol='见数据隔离说明' if 'isolation' in fieldmap else '不适用：非统一实验',protocolBasis=fieldmap.get('isolation',fieldmap.get('limits',{})).get('value',''),visibleKeys=e['visibleKeys'],overview=dict(tldr=tldr,fields={k:fieldmap[k]['value'] for k in e['visibleKeys']}),profile=dict(fields=fields,sourceDate=e['reviewedAt'],experiments=[],feedbackCases=[],missing=[],partial=[]),brief=dict(summary=e['tldr']['position']['value'],**{f['key']:f['value'] for f in fields}),attributions=e.get('attributions',[]))
        for a in p['attributions']:
            assert a['sources']
            output['attributionCatalog'][a['tag']]={'label':a['label'],'kind':a['kind']}
            p['tags'].append(a['tag'])
        output['papers'].append(p)
    for p in output['papers']:
        p.setdefault('contentType','report' if p.get('publicationType')=='project-report' else 'paper')
    output['contentTypes']=TYPES
    output['taxonomy'].update(overview={'label':'综述与观点','description':'领域路线、概念梳理及产业观察。'},resources={'label':'工具与基础设施','description':'可复用仓库、服务和实验基础设施。'})
    output['updated']='2026-09-15'
    output['libraryAdditions']=len(records)
    output['coverage']['total']=len(output['papers'])
    output['coverage']['sourcedLibraryAdditions']=len(records)
