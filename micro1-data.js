window.MICRO1 = {
  meta: {
    candidate: "Hazim Cakil",
    location: "Ankara, Türkiye",
    role: "micro1 Senior Mobile Software Engineer AI interview",
    duration: "~24 minutes total (confirmed)",
    format: "Spoken or typed, recorded, desktop required",
    confirmedTopics: [
      "Mobile Development Experience",
      "Proficiency in a Core Mobile Development Language",
      "Testing and Debugging a Complex Mobile Application",
      "Custom Questions Defined for the Job"
    ]
  },
  phrases: [
    "The first thing I'd check is...",
    "I'd try to reproduce it under controlled conditions.",
    "I wouldn't assume a timeout means the operation failed.",
    "I'd verify the backend state before retrying.",
    "I haven't used that extensively in production, but my understanding is...",
    "I'd write a regression test for that scenario.",
    "The trade-off here is...",
    "I would treat that as a hypothesis until I have evidence."
  ],
  recovery: [
    "Let me take a second to structure this.",
    "Can I restate the question to make sure I'm answering the part you care about?",
    "I don't have that exact production case, but this is how I would approach it.",
    "I would not overclaim that. My production experience here is [honest boundary].",
    "If I didn't know the API offhand, I would reason from first principles and then verify."
  ],
  pitfalls: [
    "Retrying a timed-out POST without knowing if the server processed it.",
    "Treating a later async response as current without a generation ID or cancellation.",
    "Leaving a StreamSubscription alive after dispose.",
    "Using BuildContext after an await without checking mounted.",
    "Claiming BLoC as primary production state management when GetX was the production stack."
  ],
  vocab: [
    { term: "Reference implementation", def: "A known-good solution used to define expected observable behavior, not the only allowed code shape." },
    { term: "Deterministic validator", def: "A checker that always produces the same pass/fail result for the same inputs and observable outputs." },
    { term: "Behavior assertion", def: "A test that checks outcomes, not internal class names or method call order." },
    { term: "Fake vs mock", def: "A fake is a working simplified implementation; a mock is usually a scripted interaction double." },
    { term: "Idempotency key", def: "A stable client-generated identity so repeating an operation does not create a second logical side effect." },
    { term: "Single-flight", def: "Coalescing concurrent identical in-flight work onto one Future." }
  ],
  prepSteps: [
    { id: "intro", title: "Mobile experience and English introduction", minutes: 10 },
    { id: "dart", title: "Dart and Flutter fundamentals", minutes: 20 },
    { id: "debug", title: "Debugging and testing", minutes: 20 },
    { id: "api", title: "API, concurrency and offline reliability", minutes: 15 },
    { id: "ai", title: "AI training and code-verification tasks", minutes: 10 },
    { id: "spoken", title: "Final spoken practice", minutes: 10 }
  ],
  stories: [
    {
      id: "story-debug-1",
      title: "Production debugging story 1 — intermittent connectivity / uploads",
      prompt: "Use a real Rent Ready workflow if you can confirm the details. Do not invent a specific bug.",
      fields: ["symptom", "app", "repro", "tools", "cause", "change", "tests", "validation", "outcome"]
    },
    {
      id: "story-debug-2",
      title: "Production debugging story 2 — list loading / pagination decision",
      prompt: "The honest version can be: telemetry first, then deciding not to add pagination. Fill only what you can defend.",
      fields: ["symptom", "app", "repro", "tools", "cause", "change", "tests", "validation", "outcome"]
    }
  ],
  labs: [
    {
      id: "payment-lab",
      title: "Flutter Payment Reliability Lab",
      mark: "Personal demonstration project — not a Rent Ready production payment system.",
      points: [
        "Reducer-based state transitions",
        "Intent-key deduplication and single-flight",
        "Server-as-source-of-truth recovery and restart scenarios",
        "About 1,238 Dart LOC, 515 test LOC, 18 tests"
      ]
    },
    {
      id: "field-sync",
      title: "Field Sync Reliability Lab",
      mark: "Personal demonstration project — not production customer impact.",
      points: [
        "Flutter + Drift/SQLite",
        "Offline outbox, retries, next-eligible scheduling",
        "Lost-session recovery"
      ]
    }
  ],
  questions: []
};

