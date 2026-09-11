<a id="top"></a>

# Proxify Final Interview — Flutter/Dart Last-Day Cheat Sheet

**Interview:** Friday, 11 Sep 2026 — 10:30–12:00 Europe/Istanbul  
**Goal:** pass the senior Flutter/Dart technical vetting interview.  
**Use this as a last-day refresher, not as a syllabus.**

---

<a id="s0"></a>

## 0. Interview-safe corrections to the raw notes

These are deliberate wording fixes so you do not repeat an imprecise statement under pressure.

- **Dart / threads:** each **isolate** has its own memory and event loop and executes Dart code single-threadedly. Multiple isolates can run in parallel.
- **`await Future.value()`**: `await` suspends the async function; the code after it becomes a **continuation** that resumes asynchronously. Do **not** claim this is a reliable way to "let the UI render"; a microtask continuation still runs before the next event.
- **Broadcast streams:** they support multiple listeners, but events emitted while nobody is listening are generally **not buffered for future listeners**.
- **BuildContext after async:** the important issue is that the associated Element may be **unmounted**. Check `context.mounted` before context-dependent work after an async gap.
- **`shrinkWrap: true`:** it is more expensive because the scrollable must derive its extent from content. Avoid claiming it always builds every item in every situation.
- **Network timeout:** means the client did not receive a result in time; it does **not** prove the server did not process the operation.
- **401 vs 403:** 401 is usually authentication/credential-related; 403 is authorization/permission-related.

---

<a id="s1"></a>

# 1. Dart async runtime

## Event loop mental model

**Current call stack → microtask queue → next event → microtasks → next event ...**

Typical examples:

- **Synchronous:** normal Dart statements currently executing.
- **Microtasks:** `scheduleMicrotask`, `Future.microtask`, many Future continuations.
- **Event queue:** timers, I/O completion events, UI/input events, normal scheduled Futures.

### Interview answer: `await`

> "When execution reaches `await`, the async function suspends. The current call stack unwinds, and the code after the await becomes a continuation that resumes asynchronously. Pending microtasks get their turn before the next event. No new thread is created by `await`."

### Example

```dart
print('A');

scheduleMicrotask(() => print('B'));
Future(() => print('C'));

await Future.value();

print('D');
```

Expected reasoning: `A` first; `B` is already queued as a microtask; the continuation containing `D` resumes asynchronously; `C` is a later event.

---

<a id="s2"></a>

# 2. Future vs Stream

## Future

- One asynchronous result or one error.
- Good for: REST request, one database read/write, read one file, one location lookup.

## Stream

- Multiple asynchronous events over time.
- Good for: Firestore listener, WebSocket, continuous GPS, text-change/event pipelines.

## Subscription lifecycle

```dart
late final StreamSubscription sub;

@override
void initState() {
  super.initState();
  sub = service.events.listen(onEvent);
}

@override
void dispose() {
  sub.cancel();
  super.dispose();
}
```

If you own a manual subscription, **cancel it** when its lifecycle ends.

## Single-subscription vs broadcast

**Single-subscription**
- One consumer.
- A second listener is invalid.
- Good for one-consumer pipelines such as a file/response-body stream.

**Broadcast**
- Multiple active listeners.
- Events with no active listeners are normally lost.
- Good for shared app-wide events where multiple consumers may observe the same source.

---

<a id="s3"></a>

# 3. Concurrency, parallelism, isolates

## Mental model

- **Concurrency:** one chef manages multiple dishes by switching between them.
- **Parallelism:** multiple chefs work at the same time.

## Use an isolate for CPU-bound work

Example: 150–200 ms JSON parsing.

```dart
final products = await Isolate.run(
  () => parseProducts(rawJson),
);
```

Why:
- CPU-heavy work can monopolize the UI isolate.
- Another isolate has separate memory/event loop and can execute on another core.

Usually **do not move ordinary HTTP I/O to an isolate** just to make it async:
- network I/O is already non-blocking;
- most time is spent waiting, not consuming CPU.

---

<a id="s4"></a>

# 4. Flutter internals

## Widget → Element → RenderObject

### Widget
- Immutable configuration / blueprint.
- Cheap to recreate.

### Element
- Persistent mounted instance / location in the tree.
- Connects Widget, State and tree lifecycle.
- `BuildContext` is effectively an interface to an Element/location.

### RenderObject
- Layout.
- Paint.
- Hit testing.

## StatefulWidget state preservation

A rebuild can create a new Widget configuration while the existing Element and `State` survive.

Flutter can reuse an existing Element when the new Widget is compatible, principally by:

**same runtime type + compatible key**

The Element updates its Widget reference and rebuilds using the existing State.

---

<a id="s5"></a>

# 5. Keys

Use keys when **logical identity must survive movement/reordering**.

```dart
[
  CounterWidget(key: ValueKey('A')),
  CounterWidget(key: ValueKey('B')),
]
```

If reordered:

```dart
[
  CounterWidget(key: ValueKey('B')),
  CounterWidget(key: ValueKey('A')),
]
```

With stable keys, Flutter can preserve the correct Element/State with the logical item.

Without keys, same-type children may be matched mainly by **position**, so state can stay with the slot rather than with the logical item.

