<a id="top"></a>

# micro1 Full-Stack — Spoken Cheat Sheet

**Candidate:** Hazim Cakil · Ankara, Türkiye  
**Role:** Sr. Full-Stack Software Engineer  
**Format:** about 30 minutes, desktop. A separate coding stage, if there is one, has its own clock.  
**Rule:** These are practice questions, not a leaked list. Say what you did. For designs, say “I would.”

The mobile sheet is still at [micro1.html](micro1.html).

---

<a id="start"></a>

## 0. Say this first

### About me
**9+ years → 6.5+ Flutter → Rent Ready also Angular, TypeScript, Node, Firestore → NextMatchAI is my own Flutter/Next.js product**

### Request
**UI pending → server checks auth → write → client reconciles. A timeout does not prove the write failed.**

### Debug
**Name the flow → split the time → one hypothesis → evidence → fix → measure again**

### Async
**await does not block the runtime → Promise.all vs allSettled → a late response must not win**

### Data
**Atomic update or a constraint → idempotency key → posting list is a flashcard, not your specialty**

### AI
**Bounded task → read the diff → counterexample → you own the result**

### Unknown
**Name the boundary → explain the approach → do not apologize your way out of the answer**

---

<a id="intro"></a>

# A. Start here

<a id="q1"></a>

## 1. Tell me about yourself.

> I'm a software engineer with over nine years of experience, including more than six years building production Flutter applications.
> At Rent Ready, my work also spans Angular, TypeScript, Node.js APIs and Firestore, so I think about the complete flow from the user interface to persistence.
> I focus on debugging, testing and reliable delivery.
> I also build NextMatchAI with Flutter and Next.js, which gives me additional product and AI-integration experience.

**Türkçe:** Flutter’ı merkeze koy. Angular, Node ve Firestore’yu aynı akışın parçası olarak söyle. NextMatchAI kişisel ürün; enterprise React yılı gibi anlatma.  
**Avoid:** listing every technology. Product name is Rent Ready, not “RR Pro.”

---

<a id="q2"></a>

## 2. Why this full-stack, AI-related role?

> I enjoy understanding why software behaves the way it does, especially across frontend and backend boundaries.
> This role interests me because evaluating AI-generated implementations still requires engineering judgment: checking requirements, finding counterexamples, testing failures and explaining trade-offs.
> My production experience is useful for deciding whether a solution is reliable beyond the happy path.

**Türkçe:** “Kod yazmayı seviyorum” yetmez. Yargı: gereksinim, karşı örnek, hata, trade-off.  
**Follow-up:** First check correctness against the requirement, then failure behavior, security, performance and maintainability.

---

<a id="q3"></a>

## 3. What are your strongest and weaker areas?

> My deepest experience is Flutter and production application development, with additional Angular, TypeScript, Node and Firestore work.
> I use Next.js in my own product.
> I can reason about relational databases and distributed-system patterns, but I wouldn't claim deep PostgreSQL-internals or AWS-specialist experience.
> When a problem crosses into those areas, I work from fundamentals, verify assumptions and use the relevant documentation.

**Türkçe:** Sınırı net söyle, özür konuşması yapma. Zayıf alan = “uzman değilim, temelden giderim.”

---

<a id="stories"></a>

# B. Experience stories

Fill the brackets before you practice. Do not invent a feature, a metric, or a root cause.

<a id="q4"></a>

## 4. Walk me through an end-to-end feature.

**Needs your real details.**

> One example I can discuss is [the feature] in [Rent Ready or NextMatchAI].
> The user needed [goal]. I worked on [your actual scope], connecting the UI to [the API or storage you actually touched].
> The important constraint was [the real constraint]. I chose [the approach] because [the reason].
> I verified the main path and [one real failure case], then checked the behavior after release.

**Türkçe:** Kim yaptı, hangi istek, yetki nerede, timeout’ta ne oldu, UI yazmanın bittiğini nereden anladı.  
**Don't:** fill the brackets with a design you only wish you had shipped.

---

<a id="q5"></a>

## 5. Describe a difficult intermittent bug.

**From the mobile interview. Confirm the actual fix before you treat this as fact.**

