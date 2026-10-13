<a id="top"></a>

# micro1 Mobile AI Interview — Possible Questions & Natural Answers

**Goal:** Fast prep for a ~24-minute timed AI interview.  
**Use:** Keep answers conversational. Aim for **30–75 seconds** unless the question clearly needs more detail.  
**Rule:** Do not memorize word-for-word. Remember the structure and key phrases.

---

<a id="cheat"></a>

## 0. Core Cheat Sheet

### About me
**9+ years software engineering → 6.5+ years Flutter/Dart → US product company → production reliability, APIs, debugging, testing, CI/CD**

### Debugging
**Reproduce → isolate → form hypothesis → collect evidence → smallest safe fix → regression test**

### Testing
**Unit → widget/component → integration → risky manual flows → regression around real failures**

### Performance
**Measure first → find bottleneck → change one thing → compare before/after**

### Unknown topic
> I haven't worked deeply with that specific API, but I can explain how I would approach the problem.

---

<a id="intro"></a>

# A. Introduction & Background

<a id="q1"></a>

## 1. Tell me about yourself.

> I'm a software engineer with over nine years of experience, and for the last six and a half years I've been focused mainly on Flutter and Dart.  
> For almost four years I've been working remotely for a US-based product company, building and maintaining production mobile and web applications.  
> My work includes API integrations, debugging production issues, performance improvements, automated testing, CI/CD, and reliability.  
> I enjoy problems where I need to understand why something fails in production, reproduce it, and build a reliable fix.

**Remember:** 9 years → 6.5 Flutter → US product → debugging/testing/reliability

---

<a id="q2"></a>

## 2. What is your strongest programming language?

> My strongest language is Dart, especially in production Flutter applications.  
> I'm comfortable with asynchronous programming, state management, API integrations, error handling, testing, and performance debugging.  
> I also work with TypeScript and JavaScript when I need to work across mobile, backend, or web layers.

---

<a id="q3"></a>

## 3. How much native iOS or Android experience do you have?

> My deepest production experience is Flutter and Dart.  
> I understand the native mobile layer and I've worked with platform-specific integrations, permissions, build configuration, signing, Xcode, and Android tooling when needed.  
> I wouldn't claim the same depth in Swift or Kotlin as I have in Flutter, but I'm comfortable debugging across the platform boundary.

---

<a id="q4"></a>

## 4. Why mobile development?

> I like mobile development because it combines product thinking, performance, UX, platform behavior, and backend integration.  
> A small implementation detail can directly affect the user experience, so I enjoy the feedback loop between engineering decisions and real product behavior.

---

<a id="q5"></a>

## 5. Why are you interested in this role?

> The role matches the part of engineering I enjoy most: evaluating behavior, debugging edge cases, reviewing code, and deciding whether an implementation is actually correct.  
> I also like work where reasoning quality matters, not just writing code quickly.  
> My production background helps because I'm used to thinking about reliability, failure modes, and whether something will work outside the happy path.

---

<a id="debug"></a>

# B. Debugging & Problem Solving

<a id="q6"></a>

## 6. How do you debug a complex mobile issue?

> First, I try to make the problem reproducible. I collect the exact steps, environment, logs, and expected versus actual behavior.  
> Then I isolate the problem layer by layer: UI state, application logic, network request, backend response, persistence, or platform integration.  
> I reduce it to the smallest failing scenario, form a hypothesis, and verify it with evidence instead of changing multiple things at once.  
> Once I find the root cause, I make the smallest safe fix and add a regression test if possible.

---

<a id="q7"></a>

## 7. What do you do if a bug only happens in production?

> I first narrow the conditions: app version, device or OS differences, user flow, API responses, timing, and logs.  
> Then I try to reproduce the same conditions locally or in a controlled environment.  
> If reproduction is difficult, I add safe observability around the suspected area instead of guessing.  
> The goal is to collect enough evidence to turn an intermittent production issue into a testable hypothesis.

---

<a id="q8"></a>

## 8. Tell me about a difficult production issue you solved.

