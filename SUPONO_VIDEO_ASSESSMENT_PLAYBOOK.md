<a id="top"></a>

# Supono Holdings — One-Attempt Flutter Video Assessment Playbook

**Candidate:** Hazim Cakil  
**Location:** Ankara, Türkiye  
**Target:** Supono Holdings LTD — Flutter / Senior Flutter hiring process  
**Prepared:** 19 Sep 2026  
**Purpose:** Prepare for the one-attempt recorded video assessment without opening or consuming the assessment link.

> **Hard rule:** Do not open or interact with the assessment link until intentionally ready to take it.  
> The invitation explicitly says **ONE ATTEMPT ONLY**.

---

<a id="how-to-use"></a>

## How to use this document

This is **not a leaked-question sheet**. It is a focused preparation pack based on:

1. Supono's current public Flutter role requirements.
2. The actual one-attempt assessment invitation.
3. Public candidate reports, clearly treated as anecdotes.
4. Hazim's real production background and existing interview preparation material.
5. High-probability senior Flutter topics that map directly to Supono's role.

### Three modes

**15-minute mode**
- Section 1: assessment reality
- Section 3: answer framework
- Section 4: top 12 questions
- Section 5: real story bank
- Section 12: final checklist

**45-minute mode**
- Everything above
- Sections 6–10 technical drills

**Deep practice**
- Read all sections.
- Answer every prompt aloud on camera.
- Keep most responses in the **45–90 second** range.

---

<a id="s1"></a>

# 1. What we know before taking the assessment

## Verified from the invitation

The email from `work@suponoholdings.com` states:

- Hazim qualified for the **first assessment**.
- The assessment is a **video assessment**.
- There is **one attempt only**.
- A working camera and microphone are required.
- The assessment is hosted on Supono's ERP/Odoo recruitment system.

### Still unknown

We do **not** currently have reliable public evidence for:

- exact number of video questions;
- preparation time before each question;
- recording time per answer;
- total assessment duration;
- whether rerecording is possible;
- whether the page itself starts the attempt immediately;
- whether the first stage contains coding;
- whether AI assistance is prohibited;
- whether the assessment belongs to the generic **Flutter Mobile Developer** requisition or the newer **Senior Flutter Developer** requisition.

Do not invent these details.

---

<a id="s2"></a>

# 2. Supono-specific role intelligence

## Verified company/job-page signals

Supono's current public Flutter role emphasizes:

- Flutter + Dart;
- custom Flutter packages that use native Android/iOS APIs;
- RESTful APIs;
- automated testing and builds;
- Git and Jenkins;
- readable/documented/maintainable code;
- refactoring existing code;
- Kotlin / Swift / Java and other native-language familiarity;
- SQLite;
- Agile;
- translating wireframes into responsive UI;
- independent problem-solving;
- self-management;
- fast execution;
- progressing with **dummy APIs** while the real backend is unfinished;
- beginning architecture/components before final Figma designs exist;
- launching Flutter projects in roughly **1–2 weeks from scratch**;
- ActivTrak use for code security/safety/traceability;
- fixed salary plus advertised employee-ownership/revenue-sharing participation.

The public careers page currently displays approximately **40 Flutter Mobile Developer openings**.

Recent public Senior Flutter listings are Cyprus-located. Older Senior Flutter listings explicitly stated that the opportunity was open only to Cyprus residents.

### What this means for preparation

Supono is signaling that it values engineers who can:

1. start before every dependency is ready;
2. define safe boundaries early;
3. move quickly without becoming reckless;
4. work independently;
5. debug across Flutter, APIs and native boundaries;
6. leave code readable enough for fast-moving teams;
7. make practical decisions instead of waiting for perfect specifications.

Those themes should appear repeatedly in Hazim's answers.

---

## Location eligibility

**Current status: unresolved.**

Public evidence is mixed:

- recent Senior Flutter job posts are Cyprus-based;
- older Senior Flutter posts explicitly said Cyprus residents only;
- the generic Flutter Mobile Developer page does not present the same visible residency restriction;
- remote work has existed historically, but this does not establish current Türkiye eligibility;
- no reliable public evidence currently confirms a Türkiye B2B/contractor path for this requisition.

### Action already taken

A short clarification email has been sent to Supono asking:

- which Flutter role the assessment belongs to;
- whether a candidate in Ankara, Türkiye is eligible;
- whether employee or contractor/B2B arrangements are possible.

Do not consume the one attempt merely to discover the answer to a location-eligibility question.

---

<a id="s3"></a>

# 3. Video-answer operating system

For almost every question, use:

> **Direct answer → real example → engineering reason → result/tradeoff**

Do not start with a long preamble.

## 45-second answer

Use:

1. direct position;
2. one production example;
3. one outcome.

## 60–90 second answer

Use:

1. **Situation** — one sentence;
2. **Your responsibility** — one sentence;
3. **Action** — 3–4 concrete steps;
4. **Result** — observable outcome;
5. **Lesson/tradeoff** — one sentence.

## Senior-language checklist

Prefer:

- "I first define the source of truth..."
- "I separate what must be correct from what can remain flexible..."
- "I measure before changing..."
- "I keep the failure recoverable..."
- "I make the boundary explicit..."
- "I use a deterministic fake..."
- "I keep the rollout reversible..."
- "I verify the result after the change..."
- "My ownership was..."
- "The backend team owned X; I owned Y..."

Avoid:

- "I always use..."
- "BLoC is the architecture."
- "A timeout means the request failed."
- "Just retry it."
- "We rewrote everything."
- "I handled all native code."
- "I owned the whole backend."

---

<a id="s4"></a>

# 4. Top Supono video questions + spoken answers

<a id="q1"></a>

## Q1 — Tell us about yourself

### 60–75 second version