> A useful example is a REST write and a Firestore listener arriving in an unexpected order.
> The UI could show an update that did not match the stored state. The hard part was separating what the screen was showing from what the server had confirmed.
> I compared request completion and listener events, isolated the timing window, and tested a specific order of events.
> The fix had to be an explicit rule for pending local actions versus confirmed server state, not “take whichever callback came last.”

**Türkçe:** Sıra önemli. Son gelen callback doğru demek değil. Fix’i ve regression test’i ancak hatırlıyorsan söyle.  
**Follow-ups:** OS-specific? Resume? Which sequence failed? Offline? Why was retry not enough?

---

<a id="q6"></a>

## 6. How would you diagnose intermittent full-stack latency?

**Say “I would.” This is a design, not a story you shipped.**

> I would first define the user flow and compare a normal request with a slow one.
> Then I would split the time into browser work, network, API processing, database queries and external calls, using a correlation ID where I can.
> I would look at tail latency, traffic and recent changes, then test one narrow hypothesis.
> I would also reduce user impact while I investigate, and verify the fix under the same load and failure conditions.

**Türkçe:** Ölç, katmanlara ayır, bir hipotez, kanıt, düzelt, tekrar ölç.  
**Follow-up:** Low CPU but slow? Check downstream latency, pool waits, locks and queueing. One tenant only? Data volume, query shape, that tenant’s dependencies.

---

<a id="q7"></a>

## 7. Describe a performance improvement you made.

> At Rent Ready I worked on API behavior involving pagination, sorting and asynchronous calls.
> I traced the full request path and looked for unnecessary work, instead of assuming the UI was the bottleneck.
> For this interview I would name one concrete change, how I measured it, and how I checked that correctness stayed the same.

**Türkçe:** Yüzde uydurma. Son cümleyi kendi değişikliğinle değiştir. Sıralama veya filtre yetkiyi bozdu mu, onu da bil.

---

<a id="q8"></a>

## 8. Tell me about a disagreement or a leadership decision.

> At Labor Bilisim I led a three-person mobile team and coordinated with other disciplines. Those other people were not all my direct reports.
> When we disagreed, I tried to turn preferences into constraints: delivery time, reliability, maintenance and who would support it.
> If the risk justified it, I preferred a small experiment or a measurement, then a written decision so the team could move.

**Türkçe:** Bu genel yöntem. “Bir keresinde” derlerse gerçek bir anlaşmazlık bağla. Taviz verdiğin şeyi de söyle.

---

<a id="q9"></a>

## 9. Tell me about a mistake.

**Needs one real mistake. Do not invent an outage.**

> I initially assumed [the assumption].
> The evidence showed [what contradicted it].
> I took responsibility for [your part], corrected [the specific thing], and added [a test, review or check] so it was less likely to come back.
> The lesson was [what you do differently now].

**Türkçe:** Sahte alçakgönüllülük yok. Küçük, gerçek bir mühendislik hatası yeter.

---

<a id="flow"></a>

# C. Full-stack flow

<a id="q10"></a>

## 10. Trace a request from a button click to the database and back.

> The UI validates for usability and shows a pending state.
> The server validates the input again, authenticates the caller and checks authorization for that resource.
> The application performs the operation with the consistency it actually needs.
> The API returns a clear result, and the client reconciles its state, including errors and retries.
> A successful network send is not proof that the business operation committed.

**Türkçe:** Timeout, commit’ten sonra da olabilir. O zaman işlem durumunu sor veya idempotency key ile tekrarla.

---

<a id="q11"></a>

## 11. How do you prevent a duplicate operation?

> Disabling the button helps the user. It does not make the operation correct.
> I would use a stable operation key and enforce uniqueness on the backend.
> Concurrent requests should resolve to the same operation, or to a controlled conflict.
> I would also decide how long a key stays valid, and reject the same key with a different payload.
> If the operation calls something outside the database, that call needs its own idempotency or a reconciliation step.

**Türkçe:** “Önce bak, sonra insert” yarışır. Tekillik kısıtı veya atomik işlem şart.

---

<a id="q12"></a>

## 12. How do you choose a monolith, microservices or serverless?

> I start with team size, domain boundaries, how we deploy, and whether we can operate what we split.
> A modular monolith is often simpler early on.
> Separate services make sense when independent scaling or ownership is worth the network and the operational cost.
> Serverless can fit intermittent, event-driven work, but I still look at limits, cold starts, state and vendor lock-in.
> I would not split services just because it sounds more senior.

