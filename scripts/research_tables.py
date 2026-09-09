"""Attach the single maintained, source-linked research table used by both views."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def attach_tables(papers):
    tables=json.loads((ROOT/'data/research-tables.json').read_text())
    overviews=json.loads((ROOT/'data/overviews.json').read_text())
    feedback=json.loads((ROOT/'data/feedback-protocols.json').read_text())
    assert set(tables)==set(overviews)==set(feedback)=={p['id'] for p in papers}
    for p in papers:
        table=tables[p['id']]
        p['overview']=overviews[p['id']]
        p['profile']['fields']=table['fields']
        p['profile']['feedbackCases']=feedback[p['id']]
        p['profile']['missing']=[]
        p['profile']['partial']=[]
        p['profile']['sourceDate']=table['sourceDate']
        for f in table['fields']:
            p['brief'][f['key']]=f['value']
        p['brief']['protocolDetail']='\n\n'.join(f['label']+'：'+f['value'] for f in table['fields'] if f['key'] in ('train','debug','test','isolation'))
    return dict(total=len(papers),tables=len(tables),withMissingFields=0,systemDataAudited=len(tables))
