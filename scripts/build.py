#!/usr/bin/env python3
"""Rebuild data and stage only public static assets. No third-party build dependencies."""
import shutil
from pathlib import Path
from build_data import build
root=Path(__file__).resolve().parents[1]
data=build()
assert data['originalCount']>0
assert len(data['papers'])==len({p['id'] for p in data['papers']})
assert len(data['papers'])==len({p['url'] for p in data['papers']})
assert all(p['title'] and p['date'] and p['fields'] for p in data['papers'])
out=root/'dist'
out.mkdir(exist_ok=True)
for name in ['index.html','.nojekyll']:
    shutil.copy2(root/name,out/name)
for name in ['assets','data']:
    shutil.copytree(root/name,out/name,dirs_exist_ok=True)
print('Static build ready: dist/')