**Türkçe:** “Daha senior durur” diye bölme.

---

<a id="q13"></a>

## 13. How would you design image upload and AI processing?

**Say “I would.” Do not claim NextMatchAI already has this design.**

> I would authorize the upload, limit size and content type, and use controlled storage access.
> The backend would create a job with an operation ID, instead of holding the mobile request open until the model finishes.
> A worker would call the AI service with a timeout and bounded retries.
> The client would watch job status and recover after a disconnect.
> Provider credentials stay on the server. I would also define how long we keep the file and how deletion works.

**Türkçe:** Çift job → idempotency. Bozuk model çıktısı → şema kontrolü ve açık bir hata durumu. NextMatchAI sadece “bu problemi gördüm” bağlantısı.

---

<a id="q14"></a>

## 14. How do you secure a multi-tenant API?

> Authentication tells me who the caller is. Authorization tells me which action they may take on which resource.
> I would enforce the tenant on the server for every read and write.
> I would validate input, parameterize SQL, and avoid returning fields the caller should not see.
> I would test a valid user token aimed at another tenant’s object ID.

**Türkçe:** Butonu gizlemek yetkilendirme değildir.

---

<a id="q15"></a>

## 15. What does CORS do?

> CORS tells the browser which origins may read certain cross-origin responses.
> It is not authentication, and it does not stop a non-browser client from calling the API.
> A preflight checks whether a particular request is allowed.
> If the browser sends credentials, the server needs an explicit origin and credential handling. A wildcard is not a general fix.

**Türkçe:** CORS kimlik doğrulama değil. Postman’i durdurmaz.

---

<a id="q16"></a>

## 16. How do you handle timeouts, retries and errors?

> I separate validation and authorization failures from transient failures.
> I use timeouts, and I retry only when the operation is safe or protected by an idempotency key, with bounded backoff and jitter.
> The user should see a state they can act on, not an endless spinner.
> Logs should help diagnosis without leaking secrets.

**Türkçe:** Timeout, sunucunun hiçbir şey yapmadığı anlamına gelmez. İptal, otomatik rollback değildir.

---

<a id="js"></a>

# D. JavaScript, TypeScript and Node

<a id="q17"></a>

## 17. Promise, async/await, sequential versus concurrent?

> An async function returns a Promise.
> Await pauses that function until the value settles. It does not block the JavaScript runtime.
> If the steps depend on each other, I await them in order.
> If they are independent, I can start them together, but I cap concurrency when they could overwhelm a database or an API.

**Türkçe:** Async, otomatik olarak paralel CPU demek değil.

---

<a id="q18"></a>

## 18. Promise.all versus Promise.allSettled?

> Promise.all returns the fulfilled values in input order, and it rejects if any input rejects. It does not cancel the others.
> Promise.allSettled waits for every outcome, so I can look at failures one by one.
> I use all when I need every part. I use allSettled when a partial result is still useful.

**Türkçe:** `array.map(async ...)` promise dizisi döner. `forEach` await etmez.

---

<a id="q19"></a>

## 19. What blocks the Node event loop?

> Long synchronous JavaScript can stop other callbacks even if the function is marked async.
> I look for CPU-heavy loops, large JSON work and synchronous APIs, then I measure event-loop delay and request latency.
> Depending on the task, I split the work, use worker threads, or move it to a job worker.

**Türkçe:** CPU işinin önüne await koymak onu başka thread’e taşımaz.

---

<a id="q20"></a>

## 20. Microtasks and timers?

> After the current synchronous work, promise continuations run as microtasks, before later work such as an eligible timer.
> If I keep scheduling microtasks, other work waits.
> Node also has `process.nextTick` and event-loop phases, so a browser diagram is not the whole Node model.
> `setTimeout(fn, 0)` means “eligible later,” not “now.”

**Türkçe:** A, D, sonra microtask C, sonra timer B. Bunu her Node zamanlamasına genelleme.

---

<a id="q21"></a>

## 21. Graceful shutdown and more than one instance?

**Design knowledge, unless you personally shipped it.**

> I would stop accepting new traffic, let in-flight requests finish within a deadline, stop taking new background jobs, and close resources in order.
> With more than one process, memory on one machine is not a global lock and not a durable session.
> Shared state and “do this job once” need real storage and a consistency rule.