> "I'm a mobile-focused software engineer with more than nine years of software engineering experience overall, and more than six and a half years working primarily with Flutter and Dart in production.
>
> For nearly four years I've been working remotely with a US-based product company on production mobile and Flutter Web workflows. My work has included Flutter architecture, Firebase and Firestore, REST API integration, testing, CI/CD, performance and production reliability.
>
> Over time my role became less about implementing isolated screens and more about ownership: investigating difficult production behavior, coordinating client and API contracts, improving reliability and helping make changes safe to release.
>
> I especially enjoy problems where requirements are not perfectly defined yet and I need to understand the system, choose a practical boundary and move the product forward without sacrificing correctness."

### Anchors

**9+ overall → 6.5+ Flutter → production ownership → reliability/API → ambiguity**

---

<a id="q2"></a>

## Q2 — Why Supono?

> "The part of the role that caught my attention is the level of ownership expected from a Flutter engineer. The description isn't only about implementing finished screens. It expects developers to move while APIs or designs are still evolving, work across Flutter and native boundaries when needed, and still deliver maintainable production code.
>
> That's close to the kind of work I enjoy. In production I've had to deal with evolving API contracts, real-time data, reliability issues, performance problems and rollout risk rather than only UI tickets.
>
> I'm particularly interested in roles where engineering judgment matters: deciding what can be built now, what needs a stable contract, and how to deliver quickly without creating expensive reliability problems later."

Do not say:
- "I like pressure."
- "I can build any app in one week."
- "I love 24/7 fast-paced companies."

---

<a id="q3"></a>

## Q3 — How do you work when the API is unfinished?

> "I first define the client contract we actually need: request and response models, error cases, pagination or filtering rules, authentication behavior and any lifecycle assumptions.
>
> Then I put that contract behind an abstraction and use a deterministic fake implementation so UI and application-flow work can continue without coupling the app to temporary JSON everywhere.
>
> I keep assumptions visible and verify them early with the backend team. When the real endpoint arrives, the concrete implementation changes behind the boundary rather than forcing a rewrite of presentation logic.
>
> The main risk with a dummy API is not the dummy itself. The risk is silently building against the wrong contract."

### Follow-up: What if the backend contract changes?

> "I isolate transport DTOs from app-facing models where the change rate justifies it, keep mapping at the data boundary, add contract-focused tests around important behavior and update the fake together with the agreed contract."

---

<a id="q4"></a>

## Q4 — Figma is incomplete. What do you build first?

> "I separate expensive-to-change decisions from cheap-to-change decisions.
>
> I can start navigation, feature boundaries, domain/data contracts, state ownership, reusable primitives and the critical user flow while keeping detailed visual decisions flexible.
>
> I wouldn't invent a complete final design system and treat it as approved. I would build the structure that unblocks engineering and deliberately isolate pieces that are likely to change when the final Figma arrives.
>
> That lets the team move early without turning incomplete design information into accidental permanent architecture."

---

<a id="q5"></a>

## Q5 — How would you launch a Flutter app in 1–2 weeks?

> "I would first reduce the target to a clearly defined production slice. In a short timeline, quality comes from making the right scope and boundary decisions rather than attempting every possible feature.
>
> I would identify the critical user journey, establish navigation and data contracts early, put CI and the highest-value tests in place from the beginning, and make failures observable.
>
> Nice-to-have abstractions and broad refactors can wait. Correctness of the main flow, recoverability, data integrity and release visibility cannot.
>
> Fast delivery doesn't mean removing engineering discipline. It means applying the discipline where a failure would be most expensive."

### If they say "competitor clone, Figma not ready"

Add:

> "I would identify the competitor's essential behavior rather than mechanically copying every screen. I would validate the MVP flow, list assumptions, create reusable primitives only where repetition is already visible, and keep uncertain design details easy to replace."

---

<a id="q6"></a>

## Q6 — Tell us about a difficult production problem

Use **Story B — poor connectivity / reliability**.

> "One class of difficult production issues I've worked on involved intermittent failures that were hard to reproduce under normal development conditions, especially around weaker connectivity.
>
> My first step was to improve observability rather than guess. I looked at telemetry and the points where the operation could diverge, then reproduced the flow under less reliable network conditions.
>
> The solution involved treating interruption as a normal state rather than an exceptional one: preserve local work where appropriate, make retries bounded, avoid duplicate side effects, and make the operation recoverable after connectivity returns.
>
> The important lesson was that mobile reliability isn't only about catching an exception. You have to know the source of truth, whether retry is safe, and how the client converges after an ambiguous result."

---

<a id="q7"></a>

## Q7 — How independently can you work?

> "I'm comfortable owning a problem from investigation to verification, but independence doesn't mean disappearing and making hidden assumptions.
>
> I usually start by making the goal and constraints explicit, then identify which decisions I can safely make locally and which ones require product, backend or design confirmation.
>
> I keep progress visible, raise irreversible or high-risk assumptions early, and avoid blocking on details that can be isolated behind a temporary boundary.
>
> That gives me autonomy without creating surprise work for the rest of the team."

---

<a id="q8"></a>

## Q8 — How do you balance speed and quality?

> "I don't treat speed and quality as two opposite switches. The real question is which quality attributes are necessary for this release.
>
> Under a tight deadline I protect the critical path: data correctness, recovery from failure, test coverage around risky business behavior, CI, and enough observability to know whether the release is healthy.
>
> I defer broad cleanup, speculative abstractions and low-value polish.
>
> That gives the team a smaller reliable release instead of a larger fragile one."

---

<a id="q9"></a>

## Q9 — How do you decide when to refactor?

> "I refactor when the current design is increasing the cost or risk of the next change, not simply because I can make the code more elegant.
>
> Before a deadline I prefer targeted refactoring around the area being changed: clarify ownership, remove dangerous duplication, add a regression test and keep the scope bounded.
>
> A broader redesign should have a measurable reason such as repeated defects, performance problems, development friction or a boundary that keeps being violated."

