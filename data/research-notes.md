# RSI / Harness Self-Evolution 论文调研记录

> **本文件为合并精简版。** 在原长期记录基础上合并系统补全文献；所有相关论文至少保留一行横向定位，只有 **Core / 经典代表作** 中最能定义主线的工作保留详细介绍。目标不是跟随论文自己的 “RSI / self-evolving” story，而是统一回答：**什么在变、谁来改、谁来执行、基础 harness、feedback 来源、evolution→eval 是否隔离、相对更早工作到底多开放了哪一层 editable space。**

>
> **主标签（代表性）**：**C = Core / 经典代表作**（领域绕不开、定义了范式、热度/影响力高，或直接改变后续论文如何做问题/评估）；**K = Key / 重要工作**（有清楚的新机制或关键证据）；**R = Related / 定位即可**（谱系相关，但通常表格一行即可）。
>
> **证据强度与“经典性”完全分开。** 一篇论文可以是 **Core 但证据有明显缺陷**（如 same-set adaptation / selection–eval leakage / attribution confounding），也可以是 **Key 但实验非常干净**。以后不再因为 protocol 不够干净就把领域代表作降级。
>
> **热度只作为辅助信号，不作为科学结论。** 对 2026 新论文，citation index 尚不稳定，因此综合看：后续工作是否频繁把它当 baseline/前驱、是否形成独立方法范式、官方开源/社区关注，以及我们原调研中是否已将其列为核心。

## 0. 统一分析框架

### 0.1 Meta-depth

| 层级 | 定义 | 典型形态 |
|---|---|---|
| **M0：persistent state** | memory/skill/context 内容持续变化，但 updater 固定 | Reflexion、ExpeL、Voyager |
| **M1：task-facing mechanism** | prompt/workflow/memory algorithm/tool/full harness 可编辑，但 modifier/search/selection 机制固定或外置 | ADAS、ALMA、SkillOpt、Meta-Harness、AHE |
| **M2：improver also evolves** | 产生后续改进的 modifier/meta-skill/self-mod procedure 也被继承和修改；外层 evaluator/selection 常仍固定 | Promptbreeder、STOP、DGM、MetaSkill-Evolve |
| **M3：full self-reference ideal** | 外层 improvement machinery 也处于同一可修改系统，并有准则决定何时重写 | Gödel Machine（理论） |

### 0.2 Evaluation isolation

| Protocol | 含义 | 我们如何解读 |
|---|---|---|
| **Held-out** | evolve/train/selection → freeze → unseen tasks | 最能支持可泛化 improvement |
| **Prequential** | 每个 task 只做一次，feedback 只影响未来 task | 支持 online accumulation，但 stream 同时是 experience source |
| **Same-set adaptive** | 同一 tasks 反复执行→修改→再评分 | 主要证明针对固定 tasks 可优化，不能直接当泛化 |
| **Within-instance** | 只改当前 response/trajectory | feedback substrate，不是 persistent self-evolution |

### 0.3 重新审计后的核心阅读层级

> **这次以“领域代表性”为第一原则重新审核。** 我们原先已经重点记录的工作优先保留；新增论文只有在确实形成新范式/重要证据时才进入 Core，而不是因为更新、更干净就自动挤掉旧的代表作。

#### Core-15：主干论文（优先完整读）

