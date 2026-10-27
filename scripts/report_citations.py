"""Attach scoped report-use evidence, independently of priority and authorship."""
import json
from pathlib import Path
ROOT=Path(__file__).resolve().parents[1]
def attach_report_citations(output):
    audit=json.loads((ROOT/'data/report-citations.json').read_text())
    papers={p['id']:p for p in output['papers']}
    reports={r['id'] for r in audit['reports']}
    kinds={'adopted':'ReportAdopted','compared':'ReportCompared','cited':'ReportCited'}
    for e in audit['links']:
        assert e['paper'] in papers and e['report'] in reports
        assert e['sources'] and all(s['url'].startswith('https://') for s in e['sources'])
        p=papers[e['paper']]
        p.setdefault('reportEvidence',[]).append(e)
        tag=kinds[e['kind']]
        if tag not in p['tags']:p['tags'].append(tag)
    for p in papers.values():
        if not p.get('reportEvidence'):continue
        evidence=p['reportEvidence']
        p['profile']['fields'].append(dict(key='reportContext',label='技术报告中的使用记录',status='recorded',value='\n\n'.join(e['label']+'：'+e['value'] for e in evidence),sources=list({s['url']:s for e in evidence for s in e['sources']}.values())))
    output['reportCitationAudit']=audit