---

<a id="q10"></a>

## Q10 — What is your state-management experience?

> "My production experience has used other approaches, including GetX, more heavily than BLoC, so I don't want to overstate BLoC as my main production background.
>
> What I care about is explicit state ownership, predictable transitions, separating side effects from state changes and keeping important behavior testable.
>
> I understand Cubit and BLoC's unidirectional model and event/state concepts, and in an existing codebase I would follow the team convention rather than force my preferred package."

### If they ask Cubit vs BLoC

> "Cubit uses methods and is often enough for straightforward transitions. BLoC adds explicit events, which can be valuable when there are multiple event sources, sequencing requirements or an explicit concurrency policy. I don't treat BLoC itself as the architecture."

---

<a id="q11"></a>

## Q11 — How do you approach native Android/iOS work from Flutter?

> "My deepest expertise is Flutter, not years of purely native Android or iOS development, so I keep that distinction clear.
>
> When Flutter needs a platform capability, I isolate it behind a Flutter-facing API and choose the bridge based on the interaction. MethodChannel works well for request/response style calls; EventChannel is appropriate for a continuous stream from the platform.
>
> I pay attention to lifecycle, permissions, serialization, threading and error propagation because many cross-platform bugs live at those boundaries rather than in the widget layer.
>
> If the native portion becomes substantial, I treat it as a real platform module with a clear interface and tests rather than scattering channel calls throughout Flutter code."

---

<a id="q12"></a>

## Q12 — What are you actively improving?

> "One area I'm deliberately strengthening is deeper hands-on use of BLoC and Cubit in codebases where their event and concurrency model is useful. My production background has used other state-management approaches more heavily.
>
> I'm already comfortable with the underlying principles — immutable state, explicit ownership, one-directional flow, deterministic transitions and testing — so the learning is mainly becoming faster and more idiomatic with that specific ecosystem rather than learning state management from zero."

---

<a id="s5"></a>

# 5. Real production story bank

Do not memorize these word-for-word.

For each story remember:

> **Problem → my ownership → evidence → decision → result → what I learned**

---

<a id="story-a"></a>

## Story A — Workflow modernization / production stability

### Best for

- "Tell me about a project you owned."
- "How do you deal with multiple data sources?"
- "How do you make a migration safe?"
- "Tell me about architecture decisions."
- "How do you handle real-time data?"
- "Tell me about a reliable production system."

### Story spine

**Situation**

A core operational workflow had been designed more around desktop usage, while field users needed to perform the workflow reliably from mobile.

**Your responsibility**

Your responsibility was the Flutter/client path: state handling, integration behavior, rollout safety and interaction with existing data/backend systems.

Do **not** claim ownership of backend implementation that belonged to the backend team.

**Architecture**

- Flutter/mobile client.
- Firebase/Firestore used for the read experience.
- Writes continued through the API/backend path.
- Dataverse/Dynamics 365 remained the system of record.
- Feature flags were used for controlled rollout.
- Client behavior had to respect eventual consistency between write path and real-time/read projection.

**Important race**

Where an API response contained a newer update timestamp, older listener/cache data must not overwrite the newer client state.

**Result**

The workflow stabilized and then ran for roughly **18 months without a production incident**.

### 75–90 second spoken version

> "One project I worked on was a core operational workflow that had originally been more desktop-oriented while field users needed the same workflow reliably from mobile.
>
> My responsibility wasn't to rewrite the backend. I owned the Flutter/client integration and the behavior around state, reads, writes and rollout.
>
> The read experience used Firebase and Firestore while writes continued through the existing API path, and Dataverse remained the system of record. That meant we had to be careful about eventual consistency. For example, if the API response represented a newer update, we couldn't allow an older Firestore projection to overwrite the client state simply because the listener arrived later.
>
> We also used feature flags for controlled rollout.
>
> The workflow stabilized and then ran for around eighteen months without a production incident. The main lesson was that reliability came from clear source-of-truth rules, rollout control and reconciliation rather than from the UI rewrite itself."

### Likely probes

- Why Firestore on the read path?
- What was authoritative?
- How did you compare versions/timestamps?
- What if the listener was stale?
- How did you test it?
- What did you personally implement?
- What did the backend team own?

---

<a id="story-b"></a>

## Story B — Weak connectivity / intermittent upload failures

### Best for

- "Tell me about a hard bug."
- "What if you cannot reproduce a customer issue?"
- "How do you handle offline?"
- "How do you debug reliability?"
- "How do you handle retry?"

### Story spine

1. Intermittent production failure.
2. Normal happy-path testing did not expose it consistently.
3. Improve observability.
4. Reproduce under realistic weak-network/interruption conditions.
5. Preserve work locally when appropriate.
6. Retry only with a defined policy.
7. Make sync/idempotency explicit where duplicates are possible.
8. Observe behavior after rollout.

### Spoken version

> "I've worked on intermittent upload failures where the difficult part was that the issue didn't reproduce reliably on a normal development connection.
>
> I started with observability: identifying what stage had completed, what evidence we had from the client, and what we could confirm from the server side. Then I reproduced the flow under weak connectivity and interruptions instead of assuming a stable network.
>
> The design direction was to preserve work locally where appropriate, use bounded retries for retryable operations, and make duplicate handling explicit rather than treating retry as harmless.
>
> The bigger lesson was that mobile connectivity failures are normal operating conditions. The client needs a recovery path and a clear source of truth, not just an error dialog."

### Supono connection

This directly demonstrates the self-management / independent-debugging signal in the job description.

---

<a id="story-c"></a>

## Story C — API pagination / sorting / performance

### Best for