> One type of issue I've handled is API behavior that looked correct functionally but caused performance and reliability problems under real usage.  
> I traced the full request path, including pagination, sorting, asynchronous calls, and unnecessary work.  
> Instead of fixing only the visible UI symptom, I measured where time was actually being spent, changed the bottleneck, and verified the result with tests and timing measurements.  
> The main lesson was to measure first and fix the real cause rather than guessing.

---

<a id="q9"></a>

## 9. How do you approach an intermittent bug?

> I try to identify what changes between successful and failing runs: timing, lifecycle, network state, concurrency, cached state, device differences, or external dependencies.  
> I add focused logging around those variables and try to reduce the randomness.  
> Intermittent bugs usually become much easier once you can describe the condition that triggers them.

---

<a id="q10"></a>

## 10. How do you avoid fixing the wrong problem?

> I try to separate symptoms from causes.  
> Before changing code, I ask what evidence would prove or disprove my current hypothesis.  
> If I can measure it, reproduce it, or create a failing test, I do that first.  
> That prevents me from making a large change based only on intuition.

---

<a id="testing"></a>

# C. Testing & Reliability

<a id="q11"></a>

## 11. How do you test a mobile application?

> I use multiple levels of testing.  
> Unit tests cover business logic and edge cases. Widget or component tests cover important UI behavior. Integration tests cover critical flows.  
> For production issues, I add regression coverage around the exact failure when possible.  
> Before release, I focus manual testing on high-risk areas such as permissions, lifecycle changes, networking, offline behavior, and error recovery.

---

<a id="q12"></a>

## 12. What should be unit tested?

> I unit test logic that can fail independently of the UI: state transitions, transformations, validation, reducers, retry rules, business decisions, and edge cases.  
> I avoid testing framework internals.  
> The most valuable unit tests are usually the ones that protect important product behavior from regression.

---

<a id="q13"></a>

## 13. What is your approach to regression testing?

> When a real bug is found, I first try to create a test that reproduces it.  
> Then I make the smallest fix and keep that test permanently.  
> That way the bug becomes part of the product's documented behavior and is much less likely to come back later.

---

<a id="q14"></a>

## 14. How do you test async code?

> I control the dependencies and timing as much as possible.  
> I use fake or mocked services, deterministic responses, and explicit state expectations.  
> I also test failure cases such as timeouts, retries, cancellation, duplicate requests, and race conditions, not just the successful result.

---

<a id="q15"></a>

## 15. How do you make a mobile app reliable?

> Reliability comes from predictable state, defensive error handling, tests around critical paths, and observability.  
> I also try to make failure states recoverable.  
> A reliable app should not just avoid crashes; when something goes wrong, it should return the user to a safe state and explain what they can do next.

---

<a id="architecture"></a>

# D. Architecture & State Management

<a id="q16"></a>

## 16. What architecture do you prefer in Flutter?

> I prefer a clear separation between presentation, business logic, and data access.  
> The exact state-management library is less important to me than predictable state transitions, testability, and keeping side effects outside the UI.  
> I adapt to the existing codebase rather than forcing one pattern everywhere.

---

<a id="q17"></a>

## 17. BLoC, Riverpod, Provider, GetX — which do you prefer?

> I don't choose a state-management solution based only on preference.  
> I look at the size of the app, team experience, existing architecture, testability, and how much state coordination is needed.  
> For larger production apps I like explicit, predictable state transitions, but I can work effectively with different patterns.

---

<a id="q18"></a>

## 18. How do you separate business logic from UI?

> I keep UI focused on rendering state and forwarding user intent.  
> Business rules, async operations, and side effects live outside the widget layer.  
> This makes the logic easier to test, easier to reuse, and less dependent on Flutter-specific lifecycle behavior.

---

<a id="q19"></a>

## 19. What makes code maintainable?

> Clear boundaries, small responsibilities, predictable naming, tests around important behavior, and avoiding unnecessary abstraction.  
> I also value code that makes failure modes explicit.  
> Maintainable code should be easy for the next engineer to understand without needing to reverse-engineer hidden behavior.

---

<a id="apis"></a>

# E. APIs, Offline, Errors

<a id="q20"></a>