Quick distinctions:

- `ValueKey(value)` — identity from a stable value.
- `ObjectKey(object)` — identity from an object.
- `UniqueKey()` — always unique; prevents reuse across instances.
- `GlobalKey` — global identity/access; expensive and should be used deliberately.

---

<a id="s6"></a>

# 6. BuildContext + async gaps

`BuildContext` identifies a location in the widget tree.

Danger:

```dart
await api.updateUsername(name);
Navigator.pop(context);
```

During the `await`, the widget may be removed.

Safe pattern:

```dart
await api.updateUsername(name);

if (!context.mounted) return;

Navigator.pop(context);
```

Interview language:

> "After an async gap, the Element associated with that BuildContext may have been unmounted, so I check `mounted` before navigation, dialogs, ScaffoldMessenger access, or other context-dependent work."

---

<a id="s7"></a>

# 7. StatefulWidget lifecycle

Core order:

`createState → initState → didChangeDependencies → build → didUpdateWidget → deactivate → dispose`

## `initState()`

Runs once for that State object.

Good for:
- `TextEditingController`
- `AnimationController`
- manual subscription setup
- one-time initialization that does not establish inherited dependencies

## `didChangeDependencies()`

- Runs after `initState`.
- Can run again when an inherited dependency changes.
- Appropriate for work that depends on inherited tree data.

## `didUpdateWidget(oldWidget)`

Runs when the same Element/State is reused with a new Widget configuration.

Example:

```dart
@override
void didUpdateWidget(covariant UserProfile oldWidget) {
  super.didUpdateWidget(oldWidget);

  if (oldWidget.userId != widget.userId) {
    _subscription?.cancel();
    _subscription = subscribeToUser(widget.userId);
  }
}
```

You usually do **not** need `setState()` merely because `didUpdateWidget()` ran; a build follows.

## `dispose()`

Cancel/release:
- stream subscriptions
- timers
- animation controllers
- text controllers
- other owned resources

---

<a id="s8"></a>

# 8. Flutter layout rule

> **Constraints go down → sizes go up → parent sets position.**

Classic failure:

```dart
Column(
  children: [
    Text('Header'),
    ListView.builder(...),
  ],
)
```

A non-flex child in a `Column` can receive an unbounded vertical constraint.  
A normal `ListView` viewport wants a finite height in its scroll direction.

### Fix 1 — `Expanded`

```dart
Expanded(
  child: ListView.builder(...),
)
```

Best when the list should fill the remaining screen space.

### Fix 2 — `shrinkWrap: true`

Useful for a **small** embedded list where content-sized layout is intentional.

Tradeoff: more layout work; not a default choice for a large list.

---

<a id="s9"></a>

# 9. Request coalescing / duplicate API calls

Problem: two callers request the same resource at the same time.

Pattern: share one in-flight Future.

```dart
final Map<String, Future<User>> _inFlight = {};

Future<User> loadUser(String id) {
  final existing = _inFlight[id];
  if (existing != null) return existing;

  final future = _fetchAndCleanup(id);
  _inFlight[id] = future;
  return future;
}

Future<User> _fetchAndCleanup(String id) async {
  try {
    return await api.fetchUser(id);
  } finally {
    _inFlight.remove(id);
  }
}
```

Important:
- all callers await the same Future;
- clean up on **success and failure**;
- otherwise a failed Future can remain stuck in the map.

---

<a id="s10"></a>

# 10. Debounce + stale response protection

Debounce solves **too many requests**.

A request generation/token solves **out-of-order responses**.

```dart
Timer? _debounce;
int _activeRequestId = 0;

void onQuery(String rawQuery) {
  final query = rawQuery.trim().toLowerCase();

  _activeRequestId++;
  final requestId = _activeRequestId;

  _debounce?.cancel();

  if (query.isEmpty) {
    updateUI([]);
    return;
  }

  _debounce = Timer(const Duration(milliseconds: 300), () async {
    try {
      final results = await searchApi(query);

      if (requestId == _activeRequestId) {
        updateUI(results);
      }
    } catch (error) {
      if (requestId == _activeRequestId) {
        showError(error);
      }
    }
  });
}
```

Key insight:

> Canceling a Timer does not cancel an HTTP request that already started. The request ID prevents an older in-flight response from overwriting newer state.

---

<a id="s11"></a>

# 11. Deterministic async race testing

Avoid real `sleep()`.

Use:
- `fakeAsync` to control timer time;
- `Completer` to control Future completion order.

Test invariant:

1. `"dart"` request starts.
2. `"flutter"` request starts later.
3. complete `"flutter"` first.
4. UI becomes Flutter result.
5. complete `"dart"` afterward.
6. UI must **still** be Flutter result.

You are testing **completion order**, not real wall-clock duration.

---

<a id="s12"></a>

# 12. Non-technical / seniority questions

These can be as important as trivia because they test ownership, communication and client readiness.