- API design
- performance
- client/backend ownership boundary
- debugging
- pagination
- "measure before changing"

### Story spine

1. A performance/ordering problem crossed the Flutter/API boundary.
2. Measure response behavior first.
3. Inspect pagination and sorting semantics, not only rendering.
4. Determine the correct boundary for the fix.
5. Avoid compensating forever in the UI for a contract problem.
6. Verify response behavior and guard against regression.

### Spoken version

> "One useful example was a performance and ordering problem where the visible symptom was in the client, but the correct fix couldn't be chosen by looking at Flutter alone.
>
> I measured the request and response behavior first and inspected how pagination and sorting were being applied. The key question was whether we were dealing with a rendering problem, an inefficient request pattern or a backend contract that produced unstable or unnecessarily expensive results.
>
> I prefer fixing the issue at the boundary that actually owns it rather than adding more client-side work to hide a contract problem.
>
> After the change, I verified the response behavior and kept the client logic simple enough that the same issue would be easier to detect if it regressed."

### Follow-up concepts

- cursor vs offset pagination;
- stable ordering;
- duplicate page loads;
- refresh while page N is in flight;
- stale page result after refresh;
- request coalescing.

---

<a id="story-d"></a>

## Story D — PagerDuty / production ownership

### Best for

- incident response;
- ownership;
- communication;
- "what happens when production breaks?";
- "how do you work under pressure?"

### Story spine

1. Production ownership is not "someone else's problem."
2. Confirm customer/system impact.
3. Use logs/telemetry/evidence.
4. Narrow the fault domain.
5. Prefer reversible mitigation.
6. Monitor recovery.
7. Add follow-up prevention/test/observability.

### Spoken version

> "My approach to incidents is to reduce uncertainty before making broad changes.
>
> I first establish impact and gather the best available evidence — logs, telemetry, request behavior and recent changes. Then I narrow the fault domain rather than changing several components at once.
>
> If mitigation is needed, I prefer something reversible, such as a guarded behavior change or feature flag, and then I compare the system after the mitigation instead of assuming the alert disappearing means the root cause is solved.
>
> After the immediate issue, I look for the missing test, monitoring signal or architectural boundary that would have made the problem easier to prevent or diagnose next time."

### Useful result signal

You can truthfully mention that one stabilized production workflow operated for approximately **1.5 years without an incident**.

Do not imply that this means "the whole company had no incidents."

---

<a id="story-e"></a>

## Story E — Payment reliability lab

**Repository:** `hcakil/flutter_payment_reliability_lab`

### Why it matters for Supono

It demonstrates senior reasoning around:

- ambiguous client outcomes;
- idempotency;
- reconciliation;
- duplicate submissions;
- restart recovery;
- deterministic tests;
- redacted/allowlisted telemetry;
- source-of-truth boundaries.

### Facts you can safely state

- provider-neutral Flutter reliability core;
- **18 deterministic tests**;
- stable operation identity;
- one logical intent should not create repeated logical operations;
- a timeout or lost callback is not automatically authoritative failure;
- trusted reconciliation can converge local state;
- pending operations can survive reconstruction/restart;
- test design covers duplicate, stale and conflicting evidence scenarios.

### Spoken version

> "I also built a small provider-neutral Flutter payment reliability lab because payment flows expose a reliability problem that also appears in many mobile systems: the client can lose the response even though the server completed the operation.
>
> The design treats callbacks and timeouts as evidence rather than automatically authoritative truth. It uses stable operation identity, idempotency and reconciliation so an ambiguous result can later converge without creating a second logical payment.
>
> I wrote eighteen deterministic tests around duplicate submits, lost responses, reconciliation ordering, stale evidence and restart recovery.
>
> It isn't a production payment SDK; the purpose is to demonstrate the reliability invariants explicitly."

### Important honesty line

> "The lab is provider-neutral and intentionally has no real payment integration or production backend."

---

<a id="s6"></a>

# 6. Supono scenario drills

<a id="sc1"></a>

## Scenario 1 — "Backend won't be ready for five days. We still need progress."

Strong answer:

> "I would agree the smallest client contract needed for the critical flow, document assumptions, define typed models and semantic failures, then implement a deterministic fake behind the same repository/interface used by the real source. That lets navigation, state and UI progress while limiting the replacement work later."

Probe:

**What if backend response ends up different?**

> "Change transport mapping at the data boundary. If the semantic contract itself changed, surface that explicitly instead of hiding it with increasingly complicated mapping."

---

<a id="sc2"></a>

## Scenario 2 — "Figma is only 30% complete."

Strong answer:

> "I build structure, not fake certainty. Navigation, feature boundaries, state ownership, data contracts and obviously reusable primitives can start. Pixel-level choices and uncertain component APIs stay flexible."

---

<a id="sc3"></a>

## Scenario 3 — "The client says copy this competitor and release next week."

Strong answer:

> "I first identify the critical behavior and acceptance criteria because 'copy this competitor' is not precise enough to define a safe release. Then I establish the smallest launchable flow, list assumptions, decide which risks require confirmation and isolate cosmetic uncertainty from architecture."

---

<a id="sc4"></a>

## Scenario 4 — "POST timed out. Retry?"

Do not say "yes."

> "First I need to know whether the operation is safe to repeat. A timeout means the client didn't receive a result in time; it doesn't prove the server didn't process it.
>
> For a mutation with side effects, I would use a stable idempotency key or reconcile the server state before blindly repeating the operation."

---

<a id="sc5"></a>

## Scenario 5 — "Five API calls receive 401 simultaneously."

> "I would use one shared in-flight refresh Future. The first failure starts refresh; the others await the same operation. Original requests retry at most once with the new token. If refresh fails irrecoverably, I clear authentication state rather than creating an infinite 401-refresh loop."

---

<a id="sc6"></a>