---

<a id="q22"></a>

## 22. Why doesn't TypeScript validate API input?

> TypeScript checks the code you compile. It does not check arbitrary data at runtime.
> I treat external input as `unknown` and validate its shape before I use it.
> A discriminated union is useful for states like loading, success and failure, so invalid combinations are harder to represent.
> `any` skips the checks. A type assertion is not validation.

---

<a id="frontend"></a>

# E. React, Angular and Next.js

<a id="q23"></a>

## 23. State versus props, and duplicated state?

> Props are inputs from the parent. Local state is what this component owns across renders.
> If I can compute a value from the current props or state, I usually derive it instead of keeping a second copy in sync.
> For an editable draft, I decide when the draft starts and what happens when the parent data changes.
> Shared state belongs at the closest owner that actually needs it.

**Türkçe:** İki kaynak gerçeği yarışır.

---

<a id="q24"></a>

## 24. Why can React state look stale?

> Each render sees a snapshot. Calling the setter schedules another render. It does not change the value this handler already captured.
> When the next value depends on the previous one, I use the functional updater.
> An async callback also closed over some render’s values. I have to know which ones.

**Türkçe:** Snapshot, closure, functional update.

---

<a id="q25"></a>

## 25. How do you stop a stale fetch in useEffect?

> If the id changes quickly, the older response can arrive last and overwrite newer data.
> I cancel with an AbortController where that is supported, or I ignore a result that is no longer current.
> Dependencies have to be right. A data library can also dedupe and cache.
> Strict Mode can reveal a missing cleanup. Turning Strict Mode off does not fix the bug.
> Aborting the client request does not roll back a write the server already committed.

---

<a id="q26"></a>

## 26. How does Angular experience transfer to React or Next.js?

> The APIs differ. The problems transfer: who owns the state, component boundaries, async data, validation and tests.
> My production web experience is stronger in Angular. I use Next.js on NextMatchAI, which is my own product, not years of enterprise React ownership.
> If I explain a React choice, I use something I actually built, and I do not pretend the frameworks behave the same.

**Türkçe:** Bir NextMatchAI bileşenini ve verinin nereden gelip nereye gittiğini adlandırabilecek durumda ol.

---

<a id="q27"></a>

## 27. Server rendering versus client rendering, and hydration?

> Server rendering can send useful HTML early.
> Client rendering fits interactive UI, but it can mean more JavaScript and more fetching up front.
> Hydration attaches client behavior to that server HTML. If the first client output does not match, you get a mismatch.
> I would choose from the page’s content, personalization, caching and how interactive it is.
> Exact Next.js routing and cache behavior depends on the version and the project. I would not recite one version as universal.

---

<a id="q28"></a>

## 28. How would you investigate a slow UI?

> I would separate network delay from expensive rendering, too many updates, a large payload, or a long task on the main thread.
> I would reproduce it with realistic data, profile the interaction, and change one thing.
> Options include doing less work, virtualizing a long list, or changing how data loads.
> Memoization is a tool. It is not the diagnosis.

---

<a id="data"></a>

# F. Data and consistency

<a id="q29"></a>

## 29. SQL versus Firestore?

> I choose from relationships, queries, consistency and how we want to operate it.
> PostgreSQL fits relational constraints and joins.
> Firestore fits document-shaped app data and live listeners, but the queries and indexes shape the model.
> Neither choice removes concurrency, access control or cost.
> “NoSQL has no transactions” is false.

**Türkçe:** Production’da Firestore kullandın. PostgreSQL iç yapısı uzmanlık iddiası değil.

---

<a id="q30"></a>

## 30. Firestore transaction versus batch?

> A transaction is for a write that depends on values you just read, and it must stay consistent if someone else writes at the same time.
> The callback can run more than once, so I do not put an external side effect inside it.
> A batch groups writes so they all succeed or all fail, without a read-then-decide step.
> Offline behavior is not the same for both. I check the SDK instead of treating them as interchangeable.

---

<a id="q31"></a>

## 31. What does Postgres call a deduplicated B-tree tuple?

> A posting list tuple. It stores the shared key once, with a list of heap tuple identifiers, so duplicate index keys take less space.
> That is an index representation. It does not mean the table rows were deleted or merged.
> If I am not sure in the room: “I believe the term is a posting list tuple. My stronger experience is application-level database behavior.”