1. Tell me about yourself.
2. Why are you interested in Proxify?
3. Tell me about the most difficult production problem you personally owned.
4. Tell me about a production incident and how you diagnosed it.
5. Tell me about a disagreement with another engineer.
6. Tell me about a time you changed your mind after new evidence.
7. How do you handle unclear requirements from a product/client team?
8. What do you do when you disagree with an existing architecture?
9. How do you balance delivery speed vs technical quality?
10. How do you work in a codebase with patterns you would not personally choose?
11. How do you communicate a risky technical decision to non-engineers?
12. Tell me about a regression you prevented through testing.
13. Tell me about a performance problem you measured and fixed.
14. What do you do when you cannot reproduce a customer issue?
15. Tell me about a time you had to work outside Flutter to solve the real problem.
16. How do you approach code review?
17. How do you onboard into an unfamiliar codebase?
18. How do you handle being blocked by another team?
19. What would your teammates say you are strongest at?
20. What is one area you are actively improving?
21. How do you use AI tools in software development?
22. How do you ensure AI-generated code is safe to ship?
23. How do you respond when an interviewer/teammate points out a bug in your approach?
24. Tell me about your current company transition and how you handled change professionally.
25. What kind of client/team environment helps you do your best work?

---


---

<a id="s13"></a>

# 13. Retry policy

Automatic retry belongs close to the **network policy/client layer**, not duplicated in every state manager.

Use:
- retry classification;
- exponential backoff;
- jitter;
- max attempts;
- observability.

Example reasoning:

> "I retry transient failures such as selected timeouts or 5xx responses with bounded exponential backoff and jitter. I do not blindly retry non-retryable validation/auth failures or unsafe mutations."

---

<a id="s14"></a>

# 14. Idempotency

## Timeout does not mean failure on the server

For:

```text
POST /payments
```

the client may time out **after the server charged the user**.

Blind retry can create a duplicate charge.

## Safe design

Generate one idempotency key for **one logical operation**:

```text
Idempotency-Key: <stable UUID for this payment intent>
```

Reuse the **same key** on retry.

Backend must enforce it:
- first request performs/stores the operation;
- duplicate request with same key does not execute it again;
- ideally returns the stored/in-progress outcome.

Then bounded retry can become safe for that logical operation.

---

<a id="s15"></a>

# 15. Pagination + refresh

Useful state:

- items
- next cursor/page
- `isLoadingInitial`
- `isLoadingNextPage`
- `isRefreshing`
- `hasReachedEnd`
- error
- current filter/query generation

## Next page

- guard duplicate `loadNextPage`;
- request next cursor/page;
- merge by stable ID;
- preserve stable order;
- update `hasReachedEnd`.

## Pull-to-refresh

- start a new query/request generation;
- fetch page 1 / fresh source;
- prevent old pagination results from being appended afterward;
- replace/merge state deliberately.

## Important race

If refresh happens while page N is in flight:
- old page N must not append to the new refreshed dataset.

Use:
- generation/version token;
- cancellation if your stack supports it;
- or serialized policy where appropriate.

---

<a id="s16"></a>

# 16. Local cache + API flow

Example product-list startup:

1. screen opens;
2. state requests repository;
3. repository can return cached data quickly;
4. UI paints cached data;
5. repository/network fetches fresh data;
6. fresh result updates cache;
7. state/UI updates.

Be explicit about **source of truth** and freshness policy.

For failures:
- do not delete useful existing data just because refresh failed;
- preserve content and show a recoverable error/retry state when appropriate.

---

<a id="s17"></a>

# 17. Error modeling

Do not leak raw Dio exceptions / raw HTTP codes directly into UI state.

Translate infrastructure errors at a data/repository boundary into semantic failures such as:

- `ConnectivityFailure`
- `TimeoutFailure`
- `AuthenticationFailure`
- `AuthorizationFailure`
- `ValidationFailure`
- `ServerFailure`

Typical behavior:

- **offline/socket** → offline state/banner, retry when useful
- **timeout** → retryable depending on operation/idempotency
- **401** → refresh flow or authentication recovery
- **403** → permission/authorization UI
- **422** → domain/field validation
- **5xx** → server failure, bounded retry if safe

Interview line:

> "The state layer should react to semantic failures, not know whether the networking library was Dio or whether the backend returned a specific transport exception."

---

<a id="s18"></a>

# 18. Firestore / realtime

## Frequent listeners: risks

- read cost
- CPU/rebuild pressure
- battery/network usage
- listener lifecycle leaks
- broad queries causing unnecessary updates

Mitigations:
- listen only to the data you need;
- narrow query/filter scope;
- attach/detach with screen lifecycle;
- keep rebuild scope granular;
- avoid rebinding high-frequency streams directly to a huge UI subtree;
- understand cache/offline behavior;
- measure read amplification.

## Security boundary

Client-side checks are UX.  
**Firestore Security Rules / trusted backend are the security boundary.**

## Transaction vs batch

**Transaction**
- reads current state;
- writes depend on what was read;
- retries if conflicting data changes.

Example: verify inventory is still available, then decrement it.

**Batch write**
- multiple writes atomically;
- no "read current value and make a decision" requirement.

---

<a id="s19"></a>

# 19. Cubit vs BLoC

## Cubit

UI / caller invokes public methods:

```text
UI → cubit.method() → emit(newState)
```

Use when transitions are straightforward and an event layer adds little value.

## BLoC

```text
UI/source → typed Event → handler / concurrency policy → emit(State)
```