(function seedQuestions(M) {
  const Q = [];
  function add(q) { Q.push(q); }

  add({
    id: "q1", num: 1, category: "experience",
    categoryLabel: "Mobile Development Experience",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "75–90s", status: "draft",
    question: "Tell me about yourself.",
    testsTr: "Kim olduğunu, mevcut işini ve neden mobile/reliability'ye kaydığını 90 saniyede net söyleyebiliyor musun?",
    sample: "I'm a mobile-focused software engineer with over nine years of experience, including more than six and a half years building production applications with Flutter and Dart.\n\nSince late 2022, I've been working at Rent Ready on mobile applications and related web workflows.\n\nMy work involves Flutter development, API integrations, testing, performance improvements, and production reliability. Over time, I've become especially interested in understanding difficult production issues, tracing problems across the mobile app and backend, and making fixes that are safe to release.\n\nI also have experience with TypeScript, Node.js, Firebase, and CI/CD pipelines, which helps me understand how different parts of the system interact.\n\nEarlier in my career, I worked with native Android and iOS development and led a small mobile team.\n\nToday, my strongest area is Flutter and Dart, particularly debugging, integration, and building reliable application workflows.",
    anchors: ["9+ years", "6.5+ Flutter/Dart", "Rent Ready since Dec 2022", "reliability over isolated UI", "honest native/lead boundary"],
    mistakes: ["Memorizing this as a script", "Making it about Supono or Proxify", "Overclaiming BLoC or backend ownership"],
    followUp: "What changed in your work after you joined Rent Ready?"
  });

  add({
    id: "q2", num: 2, category: "experience",
    categoryLabel: "Mobile Development Experience",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "60–75s", status: "verified",
    question: "Tell me about your mobile development experience.",
    testsTr: "Flutter'ın ana stack olduğunu, native geçmişi abartmadan, production kapsamını anlatabiliyor musun?",
    sample: "My current specialization is Flutter and Dart in production. For more than six and a half years that's been the main way I ship mobile software.\n\nAt Rent Ready I work on production mobile applications and related Flutter web workflows: feature work, API integration, testing, performance and production issues. I also touch TypeScript, Node and Firebase when the problem crosses that boundary.\n\nEarlier I did native Android with Java and some iOS/Swift, and I led a small three-person mobile team. I wouldn't present myself as a current native-platform specialist. Flutter is where my depth is.",
    anchors: ["Flutter is the depth", "Rent Ready production apps", "cross-boundary when needed", "native is earlier, not current claim"],
    mistakes: ["Listing every framework", "Saying I only do UI", "Claiming current Swift/Kotlin seniority"],
    followUp: "Which part of that experience is most relevant to debugging someone else's mobile code?"
  });

  add({
    id: "q3", num: 3, category: "experience",
    categoryLabel: "Mobile Development Experience",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45–60s", status: "verified",
    question: "What mobile applications have you worked on?",
    testsTr: "Somut ürün isimleri verebiliyor musun, abartmadan?",
    sample: "At Rent Ready the applications include the Rent Ready mobile apps, Pro App, QC App and related web portals. The work is operational: field and office workflows rather than a consumer social app.\n\nOutside work I also have personal demonstration projects: a payment reliability lab, a field-sync reliability lab, and NextMatchAI, which is a Flutter app with a Next.js web piece. Those labs are not customer-facing production systems.",
    anchors: ["Rent Ready / Pro App / QC App", "portals", "labs are personal demos", "NextMatchAI"],
    mistakes: ["Inventing user counts", "Calling demo labs production payment systems"],
    followUp: "Which of those taught you the most about production failures?"
  });

  add({
    id: "q4", num: 4, category: "experience",
    categoryLabel: "Mobile Development Experience",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "60s", status: "verified",
    question: "What are your responsibilities at Rent Ready?",
    testsTr: "Ticket implementer mı, production owner mı? Sınırı dürüst çiz.",
    sample: "I implement and maintain Flutter features in production apps, integrate with APIs, and follow problems into testing, performance and reliability when the workflow depends on it.\n\nThat includes coordinating with backend contracts, using Firebase or Firestore where the product uses them, and helping make changes safe to release through CI and tests.\n\nI don't claim I own the entire backend or that every reliability outcome was mine alone. I do own following a mobile problem until the user-facing workflow is actually correct.",
    anchors: ["Flutter features", "API + reliability", "CI/tests", "honest ownership boundary"],
    mistakes: ["I own the whole platform", "I only do screens"],
    followUp: "How do you decide when a bug is yours versus backend's?"
  });

  add({
    id: "q5", num: 5, category: "experience",
    categoryLabel: "Mobile Development Experience",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "75–90s", status: "needs-confirmation",
    question: "Describe your most technically challenging project.",
    testsTr: "Zorluk UI değil, source of truth / consistency / rollout ise senior sinyal.",
    sample: "A strong candidate story is modernizing a core operational workflow for mobile while keeping the existing system of record.\n\nThe Flutter client had to respect a split: reads could involve Firebase/Firestore while writes still went through an API path, with Dataverse remaining authoritative. That creates eventual-consistency questions. If an API response is newer, an older listener update must not overwrite it.\n\nI would not claim I rewrote the backend. I owned client behavior, integration and rollout caution, including feature flags.\n\nThe workflow later ran for roughly eighteen months without a production incident. That is a team/product reliability outcome, not a personal trophy.\n\n[NEEDS REAL DETAILS] Name the exact workflow only if you can defend it.",
    anchors: ["split read/write paths", "authoritative system of record", "stale listener guard", "18 months is team outcome"],
    mistakes: ["I owned Dataverse", "I personally caused 18 incident-free months"],
    followUp: "How did you compare versions or timestamps?"
  });

  add({
    id: "q6", num: 6, category: "experience",
    categoryLabel: "Mobile Development Experience",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45–60s", status: "verified",
    question: "Describe your team leadership experience.",
    testsTr: "Küçük team lead'i abartmadan anlat: 3 kişi, Labor Bilişim.",
    sample: "At Labor Bilişim I led a small mobile team of three developers. That meant coordinating delivery, reviewing work and helping people unblock, not managing a large organization.\n\nAt Rent Ready my role is individual contributor. I still communicate tradeoffs and keep work visible, but I don't present myself as a current people-manager.",
    anchors: ["Labor Bilişim", "three developers", "IC now", "don't inflate"],
    mistakes: ["Staff engineer / org leadership claims"],
    followUp: "How did you handle a disagreement on that team?"
  });

  add({
    id: "q7", num: 7, category: "experience",
    categoryLabel: "Mobile Development Experience",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "Why Flutter?",
    testsTr: "Framework fanboy değil, production gerekçesi.",
    sample: "I use Flutter because it lets me ship one codebase across mobile and, in our case, related web workflows, while still going to the platform when needed.\n\nThe reason I stayed with it is production: we can test, release and iterate on real operational apps. I don't think Flutter removes native concerns. It just lets me put most product logic in Dart and isolate platform bridges.",
    anchors: ["one product codebase", "production iteration", "platform still exists"],
    mistakes: ["Flutter is always faster than native", "I never write platform code"],
    followUp: "When would you not choose Flutter?"
  });

  add({
    id: "q8", num: 8, category: "experience",
    categoryLabel: "Mobile Development Experience",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45–60s", status: "verified",
    question: "What is your experience with native Android and iOS?",
    testsTr: "Dürüst sınır: geçmiş var, current specialist değil.",
    sample: "I have earlier commercial native Android with Java and some iOS/Swift. I have not been a dedicated native iOS engineer in recent years, so I don't claim current Swift depth.\n\nIn Flutter work, when I need a platform API I isolate it behind a Dart-facing interface. MethodChannel for request/response, EventChannel for a stream, FFI only if I'm talking to a C-compatible library.\n\nIf a bug is Android-only, I separate Dart behavior from plugin/OS behavior before changing code.",
    anchors: ["earlier native", "not current Swift specialist", "MethodChannel vs EventChannel"],
    mistakes: ["I am a senior native Android/iOS engineer today"],
    followUp: "How would you debug a crash that only happens on Android 14?"
  });

  add({
    id: "q9", num: 9, category: "experience",
    categoryLabel: "Mobile Development Experience",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "45–60s", status: "verified",
    question: "How do you balance delivery speed and code quality?",
    testsTr: "Hangisinin pahalı başarısızlık olduğunu seçebiliyor musun?",
    sample: "I don't treat speed and quality as two switches. I ask which quality attributes this release actually needs.\n\nOn a deadline I protect the critical path: data correctness, recovery, tests around risky behavior, CI, and enough observability to know if the release is healthy. I defer speculative abstractions and low-value polish.\n\nThat is a smaller reliable slice, not a larger fragile one.",
    anchors: ["protect expensive failures", "defer speculation", "observable release"],
    mistakes: ["We never ship without perfect architecture", "Just move fast"],
    followUp: "What would you cut from a feature due tomorrow?"
  });

  add({
    id: "q10", num: 10, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "Explain Dart null safety, nullable types and late.",
    testsTr: "null-safety'yi slogan değil, runtime hatasını önleyen sözleşme olarak anlat.",
    sample: "Dart's null safety is a type-system contract: a non-nullable String cannot hold null, so a whole class of crashes is pushed to compile time.\n\nString? is explicitly optional. I unwrap with ?, ??, or a local promotion after an is-check — not with bangs everywhere.\n\nlate means I promise to assign before first read. It is useful for fields initialized in initState, but a late that never gets assigned becomes a runtime crash. I don't use late to hide missing initialization.",
    anchors: ["non-nullable by default", "avoid !", "late is a promise"],
    mistakes: ["late equals nullable", "using ! to silence the analyzer"],
    followUp: "When is late the wrong tool?",
    code: "String title = 'Inbox';\nString? subtitle;\nlate final AnimationController controller;\n\nvoid initState() {\n  super.initState();\n  controller = AnimationController(vsync: this);\n}\n\nString label() => subtitle ?? 'Untitled';"
  });

  add({
    id: "q11", num: 11, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "60s", status: "verified",
    question: "What does await actually do, and how do exceptions propagate?",
    testsTr: "Thread yaratmadığını, continuation ve microtask sırasını biliyor musun?",
    sample: "await does not start a new thread. The async function suspends, the current call stack unwinds, and the code after await becomes a continuation that resumes later. Pending microtasks run before the next event-queue item.\n\nIf the awaited Future completes with an error and I don't catch it at that await, the error propagates to the caller of the async function as a failed Future. An unawaited Future can become an unhandled error.\n\nI would not claim await Future.value() is a reliable way to let the UI render. A microtask continuation can still run before the next frame.",
    anchors: ["no new thread", "continuation", "errors follow the Future", "microtasks before events"],
    mistakes: ["await means background isolate", "await always yields to the next frame"],
    followUp: "Where would you use unawaited, and what is the risk?",
    code: "Future<void> load() async {\n  try {\n    final data = await api.fetch();\n    emit(Loaded(data));\n  } catch (e) {\n    emit(Failed(e));\n  }\n}"
  });

  add({
    id: "q12", num: 12, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "When do you use a Future versus a Stream?",
    testsTr: "Tek sonuç vs zaman içinde olay.",
    sample: "A Future is one result or one error: a REST call, one file read, one token refresh.\n\nA Stream is multiple events over time: snapshots(), location, a WebSocket, text-change pipelines.\n\nIf I listen to a Stream in a State object, I store the subscription and cancel it in dispose. Broadcast streams allow multiple listeners, but events emitted while nobody is listening are generally not buffered for a future listener.",
    anchors: ["one shot vs ongoing", "cancel in dispose", "broadcast is not a buffer"],
    mistakes: ["using Stream for a single HTTP call without a reason"],
    followUp: "How do you convert a Stream of snapshots into UI state without leaking?"
  });

  add({
    id: "q13", num: 13, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "How do you transform collections without surprising mutation?",
    testsTr: "map/where vs in-place mutate; equality/identity.",
    sample: "I prefer creating a new list with map, where and toList when the state should be immutable from the UI's point of view. Mutating a list that is already in state can skip rebuilds if identity doesn't change.\n\nIf I need to update one item, I copy: items = [for (final item in items) item.id == id ? item.copyWith(...) : item].\n\nThat is cheaper to reason about than secretly editing a list that several widgets hold.",
    anchors: ["copy on write", "identity vs equality", "don't mutate emitted state"],
    mistakes: ["items.add inside a Cubit without emitting a new list"],
    followUp: "Why might the UI not rebuild after you mutated a list in place?",
    codeWrong: "state.items.add(newItem); // same list identity\nemit(state);",
    code: "emit(state.copyWith(items: [...state.items, newItem]));"
  });

  add({
    id: "q14", num: 14, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "60s", status: "verified",
    question: "Explain Widget, Element and RenderObject, and why State can survive.",
    testsTr: "Widget'ın immutable config olduğunu söyleyebilmek.",
    sample: "A Widget is an immutable configuration. An Element is the long-lived instantiation in the tree. A RenderObject handles layout, paint and hit testing.\n\nWhen Flutter rebuilds, it can reuse Elements if the runtimeType and key match. That is how a State object survives parent rebuilds. If the key or type changes, Flutter drops that State and creates a new one.\n\nThat's why putting a list item without a key, then reordering, can attach the wrong State to the wrong data.",
    anchors: ["widget = config", "element = identity", "keys preserve state"],
    mistakes: ["setState recreates the State object"],
    followUp: "When do you actually need a GlobalKey?"
  });

  add({
    id: "q15", num: 15, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "60s", status: "verified",
    question: "Walk through initState, didUpdateWidget and dispose.",
    testsTr: "Subscription ve controller yaşam döngüsü.",
    sample: "initState runs once when this State is inserted. I create controllers, start a subscription, read widget.id. I do not use InheritedWidgets there; that belongs in didChangeDependencies.\n\ndidUpdateWidget runs when the parent rebuilds with a new widget of the same type. If widget.userId changed, I cancel the old listen and start the new one.\n\ndispose is the last chance to cancel subscriptions, dispose controllers and stop animations. Missing dispose is how listeners and tickers leak.",
    anchors: ["init once", "didUpdateWidget on config change", "dispose always"],
    mistakes: ["starting a new listen in build()", "using context.watch in initState"],
    followUp: "What goes in didChangeDependencies instead of initState?"
  });

  add({
    id: "q16", num: 16, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "How do setState, rebuilds and keys interact?",
    testsTr: "Rebuild maliyeti ve yanlış State eşleşmesi.",
    sample: "setState marks this Element dirty so build runs again. It doesn't mean the whole app rebuilds, but I still keep build cheap: no network, no heavy decoding.\n\nKeys tell Flutter which Element to reuse. ValueKey(item.id) on list children is the usual fix when items move. A key on a huge subtree can also be used to reset State when the identity of the screen changes.\n\nIf the UI is janky, I profile before sprinkling const or keys everywhere.",
    anchors: ["setState is local dirty", "keys match identity", "profile first"],
    mistakes: ["setState in a tight loop", "UniqueKey on every rebuild"],
    followUp: "Why is UniqueKey in build() usually a bug?"
  });

  add({
    id: "q17", num: 17, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "45s", status: "verified",
    question: "How do you use BuildContext safely after an async gap?",
    testsTr: "mounted / context.mounted. Unmounted element.",
    sample: "After await, the State may already be disposed. The associated Element can be unmounted. I check mounted, or context.mounted, before using context to navigate, show a SnackBar or call setState.\n\nI also capture the data I need before the await when I can, so the continuation doesn't depend on a widget that no longer exists.",
    anchors: ["async gap", "mounted", "don't navigate blindly"],
    mistakes: ["using context after await with no check"],
    followUp: "Is checking mounted enough if you also have a Cubit listener?",
    codeWrong: "await api.save();\nNavigator.of(context).pop();",
    code: "await api.save();\nif (!mounted) return;\nNavigator.of(context).pop();"
  });

  add({
    id: "q18", num: 18, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "60s", status: "verified",
    question: "What is your state-management experience? GetX versus BLoC or Cubit?",
    testsTr: "GetX production, BLoC'u abartma.",
    sample: "My production experience has used GetX more heavily than BLoC, so I don't want to overstate BLoC as my main production background.\n\nWhat I care about is explicit state ownership, predictable transitions, keeping side effects out of build, and making important behavior testable.\n\nCubit is often enough when transitions are method-driven. BLoC adds events, which helps when there are multiple event sources or you need an explicit concurrency policy like restartable search.\n\nIn an existing codebase I would follow the team convention rather than force a package.",
    anchors: ["GetX in production", "don't fake BLoC seniority", "events vs methods"],
    mistakes: ["I am a BLoC expert because I read the docs"],
    followUp: "How would you migrate one GetX controller to a Cubit without boiling the ocean?"
  });

  add({
    id: "q19", num: 19, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "45s", status: "verified",
    question: "How do you avoid memory leaks and expensive work on the UI isolate?",
    testsTr: "dispose + compute/isolate sınırı.",
    sample: "Leaks I actually look for: StreamSubscriptions, ChangeNotifiers, animation controllers, and timers that outlive the State.\n\nFor CPU work — JSON of a huge payload, image processing, parsing — I would not do it in build or a tight UI callback. Dart is single-threaded per isolate, so a long loop blocks frames. compute() or a dedicated isolate is the tool, with a measurable reason, not a premature architecture.",
    anchors: ["cancel subscriptions", "UI isolate is for frames", "measure before isolate"],
    mistakes: ["parse a 20MB JSON in build()", "never disposing GetX workers"],
    followUp: "How would you prove a leak instead of guessing?"
  });

  add({
    id: "q20", num: 20, category: "dart",
    categoryLabel: "Dart and Flutter",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "45s", status: "verified",
    question: "A list scrolls at about 30 FPS. How do you investigate UI jank?",
    testsTr: "Profil et, varsayma.",
    sample: "I would reproduce with performance overlay or DevTools CPU/GPU charts and identify whether we are build-bound, layout-bound or paint-bound.\n\nTypical Flutter list issues: work in item builders, missing item extents, giant opacity/save layers, images decoding on scroll, and not using a builder constructor so children are all created at once.\n\nI fix the measured hotspot: ListView.builder, const where it is real, cache images, avoid shrinkWrap inside another scroll view unless I can defend the cost.",
    anchors: ["measure first", "builder lists", "shrinkWrap is not free"],
    mistakes: ["rewrite state management because the list is slow"],
    followUp: "When is shrinkWrap the wrong fix for unbounded height?"
  });

  const process = "Symptom → Reproduce → Hypothesis → Logs/measurement → Root cause → Fix → Regression test → Production validation.";

  add({
    id: "q21", num: 21, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "75s", status: "verified",
    question: "Users trigger the same API call twice. How do you prevent duplicate in-flight requests?",
    testsTr: "Single-flight / request coalescing.",
    sample: "The first thing I'd check is whether both calls are actually in flight, or whether the UI is just double-submitting.\n\nI keep one in-flight Future for that key. The second caller awaits the same Future instead of starting another HTTP call. After completion I clear the slot so a later legitimate refresh can run.\n\nThat is different from debounce: debounce delays starting; coalescing shares work that already started.",
    anchors: ["shared Future", "key by request identity", "clear on complete"],
    mistakes: ["disable the button and call that done", "debounce as the only tool"],
    followUp: "How does this interact with pull-to-refresh?",
    process: process,
    code: "final Map<String, Future<Job>> _inFlight = {};\n\nFuture<Job> load(String id) {\n  return _inFlight.putIfAbsent(id, () async {\n    try {\n      return await api.fetchJob(id);\n    } finally {\n      _inFlight.remove(id);\n    }\n  });\n}"
  });

  add({
    id: "q22", num: 22, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "75s", status: "verified",
    question: "Older search results overwrite the newer query. How do you fix the race?",
    testsTr: "Generation ID; debounce yetmez.",
    sample: "Debounce reduces how often I start a request. It does not help once two requests are already in flight.\n\nI would give each search a monotonically increasing request ID. When a response returns, it may update state only if that ID is still current. Cancellation is good when the client supports it, but I still keep the stale-response guard because cancellation is not always guaranteed.\n\nI would test this with Completers: start dart, start flutter, complete flutter first, then complete dart, and assert the UI stayed on flutter.",
    anchors: ["generation ID", "debounce ≠ race fix", "deterministic test"],
    mistakes: ["only adding a 300ms debounce"],
    followUp: "How would you write that test without sleep()?",
    process: process,
    code: "int _requestId = 0;\n\nFuture<void> search(String query) async {\n  final mine = ++_requestId;\n  final results = await api.search(query);\n  if (mine != _requestId) return;\n  emit(SearchLoaded(results));\n}"
  });

  add({
    id: "q23", num: 23, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "60s", status: "verified",
    question: "The UI is stale after async work. How do you debug it?",
    testsTr: "setState/mounted vs skipped emit vs cache.",
    sample: "I separate 'state never updated' from 'state updated but UI didn't rebuild' from 'a later stale event overwrote a newer one'.\n\nChecks: did the Future complete, did we emit, was the widget still mounted, is Equatable/identity preventing rebuild, is a cache or listener publishing older data after a newer API response?\n\nIf two sources can race, I keep an explicit version or timestamp and ignore older evidence.",
    anchors: ["three stale classes", "mounted", "version/timestamp"],
    mistakes: ["just call setState harder"],
    followUp: "How would Firestore snapshots specifically create this?",
    process: process
  });

  add({
    id: "q24", num: 24, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "75s", status: "needs-confirmation",
    question: "How do you handle pagination without duplicate pages or races with pull-to-refresh?",
    testsTr: "page token, in-flight flag, refresh invalidates page cursor.",
    sample: "I keep a cursor or page index, an in-flight flag, and a generation for the list session. Next-page does nothing if a load is already running. Pull-to-refresh bumps the generation, resets the cursor, and ignores responses from the previous session.\n\nAt Rent Ready, a suggested fix for loading time was to add pagination. The honest version of that discussion is: we added telemetry first. The list already had a one-week window, and per-property counts were bounded, so we did not add paging just from an assumption.\n\n[NEEDS REAL DETAILS] Confirm which screen and what telemetry you can name.",
    anchors: ["cursor + in-flight", "refresh invalidates", "measure before paging"],
    mistakes: ["append page 2 after a refresh of page 1"],
    followUp: "What did the telemetry actually show?",
    process: process
  });

  add({
    id: "q25", num: 25, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "60s", status: "verified",
    question: "A non-idempotent POST timed out. Do you retry?",
    testsTr: "Timeout ≠ server failure.",
    sample: "I wouldn't assume a timeout means the operation failed. It means the client did not receive a result in time. The server may already have processed it.\n\nFor a mutation with side effects I want a stable idempotency key or I reconcile server state before repeating. Blind retry can create a second job, charge, or message.\n\nRetry belongs in a policy layer with classification, backoff, max attempts and observability — not copy-pasted in every Cubit.",
    anchors: ["timeout is unknown", "idempotency key", "reconcile before repeat"],
    mistakes: ["just retry POST three times"],
    followUp: "How would the payment lab model this?",
    process: process
  });

  add({
    id: "q26", num: 26, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "75–90s", status: "needs-confirmation",
    question: "How do you debug intermittent failures on a weak network?",
    testsTr: "Ölç, reproduce, source of truth, bounded retry.",
    sample: "I have worked on intermittent upload-style failures that did not reproduce on a normal office connection.\n\nThe first move is observability: which stage completed, what the client knows, what the server confirms. Then I reproduce under weak signal and interruption instead of guessing.\n\nThe design direction is preserve local work where it is safe, use bounded retries only when retry is safe, and make duplicate handling explicit.\n\nI analyzed a large set of upload events in one investigation — more than three thousand — but I will not invent a failure percentage.\n\n[NEEDS REAL DETAILS] Name the exact workflow if you will use this as a hero story.",
    anchors: ["can't reproduce ≠ unsolvable", "telemetry before theory", "retry only if safe"],
    mistakes: ["increase the timeout and ship"],
    followUp: "Why not just increase the timeout?",
    process: process
  });

  add({
    id: "q27", num: 27, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "A bug happens only on Android, not iOS. How do you proceed?",
    testsTr: "Dart vs plugin vs OS.",
    sample: "I reproduce on the affected OS version and device class, then split Dart-side logic from plugin/platform behavior.\n\nIf both platforms run the same Dart and only Android fails, I look at permissions, lifecycle, notification/background limits, gradle/plugin versions and OEM differences.\n\nI compare logs around the platform channel boundary before rewriting the Flutter widget.",
    anchors: ["same Dart?", "channel boundary", "OS restrictions"],
    mistakes: ["rewrite the UI first"],
    followUp: "What if it only fails on Android 14 in the background?",
    process: process
  });

  add({
    id: "q28", num: 28, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "How can an undisposed StreamSubscription leak memory or cause setState after dispose?",
    testsTr: "Listener yaşamı.",
    sample: "If a State listens in initState and never cancels, the callback can run after dispose and hit setState on a defunct object. It also keeps the State and any captured closures alive.\n\nFix: store the subscription, cancel in dispose, and/or use listen(cancelOnError: ...) plus a mounted guard.\n\nA widget test that pumps, disposes, then emits on the fake stream is a cheap regression.",
    anchors: ["cancel in dispose", "setState after dispose", "widget test"],
    mistakes: ["listen in build without cancel"],
    followUp: "How do GetX workers change this picture?",
    process: process
  });

  add({
    id: "q29", num: 29, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "How do you diagnose jank on a long list?",
    testsTr: "Same as q20, shorter ops version.",
    sample: "Performance overlay first. Then check itemBuilder cost, image decode, missing cacheExtent strategy, and whether the list is a builder.\n\nI would not start with a full architecture rewrite. Jank is usually a measured hotspot in build/layout/paint.",
    anchors: ["overlay", "itemBuilder", "images"],
    mistakes: ["Opens BLoC vs GetX debate"],
    followUp: "Would you use a custom Sliver? When?",
    process: process
  });

  add({
    id: "q30", num: 30, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "60s", status: "verified",
    question: "How do you test async races or retries without sleep()?",
    testsTr: "fakeAsync, Completer, fake clock.",
    sample: "Real sleep makes tests flaky and slow. I use Completers to control completion order, and fakeAsync to elapse timers for retry/backoff.\n\nThe invariant is the thing under test: for example, a later search must win even if the earlier Future completes last.\n\nThat is also how I would think about a deterministic validator: fixed inputs, controlled time, observable output.",
    anchors: ["Completer order", "fakeAsync", "assert the invariant"],
    mistakes: ["await Future.delayed(3.seconds) in CI"],
    followUp: "What is the difference between a fake HTTP client and a mock verify()?",
    process: process
  });

  add({
    id: "q31", num: 31, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "60s", status: "verified",
    question: "Where should API errors become app failures?",
    testsTr: "Transport vs domain vs UI.",
    sample: "Raw Dio exceptions should not leak into widgets. At the data boundary I map them into domain failures: unauthorized, notFound, unavailable, timeoutUnknown.\n\nPresentation then decides copy and recovery. That keeps retry policy next to the client, and keeps UI from switching on statusCode == 500 in six screens.\n\nTimeouts stay semantically unknown until reconciled, not automatically failed.",
    anchors: ["map at boundary", "UI sees domain errors", "timeout is unknown"],
    mistakes: ["catch (e) { show(e.toString()); }"],
    followUp: "Where do you put retry: repository or Cubit?",
    process: process
  });

  add({
    id: "q32", num: 32, category: "debug",
    categoryLabel: "Debugging, Testing, APIs",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "75s", status: "verified",
    question: "How would you design offline edits with eventual sync?",
    testsTr: "Outbox, durable local state, conflict policy.",
    sample: "I would persist the user's intent locally first, including a stable operation id, then sync through an outbox: next-eligible item, bounded retries, backoff, and a clear failed/pending/synced state.\n\nThe server remains the source of truth after ack. If the app is killed, the outbox must survive. Conflicts need an explicit policy, not last-write-wins by accident.\n\nI have a personal Field Sync lab around Drift, outbox and lost-session recovery. That is a demonstration, not a Rent Ready production claim.",
    anchors: ["intent first", "outbox", "server after ack", "lab not production"],
    mistakes: ["write only to memory and hope"],
    followUp: "What happens if the same edit is queued twice?",
    process: process
  });

  add({
    id: "q33", num: 33, category: "ai",
    categoryLabel: "AI Evaluation",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "60s", status: "verified",
    question: "How would you create a reproducible mobile bug for a training task?",
    testsTr: "Fixture, steps, observable failure, not a war story.",
    sample: "I would freeze the environment: app version, seed data, device/OS class, and exact steps. The bug should fail the same way every time, with an observable symptom — wrong screen, duplicate row, crash log.\n\nI would include a failing test or a scripted repro, not a video of a flake. Hidden timing assumptions are the enemy. Fake clocks and fakes beat real network.\n\nThis is how I would write a task for another engineer or for a model: if they follow the steps, they must see the same failure.",
    anchors: ["frozen fixtures", "observable symptom", "no flakes"],
    mistakes: ["repro depends on production data"],
    followUp: "What if the bug is genuinely timing-dependent?"
  });

  add({
    id: "q34", num: 34, category: "ai",
    categoryLabel: "AI Evaluation",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "60s", status: "verified",
    question: "How would you create a reference solution?",
    testsTr: "Reference defines behavior, not the only AST.",
    sample: "A reference solution is a known-good implementation I can run against the same tests as candidates or models.\n\nIt should be boringly correct: handle edge cases, name things clearly, and avoid clever shortcuts that tests might accidentally require.\n\nThe tests must not assert that the solution used my class names. The reference proves the task is solvable and documents intended behavior.",
    anchors: ["solvable task", "behavior not shape", "edge cases included"],
    mistakes: ["tests import the reference's private methods"],
    followUp: "What if a better algorithm appears later?"
  });

  add({
    id: "q35", num: 35, category: "ai",
    categoryLabel: "AI Evaluation",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "75s", status: "verified",
    question: "How would you build a deterministic validator?",
    testsTr: "Same inputs → same pass/fail.",
    sample: "A validator is deterministic if it never depends on wall-clock time, real network, random seeds, directory listing order, or machine load.\n\nI would pin inputs, stub time, sort any unordered collections before comparing, and assert observable outputs: return values, emitted states, written files.\n\nIf two correct solutions can differ in internal structure, the validator must still pass both.",
    anchors: ["no wall clock", "observable outputs", "multiple correct shapes"],
    mistakes: ["asserting debugPrint order"],
    followUp: "How do you handle floating-point or map iteration order?"
  });

  add({
    id: "q36", num: 36, category: "ai",
    categoryLabel: "AI Evaluation",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "75s", status: "verified",
    question: "How do you test a function that has multiple valid implementations?",
    testsTr: "Contract tests; two algorithms, one spec.",
    sample: "I would specify the contract: for this input set, these are acceptable outputs. Then I run the same tests against a sort-based implementation and a heap-based one, or against recursive and iterative solutions.\n\nThis browser cannot execute Dart. Conceptually, both implementations below should pass the same validator because they satisfy the same observable contract: unique integers, sorted ascending.",
    anchors: ["contract over algorithm", "two impls one test", "no Dart runtime here"],
    mistakes: ["asserting the code used List.sort"],
    followUp: "What hidden edge case would you add?",
    code: "// Contract: uniqueInts(list) -> sorted unique ints\nList<int> uniqueA(List<int> xs) => ({...xs}.toList()..sort());\n\nList<int> uniqueB(List<int> xs) {\n  final out = <int>[];\n  final seen = <int>{};\n  for (final x in xs) {\n    if (seen.add(x)) out.add(x);\n  }\n  out.sort();\n  return out;\n}\n\n// Validator cases: [], [1], [2,1,2] => [1,2]"
  });

  add({
    id: "q37", num: 37, category: "ai",
    categoryLabel: "AI Evaluation",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "60s", status: "verified",
    question: "How would you evaluate a code solution generated by an AI model?",
    testsTr: "Run it. Don't read confidence.",
    sample: "I would not grade by how senior the comments sound. I would run the validator, inspect failures, then read the diff for unsafe behavior: swallowed errors, hidden time dependence, hardcoded answers to the sample tests.\n\nIf it passes tests but cheats — for example encoding the fixture — the task is under-specified or the tests leaked.\n\nI still own the decision. The model is an accelerator, not an authority.",
    anchors: ["run tests", "look for cheats", "human owns ship"],
    mistakes: ["it compiled so it is correct"],
    followUp: "What would you add to catch a hardcoded fixture?"
  });

  add({
    id: "q38", num: 38, category: "ai",
    categoryLabel: "AI Evaluation",
    topicLabel: "Likely practice question",
    difficulty: "senior", duration: "45s", status: "verified",
    question: "How do you distinguish a behavior test from an implementation-detail test?",
    testsTr: "Could a valid rewrite fail this test?",
    sample: "If a clean rewrite of the same behavior would fail the test, it is an implementation-detail test. Those are brittle for humans and worse for models, because they lock one AST.\n\nA behavior test asks: given this input and these fakes, what is the observable result? I still use interaction tests when the side effect is the requirement — for example, refresh must be called once.",
    anchors: ["valid rewrite test", "observable result", "side effects as requirements"],
    mistakes: ["verify(foo.bar()).called(1) on every private helper"],
    followUp: "When is an interaction test actually the spec?"
  });

  add({
    id: "q39", num: 39, category: "ai",
    categoryLabel: "AI Evaluation",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "How would you document a debugging task for another engineer or a model?",
    testsTr: "Symptom, environment, expected vs actual, constraints.",
    sample: "I would write the symptom, starting environment, exact steps, expected versus actual, logs to collect, and what not to change — for example, don't rewrite the architecture.\n\nI would include a failing test if I can. Ambiguous tasks produce confident wrong patches.",
    anchors: ["steps", "expected vs actual", "constraints"],
    mistakes: ["fix the performance issues somewhere"],
    followUp: "What belongs in hidden tests versus the prompt?"
  });

  add({
    id: "q40", num: 40, category: "ai",
    categoryLabel: "AI Evaluation",
    topicLabel: "Likely practice question",
    difficulty: "core", duration: "45s", status: "verified",
    question: "How would you ensure a task has clear acceptance criteria?",
    testsTr: "Done means observable, not vibe.",
    sample: "Acceptance criteria should be testable: given fixture X, after action Y, observable state is Z. Include failure cases, not only the happy path.\n\nI would separate requirements from the reference implementation. If the prompt says use a specific class name, that is a requirement. If it doesn't, the validator must not require it.\n\nHidden tests exist to cover edge cases the prompt shouldn't spoil, not to punish a valid approach.",
    anchors: ["observable Z", "failure cases", "prompt vs hidden tests"],
    mistakes: ["make it clean and production-ready with no examples"],
    followUp: "How many hidden tests is too many?"
  });

  M.questions = Q;
})(window.MICRO1);