## Scenario 6 — "Search results from an older request overwrite the new query."

> "Debounce reduces request frequency, but it doesn't solve an already in-flight stale response. I use cancellation where reliable or a monotonically increasing generation/request ID and only let the current generation update state."

---

<a id="sc7"></a>

## Scenario 7 — "Firestore is real-time but the UI looks stale."

Debug in this order:

1. is the expected listener attached?
2. correct path/query/filter/tenant?
3. did the write actually succeed?
4. cache or server snapshot?
5. pending local writes?
6. Security Rules?
7. repository/state cache suppressing change?
8. mapping/dedupe/distinct dropping it?
9. is the UI subscribed to the changed state?
10. can optimistic/API state race an older Firestore projection?

---

<a id="sc8"></a>

## Scenario 8 — "Android works differently from iOS."

> "I first separate Dart-side behavior from plugin/platform behavior. I reproduce on the affected OS/version/device, inspect platform logs, permissions, lifecycle and background restrictions, and compare the point where the behavior diverges before changing cross-platform code."

---

<a id="s7"></a>

# 7. Dart / Flutter high-yield refresh

This section is intentionally short. It contains topics that can plausibly appear in a screening or follow-up interview.

---

## Event loop / await

> "When execution reaches `await`, the async function suspends. The current call stack unwinds and the continuation resumes asynchronously. `await` does not create a new thread."

Mental model:

```text
current stack
→ microtasks
→ next event
→ microtasks
→ next event
```

---

## Future vs Stream

**Future**
- one eventual value or error;
- REST call;
- one DB read/write;
- one file read.

**Stream**
- multiple events over time;
- Firestore;
- WebSocket;
- location;
- native sensor/event stream.

If you manually own a `StreamSubscription`, cancel it when its lifecycle ends.

---

## Concurrency vs parallelism

**Concurrency:** multiple operations can make progress through interleaving.  
**Parallelism:** work executes at the same time.

Dart isolate:

- own memory;
- own event loop;
- Dart code executes single-threadedly inside an isolate;
- multiple isolates can execute in parallel.

Use an isolate for genuinely CPU-heavy work such as expensive parsing, not ordinary HTTP I/O just to make it "async."

---

## Widget vs Element vs RenderObject

**Widget**
- immutable configuration;
- cheap to recreate.

**Element**
- mounted persistent position in tree;
- connects widget/state/lifecycle;
- `BuildContext` is effectively an interface to this tree location.

**RenderObject**
- layout;
- paint;
- hit testing.

State can survive a rebuild when Flutter can reuse the existing Element, principally based on compatible runtime type + key.

---

## BuildContext after await

Bad:

```dart
await save();
Navigator.pop(context);
```

Safer:

```dart
await save();

if (!context.mounted) return;

Navigator.pop(context);
```

Reason:

The Element associated with the context may have been unmounted during the async gap.

---

## Flutter layout rule

> **Constraints go down → sizes go up → parent sets position.**

Classic:

```dart
Column(
  children: [
    Text('Header'),
    ListView.builder(...),
  ],
)
```

A `ListView` needs finite height in its scroll direction.

Typical fix:

```dart
Expanded(
  child: ListView.builder(...),
)
```

Use `shrinkWrap` deliberately for small embedded lists, not as an automatic fix.

---

## Keys

Use keys when **logical identity must survive movement/reordering**.

Common:
- `ValueKey`
- `ObjectKey`
- `UniqueKey`
- `GlobalKey` — deliberate use only

---

<a id="s8"></a>

# 8. Architecture / state / API drill

## Architecture answer

> "I prefer the simplest architecture that keeps ownership and change boundaries clear. Presentation owns rendering and user interaction. Application state owns orchestration and transitions. A repository gives the feature a stable data contract and coordinates sources. Concrete API, Firestore, SQLite or platform details stay below that boundary. I add a separate domain layer when business rules are complex enough to benefit from isolated ownership and tests."

### Practical flow

```text
Presentation
    ↓ intent
Application / State
    ↓
Repository contract
    ↓
API / Firestore / SQLite / platform
```

Do not create layers only because the diagram looks senior.

---

## Cubit vs BLoC

### Cubit

```text
UI → method() → emit(State)
```

Good when:
- transitions are straightforward;
- few event sources;
- explicit event objects add little value.

### BLoC

```text
source/UI → Event → handler/concurrency policy → State
```

Useful when:
- many event sources exist;
- event ordering matters;
- concurrency behavior matters;
- event traceability helps.

Interview-safe line:

> "My production background has used other approaches more heavily, but I understand the BLoC/Cubit model and I would follow the codebase convention rather than forcing a library."

---

## Duplicate request coalescing

Pattern:

```dart
final Map<String, Future<User>> _inFlight = {};

Future<User> loadUser(String id) {
  final existing = _inFlight[id];
  if (existing != null) return existing;

  final future = _fetchAndCleanup(id);
  _inFlight[id] = future;
  return future;
}
```

Important:
- all callers await same Future;
- clean up on success **and failure**.

---

## Retry

> "I retry classified transient failures with bounded attempts, backoff and jitter, and only when the operation is safe or idempotent."

Do not blindly retry:
- validation failures;
- permanent auth failures;
- unsafe mutations with unknown server outcome.

---

## Idempotency

For one logical operation:

```text
Idempotency-Key: stable-uuid-for-this-operation
```

Reuse the same key on retry.

Backend enforcement matters. A client-side UUID by itself does not provide idempotency.

---

## Pagination + refresh

State may contain:

- items;
- next cursor/page;
- initial loading;
- next-page loading;
- refreshing;
- end reached;
- error;
- query/filter generation.

Important race:

> Refresh happens while page N is in flight.

Old page N must not append into the refreshed dataset.

Use:
- generation/version;
- cancellation where supported;
- serialization when appropriate.