Extra event layer can be valuable when:
- many event sources exist;
- event sequencing matters;
- concurrency behavior matters;
- you need droppable/restartable/debounce/throttle-style event handling;
- traceability of "why did this state change?" matters.

Interview-safe wording:

> "My production background has used other approaches more heavily, but I understand BLoC's unidirectional flow and would follow the codebase/team convention rather than forcing a library."

Avoid: "BLoC is the architecture."

---

<a id="s20"></a>

# 20. Performance / jank

If scrolling is slow:

1. reproduce in **profile mode**;
2. measure in Flutter DevTools;
3. inspect frame timing;
4. determine UI-thread CPU vs raster/GPU vs memory/image issue;
5. find the hot work;
6. fix;
7. measure again.

Common causes:
- expensive synchronous work in `build`;
- too-large rebuild scope;
- non-lazy huge widget trees;
- image decode/cache problems;
- CPU-heavy parsing on UI isolate;
- memory growth / leaked subscriptions/controllers.

Useful tools/concepts:
- `ListView.builder`
- granular state listening
- `const` where it actually prevents unnecessary work
- isolates for real CPU-heavy work
- CPU/memory/frame profiling

---

<a id="s21"></a>

# 21. Testing

## Unit
Pure Dart:
- reducers/state transitions
- retry classification
- repositories/use cases
- merge/dedup logic

## Widget
- rendering
- interactions
- validation
- state-driven UI
- navigation with injected dependencies

## Integration
- critical end-to-end flows
- platform/backend integration
- fewer and slower

## Async tests

Prefer deterministic control:
- fake clock
- `Completer`
- fake repository/API
- explicit error paths

Avoid tests that depend on arbitrary real-time sleeps.

---

<a id="s22"></a>

# 22. Native / platform quick hits

## MethodChannel
Request/response style communication between Dart and platform code.

## EventChannel
Continuous event stream from platform to Dart.

## FFI
Direct native-library interoperability; useful when calling C-compatible/native libraries rather than platform UI/service APIs.

## Android
- WorkManager: deferrable background work with OS scheduling constraints.
- Foreground service: ongoing user-visible work that must continue under stricter background rules.
- notification channels: Android notification categorization/configuration.

## iOS
Know push flow at a high level and permission/foreground/background handling.

Swift:
- `struct` = value semantics
- `class` = reference semantics / identity / inheritance

---

<a id="s23"></a>

# 23. Live-coding behavior — this matters as much as syntax

Before touching code:

> "Let me restate the requirement to make sure I understood it."

Clarify:
- input/output
- invalid input
- duplicates
- ordering
- async behavior
- mutation rules
- constraints

Then:

1. state assumptions;
2. choose the simplest correct approach;
3. narrate while coding;
4. code incrementally;
5. test happy path;
6. test empty/boundary/duplicate/error/race cases;
7. discuss complexity/tradeoffs;
8. accept hints and adapt.

If interviewer finds a bug:

> "Good point. My current version allows that. I would change it by..."

Do not defend broken code.

---

<a id="s24"></a>

# 24. Production-scenario checklist

When given an architecture/reliability problem, quickly ask yourself:

1. **What is the source of truth?**
2. **What can fail?**
3. **What can race?**
4. **What happens offline?**
5. **Is retry safe?**
6. **How do I prevent duplicates?**
7. **How is it observed?**
8. **How would I test it?**
9. **How does the user recover?**

---

<a id="s25"></a>

# 25. 30-second answer templates

## Async
> "I would separate CPU-bound work from I/O. Normal network I/O is already asynchronous and non-blocking, while CPU-heavy parsing can block the UI isolate and may belong in another isolate."

## Race
> "I would first define the ordering invariant. If older work can finish later, I would use cancellation where available or a generation/token check so stale completion cannot mutate current state."

## Retry
> "I would retry only classified transient failures, with bounded exponential backoff and jitter, and only when the operation is safe or idempotent."

## Architecture
> "I start from change boundaries rather than forcing layers. UI/state owns presentation transitions; repository owns data-source coordination; transport details stay below that boundary; domain rules get their own layer only when complexity justifies it."

## Performance
> "I would reproduce in profile mode, measure before guessing, isolate whether the bottleneck is UI CPU, raster/GPU, memory or I/O, fix the measured hot path, and compare metrics afterward."

---

<a id="s26"></a>

# 26. Final 5-minute pre-interview reminder

Do **not** try to sound encyclopedic.

For every answer:

**direct answer → why → production consequence → tradeoff**

For coding:

**clarify → narrate → simplest solution → test → edge case → complexity**

If you do not know exact syntax:

> "I haven't used that exact API recently, so I don't want to invent the syntax. Conceptually, I would approach it by..."

If uncertain:

> "I'm not fully certain. My current understanding is X because Y. I would verify Z before shipping it."

Your strongest signal is not trivia. It is that you can connect Flutter UI behavior to state, networking, Firebase, testing, reliability and production impact.


---

<a id="s27"></a>

# 27. Tell me about yourself — 60–75 second version

Use this as a **structure**, not a memorized speech.

