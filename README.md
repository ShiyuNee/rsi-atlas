# RSI Atlas

A research catalog for recursive self-improvement, especially **harness evolution**. Built from Shiyu Ni's research notes, with source-linked additions.

**Website:** https://shiyunee.github.io/rsi-atlas/  
**Research blog:** https://shiyunee.github.io/blogs/

## What you can explore

- 128 original papers, including 28 detailed records, plus 6 additions checked on 2026-09-08.
- Editable object, modifier, executor, seed harness, feedback, train/evolution data, model selection and test isolation.
- Category and tag filters, full-record search, publication date, priority and reading status.
- Shareable URLs for queries and individual paper records.
- The original Core / Key / Related distinction remains separate from evidence quality.

This is a research index, not a claim that every paper or experimental detail has been independently re-verified. Original notes are preserved verbatim. Additions identify the primary sources and review depth; unknown details remain explicit. Dates preserve the precision of the source, and new records use arXiv's first-submission date.

## Maintain the catalog

- `data/research-notes.md`: original source document; preserved as supplied.
- `data/annotations.json`: curated category/tag corrections and protocol annotations for existing papers. Keys are stable paper IDs. Do not erase uncertainty in the original notes.
- `data/additions.json`: new papers with `sources` and `review` fields. Deduplicate by canonical paper URL before adding.
- `data/papers.json`: generated merged catalog; **do not edit directly**.
- `scripts/build_data.py`: imports all linked table records and attaches detailed note tables. Raw occurrences remain available in every paper dialog.

Rebuild after changing annotations or additions:

```sh
python3 scripts/build_data.py
node scripts/check.js
```

Serve locally:

```sh
python3 -m http.server 8765
```

Open http://localhost:8765/. No npm install, external fonts, CDN, API key, database or backend is needed. `marked` is vendored with its MIT license and rendered HTML is allowlist-sanitized.

## GitHub Pages

The site uses relative asset paths and works at `/rsi-atlas/` or any other project path. Publish `main` from the repository root in **Settings → Pages**. `.nojekyll` ensures the static files are served directly. Push the regenerated `data/papers.json` along with source-data changes.

For other static hosts, `python3 scripts/build.py` creates `dist/`. Do not publish `.git` or runtime credentials.

## Additional research (2026-09-08)

- GEPA — reflective prompt evolution / Pareto candidate selection.
- HarnessEvolve — answer-conditioned reference trajectories and error localization; methods and experimental setup checked.
- HarnessLens — behavior-aware verification and attribution gates; split and budget details checked.
- One Recipe, Many Harnesses — what evolved harnesses encode across languages and models; abstract checked.
- S³Gym — self-testing, self-judging and feedback-to-improvement bottlenecks; abstract checked.
- Harness-of-Harness — artifact-improvement boundary case; abstract checked.

HarnessBank was already in the original notes under arXiv:2607.13683. The corresponding formal title was added without creating a duplicate record.

## Attribution

Source research notes: Shiyu Ni. Catalog inspiration and cross-index source: [Prism-Shadow/awesome-rsi](https://prism-shadow.github.io/awesome-rsi/). This project does not copy that site's implementation or visual assets. Papers and linked source material remain the property of their respective authors. Bundled third-party code retains its own license (`assets/marked-LICENSE.md`).