## 20. How do you handle API failures?

> I separate different kinds of failures: no connection, timeout, server error, validation error, authorization error, and unexpected application failure.  
> The UI should receive a meaningful typed state instead of a raw exception.  
> Retryable failures can offer retry or controlled backoff, while permanent failures should clearly tell the user what happened.

---

<a id="q21"></a>

## 21. How do you prevent duplicate API requests?

> I control where requests are triggered and avoid tying important network calls directly to repeated UI rebuilds.  
> For operations where duplication would be dangerous, I use techniques such as request deduplication, intent keys, single-flight behavior, or idempotency on the backend when available.

---

<a id="q22"></a>

## 22. How would you design offline support?

> It depends on the product, but I usually separate local state from synchronization state.  
> User actions can be stored locally first, then synchronized when connectivity returns.  
> The important parts are conflict handling, retry strategy, duplicate prevention, and making it clear which data is confirmed by the server versus only local.

---

<a id="q23"></a>

## 23. What is idempotency and why is it useful?

> Idempotency means the same operation can be safely repeated without creating an unintended second result.  
> It's especially useful for payments, submissions, retries, or unstable network conditions where the client may not know whether the first request succeeded.  
> A stable idempotency key lets the server recognize the same intent.

---

<a id="performance"></a>

# F. Performance

<a id="q24"></a>

## 24. How do you improve Flutter performance?

> I measure first instead of optimizing blindly.  
> I look for unnecessary rebuilds, expensive work on the UI thread, repeated API calls, large payloads, memory pressure, and slow startup or rendering paths.  
> Then I change one bottleneck at a time and compare before and after.

---

<a id="q25"></a>

## 25. What can cause jank in Flutter?

> Common causes are too much synchronous work on the main isolate, excessive rebuilds, expensive layouts, image decoding, large lists without efficient rendering, or work being done during animations.  
> I use profiling tools to identify the frame or operation causing the problem rather than assuming.

---

<a id="q26"></a>

## 26. How do you optimize a slow API-driven screen?

> I first separate backend latency from client-side work.  
> Then I look at request duplication, payload size, pagination, sorting, parsing cost, state updates, and rebuild frequency.  
> Sometimes the right fix is on the client, sometimes the API, and sometimes both.

---

<a id="async"></a>

# G. Async, Concurrency, Lifecycle

<a id="q27"></a>

## 27. What is a race condition?

> A race condition happens when the result depends on the timing or order of asynchronous operations.  
> For example, two requests may update the same state, and an older response can overwrite a newer one.  
> I handle this with cancellation, request identity, sequencing, state guards, or designing the operation to be idempotent.

---

<a id="q28"></a>

## 28. How do you handle app lifecycle changes?

> I treat backgrounding, interruption, and resume as real product states.  
> Long-running operations should either pause safely, cancel, or be recoverable.  
> I avoid assuming that an operation will always finish just because it started while the app was active.

---

<a id="q29"></a>

## 29. What is the danger of an unawaited async call?

> An unawaited call can make control flow harder to reason about.  
> Errors may be lost, dependent work may run too early, and the caller may assume something completed when it didn't.  
> Sometimes fire-and-forget is intentional, but I make that explicit and make sure failures are safely handled.

---

<a id="security"></a>

# H. Security & Privacy

<a id="q30"></a>

## 30. How do you think about privacy in mobile apps?

> I try to collect only what the product actually needs.  
> Sensitive information should not appear in logs, analytics, or crash metadata unless there is a clear reason and appropriate protection.  
> I also prefer local processing when it can meet the product requirement without sending user data to a server.

---

<a id="q31"></a>

## 31. How should permissions be requested?

> At the moment the feature needs them, not automatically at app launch unless there is a strong reason.  
> The user should understand why the permission is needed, and the app should handle denied and permanently denied states gracefully.

---

<a id="ai"></a>

# I. Code Review & AI Evaluation

<a id="q32"></a>

## 32. What do you look for in a code review?

> First I check correctness: does the code actually satisfy the requirement and handle failure cases?  
> Then I look at readability, state management, edge cases, tests, performance, and whether the change creates unnecessary complexity.  
> I try to distinguish must-fix issues from personal style preferences.