> "I'm a mobile-focused software engineer with around nine years of commercial experience, and I've spent about six and a half years working primarily with Flutter and Dart.
>
> For nearly four years I've been working remotely with a US-based product company on production mobile and web applications used in operational workflows. My work includes Flutter architecture, API integrations, Firebase and Firestore, testing, CI/CD, production monitoring and reliability improvements.
>
> Over time, my role became less about implementing isolated UI screens and more about ownership. I enjoy investigating real production problems, especially reliability and connectivity issues. For example, I worked on intermittent upload failures by adding telemetry, reproducing the issue under weak network conditions, and helping implement a more resilient persistence and retry flow.
>
> Earlier in my career I also worked with native Android, iOS and C#/.NET, so I'm comfortable following a problem beyond Flutter when needed. Recently I've also been using AI development tools such as Cursor and Codex to speed up implementation and investigation, while keeping architecture and code-review decisions under my own control.
>
> I'm now looking for opportunities where I can use that mobile product experience on technically challenging systems and continue growing in architecture and broader mobile engineering."

### Shorter 30–45 second version

> "I'm a mobile-focused software engineer with around nine years of commercial experience and about six and a half years primarily in Flutter and Dart. For nearly four years I've worked remotely with a US-based product company on production mobile and web workflows, covering Flutter architecture, Firebase, APIs, testing, CI/CD and reliability. Over time my role became more about ownership and production problem-solving rather than isolated UI work. I'm now looking for technically challenging mobile product work where I can keep growing in architecture and broader engineering."

### Optional "Why Proxify?" add-on

> "What interests me about Proxify is the opportunity to work with international product teams where a senior engineer is expected to communicate clearly, understand the product problem and take ownership beyond just implementing UI tickets."

<a id="s28"></a>

# 28. Strong real-project story — workflow modernization

This is the story we developed during the mock. Keep ownership boundaries accurate.

## 60–90 second STAR version

> **Situation:** "One project I worked on was a core operational workflow that had originally been more desktop-oriented, while field users needed to complete the same workflow reliably from mobile."
>
> **Task:** "My responsibility was not just to rewrite screens. I needed to modernize the Flutter client path while keeping backward compatibility with the existing production workflow and coordinating with the existing backend/data systems."
>
> **Action:** "On the client side, I helped move the workflow toward Flutter plus Firebase/Firestore for the read experience while writes still went through the API/backend path. Dataverse/Dynamics 365 remained the system of record. I focused on the Flutter integration, state handling and rollout behavior rather than claiming ownership of the backend implementation. We used feature flags for controlled rollout. Where the API response returned an updated timestamp, we compared it with listener/cache data so an older Firestore projection would not overwrite newer client state."
>
> **Result:** "The workflow stabilized and then ran for roughly 18 months without a production incident. The main lesson for me was that reliability came less from the UI rewrite itself and more from respecting source-of-truth boundaries, backward compatibility, rollout control and reconciliation."

## If they probe deeper

Be precise about ownership:

> "The .NET/backend integration was owned by the backend team. My ownership was the Flutter/client integration and the client-side behavior around state, reads, writes, rollout and reconciliation."

Likely follow-ups:

- What was the source of truth?
- Why Firebase/Firestore for the read path?
- How did you handle eventual consistency?
- How did you avoid stale listener data overwriting newer UI state?
- What did **you personally** implement?
- What made the rollout safe?
- What would you design differently today?
- How did you test and observe the migration?

Do not invent details that were owned by another team.

---

<a id="s29"></a>

# 29. Cubit vs BLoC — expanded last-day notes

## Core rule

> "Cubit uses methods. BLoC uses explicit events. I start with Cubit when the flow is simple and move to BLoC when explicit events, concurrency control or traceability add real value."

## Mental model

### Cubit

```text
UI → public method → emit(State) → UI
```

- API: public methods such as `increment()`, `load()`, `refresh()`
- Input: method call
- Traceability: mainly states / method-level behavior
- Boilerplate: lower
- Good for: simple state, few triggers, straightforward flows

### BLoC

```text
UI/source → Event → handler/transformer → emit(State) → UI
```

- API: `add(Event)`
- Input: typed event object
- Traceability: events + states
- Boilerplate: higher
- Good for: event-heavy flows, multiple event sources, explicit sequencing, concurrency control, audit/debug trace

## Three interview-safe rules

1. **State is immutable.** Emit a new state rather than mutating the old one.
2. **Flow is one direction:** UI/source → event/method → state manager → state → UI.
3. **BLoC should not own widget concerns.** Do not put `BuildContext`, `Navigator` or `SnackBar` orchestration inside business/state logic.

## Event transformers / concurrency behavior

| Transformer | Behaviour | Good real use |
|---|---|---|
| `concurrent()` | handlers may overlap | independent, order-free work |
| `sequential()` | queue one at a time, preserve order | writes that must not interleave |
| `droppable()` | ignore new events while one is running | double-tap / submit-spam guard |
| `restartable()` | cancel/obsolete previous handler, keep newest | search-as-you-type, live filters |

Important interview point:

> Do not say "BLoC gives concurrency automatically." Say that the event layer can make concurrency policy explicit, and the chosen transformer changes how overlapping events are handled.

## One-off UI effects

Do not force every navigation/snackbar into persistent business state.

