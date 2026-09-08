# RSI / Harness Self-Evolution 论文调研记录

> 记录原则：高信息密度、低冗余；区分作者 claim、实验事实与评判。重点关注：什么在进化、谁来改/执行、feedback 来源、train/dev/test 或 evolution/eval split、人工标注使用、结果能否真正归因到 self-evolution，以及 story 与实验是否匹配。
>
> **组织规则**：先区分 **Harness Evolution** 与 **Non-Harness Self-Evolution / RSI**；每一部分内部按论文首次公开日期从早到晚排列。顶部索引固定记录 **执行者、修改者、Feedback、Train/Evolve Bench、Eval Bench、TL;DR**；Train/Evolve 与 Eval 必须注明是否为同一 benchmark / 同一 task subset。

## 论文索引

### A. Harness Evolution

| 时间 | 论文 | 执行者 | 修改者 | Feedback | Train / Evolve Bench | Eval Bench | TL;DR |
|---|---|---|---|---|---|---|---|
| 2026-03-30 | [Meta-Harness: End-to-End Optimization of Model Harnesses](https://arxiv.org/abs/2603.28052) | **Text classification**：GPT-OSS-120B + context/memory harness（seed：zero-shot / few-shot / ACE / MCE）<br>**Math retrieval**：搜索时 GPT-OSS-20B + BM25-based retrieval harness；最终同一 harness 还测 GPT-5.4-nano / GPT-5.4-mini / Gemini-3.1-Flash-Lite / Gemini-3-Flash<br>**TerminalBench-2**：Claude Opus 4.6 或 Haiku 4.5 + 从 Terminus 2 / Terminus-KIRA 出发演化的 coding harness | **Claude Opus 4.6 + Claude Code** coding-agent proposer | search-set score / pass rate + **完整 execution traces** + 历史 harness source | **Classification**：LawBench / Symptom2Disease / USPTO-50k 的 search split<br>**Math**：250 个 olympiad-difficulty search problems<br>**TerminalBench-2**：**同一 89 tasks** 直接用于 search | **Classification**：同三数据集 held-out test split<br>**Math**：200 个 unseen IMO-level problems；另做 cross-model transfer<br>**TerminalBench-2**：**仍是同一 89 tasks，无 held-out** | 直接搜索/重写 executable harness。前两个任务有 held-out test，但初始 harness 和 baseline 都较简单；TerminalBench 从成熟 harness 出发，却直接对最终 89 tasks 优化，因此还没有同时证明“成熟 harness 可持续改进 + held-out 泛化”。 |
| 2026-04-28 | [Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses](https://arxiv.org/abs/2604.25850) | **Terminal-Bench 2**：GPT-5.4 high + 当前 NexAU/AHE coding-agent harness；另做 SWE-bench-Verified frozen transfer 与跨模型 transfer | **GPT-5.4 xhigh Evolve Agent**；**GPT-5.4 Agent Debugger** 负责把 rollout 压缩成结构化 evidence；iteration 1 另有 Explore Agent 提炼外部 coding-agent knowledge | **task verifier pass/fail + 完整/分层 execution traces + 跨 iteration task-level outcome delta**；每次 edit 还声明 expected fixes / regressions | **Terminal-Bench 2 全部 89 tasks**，10 iterations，每 task 每轮 2 rollouts；直接在这 89 tasks 上反复 evolve | headline final score **仍是同一 TB2 89 tasks，无 held-out**；另有 **SWE-bench-Verified 500 tasks frozen cross-benchmark transfer**；cross-model transfer 仍在同一 TB2 tasks | 冻结 base model，直接进化完整 executable harness（prompt/tools/middleware/memory 等）。TB2 **69.7→77.0**，但主结果是同任务集 adaptive optimization；真正 held-out 的 SWE-bench-V 只 **+0.4pp**、token 约 **−12%**。收益主要来自 memory/tool/middleware，prompt-only 反而退化；还发现 component interference 与 regression blindness。 |
| 2026-08-05 | [Argus: A General-Purpose Agentic Reasoning Runtime for Long-Horizon Tasks](https://arxiv.org/abs/2608.05144) | **GPT-5.5 + Argus runtime**（不同任务接 Codex/Copilot 等 backend） | Argus 内部 **Planner / Engineer / Reviewer / Manager** 分权更新 persistent runtime state | execution evidence、task-native verifier、Reviewer judgment；material objective change 还需要 authority/user confirmation | **没有统一独立训练集**：SWE-Bench Pro 731 tasks 顺序执行并积累 state；SOL-ExecBench、nanochat B200/H100、nanoGPT speedrun、AARRI-Bench 也在任务执行过程中直接适应；Math data synthesis 有独立 dev | **同一批主 benchmark arenas**：SWE-Bench Pro、SOL-ExecBench、nanochat B200/H100、nanoGPT speedrun、AARRI-Bench；**Math synthesis 另有 held-out test** | 固定模型，通过 persistent memory/skill/verifier/routing/state 与 review gate 持续积累和修正 runtime state。完整 runtime 明显提升任务表现，但主 benchmark 多是 fixed objective，且大多没有独立 evolve→freeze→held-out protocol，缺 frozen-state / fixed-objective counterfactual，因此还不能干净归因到 self-evolution 或 objective pivot 本身。 |
| 2026-08-10 | [Macaron-V1: Towards Open Continual Learning with Self-Improvement and Mixture-of-LoRA](https://arxiv.org/abs/2608.09819) | **直接 RSI/Expansion 实验**：frozen GLM-5.2-FP8 base + 当前 HCP-carried harness/config；整体产品线另有 Venti（GLM-5.2 744B + 4 LoRA specialists）与 Tall（Qwen3.6-based 50B + adapters） | **MindForge / Expansion adaptive search loop** 修改 HCP-carried resources、task skills、tool exposure、hooks；论文未把该隔离实验归因给一个固定更强 builder model | official task reward + trajectory / configuration outcomes + HCP version/audit lineage | **TerminalBench 2.1 的 29 个 source families 中挑出的 122 个 frozen-base failure simulation tasks**；69 jobs / 450 attempts，adaptive search 直接针对仍未覆盖 tasks | **仍是同一 122-task failure slice**，报告 cumulative coverage；没有 frozen single-successor held-out task test。整体 Personal Intelligence / agent / coding / GenUI benchmark 不能当作该 Expansion 实验的因果 held-out eval | 系统目标是 versioned model–harness continual learning，但论文直接 RSI 证据只隔离 **frozen-model harness/config search**：adaptive search 覆盖 122/122 failure tasks，而最佳 single full-set config 仅 11/122；作者明确说这不是 full RSI training-cycle gain，也未验证跨代 compounding。 |
| 2026-08-12 | [AI4AI at Test-Time: Strong-to-Weak Capability Transfer via Harnesses](https://arxiv.org/abs/2608.12307) | 冻结的 target model，主实验为 **GPT-5.4-mini**，另测 Gemini-3.5-flash | 更强 builder model 通过 Cursor / Claude Code / Codex 等 builder-side harness 修改 scaffold | 约 **5% labeled validation**：accuracy + 错误样本的 **input / gold label / prediction** | BigToM / Hi-ToM / MMToM-QA / MuMA-ToM 中抽取 **195 个 labeled validation items（约 5%）** 反复优化 scaffold | 同四个 ToM benchmark 的 **3,900 个 hidden test items（约 95%）**；builder 在 evolution 时不可见 | 强 builder 根据显式 gold-error feedback 反复修改 executable scaffold，freeze 后在 95% hidden test 上评测；数据隔离很干净，但主 setting 是 strong-to-weak scaffolding，不是严格 self-RSI。 |
| 2026-08-15 | [Evo-Harness: Context-to-Harness Skill Compilation for Self-Evolving Agents](https://arxiv.org/abs/2608.15071) | 默认 **Claude Opus 4.6 + 当前 natural-language skill harness**；skill retrieval 用 Claude Sonnet 4.5 | 默认 **Claude Opus 4.6 reflector/evolver**：失败后读完整 trajectory + grounded feedback，生成 candidate skill，再做 ADD / MERGE / REVISE / SKIP | environment / verifier / test / rubric feedback + 完整 trajectory；比较 self-generated、minimal grounded、standard grounded feedback | 各 benchmark 以 **sequential online task stream** 运行：WebArena-Infinity 80、TerminalBench-2 89、SWE-bench Lite 300、CL-Bench 1,899、τ-bench 165；每 task one-shot，完成后才成为未来 experience | 主结果为同一 benchmark stream 上的 online/prequential evaluation；另有 **SWE train split → freeze skills → unseen test split** held-out transfer | 冻结模型，只进化 **natural-language skill harness**，不是完整 executable harness。**General / Topic skill 都只在单个 benchmark 内形成和使用**：General 是该 bench 内跨 task-type 的通用 procedure，Topic 是该 bench 内 recurring task type/domain/interface 的局部 procedure；**论文没有做跨 benchmark skill sharing/transfer**。Grounded feedback 才可靠，纯 self-feedback 会退化；SWE frozen transfer 68.8→73.4。 |

#### Evo-Harness: Context-to-Harness Skill Compilation for Self-Evolving Agents

- **链接**：https://arxiv.org/abs/2608.15071
- **时间**：2026-08-15
- **核心定位**：提出 **online harness learning**：solver 权重冻结，任务按 sequential stream 到来；每个 task 只执行一次，失败后把 trajectory + grounded feedback 编译成可复用 natural-language skills，更新外部 skill harness，只影响后续任务。

#### 1. 现有工作 Gap / 定位 / 贡献

| 项目 | 内容 |
|---|---|
| 现有工作 Gap | 直接保存完整 trajectory / episodic memory 容易混入 task-specific noise；很多经验学习方法偏 offline；同时既有工作常只报最终 gain，没有系统拆解 feedback、skill 粒度、solver/evolver pairing 对 evolution 的影响。 |
| 本文定位 | 将一次 execution context **compile 成 harness skill**，而不是直接 replay/retrieve 旧 trajectory；从失败中提炼可泛化 procedure，持续更新 external skill harness。 |
| 核心贡献 | ① General / Topic 两层 skill harness；② sequential one-shot online update；③ grounded feedback vs self-feedback；④ solver/evolver 能力与 transfer 分析；⑤ SWE train→test frozen-skill transfer。 |

#### 2. 方法与 Self-Evolution Setting

| 项目 | 内容 |
|---|---|
| 什么在进化 | **模型权重完全冻结**；进化的是外部 **natural-language skill harness**。没有修改 tool implementation、middleware、control flow 或 executable code，因此属于 **skill-level harness evolution**，不是 full executable harness evolution。 |
| 谁来执行 | 默认 **Claude Opus 4.6 + 当前 skill harness**。 |
| 谁来改 | 默认同为 **Claude Opus 4.6**：Reflector 读取失败 trajectory + feedback 生成 candidate skills；Evolver 做 `ADD / MERGE / REVISE / SKIP`。 |
| Skill retrieval | 每个 task 前由 **Claude Sonnet 4.5** 从当前 skill library 中选择 relevant skills 注入 solver。 |
| 更新频率 | 默认每 **16 tasks** 汇总/更新一次；skill 数量有预算限制。 |
| Feedback | 完整 execution trajectory + environment / executable verifier / unit test / rubric feedback；比较 self-generated、minimal grounded、standard grounded 三种 feedback。 |
| 成功轨迹是否更新 | 默认主要从 **failure** 中提炼 skill；failure 更直接暴露 capability gap。 |
| 方法本质 | **online/prequential skill-harness learning**：task $t$ 完成后的经验只能影响 $t+1$ 及之后的任务，不会回到 task $t$ 反复优化。 |

##### General skill 与 Topic skill：必须明确的范围

| 类型 | 论文里的范围 | 例子 / 直觉 |
|---|---|---|
| **General skill** | **单个 benchmark 内**跨多类 task 都可复用的通用 procedure / operational pattern | SWE-bench 中通用 debugging、读 failing assertion、targeted test、verification、recovery 流程 |
| **Topic skill** | **同一个 benchmark 内**针对 recurring task type / domain / interface 的局部 procedure / convention | SWE-bench 中 Django / SymPy 等 repo/domain convention；CL-Bench 中某类 rule system / output schema 的 local manual |
| **不是 case memory** | Topic skill 也不是某一道题的答案，而是从相似 case 中抽象出的可复用局部知识 | 目标仍是未来 unseen tasks 可用，而不是 replay exact solution |

> **General skill 和 Topic skill 都是在各自 benchmark 内形成和使用。论文没有实验“在 SWE-bench 学到 General skill，再拿到 WebArena / TerminalBench 使用”这种 cross-benchmark skill sharing / transfer。**  
> 因而这里的层级是：`具体 case → Topic skill（同 bench 内局部类型）→ General skill（同 bench 内跨 task-type 共性 procedure）`，不是 `case → benchmark skill → cross-benchmark universal skill`。

#### 3. 实验 / Benchmark / 数据与 Feedback

| Benchmark | Tasks | Feedback / verifier | Evolve → Eval protocol | 数据隔离判断 |
|---|---:|---|---|---|
| WebArena-Infinity | 80 | programmatic state verifier | sequential stream；每 task one-shot，做完后才用于未来 skill update | online/prequential，不重复优化已做 task |
| TerminalBench-2 | 89 | Docker / executable verifier | 同上 | 同上 |
| SWE-bench Lite | 300 | unit tests | 同上 | 同上 |
| CL-Bench | 1,899 | rubric judge | 同上 | 同上 |
| τ-bench | 165 | final DB state verifier | 同上 | 同上 |
| **SWE Train-Split Transfer** | train split → test split | SWE evaluator | train split 上 evolve → **freeze skills** → unseen test split | **真正 held-out transfer** |

> 主表不是传统 `train → freeze → held-out test`，但也不同于 Meta-Harness / AHE 对同一 tasks 反复 search：**每个 task 只做一次，反馈只能影响未来任务。**

#### 4. 主要结果与结论

| 结果 / 发现 | 实验依据 | 能支持的结论 |
|---|---|---|
| 5 个 benchmark 全部提升 | No-Evolve→Evo-Harness：CL-Bench **29.54→34.02**；TB2 **62.92→73.03**；SWE Lite **63.67→67.00**；τ-bench **72.73→76.97**；WebArena **72.50→76.25** | 从 sequential failures 中编译 skill 能提高后续任务表现；TB2 gain 最大。 |
| General / Topic 的有效性依 task 而异 | SWE：General Only **66.67** > Topic Only 64.33；CL：Topic Only **33.70** > General Only 30.28 | SWE 更依赖跨 task debugging procedure；CL 更依赖局部 task-type/rule manuals。 |
| **纯 self-generated feedback 会退化** | CL：29.54→**27.96**；SWE：63.67→**61.67** | 错误 reflection 会污染 persistent skill harness；self-evolution 不能只靠模型自判。 |
| Grounded feedback 才可靠，但不是越详细越好 | CL：Standard **34.02** > Minimal 29.86；SWE：Minimal **67.33** ≈/略高于 Standard 67.00 | feedback informativeness 与 over-specificity 存在 trade-off。 |
| Frozen skill 能泛化到 unseen tasks / 新 solver | SWE：No-Evolve **68.8**；Train-Split Transfer **73.4**；Online Updated **75.0** | 至少在 SWE 上存在真正 held-out procedural transfer。 |
| Skill benefit 受 solver 能力限制 | Opus solver 可从 same/cross-model evolver skill 获益；Sonnet solver 即使用更强 Opus evolver 的 skill 也会退化 | evolution 同时受 `experience→skill` 与 `skill→behavior realization` 两个瓶颈限制。 |

#### 5. 评判 / 缺点

| 问题 | 评判 |
|---|---|
| 是否属于 Harness Evolution | **属于。** solver frozen，external skill harness 随 experience 更新。 |
| 是否 full harness evolution | **不是。** Editable space 只有 natural-language procedural skills，没有 tools、middleware、workflow/code、sub-agent architecture。 |
| Main protocol 是否 test-set overfitting | 比重复 search 同一 test tasks 更干净：每 task one-shot、不会根据自己的 reward 回头重做；但整个 benchmark stream 同时承担 evaluation 与 experience source，仍不是标准 frozen held-out protocol。 |
| **Cross-benchmark 泛化** | **没有验证。** General / Topic skill 都在单个 benchmark 内定义和使用；不能把 “General” 理解成跨 SWE / WebArena / TB2 共用的 universal skill。 |
| Feedback 结论 | 最有价值的发现之一：grounded verifier/environment feedback 是 evolution work 的关键，self-feedback 甚至会形成负向 cumulative effect。 |
| Skill contamination | Persistent skill 一旦由错误 reflection 写入，可能长期伤害后续任务；论文结果直接观察到这种 regression。 |
| 对我们的启发 | 很适合研究 `Task × Model × Feedback × Editable Space`：失败可拆成 **feedback 不可靠、experience compilation 失败、solver 无法利用 skill**。 |

##### 总评

**Evo-Harness 是一篇相对干净的 skill-level Harness Self-Evolution 工作：模型冻结、任务 sequential one-shot，失败 trajectory 被 grounded feedback 驱动地编译成 General / Topic natural-language skills，只用于后续任务。它没有进化完整 executable harness，也没有跨 benchmark skill sharing；General 和 Topic 都只是“单个 benchmark 内”不同泛化粒度。论文最重要的结论是：grounded feedback 是 evolution work 的必要条件之一，纯 self-generated feedback 甚至会导致持续退化；同时 SWE train→test 的 frozen-skill transfer（68.8→73.4）说明至少部分 procedural skill 能真正泛化到 unseen tasks。**

---


## B. Non-Harness Self-Evolution / RSI

| 时间 | 论文 | 执行者 | 修改者 | Feedback | Train / Evolve Bench | Eval Bench | TL;DR |
|---|---|---|---|---|---|---|---|
| 2026-07-16 | [SEED: Self-Evolving On-Policy Distillation for Agentic Reinforcement Learning](https://arxiv.org/abs/2607.14777) | 当前 policy checkpoint 作为 agent 执行 ALFWorld / WebShop / Search QA 等任务 | 固定的 **GRPO + OPD training algorithm** 更新 policy weights；Stage 2 同一 checkpoint 还充当 trajectory analyzer | environment terminal reward / task outcome + 完整 trajectory；Stage 1 额外有 **GLM-5.2 hindsight-skill supervision** | **ALFWorld**：180-task SFT seed + 2,400 RL tasks<br>**WebShop**：180 + 2,400<br>**Search QA**：180 + 19,200；另有 Sokoban / EZPoints multimodal extension | **ALFWorld**：140 seen + 134 unseen test<br>**WebShop**：128 test<br>**Search QA**：51,713 eval questions；multimodal 也用 held-out eval | 当前 policy 自己 rollout、再分析 trajectory/outcome 生成 hindsight skill，并蒸馏回权重；held-out generalization 较规范，但 Stage 1 依赖外部 bootstrap，且没有直接证明 analyzer quality 随 checkpoint 持续变强，因此更像 model-level adaptive self-distillation，而非 harness RSI。 |
| 2026-07-28 | [RSIBench-Data: Benchmarking Data-Centric Research for Recursive Self-Improvement](https://arxiv.org/abs/2607.25886) | 固定 target **Qwen3.5-35B-A3B-Base** 的 candidate checkpoint | Claude Code / Codex + frontier LLM researcher 反复修改 **training-data strategy**，共享 Tinker backend 从同一 base 训练新 LoRA candidate | evaluation/selection **score、trajectory、verifier outcome、execution diagnostics**；由 evaluation GT/verifier 产生，但 protected label/trajectory 不能直接作为 supervision | **Evolution/selection tasks**：SWE-bench Verified 100、SWE-bench Multilingual 100、SWE-bench Pro 100、Terminal-Bench 2.0 **89/89**、GPQA Diamond 100、AIME 2026 **30/30**；researcher 另可利用对应 public seed data / synthetic data 生成训练集 | **Final official eval 仍使用完全相同的 task subset**；只是在 fresh environment 重新执行，**没有独立 held-out tasks** | 固定 post-training stack，只研究如何根据 checkpoint feedback 改训练数据。能偶尔发现更优策略但 peak 后常 regression，而且 selection 与 final eval 使用同一 task subset，因此更能说明面向固定 evaluation tasks 的 adaptive data optimization，而非已证明可泛化 RSI。 |
| 2026-08 | [BigBang: Pursuing Open-Ended Intelligence through Self-Evolving Synthesis of Verifiable Frontier Tasks](https://endlessfrontier.tech/assets/paper.pdf) | **BigBang-V1（由 Qwen3.6-35B-A3B post-train）+ task-specific agent/eval harness**；35B total / 3B active，256K context，trajectory 最多 500 tool calls | **Generator Agent** 直接修改/执行/debug data-synthesis code；**Critic Agent** 评估 generated tasks；**Meta-Critic** 用真实 training outcome 校准 critic 与 generation strategy | formal rules / computation / simulation / domain tools 等 verifiable feedback + Critic 的 correctness/verifiability/difficulty/scalability/diversity judgments + **held-out real research tasks 上的 downstream training effect** | evolving synthetic frontier tasks / synthesis programs；代表性 pipeline 生成的数据被用于训练 model variants，**held-out real research tasks 也进入 outer loop 用于 outcome calibration** | 最终 BigBang-V1 在 **9 个 benchmark suites / 11 个 rows** 上评测，覆盖 long-horizon search、coding、scientific research、AI research；其中部分是直接 targeted capability，部分作为 transfer | 这是 **data-level RSI**，不是 deployment harness evolution：generator–critic–meta-critic 持续改进 synthetic-task generation/evaluation，再 post-train model。BigBang 相对 Qwen3.6 base 在 11/11 rows 都提升、35B 组 9 项第一+1 项并列第一；但主表测的是完整 pipeline，generator/critic/meta-critic 贡献未分开，而且所谓 held-out real tasks 本身参与 outer-loop calibration。 |

---

## A. Harness Evolution

### Meta-Harness: End-to-End Optimization of Model Harnesses

- **链接**：https://arxiv.org/abs/2603.28052
- **时间**：2026-03-30
- **核心定位**：把完整 executable harness code 作为搜索对象，用 coding-agent proposer 基于历史 harness、score 和完整 execution traces 自动做 harness engineering。

#### 1. 现有工作 Gap / 定位 / 贡献

| 项目 | 内容 |
|---|---|
| 现有工作 Gap | Harness engineering 仍主要靠人工；现有 text optimizer 多只看当前 candidate、scalar score 或压缩后的短 summary，难对长 horizon harness 中“早期设计选择→后续失败”做 credit assignment。 |
| 本文定位 | 提出 **Meta-Harness**：把 harness 变成 executable code search space，让 agentic proposer 自己决定读哪些历史 code/trace、诊断什么 failure、做局部修改还是完整 rewrite。 |
| 核心贡献 | ① 搜索完整 harness program，而非只改 prompt；② 所有历史 candidate 的 source code、scores、execution traces 通过 filesystem 暴露给 proposer；③ proposer 自主检索历史并修改代码；④ 用 population + Pareto frontier 保留候选，在 text classification、math retrieval、TerminalBench-2 三类任务上验证。 |

#### 2. 方法与 Self-Evolution Setting

| 项目 | 内容 |
|---|---|
| 什么在进化 | **模型权重固定**；进化的是 task-specific executable harness，包括 prompt construction、retrieval、memory/state update、orchestration/control flow 等。 |
| 谁来改 | **Claude Code + Claude Opus 4.6** 作为 coding-agent proposer。 |
| 谁来执行 | 每个 domain 的固定 base model 执行 candidate harness；base model 不训练。 |
| 修改时能看到什么 | filesystem 中**所有历史 candidate 的 source code、evaluation scores、execution traces**（prompt、tool call、model output、state update 等）；proposer 用 grep/cat 等工具按需读取，而不是把历史压进一个 prompt。 |
| Feedback | search-set task reward/accuracy/pass rate + 完整 rollout traces；没有独立人工 improvement feedback。 |
| Search | 反复 `inspect history → propose harness → evaluate → log`；维护 population/Pareto frontier，但不规定 parent-selection rule，proposer 可读任意历史 candidate。 |
| 方法本质 | **固定模型上的 outer-loop harness code search**；不是 model-weight RSI。 |

#### 3. 实验 / Benchmark / 数据与 Feedback

| Benchmark | 执行者：模型 + harness | Evolution feedback | Search → Final Eval | 人工标注 / GT |
|---|---|---|---|---|
| Online text classification：LawBench / Symptom2Disease / USPTO-50k | GPT-OSS-120B + candidate context/memory harness | search-set accuracy + traces；20 iterations × 2 candidates | **Search set → held-out test set**；test 直到最终 evaluation 才使用 | search-set label 用于自动 accuracy feedback；test label 不进入 search |
| Retrieval-augmented math reasoning | Search 时 GPT-OSS-20B + candidate retrieval harness | 250 个 olympiad-difficulty search problems 上的 accuracy + traces | **250 search problems → 200 previously unseen IMO-level problems**；同一 harness 还测 4 个 search 时未见过的模型 | correctness 用于 search reward；held-out problems 不进入 search |
| TerminalBench-2 | Claude Opus 4.6 / Haiku 4.5 + candidate agentic harness；从 Terminus 2 / Terminus-KIRA 强 baseline 出发 | 89 tasks 的 verifier/pass rate +完整 traces | **Search 和 final evaluation 都直接使用同一 89-task benchmark** | task-native verifier；没有独立 held-out task |

#### 4. 主要结果与结论

| 结果 / 发现 | 实验依据 | 能支持的结论 |
|---|---|---|
| 完整 trace/history interface 显著优于压缩 feedback | text-classification search-set：Meta-Harness median/best **50.0/56.7**；scores-only 约 **34.6/41.3**，scores+summary 约 **34.9/38.7** | 在该 setting 下，raw execution traces 对 harness optimization 很关键，scalar/summary 丢失诊断信息 |
| Classification harness 优于现有 context-management baseline | held-out test avg **48.6%**；ACE 40.9%，MCE 40.0%；context 11.4K vs ACE 50.8K | 搜出的 context/memory policy 可在 held-out classification test 上提升 accuracy/context tradeoff |
| Math harness 对任务和模型都有迁移 | 200 unseen IMO-level problems 上，5 个模型相对 no-retrieval 平均 **+4.7 pt**；其中 4 个模型 search 时未见 | 说明至少该 retrieval policy 不只是拟合 search problems 或单一 target model |
| TerminalBench-2 能从成熟 harness 继续搜到提升 | Opus-4.6：**76.4%**；Haiku-4.5：**37.6%**，均超过文中主要 hand-engineered comparison | 自动 harness code search 能在成熟 agentic coding setting 中找到有效改动 |
| Proposer 会利用历史失败形成修改假设 | TerminalBench trajectory 中先因 prompt+structural edits regression，后隔离变量并转向 safer additive modification | 提供 qualitative evidence：proposer 会基于 trace 做 diagnosis，而不是纯随机 mutation |

#### 5. 评判 / 缺点

| 问题 | 评判 |
|---|---|
| Story 与实验匹配 | **整体匹配。** 真正搜索的是 executable harness code，proposer 也确实能访问完整历史 code+trace，区别于 prompt-only optimization。 |
| 前两个 benchmark 的关键限制 | **初始 harness 很简单**，主要从基础 prompt/context/memory/retrieval 方案开始搜索；对比 baseline 也主要是较简单的 prompt/context optimization 方法。因此虽然这两个 setting 有较干净的 held-out test，**但从简单 harness 搜到明显提升相对容易**，不能据此说明 Meta-Harness 已经能稳定改进成熟、复杂的 agent harness。 |
| TerminalBench 的关键问题 | 虽然从 **Terminus / Terminus-KIRA 等成熟 harness** 出发，更能说明在强 baseline 上还能搜到有效改动；但作者明确 **search 和 final eval 都在同一 89 tasks 上**，因此主要证明“针对这批公开任务能自动搜出更好的 harness”，不能证明得到的是可泛化的 harness improvement。 |
| 数据隔离不统一 | 前两个 setting 有较干净 held-out test；TerminalBench 没有。横向汇总时不能把三个 benchmark 的泛化证据等量看待。 |
| Self-RSI 口径 | proposer 是更强的 Claude Opus 4.6 + Claude Code，base executor 固定；本质上是 **cross-system automated harness engineering**，不是执行者自身递归改进自己。 |
| 归因 | full-trace interface 有 ablation，是较干净的机制证据；但最终 harness 内部可能同时改变 prompt、retrieval、state/control flow，最终性能提升未逐组件因果拆开。 |

##### 总评

**Meta-Harness 的核心价值是把完整 executable harness 变成可搜索对象，并让强 coding agent 直接读取所有历史 code、score 和 execution trace 后修改 harness。前两个任务有较干净的 held-out 泛化证据，但初始 harness 和主要 baseline 都较简单，因此提升相对容易获得；TerminalBench-2 则从成熟 harness 出发，更能说明在强 baseline 上还能搜到有效改动，但它直接对最终 89 个任务优化。综合来看，论文证明了 automated harness search 有效，但还没有同时满足“从成熟 harness 出发 + 独立 held-out task 验证”的最强证据。**

---

---

### Agentic Harness Engineering: Observability-Driven Automatic Evolution of Coding-Agent Harnesses

- **链接**：https://arxiv.org/abs/2604.25850
- **时间**：2026-04-28
- **核心定位**：冻结 base model，把完整 executable coding-agent harness 作为进化对象；通过 **Component / Experience / Decision Observability**，让 harness 修改可定位、可验证、可回滚。

#### 1. 现有工作 Gap / 定位 / 贡献

| 项目 | 内容 |
|---|---|
| 现有工作 Gap | Coding-agent performance 很大程度取决于 system prompt、tools、middleware、memory 等 harness design，但这些仍主要靠人工工程；已有自动优化多只改 prompt、skill、workflow 等单个 surface。完整 harness evolution 还面临 **trajectory 过长、组件耦合、修改效果难归因** 等问题。 |
| 本文定位 | 将核心瓶颈定位为 **observability**：modifier 需要知道 **可以改什么、发生了什么、某次修改是否真的产生了预期效果**，而不是仅给一个 scalar reward 后让模型盲目搜索。 |
| 核心贡献 | 提出 **AHE**：① Component Observability，把 harness 拆成可独立编辑的组件；② Experience Observability，把长 rollout 压缩成 per-task diagnosis / benchmark overview，同时保留 raw trace；③ Decision Observability，每次 edit 显式记录 evidence、root cause、expected fixes / regressions，并在下一轮验证、必要时 rollback。 |

#### 2. 方法与 Self-Evolution Setting

| 项目 | 内容 |
|---|---|
| 什么在进化 | **模型权重完全冻结**；可编辑对象覆盖 system prompt、tool description、tool implementation、middleware、skills、sub-agent configuration、long-term memory 等 **executable / persistent harness components**。 |
| 谁来执行 | **GPT-5.4 high + 当前 NexAU/AHE coding-agent harness**。 |
| 谁来改 | **GPT-5.4 xhigh Evolve Agent + evolution harness/skills**；另有 **GPT-5.4 Agent Debugger** 负责把任务 rollout 组织成可用 evidence。三者属于同一模型 family，但 role / harness 不同。 |
| 修改者能看到什么 | benchmark overview、per-task failure/success diagnosis；需要时可 drill down 到 cleaned/raw trajectories；还可看到 task verifier reward、历史 edit manifest 与跨轮 task-level performance delta。 |
| Feedback | **自动 feedback**：task verifier pass/fail + execution trajectory + previous-edit outcome delta；没有运行时人工 improvement feedback。 |
| 修改约束 | verifier、tracer、LLM config 等不属于可编辑 harness；不能通过换更强模型、增加 reasoning budget、关闭 verifier 等方式涨分。 |
| 外部先验 | iteration 1 有一次性 **Explore Agent**，会从 NexAU source 与公开 coding-agent references 中提炼 reusable evolution skills。因此不是完全 closed-world、只靠自身 rollout 的 self-evolution。 |
| 方法本质 | **frozen-model full-harness search / evolution**；模型能力不通过 weight update 改变，而通过外部 adaptation surface 持续修改。 |

##### 三层 Observability

| 层 | 做法 | 作用 |
|---|---|---|
| Component Observability | prompt / tools / middleware / skills / memory 等拆成独立组件；logical edit 单独 git commit | 明确“改了什么”，便于组件级 attribution 与 rollback |
| Experience Observability | Agent Debugger 将百万 token 级 rollout 分层压缩成 per-task diagnosis → benchmark overview，同时保留 raw trace | 从长 trajectory 中提炼 actionable failure / success evidence |
| Decision Observability | 每次 edit 保存 `evidence → root cause → proposed fix → expected fixes / regressions` | 把修改变成可证伪 hypothesis，下一轮直接用 task outcome 验证 |

#### 3. 实验 / Benchmark / 数据与 Feedback

| Benchmark / 实验 | 执行者：模型 + harness | Feedback / verifier | Train / Evolve → Eval | 人工标注 / GT |
|---|---|---|---|---|
| **Terminal-Bench 2 主 evolution** | **GPT-5.4 high + 当前 NexAU/AHE harness** | 官方 task verifier + 完整 trajectory；Debugger 生成 diagnosis；Evolver 读取跨轮 task delta | **同一完整 89 tasks 上做 10 轮 evolution，每轮每 task 2 rollouts；headline 77.0 仍在这 89 tasks 上报告** | 无运行时人工 feedback；自动 verifier 提供结果 |
| **SWE-bench-Verified frozen transfer** | **GPT-5.4 + 在 TB2 上 evolve 后冻结的 AHE harness** | SWE-bench official tests / evaluator | **Evolve：TB2 89 tasks → Eval：SWE-bench-V 500 tasks**；真正 cross-benchmark held-out | 无 |
| **Cross-model transfer** | evolved harness 分别换给 GPT-5.4 medium/xhigh、Gemini-3.1-flash-lite-preview、Qwen-3.6-plus、DeepSeek-v4-flash | TB2 verifier | harness 在 GPT-5.4 high + TB2 上 evolve；换模型后仍测试 **同一 TB2 89 tasks** | 无 |

#### 4. 主要结果与结论

| 结果 / 发现 | 实验依据 | 能支持的结论 |
|---|---|---|
| 完整 harness evolution 能显著提高目标任务集表现 | TB2：NexAU seed **69.7 → AHE 77.0**；Codex 71.9，ACE 68.9，TF-GRPO 72.3 | 在固定 TB2 任务集上，冻结 GPT-5.4 权重、仅改 harness 可以搜索到更高性能配置；**但这不是 held-out task generalization 证据**。 |
| 收益主要来自 executable / persistent components，而非 prompt | 单组件 transplant：memory-only **75.3**，tool-only **73.0**，middleware-only **71.9**，system-prompt-only **67.4**，full AHE **77.0** | Full-harness evolution 的收益不等同于 prompt optimization；memory、tools、middleware 是主要正向来源。 |
| 组件存在 interaction / interference | 正向单组件 gain 不能线性叠加；部分 hard tasks 上 memory-only 甚至优于 full AHE，重复 verification/check 会消耗 step budget | Harness evolution 不只是“各组件分别变好”，**component coupling / interference** 本身就是关键变量。 |
| Cross-benchmark transfer 有限但存在 | SWE-bench-V：seed **75.2 → AHE 75.6**；tokens **526k → 461k** | 真正 held-out 的 performance gain 只有 **+0.4pp**，更明显的 transfer 是约 **12% token reduction**；不能表述成“大幅跨 benchmark 提升”。 |
| Harness 可跨模型迁移 | TB2 上换到多个 model family 后均有正 gain，部分弱模型约 +5～10pp | evolved harness 包含一定 model-agnostic coordination pattern；但 task 与 evolve set 相同，因此不是 task generalization。 |
| Modifier 存在明显 regression blindness | Fix prediction precision/recall **33.7% / 51.4%**；Regression prediction **11.8% / 11.1%**，虽高于 random 但明显更弱 | Evolve Agent 有一定 self-attribution 能力，但更会预测“会修好什么”，不擅长预测 collateral damage。 |

#### 5. 评判 / 缺点

| 问题 | 评判 |
|---|---|
| **主结果 train/eval 同集** | 最核心的 **69.7→77.0** 是直接在 Terminal-Bench 2 完整 89 tasks 上反复执行、修改、再选择 best harness；**没有 task-level held-out split**。因此主要证明针对这批 tasks 的 adaptive harness optimization。 |
| Held-out 泛化证据强度有限 | SWE-bench-V 是真正 frozen cross-benchmark transfer，但 accuracy 仅 **+0.4pp**；更明显的是 token efficiency。因此它补充了泛化证据，但远弱于 headline TB2 gain。 |
| Self-evolution 不是纯 closed-world | 初始 Explore Agent 会读取公开 coding-agent references 与 NexAU source，将外部 human-engineered prior 注入 evolution skills；不能把全部提升解释为只从自身失败经验中产生新能力。 |
| “Observability 是核心瓶颈”仍缺完全正交验证 | Debugger、结构化 evidence、manifest、rollback 等机制一起加入；虽然 edit attribution 很有价值，但缺三层 observability 的完整独立因果拆解。 |
| 对副作用感知弱 | regression prediction 显著弱于 fix prediction，说明当前 evolution loop 更擅长寻找 improvement，较难提前发现 collateral damage。 |
| 能力上限 | 证明固定模型仅改 harness 可提高目标任务集成绩，并有一定 transfer；但**没有严格证明超过该 base model 在充分强人工 / oracle harness 下的能力上限**。 |
| 与我们的关系 | 这是非常直接的 Harness Self-Evolution 前驱：它已经研究 edit-level task regression，但“副作用”仍只看 benchmark pass/fail，没有系统测 **confidence/calibration、长度、bias、拒答、judge gaming 等行为偏移**；也没有系统测 harness evolution 的 capability ceiling。 |

##### 总评

**AHE 是很典型的 Harness Self-Evolution：base model 冻结，完整 executable harness（prompt、tools、middleware、memory 等）直接成为修改对象；GPT-5.4 Code Agent 产生带 verifier reward 的 rollout，Debugger 将长轨迹压缩为结构化 evidence，Evolve Agent 再修改 harness，并通过下一轮 task delta 验证 / rollback。最重要的实证是收益主要来自 memory、tools、middleware，而不是 prompt，同时出现 component interference 与 regression blindness。最大问题是 headline TB2 结果直接在同一 89 tasks 上 evolve 和 eval；真正 held-out 的 SWE-bench transfer 只有轻微 accuracy gain。因此它较强地证明“针对固定任务集可以自动搜出更好 harness”，但对通用 harness capability improvement 的证明仍有限。**

---

---

### Argus: A General-Purpose Agentic Reasoning Runtime for Long-Horizon Tasks

- **链接**：https://arxiv.org/abs/2608.05144
- **时间**：2026-08-05
- **核心定位**：固定模型下的 verification-gated persistent runtime / harness-state evolution。

#### 1. 现有工作 Gap / 定位 / 贡献

| 项目 | 内容 |
|---|---|
| 现有工作 Gap | 现有 self-improvement 多依赖固定、dense、快速的 objective/evaluator；真实 long-horizon research 中 objective、constraint、verifier 本身可能随 evidence 逐渐明确。长期运行还面临跨 session 状态丢失、执行者 self-certification、失败经验无法复用等问题。 |
| 本文定位 | 提出 **Argus**：固定模型的 long-horizon agent runtime，用 durable state + role separation + verification gate 支持持续执行、回滚和 **verified pivoting**。稳定的是 user intent，operational objective / constraint / verifier 可基于证据 refinement。 |
| 核心贡献 | ① Manager–Planner–Engineer–Reviewer 分权；② 将 memory、skills、verifiers、routing、rejected routes、operational contract 等作为可持久化 runtime state；③ candidate update 必须经过 evidence/authority gate 后才能 commit；④ 在 7 个 benchmark 和 long-horizon research cases 中验证通用执行、review/revision、persistent state 与 objective pivot。 |

#### 2. 方法与 Self-Evolution Setting

| 项目 | 内容 |
|---|---|
| 核心流程 | **Manager → Planner → Engineer ↔ Reviewer → Manager**。Planner 拆 bounded mission；Engineer 实际调用工具/改代码/跑实验；Reviewer 检查真实 artifact + execution evidence，输出 `done / continue / blocked`；必要时返工、rollback 或 pivot。 |
| 什么在进化 | **模型权重不变**；变化的是 memory、skills、knowledge、verifier guidance、routing、失败路线、task/evaluation definition，以及可 refinement 的 operational objective/constraint。大框架 Manager–Planner–Engineer–Reviewer 本身基本固定，不是直接重写完整 harness source。 |
| 谁来改 | 同一 Argus runtime 中的 Planner / Engineer / Reviewer / Manager 分权更新不同 state；没有独立更强 proposer。 |
| 修改时能看到什么 | 当前 durable project state、execution trajectory、artifact、review/evaluation evidence、历史 accepted/rejected state。 |
| Feedback | 同模型 Reviewer + task-native executable/quantitative evidence；material objective change 需要对应 authority/user confirmation。 |
| Evolution 口径 | 只有 `candidate → verify → authorized commit → later reuse` 才算 self-evolution；单纯 reflection 不算。 |
| 方法本质 | **test-time agentic scaling + 跨 mission persistent harness-state adaptation**，而非模型训练式 self-improvement。 |

#### 3. 实验 / Benchmark / 数据与 Feedback

| Benchmark | 任务 | 执行者：模型 + harness | Feedback / verifier | Evolution / Train → Test | 人工标注 / feedback |
|---|---|---|---|---|---|
| SWE-Bench Pro | 731 个真实 repo issue，修改 production code | **GPT-5.5/xhigh + Argus；Copilot backend** | Argus Reviewer / execution evidence；最终 official executable verifier 判分 | **无独立 evolve-train → freeze → held-out test**；731 个任务顺序执行并积累 state；无 frozen-state matched replay | **无 gold patch / 正确答案作为迭代 feedback**；benchmark test 只用于最终验证 |
| SOL-ExecBench | GPU kernel correctness + speed optimization | **GPT-5.5 + Argus；Codex** | kernel correctness + 实际运行性能 / SOL score | 直接在 optimization tasks 上执行；无独立 harness train/test split | 无人工 improvement feedback |
| nanochat B200 | 1×B200、5 min 内优化 LM training program，使 validation BPB 越低越好 | **GPT-5.5 + Argus；Codex** | 实际训练得到的 validation BPB | 直接反复修改→训练→测 BPB | 无 |
| nanochat H100 | 同上，换 1×H100 | **GPT-5.5 + Argus；Codex** | validation BPB | 同上 | 无 |
| nanoGPT speedrun | 8×H100 上尽快达到固定 validation loss=3.28 | **GPT-5.5 + Argus；Codex** | validation loss + 达到目标所需时间 | 直接针对固定目标优化 | 无 |
| AARRI-Bench | 82 个 research-intern 任务，测试科研 workflow/judgment | **GPT-5.5 + Argus；Codex** | 每题人工预先编写的 deterministic tests / pattern matching，最终 0/1 pass | Argus 直接跑 evaluation tasks；无独立 evolution split | **有人类预先定义正确行为并写 tests**，但无运行时人工 improvement feedback |
| Math-Reasoning Data Synthesis | 生成 AIME-style 数学题，使题目 first attempt 难、更多 attempts 可解 | **GPT-5.5 + Argus；Codex** | validity/novelty/consistency filters + 固定 GPT-5.5 solver；优化 `pass@4-pass@1` | **有 dev/test split**：dev 上迭代，held-out test 做最终验证 | 无人工逐轮 feedback；数学正确性主要依赖自动 consistency/solver proxy，不是 formal proof |

#### 4. 主要结果与结论

| 结果 / 发现 | 实验依据 | 真正能支持的结论 |
|---|---|---|
| 完整 Argus runtime 能显著提高 task performance | SWE-Bench Pro **≈78% vs Direct Copilot ≈59%**；Argus 用 **1.41× aggregate tokens** | planning/review/revision/persistent runtime 整体有效，但无法区分各组件贡献，也不能排除更多 test-time compute 的作用 |
| Reviewer 能救回部分失败 trajectory | 43 个任务被要求 revise，34 个后来通过 official verifier；22 个满足严格 `continue→revision→done` rescue | review/revision loop 确实改变了 trajectory 并产生 recoveries |
| 同一 runtime 跨任务类型可工作 | SWE repair、kernel、training optimization、research、data synthesis 等 7 个 arena 均取得较强结果 | 支持 Argus 作为 general-purpose runtime，而非单 benchmark workflow |
| persistent state 可能降低后续执行成本 | SWE mature waves 相比 startup：solve-input token/task **−21%**，active time/task **−15%** | 与经验复用一致，但只是 observational evidence，不能因果归因于 state evolution |
| objective / success contract 可以随 evidence pivot | 数学 campaign、6 个 paper campaigns；典型项目连续 no-go 后从 positive method search 转为 negative-results audit | 展示 **verified objective refinement 可以发生并持续推进**；但没有证明允许 pivot 比 fixed-objective 更好 |

#### 5. 评判 / 缺点

| 问题 | 评判 |
|---|---|
| **Story 与主实验错位** | 论文最强调 **underdefined objective / verified pivoting**，但 7 个主 benchmark 大多是 **fixed objective + 明确 verifier**。这些 benchmark 能证明 runtime 强，**不能说明“可修改 objective”带来性能提升**；真正对应该 claim 的主要是 long-horizon case studies。 |
| Objective revision 缺直接 ablation | 没有 `pivot-enabled vs fixed-objective` controlled comparison，也没有统计 benchmark 中 objective revision 的频率及其 performance gain；因此只证明“能 pivot”，没证明“pivot 有益”。 |
| Self-evolution 缺因果验证 | SWE 的 startup→mature token/time 改善没有 `evolved state vs frozen initial state` matched-task replay；task composition/difficulty 同时变化，因此不能证明 persistent evolution 本身提升 capability。 |
| 提升归因不干净 | SWE 78% vs 59% 同时引入 planning、Reviewer、多轮 revision、persistent state 和 **1.41× token**，缺组件级 ablation，无法判断主要收益来自 evolution 还是普通 test-time scaling。 |
| 数据隔离有限 | SWE 的 state accumulation 发生在 731-task evaluation sequence 上，不是先独立 evolve 后 freeze 再在 held-out tasks 测泛化；Math synthesis 的 dev/test 设计相对更干净。 |
| 能力上限 | 论文证明完整 runtime 能提高平均任务表现和长期执行能力，但**没有证明 evolved harness state 突破 initial model/harness 的能力上限**。 |

##### 总评

**Argus 的亮点是把 persistent harness evolution 的对象与治理机制做得很完整：不仅积累成功 memory/skill，也保留失败路线，并允许 evidence-backed objective refinement。其主 benchmark 较强地证明了完整 runtime 和 review/revision loop 有用；但论文最有特色的 objective pivot 主要由 case study 支撑，同时缺少 frozen-state、fixed-objective 等关键 counterfactual，因此还不能严格证明“self-evolution / objective revision 本身导致 capability improvement”。**

---

---

### Macaron-V1: Towards Open Continual Learning with Self-Improvement and Mixture-of-LoRA

- **链接**：https://arxiv.org/abs/2608.09819
- **时间**：2026-08-10
- **核心定位**：把 post-deployment adaptation 组织成 **versioned model–harness pair** 的 successor construction，并用 Mixture-of-LoRA 承载可分离 specialist updates；但论文直接隔离验证的 RSI 实验只覆盖 **frozen-model harness/configuration Expansion**。

#### 1. 现有工作 Gap / 定位 / 贡献

| 项目 | 内容 |
|---|---|
| 现有工作 Gap | 部署后的 agent/model 需要从真实 experience 中持续学习，但完整 weight update 成本高、容易产生 interference；同时 model update、harness/config update、trajectory/data/eval 往往缺少统一 version lineage，难判断 successor 到底改了什么。 |
| 本文定位 | 将 adaptation 定义为 **versioned model–harness pairs 的 recursive improvement**；model 侧通过 Mixture-of-LoRA（MoL）维护可扩展 specialist adapters，harness 侧通过 Harness Context Protocol（HCP）把 prompts、skills、tools、hooks、sessions、workspace 等变成可版本化、可审计配置。 |
| 核心贡献 | ① MoL：冻结大 base、每个 user turn 路由一个 specialist LoRA；② Model–Harness Co-design + HCP；③ MindForge 三阶段 `Discovery → Expansion → Update` RSI lifecycle；④ 用 122 个 base-failure tasks 隔离测试 Expansion/configuration-search 能力。 |

#### 2. 方法与 Self-Evolution Setting

| 项目 | 内容 |
|---|---|
| 设计上什么在进化 | **Model–harness pair**。Model 侧可产生新的 specialist LoRA revision；harness 侧可修改 HCP-carried prompts、skills、tool exposure、hooks、workspace/session resources。HCP 协议本身不是 gradient-updated object，而是 versioned boundary。 |
| MoL / 执行结构 | Base model 冻结；多个 specialist LoRA 分别承载 chat、agent、coding、GenUI 等能力，每个 user turn 选择一个 adapter。Venti 为 GLM-5.2 744B base + 4 LoRAs；Tall 为 Qwen3.6-based 50B + adapters。 |
| RSI 三阶段 | **Discovery** 找 failure / opportunity；**Expansion** 在 language/configuration space 搜有效 behavior；**Update** 把选中的 trajectories 转成新的 adapter revision，并与对应 HCP configuration / evaluation artifact 绑定。 |
| 谁来改 | 论文把 **MindForge / Expansion search** 作为 lifecycle/orchestration mechanism；在直接隔离实验中，不把修改归因于一个固定更强 external builder，而是持续修改 HCP-carried resources、skills、tool exposure、hooks。 |
| Feedback | official task reward + trajectory / configuration outcomes；trajectory selection 要求通过 evaluator、能归因到目标 task/config，并保留 HCP / adapter / data / eval lineage。 |
| **直接 RSI 实验实际改什么** | **只改 harness/configuration。** 论文明确写明 model frozen、全程 **no optimizer step**；因此这组实验证明的是 configuration search，不是 model–harness pair 的完整联合更新。 |
| 方法本质 | 系统设计属于 **model–harness continual-learning architecture**；当前最直接可归因的 RSI evidence 则属于 **frozen-model harness evolution**。 |

#### 3. 实验 / Benchmark / 数据与 Feedback

| 实验 | 执行者：模型 + harness | Feedback | Train / Evolve → Eval | 人工标注 / GT |
|---|---|---|---|---|
| **RSI Expansion coverage study** | **Frozen GLM-5.2-FP8 base + 当前 HCP-carried harness/config** | TerminalBench official reward + execution/config outcomes | 从 TerminalBench 2.1 的 **29 个 source families** 中选出 frozen base 全部 not-pass 的 **122 simulation tasks**；69 chronological jobs、450 attempts；adaptive search 持续针对未覆盖 tasks。**Coverage 仍在同一 122 tasks 上统计，无 held-out task split。** | 依赖 official reward；论文没有把该 experiment 描述为人工逐轮 improvement feedback |
| Overall Macaron model-family evaluation | Venti / Tall model–harness systems | 各 benchmark official / reproduced evaluation protocol | Personal Intelligence、agent、coding、GenUI、general capability 等 broad evaluation | 这些结果验证当前 model family / harness design，但**不能用来隔离 Expansion 自进化的因果贡献** |

> **关键数据隔离口径**：122 tasks 是故意选出的 **base-failure slice**；adaptive search 会根据“哪些任务还没被覆盖”决定下一轮 target，因此 `122/122` 是 search coverage ceiling，不是一个 frozen successor 在 unseen tasks 上的 generalization accuracy。

#### 4. 主要结果与结论

| 结果 / 发现 | 实验依据 | 真正能支持的结论 |
|---|---|---|
| Frozen model 的能力可被不同 harness/config 大量“激活” | 69 jobs / 450 attempts 后 cumulative unique coverage 达 **122/122**；每个 task 至少在某个 configuration 下 pass 一次 | baseline failure 不等于 frozen model 完全没有该行为；harness/configuration 对 capability elicitation 有很大影响。 |
| 单一 global configuration 远远不够 | 两次 full-set single-configuration sweep 分别 **4/122** 与 **11/122**；adaptive search 最终 122/122 | 异质 failure 更适合 targeted configuration search，而不是寻找一个万能 config。 |
| 后期 search yield 明显提高，但不能直接归因给某个 hook | Skill/HCP search pooled pass **64.5%**；最后 `+ stop-gate hooks` 阶段 **81.2%** | Search trajectory 越来越有效；但论文明确指出 task mix、targeting policy、harness-error rate 同时变化，因此不能把阶段差简单解释成某个 component 的 causal effect。 |
| **没有验证 Expansion→adapter Update 的 transfer** | 论文明确说明本实验没有执行后续 $\phi$/adapter update | 122/122 **不是** full RSI training-cycle capability gain，也不证明搜出的 behavior 被稳定写入下一代 model。 |
| 多代 continual learning 仍未证明 | Abstract / discussion 明确将 **compounding gains from continual learning** 留作 open question | Macaron 更像搭好了 recursive continual-learning substrate，而不是已经展示稳定 generation-to-generation compounding。 |

#### 5. 评判 / 缺点

| 问题 | 评判 |
|---|---|
| **Story 与直接实验的距离** | 论文整体 story 是 `versioned model–harness pair → next model–harness pair`；但最直接 RSI experiment **只测 Expansion**，model frozen、没有 optimizer step。不能把 122/122 写成完整 model–harness recursive improvement 的实证。 |
| **Train/Eval 同集** | Adaptive search 和 coverage 都发生在同一 122 个 selected failure tasks；而且 search 明确知道哪些 tasks 仍未覆盖。它证明“针对这些 failure 可以搜到有效 config”，不是 unseen-task generalization。 |
| **Coverage ≠ 一个更强 successor** | 122/122 可以来自 122 个 task 各自不同的 configuration；不存在“一个最终统一 harness 在 122 tasks 上 100%”这一结论。 |
| Weight / harness attribution 尚未完成 | 论文明确说 generation-by-generation 的 quantitative attribution 尚未报告；因此 model update、harness update、interaction 各自贡献仍不清楚。 |
| 能力上限 | 结果很有价值地说明 **harness 能暴露 frozen base 的大量 latent capability**；但不证明 model 本身能力上限被突破，更不证明 successor improver 出现 compounding gain。 |

##### 总评

**Macaron-V1 的系统设计比一篇普通 harness-search 论文更宽：它把 deployable successor 定义成有完整 lineage 的 model–harness pair，并用 specialist LoRA + HCP + MindForge 为 continual learning 准备更新通道。但论文最干净的 RSI 实验恰恰主动把 model update 拿掉，只验证 frozen base 上的 adaptive harness/configuration search：122 个预先选出的 base-failure tasks 最终都能在某个 configuration 下被覆盖，而单一 full-set config 最多只过 11 个。这非常能说明 harness 对 latent capability elicitation 的作用，却不能说明完整 RSI cycle 或多代 model–harness compounding 已经成立。**

---

---

### AI4AI at Test-Time: Strong-to-Weak Capability Transfer via Harnesses

- **链接**：https://arxiv.org/abs/2608.12307
- **时间**：2026-08-12
- **核心定位**：不用更新 target model 权重，让更强 builder 在少量 labeled validation 上反复构造 executable scaffold，把能力以 test-time harness 的形式 transfer 给弱模型。

#### 1. 现有工作 Gap / 定位 / 贡献

| 项目 | 内容 |
|---|---|
| 现有工作 Gap | 常规 strong-to-weak capability transfer / distillation 主要在 training time 更新弱模型参数；论文问：能否**完全不训练 target model**，只让强模型设计 inference-time harness 来完成能力转移。 |
| 本文定位 | **Strong-to-weak scaffolding**：builder 在少量 labeled validation 上构造、测试、诊断并改 executable scaffold；target model 权重冻结；scaffold freeze 后在 builder 从未见过的 hidden test 上评测。 |
| 核心贡献 | ① 把 capability transfer 转到 test-time harness；② 比较不同 builder、platform、reasoning effort、target model；③ 分析哪些 scaffold mechanism 真正带来提升；④ 包含 GPT-5.4-mini→自身的 self-scaffolding control。 |

#### 2. 方法与 Self-Evolution Setting

| 项目 | 内容 |
|---|---|
| 什么在进化 | **Executable scaffold / harness**；target model 权重始终冻结。 |
| 谁来改 | 多个 builder model，通过 Cursor / Claude Code / GPT Codex 等 builder-side platform 构造 scaffold；主结果中强 builder 包括 GPT-5.5、Opus-4.7、Gemini 系列等。 |
| 谁来执行 | 主 target 是 **GPT-5.4-mini**；另测 **Gemini-3.5-flash**。 |
| Builder 能改什么 | 不限制固定 scaffold architecture：可写 prompt template、benchmark routing、deterministic pre/post-processing、format enforcement、verification pass、few-shot retrieval、symbolic/direct solver 等 executable procedure。 |
| Builder 每轮能看到什么 | 当前 scaffold、validation accuracy，以及错误样本 **$(x,\; gold\ y,\; prediction\ \hat y)$**；因此 feedback 是显式 **gold-labeled validation feedback**。 |
| 迭代 | `inspect task → propose/revise scaffold → validation eval → inspect errors → revise`，builder 自己决定何时提交；最终 scaffold freeze。 |
| 方法本质 | 主 setting 是 **strong-to-weak automated scaffolding**，不是严格 self-evolution；但有 same-model self-scaffolding control。 |

#### 3. 实验 / Benchmark / 数据与 Feedback

| 项目 | 内容 |
|---|---|
| Benchmark | 4 个 Theory-of-Mind 数据集：BigToM、Hi-ToM、MMToM-QA、MuMA-ToM |
| Hidden test | 合计 **3,900 items**；builder 不可访问 |
| Evolution / validation | 固定随机种子抽取 **195 items（约 5%）labeled validation** |
| Feedback | validation accuracy + 每个错误样本的 input / gold answer / prediction |
| Train/dev/test 隔离 | **较干净**：builder 只在 5% validation 上反复改 scaffold；提交后由 evaluator 在 hidden full test 上运行，builder 不看 test result 再修改 |
| 人工标注 / GT | **明确使用正确答案作为 evolution feedback**，但仅限 validation；hidden test GT 不暴露给 builder |
| Target 权重 | 全程 frozen；没有 fine-tuning |

#### 4. 主要结果与结论

| 结果 / 发现 | 实验依据 | 能支持的结论 |
|---|---|---|
| Strong-to-weak scaffold 带来大幅提升 | GPT-5.4-mini vanilla macro avg **0.488**；所有 scaffolded runs mean **0.763**；best run **0.912**（+0.423） | 强 builder 能通过外部 harness 给固定弱 target 注入大量 task structure |
| Iterative validation 确实有效 | 平均 first logged validation → best validation **+0.216**；平均约 4.9 次 validation pass | builder 能利用 explicit labeled errors 改 scaffold，而不只是一次性 generation |
| Validation improvement 能迁移到 hidden test | best validation 与 full-set accuracy **Pearson r=0.96**；平均 optimism gap 约 0.021 | 5% validation 在这些 ToM benchmark 上没有表现出明显严重过拟合，是相对干净的 evolution→test 证据 |
| 主要收益来自 structure externalization | 论文分析认为 deterministic code、benchmark-specific routing、strict answer-format enforcement 等比单纯增加 target reasoning/sampling 更关键 | harness 可以把不稳定 reasoning 外化为可执行规则与 control logic |
| Self-scaffolding 也有提升，但弱于强 builder | GPT-5.4-mini 为自己搭 scaffold：Cursor **+0.217**、GPT Codex **+0.168**；stronger builders 对应平均 uplift 更大 | 同模型也能发现一部分可利用结构，但 high-performance regime 主要由更强 builder 解锁 |
| 自动 scaffold 仍未全面超过人类设计 | GPT-5.4-mini human-inspired UserHarness **0.939**，best automated **0.912** | 自动 harness engineering 很强，但仍存在人类设计上限差距 |

#### 5. 评判 / 缺点

| 问题 | 评判 |
|---|---|
| Story 与实验匹配 | **匹配 strong-to-weak capability transfer**：target 权重固定、builder 真正反复修改 executable scaffold，并在 hidden test 验证。 |
| 是否严格 RSI | **主实验不是。** builder 通常比 target 强，属于 strong-to-weak scaffolding；self-scaffolding 只是 control，且提升明显小于 stronger-builder setting。 |
| Feedback 难度 | Evolution feedback 很强：builder 不仅有 scalar accuracy，还能看到错误样本的 **gold label + prediction**。因此不能把结果解释成“仅靠自我反思/无监督 feedback 就能自进化”。 |
| 数据隔离 | **这是它相对强的地方。** validation 与 hidden test 明确隔离，builder 不能看 test；比直接在最终 benchmark tasks 上反复优化的 setting 更能证明 harness strategy 泛化。 |
| Benchmark generality | 全部是 ToM QA，结构高度规则化；BigToM 甚至可被 scaffold 转成接近 deterministic rules。能否迁移到 BrowseComp、coding、open-ended agentic tasks 仍未验证。 |
| 能力上限口径 | best scaffolded GPT-5.4-mini 可超过更强 unscaffolded GPT-5.4，但不等于突破 builder/system 的能力上限；human-inspired harness 仍更高。 |
| 对我们的启发 | 这是较干净的 harness evolution protocol：**小规模 evolution/dev set → scaffold freeze → hidden held-out tasks**。后续研究可在更开放 agentic task 上复用这一评估结构，再测 capability ceiling、稳定性和行为偏移。 |

##### 总评

**AI4AI at Test-Time 是目前较干净的 harness optimization/evolution 证据之一：target model 完全冻结，builder 在约 5% labeled validation 上基于明确 gold-error feedback 反复改 executable scaffold，最终在不可见的 3,900-item hidden test 上验证，且 validation-best 与 hidden performance 高相关。它主要证明 strong-to-weak test-time capability transfer，而不是严格 RSI；真正值得延伸的是把这种干净的 evolution→freeze→held-out evaluation protocol 放到更复杂的 agentic harness 场景。**

---

## B. Non-Harness Self-Evolution / RSI

### SEED: Self-Evolving On-Policy Distillation for Agentic Reinforcement Learning

- **链接**：https://arxiv.org/abs/2607.14777
- **时间**：2026-07-16
- **核心定位**：针对 agentic RL 只有 sparse trajectory-level reward、难做细粒度 credit assignment 的问题，让最新 policy 同时作为 actor 和 trajectory analyzer，把自己的 on-policy rollout 总结成 hindsight skill，再将 skill 对 sampled actions 的行为影响蒸馏回模型权重。

#### 1. 现有工作 Gap / 定位 / 贡献

| 项目 | 内容 |
|---|---|
| 现有工作 Gap | Outcome-based agentic RL 通常只给 episode-level sparse/delayed reward，不能指出中间哪些 observation、tool call、action 应强化或纠正；已有 reflection / memory / skill 方法又常把 hindsight 当作 static experience、固定 teacher 或 inference-time context，随着 policy 变化可能与当前 failure mode 失配。 |
| 本文定位 | 提出 **SEED（Self-Evolving On-Policy Distillation）**：把当前 policy 自己完成的 trajectory 转成 natural-language hindsight skill，并把 skill-conditioned 与 ordinary context 下对同一 sampled action 的 probability shift 转成 dense token-level OPD signal，与 outcome RL 联合训练。 |
| 为什么叫 self-evolving | Stage 2 中**最新 policy checkpoint 同时充当 actor 和 analyzer**；policy 更新后，下一轮 rollout distribution 和负责分析这些 rollout 的 model checkpoint 一起更新，因此作者称 decision making 与 hindsight supervision co-evolve。 |
| 核心贡献 | `on-policy rollout → self-analysis → hindsight skill → token-level OPD + GRPO → next policy`；skill 只作为 training-time privileged supervision，deployment 时不需要 skill memory、retrieval 或额外 analyzer。 |

#### 2. 方法与 Self-Evolution Setting

| 项目 | 内容 |
|---|---|
| 什么在进化 | **模型权重**及随之变化的 on-policy trajectory distribution；不是 harness、memory 或外部 persistent skill bank。 |
| Stage 1：外部 bootstrap | 每个 backbone 从 180 个 training tasks 各采 8 条 rollout，共 **1,440 trajectories**；外部 **GLM-5.2** 读取完整 task/trajectory/reward/final outcome，生成 hindsight skill；再用 `(trajectory → skill)` 做 3-epoch SFT，让 backbone 先学会 trajectory analysis。 |
| Stage 2：self-evolving loop | 当前 frozen snapshot $\pi_t$ 自己 rollout，并用**同一 checkpoint**作为 analyzer 对完成的 trajectory 生成 hindsight skill；对同一 sampled action 比较普通 context 与 skill-augmented context 的 log-probability，形成 OPD signal，与 GRPO 联合更新得到 $\pi_{t+1}$。 |
| 谁来改 | 固定人工设计的 **GRPO + OPD optimization algorithm** 更新 weights；不是 coding agent 主动决定如何重写 optimizer/workflow。 |
| Analyzer 能看到什么 | 完整 task、observations/actions、rewards 和 terminal outcome；因此 hindsight skill 是 **reward-grounded self-analysis**，不是无 verifier 的纯自监督 reflection。 |
| Skill 生命周期 | Stage 2 每轮根据当前 policy 的新 trajectory 重新生成；不作为跨任务 persistent memory 保存，也不在 inference 时提供给 actor。 |
| 方法本质 | **model-weight agentic RL / adaptive self-distillation**，不是 harness RSI。 |

#### 3. 实验 / Benchmark / 数据与 Feedback

| Benchmark | Backbone / training | Feedback | Train → Test | GT / 外部 supervision |
|---|---|---|---|---|
| ALFWorld | Qwen2.5-3B/7B、Qwen3-1.7B；SFT 180 tasks，RL 2,400 | environment success / terminal reward + trajectory | RL train 与 eval 分开；140 seen test + **134 unseen test** | Stage 1 有 GLM-5.2 skill supervision；Stage 2 依赖 environment outcome |
| WebShop | 同类 backbone；SFT 180，RL 2,400 | normalized task score + exact success | **128 test samples**，不进入 RL training | 同上 |
| Search-Augmented QA | 同类 backbone；SFT 180，RL 19,200 | answer correctness / reward + search trajectory | **51,713 eval questions** | outcome-grounded |
| Multimodal extension：Sokoban / EZPoints | Qwen2.5-VL-3B | environment/task success | held-out evaluation | 同样的 SEED training mechanism |

> 数据隔离相对规范：**training/evolution tasks 与最终 evaluation tasks 分开**，没有像 RSIBench-Data 那样反复利用同一最终 test subset 的 reward 来改模型。

#### 4. 主要结果与结论

| 结果 / 发现 | 实验依据 | 能支持的结论 |
|---|---|---|
| SEED 明显优于 outcome-only GRPO | 三个 backbone 上，相对 GRPO：ALFWorld **+14.9～45.9 pt**，Search QA **+1.4～9.3**，WebShop score **+8.7～19.8**，success **+5.5～39.0** | trajectory hindsight 转成 dense on-policy supervision 对 agentic RL 有显著价值 |
| 3B backbone 上提升很大 | Qwen2.5-3B：ALFWorld **75.0 GRPO → 91.8 SEED**；WebShop success **63.3→78.9**；Search QA **36.4→45.7** | 方法效果不只来自更大 backbone |
| Dynamic/on-policy skill 优于 static skill | ALFWorld：SEED **91.8**；w/o Hindsight Skill SFT 86.0；w/o Self-Evolving OPD 87.0；w/o On-Policy Skill、改 static offline skills 84.4 | 当前 policy 自己的新 trajectory 所产生的 guidance 比固定旧 skill 更匹配当前行为分布 |
| Sample efficiency 更高 | ALFWorld 仅用 60% data 的 SEED **80.7**，已经超过 full-data GRPO 75.0 | dense hindsight supervision 提高训练样本利用率 |
| 有 unseen generalization | ALFWorld unseen：GRPO **70.9 → SEED 86.2**，6 类中 5 类提升 | 改进不是只体现在 RL training trajectories 上，存在较干净 held-out transfer evidence |

#### 5. 评判 / 缺点

| 问题 | 评判 |
|---|---|
| 是否属于 Harness Evolution | **不是。** 最终改变的是 policy weights；inference-time harness 没有被搜索或改写。 |
| “Self-evolving”口径 | 比较弱：核心 loop 是人工预先规定的 `rollout → analyze → OPD+GRPO`；模型不会自己决定“应该怎样修改自己的训练机制”。 |
| External bootstrap | **Stage 1 明确依赖 GLM-5.2** 给 1,440 rollout 标 hindsight skills，先把 trajectory-analysis 能力教给 target model；因此整个系统不是从零开始的纯 self-generated supervision。 |
| Analyzer 是否真的越进化越强 | **没有直接验证。** actor/analyzer 共享 checkpoint，weights 更新后 analyzer 随之变化，但论文没有单独测不同 checkpoint 的 hindsight-skill quality 是否持续提高。 |
| 最关键的 co-evolution 归因是否干净 | 不完全。论文有 static-skill / w/o OPD 等 ablation，能说明 dynamic hindsight 有作用；但缺一个严格的 **current synchronized analyzer vs frozen old analyzer** matched comparison，因此不能完全隔离“analyzer 自身同步进化”这一因素。 |
| Skill correctness | self-generated skill 不保证正确；它是根据 trajectory + terminal outcome 生成的 behavioral hypothesis，dense/informative 不等于 ground-truth process supervision。 |
| 对 RSI 调研的意义 | 更适合作为 **model-level self-evolution / adaptive self-distillation**：说明当前 policy 产生的经验可以动态转成改进信号并蒸馏进 weights，但与 harness self-evolution 的核心研究对象不同。 |

##### 总评

**SEED 是一个效果较强、数据隔离也比较规范的 agentic RL/self-distillation 方法，但它的“self-evolving”主要来自 actor 与 analyzer 共享并同步刷新同一个 policy checkpoint，而不是 agent 主动修改自己的 harness 或 training algorithm。Stage 1 还依赖 GLM-5.2 外部 bootstrap。论文较好证明了 dynamic on-policy hindsight 优于 static skill，但没有直接证明 analyzer 本身随着 evolution 持续变强，因此应归入 model-level self-evolution，而不是 Harness Evolution。**

---

### RSIBench-Data: Benchmarking Data-Centric Research for Recursive Self-Improvement

- **链接**：https://arxiv.org/abs/2607.25886
- **时间**：2026-07-28
- **核心定位**：固定 post-training / serving / evaluation stack，单独评估 frontier agent 能否通过 checkpoint feedback 反复研究和改进训练数据。

#### 1. 现有工作 Gap / 定位 / 贡献

| 项目 | 内容 |
|---|---|
| 现有工作 Gap | 现有 automated post-training benchmark 往往把数据设计、优化、serving、evaluation、system implementation 混在一起，最终模型变好时难判断提升是否来自 agent 的 **data-centric research** 能力。 |
| 本文定位 | 提出 **RSIBench-Data**：固定 target model 和 surrounding post-training stack，只让 researcher agent 决定训练 experience/data strategy 与白名单内的少量 config，研究其能否“诊断 capability gap → 构造数据 → 训练 checkpoint → 根据反馈继续改”。 |
| 核心贡献 | ① 受控 data-centric research benchmark；② 统一 Tinker SFT、Harbor/E2B evaluator 和 budget；③ 记录每轮 hypothesis/data/checkpoint/feedback；④ 用 4 researcher × 6 benchmark 分析 feedback-driven improvement 是否可靠。 |

#### 2. 方法与 Self-Evolution Setting

| 项目 | 内容 |
|---|---|
| 什么在进化 | Researcher 的 **training-data strategy** 在迭代；每轮还训练新的 target LoRA weights。Harness 本身不进化。 |
| 谁来改 | 主实验 4 个 researcher system：**Claude Code + Opus-4.8 / Sonnet-5；Codex + gpt-5.6-sol / gpt-5.6-terra**。 |
| 被改对象 | 固定 **Qwen3.5-35B-A3B-Base**；每个 attempt 经共享 Tinker backend 做 LoRA SFT。 |
| 外部 rollout model | 所有实验固定 **Claude Opus 4.8** 生成 reasoning trace、tool-use sequence 或 full trajectory。 |
| 迭代关系 | 每个 candidate 都是从同一固定 base model 训练一个 LoRA checkpoint；不是持续的 $M_t\rightarrow M_{t+1}$ 权重自修改。真正跨轮持续变化的是 data-research policy / strategy。 |
| Researcher 能看到什么 | permitted selection score、task trajectories、verifier outcomes、execution/infrastructure errors、token usage、training/sampling cost、elapsed time 等。 |
| Feedback | **evaluation GT / verifier-grounded feedback**：correctness/score/verifier outcome 会进入下一轮研究决策。 |
| 数据使用限制 | evaluation-only task、label、trajectory 等 protected materials **不能直接作为 training supervision**；但由这些 evaluation tasks 的 gold/verifier 产生的 feedback 可以用于改下一轮 data strategy。 |

#### 3. 实验 / Benchmark / 数据与 Feedback

| Benchmark | Eval subset / runner | Feedback | Evolution / Train → Test | GT / label 使用 |
|---|---|---|---|---|
| SWE-bench Verified | 固定 100 tasks；Mini-SWE-Agent | official-style verifier + trajectory | selection 与 final official eval 使用**同一 task subset** | protected task/label/trajectory 不能直接训练；verifier feedback 进入 loop |
| SWE-bench Multilingual | 固定 100 tasks；Mini-SWE-Agent | 同上 | 同一 subset | 同上 |
| SWE-bench Pro | 固定 100 tasks；Mini-SWE-Agent | 同上 | 同一 subset | 同上 |
| Terminal-Bench 2.0 | **89/89 全量**；Terminus-2 | task verifier/pass + trajectory | 直接对完整 benchmark 反复 selection；final 仍同一 tasks | verifier-grounded feedback |
| GPQA Diamond | 固定 100 tasks；Terminus-2 | correctness/score + trajectory | selection 与 final official eval 同一 subset | gold-grounded correctness feedback，但不能把 eval label 直接做 supervision |
| AIME 2026 | **30/30 全量**，每题 4 rollout；Terminus-2 | correctness/score | 同一 full set | gold-grounded correctness feedback |

> **关键口径**：这篇不是“把 test label 直接教给模型”，但确实是**面向最终 evaluation/test tasks 做 iterative optimization**：researcher 反复获得同一批任务上由 gold/verifier 产生的 score、correctness、trajectory 等 feedback，再修改训练数据；最终 official evaluation 仍是同一 task subset，只是在 fresh environment 中重新执行。

#### 4. 主要结果与结论

| 结果 / 发现 | 实验依据 | 能支持的结论 |
|---|---|---|
| Iteration 经常能找到比 first attempt 更好的 candidate | **14/24 = 58.33%** setting 中 later candidate > first valid candidate | 当前 researcher 已具备一定 feedback→data-strategy discovery 能力 |
| Improvement 不可靠、非单调 | 达到 historical best 后继续搜索的 23 settings 中，**18/23 = 78.26%** 最终 attempt 低于 peak，其余 5 个只回到 peak | 核心 **discovery–reliability gap**：能偶尔发现更好的策略，但不能稳定把更多 feedback 转化为持续 improvement |
| Historical-best preservation 很重要 | 多个 run 在 peak 后继续花预算但 regression | rollback / checkpoint preservation / stopping 是 self-improvement system 的关键能力 |
| 各 researcher 没有稳定排名 | 三个 SWE-style task 分别由不同 researcher 赢；非 SWE 多由 gpt-5.6-sol 领先 | improvement 强烈依赖 researcher × benchmark interaction |
| Main target 上部分任务大幅提升 | 例如 SWE Verified base 12% → 46%；AIME 30% → 53.33%；TerminalBench 1.12% → 20.22% | data-centric research 可以产生很大 task-specific gain，但并非所有任务都改善 |
| Same-family RSI 未突破 base | Kimi-K2.6 researcher → Kimi-K2.6 target：有效 data strategy 从 8% 改到约 21%；near-no-op adapter 22%，但 unadapted reference **33%** | 更接近 self-RSI 的 setting 中，当前 loop 仍没有找到真正超过原始模型的 training distribution |

#### 5. 评判 / 缺点

| 问题 | 评判 |
|---|---|
| Story 与实验匹配 | 如果定位为“评估 data-centric researcher ability”，**匹配**；若把主实验解释为严格 RSI，则偏强，因为主 setting 是强 researcher 改固定弱 target。 |
| 最重要的数据隔离问题 | 作者明确承认：**checkpoint selection 和 official evaluation 使用同一 task subset**。因此 official score 只证明 fresh execution performance，不证明对 statistically held-out tasks 的 adaptive generalization。 |
| Test-label leakage 怎么看 | 没有 direct label-as-supervision leakage；但 **test/eval gold 或 verifier 产生的 feedback 明确进入 optimization loop**。所以从评估角度，这批 task 已经承担 dev/optimization set 的角色。 |
| Self-evolution 口径 | 主实验不是严格 self-RSI；每轮 target checkpoint 也不是 $M_t\rightarrow M_{t+1}$ 连续更新，而是围绕同一 base 重做 candidate training。 |
| 归因 | 固定 training/serving/eval stack 是优点；但 researcher identity 同时捆绑 base LLM、Claude Code/Codex scaffold、reasoning effort，agent 间差异不能归因到单一因素。 |
| 统计稳定性 | 每个 setting 主要只有 one representative run，成本高、缺多 seed；58.33%/78.26% 是当前 24 个主 setting 的经验统计，不是稳定性充分估计。 |
| 对我们的启发 | **不能只看是否搜到过更高分 candidate**；要评估 feedback→improvement 是否稳定、peak 后是否 regression、何时 stop/rollback，以及 freeze 后能否在真正 held-out tasks 上保留提升。 |

##### 总评

**RSIBench-Data 的价值主要是把“能否发现 improvement”和“能否可靠持续 improvement”区分开，并直接观察到 discovery–reliability gap。其受控 post-training stack 有利于归因，但 selection 与 final evaluation 没有 task-level held-out，因此结果仍更接近针对固定 evaluation tasks 的 adaptive data optimization，而不是已经证明可泛化的 recursive self-improvement。**

---

---

### BigBang: Pursuing Open-Ended Intelligence through Self-Evolving Synthesis of Verifiable Frontier Tasks

- **链接**：https://endlessfrontier.tech/assets/paper.pdf
- **时间**：2026-08（Technical Report；官方 PDF 未给出可可靠核验的具体首次公开日）
- **核心定位**：不是修改 deployment harness，而是让 **synthetic-task / data-synthesis pipeline 自己进化**：Generator 直接改 synthesis code，Critic 提供可验证的 dense proxy，Meta-Critic 再用真实 downstream training effect 校准“什么数据真的能让模型变强”，最终反复 post-train model。

#### 1. 现有工作 Gap / 定位 / 贡献

| 项目 | 内容 |
|---|---|
| 现有工作 Gap | 随模型接近/超过 human-expert performance，继续依赖人类已知问题和人工设计 task 会限制 capability growth；但 frontier problem 又存在张力：**足够新/难的任务未必容易验证，而容易自动验证的任务可能过窄、很快饱和。** |
| 本文定位 | 提出 **verifiable frontier tasks**：位于当前知识边界、甚至没有已知最优解，但 candidate solution 可以通过 formal methods、computation、simulation 或 domain-specific tools 客观评估。 |
| 核心贡献 | 构造 `real frontier gaps → Generator–Critic synthesis → synthetic data → model post-training → real-task outcome calibration → next synthesis round` 的闭环；论文将其称为 **early data-level form of recursive self-improvement**。 |

#### 2. 方法与 Self-Evolution Setting

| 项目 | 内容 |
|---|---|
| 什么在进化 | **data-synthesis program / generation strategy + critic evaluation criteria/calibration + synthetic-data distribution + model weights**。Deployment agent harness 不是核心 evolution target。 |
| Generator Agent | 一个 code agent 直接**修改、执行、debug data-synthesis code**，而不只是在固定 prompt 中抽样新题；其 long-horizon agent harness 记录每次修改的 motivation、results、failure causes，支持后续搜索。 |
| Critic Agent | 两层审计：基础层检查 trajectory information、tool validity、format/integrity 等；高层进一步评价 correctness/evidence、contradiction、verifiability、difficulty/research depth、scalability/diversity 等。它是低成本 proxy，不需要每次都完整训练模型才能给 feedback。 |
| Meta-Critic / Outcome calibration | 周期性采样不同 synthesis pipelines，用它们的数据训练 **不同 model variants**，再到 **held-out real-world / real research tasks** 上测实际 training effect；将真实 outcome 与 Critic prediction 比较，反过来修正 evaluation criteria 和 generation strategy。 |
| Co-evolution | 固定 synthesis pipeline 会随着 model 变强而饱和，所以 pipeline 需要持续发现新 capability gaps、提高 difficulty/diversity/structure；模型训练后的能力变化又成为下一轮 task synthesis 的 target。 |
| Feedback | formal rules、computation、simulators、domain-specific tools / experimental outcome + Critic proxy + **实际 downstream training outcome**。 |
| 人工 GT 口径 | 核心 synthesis loop 不以“为每个 frontier task 提供人工 canonical answer”为前提；但论文也没有声称整个 training/evaluation stack 完全零人工数据/零人工 rubric，因此不应扩大为“完全无人工监督”。 |

#### 3. 实验 / Benchmark / 数据与 Feedback

| 项目 | 内容 |
|---|---|
| Base / successor | **Qwen3.6-35B-A3B → BigBang-V1**；35B total parameters、约 3B active parameters。 |
| Agent runtime | 256K context window；每条 trajectory 最多 **500 tool calls**。 |
| Train / Evolve | Generator–Critic 持续生成和筛选 **verifiable frontier synthetic tasks**；部分 representative synthesis pipelines 的数据用于训练 model variants；**held-out real research tasks 被用来做 Meta-Critic 的 outcome calibration，因此它们是 outer-loop validation signal，不是最终完全 untouched test。** |
| Final Eval | **9 个 benchmark suites / 11 个 score rows**，覆盖 long-horizon search、coding、scientific research、AI research：BrowseComp、xbench、SWE-Bench Pro、SciCode-V-Main/Sub、FS-R、HLE、BioMystery-HS/HD、MLE-Bench Lite、PaperBench Code-Dev。 |
| Eval 与 training 的关系 | 论文明确说 scientific research evaluations 与训练 pipeline 的 target 最接近；BrowseComp / SWE-Bench Pro / MLE-Bench 等用于展示向 web search、software engineering、ML engineering 的 transfer。不能把全部 11 rows 都简单叫“训练时完全未见的 held-out benchmark”。 |
| Verifier / GT | 不同 frontier task 使用 formal/computational/simulation/tool-based verification；最终 benchmarks 使用各自 official harness/evaluator/reference。 |

#### 4. 主要结果与结论

| 结果 / 发现 | 实验依据 | 真正能支持的结论 |
|---|---|---|
| BigBang 对 base model 是广泛而非单点提升 | 相比 Qwen3.6-35B-A3B，**11/11 rows 全部提高**；最大增益包括 FS-R **11.9→46.2 (+34.3)**、xbench **32.6→58.4 (+25.8)**、SciCode-V-Main **26.6→50.0 (+23.4)**、HLE **36.2→50.3 (+14.1)**、BioMystery-HD **2.0→15.7 (+13.7)** | 完整 self-evolving synthesis + post-training pipeline 确实能大幅扩展 35B base 的 research/reasoning/coding/tool-use performance。 |
| 35B 规模组很强 | 35B comparison 中 **9/11 rows 单独最高**，另在 SciCode-V-Main 与 Agents-A1 并列最高，即 10/11 项 first/joint-first | 说明这种 data-centric post-training 能把较小 MoE model 推到同规模 frontier。 |
| 能逼近甚至局部超过更大 frontier models | BigBang-V1 在 11 rows 中 **6 项超过 DeepSeek V4 Flash**；FS-R、HLE、BioMystery-HD、PaperBench Code-Dev 等还超过 V4 Pro | 强化了“数据/任务生成 pipeline 本身可以带来大规模 capability gain”的 evidence，但不等于 BigBang 在所有能力上优于更大模型。 |
| Generator 在固定 Critic 下也能逐轮改进数据 | 论文报告 critic held fixed 时，Generator 产生的数据在 independent benchmark 上随 rounds 持续改善；并出现合并多 source、重写 generation prompts、增加 quality checks / candidate elimination 等行为 | 支持 Generator 不只是重复采样，而是在修改 synthesis process 本身。 |
| Search-and-Verify 进一步提高 inference performance | 6 个 search/science benchmarks 全部提升，例如 xbench **58.4→64.6**、HLE **50.3→52.5**、BioMystery-HS **57.5→63.0** | 这是 **inference-time search/verification** 的额外收益，应与训练阶段 self-evolution 分开看。 |
| **主结果无法逐组件归因** | 论文明确说明 Table 1 测量的是 **complete BigBang post-training pipeline**，Generator、Critic、outcome calibration 的 individual contribution 仍需要单独 ablation | 能证明完整闭环有效，但不能从当前主结果断言哪一个 self-evolution component 是主要增益来源。 |

#### 5. 评判 / 缺点

| 问题 | 评判 |
|---|---|
| **是否属于 Harness Self-Evolution** | **不属于。** Generator 虽然运行在 long-horizon agent harness 中，真正被自动改的是 data-synthesis code/strategy，随后还更新 model weights；应该归入 **Non-Harness Self-Evolution / data-level RSI**。 |
| Held-out 的含义需谨慎 | “held-out real research tasks”是相对 synthetic training data held out，但它们的 training-effect 被 **Meta-Critic 反复用于校准 Critic / Generator**，因此从整个 evolution loop 看更像 outer-loop validation，而不是完全 untouched final test。 |
| 归因仍不够干净 | 主表比较的是 base 与完整 BigBang pipeline，没有完整的 `generator only / +critic / +meta-critic outcome calibration` controlled ablation；因此 story 中最关键的 co-evolution机制还缺独立因果量化。 |
| “Recursive” 的强度 | 论文的 recursive 主要体现在 **模型变强 → 固定 synthesis pipeline 饱和 → outcome signal 反过来改变 task-generation/evaluation strategy → 继续训练模型**。这是较强的 data/model co-evolution，但并没有证明一个 general-purpose improver 自身在多代中稳定产生 compounding improvement。 |
| Feedback 独立性 | 相比只用 self-judge 的方法更可靠：核心 anchor 是 executable verification 与真实 downstream training effect；但 evaluation criterion / real-task set 仍是外部固定边界，并没有一起开放式进化。 |
| 能力上限 | 相比 base 的提升巨大，而且能在部分 benchmark 超过大得多的模型，说明 synthetic frontier-task evolution 能显著改变能力边界；但目前不能据此断言“突破了该 base architecture 在任意充分训练/充分强 data pipeline 下的理论上限”。 |

##### 总评

**BigBang 是目前很有代表性的 data-level self-evolution：不是让 deployed agent 改 prompt/memory/harness，而是让 Generator Agent 直接改生成训练任务的程序，Critic 用可验证 frontier feedback 做低成本筛选，Meta-Critic 再用真实 downstream training effect 校准“哪些看起来困难的任务真的值得训练”，最终持续改变 synthetic-data distribution 和 model weights。BigBang-V1 相对 Qwen3.6 base 在全部 11 个 benchmark rows 上都提升，说明完整 flywheel 很有效；但作者自己的结果也明确留下两条边界：主表没有拆开 Generator/Critic/Meta-Critic 的贡献，而且用于 outcome calibration 的 held-out real tasks 已经处于 outer loop 内。因此它是很强的 data/model co-evolution evidence，但还不是对通用多代 compounding RSI 的证明。**

---