---

<a id="q33"></a>

## 33. How would you evaluate AI-generated code?

> I would not judge it by how confident or clean it looks.  
> I would verify the requirements, run or reason through edge cases, inspect error handling, look for hidden assumptions, and test the code if possible.  
> AI-generated code should be evaluated exactly like production code: behavior first, then maintainability and safety.

---

<a id="q34"></a>

## 34. What makes an AI coding answer good?

> It should be correct, relevant to the actual environment, explicit about assumptions, and safe to apply.  
> A strong answer explains trade-offs and doesn't invent APIs or claim something was verified when it wasn't.  
> For code, I also care about whether it handles edge cases and can be tested.

---

<a id="q35"></a>

## 35. What would make you reject an AI-generated solution?

> If it solves the wrong problem, relies on nonexistent APIs, ignores important failure modes, introduces unnecessary complexity, or makes claims without evidence.  
> I would also reject a solution that technically works but is unsafe for the product context.

---

<a id="q36"></a>

## 36. Why would you be good at evaluating AI code?

> A large part of my production work is deciding whether code actually behaves correctly, not just whether it looks reasonable.  
> I'm used to debugging, reviewing implementations, writing regression tests, and checking edge cases.  
> That maps directly to evaluating AI-generated code and technical responses.

---

<a id="behavioral"></a>

# J. Behavioral Questions

<a id="q37"></a>

## 37. Tell me about a disagreement with a teammate.

> I try to move the discussion from preference to evidence.  
> I explain the trade-offs, listen to the other person's concerns, and if possible use a small experiment, benchmark, or test to compare the options.  
> The goal is not to win the argument; it's to make the best technical decision for the product.

---

<a id="q38"></a>

## 38. How do you handle unclear requirements?

> I identify what is known, what is ambiguous, and what decision would change the implementation significantly.  
> I ask focused questions instead of asking for the whole requirement again.  
> If a decision can safely be deferred, I choose a simple design that keeps options open.

---

<a id="q39"></a>

## 39. How do you prioritize under time pressure?

> I prioritize by user impact, production risk, and reversibility.  
> I first protect critical flows and remove blockers, then handle improvements that can safely wait.  
> Under time pressure, I prefer a small well-tested fix over a large cleanup unless the cleanup is required for correctness.

---

<a id="q40"></a>

## 40. Tell me about a mistake you made.

> I've had situations where an initial hypothesis about a bug was wrong.  
> What helped was going back to the evidence instead of defending the first idea.  
> I learned to isolate variables and verify assumptions earlier, especially for timing, performance, and asynchronous issues.

---

<a id="q41"></a>

## 41. How do you learn a technology you don't know?

> I start with the smallest real problem I need to solve.  
> I read the official documentation, build a minimal example, and validate my assumptions with working code.  
> I learn faster when I connect the new technology to an actual product problem instead of studying it only theoretically.

---

<a id="flutter"></a>

# K. Short Technical Questions

<a id="q42"></a>

## 42. StatefulWidget vs StatelessWidget?

> A StatelessWidget renders entirely from its inputs and external state.  
> A StatefulWidget owns mutable lifecycle state through a State object.  
> I still try to keep important business state outside widgets even when a StatefulWidget is needed for local UI behavior.

---

<a id="q43"></a>

## 43. Future vs Stream?

> A Future represents one asynchronous result.  
> A Stream represents a sequence of asynchronous values over time.  
> I use a Stream when multiple updates are part of the model, not just because something is asynchronous.

---

<a id="q44"></a>

## 44. What is an isolate in Dart?

> An isolate is an independent Dart execution context with its own memory.  
> Isolates communicate by message passing instead of sharing mutable memory.  
> They're useful when CPU-heavy work would otherwise block the main isolate and cause UI jank.

---

<a id="q45"></a>

## 45. What is BuildContext?

> BuildContext represents a widget's location in the widget tree.  
> It's used to access inherited dependencies such as Theme, MediaQuery, localization, or Navigator.  
> I avoid keeping a BuildContext longer than its widget lifecycle makes safe, especially across async gaps.