Possible approaches depend on the codebase:
- model a short-lived effect deliberately;
- use a listener side-effect boundary;
- keep navigation orchestration in presentation.

Explain the tradeoff rather than claiming one universal pattern.

---

<a id="s30"></a>

# 30. Question map for tomorrow — not leaked questions

These are **practice prompts inferred from the official interview format, the preparation brief, your background, and common senior Flutter evaluation patterns**. They are not claimed to be Marko's exact questions.

## A. Very likely / high-value technical prompts

### Flutter / Dart

1. Explain Widget vs Element vs RenderObject.
2. How does a StatefulWidget preserve State across rebuilds?
3. What exactly is BuildContext and why can it become invalid after `await`?
4. `initState` vs `didChangeDependencies` vs `didUpdateWidget`.
5. Why do keys matter when children reorder?
6. Explain Flutter constraints and a common unbounded-height failure.
7. Explain Dart's event loop and what `await` actually does.
8. Future vs Stream; single-subscription vs broadcast.
9. When should you use an isolate?
10. How would you prevent a stale async response from overwriting newer state?

### Architecture / reliability

11. Where should API/cache coordination live?
12. How do you prevent duplicate simultaneous requests?
13. How do you handle 5 simultaneous 401s with only one token refresh?
14. How do you design retry safely?
15. Why is retrying a timed-out POST dangerous?
16. What is idempotency and how would you design it?
17. How do you structure pagination + pull-to-refresh without races?
18. Where do raw Dio/HTTP errors become domain/app failures?
19. What is the source of truth in an offline/cache-backed feature?
20. When is BLoC worth the extra event layer over Cubit?

### Firebase / Firestore

21. Transaction vs batch: when and why?
22. What causes Firestore listener/read-cost amplification?
23. Security Rules vs client validation: where is the trust boundary?
24. How do you debug "Firestore is real-time but the UI is stale"?
25. How do you handle offline/cache behavior and listener lifecycle?

### Testing / performance

26. Unit vs widget vs integration tests.
27. Fake vs mock.
28. How do you test retries or races without real `sleep()`?
29. A list scrolls at 30 FPS: how do you investigate it?
30. How do you find excessive rebuilds or memory growth?

---

<a id="s31"></a>

# 31. Native / platform questions worth reviewing

We do **not** know that the interviewer will focus on native topics. If you have evidence that he has a native background, treat this as extra preparation, not a prediction.

High-yield native questions:

1. **MethodChannel vs EventChannel** — request/response vs continuous event stream.
2. **FFI vs platform channels** — C/native library calls vs platform API/service integration.
3. When would you write native Android/iOS code instead of staying in Dart?
4. How would you debug a bug that happens only on Android but not iOS?
5. How do you handle platform-channel errors and serialization boundaries?
6. What happens to Flutter state if Android kills the process?
7. WorkManager vs foreground service.
8. Android notification channels and background execution restrictions.
9. iOS push notification flow at a high level.
10. Swift `struct` vs `class`.
11. How would you expose a continuous native sensor stream to Flutter?
12. How do plugin lifecycle and Activity/engine attachment issues show up in production?

### Interview-safe answers to three core native prompts

**MethodChannel vs EventChannel**

> "MethodChannel is suitable for request/response calls between Dart and platform code. EventChannel is for a continuous stream of events from the platform side, such as sensor updates."

**FFI vs MethodChannel**

> "I would use FFI when I need direct interoperability with a native C-compatible library. I would use a platform channel when I need to interact with Android/iOS platform APIs, lifecycle or services."

**Android-only bug**

> "I would reproduce on the affected Android version/device, separate Dart-side behavior from platform/plugin behavior, inspect logs and lifecycle, compare permissions/background restrictions, then narrow the issue before changing code."

---

<a id="s32"></a>

# 32. Four stories to have ready

Do not memorize every word. Know the **spine** of each story.

## Story A — Workflow modernization
Use Section 28.

Signals:
- cross-stack ownership
- source of truth
- backward compatibility
- feature flags
- reconciliation
- long production stability

## Story B — Poor connectivity / reliability

Structure:
- intermittent upload/operation failures under weak mobile connectivity;
- gather telemetry and reproduce under realistic conditions;
- local persistence + bounded retries / idempotent sync where applicable;
- monitor after release;
- lesson: mobile networks and user interruptions must be treated as normal operating conditions, not edge cases.

## Story C — API / pagination / performance

Structure:
- performance/ordering issue crossed client/backend contract;
- measure before changing;
- inspect pagination/sorting/API behavior;
- choose the simplest fix at the correct boundary;
- verify response/performance and prevent regression.

## Story D — PagerDuty / operations

Structure:
- production ownership rather than "someone else's problem";
- detection/escalation path;
- narrow the fault domain;
- safe/reversible mitigation;
- follow-up monitoring/testing;
- show calm communication and learning.

For every story, force yourself to say:
- **I personally did...**
- **I chose it because...**
- **The observable result was...**
- **Today I would improve...**

---

<a id="s33"></a>

# 33. Questions to ask the interviewer

Pick 2–3 only if time allows.

> "What distinguishes developers who do especially well in Proxify client engagements after passing the technical interview?"

> "For senior Flutter engineers in the network, what kinds of client problems are you seeing most often?"