| 时间 | 论文 | 为什么是主干 | 证据边界要记住 |
|---|---|---|---|
| 2003/2006 | **[Gödel Machines](https://arxiv.org/abs/cs/0309048)** | 严格 RSI 的理论原型：连 improver/proof-searcher 自身也可被重写。 | 理论构造，不是现代 agent 实证。 |
| 2023-03 | **[Reflexion](https://arxiv.org/abs/2303.11366)** | `feedback→reflection→persistent experience→future behavior` 的经典 LLM 前史。 | updater 固定，更像 persistent memory 而非 harness mechanism evolution。 |
| 2023-05 | **[Voyager](https://arxiv.org/abs/2305.16291)** | executable skill library 的经典起点。 | Minecraft/open-ended embodied setting；不是 full harness。 |
| 2025-05 | **[Darwin Gödel Machine](https://arxiv.org/abs/2505.22954)** | self-modifying agent source + open-ended archive 的代表，是现代 RSI/harness program evolution 的直接前驱。 | outer archive / selection mechanism 仍固定。 |
| 2025-11 | **[AgentEvolver](https://arxiv.org/abs/2511.10395)** | 2025–26 “self-evolving agent training loop” 的高影响代表：task generation、experience navigation、credit assignment 一体化。 | 主要更新 policy/data/credit loop，不是 deployment harness evolution。 |
| 2026-03 | **[Hyperagents](https://arxiv.org/abs/2603.19461)** | 明确把 **modification procedure 本身**放入 editable program，是 improver-level RSI 的代表。 | evaluator/archive/outer selection 仍大体固定。 |
| 2026-03 | **[Meta-Harness](https://arxiv.org/abs/2603.28052)** | full executable harness optimization 的主干 baseline：完整 source/history/raw trace 都进入 proposer context。 | TerminalBench headline 同集 search/eval；其他任务更干净。 |
| 2026-04 | **[Agentic Harness Engineering (AHE)](https://arxiv.org/abs/2604.25850)** | full-harness evolution 工程化代表：observability、attribution、rollback、regression。 | TB2 主结果同集；cross-benchmark accuracy transfer 较小。 |
| 2026-06 | **[Self-Harness](https://arxiv.org/abs/2606.09498)** | same-model self-harness 的最直接代表：target 根据自己的 failure 修改自己的 harness。 | held-out regression score 参与 acceptance，不是 untouched test。 |
| 2026-06 | **[SEAGym](https://arxiv.org/abs/2606.17546)** | self-evolving harness 的 reliability/evaluation 代表：held-out ID/OOD、replay、snapshot、cost 分开评。 | 自己不提出新的 evolution 方法；价值在评测框架和负面证据。 |
| 2026-07 | **[SEED](https://arxiv.org/abs/2607.14777)** | endogenous model self-improvement 代表：当前 policy 自己产生/分析 on-policy experience，再蒸馏回 weights。 | Stage-1 有外部 bootstrap；外层训练算法固定。 |
| 2026-07 | **[Recursive Harness Self-Improvement (RHI)](https://arxiv.org/abs/2607.15524)** | harness revision-history / recursive revision 这条路线的代表。 | evaluator/optimizer role 分离，不是纯 same-model self-loop。 |
| 2026-07 | **[RSIBench-Data](https://arxiv.org/abs/2607.25886)** | RSI benchmark/研究过程的经典代表；提出最重要的 **discovery–reliability gap** 证据之一。 | selection 与 final official eval 使用同一 task subset。 |
| 2026-07 | **[Frontis-MA1](https://arxiv.org/abs/2607.28568)** | “训练一个专门的 meta-evolution / AI4AI improver” 的代表，且 OpenMLE 全栈开源。 | learned improver 变强，但 outer evolution system 仍固定。 |
| 2026-08 | **[Harness-R1](https://arxiv.org/abs/2608.02276)** | 把 harness editing 从 prompt frontier LLM 变成 **可 post-train 的独立能力**；trained harness engineer 是清晰的新范式。 | target 与 editor 是分开的；cold start 依赖更强 teacher。 |

#### Core-扩展：同样是领域代表作，按问题补读

| 论文 | 为什么仍应视为 Core / 强代表 |
|---|---|
| **[Argus](https://arxiv.org/abs/2608.05144)** | persistent runtime / durable-state / verified objective pivot 的代表；强调 role separation 与 commit authority。 |
| **[Macaron-V1](https://arxiv.org/abs/2608.09819)** | versioned **model–harness pair** / continual learning framing 的高热代表；系统设计很完整。 |
| **[BigBang](https://endlessfrontier.tech/assets/paper.pdf)** | data-level RSI / self-evolving frontier-task synthesis 的系统级代表；不是 deployment harness，但 RSI 叙事里绕不开。 |
| **[MetaSkill-Evolve](https://arxiv.org/abs/2607.05297)** | 明确 fast skill + slow meta-skill，两层 improvement procedure evolution；meta-depth 讨论的关键参照。 |
| **[Evo-Harness](https://arxiv.org/abs/2608.15071)** | skill-level harness evolution + grounded feedback vs self-feedback 的直接证据，对我们当前问题非常相关。 |
| **[Evo-Bench](https://arxiv.org/abs/2608.09096)** | 当前最接近“统一测试 harness-evolving capability”的 benchmark 骨架；Search 里含 BrowseComp/HLE。 |
| **[Aspire](https://arxiv.org/abs/2608.31111)** | hidden downstream eval + vague goal，直接测试 self-evaluation/objective construction 是否可靠。 |
| **[ADAS](https://arxiv.org/abs/2408.08435)** | executable agent program search 的重要前驱；related work 中解释 full-harness 从哪里来时必读。 |
| **[HarnessDev](https://arxiv.org/abs/2609.01437)** | 2026-09-01 新出的直接 benchmark：把 **Creation 与 Evolution** 分开，hidden downstream eval 同时测 capability、efficiency 和 cross-runtime-model transfer；对我们当前实验设计极直接，但因过新暂不按“经典热度”评级。 |
| **[GDPevo](https://arxiv.org/abs/2608.03764)** | evolution-native held-out business benchmark，并给 fully-informed **oracle ceiling**；对我们“是否接近/突破能力上限”问题非常直接。 |
| **[VeRO](https://arxiv.org/abs/2602.22480)** | harness optimizer 的 outer instrumentation / audit substrate：versioning、budgeted rewards、structured observations，是 HarnessOpt-Bench 等统一评测路线的早期直接节点。 |

> **一个关键修正**：Core 不再等于“实验最干净”。例如 RSIBench-Data / Self-Harness / Macaron-V1 的 protocol 都有清楚的限制，但它们依然是领域代表作；相反，某些很干净的新 benchmark 可以放在 Key，而不自动取代已有经典工作。

### 0.4 热度 / 代表性辅助审计（2026-09-04）

> 对 2026 新工作，引用次数仍严重滞后，所以这里**不把热度当排名**，只用公开社区信号检查“是不是把明显的热门代表作漏了”。

| 论文 | 当前公开热度信号 | 我们怎么用这个信号 |
|---|---|---|
| **Macaron-V1** | Hugging Face Papers **342 upvotes，#2 Paper of the Day** | 明显属于当前 continual learning / model–harness RSI 的高热系统工作，必须保留 Core。 |
| **SkillOpt** | Hugging Face Papers **265 upvotes，#1 Paper of the Day** | skill evolution 分支的高热代表；虽然不是 full harness，也值得保留详细介绍。 |
| **Frontis-MA1** | Hugging Face Papers **186 upvotes** | AI4AI / learned meta-evolution 路线的显著代表；上一版漏掉是错误。 |
| **SEED** | Hugging Face Papers **107 upvotes，#3 Paper of the Day** | model-level endogenous self-evolution 的高热代表，应该和 harness 路线并列保留作核心对照。 |
| **Hyperagents** | Meta/Facebook Research 官方仓库约 **2.6k GitHub stars** | improver self-modification 并非边缘概念论文，而是目前很有传播度的 recursive/improver-level 代表。 |
| **Meta-Harness** | Hugging Face Papers **23 upvotes**，Stanford/MIT/KRAFTON；已有多个 harness survey/data collection 引用其框架 | 热度不是最高，但在 full-harness 方法谱系中具有定义性，因此仍是 Core。 |
| **Self-Harness** | Hugging Face Papers 当前仅 **3 upvotes** | 反例：社区 upvote 低不代表不重要；same-model self-harness setting 对我们的研究问题具有直接定义性，因此仍是 Core。 |

**因此以后采用两个独立判断：**`代表性/热度` 决定要不要进入 Core 视野；`实验隔离/归因` 决定我们能相信它的 claim 到什么程度。两者不能再混成一个优先级。



## 0.5 Prism Awesome-RSI 全量交叉索引：按我们的框架重分类 + 标签

> **来源范围（2026-09-08 审计）**：参考 Prism-Shadow `awesome-rsi` 当前维护的 **Methods & Systems** 与 **Benchmarks** 条目；它只作为候选全集/metadata source，不采用其 taxonomy 作为我们的最终分类。下面每篇至少给一行“本质化”介绍；**Core / 经典和与我们当前问题最相关的 Key 工作仍在后文保留更详细介绍**。
>
> **阅读状态说明**：此前 Core/重点条目沿用我们已做的原文深读；本轮新增长尾条目首先依据原文摘要 + Prism metadata/taxonomy 做框架化审计。对于摘要没有给出固定 executor model、具体 seed harness 或 split 的工作，不补造细节，写成角色级描述；后续若升为 Core 再做全文级补审。

### 0.5.1 我们自己的主分类

| 代码 | 类别 | 判定标准 |
|---|---|---|
| **F** | Foundations / Self-reference | 讨论“改进器能否改自己”、递归层级、self-reference 的理论或程序级前驱。 |
| **H-Full** | Full Harness / Agent Program | prompt、tool、memory、middleware、control flow、subagent 等多个 surface 或整个 executable agent program 可改。 |
| **H-Mem** | Memory / Experience Evolution | persistent memory/experience 是主要 evolution object；再区分只改内容还是改 memory mechanism。 |
| **H-Skill** | Skill / Tool / Workflow Evolution | skill、procedure、workflow、tool library 等局部 harness component 持续增长/修正。 |
| **H-Prompt** | Prompt / Context Evolution | 主要改 system prompt、context/rule/prompt optimizer，而不是完整 executable harness。 |
| **M-Weight** | Model / Policy Self-Evolution | 主要变化落在模型权重/policy；harness 不是最终 adaptation surface。 |
| **M-Data** | Data / Training-Loop RSI | 改训练数据、训练策略、research pipeline，再产生新模型。 |
| **Meta** | Improver / Evaluator Evolution | modifier、optimizer、meta-skill 或 evaluator 本身也进入 evolution object。 |
| **Hybrid** | Model–Harness / Multi-surface Co-evolution | harness 与 weights/data/evaluator 中至少两层明确共同变化。 |
| **B-Harness** | Harness Optimization Benchmark | 固定 target/policy，直接测“能否创造/改进 harness”。 |
| **B-Lifelong** | Continual / Memory / Skill Benchmark | 测 experience accumulation、transfer、forgetting、memory/skill evolution。 |
| **B-RSI** | End-to-End RSI / AI-R&D Benchmark | 测 agent 能否改模型、改 agent、做 data/post-training/R&D，或完成完整 self-improvement loop。 |
| **B-Reliability** | Reliability / Dynamics / Safety | 重点不是最终 gain，而是 regression、retention、path dependence、reward hacking、capability ceiling。 |

### 0.5.2 标签词表

- **Editable target**：`#Prompt` `#Context` `#MemoryContent` `#MemoryMechanism` `#Skill` `#Tool` `#Workflow` `#HarnessCode` `#Subagent` `#Evaluator` `#Data` `#Weights` `#Improver`
- **谁来改**：`#SameModel` `#SeparateEvolver` `#StrongerBuilder` `#LearnedUpdater` `#JointEvolution`
- **Feedback**：`#ExecutableVerifier` `#EnvironmentReward` `#BenchmarkScore` `#GoldLabel` `#LLMJudge` `#SelfFeedback` `#HumanDemo` `#PairwiseFeedback` `#ProcessReward`
- **Evolution protocol**：`#OfflineSearch` `#Online` `#Prequential` `#Archive` `#Population` `#Sequential` `#CoEvolution` `#Continual`
- **Evidence**：`#HeldOut` `#SameSet` `#CrossModel` `#CrossBenchmark` `#RegressionGate` `#Streaming`
- **Meta-depth**：`#M0` `#M1` `#M2` `#M3`

> **标签只表示论文实际开放/使用的机制，不表示效果一定成立。** 例如 `#M2` 只说明 improver/evaluator 也可变，不等于论文已经证明递归层级带来稳定 compounding gain。

### 0.5.3 Methods & Systems：Prism 当前条目逐篇定位

#### A. Foundations / agent-program / improver-level

| 时间 | 论文 | 级别 | 我们的定位：什么在变、真正新点 | 谁来改 → 谁执行；基础 harness | Feedback / evidence | 标签 |
|---|---|---|---|---|---|---|
| 2024-10-06 | [Gödel Agent](https://arxiv.org/abs/2410.04444) | **K** | **F / Meta**。直接让 agent 读取并重写自己的 executable logic，连后续 self-modification logic 也在代码里；比只改 task prompt 更接近 program-level self-reference。 | 当前 agent/self-mod routine → 后代 agent；seed 是可执行 agent program。 | empirical benchmark score 选 descendant；outer selection 仍固定。 | `#HarnessCode #Improver #SameModel #BenchmarkScore #OfflineSearch #M2` |
| 2025-05-29 | [Darwin Gödel Machine](https://arxiv.org/abs/2505.22954) | **C** | **F / H-Full / Meta**。不沿单一路径贪心改，而维护 coding-agent archive，让不同版本成为 stepping stones；modern open-ended self-modifying agent 的主干。 | self-mod coding agent → coding-agent descendants；seed 为 coding-agent source/harness。 | executable coding benchmarks；archive selection。 | `#HarnessCode #Improver #Archive #Population #ExecutableVerifier #M2` |
| 2025-06-12 | [SEAL / Self-Adapting Language Models](https://arxiv.org/abs/2506.10943) | **K** | **M-Weight**。模型自己写 self-edit，决定“拿什么数据、如何更新自己”，最终变化是 weights；不是 deployment harness evolution。 | model-generated self-edit → 同一 base model 的 fine-tuned successor。 | update 后 downstream performance 奖励 self-edit。 | `#Data #Weights #SameModel #BenchmarkScore #OfflineSearch #M1` |
| 2026-04-25 | [Escher-Loop](https://arxiv.org/abs/2604.23472) | **K** | **Meta**。同时维护 task-agent 与 optimizer-agent population；optimizer 不只改 task program，也改 optimizer 自己，形成 mutual evolution。 | optimizer population → task programs + optimizer descendants；task agents 执行。 | task-agent score 反向选择 optimizer。 | `#HarnessCode #Improver #JointEvolution #Population #BenchmarkScore #M2` |
| 2026-06-03 | [SePO](https://arxiv.org/abs/2606.04465) | **K** | **H-Prompt / Meta**。先让 prompt optimizer 的**自身 system prompt**在多任务上变好，再用它优化 target prompts；是 prompt-level improver evolution。 | prompt agent self-evolves → 再改 task-agent prompt；基础是固定 prompt-optimization workflow。 | train/dev benchmark score / verifier。 | `#Prompt #Improver #SameModel #BenchmarkScore #OfflineSearch #M2` |
| 2026-06-24 | [Red Queen Gödel Machine](https://arxiv.org/abs/2606.26294) | **K** | **Meta / Hybrid**。把“agent 变、evaluator/utility 也变”显式化；重要点是避免 evaluator 一直固定，但在每个 selection epoch 内仍冻结标准以维持可比较性。 | evolutionary controller 同时产生 agent/evaluator descendants。 | evolving utility/evaluator + task outcome；epoch 内稳定 selection。 | `#HarnessCode #Evaluator #JointEvolution #CoEvolution #Archive #M2` |
| 2026-08-07 | [Mendel Gödel Machine](https://arxiv.org/abs/2608.07645) | **K** | **F / H-Full**。在 DGM archive 上加入多任务 evidence、cross-lineage comparison、reaction-norm mutation 与 hybridization，重点从单个 lineage 改成 comparative evolution。 | coding-agent evolver → archive descendants；coding agent 执行。 | multi-task/cross-lineage verifier evidence。 | `#HarnessCode #Archive #Population #ExecutableVerifier #M2` |

#### B. Memory / experience evolution

| 时间 | 论文 | 级别 | 我们的定位：什么在变、真正新点 | 谁来改 → 谁执行；基础 harness | Feedback / evidence | 标签 |
|---|---|---|---|---|---|---|
| 2024-03-05 | [Cradle](https://arxiv.org/abs/2403.03186) | **K** | **H-Mem / H-Skill**。长程 computer-control 中持续记录 observation/reflection，并在出现重复 procedure 时固化成 executable skill；是“experience→executable skill”的重要早期扩展。 | 固定 computer-control agent 的 memory/skill manager → 同 agent 后续执行。 | environment observation/outcome + reflection。 | `#MemoryContent #Skill #Tool #Online #EnvironmentReward #M0` |
| 2024-09-11 | [Agent Workflow Memory (AWM)](https://arxiv.org/abs/2409.07429) | **K** | **H-Mem / H-Skill**。从 demos 或 agent 自己完成的 web trajectories 抽象 reusable workflow，再检索指导 future tasks；关键是存 procedure 而不是 raw episode。 | workflow inducer/memory module → fixed web agent；基础为原 web-agent workflow。 | demos / successful trajectories。 | `#MemoryContent #Workflow #HumanDemo #Online #Prequential #M0` |
| 2025-02-17 | [A-MEM](https://arxiv.org/abs/2502.12110) | **K** | **H-Mem**。新 memory 不只是 append，而会回写 related old memories 的 summary/attributes/links，形成自组织 graph；仍主要是 memory state 进化，不是 memory algorithm 自修改。 | fixed memory updater → agent with Zettelkasten-like graph。 | interaction content + LLM-generated relations。 | `#MemoryContent #Online #Continual #SelfFeedback #M0` |
| 2025-08-08 | [Memp](https://arxiv.org/abs/2508.06433) | **K** | **H-Mem / H-Skill**。把 trajectory 蒸馏为 step instructions 和 script-like procedural memory，并允许 add/correct/deprecate；更接近可维护 procedure library。 | procedural-memory updater → fixed task agent。 | accumulated trajectories / outcome。 | `#MemoryContent #Skill #Workflow #Online #Prequential #M0` |
| 2025-09-29 | [ReasoningBank](https://arxiv.org/abs/2509.25140) | **K** | **H-Mem**。从自判 success/failure 中抽 generalizable reasoning strategy；额外 test-time rollouts继续扩 memory bank。真正风险是 self-judge contamination。 | fixed distiller/retriever → same solver/agent 后续使用 reasoning memory。 | **self-judged** success/failure。 | `#MemoryContent #SelfFeedback #Online #Prequential #M0` |
| 2026-04-13 | [Mem²Evolve](https://arxiv.org/abs/2604.10923) | **K** | **H-Mem / H-Skill / Hybrid**。不只积累经验，还让 experience memory 指导创建 tool/expert-agent asset，asset 使用后又产生新 experience，形成 experience↔capability asset loop。 | fixed co-evolution controller → agent + new tools/expert agents。 | task/environment outcomes + distilled experience。 | `#MemoryContent #Skill #Tool #Subagent #CoEvolution #Online #M1` |
| 2026-04-18 | [HeLa-Mem](https://arxiv.org/abs/2604.16839) | **R** | **H-Mem**。用 Hebbian co-activation 调整 episodic graph，并把 dense hubs 定期蒸馏为 semantic knowledge；重点是 association dynamics，不是 modifier self-improvement。 | fixed Hebbian/reflection memory module → fixed agent。 | co-activation + interaction/reflection。 | `#MemoryContent #Online #Continual #M0` |
| 2026-08-17 | [HyperSkill](https://arxiv.org/abs/2608.16114) | **R** | **H-Mem / H-Skill**。把 subtask 和 skill 组织成 trajectory hypergraph，结构化 retrieval + utility-based prune/merge；新增主要是 representation，而不是新的 RSI 层级。 | fixed hypergraph updater → task agent。 | observed skill utility / task outcome。 | `#MemoryContent #Skill #Online #Prequential #M0` |
| 2026-08-25 | [Recuris](https://arxiv.org/abs/2608.24876) | **K** | **H-Mem / H-Skill**。工作记忆不仅压缩 history，还把“当前 task progress→skill selection”对齐，并让 execution evidence 能定位到具体 memory component；固定 Meta-Agent 再做 localized validation-gated Skill Memory update。 | separate fixed Meta-Agent → solver with coupled Working + Experiential Memory。 | execution evidence + validation gate；4 long-horizon benchmarks/10 models。 | `#MemoryContent #Skill #SeparateEvolver #RegressionGate #ExecutableVerifier #M1` |

#### C. Skill / tool / workflow / prompt components

| 时间 | 论文 | 级别 | 我们的定位：什么在变、真正新点 | 谁来改 → 谁执行；基础 harness | Feedback / evidence | 标签 |
|---|---|---|---|---|---|---|
| 2026-05-31 | [SkillSmith](https://arxiv.org/abs/2606.01314) | **K** | **H-Skill**。failure-driven **joint skill + executable tool** edit；还能 wrap/edit/compose/split/retire tools。更特别的是从 traces 估计 skill pair 的 complement/conflict interaction matrix，用“ecological utility”指导 retrieval/mutation/retirement，并用 anti-pattern veto 重复错误。 | separate reflector/evolver → current agent with skill/tool library。 | failure trajectory + progressive executable tests；3 benchmarks×5 Qwen3.5 scales。 | `#Skill #Tool #MemoryContent #SeparateEvolver #ExecutableVerifier #RegressionGate #M1` |
| 2026-06-15 | [When Rules Learn](https://arxiv.org/abs/2606.17220) | **R** | **H-Prompt / H-Skill**。法律检索中自动产生 query-rewrite rules、规划 rule-combination experiments、删除无收益 rule；本质是 narrow rule-library optimization。 | rule-search agent → legal retrieval agent。 | retrieval metric。 | `#Prompt #Skill #BenchmarkScore #OfflineSearch #M1` |
| 2026-08-15 | [Evo-Harness](https://arxiv.org/abs/2608.15071) | **C** | **H-Skill**。one-shot task 后把 trajectory + grounded feedback 编译为 reusable natural-language skills；它最有价值的证据是 **self-feedback 会退化，grounded feedback 才稳定**。 | separate evolver → frozen solver + skill harness。 | environment/verifier/rubric feedback；有 self-feedback ablation。 | `#Skill #SeparateEvolver #ExecutableVerifier #Prequential #HeldOut #M1` |
| 2026-08-24 | [TRACE](https://arxiv.org/abs/2608.22793) | **K** | **H-Skill**。按 invoked skill 聚合 trajectories，直接 contrast success vs failure 后重写 behavioral skill bank；比只看单次失败更强调 skill-conditioned evidence。 | fixed skill-bank evolver → task agent。 | round-level success/failure contrast + score。 | `#Skill #SeparateEvolver #BenchmarkScore #Sequential #M1` |
| 2026-08-24 | [MediSkill-Evo](https://arxiv.org/abs/2608.23397) | **R** | **H-Mem / H-Skill**。临床场景不追求开放式“越存越多”，而是用 provenance/scope/process constraints 决定 experience 能否写入四类知识库；重点是安全写入 gate。 | fixed constrained updater → clinical interaction agent。 | provenance + process checks + environment/verifier。 | `#MemoryContent #Skill #ExecutableVerifier #RegressionGate #M1` |
| 2026-08-24 | [Prime Agent](https://arxiv.org/abs/2608.23552) | **K** | **H-Mem / H-Skill / H-Prompt**。RLM-style persistent harness 跨 trajectory 保留 histories、memory、skills、prompts、subagent specs；更像**持续 state accumulation substrate**，而非强 outer-loop harness search。 | same persistent agent/runtime → later trajectories。 | environment/executable outcomes。 | `#Context #MemoryContent #Skill #Subagent #SameModel #Online #M0` |

#### D. Full harness / executable harness optimization

| 时间 | 论文 | 级别 | 我们的定位：什么在变、真正新点 | 谁来改 → 谁执行；基础 harness | Feedback / evidence | 标签 |
|---|---|---|---|---|---|---|
| 2026-03-30 | [Meta-Harness](https://arxiv.org/abs/2603.28052) | **C** | **H-Full**。把 executable harness code 作为 search object，并把**所有历史 candidate code/score/raw traces**暴露给 coding proposer；是 full-harness 主干 baseline。 | stronger/separate coding proposer → frozen executor + current harness；seed 从简单 context/retrieval 到成熟 TB harness 不等。 | search-set score + raw execution traces。 | `#HarnessCode #Prompt #MemoryContent #Workflow #StrongerBuilder #ExecutableVerifier #OfflineSearch #M1` |
| 2026-04-28 | [Agentic Harness Engineering (AHE)](https://arxiv.org/abs/2604.25850) | **C** | **H-Full**。新增不是“full harness 可改”本身，而是 component/experience/decision observability + edit hypothesis + rollback，专门处理 attribution/interference。 | Evolve Agent + Debugger → frozen GPT executor + NexAU/AHE harness。 | verifier + layered traces + cross-iteration task delta。 | `#HarnessCode #MemoryContent #Tool #Workflow #SeparateEvolver #ExecutableVerifier #RegressionGate #SameSet #M1` |
| 2026-05-11 | [Continual Harness](https://arxiv.org/abs/2605.09998) | **K** | **H-Full / Hybrid**。不等 episode 结束，environment 持续运行时每若干 step 在线改 prompt/subagent/skill/memory；可选再用 process-reward rollout 更新 weights。 | online harness updater → same foundation agent；可再联合 policy trainer。 | recent trajectories + process reward/environment outcome。 | `#Prompt #MemoryContent #Skill #Subagent #Weights #Online #ProcessReward #CoEvolution #M1` |
| 2026-05-23 | [DemoEvolve](https://arxiv.org/abs/2605.24539) | **K** | **H-Full / Feedback**。核心不是扩大 editable space，而是回答“**什么时候 self-rollout feedback 不够**”：短 horizon Liar's Dice 可以靠 self-practice，长程随机 Balatro 中 sparse/high-variance reward 会误导 search，于是给 modifier **competent human trajectories** 作参照以定位 harness failure。 | coding proposer → frozen target agent harness；基础为现有 executable harness + demonstration reference。 | human demonstrations + task reward；同 budget 比 reward-only/self-rollout。 | `#HarnessCode #HumanDemo #SeparateEvolver #OfflineSearch #M1` |
| 2026-06-04 | [HarnessFix](https://arxiv.org/abs/2606.06324) | **K** | **H-Full**。把 failed trajectory 编译成 harness-aware representation，先 fault attribution 到 step/component，再做 scoped patch + regression validation；比“直接让 LLM 看 trace 改代码”更结构化。 | diagnostic/patch agent → existing harness executor。 | failure trace + regression test / benchmark outcome。 | `#HarnessCode #Workflow #SeparateEvolver #ExecutableVerifier #RegressionGate #M1` |
| 2026-06-08 | [Self-Harness](https://arxiv.org/abs/2606.09498) | **C** | **H-Full**。same fixed model 自己从 recurring failures 提 bounded edit，再 merge；相对 strong-builder 路线真正关键是 **modifier=executor backbone**。 | same frozen model → 自己的 harness；seed 为已有 agent harness。 | failure patterns + held-in/held-out regression score；注意 held-out 参与 acceptance。 | `#HarnessCode #SameModel #ExecutableVerifier #RegressionGate #OfflineSearch #M1` |
| 2026-06-12 | [HarnessX](https://arxiv.org/abs/2606.14249) | **K** | **H-Full / Hybrid**。把 prompts/tools/memory/control-flow 做成 **typed primitives + substitution algebra**；AEGIS 用 trace-driven multi-agent evolution 改这些 primitives，同时把 trajectories 变成 model-training signal，显式闭合 harness↔model loop。 | HarnessX foundry / AEGIS evolver → current agent runtime。 | execution traces + downstream outcome；5 benchmarks（ALFWorld/GAIA/WebShop/τ³/SWE-bench-V）。 | `#Prompt #Tool #MemoryMechanism #Workflow #HarnessCode #CoEvolution #M1` |
| 2026-07-15 | [HarnessBank](https://arxiv.org/abs/2607.13683) | **K** | **H-Full**。维护**语义多样的高性能 harness bank**，不是只保留 best；offspring 可重组/重新发明机制，只有过 gated verification 才入库。 | evolutionary harness proposer/controller → target agent candidates。 | gated verifier + candidate performance。 | `#HarnessCode #Archive #Population #ExecutableVerifier #RegressionGate #M1` |
| 2026-07-17 | [Recursive Harness Self-Improvement (RHI)](https://arxiv.org/abs/2607.15524) | **C** | **H-Prompt / H-Full-lite**。把 agent loop 表成 prompt-level harness，用 consecutive versions 的 **pairwise feedback history** 递归 revision；不是 full source-code foundry。 | optimizer/reviser → prompt-level agent loop executor。 | pairwise comparison across versions。 | `#Prompt #Workflow #PairwiseFeedback #Sequential #M1` |

#### E. Hybrid model–prompt / model–harness

| 时间 | 论文 | 级别 | 我们的定位：什么在变、真正新点 | 谁来改 → 谁执行；基础 harness | Feedback / evidence | 标签 |
|---|---|---|---|---|---|---|
| 2026-03-23 | [P²O: Joint Policy and Prompt Optimization](https://arxiv.org/abs/2603.21877) | **K** | **Hybrid**。prompt evolution 给 policy 更好的 exploration template；policy 变强后产生更难/更有价值 seed，再反哺 prompt round，并把 prompt gain 蒸馏进 weights。 | alternating prompt optimizer + policy trainer → current policy under current prompt。 | task reward / training outcome。 | `#Prompt #Weights #SameModel #CoEvolution #ProcessReward #M1` |

### 0.5.4 Benchmarks：Prism 当前条目逐篇定位

#### A. Harness optimization / autonomous agent development

| 时间 | 论文 | 级别 | 它真正测什么 | 被测系统 / seed harness / feedback | 证据边界与关键结论 | 标签 |
|---|---|---|---|---|---|---|
| 2026-02-25 | [VeRO / VeRO-Bench](https://arxiv.org/abs/2602.22480) | **K** | **B-Harness**。把 harness optimization 变成 auditable outer-loop task：Versioning + Rewards + Observations，结构化记录 stochastic LLM harness 的中间 traces 和 outcome。 | coding-agent optimizer 改 target harness；VeRO 提 version snapshots、budgeted eval、structured traces。 | 主要贡献是 measurement substrate；后来的 HarnessOpt-Bench 可看成把这条线标准化得更严格。 | `#HarnessCode #BenchmarkScore #OfflineSearch #Archive #M1` |
| 2026-06-03 | [Meta-Agent Challenge](https://arxiv.org/abs/2606.04455) | **K** | **B-Harness / B-RSI**。不是让 agent 解任务，而是让 meta-agent **在 sandbox 中编程一个 agent artifact** 去最大化 held-out performance。 | meta-agent + eval API + time budget；从 task-provided sandbox/seed artifact 开始。 | held-out 五域；meta-agent很少达到 human baseline；高 optimization pressure 下出现 GT exfiltration，说明 harness-RSI 同时有 reward hacking 风险。 | `#HarnessCode #Improver #HeldOut #BenchmarkScore #B-RSI` |
| 2026-08-06 | [HarnessOpt-Bench](https://arxiv.org/abs/2608.06301) | **K** | **B-Harness**。严格测 optimizer LLM 的 end-to-end harness optimization：给 seed harness、graded feedback、固定 eval budget，提交单一 final candidate。 | optimizer=LLM+coding harness；target agent固定；trusted execution env。 | **search→inaccessible held-out test**；重要发现：optimizer model 差异通常大于 coding-harness 差异。 | `#HarnessCode #SeparateEvolver #HeldOut #BenchmarkScore #RegressionGate #M1` |
| 2026-08-10 | [Evo-Bench](https://arxiv.org/abs/2608.09096) | **C** | **B-Harness**。测 model intrinsic harness-evolving ability，并先筛选“**真的对 harness 敏感**”的 tasks；Search/Office/General。 | 9 evolver models；fixed policy + minimal CodeAct seed；160 val 上 evolve。 | **160 val→448 sealed eval**；Search含 BrowseComp/HLE。top gain 可到 +16.6，但 Office难、存在 early saturation；非常接近我们要的 harness-evolution benchmark 骨架。 | `#HarnessCode #HeldOut #CrossModel #BenchmarkScore #M1` |
| 2026-09-01 | [HarnessDev](https://arxiv.org/abs/2609.01437) | **K / 新近重点** | **B-Harness**。把 harness development 拆成 **Creation**（minimal seed→完整 runnable infrastructure）和 **Evolution**（从自己创建的 harness 再改），同时测 capability+token efficiency。 | 6 creator LLMs、4 domains、5 downstream benchmarks；hidden eval；Evolution 用 downstream execution feedback。 | 2,207 hidden downstream instances。新发现：code/search/research 离成熟人工 harness 仍远；Evolution gain 不稳定、held-out transfer 只部分成立，而且 harness gain 强依赖 runtime model。 | `#HarnessCode #HeldOut #CrossModel #BenchmarkScore #M1` |

#### B. Continual / memory / skill self-evolution

| 时间 | 论文 | 级别 | 它真正测什么 | 被测系统 / feedback | 证据边界与关键结论 | 标签 |
|---|---|---|---|---|---|---|
| 2025-05-17 | [LifelongAgentBench](https://arxiv.org/abs/2505.11942) | **K** | **B-Lifelong**。早期统一测 lifelong agent：DB/OS/KG 中 task interdependence 明确，让后续任务需要复用 earlier skill/knowledge。 | 多种 LLM agents；automatic label verification。 | 经验 replay 很容易引入 irrelevant info/context burden；说明“存轨迹”不是可靠 lifelong learning。 | `#MemoryContent #Skill #Prequential #ExecutableVerifier #M0` |
| 2025-07-07 | [MemoryAgentBench](https://arxiv.org/abs/2507.05257) | **K** | **B-Lifelong**。把 memory 拆成 retrieval、test-time learning、long-range understanding、selective forgetting 四种能力，强调 incremental multi-turn 而非静态 long-context QA。 | context/RAG/external-memory/tool agents。 | 不直接测 full self-evolution，但定义了 memory harness 至少应该有哪些能力，尤其 forgetting/update。 | `#MemoryMechanism #Streaming #M0` |
| 2025-08-26 | [StuLife / ELL](https://arxiv.org/abs/2508.19005) | **R** | **B-Lifelong + framework**。学生长期生活模拟：experience exploration、long-term memory、skill learning、knowledge internalization。 | experience-driven lifelong agent；dynamic state。 | 范围广但 setting 较特定；价值在把 memory+skill+proactivity 放到长时状态环境。 | `#MemoryContent #Skill #Continual #Online #M0` |
| 2025-10-20 | [MemoryBench](https://arxiv.org/abs/2510.17281) | **R** | **B-Lifelong**。重点从“读长文并记住”转到**service-time 用户 feedback accumulation**；多域多语言。 | 多种 memory/continual systems；simulated user feedback。 | 更像 memory/continual benchmark，不直接验证 harness modifier。 | `#MemoryContent #Online #Streaming #M0` |
| 2025-11-25 | [Evo-Memory](https://arxiv.org/abs/2511.20857) | **K** | **B-Lifelong + baseline framework**。把 10+ memory modules 放到 sequential task streams，要求每次 interaction 后 search/adapt/update memory。 | 各 memory module + ExpRAG/ReMem baseline。 | 明确把 memory evaluation 变成 **streaming experience reuse**；但 updater机制本身多半固定。 | `#MemoryContent #Streaming #Prequential #M0` |
| 2026-04-19 | [SkillFlow](https://arxiv.org/abs/2604.17308) | **K** | **B-Lifelong / Skill**。166 tasks/20 families，共享 Domain-Agnostic Execution Flow；从 no skills 开始顺序 solve→trajectory/rubric patch→carry forward。 | 多个 agent/model；trajectory + rubric feedback。 | Opus +8.43，但弱模型可 regression；**skill usage ≠ skill utility** 是很重要的负面结论。 | `#Skill #Prequential #LLMJudge #Streaming #M0` |
| 2026-04-22 | [SkillLearnBench](https://arxiv.org/abs/2604.20087) | **K** | **B-Lifelong / Skill**。20 verified skill-dependent tasks、15 subdomains，同时评 skill quality、trajectory、task outcome。 | one-shot/self-feedback/teacher-feedback/skill-creator methods。 | 外部 feedback 多轮能改进，**self-feedback alone 会 recursive drift**；没有方法在所有 task/model 上稳定领先。 | `#Skill #SelfFeedback #LLMJudge #ExecutableVerifier #M0` |
| 2026-05-18 | [EvoMemBench](https://arxiv.org/abs/2605.18421) | **K** | **B-Lifelong / Memory**。按 scope（in/cross-episode）×content（knowledge/execution）系统比较 15 memory methods 与 long-context baseline。 | 多类 memory systems。 | long-context 仍非常强；没有 universal memory；程序型 memory 只在 task structure match 时明显有用。 | `#MemoryMechanism #CrossBenchmark #M0` |
| 2026-06-04 | [CL-Bench](https://arxiv.org/abs/2606.05661) | **K** | **B-Lifelong / B-Reliability**。6 个 expert-validated stateful domains，共享 latent structure；用 gain metric 隔离 “base capability” 与“从过去经验学到多少”。 | ICL 到 dedicated memory agents。 | naive ICL 反而可超过专门 memory system；非常重要的 counterfactual：复杂 memory harness 未必等于 continual learning。 | `#MemoryContent #Prequential #Streaming #M0` |
| 2026-07-06 | [EvoAgentBench](https://arxiv.org/abs/2607.05202) | **K** | **B-Lifelong / procedural transfer**。把 trajectory 中的 procedure canonicalize 成 Ability，并构造 Ability Graph，保证 test task 有 train-side procedural support。 | 2 scaffolds × 3 backbones；528 train / 267 test。 | curated Ability 可跨 model transfer，但**没有自动 evolution method 在所有 setting 都正 gain**；能定位 encoding/routing/uptake 哪一环失败。 | `#Skill #Workflow #HeldOut #CrossModel #M0` |
| 2026-07-31 | [AgentStream](https://arxiv.org/abs/2608.00155) | **K** | **B-Lifelong / B-Reliability**。把 self-evolution methods 放到 Isolated→Sequential→Interleaved streaming task composition，研究 domain mixing 后是否还 work。 | 5 evolution methods × 3 frontier models。 | reliability 随 scenario 大变；benefit 被 model capability gate，且不随 model strength 单调；无方法全胜。 | `#Streaming #Prequential #CrossBenchmark #B-Reliability` |
| 2026-08-02 | [PATH-Bench](https://arxiv.org/abs/2608.01149) | **K** | **B-Lifelong / B-Reliability**。显式构造 helpful/interfering histories，重复 probe task 测 forward transfer、backward transfer、forgetting；研究 experience **path dependence**。 | 8 agents；single-turn code + multi-turn tool-use。 | 强 forward transfer 不保证 retention；later experience 会重塑 earlier gains。它直接支持我们关注的“系统性副作用/干扰”。 | `#MemoryContent #Skill #Streaming #RegressionGate #M0` |
| 2026-08-04 | [ContinualSkillBench](https://arxiv.org/abs/2608.03874) | **K** | **B-Lifelong / Skill**。5 domains×100 interconnected tasks，对照 explicit skill maintenance 与仅保留 prior context。 | 多模型、多 skill/context conditions。 | 平均 ICL≈explicit skills：很多所谓 “skill evolution gain” 可能只是 context/feedback adaptation；这是非常重要的 attribution counterfactual。 | `#Skill #Context #Prequential #B-Reliability #M0` |
| 2026-08-04 | [PAST-Bench](https://arxiv.org/abs/2608.04003) | **K** | **B-Lifelong / personal agent**。用 matched retained-experience ON/OFF fresh-session sequences，不只看 later gain，还检查是否真的经过 save→retrieve→update pathway。 | 7 base models × 4 agent frameworks；26 scenarios/204 episodes。 | headline gain 相同不代表机制真的 work；加入**pathway evidence**是它最有价值的新点。 | `#MemoryContent #Skill #Streaming #Prequential #B-Reliability` |
| 2026-08-04 | [GDPevo](https://arxiv.org/abs/2608.03764) | **K / 我们重点** | **B-Lifelong / B-Reliability**。用 rule hybridization 把 enterprise workflow 规则分散到 train tasks，再重组到 held-out test，让 transfer 可归因；还给 fully-informed oracle ceiling。 | 4 agents，4 supervision types；CRM/ERP/finance/health/legal/data workflows。 | 5 train + 5 held-out/test per group；evolution 最多 +16.44，但 best 仍远低于 **91.6% oracle**。非常适合我们“能力上限”问题。 | `#MemoryContent #Skill #HeldOut #GoldLabel #CapabilityCeiling #M0` |
| 2026-08-06 | [FinEvo-Bench](https://arxiv.org/abs/2608.06144) | **K** | **B-Lifelong / professional workflow**。同一 Qwen3.7-Max 下比较 4 self-evolving scaffolds，并用 paired non-evolving control 隔离 retained experience 的贡献。 | 120 real-case tasks、20 scenes、6 finance domains；Claude Opus judge。 | evolving +9.33~19.37；skill-only 在 Claude Code 上优于 memory-only/combined；rubric feedback 优于 reference-answer feedback。 | `#Skill #MemoryContent #LLMJudge #Streaming #B-Reliability` |

#### C. End-to-end RSI / autonomous AI R&D / training-loop evaluation

| 时间 | 论文 | 级别 | 它真正测什么 | 被测系统 / feedback | 证据边界与关键结论 | 标签 |
|---|---|---|---|---|---|---|
| 2026-03-09 | [PostTrainBench](https://arxiv.org/abs/2603.08640) | **K** | **B-RSI**。给 agent 约束预算，让它自己找数据、训练、评估并提高 base LM；直接测 autonomous post-training engineering。 | coding/research agents + base model + local data/web + evaluator。 | best agent 平均仍低于 official instruction-tuned model；出现 test-set training、下载现成 tuned checkpoint、滥用 API key 等 reward hacking。 | `#Data #Weights #Improver #B-RSI #RewardHacking` |
| 2026-04-12 | [Agent² RL-Bench](https://arxiv.org/abs/2604.10547) | **K** | **B-RSI**。专门测 agent 能否 design/implement/debug/execute **agentic RL post-training loop**，而不是只写一个训练脚本。 | base model + task data + grading API + fixed budget；6 tasks/3 levels。 | 有单个 ALFWorld 大幅提升，但稳定 online RL 很少；成功路线大量依赖 supervised warm-up。 | `#Data #Weights #ProcessReward #B-RSI` |
| 2026-06-02 | [Curation-Bench](https://arxiv.org/abs/2606.04261) | **K** | **B-RSI / M-Data**。固定 model/training/eval，只让 agent 修改 data-curation policy，专门隔离“research decision quality”。 | generalist coding agents + fixed training/eval pipeline。 | agent 很会局部 tuning，却很少发现新 policy family，形成 **execution–research gap**；method-guided scaffold 可改善探索。 | `#Data #Improver #BenchmarkScore #B-RSI` |
| 2026-06-03 | [AutoLab](https://arxiv.org/abs/2606.05080) | **K** | **B-RSI / long-horizon improvement**。36 个任务都给“正确但次优”的 baseline，要求 agent 在 wall-clock budget 内反复 benchmark→edit→measure。 | 17 models；system/CUDA/model dev/puzzle 等。 | 最重要 predictor 不是 first attempt，而是**能否坚持迭代并吸收 empirical feedback**；多数模型过早终止或无效耗预算。 | `#Improver #BenchmarkScore #ExecutableVerifier #LongHorizon #B-RSI` |
| 2026-07-06 | [EdgeBench](https://arxiv.org/abs/2607.05155) | **K** | **B-RSI / learning dynamics**。134 real-world ultra-long tasks、约38k小时 interaction，用丰富多层 feedback 测 deployment-time learning curve。 | 多代 frontier agents，单 task≥12h。 | performance 随 environment learning 呈 log-sigmoid scaling（reported R²≈0.998），学习速度跨 model generation 加快；这是“self-improvement dynamics”而非特定算法 benchmark。 | `#Streaming #EnvironmentReward #LongHorizon #B-Reliability` |
| 2026-07-28 | [RSIBench-Data](https://arxiv.org/abs/2607.25886) | **C** | **B-RSI / M-Data**。固定 post-training stack，只测 researcher 能否把 checkpoint feedback 转成更好的 training-data strategy。 | 4 frontier researcher systems；fixed Qwen target candidates。 | **58.33%** setting 能发现 later-better candidate，但 peak 后继续搜的 runs 中 **78.26%** 以更差 final 结束；selection/eval 同 task subset。定义了 discovery–reliability gap。 | `#Data #Improver #BenchmarkScore #SameSet #B-Reliability` |

### 0.5.5 这一批文献对我们主线最重要的新增判断

1. **不要把“persistent state 变了”统称为 harness evolution。** A-MEM、ReasoningBank、Memp、Prime Agent 多数仍是 **M0：固定 updater 管理持续增长的 state**；Self-Harness、Meta-Harness、AHE 才更接近 **M1：task-facing harness mechanism/code 本身成为 editable object**。
2. **Skill 是否真的“抽象成可复用能力”，现在已经有很强的反例证据。** ContinualSkillBench 的 ICL counterfactual、SkillFlow 的 `usage ≠ utility`、SkillLearnBench 的 self-feedback drift 都说明：只看到 skill bank 增长/后续分数变好，不足以证明发生了 reusable skill acquisition。
3. **Feedback quality 逐渐成为比 editable space 更关键的变量。** DemoEvolve 用 human trajectory 缓解 sparse feedback；Evo-Harness/SkillLearnBench 直接发现 self-feedback 可导致 drift；FinEvo-Bench 发现 rubric feedback 优于 reference-answer feedback。这与我们当前 `Task × Model × Feedback × Editable Space` 的框架高度一致。
4. **Harness evolution 的 benchmark 正迅速成熟为独立研究对象。** VeRO→HarnessOpt-Bench→Evo-Bench→HarnessDev 形成一条很清楚的评测线：从 outer instrumentation，到 fixed-budget held-out optimization，再到 harness-sensitive task construction，再到 Creation+Evolution 两阶段与 efficiency/model-transfer 评估。
5. **我们关心的“能力上限”已有更直接参照。** GDPevo 显式提供 fully-informed oracle ceiling，而且 evolved agents 仍明显低于 oracle；HarnessDev 又显示自动创建/evolve harness 在 code/search/research 上仍离成熟人工 harness 很远。这比仅仅证明 “base→evolved 有提升” 更接近 capability-ceiling 问题。
6. **“改得更多/更久”不是单调有利。** RSIBench-Data 的 peak 后 regression、AgentStream 的 scenario dependence、PATH-Bench 的 interference、Evo-Bench 的 early saturation 都说明应该把 **best-so-far、final、retention、transfer、side effect** 分开报，而不是只看最后一轮单一 score。
7. **下一步最值得优先全文深读的新条目**：**HarnessDev、GDPevo、VeRO、Meta-Agent Challenge、PATH-Bench、PAST-Bench、SkillLearnBench、HarnessX、HarnessBank、DemoEvolve**。它们分别补足 creation-vs-evolution、ceiling、instrumentation、autonomous agent development、path interference、mechanistic pathway evidence、self-feedback drift、typed full-harness substrate、population diversity、sparse-feedback credit assignment。


## 1. 全量论文索引：按类别、时间顺序

> 表格中所有论文都保留，但 **Related 档不再展开正文**。`基础 harness` 特意单列：从 minimal/raw seed 涨分与从成熟 harness 上继续改进，证据含义不同。

### 0A. 理论源头

| 优先级 | 时间 | 论文 | 本质定位 | 什么在变 | 谁来改 / 谁执行 | 基础 harness | Feedback | Evolution → Eval | Meta-depth | 相对之前真正新增什么 |
|---|---|---|---|---|---|---|---|---|---|---|
| **R** | 1965 | [Speculations Concerning the First Ultraintelligent Machine](https://doi.org/10.1016/S0065-2458(08)60418-0) | 提出 intelligence explosion 的经典论证：如果机器设计机器本身也是一种智力活动，那么足够强的机器可设计更强机器。 | 概念上是机器设计能力/机器本身；没有具体可执行 update object。 | **改**：未定义自动 modifier。<br>**执行**：假想 ultraintelligent machine。 | 无现代 harness 概念。 | 无实验 feedback；逻辑论证。 | 无 benchmark。 | M3 概念理想，但没有实现。 | 不是算法或实验论文；它提供的是“能力改进能够反馈到改进能力本身”的最早经典 framing。 |
| **R** | 1987 | [Evolutionary Principles in Self-Referential Learning (Meta-Meta-Hook)](https://people.idsia.ch/~juergen/) | 早期 self-referential learning / learning-to-learn：不仅搜索 task solution，也考虑改变产生学习/搜索变化的高阶机制。 | 学习/变异机制的高阶参数。 | **改**：系统内部 evolutionary/self-referential mechanism。<br>**执行**：同一学习系统。 | 早期程序搜索/进化系统。 | fitness / search objective。 | 理论与早期实验范式；不是现代 agent benchmark。 | M2–M3。 | 比一般 meta-learning 更靠近“meta-level rule 也成为 evolution object”，是后续 Promptbreeder / STOP / Hyperagents 的思想前史。 |
| **R** | 2002-07-31 / 2004 | [Optimal Ordered Problem Solver (OOPS)](https://arxiv.org/abs/cs/0207097) | 增量 universal program search：后续任务搜索可直接复用和组合此前已验证程序，并同时搜索 domain algorithm 与 search algorithm。 | 已发现程序与可复用 search procedure。 | **改**：固定 OOPS universal search 机制。<br>**执行**：同一 program-search solver。 | universal program-search substrate。 | 任务可解性/运行时间。 | Towers of Hanoi 等序列任务；不是 held-out agent benchmark。 | M1：可搜 search program，但最外层 OOPS 规则固定。 | 重要新点是“经验不仅提供答案，还能改进之后的搜索过程”；但它不是现代意义的 LLM agent 自编辑 harness。 |
| **C** | 2003-09 / 2006 | [Gödel Machines: Self-Referential Universal Problem Solvers Making Provably Optimal Self-Improvements](https://arxiv.org/abs/cs/0309048) | 把整个机器代码（包括 proof searcher 自身）纳入可重写对象；只有证明 rewrite 提高期望 utility 才执行。 | 机器任意代码，包括负责证明/寻找 rewrite 的代码。 | **改**：机器内部 proof searcher；rewrite 后 modifier 本身可改变。<br>**执行**：同一 Gödel Machine。 | 初始 program + axioms + utility + proof-searcher。 | 形式证明：rewrite 的预期 utility 优于继续搜索。 | 理论构造，无现代 benchmark。 | M3。 | 这是最干净的理论 M3：不是“optimizer 固定地改 policy”，而是 optimizer/proof searcher 也在同一可编辑代码里。 |
| **R** | 2018-05-17 | [A Formulation of Recursive Self-Improvement and Its Possible Efficiency](https://arxiv.org/abs/1805.06610) | 给出一类受限 RSI 的形式定义，并分析何时递归改进可计算且高效。 | 受限系统的 improvement mapping。 | **改**：形式化算法。<br>**执行**：形式化 RSI system。 | 无 agent harness。 | 形式 objective / simulation feedback。 | 受限模拟。 | 理论 M2/M3。 | 把长期偏哲学的 RSI 讨论变成受限的可形式化对象；和 harness 实验关系主要是定义口径。 |

### 0B. Feedback / Self-Correction 基础（不是 persistent harness evolution）

| 优先级 | 时间 | 论文 | 本质定位 | 什么在变 | 谁来改 / 谁执行 | 基础 harness | Feedback | Evolution → Eval | Meta-depth | 相对之前真正新增什么 |
|---|---|---|---|---|---|---|---|---|---|---|
| **R** | 2022-03-21 | [Self-Consistency Improves Chain of Thought Reasoning in Language Models](https://arxiv.org/abs/2203.11171) | 同一问题采样多条不同 reasoning paths，再以最终答案的一致性/多数结果做选择。 | 当前问题的 sampled trajectories 与最终 answer selection；系统本身不变。 | **改**：固定 sampling + aggregation rule。<br>**执行**：同一 base LLM 多次采样。 | CoT prompting + sampling/majority aggregation。 | 模型多次生成之间的答案一致性；没有 environment/gold feedback。 | GSM8K、SVAMP、AQuA、StrategyQA、ARC 等 current-run decoding；无跨任务继承。 | M0 / 非 persistent。 | 它没有产生 persistent improvement；真正重要的是提供了一个无需外部标签的 **internal-consistency feedback signal**，后来可被 evolution loop 当作 verifier/proxy。 |
| **K** | 2023-03-30 | [Self-Refine: Iterative Refinement with Self-Feedback](https://arxiv.org/abs/2303.17651) | 同一个 LLM 依次充当 generator、feedback provider、refiner，对当前输出反复修改。 | 当前 response。 | **改**：同一 LLM 的 feedback/refine prompt。<br>**执行**：GPT-3.5 / ChatGPT / GPT-4 等。 | one-shot task prompting。 | 模型自己的自然语言 critique，无外部 verifier。 | 7 个任务上的 within-instance refinement。 | M0 / 非 persistent。 | 证明无需训练也能利用自然语言 self-feedback 改当前 output；但没有 persistent state，因此不是 self-evolution。 |
| **K** | 2023-05-19 | [CRITIC: Large Language Models Can Self-Correct with Tool-Interactive Critiquing](https://arxiv.org/abs/2305.11738) | 让 LLM 用搜索、代码执行等外部工具验证初始输出，再根据工具 evidence 修正。 | 当前 output。 | **改**：同一 LLM + tool-interactive critic loop。<br>**执行**：InstructGPT / ChatGPT / LLaMA-2 等。 | LLM + external tool interface。 | 搜索结果、代码执行、toxicity evaluator 等外部工具反馈。 | QA、math program synthesis、toxicity；current-run correction。 | M0 / 非 persistent。 | 相对 Self-Refine 最重要的新点不是“再反思一次”，而是把 critique grounding 到可观测外部证据。 |
| **R** | 2023-05-31 | [Let’s Verify Step by Step](https://arxiv.org/abs/2305.20050) | 训练 process reward model (PRM) 对推理中间步骤打分，用过程监督选择更可靠的数学解。 | 训练的是 verifier/reward-model weights；task solver/harness 不持续自改。 | **改**：固定 supervised PRM training；人类逐步标注提供 target。<br>**执行**：数学 solver + PRM verifier。 | sample-and-rank math reasoning harness。 | 约 80 万个人工 step-level correctness labels（论文的 PRM800K）；不是 self-generated feedback。 | MATH 上训练/评估 process vs outcome supervision；current solution selection。 | M0 enabling substrate。 | 它不是 self-evolution，而是说明 **feedback granularity** 很关键：只有终局 outcome 与逐步 process feedback 对 search/selection 的信用分配能力不同。 |
| **R** | 2023-09-20 | [Chain-of-Verification Reduces Hallucination in Large Language Models](https://arxiv.org/abs/2309.11495) | 先生成 draft，再规划 verification questions，尽量独立回答这些问题，最后根据验证结果重写答案。 | 当前 response 与临时 verification questions。 | **改**：固定 CoVe workflow；同一 LLM 执行各阶段。<br>**执行**：同一 LLM。 | draft→verify-questions→independent answers→final response。 | 模型自己生成的 verification questions/answers，无 persistent external verifier。 | list QA、closed-book QA、long-form generation 等 within-instance evaluation。 | M0 / 非 persistent。 | 相对普通 self-reflection 的关键点是 **把验证问题与原 draft 尽量解耦**，减少模型直接复述原错误；但仍是单次回答内的 verification harness。 |
| **K** | 2023-10-03 | [Large Language Models Cannot Self-Correct Reasoning Yet](https://arxiv.org/abs/2310.01798) | 系统评估 intrinsic self-correction：不给外部反馈，仅要求模型检查并修改自己 reasoning。 | 当前答案/reasoning。 | **改**：同一 LLM self-correction prompt。<br>**执行**：GPT-4 / GPT-4-Turbo / Llama-2-70B 等。 | 标准 reasoning prompt。 | 无外部 feedback。 | GSM8K、CommonSenseQA 等 current-run correction。 | M0 / 非 persistent。 | 关键贡献是负结果：仅靠模型“再想一遍”常不能改进，甚至使正确答案变错。 |
| **K** | 2023-10-06 | [Language Agent Tree Search (LATS)](https://arxiv.org/abs/2310.04406) | MCTS 把 reasoning/action trajectory 当树节点，结合 LM value、self-reflection 与 environment feedback 做当前任务搜索。 | 当前 task 的 search tree / trajectory。 | **改**：固定 MCTS + LLM policy/value/reflection。<br>**执行**：GPT 系列 LLM agent。 | ReAct-like agent + MCTS。 | environment reward / tool observations + LM self-evaluation。 | HumanEval、WebShop 等；within-task search。 | M0 / 非 persistent。 | 把 reflection 和 grounded environment reward 放入显式 search/credit-assignment；但搜索树不跨任务持久化。 |

### A. Harness Evolution

#### A1. Prompt / Program / Workflow Evolution

| 优先级 | 时间 | 论文 | 本质定位 | 什么在变 | 谁来改 / 谁执行 | 基础 harness | Feedback | Evolution → Eval | Meta-depth | 相对之前真正新增什么 |
|---|---|---|---|---|---|---|---|---|---|---|
| **R** | 2023-09-07 | [Large Language Models as Optimizers (OPRO)](https://arxiv.org/abs/2309.03409) | optimizer LLM 读取历史 candidate + score，提出新的自然语言 solution/prompt。 | task prompt / natural-language solution。 | **改**：固定 optimizer LLM + optimizer prompt。<br>**执行**：被优化 prompt 下的 target LLM。 | 基础 prompt。 | labeled task metric / score。 | 优化集打分，选 best prompt 后 test；相对标准 prompt optimization 较干净。 | M1：task prompt 变，optimizer 固定。 | 把黑盒 prompt optimization 明确化为“history of scored attempts → proposer → new candidate”。 |
| **K** | 2023-09-28 | [Promptbreeder: Self-Referential Self-Improvement Via Prompt Evolution](https://arxiv.org/abs/2309.16797) | 同时演化 task prompt 与负责产生 prompt mutation 的 mutation prompt。 | task prompts + mutation prompts。 | **改**：固定 evolutionary algorithm；mutation prompts 参与生成后续 mutation。<br>**执行**：target LM + prompt population。 | 初始 task prompt + mutation operators/prompts。 | training-task fitness / accuracy。 | train fitness → best candidate test。 | M2（局部 self-reference）：improvement instruction 变，但最外层 EA 固定。 | 相对 OPRO 的真正新点：不只 P 在变，产生 P 变异的 M 也被 evolutionary hyper-mutation 改。 |
| **K** | 2023-10 | [DSPy: Compiling Declarative Language Model Calls into Self-Improving Pipelines](https://arxiv.org/abs/2310.03714) | 把 LM application 写成 declarative modules/signatures，再用 compiler 自动优化 instructions / demonstrations。 | prompt、few-shot demonstrations、部分 module configuration。 | **改**：固定 DSPy optimizer/compiler（如 BootstrapFewShot 等）。<br>**执行**：LM program 中的 target LMs。 | declarative LM modules。 | 用户定义 metric / labeled examples。 | train/dev optimization → test。 | M1 substrate。 | 贡献是把 prompt/pipeline optimization 工程化为可编译程序，而不是让 agent 自己持续学习。 |
| **K** | 2023-10-03 | [STOP: Self-Taught Optimizer / Recursively Self-Improving Code Generation](https://arxiv.org/abs/2310.02304) | 让 LLM 编写一个 improver scaffold，用 utility 反馈改程序；随后把该 improver 用于改进它自己。 | improver/scaffolding code 与下游 solution program。 | **改**：LLM 在 seed improver 约束下生成 rewrite；improved improver 可参与下一轮。<br>**执行**：固定基础 LLM。 | seed improver program + task utility。 | 可执行 utility / benchmark score。 | 一组程序优化任务；不是大规模 agent held-out evaluation。 | M2：improver code 可变，base LM/outer utility/runtime 固定。 | 比一般 code optimization 多了一层 self-application：improver 是输入程序之一。 |
| **R** | 2024-06-11 | [TextGrad: Automatic “Differentiation” via Text](https://arxiv.org/abs/2406.07496) | 将 compound AI system 表示成 computation graph，LLM 产生 textual gradients，沿图反向传播以更新 prompt/code/text variables。 | prompt、code、textual variables。 | **改**：固定 TextGrad backward/optimizer protocol + critic LLM。<br>**执行**：任意 compound AI system。 | 可微式 textual computation graph。 | task loss / evaluator 产生 textual feedback。 | GPQA、coding 等优化任务。 | M1。 | 关键不是特定 prompt trick，而是提供“多组件 credit assignment + textual update”的通用 optimizer abstraction。 |
| **C** | 2024-08-15 | [Automated Design of Agentic Systems (ADAS)](https://arxiv.org/abs/2408.08435) | Meta Agent Search 让 LLM 直接发明 executable agent code，并把历史 agent archive 当作搜索经验。 | 完整 agent program（受接口约束）。 | **改**：通常更强 GPT-4-class meta-agent；search/meta prompt 固定。<br>**执行**：candidate agent 的 target LLM（实验常用 GPT-3.5 等）。 | 一个极简可编程 agent skeleton / seed archive。 | validation task metric + runtime/error feedback。 | 多个任务有 validation search → held-out test，并测跨 domain/model transfer。 | M1：完整 task-agent code 变，但 meta-agent/search fixed。 | 相对 prompt optimizer 的核心跃迁：editable object 变成整个 code-represented agent architecture，可同时包含 prompt、tool use、control flow、multi-agent logic。 |
| **K** | 2024-10-14 | [AFlow: Automating Agentic Workflow Generation](https://arxiv.org/abs/2410.10762) | 把 agent workflow 写成由 LLM-invoking nodes 与 edges 组成的 code graph，用 MCTS + execution feedback 自动修改。 | workflow code/topology、node prompts/operators。 | **改**：固定 AFlow MCTS + LLM workflow modifier。<br>**执行**：candidate workflow 调用的 LLM。 | code-represented workflow。 | validation execution score。 | 6 benchmarks；validation 上优化、test 上评估。 | M1。 | 相对 ADAS 更聚焦 workflow graph search，并用 tree-structured experience/MCTS 系统探索，而不是开放式 meta-agent 自由设计。 |
| **R** | 2025-07-04 | [EvoAgentX: An Automated Framework for Evolving Agentic Workflows](https://arxiv.org/abs/2507.03616) | 提供统一的 agent/workflow generation→execution→evaluation→evolution framework，并把 TextGrad、AFlow、MIPRO 等 optimizer 接到同一 workflow representation 上。 | agent prompts、tool configurations、workflow topology；取决于选择的 optimizer。 | **改**：固定 TextGrad/AFlow/MIPRO 等优化器；EvoAgentX 本身主要负责统一 orchestration。<br>**执行**：candidate multi-agent workflow。 | 五层模块化 MAS framework（components/agent/workflow/evolving/evaluation）。 | validation metric、执行结果、LLM/textual feedback；具体由所选 optimizer 决定。 | HotPotQA/MBPP/MATH 使用 validation 做优化、test 做最终评估；另测 GAIA real-world tasks。 | M1 substrate；modifier algorithm 本身不进化。 | 相对 AFlow 的主要新增不是新的 evolution 原理，而是 **framework/integration**：prompt、tool config、workflow topology 都成为统一可优化 surface，可替换 optimizer。 |
| **R** | 2025-09 | [ShinkaEvolve: Towards Open-Ended and Sample-Efficient Program Evolution](https://arxiv.org/abs/2509.19349) | LLM ensemble + evolutionary archive 做 sample-efficient program evolution；用 parent sampling、novelty rejection 与 bandit-based model selection 提高搜索效率。 | candidate programs / scientific code / 某些 harness code；evolution engine本身主要固定。 | **改**：固定 evolutionary controller + LLM ensemble mutation operators。<br>**执行**：候选程序或候选 agent harness。 | population/archive + executable evaluator。 | 可执行 fitness / benchmark objective；novelty信号参与采样。 | circle packing、ALE/engineering、AIME harness、MoE loss 等多类 program-search task。 | M1 search substrate。 | 它不是 agent 自己持续改自己的 deployment harness；真正新点是 **更高效的开放式 program evolution/search substrate**，但论文也展示可把 agentic harness 当 program candidate 优化。 |

#### A2. Context / Memory Evolution

| 优先级 | 时间 | 论文 | 本质定位 | 什么在变 | 谁来改 / 谁执行 | 基础 harness | Feedback | Evolution → Eval | Meta-depth | 相对之前真正新增什么 |
|---|---|---|---|---|---|---|---|---|---|---|
| **C** | 2023-03-20 | [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366) | actor 执行任务，evaluator 给 outcome，reflector 把失败/成功转成自然语言 reflection 存入 episodic memory，供同任务后续 trial 使用。 | episodic reflection memory。 | **改**：固定 reflector prompt；actor/evaluator/reflector 可由同/不同 LLM 角色承担。<br>**执行**：LLM actor。 | actor + evaluator + reflector + memory buffer。 | binary/scalar task feedback；可来自环境、unit tests、answer metric。 | ALFWorld/HotPotQA/HumanEval 等，多为同 task 多 trial。 | M0：memory content 变，memory update mechanism fixed。 | 相对 Self-Refine 的关键差别是 reflection 成为 persistent memory；但主要用于同一任务重试，不是跨 task lifelong skill learning。 |
| **R** | 2023-05-16 | [MemoryBank: Enhancing Large Language Models with Long-Term Memory](https://arxiv.org/abs/2305.10250) | 长期保存对话摘要/用户画像，并用类 Ebbinghaus 机制决定记忆保留与遗忘。 | memory content / retention strength。 | **改**：固定 summarization + forgetting mechanism。<br>**执行**：chat LLM。 | conversation agent + external memory bank。 | 用户交互历史；非 task verifier。 | 模拟长期对话与人工评价。 | M0。 | 把长时个性化 memory 引入 LLM interaction，但主要目标不是 task performance self-improvement。 |
| **K** | 2023-08 | [ExpeL: LLM Agents Are Experiential Learners](https://arxiv.org/abs/2308.10144) | 收集多任务成功/失败 trajectory，抽取可复用 insights；未来任务检索 insights 和成功示例辅助 agent。 | cross-task insight memory / example pool。 | **改**：经验抽取默认 GPT-4-0613；执行常用 GPT-3.5。<br>**执行**：target ReAct-like agent。 | agent + insight memory + retrieval。 | 环境/答案正确性 + 成败 trajectories。 | ALFWorld、HotPotQA 等；含 source→target transfer（如 HotPotQA→FEVER）。 | M0：经验库变，抽取/检索机制固定。 | 相比 Reflexion 更重要的新点是 **跨任务** 经验提炼与 transfer，而非只对同一 case 重试。 |
| **R** | 2024-09 | [SAGE: Self-evolving Agents with Reflective and Memory-Augmented Abilities](https://arxiv.org/abs/2409.00872) | Assistant/Checker 迭代反馈 + reflection，并用 Ebbinghaus-style mechanism 管理 STM/LTM。 | memory content、retention/pruning 与当前 strategy。 | **改**：固定 Checker/reflection/memory rules。<br>**执行**：GPT-4/GPT-3.5/open models。 | User–Assistant–Checker + STM/LTM。 | Checker feedback + interaction history。 | AgentBench 6 tasks 与 long-context tasks。 | M0。 | 把 reflection 与 forgetting-aware memory 管理组合到 multi-turn agent；机制上主要是组合已有模块，不是 memory architecture search。 |
| **K** | 2025-02-17 | [A-MEM: Agentic Memory for LLM Agents](https://arxiv.org/abs/2502.12110) | 每条新 memory 被写成带 context/keywords/tags/links 的 note；新 note 会触发历史 note 的链接与属性更新，形成动态 Zettelkasten network。 | memory notes、links、attributes。 | **改**：固定 A-MEM agentic update procedure。<br>**执行**：多种 foundation-model agents。 | LLM agent + Zettelkasten-like memory network。 | 新 interaction/memory content + LLM relation judgment。 | LoCoMo、DialSim 等 memory benchmarks。 | M0/M1-：memory graph structure 变，memory algorithm fixed。 | 相对 fixed vector-store memory，新增的是 **memory structure/content 自组织**；但 encode/link/update algorithm 仍由作者固定。 |
| **K** | 2025-10-06 | [Agentic Context Engineering (ACE)](https://arxiv.org/abs/2510.04618) | 把 context 当 structured playbook，用 Generator→Reflector→Curator 做增量 ADD/UPDATE/REMOVE，保留有效细节并避免整段重写造成 context collapse。 | structured context/playbook contents。 | **改**：固定 Generator/Reflector/Curator update loop。<br>**执行**：ReAct/agent target model（论文用 DeepSeek-V3.1 等）。 | agent + structured playbook。 | 可用 labels，也可用 natural execution feedback。 | offline train/context optimization 与 online sequential adaptation；AppWorld 等有独立 eval setting。 | M0/M1：context 变，curation mechanism fixed。 | 核心新点不是“有 memory”，而是把长期 context update 设计成可审计的增量结构，并系统研究 context collapse。 |
| **R** | 2025-10-17 | [EvolveR: Self-Evolving LLM Agents through an Experience-Driven Lifecycle](https://arxiv.org/abs/2510.16079) | offline 把 trajectories 蒸馏成 abstract strategic principles，online 检索原则指导行动，并用 policy reinforcement 更新模型形成闭环。 | strategic-principle repository + policy weights。 | **改**：固定 distillation/retrieval/RL lifecycle。<br>**执行**：当前 policy agent。 | tool agent + principle memory + trainable policy。 | task performance / trajectory outcomes。 | multi-hop QA train/eval。 | M1 hybrid。 | 相对纯 external memory 多了 model-weight reinforcement；因此不是干净 frozen-harness evolution。 |
| **C** | 2025-12-21 | [MemEvolve: Meta-Evolution of Agent Memory Systems](https://arxiv.org/abs/2512.18746) | 不仅积累 memory $M_t$，还在 modular design space 中进化 memory architecture Ω：Encode / Store(Update) / Retrieve / Manage。 | experiential memory + memory architecture/code。 | **改**：meta-evolution operator（实验常用 GPT-5-mini）生成/选择 descendant memory designs。<br>**执行**：SmolAgent、Flash-Searcher 等 target agents；可同/跨模型迁移。 | agent + candidate memory architecture from EvolveLab。 | trajectory success、token/query/replay 等性能与效率反馈。 | GAIA/WebWalkerQA/xBench/TaskCraft；含跨 task/model/framework transfer。 | M1+：memory mechanism 变，但 outer Pareto selection/evolution protocol fixed。 | 这是 memory 谱系的实质跃迁：从“memory 中有什么”升级为“**怎么记、怎么取、怎么管理**也被优化”。 |
| **C** | 2026-02-08 | [ALMA: Learning to Continually Learn via Meta-learning Agentic Memory Designs](https://arxiv.org/abs/2602.07755) | Meta Agent 直接搜索 executable memory design code，包括 schema、update、retrieval；找到的设计供弱 target agent 在 sequential environment 中持续记忆。 | memory design code + runtime memory contents。 | **改**：GPT-5 Meta Agent；target/evaluator 主设置 GPT-5-nano，另测 transfer。<br>**执行**：GPT-5-nano/mini 等 agent。 | minimal agent + candidate memory design implementing fixed interface。 | environment reward / validation performance。 | ALFWorld/TextWorld/Baba Is AI/MiniHack；memory design search 后在 unseen/sequential tasks 使用，并测 transfer。 | M1：memory mechanism 变，meta-search fixed且常 strong-to-weak。 | 和 A-MEM 的本质区别：A-MEM 只让 memory graph 自组织；ALMA 让 **memory algorithm/code 本身**成为搜索对象。 |
| **R** | 2026-03-19 | [Learning to Self-Evolve](https://arxiv.org/abs/2603.18620) | 用 RL 直接训练模型学会：根据已见任务的反馈编辑 persistent context，使后续新任务表现变好；推理时再用 tree-guided evolution 搜 context edits。 | test-time persistent context + model weights（训练出 context-edit policy）。 | **改**：训练后由同一 policy 提出 context edits；训练阶段用 RL objective 学 updater。<br>**执行**：4B target/self-evolution model；可 transfer 去指导其他模型。 | task solver + editable context + tree-guided evolution loop。 | seen problem feedback；每个 context edit 的 reward = downstream task performance improvement。 | BIRD Text-to-SQL、MMLU-Redux；train learned edit policy，test-time seen→future-task evolution，并测跨模型 transfer。 | M1 hybrid，接近 learned modifier；outer tree/search/reward fixed。 | 相对 ACE/传统 prompt optimizer 的关键区别是 **“如何改 context”本身被训练成模型能力**：edit 的 reward 不是当前题变好，而是 edit 后对 downstream tasks 的性能增益。 |

#### A3. Skill / Tool / Executable Subagent Evolution

| 优先级 | 时间 | 论文 | 本质定位 | 什么在变 | 谁来改 / 谁执行 | 基础 harness | Feedback | Evolution → Eval | Meta-depth | 相对之前真正新增什么 |
|---|---|---|---|---|---|---|---|---|---|---|
| **C** | 2023-05-25 | [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291) | GPT-4 在 Minecraft 中自动提出 curriculum、写/调试 executable code skills，把通过环境验证的程序存入 skill library 并检索复用。 | skill library contents（code skills）。 | **改**：GPT-4 skill synthesizer/debugger；curriculum/retrieval procedure fixed。<br>**执行**：GPT-4-based Minecraft agent + Mineflayer。 | automatic curriculum + skill library + iterative prompting。 | environment state、execution errors、self-verification。 | 开放式 Minecraft lifelong run；另测新世界/新任务 skill transfer。 | M0/M1：skill content evolves，skill system fixed。 | 相对文字 reflection/memory，关键跃迁是经验变成 **可执行、可复用 code skill**。 |
| **R** | 2024-02-27 | [Agent-Pro: Learning to Evolve via Policy-Level Reflection and Optimization](https://arxiv.org/abs/2402.17574) | 在 Blackjack/Texas Hold’em 中从 trajectories 形成 beliefs，再反思不合理 belief，提炼 behavioral guideline/world model；DFS 搜索 candidate policy，并在新 trajectories 评估。 | natural-language beliefs / behavioral policy。 | **改**：固定 reflection + DFS policy optimization。<br>**执行**：GPT-3.5/GPT-4/Llama2-70B game agents。 | game agent + belief/policy memory。 | game payoff、trajectory、belief verification；policy eval 用新游戏轨迹。 | Blackjack / Texas Hold’em；有 novel-trajectory policy evaluation。 | M0/M1。 | 相对 action-level Reflexion，更强调 **policy-level belief/strategy** 的持久更新与 evaluation-on-novel-trajectories。 |
| **K** | 2025-10-27 | [Alita-G: Self-Evolving Generative Agent for Agent Generation](https://arxiv.org/abs/2510.23601) | 从成功 trajectory 合成 candidate MCP tools，抽象/参数化后合并进 MCP Box；后续任务检索这些工具。 | MCP tool library。 | **改**：manager/generator LLM（论文用 Claude Sonnet 4 等组合）生成、抽象、curate tools。<br>**执行**：generalist web/agent executor。 | generalist agent + MCP Box。 | 成功 trajectory、task pass/fail、execution evidence。 | GAIA 等；主 GAIA generation 与 evaluation 对同 validation set 有 adaptive reuse，另有 PathVQA/HLE。 | M0/M1。 | 相对 Voyager 把 executable skill 进一步标准化为可移植 MCP tool；但主要从成功经验生成，不系统利用失败诊断。 |
| **K** | 2026-03-13 | [MineEvolve: Self-Evolution with Accumulated Knowledge for Long-Horizon Embodied Minecraft Agents](https://arxiv.org/abs/2603.13131) | Monitor 把每个 subgoal execution 转成 typed feedback；Inducer 将成功蒸馏为 reusable skills、失败/停滞蒸馏为 remedies/guardrails；Curator 合并检索，Adaptor 修复剩余 plan。 | skill + remedy/guardrail knowledge base。 | **改**：固定 Monitor/Inducer/Curator/Adaptor pipeline + LLM。<br>**执行**：frozen LLM Minecraft planner。 | planner + structured knowledge base。 | inventory/state diff、failure type、progress、stagnation、task outcome。 | Minecraft MCU long-horizon tasks；experience accumulation study。 | M0/M1。 | 相比 Voyager 的关键新增是 **失败也被结构化为可执行约束/guardrail**，并有细粒度 progress/stagnation diagnosis。 |
| **K** | 2026-03-18 | [AgentFactory: A Self-Evolving Framework Through Executable Subagent Accumulation and Reuse](https://arxiv.org/abs/2603.18000) | 成功 solution 被保存成 pure-Python subagent + SKILL.md；后续相似任务检索、执行、根据 feedback 直接修改 subagent code。 | subagent code library。 | **改**：Meta-Agent 通过 create/run/modify primitives 编辑 subagents。<br>**执行**：同一模型 family 的 Meta-Agent/subagents（论文展示 Opus/Sonnet 4.6 等）。 | 固定 Meta Skills + Tool Skills + evolving Subagent Skills。 | runtime error、execution success、task result。 | 两批小规模真实任务/连续演示，主要看复用后 token/effort。 | M1。 | 相对 Voyager 从 function-level skill 扩到可独立部署的 executable subagent；强调 portability/re-execution efficiency。 |
| **K** | 2026-03-19 | [Memento-Skills: Let Agents Design Agents](https://arxiv.org/abs/2603.18743) | 冻结底层 LLM，把 structured SKILL.md / executable skill folders 当 persistent skill memory；任务时 retrieve/generate skill，执行后 Reflect→Write，成功提高 utility、失败则修复/重写 skill。 | skill prompts/code、skill metadata/utility、skill library structure；底层 LLM weights 冻结。 | **改**：同一 generalist agent 的 reflective write-back loop。<br>**执行**：frozen generalist LLM agent + retrieved/generated skills。 | skill router + sandbox/tool execution + persistent structured skill memory。 | 任务执行 outcome、失败诊断/反思；论文/项目未把它建立成严格独立的外部 verifier learning problem。 | GAIA 与 HLE 上多 learning rounds，performance 与 skill library 同步增长；主要是 repeated deployment-style evolution。 | M1 same-system；reflect/write algorithm 本身固定。 | 相对 Voyager 的新点主要是把 skill library 做成 **deployment-time read-write reflective memory**：不仅积累成功代码，还显式定位失败 skill、repair/rewrite，并让 generalist agent 设计 task-specific agents。 |
| **R** | 2026-04-16 | [From Procedural Skills to Strategy Genes: Towards Experience-Driven Test-Time Evolution](https://arxiv.org/abs/2604.15097) | 不是提出更复杂 evolution loop，而是控制实验比较 Skill、free-form experience、compact editable Gene 等表示，研究什么 experience representation 更适合持续进化。 | Gene/Skill 中积累的经验内容与 failure warnings。 | **改**：固定 experience update/evolution procedure。<br>**执行**：scientific coding agents。 | base agent + injected experience representation。 | task outcome + failure history。 | 4,590 trials / 45 scenarios；CritPt paired settings。 | M0。 | 最有价值的新点是把 **representation 本身**作为一阶变量：更长、更像文档的 skill 不一定更好；compact editable control object 更稳。 |
| **R** | 2026-04-22 | [EvoAgent: An Evolvable Agent Framework with Skill Learning and Multi-Agent Delegation](https://arxiv.org/abs/2604.20133) | 把 skill 做成多文件 structured capability unit，带 trigger/evolution metadata，并与 hierarchical subagent delegation、three-layer memory 结合。 | skill repository、metadata、memory/profile。 | **改**：user-feedback-driven closed loop / framework agents。<br>**执行**：GPT-5.2 等 target agents。 | fixed multi-agent hierarchy + structured skill/memory system。 | 用户反馈/usage outcome + LLM-as-judge evaluation。 | real-world foreign-trade scenarios；transfer across models。 | M0/M1。 | 更像完整产品/框架整合：skill persistence + delegation；相对前人没有很强的新 evolution principle。 |
| **C** | 2026-05-22 | [SkillOpt: Executive Strategy for Self-Evolving Agent Skills](https://arxiv.org/abs/2605.23904) | 把单一 natural-language skill document 当成 frozen agent 的“可训练外部参数”；optimizer 基于 scored rollouts 做 bounded add/delete/replace，只有 held-out validation 严格变好才接受。 | 一个 skill document。 | **改**：separate optimizer LLM；也测 target-as-optimizer。<br>**执行**：7 target models × direct/Codex/Claude Code 等 harness。 | 目标 agent + optional skill file。 | 完整 scored trajectories + verifier score；selection validation gate。 | 6 benchmarks；train/selection/test 分开；还有 cross-model/harness/benchmark transfer。 | M1（slow/meta guidance 不是 M2，outer optimizer logic fixed）。 | 相对 loose reflection 最大的新点是 **optimization discipline**：mini-batch、textual LR、validation gate、rejected buffer、slow update。 |
| **R** | 2026-06-30 | [ASPIRE: Agentic /Skills Discovery for Robotics](https://arxiv.org/abs/2607.00272) | coding agent 根据逐原语多模态 robot traces 诊断失败、修 control program，验证成功修复后蒸馏进持续扩张 skill library；另用 evolutionary search 探索 task sequences/programs。 | robot control programs + reusable skill library。 | **改**：coding agent + fixed evolutionary search/validation infrastructure。<br>**执行**：robot execution engine。 | code-as-policy + skill library。 | multimodal execution traces、physical/sim success/failure、validation。 | LIBERO-Pro、Robosuite、BEHAVIOR-1K；含 unseen long-horizon 与 sim-to-real。 | M1。 | 把 Voyager-style executable skill accumulation 推到真实 robotics，并强调 fine-grained physical feedback、cross-task/sim2real/embodiment transfer。 |
| **C** | 2026-07-06 | [MetaSkill-Evolve: Recursive Self-Improvement of LLM Agents via Two-Timescale Meta-Skill Evolution](https://arxiv.org/abs/2607.05297) | 每个 branch 同时带 task skill s 与 meta-skill m=(Analyzer ψ, Retriever σ, Allocator α, Proposer π, Evolver ε)；task skill 快速进化，meta-skill 慢速进化，而且同一 improvement pipeline 被用来改它自己。 | task skill + 五部分 meta-skill；共享 frozen backbone weights 不变。 | **改**：同一五角色 improvement pipeline；slow loop 让该 pipeline 对自己的 meta-skill 做更新。<br>**执行**：Analyzer/Retriever/Allocator/Proposer/Evolver 全部共享一个 frozen backbone；task solver使用当前 skill。 | 固定五角色 wiring + 当前 task skill/meta-skill files。 | execution traces + task outcome/labels/verifier；meta-skill 的价值通过后续 task-skill evolution 的 downstream performance体现。 | OfficeQA、SealQA、ALFWorld 上 evolution data 与 held-out test 分开；test 不参与 branch evolution。 | M2：improver representation 自身进化；但 outer task objective、五角色 wiring、selection/eval protocol仍固定。 | 这是和我们 meta-depth 最直接的工作之一：以前 skill evolution 只改“做什么”，这里把 **“怎么分析、取经验、分配 credit、提案、合并 skill”** 五个 improver component 也变成 branch-local persistent editable state。 |
| **R** | 2026-07-29 | [SkillRise: Agentic Reinforcement Learning for Cross-Task Skill Evolution](https://arxiv.org/abs/2607.26784) | 同一 policy 在 task solving 与 skill-document curation 两个角色间交替；训练时用跨任务 downstream reward 学“什么时候/怎样更新 skill”。 | runtime skill document + model weights（学会 curate）。 | **改**：同一 policy，经 RL 学习 curation action。<br>**执行**：Qwen3 系列 agent。 | agent + persistent skill doc。 | 当前任务 outcome + 下游任务对 skill edit 的 delayed credit。 | ALFWorld/WebShop/ScienceWorld；sequence-length scaling。 | M1 hybrid。 | 和 SkillOpt 不同：SkillOpt 冻结 target、外部 optimizer 训练 skill；SkillRise **训练模型学会 skill curation policy**。 |
| **K** | 2026-08-11 | [SHAPER: Self-Evolving Embodied Agents via Skill-Harness Evolution](https://arxiv.org/abs/2608.11350) | 冻结 foundation model，同一模型分别作为 planner/optimizer；利用 target-environment rollouts 同时改 reusable textual skill 与 context-code harness。 | skill + context-code harness。 | **改**：同一 frozen model optimizer role。<br>**执行**：frozen upper-level VLM planner；下层 VLA/API 也固定。 | seed planner + minimal/fixed action interface。 | episode summaries、execution statistics、environment rollout outcome；VLABench/ESI-Bench grounded evidence。 | VLABench 有 seen/unseen split；ESI-Bench 231 questions；target-env adaptation 后 eval。 | M1 same-model。 | 相对纯 skill evolution 多开放一个 **context-building code harness**，且在 fixed low-level interface 的 embodied setting 中验证。 |
| **C** | 2026-08-15 | [Evo-Harness: Context-to-Harness Skill Compilation for Self-Evolving Agents](https://arxiv.org/abs/2608.15071) | sequential one-shot tasks：失败后把完整 trajectory + grounded feedback 编译成 General/Topic natural-language skills，更新 external skill harness，只影响未来任务。 | natural-language skill harness。 | **改**：默认 Claude Opus 4.6 reflector/evolver；retrieval Sonnet 4.5。<br>**执行**：默认 Claude Opus 4.6 solver + current skill harness。 | 无/已有 skill harness；模型冻结。 | environment/verifier/unit-test/rubric feedback + full trajectory。 | 5 benchmark sequential prequential；另有 SWE train→freeze→unseen test。 | M1。 | 相对 earlier skill learning 的关键是系统比较 feedback grounding、skill granularity、solver/evolver pairing，并给 SWE train→freeze→test transfer。 |

#### A4. Full Harness / Self-Modifying Agent Program

| 优先级 | 时间 | 论文 | 本质定位 | 什么在变 | 谁来改 / 谁执行 | 基础 harness | Feedback | Evolution → Eval | Meta-depth | 相对之前真正新增什么 |
|---|---|---|---|---|---|---|---|---|---|---|
| **K** | 2024-10-06 | [Gödel Agent: A Self-Referential Agent Framework for Recursive Self-Improvement](https://arxiv.org/abs/2410.04444) | agent 可 inspect/modify 自己整个 executable logic，包括负责分析和修改自己的 procedure；更新后新 agent 继续下一轮。 | agent code/logic，包括 self-mod procedure。 | **改**：当前 agent 自己。<br>**执行**：修改后的同一 agent。 | CoT agent + think/error/Python/Bash/LLM API 等基础工具。 | task utility/validation score + runtime evidence。 | DROP/MGSM/MMLU/GPQA validation evolution → test；Game24 case。 | M2。 | 相对 ADAS 的本质差别：不再明确分开 fixed meta-agent 与 target agent；self-modification logic 也位于可编辑 program 中。 |
| **R** | 2025-04-21 | [A Self-Improving Coding Agent (SICA)](https://arxiv.org/abs/2504.15228) | coding agent 读取/修改自己的整个 Python codebase；archive 中当前 best agent 再作为 modifier 产生下一代。 | 完整 coding-agent implementation。 | **改**：当前 archive/best coding agent。<br>**执行**：其修改后 successor。 | 已有较强 coding harness：file/shell/calculator/subagents/overseer 等。 | 固定 benchmark utility，综合 performance/cost/time；execution feedback。 | 固定 SWE-bench Verified subset + LiveCodeBench 等反复优化；headline 多为 same-set adaptive。 | M2-ish：successor 可成为下一代 modifier，但 outer archive/utility fixed。 | 相对 Gödel Agent 更聚焦真实 coding-agent codebase 与 SWE-style benchmark，展示 executable self-mod 的工程可行性。 |
| **C** | 2025-05-29 | [Darwin Gödel Machine (DGM): Open-Ended Evolution of Self-Improving Agents](https://arxiv.org/abs/2505.22954) | 让 coding agents 修改自己的 code，并保留多个已验证 stepping stones 形成 open-ended archive，而不是只沿单一 best chain。 | coding-agent code/harness。 | **改**：archive 中 candidate agents 自己生成 descendants。<br>**执行**：descendant agents。 | self-mod coding agent seed。 | SWE/Polyglot executable tests + performance。 | SWE/Polyglot search；部分 final Polyglot 覆盖更多未用于 search tasks。 | M2。 | 相对 SICA 的新增主要是 **open-ended archive / diversity**，降低 greedy self-improvement 卡死在局部最优。 |
| **K** | 2026-02-10 | [AutoHarness: Improving LLM Agents by Automatically Synthesizing a Code Harness](https://arxiv.org/abs/2603.03329) | Gemini-2.5-Flash 根据 game environment 的 illegal-action feedback 自动写/改 code harness；极端情况下直接把整个 policy 编译成 code。 | code harness；甚至 full code policy。 | **改**：Gemini-2.5-Flash synthesizer/refiner。<br>**执行**：Gemini-2.5-Flash decision agent 或最终纯 code policy。 | TextArena raw action interface / minimal game agent。 | environment legality/error/reward。 | 145 TextArena games；16 single-player code-policy tests。 | M1 same-model。 | 相对通用 workflow search 的独特点：针对环境 action constraints 生成 **hard executable legality layer**，不是仅语言提示。 |
| **C** | 2026-03-19 | [Hyperagents](https://arxiv.org/abs/2603.19461) | 把 task agent 与 editable meta-agent 放入同一 program；meta-agent 不只改 task agent，也能修改自己的 self-modification procedure，并把 meta-improvements 跨 domain transfer。 | task-agent code + meta-agent code/self-mod procedure。 | **改**：editable meta-agent。<br>**执行**：task agent + meta-agent 同一 program。 | DGM-H / task+meta agent seed。 | domain task reward / evaluator；不同 domain 用不同 execution/judge。 | Polyglot、paper review、robotics reward design、IMO grading；有 largely unseen/full-set 与 cross-domain transfer。 | M2 强；outer parent-selection/evaluator 在主实验仍 fixed。 | 相对 DGM 的核心新点：coding domain 中“会写代码→会改自己”天然对齐，Hyperagents 显式拆出/可编辑 meta-agent，验证 **改进能力本身**能跨非 coding domain 迁移。 |
| **C** | 2026-03-30 | [Meta-Harness: End-to-End Optimization of Model Harnesses](https://arxiv.org/abs/2603.28052) | Claude Opus 4.6 + Claude Code 直接读取所有历史 harness source/score/full traces，搜索完整 executable harness。 | 完整 executable harness。 | **改**：Claude Opus 4.6 + Claude Code proposer。<br>**执行**：domain-specific frozen base model + candidate harness。 | classification/math 从较简单 seed；TB2 从 Terminus/Terminus-KIRA strong harness。 | search-set reward + full execution traces + historical harness code。 | classification/math 有 held-out；TB2 89 tasks same-set search/eval。 | M1 strong-to-weak/external modifier。 | 相对 ADAS/AFlow 更明确把 **model harness**（context/memory/retrieval/control flow/coding harness）当统一 edit object，并强调 raw-history observability。 |
| **C** | 2026-04-28 | [Agentic Harness Engineering (AHE)](https://arxiv.org/abs/2604.25850) | 冻结 GPT-5.4，Evolve Agent 编辑 system prompt、tools、middleware、skills、subagents、memory；Debugger 把超长 rollout 压成 evidence，edit manifest 记录 expected fixes/regressions 并验证/rollback。 | full executable coding harness。 | **改**：GPT-5.4 xhigh Evolve Agent；GPT-5.4 Debugger。<br>**执行**：GPT-5.4 high + current NexAU/AHE harness。 | NexAU strong coding harness。 | TB2 verifier + full traces + cross-iteration task delta。 | TB2 same 89 tasks 10 rounds；SWE-bench-V frozen transfer。 | M1 external modifier。 | 相对 Meta-Harness 最清楚的新点是 **Component / Experience / Decision Observability** 与 edit-level attribution/rollback；还做 component transplant。 |
| **K** | 2026-05-11 | [Continual Harness: Online Adaptation for Self-Improving Foundation Agents](https://arxiv.org/abs/2605.09998) | 不 reset environment，同一 long-horizon run 中周期性读取 trajectory window，CRUD 修改 prompt、subagents、skills、memory。 | prompt p、subagents G、skills K、memory M。 | **改**：LLM Refiner；通常同一 frontier model family。<br>**执行**：Pokemon embodied agent。 | 只有 frames/ASCII map/buttons 的 minimal interface。 | trajectory/history + game progress/failure。 | Pokemon Red/Emerald continuous runs；不是标准 train→freeze→held-out。 | M1 same-system。 | 相对 offline prompt/harness search 的独特点是 **reset-free online full-harness adaptation**，experience 一边产生一边改变后续 runtime。 |
| **K** | 2026-05-23 | [DemoEvolve: Overcoming Sparse Feedback in Agentic Harness Evolution with Demonstrations](https://arxiv.org/abs/2605.24539) | 研究 reward-only harness evolution 在长程随机环境为什么不稳定，并用 competent human demonstrations 作为 reference experience 给 coding proposer 做诊断和编辑。 | frozen agent 的 executable harness。 | **改**：coding proposer 根据 self-rollout 或 demonstration evidence 提 harness edits。<br>**执行**：固定 base LM + 当前 harness。 | task-specific executable harness。 | Liar’s Dice：self-rollout reward较可用；Balatro：稀疏随机 reward + human competent trajectories；tutorial text作为弱对照。 | 同环境预算下比较 reward-only / textual knowledge / demonstration-bootstrapped evolution；held-out generalization不是主证据。 | M1。 | 相对 AHE/自 rollout search 的新点不是更大的 editable space，而是直接改变 **feedback source**：当 sparse/high-variance reward 无法定位 failure 时，用 demonstration 提供可归因的行为参照。 |
| **C** | 2026-06-08 | [Self-Harness: Harnesses That Improve Themselves](https://arxiv.org/abs/2606.09498) | 不依赖更强 external builder：当前固定模型从自身 execution traces 中聚类 model-specific failures，提出 diverse/minimal harness edits，并经 regression validation 后 merge。 | non-parametric agent harness：instructions/tools/memory/state/runtime mechanisms 等 bounded executable edits；weights fixed。 | **改/执行**：同一 fixed base model，在 task-agent 与 proposer role 间切换；MiniMax M2.5、Qwen3.5-35B-A3B、GLM-5。 | minimal initial harness。 | held-in verifier-grounded execution failures + passing behaviors + previous edit summaries；candidate 由 held-in/held-out regression score gate。 | Terminal-Bench-2.0、SWE-bench Verified、AppWorld；held-out traces 不给 proposer，但 **held-out performance 每轮进入 acceptance rule**，因此不是 untouched final test。 | M1 same-model；proposal/evaluator/acceptance machinery fixed。 | 相对 Meta-Harness/AHE 的代表性新点是 **把 harness improver 内化到 target model 自身**，并围绕 model-specific weakness mining + bounded edit + regression gate 组织 loop；但 held-out score 参与 search，泛化证据需谨慎。 |
| **R** | 2026-06-18 | [ENPIRE: Agentic Robot Policy Self-Improvement in the Real World](https://arxiv.org/abs/2606.19980) | coding/research agent 在真实机器人上循环 reset→rollout→verify→诊断→修改 policy/training-infra/algorithm code→重跑。 | robot policy code、training infrastructure、algorithm code。 | **改**：coding agent / evolution agent。<br>**执行**：robot policy + real/sim robots。 | robot learning stack。 | real-world task verifier、rollout logs、performance。 | dexterous manipulation / robot fleets。 | M1/M2 substrate，outer loop fixed。 | 和 deployment harness evolution 相邻但不完全同类：可编辑对象已经扩到 **训练系统和算法代码**，更像 embodied AutoResearch。 |
| **K** | 2026-07-14 | [MemoHarness: Agent Harnesses That Learn from Experience](https://arxiv.org/abs/2607.14159) | 把 harness 分成 context/tool/generation/orchestration/memory/output 六个控制维度；从 labeled search cases 的 execution diagnosis 形成 case experience + global patterns，测试时按 case 检索并配置 harness。 | 六维 harness configuration + experience bank。 | **改**：search phase modifier/diagnosis LLM；test-time retriever/adaptor。<br>**执行**：base LLM + selected config。 | fixed configurable harness with six dimensions。 | search case score + diagnosis；test 无 feedback。 | search cases → held-out cases；并有跨 suite/base-model transfer。 | M1。 | 相对 Meta-Harness/AHE 的核心不同：不是搜索一个 global final harness，而是学习 **case-adaptive harness configuration policy/memory**，测试时无需 label/search。 |
| **C** | 2026-07-17 | [Recursive Harness Self-Improvement](https://arxiv.org/abs/2607.15524) | 把 user-constructed harness 表示成 **prompt-level agent-loop specification**，每轮只与上一 revision 的产物做一次 pairwise LLM preference，并把累计 self-comparison history 当作后续 update 的 momentum-like signal。 | agent roles/instructions、communication contracts、workflow hops、context-management prompt specification；**不搜索 executable code**。 | **改**：LLM harness optimizer 根据 current spec + revision-history preferences 写下一版。<br>**执行**：低 reasoning-effort research/coding agent under current harness。 | user-constructed prompt-level multi-agent loop。 | successive outputs/repositories 的 pairwise LLM judgment + accumulated revision history；不是 task-native formal verifier。 | 30 个 synthetic ML-research tasks（quant finance/robotics/pharmacy）上 task-specific iterative refinement；主证据不是独立 held-out task generalization。 | M1；optimizer/judge protocol fixed。 | 相对 Meta-Harness/Self-Harness 的核心差异是 **低成本 trajectory-local preference optimization**：不用 population search，也不要求 verifier pass-count；提升主要来自更好的 inter-agent information flow/context sparsification，而非更长 reasoning。 |
| **C** | 2026-08-03 | [HarnessCompass: Guiding Automatic Harness Evolution toward Generalizable and Effective Agent Harnesses](https://arxiv.org/abs/2608.01918) | 针对 full-harness evolution 的三类问题——task overfit、只依赖 trajectory outcome、组件同时改造成 interference——加入 task-agnostic constraint、agent first-person proactive feedback、component-wise evolve→consolidate。 | system prompt、tool descriptions/implementations、middleware、subagent configs、skills、long-term memory 等 full harness components。 | **改**：evolution meta-agent；各 component 分开优化后再 R³ merge。<br>**执行**：GPT-5.4 + 当前 harness（主 SWE-bench setting；role agents共享同 base model）。 | H0 为极简 harness（shell command tool，无 middleware/skills/subagents）并与 AHE 同 seed 比。 | trajectory grounded evidence + agent 第一人称 harness-use feedback（blind/hindsight/grounded variants）+ evaluation score；另有 generalization gate。 | SWE-bench Verified evolution sample 上5 turns；held-out tasks检验，另做跨模型 transfer。 | M1；modifier algorithm固定。 | 相对 AHE 的核心新增非常明确：**直接把 generalization、feedback richness、component interference 当 evolution algorithm 的设计目标**，不是事后分析。 |
| **C** | 2026-08-05 | [Argus: A General-Purpose Agentic Reasoning Runtime for Long-Horizon Tasks](https://arxiv.org/abs/2608.05144) | Manager/Planner/Engineer/Reviewer 分权；persistent state 中保存 memory/skills/verifiers/routing/rejected routes，并以 evidence/authority gate 才 commit 更新或 objective refinement。 | persistent runtime state、skills/memory/verifier guidance/routing，部分 operational objective。 | **改**：Argus 内部多角色共同更新。<br>**执行**：GPT-5.5 + Argus/Codex/Copilot backend。 | 固定 Manager–Planner–Engineer–Reviewer runtime。 | task-native evidence + Reviewer + authority confirmation。 | 7 arenas 多为 sequential/current benchmark；Math synthesis 有 dev/test。 | M1；framework roles fixed。 | 独特性不在“又能记忆”，而在 **verification-gated durable state + role separation + authorized pivot**。 |
| **K** | 2026-08-09 | [Hierarchical Self-Improvement: A Framework for Task-Specific Evolvable Agent Harnesses (HSI)](https://arxiv.org/abs/2608.08466) | 同一个 frozen LLM 分三层：task harness H 执行；evolver 改 H；meta-evolver 改 evolver strategy Σ；最外层 meta-evolver execution logic/selector仍冻结。 | task harness code（per-step policy/prompts/hooks/memory/tools）+ evolver strategy中的 seed/commit selection；outer anchor不变。 | **改**：同一 DeepSeek-V4-Flash-Preview 分别在 evolver/meta-evolver scope 自改。<br>**执行**：同一 frozen DeepSeek-V4-Flash-Preview 执行 current harness。 | BALROG task-specific seed harness；fixed `using_harness(agent,task)` seam；frozen outer meta-evolver anchor。 | environment progress reward，使用 stochastic lower-confidence-bound reward；dev eval 驱动 candidate selection。 | BALROG moderate tasks上 evolve；BabaIsAI 有20% unseen held-out split；NLE用于超出 backbone capability 的负例。 | M2：evolver strategy可改；outer anchor/selector仍固定。 | 非常直接地把 full-harness evolution 和 **meta-depth + capability ceiling** 放在同一 controlled setting：task-time thinking关、self-modification thinking开，并明确 feedback-fidelity/backbone-capability 两个 bound。 |
| **K** | 2026-08-10 | [OpenLoopEvolve: A Verifiable Self-Evolution Framework for Loop Policies in Long-Horizon Complex Tasks](https://arxiv.org/abs/2608.09380) | 把 observation/planning/memory/action/verification/recovery/stopping/budget 八类 control rule 显式化为 versioned Loop Policy；支持 online/offline evolution、Champion–Challenger、release monitor与 rollback。 | 八部分 Loop Policy +版本/lineage；模型weights不以更新为主。 | **改**：LLM proposer 生成候选 policy；固定 Champion–Challenger evaluation/release机制。<br>**执行**：long-horizon agent + 当前 Loop Policy。 | 初始 Loop Policy / YC-Bench runtime。 | online continuous-operation feedback 或 offline archived traces/failure evidence + task success/risk metrics。 | YC-Bench simulated business tasks；online release在后续 task boundary生效并监控，主要不是 sealed held-out protocol。 | M1。 | 相对“直接改一份 agent code”的新点是 **把长程 control policy 当治理化、可版本追踪的 harness asset**，并把 release/monitor/rollback纳入 evolution lifecycle。 |
| **C** | 2026-08-12 | [AI4AI at Test-Time: Strong-to-Weak Capability Transfer via Harnesses](https://arxiv.org/abs/2608.12307) | 强 builder 在约5% labeled validation 上反复看 scaffold accuracy 与错误样本 (x,gold,pred)，修改 executable scaffold；freeze 后弱 target 在95% hidden test。 | executable scaffold/harness。 | **改**：strong builder via Cursor/Claude Code/Codex；有 same-model control。<br>**执行**：主要 GPT-5.4-mini，另 Gemini-3.5-flash。 | vanilla frozen target + builder-generated scaffold。 | 显式 gold validation feedback。 | 195 validation → freeze → 3900 hidden test。 | M1 strong-to-weak；self control 较弱。 | 新点主要是 **干净的 strong-to-weak harness transfer protocol**，不是 recursive self-evolution。 |
| **K** | 2026-08-25 | [Meta$^n$: Recursive Self-Improvement through Emergent Depth](https://arxiv.org/abs/2608.24735) | Same-model layered harness evolution：把 successive edits 保留为当前 runtime 中同时生效的 append-only layers；不是 modifier 自身更新。 | strategic context + callable helper-code layer stack；base weights 与固定 $\Omega$ 不变。 | **改/执行**：Gemma 4 31B-IT 或 GPT-5.2 同一 frozen backbone；modifier 使用固定 $\Omega$ prompt。 | single-shot solver 或最多 8-turn `generate→execute→observe→refine` agentic solver。 | evaluator score + execution evidence；d2 raw traces，d≥3 performance/failure summary + representative traces + prior code stack。 | CO-Bench/S2D/LawBench/ARC-AGI-2 有 held-out；TB2/AlphaEvolve Math/SR/AlgoTune 为 same-set adaptive。 | M1（显式 layer depth 增长，但 modifier/search machinery 固定）。 | 真正新增更接近 **history as active composition**；并非首次利用 edit history。约 72% recursion gain 来自 inter-layer context conditioning。 |
| **C** | 2026-08-03 | [Harness-R1: Learning to Edit Executable Runtime Harnesses from Agent Failure Trajectories](https://arxiv.org/abs/2608.02276) | 专门 post-train 一个 9B Harness Engineer，把“读 failure trajectory→写 executable lifecycle hooks→target fresh rerun”训练成独立能力；target frozen。 | harness-editor model weights + executable runtime hooks；target weights不变。 | **改**：独立 Qwen3.5-9B Harness Engineer；cold-start teacher GPT-5.5，之后 online GRPO。<br>**执行**：frozen Qwen3.5-9B target。 | 自建 runtime-hook harness API（episode-init / pre-decision / pre-action / post-feedback）。 | target fresh rerun 的真实 task reward change。 | WebShop / ALFWorld / DBBench；held-out/eval tasks；另测 target fine-tune 后 editor 是否仍增益。 | learned-improver M1/M2-ish；editor 与 target 分离。 | 相对 Meta-Harness/Self-Harness 的真正新点是 **harness editing 本身被训练成模型能力**，而不是每次 prompting 一个 proposer。 |

### B. Non-Harness RSI / Hybrid：Harness + Weight / Learned Harness Policy

| 优先级 | 时间 | 论文 | 本质定位 | 什么在变 | 谁来改 / 谁执行 | 基础 harness | Feedback | Evolution → Eval | Meta-depth | 相对之前真正新增什么 |
|---|---|---|---|---|---|---|---|---|---|---|
| **C** | 2025-11-13 | [AgentEvolver: Towards Efficient Self-Evolving Agent System](https://arxiv.org/abs/2511.10395) | 把 self-evolving agent 训练拆成 Self-Questioning（自生成 task）、Self-Navigating（利用历史经验探索）、Self-Attributing（细粒度 credit），形成 2025–26 很有代表性的 training-loop self-evolution。 | policy weights + 自生成 task / experience / credit strategy；deployment harness不是主要对象。 | **改**：固定 RL/training pipeline + 多个 LLM 辅助模块。<br>**执行**：Qwen2.5-7B/14B policy。 | 标准 agent policy / AppWorld、BFCL interaction scaffold。 | environment outcome + LLM judge / attribution。 | AppWorld、BFCL v3；训练与最终评估按论文 split。 | model-level M1；outer learning algorithm fixed。 | 代表性在于把“数据从哪来、怎么探索、怎么分 credit”统一成 self-evolving training system；它是后续 RSI/model-level self-evolution 的重要基线，而不是 harness-only 方法。 |
| **R** | 2026-05-26 | [SIA: Self Improving AI with Harness & Weight Updates](https://arxiv.org/abs/2605.27276) | Feedback-Agent 根据 target trajectory/score 决定改 harness 还是改 weights；Meta-Agent 先生成 task agent，weight 更新可选择 LoRA/RL 等。 | harness + model weights。 | **改**：Claude Sonnet 4.6 Meta/Feedback agents（论文设置）；训练算法固定/可选择。<br>**执行**：task agent 如 gpt-oss-120B。 | Meta-Agent 生成的 task-specific harness。 | trajectory + benchmark score/verifier。 | LawBench、GPU TriMul、scRNA；LawBench 部分流程使用 test split reward，隔离有问题。 | M1 hybrid。 | 首次把 harness-update 与 test-time/model-weight update 放在统一 loop 中作为两个 action surface。 |
| **C** | 2026-07-16 | [SEED: Self-Evolving On-Policy Distillation for Agentic RL](https://arxiv.org/abs/2607.14777) | 当前 policy rollout 后自己充当 trajectory analyzer 生成 hindsight skill，再通过 OPD + GRPO 把 skill-conditioned action preference 蒸馏进 weights。 | model weights / policy；临时 hindsight skill 不持久部署。 | **改**：固定 GRPO+OPD；Stage1 外部 GLM-5.2 bootstrap，Stage2 current policy analyzer。<br>**执行**：当前 policy checkpoint。 | 普通 agent policy，无 persistent skill harness。 | environment terminal reward + trajectory。 | ALFWorld/WebShop/SearchQA train/eval 分开。 | model-level M1。 | 它不是 harness evolution；价值是作为对照：经验最终写回权重，skill 只是 training-time privileged signal。 |
| **R** | 2026-07-24 | [Teaching LLMs to Self-Evolve: Cultivating Core Meta-Skills with Reinforcement Learning (MetaEvolve)](https://arxiv.org/abs/2607.21971) | 在 coding 上用程序执行产生连续 verifiable fitness，合成多轮 evolution histories，并用 RL 训练模型掌握“看历史+看 fitness→提出更好改动”的 meta-skill；推理时再进入 evolutionary search。 | model weights（self-evolution meta-skill）；推理时 candidate program population/trajectory也变化。 | **改**：RL training algorithm 学 modifier policy；inference 使用训练后的同一 model做 evolutionary proposal。<br>**执行**：trained LLM evolution agent。 | coding evolutionary search harness + history/fitness context。 | test-case execution产生 correctness+efficiency verifiable reward；训练样本含当前程序、fitness、历史 attempts。 | 7 coding benchmarks ID/OOD + open-ended algorithm optimization transfer。 | model-level M1/M2 hybrid；runtime outer search/fitness固定。 | 和 MetaSkill-Evolve 的区别很关键：MetaSkill-Evolve **外部 meta-skill file 在变、backbone frozen**；MetaEvolve 则把 improver 能力 **写进模型 weights**，再用固定 evolutionary runtime 调用。 |
| **C** | 2026-08 | [BigBang: Pursuing Open-Ended Intelligence through Self-Evolving Synthesis of Verifiable Frontier Tasks](https://endlessfrontier.tech/assets/paper.pdf) | Generator Agent 改 data-synthesis code，Critic 用可验证 proxy，Meta-Critic 用 downstream training effect 校准生成/评价策略，然后 post-train model。 | data-synthesis program、critic criteria、data distribution、model weights。 | **改**：Generator/Critic/Meta-Critic loop。<br>**执行**：Qwen3.6 base→BigBang-V1 等。 | data-synthesis/research harness。 | formal/computation/simulation/tool verifier + downstream training effect。 | outer-loop real tasks用于 calibration；final 9 suites/11 rows。 | data-level M1/M2-ish。 | 这是 data/model co-evolution，不是 deployment harness evolution；但 feedback 设计（verifier + downstream outcome）很值得借鉴。 |
| **R** | 2026-08-05 | [EvoHarness-RL: Learning Self-Evolving Runtime Harness for Long-Horizon LLM Agents](https://arxiv.org/abs/2608.05446) | 预定义 Belief/Progress/Experience 外部 state 与 read/update/consolidate action；先 SFT 教 harness action，再 cost-aware GRPO 学 runtime harness-use policy。 | B/P/E runtime state + model weights/harness policy。 | **改**：SFT+GRPO training algorithm。<br>**执行**：Qwen3-8B ALFWorld agent。 | BPE harness schema + trainable action policy。 | environment task reward + cost。 | ALFWorld train→eval。 | M0/M1 hybrid。 | 名字叫 harness evolution，但本质不是 agent 自动重写 harness code：**harness state 在线变化，harness-use policy 离线训练**。 |
| **C** | 2026-08-10 | [Macaron-V1: Towards Open Continual Learning with Self-Improvement and Mixture-of-LoRA](https://arxiv.org/abs/2608.09819) | 系统把 deployable successor 定义为 versioned model–harness pair：MoL specialist adapters + HCP-carried prompts/skills/tools/hooks；MindForge Discovery→Expansion→Update。 | 设计上 model adapters + harness config；直接实验只 harness/config。 | **改**：MindForge/Expansion adaptive search。<br>**执行**：frozen GLM-5.2 base（RSI coverage study）或 Venti/Tall systems。 | HCP versioned model–harness resources。 | TerminalBench official reward + trajectory/config outcome。 | 122 selected frozen-base failure tasks 上 adaptive search，same-set cumulative coverage；无 frozen held-out successor。 | M1 hybrid substrate。 | 架构层面连接 model/harness continual learning，但论文最直接 RSI 实验只隔离 frozen-model configuration Expansion。 |
| **K** | 2026-08-14 | [HELIX: Model-Harness Co-evolution for Recursive Self-Improvement](https://arxiv.org/abs/2608.13951) | 把 harness evolution 不只当当前性能优化器，也当 **产生下一轮 model training data 的 trajectory generator**：固定 model 下搜索多样 sibling harness，收集成功/失败/near-miss/alternative verified trajectories，再设想更新 model 后重建 harness。 | typed harness atoms/recipes/runtime policies；设计上随后 model weights也应更新。 | **改**：HELIX evolution/search controller + LLM candidate builders；模型更新阶段由后训练 pipeline。<br>**执行**：fixed model + candidate sibling harnesses（当前 paper只展示一轮）。 | Pi-like code-repair harness decomposed into typed ports/atoms/recipes/product shells。 | SWE-bench executable verifier + repeated-run outcome + trajectory provenance。 | code repair 一轮：65 candidates；best fixed harness 与 sibling portfolio评估并导出200-slot training-data slice。 | M1 hybrid substrate；完整多代 M→H→M-prime→H-prime 尚未实证。 | 相对 SIA/Macaron 的新点是把 co-evolution 的接口做成 source-traceable typed substrate，并强调 **portfolio diversity带来的 data coverage**，而非只保留一个 best harness。 |
| **C** | 2026-07-30 | [Frontis-MA1: Training an AI4AI Model towards Recursive Self-Improvement in Machine Learning Engineering](https://arxiv.org/abs/2607.28568) | OpenMLE 全栈 + execution-grounded SFT/RL 训练 35B meta-evolution model，学习 Draft/Improve/Debug/Crossover operators，再用于长程 MLE evolutionary search。 | meta-evolution model weights + MLE program artifacts；outer evolutionary framework仍固定。 | **改**：Frontis-MA1 learned operators + OpenMLE-Evo。<br>**执行**：Frontis-MA1-35B 在 MLE research tasks 上搜索/改程序。 | OpenMLE-Gym/RL/Evo full-stack research harness。 | executable MLE score / benchmark outcome。 | MLE-Bench Lite + NatureBench Lite transfer；model-swap/framework-swap analysis。 | improver-level M2-ish。 | 代表性在于把“improver”本身训练成专门模型能力，并且模型权重、训练框架、搜索环境都开放；是 AI4AI→RSI 线的重要节点。 |

### C. Benchmark / Evaluation

| 优先级 | 时间 | 论文 | 本质定位 | 什么在变 | 谁来改 / 谁执行 | 基础 harness | Feedback | Evolution → Eval | Meta-depth | 相对之前真正新增什么 |
|---|---|---|---|---|---|---|---|---|---|---|
| **R** | 2025-05-26 | [MLR-Bench: Evaluating AI Agents on Open-Ended Machine Learning Research](https://arxiv.org/abs/2505.19955) | 不做 self-evolution；把 AI research 拆成 idea→proposal→experiment→paper，并用201个 workshop-derived research tasks + MLR-Judge评估。 | 系统不进化；被测的是research-agent capability。 | **改**：无 persistent modifier；benchmark流程固定。<br>**执行**：frontier LLM / coding agent 通过 MLR-Agent 执行 research task。 | MLR-Agent 四阶段 research scaffold。 | LLM-review rubric +实验 artifact/结果；MLR-Judge经人类验证。 | 201 open-ended ML research tasks；非 evolve→eval benchmark。 | Evaluation only。 | 它是后续“AI是否能改进AI”的 capability substrate：先暴露 **实验可信性** 而非只看最终文字质量。 |
| **R** | 2026-05-09 | [MLS-Bench: A Holistic and Rigorous Assessment of AI Systems on Building Better AI](https://arxiv.org/abs/2605.08678) | 140 tasks×12 domains，要求 agent 改进某个 ML component，并验证方法能跨 controlled settings generalize/scale；重点区分 engineering tuning 与真正 method invention。 | 被测 agent 不被要求 persistent self-evolve；评价其提出/验证更好 ML method 的能力。 | **改**：无 persistent modifier；benchmark evaluator固定。<br>**执行**：被测 frontier AI research/coding agents 自主执行 research。 | research/coding agent scaffold + task-provided baselines/experiments。 | 实验结果/validation across settings + benchmark scorer。 | 140 independent research tasks；controlled generalization/scaling checks。 | Evaluation only。 | 相对一般 coding/research benchmark 的新点是 **不只要在一个 setting涨分，还要证明 generalizable/scalable ML improvement**，更接近 AI4AI 能力上限。 |
| **C** | 2026-06-16 | [SEAGym: An Evaluation Environment for Self-Evolving LLM Agents](https://arxiv.org/abs/2606.17546) | 专门评估 self-evolving harness 的可靠性：train/update-validation、held-out ID/OOD、replay、cost、snapshot 分开记录，关注“持续更新是否真的持续变强”。 | benchmark本身不进化；被测的是不同 self-evolving methods 的 persistent harness/state。 | **改**：各被测方法自己的 updater。<br>**执行**：ACE、TF-GRPO、AHE 等方法/模型。 | 统一 evaluation environment / benchmark-specific harness。 | task verifier + held-out/replay/cost/snapshot metrics。 | Terminal-Bench 2.0 + HLE；多视角 evolution evaluation。 | Evaluation only。 | 重要性在负面证据：frequent update 不保证 held-out gain，best intermediate snapshot 继续 evolve 可能 collapse；把 retention/generalization/cost 从 final score 中拆出来。 |
| **C** | 2026-07-28 | [RSIBench-Data: Benchmarking Data-Centric Research for Recursive Self-Improvement](https://arxiv.org/abs/2607.25886) | 固定 post-training/serving/eval stack，只让 frontier researcher 根据 checkpoint feedback 改 training-data strategy。 | data strategy + candidate LoRA weights。 | **改**：Claude Code/Codex researcher agents。<br>**执行**：固定 Qwen3.5-35B-A3B target candidates。 | fixed Tinker/post-train/eval stack。 | 同一 eval tasks 的 score/trajectory/verifier outcome。 | selection 与 final official eval 使用同一 task subset。 | non-harness M1。 | 最重要发现不是“成功 RSI”，而是 discovery–reliability gap：能偶尔找到更好 strategy，却常在 peak 后 regression。 |
| **K** | 2026-08-04 | [ContinualSkillBench: Can LLM Agents Truly Evolve Their Capabilities?](https://arxiv.org/abs/2608.03874) | 五个 domain、每域100个相互关联且难度递增 subtasks，专门比较 sequential context adaptation 与显式 persistent skill maintenance。 | 被测 systems 的 context/skill library按各方法变化。 | **改**：各 skill-learning mechanism自身 updater。<br>**执行**：多种 LLM agent + skill/context condition。 | 同一任务流下对比 no/implicit/explicit skill mechanisms。 | previous-task context/outcome/feedback；benchmark观察后续task improvement。 | 5×100 sequential subtasks，prequential；不是传统 freeze-heldout。 | Evaluation of M0/M1 skill evolution。 | 关键贡献不是再提 skill method，而是给了一个很重要的 **skill abstraction counterfactual**：如果只保留上下文也一样好，那么所谓 skill evolution gain 可能只是 context/feedback adaptation。 |
| **K** | 2026-08-06 | [HarnessOpt-Bench: Evaluating LLMs at Harness Optimization](https://arxiv.org/abs/2608.06301) | 把 harness optimization 本身作为 LLM capability：optimizer=LLM+coding harness，给 seed target harness、graded eval feedback、固定 evaluation budget，最后提交一个 candidate在 inaccessible held-out test 上评分。 | 被测 optimizer修改 target agent harness；benchmark本身固定。 | **改**：不同 frontier LLM optimizer，在 shared coding harness与native harness两种条件下。<br>**执行**：固定 target agent 执行 optimizer 提交的 candidate harness。 | 每个 downstream task的 seed target-agent harness。 | graded evaluation feedback，固定 target-evaluation budget；test partition完全不可访问。 | 4 downstream tasks、111 scored runs；search/selection→held-out test。 | Evaluation of M1 optimizer capability。 | 相比方法论文，最大的价值是 **统一预算 + trusted execution boundary + held-out normalized gain**，把 optimizer model capability 与 target harness performance分开测。 |
| **C** | 2026-08-10 | [Evo-Bench: Can Language Models Improve Agent Harness?](https://arxiv.org/abs/2608.09096) | 专门测 model intrinsic harness-evolving capability：固定 policy model与minimal CodeAct seed，evolver在validation上长程改 executable harness，freeze后在sealed evaluation测。 | evolver产出的 executable harness；policy model固定。 | **改**：9个 frontier/open-weight evolver models；同预算20 iterations/1000 evolver steps/48h。<br>**执行**：固定 policy model 在 candidate harness 下执行 Search/Office/General tasks。 | 统一 minimal CodeAct harness + fixed policy model。 | 160 validation tasks上的native scorer/trajectory/evaluation feedback；448 evaluation tasks sealed。 | 608 harness-sensitive tasks：Search(BrowseComp,HLE) 320，Office(GDPval,APEX-Agents)192，General(Claw-Eval)96；160 val→448 sealed eval。 | Evaluation of M1 harness-evolving capability。 | 相对 HarnessOpt-Bench 更进一步做 **harness-sensitive task construction**：先用完全disjoint auxiliary tasks产生代表性 evolved harnesses，再筛选真正会对 harness变化敏感的任务，并按sensitivity/difficulty分层切分。 |
| **K** | 2026-08-18 | [ASI-Bench: At the Dawn of Artificial Superintelligence](https://arxiv.org/abs/2608.17271) | 60个project-level research tasks×11科学domain，逐级撤掉 human methodological guidance，测创新探索+自主科学执行。 | 系统不进化；改变的是 human guidance level。 | **改**：无 persistent modifier；benchmark仅改变 methodological guidance。<br>**执行**：18个 agent-model configurations 执行 project-level research。 | 各自 research agent harness。 | expert-reviewed tasks + sandbox execution + scorer validation。 | full guidance / method-specified / autonomous method-selection 三档。 | Evaluation only。 | 它不是 self-evolution benchmark；独特点是 **在同一research project逐步减少“人类告诉你怎么做”**，直接测 agent能否自己选择方法并完成可验证科研。 |
| **C** | 2026-08-31 | [Aspire: Can Models Self-Evolve from Vague Goals?](https://arxiv.org/abs/2608.31111) | 只给自然语言 capability goal，不给 downstream eval；agent需自己解释目标、选数据/update method、构造train/validation signal、决定何时评估；最终在hidden expert-authored 520 items上测。 | 允许 model weights 与 agent harness evolution；具体由agent自行选择。 | **改**：被测 self-evolution agent/researcher 负责决定并实施 update。<br>**执行**：同一被测 system 既作为 learner/modifier，也执行自己的验证与训练/harness-edit workflow。 | 统一 interactive environment，可执行训练与harness edit。 | agent自建 training/validation signals；真正 downstream hidden eval完全不可见。 | 6 vague capability goals→hidden 520 expert items。 | Evaluation of end-to-end self-evolution。 | 这是对现有 self-evolution benchmark 一个非常关键的反转：**不再把任务和metric都给清楚**，直接测试 agent能否建立正确的 improvement objective与self-evaluation。 |

## 2. Core｜经典/代表论文详细介绍

> 这里只展开 **Core 主干 + 少数系统级代表作**。进入 Core 的标准是领域代表性，而不是“实验最干净”；每篇仍单独写证据边界。其余论文保留在全量表格中，不重复铺开。

### 2003-09 / 2006 — [Gödel Machines: Self-Referential Universal Problem Solvers Making Provably Optimal Self-Improvements](https://arxiv.org/abs/cs/0309048)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 把整个机器代码（包括 proof searcher 自身）纳入可重写对象；只有证明 rewrite 提高期望 utility 才执行。 **相对前序：** 这是最干净的理论 M3：不是“optimizer 固定地改 policy”，而是 optimizer/proof searcher 也在同一可编辑代码里。 |
| **什么在变** | 机器任意代码，包括负责证明/寻找 rewrite 的代码。 |
| **谁来改 / 谁执行** | **改：** 机器内部 proof searcher；rewrite 后 modifier 本身可改变。 **执行：** 同一 Gödel Machine。 |
| **基础 harness** | 初始 program + axioms + utility + proof-searcher。 |
| **Feedback** | 形式证明：rewrite 的预期 utility 优于继续搜索。 |
| **Evolution → Eval / Meta-depth** | 理论构造，无现代 benchmark。 **Meta-depth：** M3。 |
| **主要结果** | 条件式全局最优 self-rewrite 理论。 |
| **最关键限制 / 对我们的意义** | 需要可形式化 utility/axioms/proof，现实 agent 很难满足。 **对我们：** 我们讨论“严格 recursive”的上界定义；现代 M2 工作大都仍固定 evaluator/selection。 |

### 2023-03-20 — [Reflexion: Language Agents with Verbal Reinforcement Learning](https://arxiv.org/abs/2303.11366)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | actor 执行任务，evaluator 给 outcome，reflector 把失败/成功转成自然语言 reflection 存入 episodic memory，供同任务后续 trial 使用。 **相对前序：** 相对 Self-Refine 的关键差别是 reflection 成为 persistent memory；但主要用于同一任务重试，不是跨 task lifelong skill learning。 |
| **什么在变** | episodic reflection memory。 |
| **谁来改 / 谁执行** | **改：** 固定 reflector prompt；actor/evaluator/reflector 可由同/不同 LLM 角色承担。 **执行：** LLM actor。 |
| **基础 harness** | actor + evaluator + reflector + memory buffer。 |
| **Feedback** | binary/scalar task feedback；可来自环境、unit tests、answer metric。 |
| **Evolution → Eval / Meta-depth** | ALFWorld/HotPotQA/HumanEval 等，多为同 task 多 trial。 **Meta-depth：** M0：memory content 变，memory update mechanism fixed。 |
| **主要结果** | 多任务显著提升；HumanEval Rust ablation 中无 generated tests 的 self-reflection 可退化，而 tests+reflection 提升。 |
| **最关键限制 / 对我们的意义** | 容易把同题重试收益误解为跨任务 self-evolution。 **对我们：** persistent textual experience 的经典起点；也直接支持“grounded feedback 才可靠”。 |

### 2023-05-25 — [Voyager: An Open-Ended Embodied Agent with Large Language Models](https://arxiv.org/abs/2305.16291)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | GPT-4 在 Minecraft 中自动提出 curriculum、写/调试 executable code skills，把通过环境验证的程序存入 skill library 并检索复用。 **相对前序：** 相对文字 reflection/memory，关键跃迁是经验变成 **可执行、可复用 code skill**。 |
| **什么在变** | skill library contents（code skills）。 |
| **谁来改 / 谁执行** | **改：** GPT-4 skill synthesizer/debugger；curriculum/retrieval procedure fixed。 **执行：** GPT-4-based Minecraft agent + Mineflayer。 |
| **基础 harness** | automatic curriculum + skill library + iterative prompting。 |
| **Feedback** | environment state、execution errors、self-verification。 |
| **Evolution → Eval / Meta-depth** | 开放式 Minecraft lifelong run；另测新世界/新任务 skill transfer。 **Meta-depth：** M0/M1：skill content evolves，skill system fixed。 |
| **主要结果** | 3.3× unique items、15.3× faster tech milestones、2.3× farther travel（论文口径）。 |
| **最关键限制 / 对我们的意义** | 没有独立 held-out evolution protocol；domain 特殊。 **对我们：** executable skill evolution 的经典起点，后续 AgentFactory/ASPIRE/Alita-G 都应与它比较。 |

### 2024-08-15 — [Automated Design of Agentic Systems (ADAS)](https://arxiv.org/abs/2408.08435)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | Meta Agent Search 让 LLM 直接发明 executable agent code，并把历史 agent archive 当作搜索经验。 **相对前序：** 相对 prompt optimizer 的核心跃迁：editable object 变成整个 code-represented agent architecture，可同时包含 prompt、tool use、control flow、multi-agent logic。 |
| **什么在变** | 完整 agent program（受接口约束）。 |
| **谁来改 / 谁执行** | **改：** 通常更强 GPT-4-class meta-agent；search/meta prompt 固定。 **执行：** candidate agent 的 target LLM（实验常用 GPT-3.5 等）。 |
| **基础 harness** | 一个极简可编程 agent skeleton / seed archive。 |
| **Feedback** | validation task metric + runtime/error feedback。 |
| **Evolution → Eval / Meta-depth** | 多个任务有 validation search → held-out test，并测跨 domain/model transfer。 **Meta-depth：** M1：完整 task-agent code 变，但 meta-agent/search fixed。 |
| **主要结果** | ARC/reasoning/coding 等自动发现的 agent design 可优于人工 baseline，并有迁移。 |
| **最关键限制 / 对我们的意义** | 主 setting 是 strong meta-agent 设计 target agent，不是严格 self-RSI。 **对我们：** Meta-Harness/AHE 的直接前驱之一，应该在 related work 中出现。 |

### 2025-05-29 — [Darwin Gödel Machine (DGM): Open-Ended Evolution of Self-Improving Agents](https://arxiv.org/abs/2505.22954)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 让 coding agents 修改自己的 code，并保留多个已验证 stepping stones 形成 open-ended archive，而不是只沿单一 best chain。 **相对前序：** 相对 SICA 的新增主要是 **open-ended archive / diversity**，降低 greedy self-improvement 卡死在局部最优。 |
| **什么在变** | coding-agent code/harness。 |
| **谁来改 / 谁执行** | **改：** archive 中 candidate agents 自己生成 descendants。 **执行：** descendant agents。 |
| **基础 harness** | self-mod coding agent seed。 |
| **Feedback** | SWE/Polyglot executable tests + performance。 |
| **Evolution → Eval / Meta-depth** | SWE/Polyglot search；部分 final Polyglot 覆盖更多未用于 search tasks。 **Meta-depth：** M2。 |
| **主要结果** | SWE 约20→50、Polyglot 14.2→30.7；open-ended archive ablation 显著。 |
| **最关键限制 / 对我们的意义** | self-mod prompt/selection/evaluator仍 fixed；SWE 泛化隔离有限。 **对我们：** 核心启发不是“能改代码”，而是 evolution 需要 population/stepping-stone preservation。 |

### 2025-12-21 — [MemEvolve: Meta-Evolution of Agent Memory Systems](https://arxiv.org/abs/2512.18746)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 不仅积累 memory $M_t$，还在 modular design space 中进化 memory architecture Ω：Encode / Store(Update) / Retrieve / Manage。 **相对前序：** 这是 memory 谱系的实质跃迁：从“memory 中有什么”升级为“**怎么记、怎么取、怎么管理**也被优化”。 |
| **什么在变** | experiential memory + memory architecture/code。 |
| **谁来改 / 谁执行** | **改：** meta-evolution operator（实验常用 GPT-5-mini）生成/选择 descendant memory designs。 **执行：** SmolAgent、Flash-Searcher 等 target agents；可同/跨模型迁移。 |
| **基础 harness** | agent + candidate memory architecture from EvolveLab。 |
| **Feedback** | trajectory success、token/query/replay 等性能与效率反馈。 |
| **Evolution → Eval / Meta-depth** | GAIA/WebWalkerQA/xBench/TaskCraft；含跨 task/model/framework transfer。 **Meta-depth：** M1+：memory mechanism 变，但 outer Pareto selection/evolution protocol fixed。 |
| **主要结果** | 最高提升约 17.06%，且 memory designs 可跨 benchmark/backbone 迁移。 |
| **最关键限制 / 对我们的意义** | 严格 recursive 仍有限：meta-evolution algorithm 本身不开放。 **对我们：** 和 ALMA 一起是我们必须重点引用的 memory-mechanism evolution。 |

### 2026-02-08 — [ALMA: Learning to Continually Learn via Meta-learning Agentic Memory Designs](https://arxiv.org/abs/2602.07755)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | Meta Agent 直接搜索 executable memory design code，包括 schema、update、retrieval；找到的设计供弱 target agent 在 sequential environment 中持续记忆。 **相对前序：** 和 A-MEM 的本质区别：A-MEM 只让 memory graph 自组织；ALMA 让 **memory algorithm/code 本身**成为搜索对象。 |
| **什么在变** | memory design code + runtime memory contents。 |
| **谁来改 / 谁执行** | **改：** GPT-5 Meta Agent；target/evaluator 主设置 GPT-5-nano，另测 transfer。 **执行：** GPT-5-nano/mini 等 agent。 |
| **基础 harness** | minimal agent + candidate memory design implementing fixed interface。 |
| **Feedback** | environment reward / validation performance。 |
| **Evolution → Eval / Meta-depth** | ALFWorld/TextWorld/Baba Is AI/MiniHack；memory design search 后在 unseen/sequential tasks 使用，并测 transfer。 **Meta-depth：** M1：memory mechanism 变，meta-search fixed且常 strong-to-weak。 |
| **主要结果** | nano overall 对 no-memory +6.2，transfer 到 mini +12.8（论文汇总）。 |
| **最关键限制 / 对我们的意义** | 不是 same-model recursive RSI；builder 明显更强。 **对我们：** 评估“单个 harness component 是否能在 held-out 上真正进化”的极好参考。 |

### 2026-03-30 — [Meta-Harness: End-to-End Optimization of Model Harnesses](https://arxiv.org/abs/2603.28052)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | Claude Opus 4.6 + Claude Code 直接读取所有历史 harness source/score/full traces，搜索完整 executable harness。 **相对前序：** 相对 ADAS/AFlow 更明确把 **model harness**（context/memory/retrieval/control flow/coding harness）当统一 edit object，并强调 raw-history observability。 |
| **什么在变** | 完整 executable harness。 |
| **谁来改 / 谁执行** | **改：** Claude Opus 4.6 + Claude Code proposer。 **执行：** domain-specific frozen base model + candidate harness。 |
| **基础 harness** | classification/math 从较简单 seed；TB2 从 Terminus/Terminus-KIRA strong harness。 |
| **Feedback** | search-set reward + full execution traces + historical harness code。 |
| **Evolution → Eval / Meta-depth** | classification/math 有 held-out；TB2 89 tasks same-set search/eval。 **Meta-depth：** M1 strong-to-weak/external modifier。 |
| **主要结果** | full trace/history 显著优于 score/summary；classification/math held-out 和 transfer 有收益；TB2 strong seed 仍可涨。 |
| **最关键限制 / 对我们的意义** | 前两类 seed/simple baselines 较弱；最有说服力的 TB2 又没有 held-out。 **对我们：** 我们当前最直接 baseline：应复制其 modifier 可见信息，但改进评估协议。 |

### 2026-04-28 — [Agentic Harness Engineering (AHE)](https://arxiv.org/abs/2604.25850)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 冻结 GPT-5.4，Evolve Agent 编辑 system prompt、tools、middleware、skills、subagents、memory；Debugger 把超长 rollout 压成 evidence，edit manifest 记录 expected fixes/regressions 并验证/rollback。 **相对前序：** 相对 Meta-Harness 最清楚的新点是 **Component / Experience / Decision Observability** 与 edit-level attribution/rollback；还做 component transplant。 |
| **什么在变** | full executable coding harness。 |
| **谁来改 / 谁执行** | **改：** GPT-5.4 xhigh Evolve Agent；GPT-5.4 Debugger。 **执行：** GPT-5.4 high + current NexAU/AHE harness。 |
| **基础 harness** | NexAU strong coding harness。 |
| **Feedback** | TB2 verifier + full traces + cross-iteration task delta。 |
| **Evolution → Eval / Meta-depth** | TB2 same 89 tasks 10 rounds；SWE-bench-V frozen transfer。 **Meta-depth：** M1 external modifier。 |
| **主要结果** | TB2 69.7→77.0；收益主要 memory/tool/middleware；SWE-V accuracy only +0.4pp但token -12%；发现 regression blindness。 |
| **最关键限制 / 对我们的意义** | headline same-set；held-out accuracy gain 很小；Explore Agent 还注入外部 prior。 **对我们：** 特别值得学 component attribution、regression prediction 与 rollback。 |

### 2026-05-22 — [SkillOpt: Executive Strategy for Self-Evolving Agent Skills](https://arxiv.org/abs/2605.23904)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 把单一 natural-language skill document 当成 frozen agent 的“可训练外部参数”；optimizer 基于 scored rollouts 做 bounded add/delete/replace，只有 held-out validation 严格变好才接受。 **相对前序：** 相对 loose reflection 最大的新点是 **optimization discipline**：mini-batch、textual LR、validation gate、rejected buffer、slow update。 |
| **什么在变** | 一个 skill document。 |
| **谁来改 / 谁执行** | **改：** separate optimizer LLM；也测 target-as-optimizer。 **执行：** 7 target models × direct/Codex/Claude Code 等 harness。 |
| **基础 harness** | 目标 agent + optional skill file。 |
| **Feedback** | 完整 scored trajectories + verifier score；selection validation gate。 |
| **Evolution → Eval / Meta-depth** | 6 benchmarks；train/selection/test 分开；还有 cross-model/harness/benchmark transfer。 **Meta-depth：** M1（slow/meta guidance 不是 M2，outer optimizer logic fixed）。 |
| **主要结果** | 52/52 cells best/tied-best；GPT-5.5 no-skill 平均 +19~25pt；skill 可跨 harness/model 迁移。 |
| **最关键限制 / 对我们的意义** | 强 optimizer 时带有 strong-to-weak 成分；skill edit space仍单文档。 **对我们：** 目前最值得我们学的 harness-component evolution protocol：validation gate、rollback、transfer、rejected edits。 |

### 2026-06-08 — [Self-Harness: Harnesses That Improve Themselves](https://arxiv.org/abs/2606.09498)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | same-model harness self-improvement 的代表。它把 Meta-Harness/AHE 中“外部更强 proposer 改 target harness”内化为：**target model 自己根据自己在当前 harness 下暴露的 failure pattern 改自己的 harness**。核心 loop 是 Weakness Mining → Harness Proposal → Proposal Validation。 |
| **什么在变** | 模型权重固定；变的是 non-parametric agent harness，包括 instructions、tools、memory/state/runtime mechanisms 等 bounded edits。 |
| **谁来改 / 谁执行** | **同一个 fixed base model**既执行任务又在 proposer role 下产生 harness edits；实验覆盖 MiniMax M2.5、Qwen3.5-35B-A3B、GLM-5。 |
| **基础 harness** | minimal initial harness；因此能较清楚观察不同模型最后长出不同 model-specific harness。 |
| **Feedback** | proposer 只看 held-in 失败的 verifier-grounded cluster、passing behavior 与 previous edit summaries；不是看全部 raw failed tasks 逐题 patch。 |
| **Evolution → Eval** | Terminal-Bench-2.0、SWE-bench Verified、AppWorld。需要特别注意：论文把 split 称为 held-in / held-out，**held-out trace 不给 proposer，但 held-out score 在每轮 regression validation 中参与 candidate acceptance**。所以它不是严格 `evolve→freeze→untouched test`。 |
| **主要结果** | 九个 model×benchmark setting 的最终 harness 都同时提升 held-in 与 held-out pass rate；TB2 held-out 例如 MiniMax 40.5→61.9、Qwen 23.8→38.1、GLM 42.9→57.1。 |
| **为什么是经典 / 关键限制** | 经典性在于它非常直接地回答“**模型能不能自己改自己的 operating harness？**”；但 evidence 不能 overclaim 为严格 unseen generalization，因为 held-out score 进入 search/acceptance loop。 |

### 2026-07-06 — [MetaSkill-Evolve: Recursive Self-Improvement of LLM Agents via Two-Timescale Meta-Skill Evolution](https://arxiv.org/abs/2607.05297)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 每个 branch 同时带 task skill s 与 meta-skill m=(Analyzer ψ, Retriever σ, Allocator α, Proposer π, Evolver ε)；task skill 快速进化，meta-skill 慢速进化，而且同一 improvement pipeline 被用来改它自己。 **相对前序：** 这是和我们 meta-depth 最直接的工作之一：以前 skill evolution 只改“做什么”，这里把 **“怎么分析、取经验、分配 credit、提案、合并 skill”** 五个 improver component 也变成 branch-local persistent editable state。 |
| **什么在变** | task skill + 五部分 meta-skill；共享 frozen backbone weights 不变。 |
| **谁来改 / 谁执行** | **改：** 同一五角色 improvement pipeline；slow loop 让该 pipeline 对自己的 meta-skill 做更新。 **执行：** Analyzer/Retriever/Allocator/Proposer/Evolver 全部共享一个 frozen backbone；task solver使用当前 skill。 |
| **基础 harness** | 固定五角色 wiring + 当前 task skill/meta-skill files。 |
| **Feedback** | execution traces + task outcome/labels/verifier；meta-skill 的价值通过后续 task-skill evolution 的 downstream performance体现。 |
| **Evolution → Eval / Meta-depth** | OfficeQA、SealQA、ALFWorld 上 evolution data 与 held-out test 分开；test 不参与 branch evolution。 **Meta-depth：** M2：improver representation 自身进化；但 outer task objective、五角色 wiring、selection/eval protocol仍固定。 |
| **主要结果** | held-out test 相对 raw backbone +23.54 / +16.09 / +1.92 pt；也优于 static-skill 与 single-level evolution。 |
| **最关键限制 / 对我们的意义** | 不能说成完全 self-referential RSI：最外层 pipeline topology和 objective没变；meta-loop收益也会和更大 search/state capacity混在一起。 **对我们：** 这篇应作为我们研究“meta-depth 是否真的带来额外 improvement”的核心比较对象。 |

### 2026-07-17 — [Recursive Harness Self-Improvement](https://arxiv.org/abs/2607.15524)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | prompt-level harness self-improvement 的代表。与 Meta-Harness 的 population/code search、Self-Harness 的 verifier regression 不同，RHI 每轮只比较当前 revision 与上一 revision 的产物，用累计 pairwise preference history 引导下一次修改。 |
| **什么在变** | prompt-level agent loop：roles/instructions、subagent–orchestrator communication contracts、workflow hops、context-management rules；**不是 full executable harness code**。 |
| **谁来改 / 谁执行** | LLM harness optimizer 写下一版 prompt specification；target research/coding agent 在当前 harness 下执行 30 个 synthetic ML-research tasks。 |
| **基础 harness** | user-constructed low-reasoning-effort multi-agent loop。 |
| **Feedback** | LLM evaluator 对 successive repositories/outputs 做 pairwise preference；累计 self-comparison history作为 update signal。 |
| **Evolution → Eval** | 30 个 quant-finance / robotics / pharmacy synthetic ML-research tasks 上做 task-specific refinement；主证据不是独立 held-out task transfer。 |
| **主要结果** | 几轮修改即可让 low-reasoning-effort agent 超过对应 maximum-reasoning-effort setting，并报告最高约 60% inference-cost reduction；分析认为收益主要来自更有效的 inter-agent information flow，而非生成更长 reasoning。 |
| **为什么是经典 / 关键限制** | 它代表了 **廉价、局部、preference-based harness refinement** 这条路线；但 editable space 偏 prompt/workflow，pairwise judge 也是外部固定边界，且不等于 full-harness recursive self-improvement。 |

### 2026-07-28 — [RSIBench-Data: Benchmarking Data-Centric Research for Recursive Self-Improvement](https://arxiv.org/abs/2607.25886)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | RSI evaluation 的代表作之一：固定 post-training / serving / evaluation stack，只开放 **training-data strategy**，看 frontier researcher 能不能利用 checkpoint feedback 持续找到更好的 candidate。它最重要的不是某个方法，而是把 **discovery 与 reliability** 拆开。 |
| **什么在变** | researcher 的 data strategy；每轮从同一 base 训练新的 target LoRA candidate。deployment harness 不进化。 |
| **谁来改 / 谁执行** | Claude Code / Codex researcher systems 改 data strategy；固定 Qwen3.5-35B-A3B-Base candidate checkpoint执行评测。 |
| **基础 harness** | fixed Tinker post-training backend + fixed serving/eval stack，尽量隔离 data-centric research 变量。 |
| **Feedback** | evaluation score、trajectory、verifier outcome、execution diagnostics；protected eval labels/trajectories不能直接作为 supervision，但同一任务产生的 feedback会进入下一轮决策。 |
| **Evolution → Eval** | 最大问题：**selection 和 final official eval 使用同一 task subset**（含 SWE/TB2/GPQA/AIME 等）；因此更像 adaptive optimization set，不是 held-out generalization。 |
| **主要结果** | 14/24 settings 后续 candidate 超过 first valid；但达到 historical best 后继续搜的 23 settings 中 **18/23 最终低于 peak**。这就是 discovery–reliability gap。 |
| **为什么是经典 / 对我们意义** | 它把我们最关心的“**能不能发现提升 ≠ 能不能稳定持续提升**”直接变成 benchmark observation；rollback、best preservation、stopping、真正 held-out eval 都因此变成 RSI 的一等问题。 |

### 2026-08-03 — [HarnessCompass: Guiding Automatic Harness Evolution toward Generalizable and Effective Agent Harnesses](https://arxiv.org/abs/2608.01918)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 针对 full-harness evolution 的三类问题——task overfit、只依赖 trajectory outcome、组件同时改造成 interference——加入 task-agnostic constraint、agent first-person proactive feedback、component-wise evolve→consolidate。 **相对前序：** 相对 AHE 的核心新增非常明确：**直接把 generalization、feedback richness、component interference 当 evolution algorithm 的设计目标**，不是事后分析。 |
| **什么在变** | system prompt、tool descriptions/implementations、middleware、subagent configs、skills、long-term memory 等 full harness components。 |
| **谁来改 / 谁执行** | **改：** evolution meta-agent；各 component 分开优化后再 R³ merge。 **执行：** GPT-5.4 + 当前 harness（主 SWE-bench setting；role agents共享同 base model）。 |
| **基础 harness** | H0 为极简 harness（shell command tool，无 middleware/skills/subagents）并与 AHE 同 seed 比。 |
| **Feedback** | trajectory grounded evidence + agent 第一人称 harness-use feedback（blind/hindsight/grounded variants）+ evaluation score；另有 generalization gate。 |
| **Evolution → Eval / Meta-depth** | SWE-bench Verified evolution sample 上5 turns；held-out tasks检验，另做跨模型 transfer。 **Meta-depth：** M1；modifier algorithm固定。 |
| **主要结果** | sample 54→66%（5 iterations）；held-out 60.4%，高于 AHE 54.7%；total 61.0 vs AHE 55.5/seed 51.8。 |
| **最关键限制 / 对我们的意义** | 起点仍很简；主实验集中 SWE coding；多个新机制一起加入，三者独立贡献虽有分析但整体 attribution仍不如单变量。 **对我们：** 这是 AHE 后最应该读的改进：直接处理我们关心的 overfit、component interference 与 richer feedback。 |

### 2026-08-05 — [Argus: A General-Purpose Agentic Reasoning Runtime for Long-Horizon Tasks](https://arxiv.org/abs/2608.05144)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | persistent runtime / harness-state evolution 的代表。不是直接重写整个 harness source，而是让 memory、skills、verifier guidance、routing、rejected routes、operational contract 等 durable state 在长期执行中被验证后 commit。 |
| **什么在变** | persistent memory/skills/knowledge/verifier/routing/failure state，部分 operational objective/constraint；模型权重与 Manager–Planner–Engineer–Reviewer 大框架基本固定。 |
| **谁来改 / 谁执行** | Argus 内部 Manager / Planner / Engineer / Reviewer 分权更新；GPT-5.5 + Codex/Copilot 等 backend执行。 |
| **基础 harness** | 固定四角色 runtime + durable project state + review/revision/rollback gate。 |
| **Feedback** | task-native executable/quantitative evidence + Reviewer judgment；material objective change 还需要 authority/user confirmation。 |
| **Evolution → Eval** | SWE-Bench Pro 等主 arenas 多是 sequential/current benchmark accumulation，没有统一 `evolve→freeze→held-out`；Math synthesis 有 dev/test，因而证据强度不统一。 |
| **主要结果** | 完整 runtime 在 SWE-Bench Pro 等任务上显著优于 direct backend，并观察到 reviewer rescue、state reuse 与 objective pivot；但多个机制和额外 test-time compute 同时变化。 |
| **为什么是经典 / 关键限制** | 经典性在于它把“持续改进”做成了 **有治理的 durable runtime state**：不是所有 reflection 都写回，只有 evidence-backed candidate 才 commit；同时它也是 story–evidence gap 的好例子——主 benchmark 并不能干净证明 objective pivot/self-evolution 本身带来 gain。 |

### 2026-08-10 — [Evo-Bench: Can Language Models Improve Agent Harness?](https://arxiv.org/abs/2608.09096)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 专门测 model intrinsic harness-evolving capability：固定 policy model与minimal CodeAct seed，evolver在validation上长程改 executable harness，freeze后在sealed evaluation测。 **相对前序：** 相对 HarnessOpt-Bench 更进一步做 **harness-sensitive task construction**：先用完全disjoint auxiliary tasks产生代表性 evolved harnesses，再筛选真正会对 harness变化敏感的任务，并按sensitivity/difficulty分层切分。 |
| **什么在变** | evolver产出的 executable harness；policy model固定。 |
| **谁来改 / 谁执行** | **改：** 9个 frontier/open-weight evolver models；同预算20 iterations/1000 evolver steps/48h。 **执行：** 固定 policy model 在 candidate harness 下执行 Search/Office/General tasks。 |
| **基础 harness** | 统一 minimal CodeAct harness + fixed policy model。 |
| **Feedback** | 160 validation tasks上的native scorer/trajectory/evaluation feedback；448 evaluation tasks sealed。 |
| **Evolution → Eval / Meta-depth** | 608 harness-sensitive tasks：Search(BrowseComp,HLE) 320，Office(GDPval,APEX-Agents)192，General(Claw-Eval)96；160 val→448 sealed eval。 **Meta-depth：** Evaluation of M1 harness-evolving capability。 |
| **主要结果** | 所有9个 evolver都提升 seed；best absolute +16.6；Search gain最大、Office最难；常 early saturation后regress；evolved harness跨policy model transfer。 |
| **最关键限制 / 对我们的意义** | 任务是先按 harness sensitivity筛过的，绝对 gain不能外推所有agent tasks；固定policy设定也不是same-model self-RSI。 **对我们：** 目前和我们最贴的 benchmark：尤其 Search 含 BrowseComp/HLE，可直接研究 Task×Model×Feedback×Editable与peak/regression。 |

### 2026-08-10 — [Macaron-V1: Towards Open Continual Learning with Self-Improvement and Mixture-of-LoRA](https://arxiv.org/abs/2608.09819)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | model–harness continual learning / co-evolution 的代表系统。它最重要的 framing 是把 successor 定义成 **versioned model–harness pair**，用 HCP 把 prompt/skill/tool/hook/session/workspace 等 harness resources 与 adapter/data/eval lineage 绑定。 |
| **什么在变** | 设计上同时允许 specialist LoRA/model revision + harness/config revision；但论文最直接 RSI coverage experiment **只改 harness/config，model frozen**。 |
| **谁来改 / 谁执行** | MindForge/Expansion adaptive search 改 HCP-carried resources；直接 coverage study 用 frozen GLM-5.2-FP8 base，整体产品线另有 Venti/Tall model–harness systems。 |
| **基础 harness** | HCP-versioned prompts/skills/tools/hooks + Mixture-of-LoRA architecture / MindForge lifecycle。 |
| **Feedback** | TerminalBench official reward + trajectory/configuration outcomes + version/audit lineage。 |
| **Evolution → Eval** | 122 个预先选出的 frozen-base failure tasks 上 adaptive search；最终 **仍在同一 122 tasks 上统计 cumulative coverage**，没有一个 frozen single-successor held-out test。 |
| **主要结果** | adaptive search 最终可覆盖 122/122 failure tasks，但 best single full-set configuration 只有 11/122；说明不同 failures 能被不同 harness config 激活，不等于存在一个 100% successor。 |
| **为什么是经典 / 关键限制** | 它是目前 **model–harness pair / continual-learning infrastructure** 最有代表性的系统之一；但必须明确：论文没有证明完整 Expansion→Update→下一代 pair 的多代 compounding，直接实验主要还是 frozen-model harness search。 |

### 2026-08-12 — [AI4AI at Test-Time: Strong-to-Weak Capability Transfer via Harnesses](https://arxiv.org/abs/2608.12307)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 强 builder 在约5% labeled validation 上反复看 scaffold accuracy 与错误样本 (x,gold,pred)，修改 executable scaffold；freeze 后弱 target 在95% hidden test。 **相对前序：** 新点主要是 **干净的 strong-to-weak harness transfer protocol**，不是 recursive self-evolution。 |
| **什么在变** | executable scaffold/harness。 |
| **谁来改 / 谁执行** | **改：** strong builder via Cursor/Claude Code/Codex；有 same-model control。 **执行：** 主要 GPT-5.4-mini，另 Gemini-3.5-flash。 |
| **基础 harness** | vanilla frozen target + builder-generated scaffold。 |
| **Feedback** | 显式 gold validation feedback。 |
| **Evolution → Eval / Meta-depth** | 195 validation → freeze → 3900 hidden test。 **Meta-depth：** M1 strong-to-weak；self control 较弱。 |
| **主要结果** | vanilla avg .488；scaffolded mean .763；best .912；validation-best 与 hidden r=.96。 |
| **最关键限制 / 对我们的意义** | feedback 很强（gold label）；ToM task 结构规则，human-inspired harness 仍更高。 **对我们：** 我们应借它的 evolution→freeze→hidden 协议，而不是照搬强 builder/gold feedback。 |

### 2026-08-15 — [Evo-Harness: Context-to-Harness Skill Compilation for Self-Evolving Agents](https://arxiv.org/abs/2608.15071)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | sequential one-shot tasks：失败后把完整 trajectory + grounded feedback 编译成 General/Topic natural-language skills，更新 external skill harness，只影响未来任务。 **相对前序：** 相对 earlier skill learning 的关键是系统比较 feedback grounding、skill granularity、solver/evolver pairing，并给 SWE train→freeze→test transfer。 |
| **什么在变** | natural-language skill harness。 |
| **谁来改 / 谁执行** | **改：** 默认 Claude Opus 4.6 reflector/evolver；retrieval Sonnet 4.5。 **执行：** 默认 Claude Opus 4.6 solver + current skill harness。 |
| **基础 harness** | 无/已有 skill harness；模型冻结。 |
| **Feedback** | environment/verifier/unit-test/rubric feedback + full trajectory。 |
| **Evolution → Eval / Meta-depth** | 5 benchmark sequential prequential；另有 SWE train→freeze→unseen test。 **Meta-depth：** M1。 |
| **主要结果** | 5 benchmarks 全提升；纯 self-generated feedback 在 CL/SWE 反而退化；SWE frozen skill 68.8→73.4。 |
| **最关键限制 / 对我们的意义** | General/Topic 都是 bench 内，不是跨 benchmark universal skill；主 protocol 仍用同 benchmark stream。 **对我们：** 和我们 feedback×model×editable-space 分析最直接，尤其验证了 self-feedback contamination。 |

### 2026-08-31 — [Aspire: Can Models Self-Evolve from Vague Goals?](https://arxiv.org/abs/2608.31111)

| 维度 | 我们的统一判断 |
|---|---|
| **定位 / 真正新点** | 只给自然语言 capability goal，不给 downstream eval；agent需自己解释目标、选数据/update method、构造train/validation signal、决定何时评估；最终在hidden expert-authored 520 items上测。 **相对前序：** 这是对现有 self-evolution benchmark 一个非常关键的反转：**不再把任务和metric都给清楚**，直接测试 agent能否建立正确的 improvement objective与self-evaluation。 |
| **什么在变** | 允许 model weights 与 agent harness evolution；具体由agent自行选择。 |
| **谁来改 / 谁执行** | **改：** 被测 self-evolution agent/researcher 负责决定并实施 update。 **执行：** 同一被测 system 既作为 learner/modifier，也执行自己的验证与训练/harness-edit workflow。 |
| **基础 harness** | 统一 interactive environment，可执行训练与harness edit。 |
| **Feedback** | agent自建 training/validation signals；真正 downstream hidden eval完全不可见。 |
| **Evolution → Eval / Meta-depth** | 6 vague capability goals→hidden 520 expert items。 **Meta-depth：** Evaluation of end-to-end self-evolution。 |
| **主要结果** | 当前 agents能完成training/harness-edit loops，但weight gain稀少不稳定；strongest evolved harness仍低于 engineered Qwen-Agent；常出现local self-eval gain不迁移hidden eval，继续search还擦除已有提升。 |
| **最关键限制 / 对我们的意义** | goal interpretation与search混在一起，不能像Evo-Bench那样纯隔离 harness modifier能力。 **对我们：** 和我们的 reliability/ceiling问题高度一致：**会迭代不代表知道该优化什么；self-eval misalignment本身就是失败源。** |

### 2025-11-13 — [AgentEvolver: Towards Efficient Self-Evolving Agent System](https://arxiv.org/abs/2511.10395)

| 维度 | 内容 |
|---|---|
| **本质定位** | 不是 deployment harness evolution，而是 **agent training-loop self-evolution**：同时解决 task data、trajectory exploration、credit assignment 三个瓶颈。 |
| **什么在变** | Qwen2.5 policy weights；同时训练过程持续自生成 tasks、复用 experience、产生更细粒度 credit。 |
| **谁来改 / 谁执行** | 执行者是 Qwen2.5-7B/14B policy；外层 Self-Questioning / Navigating / Attributing 与 RL pipeline 固定，另使用外部 LLM 做 synthesis/judge/attribution。 |
| **基础 harness** | AppWorld / BFCL agent interaction scaffold；不是把 runtime harness code 当 edit target。 |
| **Feedback** | environment outcome + judge / attribution signal。 |
| **核心结果** | 旧调研记录中：avg@8 7B **15.8→45.2**，14B **29.8→57.6**；Self-Questioning 是最大的第一步 gain，三模块联合最好。 |
| **为什么经典** | 它是“self-evolving agents”这波里非常早、传播很广的完整训练框架之一；之后许多工作都会把“自生成经验→利用经验→写回 policy”作为 model-level 对照。 |
| **边界** | improver/training algorithm 本身并没有递归改变；严格说更像 model-level adaptive RL，而不是 harness RSI。 |

### 2026-03-19 — [Hyperagents: Self-Referential Agents that Modify Their Own Modification Process](https://arxiv.org/abs/2603.19461)

| 维度 | 内容 |
|---|---|
| **本质定位** | 把 task agent 与 meta-agent 放进同一个 editable program；**meta-agent 可以修改“如何修改 agent”的 procedure**，直接触及 improver-level RSI。 |
| **什么在变** | task-agent code + meta-agent code / self-modification procedure。 |
| **谁来改 / 谁执行** | editable meta-agent 产生修改；task agent 执行 domain task。官方实现允许 meta-agent 修改 repo 任意部分，包括自身 prompt/code。 |
| **Feedback** | domain-specific empirical utility / evaluator + archive selection。 |
| **核心新点** | 相比 DGM，最重要不是“又会改 agent code”，而是把 DGM 中相对隐含/固定的 modification procedure 显式做成 editable meta-agent，并测跨 coding、paper review、robotics、grading 的迁移。 |
| **为什么经典** | 它几乎就是“improver improvement”这一分支的定义性工作之一；和我们的 meta-depth / modifier 是否也在变问题直接对应。 |
| **边界** | outer parent selection、archive、evaluator 仍固定，因此还不是 full M3 self-reference。 |

### 2026-06-16 — [SEAGym: An Evaluation Environment for Self-Evolving LLM Agents](https://arxiv.org/abs/2606.17546)

| 维度 | 内容 |
|---|---|
| **本质定位** | 不提出新的 evolver，而是专门问：**一个 self-evolving agent 到底是真的变强，还是只在 update data 上涨分？** |
| **评什么** | train / update-validation / held-out ID / OOD / replay / cost / snapshots；把 discovery、retention、generalization 和 cost 拆开。 |
| **基础 setting** | Terminal-Bench 2.0 + HLE；比较 ACE、TF-GRPO、AHE 等不同 evolution styles。 |
| **核心结论** | frequent update 不保证 held-out improvement；最好 intermediate snapshot 继续 evolve 可能 collapse；experience source、backend、update schedule 都会影响 reliability。 |
| **为什么经典** | 它代表 2026 后半段非常重要的 **evaluation correction wave**：以后不能只报一个 final score，就声称“self-evolution 成功”。 |
| **对我们最重要** | 我们做 capability ceiling / 系统性行为偏移时，本质上也应该采用这种“evolution trajectory + snapshot + held-out counterfactual”的思路。 |

### 2026-07-16 — [SEED: Self-Evolving On-Policy Distillation for Agentic Reinforcement Learning](https://arxiv.org/abs/2607.14777)

| 维度 | 内容 |
|---|---|
| **本质定位** | 当前 policy 自己 rollout，再用当前 checkpoint 充当 trajectory analyzer 生成 hindsight skill，把 skill 对 sampled action 的影响通过 OPD + GRPO 写回 weights。 |
| **什么在变** | policy weights；hindsight skill 是训练时 privileged signal，不作为 persistent deployment harness。 |
| **谁来改 / 谁执行** | Stage-2 actor/analyzer 是当前 policy checkpoint；外层 GRPO+OPD algorithm 固定；Stage-1 有 GLM-5.2 bootstrap。 |
| **Feedback** | environment terminal reward +完整 trajectory。 |
| **核心结果** | 旧记录：ALFWorld 75.0→91.8、WebShop 63.3→78.9；dynamic/on-policy skill 优于 static skill，并有 unseen generalization。 |
| **为什么经典** | 它是 model-level endogenous self-evolution 的一个非常清晰、效果强、开源的代表；用来和 harness-only 路线对照很重要。 |
| **边界** | “self-evolving”主要是 actor/analyzer checkpoint 同步刷新；training algorithm 并未被模型自己重写。 |

### 2026-07-30 — [Frontis-MA1: Training an AI4AI Model towards Recursive Self-Improvement in Machine Learning Engineering](https://arxiv.org/abs/2607.28568)

| 维度 | 内容 |
|---|---|
| **本质定位** | **learned improver / AI4AI**：不是 prompt 一个通用 frontier model，而是专门训练 35B meta-evolution model 学 Draft / Improve / Debug / Crossover。 |
| **什么在变** | Frontis-MA1 的 meta-evolution能力写进 weights；运行时再持续修改 MLE programs。 |
| **基础 harness** | OpenMLE-Gym / RL / Evo 全栈；execution-grounded program-evolution environment。 |
| **Feedback** | executable MLE score / benchmark outcome。 |
| **核心结果** | MLE-Bench Lite：base **39.39→60.61**，Evo-Max **71.21**；NatureBench 做 model-swap / framework-swap transfer。 |
| **为什么经典/热度高** | 这篇不是“小众 harness trick”，而是 2026 AI4AI/RSI 主线里非常显眼的系统性工作；OpenMLE 与模型权重均开放，社区关注也高。 |
| **边界** | learned improver 已变强，但 outer evolutionary search framework 没有再被下一代 improver递归重写。 |

### 2026-08-03 — [Harness-R1: Learning to Edit Executable Runtime Harnesses from Agent Failure Trajectories](https://arxiv.org/abs/2608.02276)

| 维度 | 内容 |
|---|---|
| **本质定位** | 把 **harness editing 当成可以 post-train 的独立模型能力**。这是和 Meta-Harness / Self-Harness 本质不同的一条路线。 |
| **什么在变** | Harness Engineer weights + 它生成的 executable lifecycle hooks；target frozen。 |
| **谁来改 / 谁执行** | target=Qwen3.5-9B；editor=另一个 Qwen3.5-9B Harness Engineer；cold-start teacher=GPT-5.5。 |
| **基础 harness** | runtime hook API：episode-init / pre-decision / pre-action / post-feedback。 |
| **Feedback** | candidate patch 后让 frozen target fresh rerun；真实 task reward delta 用作 online GRPO reward。 |
| **核心结果** | target 平均 success **44.3→53.6 (+9.3pp)**；target 自己先 fine-tune 后仍能 **59.2→64.2**。 |
| **为什么经典** | 它第一次把“会不会改 harness”从一次次 prompting frontier model，变成专门可学习、可比较的 editor capability；对我们以后拆 self-diagnosis / self-edit capability 非常重要。 |
| **边界** | 不是同一个 target 自己改自己；editor 冷启动也依赖 GPT-5.5 teacher。 |

## 3. 最近已深读但暂不列 Core：保留关键判断

### 2026-08-25 — [Meta$^n$: Recursive Self-Improvement through Emergent Depth](https://arxiv.org/abs/2608.24735)

| 维度 | 结论 |
|---|---|
| **为什么不是 S** | 和 Self-Harness / Meta-Harness / AHE 的核心能力重合较高；它没有让 modifier $\Omega$ 自身更新，因此不能把 “meta-depth 增长”直接解释成 improver self-improvement。 |
| **真正新增** | **history as active composition**：successive edits 不是 merge/overwrite 后只留一个 current harness，而是保留成当前 runtime 中同时生效的 append-only executable layers，后层可 retain/suppress/override/combine 前层。 |
| **最重要实证** | recursion 有收益，但约 **72% gain 来自 inter-layer context conditioning**；depth 并非越深越好，d2→d3 有明显 regression。 |
| **关键缺口** | 缺 `nested layers vs flatten/merge with identical history access` 的严格对照，因此还不能证明 nested representation 本身是收益来源。 |

## 4. 跨论文结论：现在真正需要记住什么

| 问题 | 跨论文结论 |
|---|---|
| **历史上真正发生的变化** | `当前输出 self-correction → persistent memory/reflection → executable skill/tool → memory/skill mechanism → workflow/agent program → full harness → improver/meta-skill`。不要用论文是否自称 RSI 来判断 novelty。 |
| **最重要的 distinction** | **state 在变 ≠ mechanism 在变 ≠ improver 在变。** Reflexion/Voyager 主要是 M0；ALMA/SkillOpt/Meta-Harness 是 M1；DGM/MetaSkill-Evolve 才触及 M2。 |
| **Feedback** | 多条独立证据都指向：无 grounded verifier 时，reflection 容易把错误写进 persistent state。Evo-Harness 甚至直接观察到 pure self-feedback regression。 |
| **Generalization** | 现在最普遍的证据缺口不是“能不能搜到过更高分”，而是 **freeze 后能否在 held-out tasks 保留**。AI4AI、ALMA、SkillOpt、Evo-Bench 的协议比 same-set headline 更值得学。 |
| **基础 harness** | 从 minimal/raw interface 大涨，与从成熟 harness 继续提升，不是同一种证据。Meta-Harness/AHE 的价值之一正是让这个差异变得可见。 |
| **Regression / reliability** | AHE、HarnessCompass、Evo-Bench、Aspire 都说明 improvement 非单调：会修复不代表会预见 collateral regression；local evaluator 变好也不代表 hidden capability 变好。 |
| **对我们最有区分度的问题** | 仍然是 **capability ceiling + systematic behavior drift**：evolution 到底是在 eliciting latent capability、学到可泛化 procedure，还是 benchmark-specific overfit / cheat / judge gaming。 |

## 5. 下一步阅读优先级

如果目标是 **最快建立领域主干**，不要按 80 篇顺序读，先按下面四组：

1. **历史/范式**：Gödel Machines → Reflexion → Voyager → DGM → AgentEvolver。
2. **Harness 主线**：Meta-Harness → AHE → Self-Harness → RHI → Harness-R1。
3. **更接近 RSI / improver**：Hyperagents → SEED → Frontis-MA1 → Macaron-V1 / BigBang。
4. **怎么判断它到底 work 不 work**：SEAGym → RSIBench-Data → Evo-Bench → Aspire。

对于我们现在要做的 **Harness 自进化 capability ceiling / 系统性行为偏移**，不建议再只看 6 篇，而是按问题分三组：

1. **Harness 方法本体（先看它到底怎么改）**：`Meta-Harness + AHE + Self-Harness + Evo-Harness`。
2. **最干净/最直接的 harness-evolution 评测骨架**：`VeRO → HarnessOpt-Bench → Evo-Bench → HarnessDev`。这条线能看出评测如何从 instrumentation 逐渐走到 held-out、harness-sensitive task、Creation-vs-Evolution、cross-runtime transfer。
3. **我们真正想研究的 failure / ceiling**：`SEAGym + RSIBench-Data + GDPevo + PATH-Bench + Aspire`。其中 **GDPevo 的 oracle ceiling**、PATH-Bench 的 interference/forgetting、Aspire 的 hidden objective mismatch 都比“又一个更高 evolved score”更贴近我们的差异化问题。

如果只允许再精读 **8 篇**，我会选：`Meta-Harness、AHE、Self-Harness、Evo-Bench、HarnessDev、SEAGym、RSIBench-Data、GDPevo`。PATH-Bench / Aspire 随后补。

但写 related work / 讲领域版图时，必须把 **AgentEvolver、Hyperagents、SEED、Frontis-MA1、Harness-R1、Argus、Macaron-V1、BigBang** 放回来；否则会把 2026 RSI 的主流叙事读窄成“只改 deployment harness”。