**Türkçe:** Anahtar tek, işaret ettiği satır konumları liste. Bu, tabloya DELETE atmak değil. Flashcard. Bütün günü buna verme.

---

<a id="q32"></a>

## 32. How would you investigate a slow SQL query?

> I would look at the query, realistic parameters, row counts and the plan.
> `EXPLAIN ANALYZE` runs the statement, so I am careful when the statement writes.
> I compare estimated rows with actual rows, look for scans or joins that do not belong, and check whether an index matches the filter and the order.
> Then I measure the change. An index is not automatically faster.

---

<a id="q33"></a>

## 33. Transactions, isolation and lost updates?

> A transaction groups work. The isolation level decides which concurrent changes you can see.
> PostgreSQL’s default is Read Committed, so two statements in one transaction can see different committed data.
> For a real invariant I would use an atomic update, a constraint, explicit locking, or a stronger isolation level, and I would handle retries.
> “It is inside a transaction” does not mean a read-modify-write is race-free.

---

<a id="q34"></a>

## 34. How do you make a worker idempotent at the database?

> I would store a unique event or operation key, and I would claim that key and apply the database change in the same transaction.
> A second delivery would not apply the business change again.
> If the worker also calls an external service, the database transaction is not enough. I need the provider’s idempotency, or an outbox and reconciliation.
> A crash before commit rolls back. A crash after commit but before the ack can deliver a duplicate, and that duplicate should be harmless.

---

<a id="q35"></a>

## 35. B-tree versus GIN, and jsonb?

**Conceptual. Do not claim you operate advanced PostgreSQL in production.**

> B-tree is the usual choice for ordered lookups on scalar values.
> GIN can index inside composite values such as jsonb, depending on the operators.
> I would use normal columns for fields that are stable and constrained, and jsonb where the shape really needs to flex.
> I would not put everything in JSON just to avoid modeling it.

---

<a id="q36"></a>

## 36. Queues and duplicate deliveries?

> I assume a message can arrive more than once.
> The consumer needs idempotent effects, bounded retries, and a place to look at failures that will not succeed.
> For a batch, I would not redo the items that already succeeded if the platform can report a partial failure.
> In an SQS and Lambda style design, the visibility timeout has to fit how long the work takes.
> I would not say the whole system is exactly-once because a queue has a deduplication feature.

**Türkçe:** AWS’i production uzmanlığı gibi anlatma. Desen olarak anlat.

---

<a id="ai"></a>

# G. AI-assisted development

<a id="q37"></a>

## 37. How do you use coding agents?

> I use them to explore unfamiliar code, compare options, draft a change and propose tests.
> I give a bounded task, the relevant context, and acceptance criteria.
> Then I read the diff, check the behavior and run the checks that matter.
> I am still responsible, especially when the change touches async flows, security or business rules.
> I reject broad unrelated edits, invented APIs, weakened tests and assumptions nobody verified.

---

<a id="q38"></a>

## 38. Describe something an AI could not solve without you.

**Needs one real task. Use the ordering bug only if you actually used an agent on it.**

> On [the real task], the model could suggest plausible code, but it did not have [the context or the failing sequence].
> I gave it [the evidence], narrowed the scope, and defined [the invariant or the test].
> That let me judge the change, instead of accepting something that only looked correct.

**Türkçe:** Modelin tam olarak neyi yanlış önerdiğini bir cümleyle hazırla.

---

<a id="q39"></a>

## 39. How would you compare two AI-generated solutions?

> I would give both the same requirements and the same tests.
> I would compare correctness, edge cases, security, complexity and how hard it is to maintain, and I would separate a real requirement from a style preference.
> I would run the code when I can, and I would keep one small counterexample for a failure.
> “It looks cleaner” is not the reason.

**Türkçe:** İkisi de görünen testleri geçiyorsa sınır ve kötü niyetli girdilere bak. Gizli varsayımı sor.

---

<a id="q40"></a>

## 40. What makes a good coding task or verifier?

> The task needs a clear spec, realistic constraints, and a way to judge behavior that is not a vibe.
> The checker should accept more than one correct implementation. It should not demand one coding style.
> Tests should cover edges without printing the solution.
> If the spec is ambiguous, I would settle that before I treat the score as a quality signal.
> Example: say whether deduplication keeps the first or the last item before you grade it.