> "When you evaluate senior mobile engineers, which signals matter most beyond getting the coding task correct?"

Best repair question at the end:

> "Is there any area from our discussion today that you'd like me to clarify or go deeper on before we finish?"

---

<a id="s34"></a>

# 34. Final priority order tonight

If time is limited, study in this order:

1. **Live coding behavior** — clarify, narrate, test, accept hints.
2. **Your 4 production stories**.
3. **Async/races/retry/idempotency/auth refresh**.
4. **Widget/Element/State/BuildContext/lifecycle/constraints**.
5. **Cubit/BLoC + event transformers**.
6. **Testing/performance/Firebase**.
7. **Native quick hits**.
8. Low-probability trivia only if everything above is already comfortable.

Do not try to learn a new framework tonight.

---

<a id="s35"></a>

# 35. Stale async response — answer + code

## How would you prevent a stale async response from overwriting newer state?

> "I give each logical request a monotonically increasing generation/request ID. Every new action invalidates the previous generation immediately. When a response returns, it may update state only if the captured request ID still matches the current one. Cancellation is useful when available, but I still keep the stale-response guard because cancellation is not always guaranteed."

```dart
int _requestId = 0;

Future<void> search(String query) async {
  final myRequestId = ++_requestId;

  try {
    final results = await api.search(query);

    if (myRequestId != _requestId) return; // stale success
    emit(SearchLoaded(results));
  } catch (e) {
    if (myRequestId != _requestId) return; // stale error
    emit(SearchError(mapError(e)));
  }
}
```

**Remember:** debounce reduces request frequency; the request ID protects state from out-of-order completion.

---

<a id="s36"></a>

# 36. Five simultaneous 401s — one refresh

## How do you handle 5 simultaneous 401s with only one token refresh?

> "I keep one shared in-flight refresh Future. The first 401 creates it; the other 401s await the same Future. After refresh succeeds, each original request retries once with the new token. The shared Future is cleared when refresh finishes so later expirations can refresh again. If refresh fails irrecoverably, waiting requests fail and the app returns to an unauthenticated state."

```dart
class AuthCoordinator {
  Future<String>? _refreshing;

  Future<String> getValidToken() {
    final existing = _refreshing;
    if (existing != null) return existing;

    final future = _performRefresh();
    _refreshing = future;

    return future.whenComplete(() {
      if (identical(_refreshing, future)) {
        _refreshing = null;
      }
    });
  }

  Future<String> _performRefresh() async {
    final token = await authApi.refreshToken();
    await tokenStore.save(token);
    return token;
  }
}
```

Interceptor idea:

```dart
if (response.statusCode == 401) {
  final newToken = await authCoordinator.getValidToken();

  final retryRequest = request.copyWith(
    headers: {
      ...request.headers,
      'Authorization': 'Bearer $newToken',
    },
  );

  return client.send(retryRequest); // retry once
}
```

**Guardrails**
- no infinite `401 → refresh → retry → 401` loop;
- cap retry to once;
- never log tokens;
- if refresh fails, clear auth state/login again.

---

<a id="s37"></a>

# 37. Firestore real-time but UI is stale — debugging flow

> "I debug this layer by layer instead of assuming Firestore itself is stale."

1. Is the expected `snapshots()` listener actually attached?
2. Is the query/path/filter/tenant/user scope correct?
3. Did the write actually succeed?
4. Is the snapshot from cache or server?
5. Are there pending local writes?
6. Are Security Rules excluding data?
7. Is repository/BLoC caching or suppressing the update?
8. Is `map`, `distinct`, dedupe or DTO mapping dropping it?
9. Is the UI actually rebuilding from the changed state?
10. If optimistic UI and backend projection can race, is there a server version/timestamp to prevent stale overwrite?

Tiny diagnostic code:

```dart
StreamSubscription? _sub;

void listenToJob(String id) {
  _sub?.cancel();

  _sub = firestore
      .collection('jobs')
      .doc(id)
      .snapshots(includeMetadataChanges: true)
      .listen((snapshot) {
    print('fromCache=${snapshot.metadata.isFromCache}');
    print('pendingWrites=${snapshot.metadata.hasPendingWrites}');
    print('data=${snapshot.data()}');

    repositoryState.applySnapshot(snapshot);
  });
}
```

---

<a id="s38"></a>

# 38. Firestore offline/cache + listener lifecycle

> "I decide explicitly what the source of truth is. I can show cached last-known data for fast/offline UX, but I expose sync state when freshness matters. I attach listeners only while the owning feature needs them and cancel manual subscriptions when ownership ends."

```dart
class JobController {
  StreamSubscription<DocumentSnapshot<Map<String, dynamic>>>? _sub;

  void watchJob(String jobId) {
    _sub?.cancel();

    _sub = FirebaseFirestore.instance
        .collection('jobs')
        .doc(jobId)
        .snapshots(includeMetadataChanges: true)
        .listen(
      (snapshot) {
        final data = snapshot.data();
        if (data == null) return;

        final syncState = snapshot.metadata.hasPendingWrites
            ? SyncState.pending
            : snapshot.metadata.isFromCache
                ? SyncState.cached
                : SyncState.synced;

        emit(JobState(data: data, syncState: syncState));
      },
      onError: (error, stack) {
        emit(JobState.error(mapError(error)));
      },
    );
  }

  Future<void> dispose() async {
    await _sub?.cancel();
  }
}
```

