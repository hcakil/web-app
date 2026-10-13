window.MICRO1 = window.MICRO1 || {};
window.MICRO1.sheet = {
  "cheat": [
    {
      "k": "ABOUT ME",
      "v": "9+ years → 6.5+ Flutter → US product → APIs/debug/testing/reliability"
    },
    {
      "k": "DEBUG",
      "v": "Reproduce → isolate → hypothesis → evidence → smallest fix → regression test"
    },
    {
      "k": "TEST",
      "v": "Unit → widget → integration → risky manual flows"
    },
    {
      "k": "PERFORMANCE",
      "v": "Measure → bottleneck → one change → compare"
    },
    {
      "k": "AI CODE",
      "v": "Requirements → correctness → edge cases → evidence → tests → maintainability"
    },
    {
      "k": "UNKNOWN",
      "v": "Don't bluff → explain approach"
    }
  ],
  "format": [
    "approximately 24 minutes",
    "timed answers",
    "voice or text responses",
    "interview is recorded",
    "profile link may contain the recording",
    "desktop required",
    "stable internet",
    "quiet environment",
    "do not refresh the page during the interview"
  ],
  "reminders": [
    "Don't oversell Swift/Kotlin.",
    "Don't say \"I always use BLoC.\"",
    "Don't turn every answer into a long story.",
    "Use production examples when possible.",
    "Prefer evidence over opinion.",
    "If unsure, describe your debugging process.",
    "Never invent an API name.",
    "Finish answers with the decision or lesson."
  ],
  "cram": [
    1,
    2,
    6,
    11,
    8,
    20,
    16,
    17,
    24,
    33,
    5
  ],
  "recovery": [
    {
      "title": "If you need thinking time",
      "lines": [
        "Let me think through that step by step.",
        "The first thing I would check is whether I can reproduce it consistently.",
        "I would separate the problem into a few layers first."
      ]
    },
    {
      "title": "If you don't know the exact API",
      "lines": [
        "I haven't worked deeply with that specific API, but I can explain how I would approach the problem.",
        "I don't want to guess the exact method name, but conceptually I would handle it this way."
      ]
    },
    {
      "title": "If the question is ambiguous",
      "lines": [
        "There are a couple of ways to interpret that. I'll assume you mean the production behavior rather than the implementation detail.",
        "The answer depends on whether this is a local UI state or shared application state. For the shared-state case, I would..."
      ]
    },
    {
      "title": "If you want to finish cleanly",
      "lines": [
        "So the main idea is to make the behavior reproducible, isolate the cause, and protect the fix with a test.",
        "The trade-off I would optimize for here is correctness first, then simplicity and performance."
      ]
    }
  ],
  "questions": [
    {
      "num": 1,
      "id": "s1",
      "category": "Introduction",
      "duration": "45–75 sec",
      "question": "Tell me about yourself.",
      "answer": [
        "I'm a software engineer with over nine years of experience, and for the last six and a half years I've been focused mainly on Flutter and Dart.",
        "For almost four years I've been working remotely for a US-based product company, building and maintaining production mobile and web applications.",
        "My work includes API integrations, debugging production issues, performance improvements, automated testing, CI/CD, and reliability.",
        "I enjoy problems where I need to understand why something fails in production, reproduce it, and build a reliable fix."
      ],
      "remember": "9 years → 6.5 Flutter → US product → debugging/testing/reliability"
    },
    {
      "num": 2,
      "id": "s2",
      "category": "Introduction",
      "duration": "45–75 sec",
      "question": "What is your strongest programming language?",
      "answer": [
        "My strongest language is Dart, especially in production Flutter applications.",
        "I'm comfortable with asynchronous programming, state management, API integrations, error handling, testing, and performance debugging.",
        "I also work with TypeScript and JavaScript when I need to work across mobile, backend, or web layers."
      ],
      "remember": ""
    },
    {
      "num": 3,
      "id": "s3",
      "category": "Introduction",
      "duration": "45–75 sec",
      "question": "How much native iOS or Android experience do you have?",
      "answer": [
        "My deepest production experience is Flutter and Dart.",
        "I understand the native mobile layer and I've worked with platform-specific integrations, permissions, build configuration, signing, Xcode, and Android tooling when needed.",
        "I wouldn't claim the same depth in Swift or Kotlin as I have in Flutter, but I'm comfortable debugging across the platform boundary."
      ],
      "remember": ""
    },
    {
      "num": 4,
      "id": "s4",
      "category": "Introduction",
      "duration": "45–75 sec",
      "question": "Why mobile development?",
      "answer": [
        "I like mobile development because it combines product thinking, performance, UX, platform behavior, and backend integration.",
        "A small implementation detail can directly affect the user experience, so I enjoy the feedback loop between engineering decisions and real product behavior."
      ],
      "remember": ""
    },
    {
      "num": 5,
      "id": "s5",
      "category": "Introduction",
      "duration": "45–75 sec",
      "question": "Why are you interested in this role?",
      "answer": [
        "The role matches the part of engineering I enjoy most: evaluating behavior, debugging edge cases, reviewing code, and deciding whether an implementation is actually correct.",
        "I also like work where reasoning quality matters, not just writing code quickly.",
        "My production background helps because I'm used to thinking about reliability, failure modes, and whether something will work outside the happy path."
      ],
      "remember": ""
    },
    {
      "num": 6,
      "id": "s6",
      "category": "Debugging",
      "duration": "60–90 sec",
      "question": "How do you debug a complex mobile issue?",
      "answer": [
        "First, I try to make the problem reproducible. I collect the exact steps, environment, logs, and expected versus actual behavior.",
        "Then I isolate the problem layer by layer: UI state, application logic, network request, backend response, persistence, or platform integration.",
        "I reduce it to the smallest failing scenario, form a hypothesis, and verify it with evidence instead of changing multiple things at once.",
        "Once I find the root cause, I make the smallest safe fix and add a regression test if possible."
      ],
      "remember": ""
    },
    {
      "num": 7,
      "id": "s7",
      "category": "Debugging",
      "duration": "60–90 sec",
      "question": "What do you do if a bug only happens in production?",
      "answer": [
        "I first narrow the conditions: app version, device or OS differences, user flow, API responses, timing, and logs.",
        "Then I try to reproduce the same conditions locally or in a controlled environment.",
        "If reproduction is difficult, I add safe observability around the suspected area instead of guessing.",
        "The goal is to collect enough evidence to turn an intermittent production issue into a testable hypothesis."
      ],
      "remember": ""
    },
    {
      "num": 8,
      "id": "s8",
      "category": "Debugging",
      "duration": "60–90 sec",
      "question": "Tell me about a difficult production issue you solved.",
      "answer": [
        "One type of issue I've handled is API behavior that looked correct functionally but caused performance and reliability problems under real usage.",
        "I traced the full request path, including pagination, sorting, asynchronous calls, and unnecessary work.",
        "Instead of fixing only the visible UI symptom, I measured where time was actually being spent, changed the bottleneck, and verified the result with tests and timing measurements.",
        "The main lesson was to measure first and fix the real cause rather than guessing."
      ],
      "remember": ""
    },
    {
      "num": 9,
      "id": "s9",
      "category": "Debugging",
      "duration": "60–90 sec",
      "question": "How do you approach an intermittent bug?",
      "answer": [
        "I try to identify what changes between successful and failing runs: timing, lifecycle, network state, concurrency, cached state, device differences, or external dependencies.",
        "I add focused logging around those variables and try to reduce the randomness.",
        "Intermittent bugs usually become much easier once you can describe the condition that triggers them."
      ],
      "remember": ""
    },
    {
      "num": 10,
      "id": "s10",
      "category": "Debugging",
      "duration": "60–90 sec",
      "question": "How do you avoid fixing the wrong problem?",
      "answer": [
        "I try to separate symptoms from causes.",
        "Before changing code, I ask what evidence would prove or disprove my current hypothesis.",
        "If I can measure it, reproduce it, or create a failing test, I do that first.",
        "That prevents me from making a large change based only on intuition."
      ],
      "remember": ""
    },
    {
      "num": 11,
      "id": "s11",
      "category": "Testing",
      "duration": "45–75 sec",
      "question": "How do you test a mobile application?",
      "answer": [
        "I use multiple levels of testing.",
        "Unit tests cover business logic and edge cases. Widget or component tests cover important UI behavior. Integration tests cover critical flows.",
        "For production issues, I add regression coverage around the exact failure when possible.",
        "Before release, I focus manual testing on high-risk areas such as permissions, lifecycle changes, networking, offline behavior, and error recovery."
      ],
      "remember": ""
    },
    {
      "num": 12,
      "id": "s12",
      "category": "Testing",
      "duration": "45–75 sec",
      "question": "What should be unit tested?",
      "answer": [
        "I unit test logic that can fail independently of the UI: state transitions, transformations, validation, reducers, retry rules, business decisions, and edge cases.",
        "I avoid testing framework internals.",
        "The most valuable unit tests are usually the ones that protect important product behavior from regression."
      ],
      "remember": ""
    },
    {
      "num": 13,
      "id": "s13",
      "category": "Testing",
      "duration": "45–75 sec",
      "question": "What is your approach to regression testing?",
      "answer": [
        "When a real bug is found, I first try to create a test that reproduces it.",
        "Then I make the smallest fix and keep that test permanently.",
        "That way the bug becomes part of the product's documented behavior and is much less likely to come back later."
      ],
      "remember": ""
    },
    {
      "num": 14,
      "id": "s14",
      "category": "Testing",
      "duration": "45–75 sec",
      "question": "How do you test async code?",
      "answer": [
        "I control the dependencies and timing as much as possible.",
        "I use fake or mocked services, deterministic responses, and explicit state expectations.",
        "I also test failure cases such as timeouts, retries, cancellation, duplicate requests, and race conditions, not just the successful result."
      ],
      "remember": ""
    },
    {
      "num": 15,
      "id": "s15",
      "category": "Testing",
      "duration": "45–75 sec",
      "question": "How do you make a mobile app reliable?",
      "answer": [
        "Reliability comes from predictable state, defensive error handling, tests around critical paths, and observability.",
        "I also try to make failure states recoverable.",
        "A reliable app should not just avoid crashes; when something goes wrong, it should return the user to a safe state and explain what they can do next."
      ],
      "remember": ""
    },
    {
      "num": 16,
      "id": "s16",
      "category": "Architecture",
      "duration": "45–75 sec",
      "question": "What architecture do you prefer in Flutter?",
      "answer": [
        "I prefer a clear separation between presentation, business logic, and data access.",
        "The exact state-management library is less important to me than predictable state transitions, testability, and keeping side effects outside the UI.",
        "I adapt to the existing codebase rather than forcing one pattern everywhere."
      ],
      "remember": ""
    },
    {
      "num": 17,
      "id": "s17",
      "category": "Architecture",
      "duration": "45–75 sec",
      "question": "BLoC, Riverpod, Provider, GetX — which do you prefer?",
      "answer": [
        "I don't choose a state-management solution based only on preference.",
        "I look at the size of the app, team experience, existing architecture, testability, and how much state coordination is needed.",
        "For larger production apps I like explicit, predictable state transitions, but I can work effectively with different patterns."
      ],
      "remember": ""
    },
    {
      "num": 18,
      "id": "s18",
      "category": "Architecture",
      "duration": "45–75 sec",
      "question": "How do you separate business logic from UI?",
      "answer": [
        "I keep UI focused on rendering state and forwarding user intent.",
        "Business rules, async operations, and side effects live outside the widget layer.",
        "This makes the logic easier to test, easier to reuse, and less dependent on Flutter-specific lifecycle behavior."
      ],
      "remember": ""
    },
    {
      "num": 19,
      "id": "s19",
      "category": "Architecture",
      "duration": "45–75 sec",
      "question": "What makes code maintainable?",
      "answer": [
        "Clear boundaries, small responsibilities, predictable naming, tests around important behavior, and avoiding unnecessary abstraction.",
        "I also value code that makes failure modes explicit.",
        "Maintainable code should be easy for the next engineer to understand without needing to reverse-engineer hidden behavior."
      ],
      "remember": ""
    },
    {
      "num": 20,
      "id": "s20",
      "category": "APIs / Offline",
      "duration": "45–75 sec",
      "question": "How do you handle API failures?",
      "answer": [
        "I separate different kinds of failures: no connection, timeout, server error, validation error, authorization error, and unexpected application failure.",
        "The UI should receive a meaningful typed state instead of a raw exception.",
        "Retryable failures can offer retry or controlled backoff, while permanent failures should clearly tell the user what happened."
      ],
      "remember": ""
    },
    {
      "num": 21,
      "id": "s21",
      "category": "APIs / Offline",
      "duration": "45–75 sec",
      "question": "How do you prevent duplicate API requests?",
      "answer": [
        "I control where requests are triggered and avoid tying important network calls directly to repeated UI rebuilds.",
        "For operations where duplication would be dangerous, I use techniques such as request deduplication, intent keys, single-flight behavior, or idempotency on the backend when available."
      ],
      "remember": ""
    },
    {
      "num": 22,
      "id": "s22",
      "category": "APIs / Offline",
      "duration": "45–75 sec",
      "question": "How would you design offline support?",
      "answer": [
        "It depends on the product, but I usually separate local state from synchronization state.",
        "User actions can be stored locally first, then synchronized when connectivity returns.",
        "The important parts are conflict handling, retry strategy, duplicate prevention, and making it clear which data is confirmed by the server versus only local."
      ],
      "remember": ""
    },
    {
      "num": 23,
      "id": "s23",
      "category": "APIs / Offline",
      "duration": "20–40 sec",
      "question": "What is idempotency and why is it useful?",
      "answer": [
        "Idempotency means the same operation can be safely repeated without creating an unintended second result.",
        "It's especially useful for payments, submissions, retries, or unstable network conditions where the client may not know whether the first request succeeded.",
        "A stable idempotency key lets the server recognize the same intent."
      ],
      "remember": ""
    },
    {
      "num": 24,
      "id": "s24",
      "category": "Performance",
      "duration": "45–75 sec",
      "question": "How do you improve Flutter performance?",
      "answer": [
        "I measure first instead of optimizing blindly.",
        "I look for unnecessary rebuilds, expensive work on the UI thread, repeated API calls, large payloads, memory pressure, and slow startup or rendering paths.",
        "Then I change one bottleneck at a time and compare before and after."
      ],
      "remember": ""
    },
    {
      "num": 25,
      "id": "s25",
      "category": "Performance",
      "duration": "45–75 sec",
      "question": "What can cause jank in Flutter?",
      "answer": [
        "Common causes are too much synchronous work on the main isolate, excessive rebuilds, expensive layouts, image decoding, large lists without efficient rendering, or work being done during animations.",
        "I use profiling tools to identify the frame or operation causing the problem rather than assuming."
      ],
      "remember": ""
    },
    {
      "num": 26,
      "id": "s26",
      "category": "Performance",
      "duration": "45–75 sec",
      "question": "How do you optimize a slow API-driven screen?",
      "answer": [
        "I first separate backend latency from client-side work.",
        "Then I look at request duplication, payload size, pagination, sorting, parsing cost, state updates, and rebuild frequency.",
        "Sometimes the right fix is on the client, sometimes the API, and sometimes both."
      ],
      "remember": ""
    },
    {
      "num": 27,
      "id": "s27",
      "category": "Async / Lifecycle",
      "duration": "45–75 sec",
      "question": "What is a race condition?",
      "answer": [
        "A race condition happens when the result depends on the timing or order of asynchronous operations.",
        "For example, two requests may update the same state, and an older response can overwrite a newer one.",
        "I handle this with cancellation, request identity, sequencing, state guards, or designing the operation to be idempotent."
      ],
      "remember": ""
    },
    {
      "num": 28,
      "id": "s28",
      "category": "Async / Lifecycle",
      "duration": "45–75 sec",
      "question": "How do you handle app lifecycle changes?",
      "answer": [
        "I treat backgrounding, interruption, and resume as real product states.",
        "Long-running operations should either pause safely, cancel, or be recoverable.",
        "I avoid assuming that an operation will always finish just because it started while the app was active."
      ],
      "remember": ""
    },
    {
      "num": 29,
      "id": "s29",
      "category": "Async / Lifecycle",
      "duration": "20–40 sec",
      "question": "What is the danger of an unawaited async call?",
      "answer": [
        "An unawaited call can make control flow harder to reason about.",
        "Errors may be lost, dependent work may run too early, and the caller may assume something completed when it didn't.",
        "Sometimes fire-and-forget is intentional, but I make that explicit and make sure failures are safely handled."
      ],
      "remember": ""
    },
    {
      "num": 30,
      "id": "s30",
      "category": "Security / Privacy",
      "duration": "45–75 sec",
      "question": "How do you think about privacy in mobile apps?",
      "answer": [
        "I try to collect only what the product actually needs.",
        "Sensitive information should not appear in logs, analytics, or crash metadata unless there is a clear reason and appropriate protection.",
        "I also prefer local processing when it can meet the product requirement without sending user data to a server."
      ],
      "remember": ""
    },
    {
      "num": 31,
      "id": "s31",
      "category": "Security / Privacy",
      "duration": "20–40 sec",
      "question": "How should permissions be requested?",
      "answer": [
        "At the moment the feature needs them, not automatically at app launch unless there is a strong reason.",
        "The user should understand why the permission is needed, and the app should handle denied and permanently denied states gracefully."
      ],
      "remember": ""
    },
    {
      "num": 32,
      "id": "s32",
      "category": "AI Evaluation",
      "duration": "45–75 sec",
      "question": "What do you look for in a code review?",
      "answer": [
        "First I check correctness: does the code actually satisfy the requirement and handle failure cases?",
        "Then I look at readability, state management, edge cases, tests, performance, and whether the change creates unnecessary complexity.",
        "I try to distinguish must-fix issues from personal style preferences."
      ],
      "remember": ""
    },
    {
      "num": 33,
      "id": "s33",
      "category": "AI Evaluation",
      "duration": "45–75 sec",
      "question": "How would you evaluate AI-generated code?",
      "answer": [
        "I would not judge it by how confident or clean it looks.",
        "I would verify the requirements, run or reason through edge cases, inspect error handling, look for hidden assumptions, and test the code if possible.",
        "AI-generated code should be evaluated exactly like production code: behavior first, then maintainability and safety."
      ],
      "remember": ""
    },
    {
      "num": 34,
      "id": "s34",
      "category": "AI Evaluation",
      "duration": "45–75 sec",
      "question": "What makes an AI coding answer good?",
      "answer": [
        "It should be correct, relevant to the actual environment, explicit about assumptions, and safe to apply.",
        "A strong answer explains trade-offs and doesn't invent APIs or claim something was verified when it wasn't.",
        "For code, I also care about whether it handles edge cases and can be tested."
      ],
      "remember": ""
    },
    {
      "num": 35,
      "id": "s35",
      "category": "AI Evaluation",
      "duration": "45–75 sec",
      "question": "What would make you reject an AI-generated solution?",
      "answer": [
        "If it solves the wrong problem, relies on nonexistent APIs, ignores important failure modes, introduces unnecessary complexity, or makes claims without evidence.",
        "I would also reject a solution that technically works but is unsafe for the product context."
      ],
      "remember": ""
    },
    {
      "num": 36,
      "id": "s36",
      "category": "AI Evaluation",
      "duration": "45–75 sec",
      "question": "Why would you be good at evaluating AI code?",
      "answer": [
        "A large part of my production work is deciding whether code actually behaves correctly, not just whether it looks reasonable.",
        "I'm used to debugging, reviewing implementations, writing regression tests, and checking edge cases.",
        "That maps directly to evaluating AI-generated code and technical responses."
      ],
      "remember": ""
    },
    {
      "num": 37,
      "id": "s37",
      "category": "Behavioral",
      "duration": "45–75 sec",
      "question": "Tell me about a disagreement with a teammate.",
      "answer": [
        "I try to move the discussion from preference to evidence.",
        "I explain the trade-offs, listen to the other person's concerns, and if possible use a small experiment, benchmark, or test to compare the options.",
        "The goal is not to win the argument; it's to make the best technical decision for the product."
      ],
      "remember": ""
    },
    {
      "num": 38,
      "id": "s38",
      "category": "Behavioral",
      "duration": "45–75 sec",
      "question": "How do you handle unclear requirements?",
      "answer": [
        "I identify what is known, what is ambiguous, and what decision would change the implementation significantly.",
        "I ask focused questions instead of asking for the whole requirement again.",
        "If a decision can safely be deferred, I choose a simple design that keeps options open."
      ],
      "remember": ""
    },
    {
      "num": 39,
      "id": "s39",
      "category": "Behavioral",
      "duration": "45–75 sec",
      "question": "How do you prioritize under time pressure?",
      "answer": [
        "I prioritize by user impact, production risk, and reversibility.",
        "I first protect critical flows and remove blockers, then handle improvements that can safely wait.",
        "Under time pressure, I prefer a small well-tested fix over a large cleanup unless the cleanup is required for correctness."
      ],
      "remember": ""
    },
    {
      "num": 40,
      "id": "s40",
      "category": "Behavioral",
      "duration": "45–75 sec",
      "question": "Tell me about a mistake you made.",
      "answer": [
        "I've had situations where an initial hypothesis about a bug was wrong.",
        "What helped was going back to the evidence instead of defending the first idea.",
        "I learned to isolate variables and verify assumptions earlier, especially for timing, performance, and asynchronous issues."
      ],
      "remember": ""
    },
    {
      "num": 41,
      "id": "s41",
      "category": "Behavioral",
      "duration": "45–75 sec",
      "question": "How do you learn a technology you don't know?",
      "answer": [
        "I start with the smallest real problem I need to solve.",
        "I read the official documentation, build a minimal example, and validate my assumptions with working code.",
        "I learn faster when I connect the new technology to an actual product problem instead of studying it only theoretically."
      ],
      "remember": ""
    },
    {
      "num": 42,
      "id": "s42",
      "category": "Flutter Quick Questions",
      "duration": "20–40 sec",
      "question": "StatefulWidget vs StatelessWidget?",
      "answer": [
        "A StatelessWidget renders entirely from its inputs and external state.",
        "A StatefulWidget owns mutable lifecycle state through a State object.",
        "I still try to keep important business state outside widgets even when a StatefulWidget is needed for local UI behavior."
      ],
      "remember": ""
    },
    {
      "num": 43,
      "id": "s43",
      "category": "Flutter Quick Questions",
      "duration": "20–40 sec",
      "question": "Future vs Stream?",
      "answer": [
        "A Future represents one asynchronous result.",
        "A Stream represents a sequence of asynchronous values over time.",
        "I use a Stream when multiple updates are part of the model, not just because something is asynchronous."
      ],
      "remember": ""
    },
    {
      "num": 44,
      "id": "s44",
      "category": "Flutter Quick Questions",
      "duration": "20–40 sec",
      "question": "What is an isolate in Dart?",
      "answer": [
        "An isolate is an independent Dart execution context with its own memory.",
        "Isolates communicate by message passing instead of sharing mutable memory.",
        "They're useful when CPU-heavy work would otherwise block the main isolate and cause UI jank."
      ],
      "remember": ""
    },
    {
      "num": 45,
      "id": "s45",
      "category": "Flutter Quick Questions",
      "duration": "20–40 sec",
      "question": "What is BuildContext?",
      "answer": [
        "BuildContext represents a widget's location in the widget tree.",
        "It's used to access inherited dependencies such as Theme, MediaQuery, localization, or Navigator.",
        "I avoid keeping a BuildContext longer than its widget lifecycle makes safe, especially across async gaps."
      ],
      "remember": ""
    },
    {
      "num": 46,
      "id": "s46",
      "category": "Flutter Quick Questions",
      "duration": "20–40 sec",
      "question": "Why use keys in Flutter?",
      "answer": [
        "Keys help Flutter identify widgets across rebuilds, especially when items move, are reordered, or maintain state.",
        "I use them when widget identity matters, not automatically on every widget."
      ],
      "remember": ""
    },
    {
      "num": 47,
      "id": "s47",
      "category": "Flutter Quick Questions",
      "duration": "20–40 sec",
      "question": "What is dependency injection?",
      "answer": [
        "Dependency injection means providing an object's dependencies from outside instead of constructing everything internally.",
        "It improves testability and makes implementations easier to replace, for example swapping a real API client with a fake in tests."
      ],
      "remember": ""
    },
    {
      "num": 48,
      "id": "s48",
      "category": "Flutter Quick Questions",
      "duration": "20–40 sec",
      "question": "REST vs WebSocket?",
      "answer": [
        "REST is usually request-response and works well for standard resource operations.",
        "WebSockets keep a persistent connection and are better when the server needs to push frequent real-time updates.",
        "I choose based on the product's communication pattern rather than treating one as generally better."
      ],
      "remember": ""
    },
    {
      "num": 49,
      "id": "s49",
      "category": "Situational",
      "duration": "60–90 sec",
      "question": "The app crashes only on one device model. What do you do?",
      "answer": [
        "I would compare OS version, architecture, permissions, hardware-specific behavior, memory pressure, and native plugin usage.",
        "I would collect the crash trace first, then reproduce on the same or closest available environment.",
        "If it points into a native plugin, I would isolate whether the problem is our integration, the plugin, or the platform API."
      ],
      "remember": ""
    },
    {
      "num": 50,
      "id": "s50",
      "category": "Situational",
      "duration": "60–90 sec",
      "question": "A new release is slower than the previous one. What do you check?",
      "answer": [
        "First I confirm the regression with comparable measurements.",
        "Then I compare startup, network timing, rendering, memory, and any dependency or configuration changes between the releases.",
        "I narrow it to a specific path before attempting an optimization."
      ],
      "remember": ""
    },
    {
      "num": 51,
      "id": "s51",
      "category": "Situational",
      "duration": "60–90 sec",
      "question": "Users report duplicate submissions. How would you investigate?",
      "answer": [
        "I would check whether the UI can trigger the action twice, whether retries are automatic, whether requests have unique intent IDs, and whether the backend supports idempotency.",
        "I would reproduce rapid taps and unstable-network scenarios and then protect both client and server where appropriate."
      ],
      "remember": ""
    },
    {
      "num": 52,
      "id": "s52",
      "category": "Situational",
      "duration": "60–90 sec",
      "question": "A network request succeeds, but the UI shows an error. What could cause that?",
      "answer": [
        "The failure may be after the request itself: response parsing, state transformation, stale state, a race condition, or UI lifecycle handling.",
        "I would trace the request from transport through parsing and state update instead of assuming the API is the problem."
      ],
      "remember": ""
    }
  ]
};