---

<a id="q41"></a>

## 41. What is prompt injection in a product feature?

> Untrusted text can contain instructions that try to override the task or trigger an action.
> I would treat retrieved text and uploads as data, limit what tools the model can call, and check the action in the application.
> The model saying “this is allowed” is not authorization.
> If the action matters, the application enforces the rule.

---

<a id="flutter"></a>

# H. Flutter refresher

These came up in the mobile interview. They can come back as follow-ups.

<a id="q42"></a>

## 42. Future versus Stream?

> A Future is one completion: a value or an error.
> A Stream can emit many values or errors over time, and it can finish.
> I use a Future for one API call and a Stream for live updates.
> With a stream I also cancel the subscription so it does not outlive the owner.
> Single-subscription means one listener. Broadcast can have many. Broadcast is not automatically a replay of old events.

---

<a id="q43"></a>

## 43. StatelessWidget versus StatefulWidget?

> Both widget configurations are immutable.
> A StatelessWidget builds from its inputs and inherited context. It can still rebuild.
> A StatefulWidget has a separate State object that can survive a new widget configuration.
> I keep local state for something like an animation or a small interaction, and I keep broader state outside the widget.
> “Stateless widgets never rebuild” is wrong. “The StatefulWidget object itself is the mutable state” is also wrong.

---

<a id="q44"></a>

## 44. setState after dispose?

> An async call can finish after the screen is gone.
> I dispose subscriptions and controllers, and I check `mounted` before a UI update when that applies.
> `mounted` stops an invalid `setState`. It does not cancel the backend work, and it does not undo a write.
> I also avoid starting a new Future inside `build`, because a rebuild would start it again.

---

<a id="q45"></a>

## 45. Async versus isolates?

> Async is for waiting without blocking the rest of the event loop.
> CPU-heavy work can still stall the UI isolate.
> An isolate has its own memory and its own event loop, and it talks by messages.
> I move work only after I measure the cost, including the cost of copying the message.
> A Future is not a background thread.

---

<a id="q46"></a>

## 46. How do you test an async race?

> I control the order with fakes or completers. I do not sleep and hope.
> I test the normal order, the reversed order, duplicates, errors, and disposal while the call is in flight.
> The assertion is the invariant the user sees, for example an older response must not overwrite a newer one.
> One regression test for the bug you saw, plus a few neighboring cases. Not a novel of sleeps.

---

<a id="coding"></a>

# I. Coding practice

Original exercises. Not claimed micro1 questions.

<a id="exa"></a>

## Exercise A — output order

```js
console.log("A");
setTimeout(() => console.log("B"), 0);
Promise.resolve().then(() => console.log("C"));
console.log("D");
```

> A, then D, then C, then B.
> A and D are synchronous. C is a microtask. B is a timer, so it waits until after the microtasks.
> I would not turn this tiny script into a full description of Node’s event loop.

---

<a id="exb"></a>

## Exercise B — keep the first record for each id

```ts
function uniqueById<T extends { id: string }>(items: readonly T[]): T[] {
  const seen = new Set<string>();
  return items.filter(item => {
    if (seen.has(item.id)) return false;
    seen.add(item.id);
    return true;
  });
}
```

> Expected time is linear in the input. Extra space is linear in the number of distinct ids.
> Tests: empty, all unique, all the same id, duplicates mixed through the list.
> If the data came from outside, validate it before this function. The type does not check runtime JSON.
> Say whether you keep the first or the last. This one keeps the first and keeps order.

---

<a id="exc"></a>

## Exercise C — the latest search result wins

> Request A starts, then B starts, then A resolves after B.
> Debounce can reduce how many requests you send. It does not fix a response that arrives out of order.
> I would mark which request is current, cancel the old one if the platform allows it, and refuse to write a stale result into state.
> Loading and error belong to the active request, not to a request I already abandoned.
> Test both completion orders, and a late error from the request you no longer care about.

---

<a id="exd"></a>

## Exercise D — decrement stock without a lost update

```sql
UPDATE inventory
SET stock = stock - 1
WHERE product_id = $1 AND stock > 0
RETURNING stock;
```