---

<a id="s9"></a>

# 9. Testing / CI / performance

## Testing answer

> "I prioritize tests around behavior and invariants rather than maximizing test count. Unit tests protect state transitions and business rules; widget tests verify rendering and interaction; integration tests cover fewer but critical cross-layer flows. For async behavior I prefer deterministic fakes, controllable completion order and fake time instead of arbitrary sleeps."

---

## Fake vs mock

**Fake**
- working simplified implementation;
- useful when behavior/state matters;
- good for deterministic API/repository scenarios.

**Mock**
- verifies interactions;
- useful when call expectations matter;
- can become brittle if overused.

For Supono's unfinished-API scenario, a **deterministic fake** is often more useful than a pile of mocked JSON calls.

---

## CI answer

> "I want feedback automated early. At minimum I expect formatting/static analysis, tests and a reproducible build path. The exact pipeline tool can be Jenkins, GitHub Actions or another system; the value is making important checks consistent and visible before release."

Hazim has real CI/CD experience. Do not claim Jenkins-specific depth if that is not your strongest tool.

---

## Performance answer

> "I measure before changing code. In Flutter I reproduce in profile mode, inspect frame timing and determine whether the bottleneck is UI CPU, raster/GPU, memory/images or another source. Then I fix one measured hot path and profile again."

Common causes:
- expensive synchronous work in `build`;
- too-large rebuild scope;
- non-lazy widget trees;
- image decode/cache pressure;
- CPU-heavy parsing on UI isolate;
- leaked subscriptions/controllers;
- unnecessary network waterfalls.

Do not begin with "add `const` everywhere."

---

<a id="s10"></a>

# 10. Native / platform quick hits

## MethodChannel

Request/response between Dart and platform code.

## EventChannel

Continuous event stream from platform to Dart.

## FFI

Direct interoperability with C-compatible/native libraries.

### Interview distinction

> "I use a platform channel for Android/iOS platform APIs, services and lifecycle integration. I use FFI when I need direct interoperability with an appropriate native library interface."

---

## Native plugin boundary

Good structure:

```text
Flutter feature
    ↓
Dart-facing platform interface
    ↓
MethodChannel / EventChannel
    ↓
Android / iOS implementation
```

Keep out of widgets:
- raw method names;
- channel serialization details;
- platform-specific error codes.

---

## Android concepts worth knowing at a high level

- WorkManager: deferrable OS-scheduled work.
- Foreground service: user-visible ongoing work under Android restrictions.
- notification channels.
- permissions and background execution restrictions.
- process death and state restoration implications.

## iOS concepts worth knowing at a high level

- permission lifecycle;
- push/notification flow;
- foreground/background behavior;
- Swift value vs reference semantics (`struct` vs `class`);
- app lifecycle differences that affect plugins.

---

<a id="s11"></a>

# 11. Company-fit / HR questions

## Why are you leaving / why now?

Keep it professional.

> "I'm looking for my next long-term product role where I can use the production Flutter experience I've built over the last several years and continue growing into broader mobile architecture and reliability work. My current company is going through an engineering-organization transition, so the timing also makes sense for me to explore the next opportunity."

Do not overshare layoffs/org politics.

---

## What are your strongest areas?

> "My strongest area is production mobile engineering rather than only feature implementation: Flutter and Dart, API integration, Firebase/Firestore, debugging difficult behavior, reliability, testing and making changes safe to release."

---

## What is your weakest area?

Prefer a bounded growth area.

> "My native Android/iOS depth is not as deep as my Flutter experience. I'm comfortable working across the boundary, reading native code and implementing platform integrations, but I wouldn't present myself as someone with the same depth as a dedicated senior Swift or Kotlin engineer."

Alternative:

> "My production state-management experience has used approaches like GetX more heavily than BLoC, so I'm deliberately strengthening BLoC/Cubit idioms."

---

## How do you use AI tools?

> "I use AI as an accelerator for investigation, implementation alternatives, test generation and code review, but I keep architecture and shipping decisions under my own ownership. I verify generated code against the real codebase, tests, constraints and security requirements rather than treating generated output as authoritative."

---

## How do you handle unclear requirements?

> "I separate uncertainty that blocks correctness from uncertainty that can be isolated. I confirm high-risk assumptions early, document temporary assumptions, and continue on reversible work instead of waiting for every detail."

---

## How do you handle disagreement?

> "I try to turn the disagreement into testable constraints: what problem are we optimizing for, what evidence do we have, what tradeoff are we accepting, and how expensive is the decision to reverse? If the team chooses a different reasonable option, I can commit to it rather than repeatedly reopening the same debate."

---

<a id="s12"></a>

# 12. Location, employment, compensation and monitoring

## If asked where you are based

> "I'm based in Ankara, Türkiye and I'm used to working remotely with international teams."

## If asked whether Cyprus relocation is possible

Answer according to your real preference at the time. Do not imply relocation availability if it is not true.

## If asked about Türkiye eligibility

> "I'm based in Ankara, Türkiye. Before progressing too far in the process, I'd like to confirm whether this specific role supports Türkiye-based employment or a contractor/B2B arrangement."

---

## Salary

The public application flow has presented compensation-expectation bands, but public information does not establish a guaranteed senior salary offer for Hazim.

Safer spoken answer:

> "I'd like to understand the exact employment structure, level and expectations before fixing a number. I'm looking for compensation aligned with a senior Flutter engineer taking production ownership. Since I'm based in Türkiye, the employee versus contractor structure also matters to the comparison."

If the system requires a numeric answer, decide the range **before starting the assessment**.

---

## Revenue sharing

Company claim:

- fixed salary;
- employee ownership/revenue-sharing participation.

Still ask later:

- What is the formula?
- Is it contractual?
- Company-wide or project-based?
- What is the measurement period?
- When is it paid?
- Is there a vesting/cliff concept?
- What happens on resignation/termination?

