"""Attach the single maintained, source-linked research table used by both views."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def attach_tables(papers):
    tables=json.loads((ROOT/'data/research-tables.json').read_text())
    overviews=json.loads((ROOT/'data/overviews.json').read_text())
    experiments=json.loads((ROOT/'data/experiment-protocols.json').read_text())
    feedback=json.loads((ROOT/'data/feedback-protocols.json').read_text())
    assert set(tables)==set(overviews)==set(feedback)=={p['id'] for p in papers}
    for p in papers:
        table=tables[p['id']]
        p['overview']=overviews[p['id']]
        p['profile']['fields']=table['fields']
        p['profile']['feedbackCases']=feedback[p['id']]
        fields={f['key']:f for f in table['fields']}
        rows=[]
        covered=set()
        for config in experiments[p['id']]:
            row=dict(config)
            for target, key in row.pop('fieldRefs',{}).items():
                row[target]=fields[key]['value']
            row['sources']={target:fields[key]['sources'] for target,key in
                [('evolution','train'),('selection','debug'),('evaluation','test'),('isolation','isolation')]}
            indices=set(row.get('learningCases',[])+row.get('testCases',[])+row.get('feedbackCases',[]))
            assert all(0<=i<len(feedback[p['id']]) for i in indices),p['id']
            covered.update(indices)
            rows.append(row)
        assert covered==set(range(len(feedback[p['id']]))),p['id']
        p['profile']['experiments']=rows
        p['profile']['missing']=[]
        p['profile']['partial']=[]
        p['profile']['sourceDate']=table['sourceDate']
        for f in table['fields']:
            p['brief'][f['key']]=f['value']
        p['brief']['protocolDetail']='\n\n'.join(f['label']+'：'+f['value'] for f in table['fields'] if f['key'] in ('train','debug','test','isolation'))
    return dict(total=len(papers),tables=len(tables),withMissingFields=0,systemDataAudited=len(tables))