> No returned row means nothing was decremented. Missing product and zero stock may need different handling in the domain.
> If this is part of placing an order, both writes belong in one transaction, and a repeated request needs an idempotency key.
> Read the stock in the app, subtract one, and write it back is the race.

---

<a id="exe"></a>

## Exercise E — map with a concurrency limit

> `mapLimit(items, limit, fn)` runs at most `limit` calls at once and returns results in input order.
> Before coding, decide what happens on the first error, what an empty list returns, and that `limit` must be a positive integer.
> Rejecting the wrapper does not cancel work that already started.
> Tests: the peak number in flight, completions out of order, an error, and a limit larger than the list.
> Write a simple correct version. Do not memorize a clever one you have not run.

---

<a id="exf"></a>

## Exercise F — which structure?

> Map for key to value. Set for membership. Array when order is the data. A queue when you take from the front in order. A heap when you repeatedly need the current min or max, such as top-k.
> Practice: count frequencies, first non-repeating item, merge intervals, walk a tree, top-k.
> State the assumption, do a tiny example, write the simple version, test the edges, then say the complexity.
> Dynamic programming is extra unless the actual task asks for it.

---

<a id="mock"></a>

# J. Thirty-minute rehearsal

This is a practice clock, not micro1’s official timing.

- 0–3 min: yourself, then why this role.
- 3–9 min: one real end-to-end feature. Validation, authorization, state, errors.
- 9–15 min: the ordering bug or the latency diagnosis. “What evidence killed your first hypothesis?”
- 15–20 min: Promise.all, and a stale response.
- 20–24 min: lost update, idempotent worker, posting-list flashcard.
- 24–28 min: how you use an agent, one thing it got wrong, how you compare two solutions.
- 28–30 min: an unknown topic, then stop.

**Depth:** one sentence, then the mechanism, then one failure mode, then stop.  
**Story shape:** context, what you owned, evidence, what you changed, how you checked, the lesson.

---

<a id="phrases"></a>

# K. Phrases

- “My strongest production experience here is with Flutter, and at Rent Ready also Angular, Node and Firestore.”
- “Let me separate what the user saw from the state that was actually stored.”
- “I would first check whether the operation failed, or only the response was lost.”
- “I haven't used that particular service in production. The pattern I would apply is…”
- “Do you mean the client-side state, or the persisted state?”
- “I don't remember that internal term precisely, but I can explain the behavior.”

---

<a id="route"></a>

# L. If you only have 45 minutes

- 10 min: introduction and one real end-to-end story. Delete anything you cannot defend.
- 10 min: the ordering bug. Event order and the actual fix, or mark it as unconfirmed.
- 10 min: Future versus Stream, stateless versus stateful, Promise.all, stale response.
- 10 min: one AI example, how you judge two solutions, posting-list flashcard.
- 5 min: say them out loud. Check the role on the platform, desktop, audio and camera.

If you have 90 minutes, add React and Node, then SQL and duplicate requests, then exercises A, C and D.

Do not open the real interview to practice.

---

<a id="sources"></a>

# M. Sources

Practice material, not a transcript and not a guaranteed question list. Official topic pages: [micro1 interview guide](https://www.micro1.ai/ai-interview-guide), [question themes](https://www.micro1.ai/interview-questions), [free practice](https://www.micro1.ai/interview-prep).

Checked for the technical wording, not as things you personally operated: [PostgreSQL B-tree](https://www.postgresql.org/docs/current/btree.html), [EXPLAIN](https://www.postgresql.org/docs/current/using-explain.html), [isolation](https://www.postgresql.org/docs/current/transaction-iso.html), [Node event loop](https://nodejs.org/en/learn/asynchronous-work/event-loop-timers-and-nexttick), [Promise.all](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Promise/all), [React state snapshot](https://react.dev/learn/state-as-a-snapshot), [effects](https://react.dev/learn/synchronizing-with-effects), [TypeScript narrowing](https://www.typescriptlang.org/docs/handbook/2/narrowing.html), [CORS](https://developer.mozilla.org/en-US/docs/Web/HTTP/Guides/CORS), [Firestore transactions](https://firebase.google.com/docs/firestore/manage-data/transactions), [Dart streams](https://dart.dev/libraries/async/using-streams), [StatefulWidget](https://api.flutter.dev/flutter/widgets/StatefulWidget-class.html).