Do not treat "employee-owned" as equivalent to equity until the legal structure is explained.

---

## ActivTrak

Company materials state that ActivTrak is used for security/safety/traceability.

Before offer acceptance, ask:

- What exactly is collected?
- Is it limited to company-issued devices/accounts?
- Are screenshots captured?
- Are keystrokes or application usage tracked?
- Is productivity scoring used?
- Who can access the data?
- Retention period?
- BYOD policy?

Do not assume either "harmless security telemetry" or "constant surveillance" without the actual written policy.

---

<a id="s13"></a>

# 13. Take-home-task gate

Supono's public hiring materials have described a process involving tasks, and one public Mobile Developer candidate reported a demanding two-part task whose requirements changed.

That candidate report is **anecdotal**, not a verified universal policy.

If a task arrives, do not start immediately before checking:

1. expected effort in hours;
2. deadline;
3. acceptance criteria;
4. whether it is greenfield or modification;
5. whether native work is required;
6. whether requirements may change after start;
7. whether source code must be submitted;
8. IP ownership;
9. whether work can be used in production;
10. whether the task is paid if the requested effort is substantial.

### Safe clarification

> "Before I begin, could you confirm the expected time investment, evaluation criteria and IP/usage terms for the assessment submission?"

---

<a id="s14"></a>

# 14. Questions to ask Supono

Pick 3–5 depending on stage.

### Role

- Is this assessment for **Flutter Mobile Developer** or **Senior Flutter Developer**?
- What level of native Android/iOS implementation is expected from the Flutter engineer?
- Is Node.js/backend ownership part of the actual role or only collaboration with backend engineers?

### Location / contract

- Is Ankara, Türkiye eligible?
- Direct employment or contractor/B2B?
- Required working hours and timezone overlap?
- Is any Cyprus residency/relocation expected later?

### Delivery expectations

- Is the "1–2 weeks from scratch" expectation mainly for prototypes/MVPs or for production launches?
- What normally defines the scope of a one- or two-week Flutter project?
- Who owns product/design decisions while Figma and API contracts are evolving?

### Monitoring

- What data does ActivTrak collect?
- Is monitoring limited to company-issued equipment/accounts?
- Is activity data used for performance evaluation?

### Compensation

- What is the salary band for this exact requisition?
- How does revenue sharing work in practice and contractually?

### Hiring process

- What stages follow this video assessment?
- Is there a take-home task?
- Expected task effort?
- Who owns assessment IP?
- Can assessment work ever become part of a commercial product?

---

<a id="s15"></a>

# 15. Camera practice set

Answer these aloud without notes.

Target:
- Q1–Q6: 60–90 sec
- Q7–Q15: 45–75 sec

## Round 1 — likely screen

1. Tell us about yourself.
2. Why are you interested in Supono?
3. Why are you looking for a new opportunity?
4. How independently can you work?
5. How do you handle unclear requirements?
6. How do you deliver quickly without sacrificing quality?
7. Backend is not ready. What do you do?
8. Figma is incomplete. What do you do?
9. Tell us about a difficult production problem.
10. Tell us about a time you had to debug an intermittent issue.
11. What are your strongest Flutter skills?
12. What is one area you are improving?
13. How comfortable are you with native Android/iOS integration?
14. What is your availability?
15. Where are you based and what employment model can you support?

---

## Round 2 — senior Flutter

1. Widget vs Element vs RenderObject.
2. What does `await` do?
3. Future vs Stream.
4. When do you use an isolate?
5. Why can `BuildContext` be unsafe after `await`?
6. Why do keys matter?
7. Cubit vs BLoC.
8. Where should API/cache coordination live?
9. Five simultaneous 401s — one refresh.
10. How do you prevent stale responses?
11. Retry policy.
12. Why can retrying a POST be dangerous?
13. Idempotency.
14. Pagination + refresh race.
15. Firestore listener lifecycle.
16. Firestore transaction vs batch.
17. Unit vs widget vs integration test.
18. Fake vs mock.
19. How do you test async races deterministically?
20. How do you investigate jank?

---

## Round 3 — Supono-specific pressure scenarios

1. "Build an app like this competitor. You have 10 business days."
2. "The designer will finish Figma next week. Start today."
3. "Backend says the API schema may change twice this week."
4. "The Android native SDK exists; there is no Flutter package."
5. "A payment-like mutation timed out."
6. "An old request overwrites new state."
7. "The app works on iOS but fails only on Android 12."
8. "A developer wants to rewrite the architecture three days before release."
9. "There are no tests and release is Friday."
10. "A Firestore listener says data changed but the UI didn't update."
11. "The product owner changes the requirement after two days."
12. "You are blocked by another team. How do you keep progress moving?"

---

<a id="s16"></a>

# 16. Answer repair patterns

## If you do not know exact syntax

> "I haven't used that exact API recently, so I don't want to invent the syntax. Conceptually, I would approach it by..."

## If you are unsure

> "I'm not fully certain about that detail. My current understanding is X because Y, and I would verify Z before shipping it."

## If you discover your answer has a bug

> "Good point. My current approach allows that case. I would change it by..."

Do not defend a broken answer.

## If a question is too broad

> "I'll answer it from a production Flutter perspective..."

Then narrow.

---

<a id="s17"></a>

# 17. One-attempt assessment checklist

## Before touching the link

