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

## Readable research tables (2026-09-09)

All 134 records use one maintained table in `data/research-tables.json`, shared by cards and detail pages. Each article starts with three source-linked TL;DR points: the authors’ stated research gap, the paper’s positioning, and its contribution/conclusion. The five visible dimensions then follow this order: evolving object, executor, modifier, feedback, initial harness. The disclosure contains the full table, including update/acceptance, training/evolution data, debugging/selection data, final evaluation, isolation, and distinctive contribution. Each row links to its primary-source location.

Paper omissions and conflicting protocols are stated as concrete evidence boundaries. A reported validation or adaptive score is not relabeled as a sealed test result. Historical notes remain downloadable and are not the current table's source of truth. This release focuses on the listed research dimensions; it is not an independent replication of the papers' experiments.

Edit `data/research-tables.json` for full research dimensions and citations. Maintain each paper’s three-point TL;DR and optional plain-language field summaries in `data/overviews.json`; summaries retain model identities and factual boundaries, while research-question numbers and internal notation belong in the full table. `scripts/research_tables.py` attaches it after historical imports, so older prose cannot overwrite current entries. Regenerate `data/papers.json` and run the checks before publishing.

## Maintain the catalog

- `data/research-notes.md`: original source document; preserved as supplied.
- `data/annotations.json`: curated category/tag corrections and protocol annotations for existing papers. Keys are stable paper IDs. Do not erase uncertainty in the original notes.
- `data/additions.json`: new papers with `sources` and `review` fields. Deduplicate by canonical paper URL before adding.
- `data/papers.json`: generated merged catalog; **do not edit directly**.
- `scripts/build_data.py`: imports all linked table records and attaches detailed note tables. Historical raw occurrences remain in the generated data for provenance.

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

## Research revision (2026-09-08)

Primary categories: Methods, Evaluation, Dataset, Theory. Methods have four subtypes: harness, artifact (no harness or weight update), model weights, and joint harness + weights. Core/Key, feedback, and evaluation isolation are independent facets. A joint-system design label is not evidence that multiple joint improvement generations have been demonstrated. Dataset currently has zero standalone entries.

`data/reviews.json` contains 27 revised research briefs, including 25 checks of primary-paper methods and experimental sections, with versioned sources. It is not a full-paper audit of all 134 entries. `scripts/enrich.py` owns the explicit taxonomy and merges these briefs; original notes remain unchanged for provenance. Historical notes are disclosed separately because some original descriptions have been corrected.

Cards expose the mechanism, novelty, actors and seed; expandable feedback chains separate correctness, diagnosis, editing and acceptance. Experiments have separate evolution, selection, test and isolation columns. Protocol conclusions are experiment-specific.

## Complete reading notes

`data/updated-research-notes.md` preserves the updated user-supplied file verbatim. `scripts/reading_notes.py` attaches its nine complete paper discussions, keeping the website taxonomy independent from document headings. Each includes research gap, method, experimental protocol, results, limitations and overall assessment. Cards introduce the paper and evidence; a full reading page has section navigation and a shareable paper URL. Other papers retain their structured records and existing detailed notes.

The AHE body/appendix reasoning-tier discrepancy and AI4AI validation/full-set count discrepancy are explicit annotations rather than silently resolved facts. Importing user notes is not represented as a new primary-source audit.

## Question-led profiles (2026-09-09)

All 134 entries now have twelve research questions, with recorded, partial, missing and not-applicable states. A recorded value is not a certification that every number has been checked. `data/coverage.json` lists remaining gaps; the site can filter by missing dimensions. Evaluation readers use assessment-specific questions rather than assuming every benchmark has a self-modifier.

`data/source-checks.json` records the scope and link for the primary-source positioning pass. This is targeted reading of abstracts, methods or experimental passages, not a claim of complete full-text audits. `data/dimension-updates.json` contains 17 focused supplements; `data/distinctions.json` replaces repeated category-level descriptions with mechanism-specific distinctions. `scripts/profiles.py` merges these layers after preserving the original and updated notes.

Continual Harness is now classified under joint harness/weight evolution because its co-learning experiment updates both; its frozen-model setting remains explicitly described. Methods with different protocols across experiments retain those differences instead of receiving a single unqualified held-out claim.

## 卡片说明写作口径

每篇默认按顺序展示：谁执行、谁来改、什么在进化、反馈是什么、基础 harness 是什么。完整专题解读也使用同一组卡片字段，全文保留。

`data/readability.json` 保存易读性修订，不覆盖原始笔记。角色要写清决策模型与实际运行程序；反馈要说明提供者、判断依据和可见内容，区分自测与正式评测。基础系统要说明来源、工具和运行流程；只有来源支持时才能写“没有某功能”，不能从记录缺失推断系统没有。自建数据在实验字段中交代任务内容、构造方式和隔离，不能只报数据集名字。概览不显示 RQ 编号或内部层级代号；原文未披露的信息以读者能理解的具体缺项说明，完整口径与出处留在表格中。

## Dataset and initial-harness audit (2026-09-09)

`data/system-data-audit.json` contains paper-specific revisions for all 134 entries: initial system components and editable boundaries, named evolution/selection/test datasets, and experiment-specific isolation caveats. Each entry links its primary source and section, records the source-text hash, and explicitly marks details still unverified. This targeted pass does not turn all entries into full-paper reviews. `scripts/profiles.py` gives this layer priority for the seed and protocol fields; the cards and full reading pages expose its source. Original notes remain unchanged. Rebuild with `python3 scripts/build.py`, then run `node scripts/check.js`.

概览和研究表的用语优先说明具体对象与操作。英文术语应改成可直接理解的中文，必要时附简短解释；文字技能说明与可执行程序必须明确区分，保留模型名、数据集名和原文来源。
