# Belgrade Monumental — Flutter Developer EasyInterview Prep

**Interview:** 2 September 2026, 09:30  
**Role:** Flutter Developer (Cross-Platform App Rewrite)  
**Expected format:** EasyInterview live technical screen, likely 45–60 minutes.

> Use this document only for preparation before the interview. Once the live interview starts, follow the platform rules and do not use external assistance if prohibited.


<a id="top"></a>

## Clickable index

Use the sticky pills, or jump here:

| Area | Jump |
|---|---|
| What this role is | [Role](#role) |
| Public product | [Product](#product) |
| 60–90s intro | [Intro](#intro) |
| Q1–Q5 Migration / parity / arch / offline / maps | [Q1](#q1) · [Q2](#q2) · [Q3](#q3) · [Q4](#q4) · [Q5](#q5) |
| Q6–Q10 Production / perf / AI / validate / release | [Q6](#q6) · [Q7](#q7) · [Q8](#q8) · [Q9](#q9) · [Q10](#q10) |
| Q11–Q15 Native vs Flutter / week 1 / scope / API / debug | [Q11](#q11) · [Q12](#q12) · [Q13](#q13) · [Q14](#q14) · [Q15](#q15) |
| Live coding / Dart / Flutter | [Live](#live-coding) · [Dart](#dart) · [Flutter](#flutter) |
| Mini system design | [Design](#system-design) |
| AI-first workflow | [AI workflow](#ai-workflow) |
| Stories | [Stories](#stories) · [A](#story-a) · [B](#story-b) · [C](#story-c) |
| Truth boundaries | [Truth](#truth) |
| Questions to ask | [Ask](#questions) |
| Morning checklist | [Morning](#morning) |
| EasyInterview behavior | [Behavior](#behavior) |
| Rapid recall / final | [Rapid](#rapid) · [Final](#final) |

---
<a id="role"></a>
## 1. What this role is really about

This is not a greenfield Flutter app. The company already has separate native iOS and Android apps. The job is to understand the existing behavior, define parity, unify both products into one Flutter codebase, preserve UX/behavior, support maps/location/offline/cache/REST, and use AI-assisted development as a real daily workflow.

Core positioning:

> **I can understand an existing product, define its behavioral contract, migrate it incrementally to Flutter, validate parity, and use AI to accelerate delivery without outsourcing engineering judgment.**

<a id="product"></a>
## 2. Public product observations

The public app-store descriptions show:
- an interactive monument map,
- monument stories/details,
- location/visit behavior,
- a reward/voucher mechanic after visiting monuments,
- a Monument of the Day feature,
- content for Belgrade and Boka Kotorska.

A useful observation: iOS and Android public store metadata show different release recency. That does not prove functional divergence, but it is a good reason to ask whether one platform is the source of truth.

Best interview question:

> How aligned are the current iOS and Android implementations today? If they differ, is one platform considered the source of truth, or is part of the migration deciding which behavior the Flutter app should preserve?

<a id="intro"></a>
## 3. 60–90 second introduction

> I’m a senior mobile and product engineer with more than nine years of professional software development experience and over six years focused on Flutter and Dart.
>
> For nearly four years I’ve worked remotely with a US-based product company, building and maintaining production Flutter mobile and web products across architecture, REST and GraphQL integrations, Firebase, local persistence, automated testing, CI/CD, observability, and production reliability.
>
> A lot of my strongest work has been around understanding existing systems rather than only building isolated screens — debugging cross-stack issues, improving reliability, working with API contracts, and carrying features through production support.
>
> I also use AI-assisted engineering heavily in my daily workflow, including Cursor, Codex, Claude, and ChatGPT for repository analysis, implementation planning, refactoring, testing, and documentation. I use them to reduce the cost of understanding and changing a codebase, but architecture, validation, and production responsibility remain mine.
>
> That combination is why this role interests me: it’s a real native-to-Flutter migration with production users, clear parity requirements, and an AI-first engineering approach.

<a id="likely"></a>
# 4. The 10 most likely questions

<a id="q1"></a>
## Q1 — How would you migrate two existing native apps to Flutter?

Strong opening:

> I would not start by rewriting screens. I would start by defining the behavioral contract of the existing applications.

Structure:

**Inventory → parity matrix → architecture → vertical slices → validation → staged release**

Sample answer:

> First, I’d inventory both native applications: screens, user journeys, API contracts, local data, permissions, analytics, edge cases, and platform-specific behavior.
>
> I’d create a feature-parity matrix that makes differences between iOS and Android explicit.
>
> Next I’d establish a maintainable Flutter foundation — feature-first modules, clear presentation/domain/data boundaries, dependency injection, error handling, navigation, networking, persistence, and tests.
>
> I would migrate in vertical slices rather than rewriting everything before validating anything. For example, monument browsing/details first, then maps/location, then visit/reward behavior and offline support.
>
> Each slice would be validated against the native apps using automated tests where practical and explicit manual parity checks.
>
> Finally, I’d use a staged rollout with crash, performance, and product telemetry so regressions can be detected before fully replacing the native apps.

Likely follow-ups:
- Why vertical slices?
- Which feature first?
- What if iOS and Android differ?
- What is the rollback plan?

<a id="q2"></a>
## Q2 — How would you ensure feature parity?

> I’d define parity before implementation instead of relying on memory or visual similarity.
>
> My parity matrix would include happy paths, loading states, empty states, errors, permissions, offline behavior, background/resume behavior, analytics, and platform-specific differences.
>
> For critical flows, I’d document expected inputs, outputs, and side effects, then validate Flutter against those contracts. A screen can look identical while behaving differently when location is denied, connectivity disappears, or the app resumes from background.

Senior signal:

> **Parity is a product-specification problem before it is a coding problem.**

<a id="q3"></a>
## Q3 — What architecture would you choose?

> I prefer a feature-first modular structure with clear boundaries between presentation, domain logic, and infrastructure/data concerns.
>
> I don’t want the state-management package itself to become the architecture. Networking, repositories, caching, domain rules, and platform services should remain independently testable.
>
> For a rewrite, I would optimize for clarity, incremental migration, and team maintainability rather than designing the most elaborate architecture possible on day one.

If asked about BLoC:

> My deepest production state-management experience is with GetX and Redux-style approaches, and I’m comfortable with BLoC/Cubit concepts and patterns. The underlying concerns — predictable state transitions, separation of side effects, dependency boundaries, and testability — are familiar to me.

<a id="q4"></a>
## Q4 — How would you design offline support?

> I’d first classify data by offline requirement instead of making the whole app offline-first by default.
>
> Monument metadata, images/content users have already accessed, and other read-heavy reference data are good caching candidates. I’d define cache freshness and invalidation explicitly.
>
> For user-generated state, such as visit progress or actions that can happen offline, I’d use durable local persistence with explicit synchronization state, idempotent operations where possible, and retry when connectivity returns.
>
> I’d also make pending/syncing states visible so the UI never lies to the user.

Offline maps:

> I would confirm the selected map provider’s caching/offline-tile capabilities and licensing before promising an offline-map architecture.

<a id="q5"></a>
## Q5 — How would you handle maps and location?

> I’d isolate location and map concerns behind platform/service abstractions rather than spreading permission logic across widgets.
>
> Permission handling should explicitly support granted, denied, restricted, and permanently denied states on both platforms.
>
> I’d request only the minimum permission the product needs, consider location accuracy and battery usage, and treat lifecycle changes carefully because foreground/background behavior differs between iOS and Android.
>
> If proximity is used to mark monuments as visited, I’d clarify the required accuracy, spoofing tolerance, whether checks happen only in foreground, and how ambiguous GPS readings are handled.

<a id="q6"></a>
## Q6 — Tell me about a difficult production mobile problem you solved.

Use the photo-upload reliability story:

> We had intermittent photo-upload failures in a production Flutter workflow, especially in poor connectivity, and the issue was difficult to reproduce consistently.
>
> I analyzed around 30 days of production telemetry covering more than 3,000 upload events and then ran controlled weak-network tests. The data showed that connectivity, rather than general application slowness, was the main factor.
>
> We introduced persistent local state and connectivity-aware retry so pending requests could recover when the network stabilized while preserving the existing backend contract.

Follow-up — Why not increase timeout?

> Because connectivity could disappear entirely. Increasing the timeout would make the UI appear stuck for longer without improving recoverability.

Follow-up — Why not rewrite the backend?

> I prefer the smallest reliable solution supported by evidence. The existing backend contract was usable, so extra infrastructure would have increased complexity before proving it was necessary.

<a id="q7"></a>
## Q7 — Give an example of measurable performance improvement.

> I investigated a production login flow that took around 10 seconds before reaching the organization page.
>
> By tracing the real execution path and removing unnecessary state work and delays, we reduced it to about 5.8 seconds, roughly a 42% improvement.
>
> The important part was measuring the actual path first rather than guessing which widget or network call was slow.

<a id="q8"></a>
## Q8 — How does AI actually make you faster?

This is one of the most important questions for this role.

> I use AI primarily to reduce the cost of understanding and changing a codebase, not simply to generate more code.
>
> I usually give the agent bounded context: the relevant implementation, API contract, coding conventions, acceptance criteria, and test commands. For non-trivial work I ask for an implementation plan before code.
>
> Once the plan is validated, I let the agent work on a small slice. Then I review the diff, run analyzers and tests, verify architecture boundaries, and manually validate important behavior.
>
> I use Cursor, Codex, Claude, and ChatGPT regularly for repository analysis, planning, refactoring, test generation, debugging, and documentation.
>
> Small, well-specified tasks work much better than asking an agent to “rewrite the app,” because they reduce context drift and make incorrect assumptions easier to detect.

Strong phrase:

> **AI increases my throughput; it does not transfer ownership of the decision.**

<a id="q9"></a>
## Q9 — How do you validate AI-generated code?

> I treat AI-generated code like code written by another engineer: useful, but untrusted until reviewed.
>
> I check whether it respects the architecture and existing contracts, verify third-party API assumptions, inspect the actual diff, run static analysis and tests, and manually exercise lifecycle, error, and edge-case behavior where appropriate.
>
> I also prefer small commits and bounded scopes because large generated diffs are harder to reason about safely.

If asked about hallucinated APIs:

> If the model introduces an API or package behavior I’m not certain about, I verify it from the actual package source or official documentation before accepting the change.

<a id="q10"></a>
## Q10 — How would you test and release the rewrite?

> I’d combine unit tests for domain/repository logic, widget tests for important UI behavior, integration tests for critical journeys, and explicit parity checks against the native applications.
>
> I’d also test platform-specific cases such as permissions, lifecycle transitions, poor connectivity, old cache data, and OS-version differences.
>
> For release, I would avoid a single big-bang replacement if possible. I’d use staged rollout, monitor crashes/performance, compare key product metrics against the native baseline, and maintain a clear rollback path.

<a id="additional"></a>
# 5. Additional likely questions

<a id="q11"></a>
## Q11 — How do you decide whether something belongs in Flutter or native code?

> I prefer Flutter for product and domain logic shared across platforms. I move into native code only when platform APIs, performance constraints, SDK limitations, or lifecycle behavior make it the better boundary.
>
> If native integration is required, I keep the platform interface narrow and explicit so the rest of the app does not become coupled to platform details.

<a id="q12"></a>
## Q12 — What would you do in your first week?

> I would focus on understanding before changing.
>
> I’d run both native apps, inspect the main user journeys, map API/data dependencies, compare iOS and Android behavior, identify platform-specific code, review production issues if available, and create the first parity inventory.
>
> By the end of the week I’d want a proposed Flutter architecture, migration sequence, known risks, and a small vertical slice to validate the approach.

<a id="q13"></a>
## Q13 — How do you choose what not to migrate?

> Feature parity should be driven by current product requirements, not historical code.
>
> I would distinguish between behavior users depend on, obsolete implementation details, accidental platform differences, and features the product intentionally wants to remove.
>
> The native source code is evidence, but it should not automatically become the product specification.

<a id="q14"></a>
## Q14 — How do you handle legacy API contracts?

> I prefer to keep migration risk low by preserving stable backend contracts initially unless the contract blocks the new architecture.
>
> I’d normalize backend responses behind repositories/adapters so Flutter domain code is not tightly coupled to legacy payloads.
>
> Once parity and release stability are achieved, API cleanup can happen separately with better observability and lower migration risk.

<a id="q15"></a>
## Q15 — How do you debug an issue you cannot reproduce locally?

> I start by improving observability rather than repeatedly guessing.
>
> I collect the user flow, app version, device/OS, network conditions, logs and telemetry, then look for patterns across affected and unaffected sessions.
>
> If necessary I add targeted instrumentation, reproduce the suspected environmental conditions, and narrow the problem until I can build a deterministic explanation.

<a id="live-coding"></a>
# 6. Potential live coding / Flutter refresh

EasyInterview can be configured with a coding editor or system-design whiteboard, so prepare for both.

<a id="dart"></a>
## Dart topics

Know how to explain:
- `Future` vs `Stream`
- `async` / `await`
- event loop / microtask queue conceptually
- null safety
- `final` vs `const`
- equality / immutable state
- exception vs result/error modeling
- isolates
- common collection complexity
- disposal/cancellation patterns

Isolates:

> Dart isolates are useful for CPU-heavy work that would otherwise block the main isolate. They are not a solution for ordinary asynchronous I/O like HTTP requests, because async I/O already avoids blocking the UI isolate.

<a id="flutter"></a>
## Flutter topics

Be ready for:
- widget lifecycle
- `BuildContext`
- keys
- rebuilds
- `const`
- `ListView.builder`
- app lifecycle
- navigation
- state boundaries
- performance profiling
- image caching
- platform channels
- permissions
- responsive UI

How do you reduce unnecessary rebuilds?

- keep state as local as practical,
- avoid rebuilding large subtrees for small state changes,
- use selectors/listeners appropriately,
- split widgets by responsibility,
- use immutable state,
- profile before micro-optimizing,
- use `const` where it helps,
- avoid expensive synchronous work in `build`.

<a id="system-design"></a>
# 7. Mini system-design case

```text
App
├── Core
│   ├── Networking
│   ├── Persistence
│   ├── Location
│   ├── Analytics
│   ├── Error handling
│   └── Design system
│
├── Features
│   ├── Monuments
│   ├── Map
│   ├── Monument Detail
│   ├── Visits
│   ├── Rewards / Vouchers
│   └── Settings
│
└── Platform
    ├── iOS integrations
    └── Android integrations
```

Data flow:

```text
UI
 ↓
State / Controller / BLoC
 ↓
Use case / domain logic
 ↓
Repository
 ↙       ↘
REST API  Local DB / Cache
```

Offline read:

```text
Request monument
   ↓
Local cached version available?
   ├── yes → render immediately
   │         ↓
   │      refresh in background when appropriate
   └── no → fetch API → persist → render
```

Offline write/progress:

```text
User visits monument
      ↓
Persist local event with operation id
      ↓
Update UI as pending/synced
      ↓
Connectivity?
   ├── yes → sync
   └── no  → durable retry later
```

<a id="ai-workflow"></a>
# 8. AI-first migration workflow for this project

## Step 1 — Discovery

For one feature at a time, provide:
- native iOS implementation,
- native Android implementation,
- relevant API models,
- screenshots,
- known UX behavior.

Ask AI to identify:
- shared behavior,
- platform differences,
- dependencies,
- edge cases,
- proposed Flutter acceptance criteria.

Do not begin with: “rewrite the app in Flutter.”

## Step 2 — Acceptance criteria

Example:

```markdown
Feature: Monument Details

- title, hero image and story match production data
- loading/error/empty behavior documented
- cached content opens without network
- refresh updates cache
- map CTA opens selected monument
- behavior verified on iOS and Android
- analytics preserved where required
```

## Step 3 — Implementation plan

Ask for:
- files/components,
- data flow,
- state transitions,
- dependencies,
- tests,
- migration risks.

Review the plan before implementation.

## Step 4 — Bounded implementation

Example:

> Implement only repository + local cache for Monument Details. Do not modify navigation or unrelated features.

## Step 5 — Validation

Run:
- formatter,
- analyzer,
- unit tests,
- widget tests,
- integration tests where relevant,
- manual native-vs-Flutter parity scenario.

Review the diff, not just the final screen.

## Step 6 — Reusable context

Capture recurring rules as:
- project instructions,
- reusable skills/prompts,
- migration checklists,
- architecture docs,
- test conventions.

<a id="stories"></a>
# 9. Your strongest stories

<a id="story-a"></a>
## Story A — Poor connectivity

Facts:
- 30-day telemetry window
- 3,022 total upload events
- weak-signal reproduction
- persistent pending state
- connectivity-aware retry
- existing backend contract preserved

Takeaway:

> **Measure first, distinguish environmental failures from application defects, then choose the smallest reliable solution.**

<a id="story-b"></a>
## Story B — Performance

Facts:
- login-to-organization flow: ~10.0 s
- improved to ~5.8 s
- ≈42% reduction

Takeaway:

> **Profile the user journey rather than guessing at bottlenecks.**

<a id="story-c"></a>
## Story C — Production ownership

Themes:
- production Flutter mobile/web
- API contracts
- Firebase / Cloud Functions
- testing
- CI/CD
- observability
- incident response

Use for:
- What makes you senior?
- How do you own a feature?
- How do you work independently?

<a id="truth"></a>
# 10. Truth boundaries

## BLoC / Cubit

Safe:

> I understand and use BLoC/Cubit concepts and can work effectively in that architecture.

Avoid inventing long production BLoC history if probed.

## Native iOS / Android

You have earlier commercial native mobile experience and platform context. Do not position yourself as a current deep Kotlin/Swift specialist unless the question matches your exact experience.

## AI

Strong claims are fine around daily use of:
- Cursor
- Codex
- Claude
- ChatGPT
- structured/spec-first workflows

Avoid claiming ownership of a large production autonomous multi-agent platform unless true.

<a id="questions"></a>
# 11. Questions to ask them

Pick two.

### Best question

> How different are the current iOS and Android implementations today? If they differ, is one platform considered the source of truth, or will part of the migration involve deciding which behavior the Flutter application should preserve?

### Backend

> Are both native applications already consuming the same backend APIs and data model?

### Offline

> When you mention offline support, do you primarily mean cached monument content and user progress, or is offline map functionality also expected?

### Release

> Are you planning a complete replacement at once, or would you prefer a staged migration and rollout?

### AI culture

> You emphasize AI-first development strongly. What AI workflows are already working well for the team today, and where do you want the person in this role to improve them?

### Success

> What would make you say after the first 30 or 60 days that the rewrite is progressing successfully?

<a id="morning"></a>
# 12. Interview morning checklist — 09:30

## 08:45–09:00
- breakfast / water
- charger connected
- stable internet
- phone silent
- no rushed studying

## 09:00–09:15

Say aloud:
1. 90-second intro
2. native → Flutter migration answer
3. AI workflow answer
4. photo-upload story
5. one question you will ask

## 09:15

Stop studying.

Close:
- ChatGPT
- Claude
- Cursor
- documentation
- unnecessary browser tabs
- messaging apps

## 09:20
- camera check
- microphone check
- browser permissions
- clean screen
- water nearby

## 09:25

Open only what the interview requires.

## 09:30

Start calmly.

<a id="behavior"></a>
# 13. EasyInterview behavior to expect

EasyInterview publicly describes its technical rounds as:
- live voice interviews,
- typically 45–60 minutes,
- adaptive follow-up questions,
- possible coding editor,
- possible system-design whiteboard,
- evidence-scored reports,
- recordings and transcripts.

Its public sample report shows camera, screen, and audio monitoring, integrity flags, and blocked clipboard paste in a coding editor.

Therefore:
- explain thinking aloud,
- clarify before coding,
- state trade-offs,
- test edge cases yourself,
- do not switch tabs or use external assistance,
- do not paste prepared answers,
- revise openly if you notice a mistake.

Strong recovery phrase:

> I see the problem with my first assumption. I’d change the approach because…

<a id="rapid"></a>
# 14. Five-minute rapid recall

### Rewrite
**Inventory → parity matrix → architecture → vertical slices → validation → staged rollout**

### AI
**Bounded context → plan → small implementation → diff review → tests → manual validation**

### Offline
**Persist what matters → expose sync state → durable retry → explicit cache rules**

### Evidence
**3,022 upload events → weak-network reproduction → persistence + retry**

### Senior mindset
**Own the outcome after the PR is merged. Measure before guessing.**

<a id="final"></a>
# 15. Final mindset

You do not need to prove that you know every Flutter package.

The real test is whether you can:
- understand an existing product,
- decompose a migration,
- reason about platform behavior,
- ship production Flutter safely,
- debug real failures,
- work autonomously,
- use AI productively without losing technical ownership.

Keep this sentence in mind:

> **I can migrate an existing production product into Flutter in controlled slices, preserve behavior, and use AI to increase delivery speed without giving up engineering judgment.**