---

<a id="q46"></a>

## 46. Why use keys in Flutter?

> Keys help Flutter identify widgets across rebuilds, especially when items move, are reordered, or maintain state.  
> I use them when widget identity matters, not automatically on every widget.

---

<a id="q47"></a>

## 47. What is dependency injection?

> Dependency injection means providing an object's dependencies from outside instead of constructing everything internally.  
> It improves testability and makes implementations easier to replace, for example swapping a real API client with a fake in tests.

---

<a id="q48"></a>

## 48. REST vs WebSocket?

> REST is usually request-response and works well for standard resource operations.  
> WebSockets keep a persistent connection and are better when the server needs to push frequent real-time updates.  
> I choose based on the product's communication pattern rather than treating one as generally better.

---

<a id="situational"></a>

# L. Situational Questions

<a id="q49"></a>

## 49. The app crashes only on one device model. What do you do?

> I would compare OS version, architecture, permissions, hardware-specific behavior, memory pressure, and native plugin usage.  
> I would collect the crash trace first, then reproduce on the same or closest available environment.  
> If it points into a native plugin, I would isolate whether the problem is our integration, the plugin, or the platform API.

---

<a id="q50"></a>

## 50. A new release is slower than the previous one. What do you check?

> First I confirm the regression with comparable measurements.  
> Then I compare startup, network timing, rendering, memory, and any dependency or configuration changes between the releases.  
> I narrow it to a specific path before attempting an optimization.

---

<a id="q51"></a>

## 51. Users report duplicate submissions. How would you investigate?

> I would check whether the UI can trigger the action twice, whether retries are automatic, whether requests have unique intent IDs, and whether the backend supports idempotency.  
> I would reproduce rapid taps and unstable-network scenarios and then protect both client and server where appropriate.

---

<a id="q52"></a>

## 52. A network request succeeds, but the UI shows an error. What could cause that?

> The failure may be after the request itself: response parsing, state transformation, stale state, a race condition, or UI lifecycle handling.  
> I would trace the request from transport through parsing and state update instead of assuming the API is the problem.

---

<a id="recovery"></a>

# M. Useful Recovery Phrases During the Interview

## If you need thinking time

> Let me think through that step by step.

> The first thing I would check is whether I can reproduce it consistently.

> I would separate the problem into a few layers first.

---

## If you don't know the exact API

> I haven't worked deeply with that specific API, but I can explain how I would approach the problem.

> I don't want to guess the exact method name, but conceptually I would handle it this way.

---

## If the question is ambiguous

> There are a couple of ways to interpret that. I'll assume you mean the production behavior rather than the implementation detail.

> The answer depends on whether this is a local UI state or shared application state. For the shared-state case, I would...

---

## If you want to finish cleanly

> So the main idea is to make the behavior reproducible, isolate the cause, and protect the fix with a test.

> The trade-off I would optimize for here is correctness first, then simplicity and performance.

---

<a id="review"></a>

# N. Final 2-Minute Review

### ABOUT ME
9+ years → 6.5+ Flutter → US product → APIs/debug/testing/reliability

### DEBUG
Reproduce → isolate → hypothesis → evidence → smallest fix → regression

### TEST
Unit → widget → integration → risky manual flows

### PERFORMANCE
Measure → bottleneck → one change → compare

### AI CODE
Requirements → correctness → edge cases → evidence → tests → maintainability

### UNKNOWN
Don't bluff → explain approach

---

<a id="length"></a>

# O. Answer Length Guide

- **Simple technical:** 20–40 sec
- **Experience / behavioral:** 45–75 sec
- **Complex debugging:** 60–90 sec max
- **If timed:** answer directly first, example second

---

<a id="reminders"></a>

# P. One-Line Reminders

- Don't oversell Swift/Kotlin.
- Don't say "I always use BLoC."
- Don't turn every answer into a long story.
- Use production examples when possible.
- Prefer evidence over opinion.
- If unsure, describe your debugging process.
- Never invent an API name.
- Finish answers with the decision or lesson.