- [ ] Türkiye eligibility response checked.
- [ ] Exact requisition confirmed if possible.
- [ ] Salary answer/range decided.
- [ ] Availability answer decided.
- [ ] Employment/contractor preference decided.
- [ ] Camera tested in another application.
- [ ] Microphone tested in another application.
- [ ] Browser permissions checked without opening assessment.
- [ ] Charger connected.
- [ ] Stable internet.
- [ ] Phone hotspot available as backup.
- [ ] VPN off unless required.
- [ ] Notifications / Slack / Teams / email popups disabled.
- [ ] Quiet room.
- [ ] Neutral background and front lighting.
- [ ] Water nearby.
- [ ] CV nearby for pre-assessment review.
- [ ] No script placed where eyes visibly read line-by-line.
- [ ] Tell-me-about-yourself practiced three times.
- [ ] Why-Supono practiced three times.
- [ ] API-not-ready scenario practiced twice.
- [ ] Figma-not-ready scenario practiced twice.
- [ ] 1–2 week launch answer practiced twice.
- [ ] Production reliability story practiced twice.
- [ ] Native boundary answer practiced.
- [ ] State-management honesty answer practiced.

---

<a id="s18"></a>

# 18. Five-minute final refresher

Do not try to sound encyclopedic.

## Remember

**Your strongest signal is not Flutter trivia.**

It is that you can connect:

```text
Flutter UI
→ state
→ API / Firestore
→ platform boundary
→ testing
→ reliability
→ production outcome
```

## Your five strongest anchors

1. **6.5+ years production Flutter/Dart.**
2. **Production ownership beyond isolated UI features.**
3. **API / Firebase / Firestore / Flutter Web experience.**
4. **Reliability, testing, CI/CD and incident thinking.**
5. **Can progress under ambiguity without pretending uncertainty does not exist.**

## Your four core stories

1. Workflow modernization + source-of-truth/reconciliation.
2. Weak connectivity + recoverable operations.
3. API pagination/sorting/performance.
4. PagerDuty / production ownership.

## Optional technical proof

`flutter_payment_reliability_lab`
- 18 deterministic tests;
- ambiguous outcomes;
- idempotency;
- reconciliation;
- restart recovery.

---

<a id="s19"></a>

# 19. What NOT to overstate

Do not claim:

- BLoC is your main production state-management background.
- deep dedicated Swift/Kotlin seniority.
- ownership of backend systems that were primarily owned by backend engineers.
- team-management/people-lead experience you did not have.
- exactly-once guarantees from a mobile client.
- that every retry is safe.
- that Firestore is always authoritative.
- that the payment lab is a production payment SDK.
- that Supono has confirmed Türkiye eligibility before they actually do.
- that public interview reports prove company-wide behavior.

---

<a id="s20"></a>

# 20. Public-source classification

## Verified company/public-job facts

**Supono Flutter Mobile Developer — official role page**
- Flutter/Dart;
- native Android/iOS API package work;
- REST;
- testing/build automation;
- Git/Jenkins;
- documentation/refactoring;
- 1–2 week project expectation;
- dummy APIs;
- incomplete-Figma autonomy;
- ActivTrak;
- fixed salary + revenue-sharing language.

Source: Supono Holdings careers / Flutter Mobile Developer page.

**Supono careers page**
- approximately 40 Flutter Mobile Developer openings visible as of 19 Sep 2026.

Source: Supono Holdings careers page.

**Senior Flutter public listings**
- current/recent listings are Cyprus-located.
- older listings explicitly stated Cyprus-resident restrictions.

Source: Supono Holdings LinkedIn job listings.

---

## Company claims — not independently validated here

- "employee-owned structure";
- "revenue sharing";
- "competitive/above-market salary";
- "zero micromanagement";
- "approximately 1% of applicants pass our evaluation."

These are marketing/employer claims until contractual detail is provided.

---

## Candidate anecdotes

A public 2025 Mobile Developer Glassdoor interview report described:
- a demanding two-part task;
- substantial time investment;
- slow communication;
- changed second-part requirements;
- concern about uncompensated candidate work.

A separate 3D-art candidate reported a demanding take-home task and concern about submitted-source usage.

These are individual candidate reports. They should guide **questions and risk control**, not be treated as proven universal company behavior.

Public employee reviews are mixed, including both positive reports and a negative Senior Flutter review describing workload/availability concerns.

---

# 21. Sources

Public research refreshed on **19 Sep 2026**.

- Supono Holdings — Flutter Mobile Developer:  
  https://suponoholdings.com/jobs/flutter-mobile-developer-1

- Supono Holdings — Careers:  
  https://suponoholdings.com/jobs

- LinkedIn — recent Senior Flutter Developer, Cyprus:  
  https://cy.linkedin.com/jobs/view/senior-flutter-developer-at-supono-holdings-ltd-4461755311

- LinkedIn — older Senior Flutter Developer listing with explicit Cyprus-resident restriction:  
  https://cy.linkedin.com/jobs/view/senior-flutter-developer-at-supono-holdings-ltd-4385035180

- Glassdoor — Supono interview reports:  
  https://www.glassdoor.com/Interview/Supono-Holdings-Interview-Questions-E9745247.htm

---

# 22. Practice protocol with ChatGPT

When ready, use this sequence.

## Session A — Video screen simulation

Prompt:

> "Run the Supono one-attempt video simulation. Ask me 7 questions one at a time. Do not coach me before I answer. After each answer, grade only: clarity, seniority signal, evidence, concision, and risk. Then give me one improved version in my own voice."

## Session B — Technical pressure

Prompt:

> "Run Supono technical pressure round. Ask 10 senior Flutter/Dart questions one at a time, prioritizing async/races, REST, native/platform channels, testing, performance, Firestore, architecture and incomplete-backend scenarios."

## Session C — Follow-up attacks

Prompt:

> "Take my four production stories and challenge them like a skeptical senior engineer. Probe ownership boundaries, source of truth, failure modes, tests, observability and what I would do differently."

---

# Final reminder

> **Direct answer → evidence → engineering reason → result/tradeoff.**

Do not perform for the camera.

Explain how you actually think.

That is the strongest senior signal available.