**Offline UX**
- keep useful last-known data;
- show pending/offline state when it matters;
- do not pretend cached data is guaranteed fresh;
- reconcile on reconnect;
- avoid duplicate listeners after rebuild/navigation.

---

<a id="s39"></a>

# 39. Testing retries or races without `sleep()`

> "I make time and completion order controllable. For timers/backoff I inject a delay/clock or use `fakeAsync`. For request order I use `Completer` or a fake repository. I verify the invariant rather than relying on real wall-clock timing."

Retry example:

```dart
final delays = <Duration>[];

Future<void> fakeDelay(Duration d) async {
  delays.add(d);
}

await retryingCall(
  action: () async {
    attempts++;
    if (attempts < 3) throw TimeoutException('retry');
    return 'ok';
  },
  delay: fakeDelay,
);

expect(attempts, 3);
expect(delays, [
  const Duration(milliseconds: 100),
  const Duration(milliseconds: 200),
]);
```

Race idea:

```dart
final first = Completer<List<String>>();
final second = Completer<List<String>>();

manager.searchApi = (query) {
  if (query == 'dart') return first.future;
  return second.future;
};

manager.search('dart');
manager.search('flutter');

second.complete(['flutter']);
await Future.microtask(() {});

first.complete(['dart']);
await Future.microtask(() {});

expect(manager.results, ['flutter']);
```

**Key line:** "I don't need to simulate 1 second and 100 ms literally; I need deterministic control over which Future completes first."

---

<a id="s40"></a>

# 40. A list scrolls at 30 FPS — investigation

> "I reproduce it in profile mode and measure before changing code. I inspect frame timings in DevTools to determine whether the bottleneck is UI-thread work, Raster/GPU work, image decoding or memory pressure. Then I narrow the hot path, fix it and measure again."

1. Reproduce on a representative device in **profile mode**.
2. Inspect Flutter DevTools frame chart.
3. Check whether UI or Raster thread misses frame budget.
4. Profile CPU during scroll.
5. Inspect expensive `build`, layout and synchronous transforms.
6. Check rebuild scope.
7. Ensure large lists are lazy (`ListView.builder`, slivers).
8. Check oversized/redecoded images and cache pressure.
9. Move genuinely CPU-heavy parsing off the UI isolate if needed.
10. If Raster is hot, inspect shader/effect/GPU-heavy work.
11. Fix one measured bottleneck.
12. Re-profile and compare.

Do **not** start with "add `const` everywhere." Measure first.

---

<a id="s41"></a>

# 41. Excessive rebuilds or memory growth

## Excessive rebuilds

- use DevTools performance/rebuild profiling;
- inspect broad `BlocBuilder` / Provider / Riverpod listeners;
- use selectors or narrower listening scope;
- move expensive synchronous work out of `build`;
- split large subtrees only where ownership/rebuild boundaries justify it.

> "I first identify which widgets rebuild and what state change causes it. Then I reduce the listening scope rather than blindly memoizing everything."

## Memory growth

1. Take a baseline memory snapshot.
2. Open/close the suspect feature repeatedly.
3. Trigger GC.
4. Compare retained object counts.
5. Inspect retaining paths.

Common causes:
- uncancelled `StreamSubscription`;
- uncancelled `Timer`;
- undisposed `AnimationController` / `TextEditingController`;
- duplicate listeners;
- closures retaining large object graphs;
- unbounded caches;
- image/cache pressure;
- static/singleton references retaining screen-owned objects.

> "A real leak is about objects remaining reachable when their owning feature should be gone, so I inspect retaining paths rather than only looking at a high memory number."

---

<a id="s42"></a>

# 42. Architecture layers — simple ownership model

> "I prefer the simplest architecture that preserves testability, maintainability and clear ownership. I don't draw full Clean Architecture on every project."

| Layer | Owns | Typical fault |
|---|---|---|
| **Presentation** | widgets / screens / rendering / user interaction | broken UI |
| **Application** | Cubit / BLoC / orchestration / state transitions | wrong transition / race |
| **Domain** | entities / business rules | incorrect business rule; optional in a tiny app |
| **Repository** | abstract data contract / data-source coordination | wrong source / mapping / orchestration contract |
| **Data** | API / DB / platform implementation | endpoint / schema / persistence / platform issue |

Flow:

```text
Presentation
    ↓ intent
Application / State
    ↓
Repository contract
    ↓
Data source(s): API / Firestore / SQLite / platform
    ↑
mapped result
    ↑
Repository
    ↑
Application State
    ↑
Presentation
```

Interview answer:

> "Presentation owns rendering and interaction. Application state owns orchestration and transitions. Repository gives the app a stable data contract and coordinates sources. The data layer knows concrete APIs, databases and platform details. I add a separate domain layer only when business rules are complex enough to justify it."

### Rule

Create boundaries when:
- parts change independently;
- business rules deserve isolated tests;
- multiple data sources exist;
- infrastructure details must not leak upward;
- ownership becomes clearer.

Do not create five layers just because the diagram looks senior.
