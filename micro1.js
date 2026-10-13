(function () {
  const M = window.MICRO1;
  const STORE_KEY = "micro1-prep-v1";
  const VIEWS = ["dashboard", "prep", "experience", "dart", "debug", "ai", "stories", "mock", "quick"];
  const CAT_VIEW = { experience: "experience", dart: "dart", debug: "debug", ai: "ai" };

  function defaultStore() {
    return {
      answers: {},
      notes: {},
      practiced: {},
      hard: {},
      revealed: {},
      coach: {},
      rubric: {},
      prep: {},
      stories: {},
      lastQuestion: null,
      mockHistory: [],
      mockSession: null,
      prefs: { focus: false, mockSeconds: 180, mockTotal: 24 }
    };
  }

  function loadStore() {
    try {
      const raw = localStorage.getItem(STORE_KEY);
      if (!raw) return defaultStore();
      const parsed = JSON.parse(raw);
      return Object.assign(defaultStore(), parsed, {
        answers: parsed.answers || {},
        notes: parsed.notes || {},
        practiced: parsed.practiced || {},
        hard: parsed.hard || {},
        revealed: parsed.revealed || {},
        coach: parsed.coach || {},
        rubric: parsed.rubric || {},
        prep: parsed.prep || {},
        stories: parsed.stories || {},
        mockHistory: parsed.mockHistory || [],
        mockSession: parsed.mockSession || null,
        prefs: Object.assign(defaultStore().prefs, parsed.prefs || {})
      });
    } catch (e) {
      return defaultStore();
    }
  }

  function restoreMock(session) {
    if (!session || !session.questionIds) return null;
    const questions = session.questionIds.map(qs).filter(Boolean);
    if (!questions.length) return null;
    return {
      active: !!session.active,
      paused: !!session.paused,
      review: !!session.review,
      questions: questions,
      index: Math.min(session.index || 0, questions.length - 1),
      answers: session.answers || {},
      qRemain: session.qRemain || 180,
      totalRemain: session.totalRemain || 24 * 60,
      per: session.per || 180,
      finishedAt: session.finishedAt || null
    };
  }

  const initialStore = loadStore();
  const state = {
    store: initialStore,
    view: "dashboard",
    questionId: null,
    tick: 0,
    mock: restoreMock(initialStore.mockSession),
    practiceTimer: { id: null, remain: 0, running: false, qid: null },
    recorder: { rec: null, chunks: [], url: null, supported: !!(navigator.mediaDevices && window.MediaRecorder) }
  };

  let saveTimer = null;
  function saveStore() {
    clearTimeout(saveTimer);
    saveTimer = setTimeout(function () {
      try { localStorage.setItem(STORE_KEY, JSON.stringify(state.store)); }
      catch (e) { /* quota */ }
    }, 120);
  }

  function persistMock() {
    if (!state.mock) {
      state.store.mockSession = null;
    } else {
      state.store.mockSession = {
        active: state.mock.active,
        paused: state.mock.paused,
        review: state.mock.review,
        questionIds: state.mock.questions.map(function (q) { return q.id; }),
        index: state.mock.index,
        answers: state.mock.answers,
        qRemain: state.mock.qRemain,
        totalRemain: state.mock.totalRemain,
        per: state.mock.per,
        finishedAt: state.mock.finishedAt || null
      };
    }
    saveStore();
  }

  function qs(id) { return M.questions.find(function (q) { return q.id === id; }); }
  function byCat(cat) { return M.questions.filter(function (q) { return q.category === cat; }); }
  function practicedCount() {
    return Object.keys(state.store.practiced).filter(function (k) { return state.store.practiced[k]; }).length;
  }

  function el(tag, attrs, kids) {
    const n = document.createElement(tag);
    if (attrs) {
      Object.keys(attrs).forEach(function (k) {
        if (k === "class") n.className = attrs[k];
        else if (k === "html") n.innerHTML = attrs[k];
        else if (k.indexOf("on") === 0) n.addEventListener(k.slice(2).toLowerCase(), attrs[k]);
        else if (attrs[k] === false || attrs[k] == null) return;
        else n.setAttribute(k, attrs[k] === true ? "" : String(attrs[k]));
      });
    }
    (kids || []).forEach(function (c) {
      if (c == null || c === false) return;
      n.appendChild(typeof c === "string" ? document.createTextNode(c) : c);
    });
    return n;
  }

  function badge(text, cls) { return el("span", { class: "badge " + (cls || "") }, [text]); }
  function btn(label, cls, fn) {
    return el("button", { class: "text-btn " + (cls || ""), type: "button", onclick: fn }, [label]);
  }
  function escapeHtml(s) {
    return String(s || "").replace(/[&<>]/g, function (c) {
      return ({ "&": "&amp;", "<": "&lt;", ">": "&gt;" })[c];
    });
  }
  function pre(code) {
    if (!code) return null;
    return el("pre", {}, [el("code", {}, [code])]);
  }

  function setNav() {
    document.querySelectorAll(".nav-link[data-view]").forEach(function (a) {
      if (a.getAttribute("data-view") === state.view) a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
    document.body.classList.toggle("focus-mode", !!state.store.prefs.focus || (state.mock && state.mock.active));
    const chip = document.getElementById("timerChip");
    if (state.mock && state.mock.active) {
      chip.textContent = fmt(state.mock.totalRemain);
      chip.className = "timer-chip" + (state.mock.totalRemain < 120 ? " warn" : "");
    } else if (state.practiceTimer.running) {
      chip.textContent = fmt(state.practiceTimer.remain);
      chip.className = "timer-chip";
    } else {
      chip.textContent = "00:00";
      chip.className = "timer-chip idle";
    }
  }

  function fmt(sec) {
    sec = Math.max(0, sec | 0);
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return String(m).padStart(2, "0") + ":" + String(s).padStart(2, "0");
  }

  function go(hash) {
    location.hash = hash;
  }

  function parseHash() {
    const h = (location.hash || "#dashboard").replace(/^#/, "") || "dashboard";
    if (/^q\d+$/.test(h)) {
      state.view = (qs(h) && CAT_VIEW[qs(h).category]) || "experience";
      state.questionId = h;
      return;
    }
    state.questionId = null;
    state.view = VIEWS.indexOf(h) >= 0 ? h : "dashboard";
  }

  function render() {
    parseHash();
    const root = document.getElementById("app");
    root.innerHTML = "";
    const view = {
      dashboard: viewDashboard,
      prep: viewPrep,
      experience: function () { return viewLibrary("experience"); },
      dart: function () { return viewLibrary("dart"); },
      debug: function () { return viewLibrary("debug"); },
      ai: function () { return viewLibrary("ai"); },
      stories: viewStories,
      mock: viewMock,
      quick: viewQuick
    }[state.view];
    root.appendChild(view());
    setNav();
    if (state.questionId) {
      const node = document.getElementById(state.questionId);
      if (node) node.scrollIntoView({ block: "start" });
    }
  }

  function viewDashboard() {
    const last = state.store.lastQuestion && qs(state.store.lastQuestion);
    const wrap = el("div", { class: "sheet" }, [
      el("div", { class: "page-head" }, [
        el("div", {}, [
          el("h1", {}, ["Mobile Interview Prep Lab"]),
          el("p", { class: "lede" }, [
            M.meta.candidate + " · " + M.meta.location + " · practice only, not the real micro1 assessment."
          ])
        ]),
        el("div", {}, [
          btn("Start practice", "primary", function () { go(last ? "#" + last.id : "#q1"); }),
          last ? btn("Resume " + last.id.toUpperCase(), "", function () { go("#" + last.id); }) : null
        ])
      ]),
      el("p", { class: "disclaimer" }, [
        "Confirmed interview facts: about 24 minutes, recorded, spoken or typed, desktop required, four topic categories. Exact questions, counts and per-question timing are unknown. Practice items below are labeled likely or illustrative — never leaked."
      ]),
      el("div", { class: "stat-row" }, [
        stat("Questions", String(M.questions.length)),
        stat("Practiced", practicedCount() + " / " + M.questions.length),
        stat("Confirmed duration", "~24 min"),
        stat("This is not", "a job placement guarantee")
      ]),
      el("div", { class: "grid grid-3" }, [
        modeCard("Quick Review", "15 minutes. Intro, two stories, pitfalls, recovery phrases.", "#quick"),
        modeCard("Focused prep", "60–90 minutes with saved steps.", "#prep"),
        modeCard("Mock interview", "Illustrative ~24-minute simulation. Timing is not claimed to be micro1's.", "#mock")
      ]),
      el("h2", {}, ["Confirmed topic categories"]),
      el("ul", { class: "compact" }, M.meta.confirmedTopics.map(function (t) { return el("li", {}, [t]); })),
      el("h2", {}, ["Libraries"]),
      el("div", { class: "grid grid-3" }, [
        modeCard("Experience", byCat("experience").length + " likely practice questions", "#experience"),
        modeCard("Dart / Flutter", byCat("dart").length + " fundamentals", "#dart"),
        modeCard("Debugging & testing", byCat("debug").length + " scenarios", "#debug"),
        modeCard("AI evaluation", byCat("ai").length + " training-task questions", "#ai"),
        modeCard("Stories", "Two builders + personal labs", "#stories")
      ]),
      privacyCard()
    ]);
    return wrap;
  }

  function stat(k, v) {
    return el("div", { class: "stat" }, [el("b", {}, [v]), k]);
  }
  function modeCard(title, body, href) {
    return el("article", { class: "card" }, [
      el("h3", {}, [title]),
      el("p", { class: "muted" }, [body]),
      btn("Open", "primary", function () { go(href); })
    ]);
  }

  function privacyCard() {
    return el("article", { class: "card" }, [
      el("h3", {}, ["Privacy"]),
      el("p", { class: "muted" }, ["Answers, notes and progress stay in this browser. Nothing is uploaded. Audio is not saved unless you download it."]),
      el("div", { class: "actions" }, [
        btn("Export JSON", "", exportJson),
        btn("Import JSON", "", importJson),
        btn("Clear practice data", "danger", clearData)
      ])
    ]);
  }

  function viewPrep() {
    const total = M.prepSteps.reduce(function (a, s) { return a + s.minutes; }, 0);
    const done = M.prepSteps.filter(function (s) { return state.store.prep[s.id] === "done"; }).length;
    const sheet = el("div", { class: "sheet" }, [
      el("div", { class: "page-head" }, [
        el("div", {}, [
          el("h1", {}, ["Focused preparation"]),
          el("p", { class: "lede" }, ["About " + total + " minutes if you do every block. Skip or revisit any step. Progress is local."])
        ])
      ]),
      el("div", { class: "progress-bar" }, [el("span", { style: "width:" + Math.round(100 * done / M.prepSteps.length) + "%" })]),
      el("p", { class: "muted" }, [done + " of " + M.prepSteps.length + " complete"])
    ]);
    M.prepSteps.forEach(function (step) {
      const st = state.store.prep[step.id] || "todo";
      sheet.appendChild(el("article", { class: "card" }, [
        el("h3", {}, [step.title]),
        el("p", { class: "muted" }, ["Suggested: " + step.minutes + " min · " + st]),
        el("div", { class: "actions" }, [
          btn("Open related library", "", function () {
            const map = { intro: "#experience", dart: "#dart", debug: "#debug", api: "#debug", ai: "#ai", spoken: "#quick" };
            go(map[step.id] || "#dashboard");
          }),
          btn("Mark done", st === "done" ? "" : "primary", function () { state.store.prep[step.id] = "done"; saveStore(); render(); }),
          btn("Skip", "", function () { state.store.prep[step.id] = "skipped"; saveStore(); render(); }),
          btn("Reset", "ghost", function () { delete state.store.prep[step.id]; saveStore(); render(); })
        ])
      ]));
    });
    return sheet;
  }

  function viewLibrary(cat) {
    const list = byCat(cat);
    const titles = {
      experience: "Mobile development experience",
      dart: "Dart and Flutter",
      debug: "Testing and debugging",
      ai: "AI training / code evaluation"
    };
    const sheet = el("div", { class: "sheet" }, [
      el("div", { class: "page-head" }, [
        el("div", {}, [
          el("h1", {}, [titles[cat]]),
          el("p", { class: "lede" }, ["Confirmed category. The prompts themselves are likely practice questions, not leaked micro1 items."])
        ])
      ]),
      el("p", { class: "disclaimer" }, ["Deep links: micro1.html#q1 through #q" + M.questions.length + ". Sample answers are drafts to practice, not scripts to memorize."])
    ]);
    const listEl = el("div", { class: "q-list" });
    list.forEach(function (q) { listEl.appendChild(questionCard(q)); });
    sheet.appendChild(listEl);
    return sheet;
  }

  function questionCard(q) {
    const practiced = !!state.store.practiced[q.id];
    const hard = !!state.store.hard[q.id];
    const card = el("article", { class: "q-card" + (practiced ? " practiced" : "") + (hard ? " hard" : ""), id: q.id });
    const statusCls = q.status === "verified" ? "verified" : q.status === "draft" ? "draft" : "needs";
    card.appendChild(el("div", { class: "q-meta" }, [
      q.id.toUpperCase() + " · " + q.duration,
      badge(q.topicLabel, "likely"),
      badge(q.difficulty, "diff"),
      badge(q.status.replace("-", " "), statusCls)
    ]));
    card.appendChild(el("h2", {}, [q.question]));
    const coach = el("p", { class: "coach hidden-block" + (state.store.coach[q.id] ? " open" : "") }, [q.testsTr]);
    card.appendChild(coach);

    const sample = el("div", { class: "sample" + (state.store.revealed[q.id] ? " open" : "") });
    q.sample.split("\n\n").forEach(function (p) { sample.appendChild(el("p", {}, [p])); });
    if (q.anchors) {
      sample.appendChild(el("p", {}, [el("strong", {}, ["Anchors: "]), q.anchors.join(" → ")]));
    }
    if (q.mistakes) {
      const ul = el("ul", { class: "compact" });
      q.mistakes.forEach(function (m) { ul.appendChild(el("li", {}, [m])); });
      sample.appendChild(el("p", {}, [el("strong", {}, ["Common mistakes"])]));
      sample.appendChild(ul);
    }
    if (q.followUp) sample.appendChild(el("p", {}, [el("strong", {}, ["Follow-up: "]), q.followUp]));
    if (q.process) sample.appendChild(el("p", {}, [el("strong", {}, ["Process: "]), q.process]));
    if (q.codeWrong) {
      sample.appendChild(el("p", {}, [el("strong", {}, ["Wrong"])]));
      sample.appendChild(pre(q.codeWrong));
    }
    if (q.code) {
      sample.appendChild(el("p", {}, [el("strong", {}, [q.codeWrong ? "Corrected / reference" : "Reference Dart (not executed in the browser)"])]));
      sample.appendChild(pre(q.code));
    }
    card.appendChild(sample);

    card.appendChild(el("div", { class: "actions" }, [
      btn(state.store.revealed[q.id] ? "Hide sample" : "Show sample", "", function () {
        state.store.revealed[q.id] = !state.store.revealed[q.id];
        saveStore(); render();
      }),
      btn(state.store.coach[q.id] ? "Hide Turkish notes" : "Show Turkish notes", "", function () {
        state.store.coach[q.id] = !state.store.coach[q.id];
        saveStore(); render();
      }),
      btn("Copy sample", "", function () { copyText(q.sample); }),
      btn(state.practiceTimer.running && state.practiceTimer.qid === q.id ? "Stop timer" : "Start timer " + q.duration, "primary", function () { togglePracticeTimer(q); }),
      btn(practiced ? "Practiced ✓" : "Mark practiced", "", function () {
        state.store.practiced[q.id] = !practiced;
        state.store.lastQuestion = q.id;
        saveStore(); render();
      }),
      btn(hard ? "Difficult ✓" : "Mark difficult", "", function () {
        state.store.hard[q.id] = !hard; saveStore(); render();
      })
    ]));

    card.appendChild(el("label", { class: "field" }, ["My answer"]));
    const ta = el("textarea", { id: "ans-" + q.id }, []);
    ta.value = state.store.answers[q.id] || "";
    ta.addEventListener("input", function () {
      state.store.answers[q.id] = ta.value;
      state.store.lastQuestion = q.id;
      saveStore();
    });
    card.appendChild(ta);

    card.appendChild(el("label", { class: "field" }, ["Personal notes"]));
    const notes = el("textarea", { id: "note-" + q.id, style: "min-height:4rem" }, []);
    notes.value = state.store.notes[q.id] || "";
    notes.addEventListener("input", function () {
      state.store.notes[q.id] = notes.value; saveStore();
    });
    card.appendChild(notes);

    card.appendChild(el("p", { class: "muted" }, ["Self-evaluation (no AI score)"]));
    const rubric = el("div", { class: "rubric" });
    ["Technical accuracy", "Clarity", "Specificity", "Speakability", "Honesty"].forEach(function (axis) {
      const key = q.id + ":" + axis;
      const lab = el("label", {}, [axis + " "]);
      const sel = el("select", {});
      ["", "1", "2", "3", "4", "5"].forEach(function (v) {
        sel.appendChild(el("option", { value: v }, [v || "—"]));
      });
      sel.value = (state.store.rubric[key] || "");
      sel.addEventListener("change", function () { state.store.rubric[key] = sel.value; saveStore(); });
      lab.appendChild(sel);
      rubric.appendChild(lab);
    });
    card.appendChild(rubric);
    return card;
  }

  function togglePracticeTimer(q) {
    if (state.practiceTimer.running && state.practiceTimer.qid === q.id) {
      state.practiceTimer.running = false;
      setNav();
      return;
    }
    const seconds = durationToSeconds(q.duration);
    state.practiceTimer = { remain: seconds, running: true, qid: q.id };
    state.store.lastQuestion = q.id;
    saveStore();
    render();
  }

  function durationToSeconds(label) {
    const m = String(label).match(/(\d+)/);
    return m ? parseInt(m[1], 10) : 60;
  }

  function viewStories() {
    const sheet = el("div", { class: "sheet" }, [
      el("div", { class: "page-head" }, [
        el("div", {}, [
          el("h1", {}, ["Story builder"]),
          el("p", { class: "lede" }, ["Two production templates plus personal labs. Empty fields stay marked NEEDS REAL DETAILS. Do not invent bugs or metrics."])
        ])
      ])
    ]);
    M.stories.forEach(function (story) { sheet.appendChild(storyForm(story)); });
    M.labs.forEach(function (lab) {
      const ul = el("ul", { class: "compact" });
      lab.points.forEach(function (p) { ul.appendChild(el("li", {}, [p])); });
      sheet.appendChild(el("article", { class: "card" }, [
        el("h3", {}, [lab.title]),
        el("p", { class: "needs-box" }, [lab.mark]),
        ul
      ]));
    });
    return sheet;
  }

  const FIELD_LABELS = {
    symptom: "Actual problem / symptom",
    app: "Which application or workflow?",
    repro: "How was it reproduced?",
    tools: "Which logs/tools helped?",
    cause: "Root cause",
    change: "What did I personally change?",
    tests: "Regression tests added",
    validation: "How was the production fix validated?",
    outcome: "Honest outcome that can be claimed"
  };

  function storyForm(story) {
    const data = state.store.stories[story.id] || {};
    const art = el("article", { class: "card" }, [
      el("h3", {}, [story.title]),
      el("p", { class: "needs-box" }, ["NEEDS REAL DETAILS. " + story.prompt])
    ]);
    story.fields.forEach(function (f) {
      art.appendChild(el("label", { class: "field" }, [FIELD_LABELS[f] || f]));
      const ta = el("textarea", { style: "min-height:3.4rem" }, []);
      ta.value = data[f] || "";
      ta.addEventListener("input", function () {
        state.store.stories[story.id] = state.store.stories[story.id] || {};
        state.store.stories[story.id][f] = ta.value;
        saveStore();
      });
      art.appendChild(ta);
    });
    ["trNotes", "en30", "en90", "vocab", "nextQs"].forEach(function (f, i) {
      const labels = ["Turkish raw notes", "English 30-second draft", "English 60–90-second draft", "Key vocabulary", "Likely follow-ups"];
      art.appendChild(el("label", { class: "field" }, [labels[i] + " (editable draft)"]));
      const ta = el("textarea", { style: "min-height:3.4rem" }, []);
      ta.value = data[f] || "";
      ta.addEventListener("input", function () {
        state.store.stories[story.id] = state.store.stories[story.id] || {};
        state.store.stories[story.id][f] = ta.value;
        saveStore();
      });
      art.appendChild(ta);
    });
    return art;
  }

  function pickMockQuestions() {
    const cats = ["experience", "dart", "debug", "ai"];
    const picked = [];
    cats.forEach(function (c) {
      const pool = byCat(c).slice();
      picked.push(pool[Math.floor(Math.random() * pool.length)]);
    });
    const rest = M.questions.filter(function (q) { return picked.indexOf(q) < 0; });
    while (picked.length < 8 && rest.length) {
      picked.push(rest.splice(Math.floor(Math.random() * rest.length), 1)[0]);
    }
    return picked;
  }

  function viewMock() {
    const prefs = state.store.prefs;
    const sheet = el("div", { class: "sheet mock-stage" }, [
      el("div", { class: "page-head" }, [
        el("div", {}, [
          el("h1", {}, ["Mock interview"]),
          el("p", { class: "lede" }, ["Illustrative mock timing. This is not claimed to be micro1's exact question count or clock."])
        ])
      ]),
      el("p", { class: "disclaimer" }, ["Sample answers stay hidden while a mock is active. Nothing is scored by a model. Audio stays on this device."])
    ]);

    if (state.mock && state.mock.review) {
      sheet.appendChild(mockReview(state.mock));
      sheet.appendChild(btn("New mock", "primary", function () { state.mock = null; persistMock(); render(); }));
      return sheet;
    }

    if (!state.mock || !state.mock.active) {
      const per = el("input", { type: "text", value: String(prefs.mockSeconds) });
      const tot = el("input", { type: "text", value: String(prefs.mockTotal) });
      per.addEventListener("change", function () { prefs.mockSeconds = parseInt(per.value, 10) || 180; saveStore(); });
      tot.addEventListener("change", function () { prefs.mockTotal = parseInt(tot.value, 10) || 24; saveStore(); });
      sheet.appendChild(el("label", { class: "field" }, ["Illustrative seconds per question"]));
      sheet.appendChild(per);
      sheet.appendChild(el("label", { class: "field" }, ["Illustrative total minutes"]));
      sheet.appendChild(tot);
      sheet.appendChild(el("div", { class: "actions" }, [
        btn("Start mock", "primary", startMock)
      ]));
      return sheet;
    }

    const m = state.mock;
    const q = m.questions[m.index];
    sheet.appendChild(el("p", { class: "muted", id: "mockStatus" }, [
      "Question " + (m.index + 1) + " of " + m.questions.length +
      " · category: " + q.categoryLabel +
      " · question remaining " + fmt(m.qRemain) +
      " · total remaining " + fmt(m.totalRemain)
    ]));
    sheet.appendChild(el("div", { class: "progress-bar" }, [
      el("span", { style: "width:" + Math.round(100 * (m.index) / m.questions.length) + "%" })
    ]));
    sheet.appendChild(badge("Likely practice question", "likely"));
    sheet.appendChild(el("p", { class: "mock-q" }, [q.question]));
    const ta = el("textarea", { style: "min-height:10rem" });
    ta.value = m.answers[q.id] || "";
    ta.addEventListener("input", function () { m.answers[q.id] = ta.value; persistMock(); });
    sheet.appendChild(el("label", { class: "field" }, ["Your answer"]));
    sheet.appendChild(ta);
    sheet.appendChild(el("div", { class: "actions" }, [
      btn(m.paused ? "Resume" : "Pause", "", function () { m.paused = !m.paused; persistMock(); render(); }),
      btn("Next", "primary", mockNext),
      btn("Finish early", "", finishMock),
      btn("Reset mock", "danger", function () { state.mock = null; persistMock(); render(); }),
      state.recorder.supported ? btn(state.recorder.rec ? "Stop mic" : "Record mic", "", toggleMic) : el("span", { class: "muted" }, ["Microphone API not available; type instead."])
    ]));
    if (state.recorder.url) {
      sheet.appendChild(el("audio", { controls: true, src: state.recorder.url }));
    }
    return sheet;
  }

  function startMock() {
    const questions = pickMockQuestions();
    const per = state.store.prefs.mockSeconds || 180;
    const total = (state.store.prefs.mockTotal || 24) * 60;
    state.mock = {
      active: true,
      paused: false,
      review: false,
      questions: questions,
      index: 0,
      answers: {},
      qRemain: per,
      totalRemain: total,
      per: per
    };
    persistMock();
    render();
  }

  function mockNext() {
    if (!state.mock) return;
    if (state.mock.index >= state.mock.questions.length - 1) { finishMock(); return; }
    state.mock.index += 1;
    state.mock.qRemain = state.mock.per;
    persistMock();
    render();
  }

  function finishMock() {
    if (!state.mock) return;
    state.mock.active = false;
    state.mock.review = true;
    state.mock.finishedAt = Date.now();
    state.store.mockHistory.push({ at: state.mock.finishedAt, n: state.mock.questions.length });
    persistMock();
    stopMic(true);
    render();
  }

  function mockReview(m) {
    const box = el("div", {});
    box.appendChild(el("h2", {}, ["Review"]));
    box.appendChild(el("p", { class: "muted" }, ["Self-evaluate. There is no connected scoring model, so no AI score is shown."]));
    m.questions.forEach(function (q) {
      box.appendChild(el("article", { class: "card" }, [
        el("h3", {}, [q.id.toUpperCase() + " · " + q.question]),
        el("p", {}, [el("strong", {}, ["You wrote: "]), m.answers[q.id] || "(blank)"]),
        el("p", { class: "muted" }, ["Sample stays optional after the mock."]),
        btn("Open question card", "", function () { state.mock = null; persistMock(); go("#" + q.id); })
      ]));
    });
    return box;
  }

  async function toggleMic() {
    if (state.recorder.rec) { stopMic(false); render(); return; }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const rec = new MediaRecorder(stream);
      state.recorder.chunks = [];
      rec.ondataavailable = function (e) { if (e.data.size) state.recorder.chunks.push(e.data); };
      rec.onstop = function () {
        stream.getTracks().forEach(function (t) { t.stop(); });
        const blob = new Blob(state.recorder.chunks, { type: rec.mimeType || "audio/webm" });
        if (state.recorder.url) URL.revokeObjectURL(state.recorder.url);
        state.recorder.url = URL.createObjectURL(blob);
        render();
      };
      rec.start();
      state.recorder.rec = rec;
      render();
    } catch (e) {
      alert("Microphone permission was denied or failed. You can still type answers.");
    }
  }

  function stopMic(discard) {
    if (state.recorder.rec) {
      try { state.recorder.rec.stop(); } catch (e) {}
      state.recorder.rec = null;
    }
    if (discard && state.recorder.url) {
      URL.revokeObjectURL(state.recorder.url);
      state.recorder.url = null;
    }
  }

  function viewQuick() {
    const intro = qs("q1");
    const sheet = el("div", { class: "sheet" }, [
      el("div", { class: "page-head" }, [
        el("div", {}, [
          el("h1", {}, ["Quick review · 15 minutes"]),
          el("p", { class: "lede" }, ["Scan, don't memorize. Print this view if you want a paper sheet."])
        ])
      ]),
      el("p", { class: "disclaimer" }, ["Confirmed: ~24 minutes, recorded, four categories. Everything else here is practice."])
    ]);
    const grid = el("div", { class: "scan-grid" });
    grid.appendChild(scan("60–90s intro", intro.sample.split("\n\n").slice(0, 3).map(function (p) { return "• " + p; })));
    grid.appendChild(scan("Two debugging spines", [
      "Intermittent uploads: observe → weak-network repro → local persist → bounded retry.",
      "List load: telemetry first; don't paginate from a guess. Confirm the screen before naming it."
    ]));
    grid.appendChild(scan("Dart / Flutter", [
      "await ≠ new thread.",
      "Check mounted after async.",
      "Cancel subscriptions in dispose.",
      "GetX is the production SM; don't fake BLoC depth."
    ]));
    grid.appendChild(scan("Five high-risk pitfalls", M.pitfalls));
    grid.appendChild(scan("AI-training vocabulary", M.vocab.map(function (v) { return v.term + ": " + v.def; })));
    grid.appendChild(scan("Recovery phrases", M.recovery));
    grid.appendChild(scan("Useful English", M.phrases));
    grid.appendChild(scan("Honesty rails", [
      "18-month incident-free is a team/product outcome.",
      "Payment and field-sync labs are personal demos.",
      "No invented metrics or unconfirmed root causes."
    ]));
    sheet.appendChild(grid);
    return sheet;
  }

  function scan(title, lines) {
    const ul = el("ul", { class: "compact" });
    lines.forEach(function (l) { ul.appendChild(el("li", {}, [l.replace(/^• /, "")])); });
    return el("article", { class: "card scan-card" }, [el("h3", {}, [title]), ul]);
  }

  function copyText(text) {
    if (navigator.clipboard) navigator.clipboard.writeText(text);
  }

  function exportJson() {
    const blob = new Blob([JSON.stringify(state.store, null, 2)], { type: "application/json" });
    const a = el("a", { href: URL.createObjectURL(blob), download: "micro1-practice.json" });
    document.body.appendChild(a); a.click(); a.remove();
  }

  function importJson() {
    const input = el("input", { type: "file", accept: "application/json" });
    input.addEventListener("change", function () {
      const file = input.files && input.files[0];
      if (!file) return;
      const reader = new FileReader();
      reader.onload = function () {
        try {
          const parsed = JSON.parse(String(reader.result));
          state.store = Object.assign(defaultStore(), parsed);
          saveStore();
          render();
        } catch (e) { alert("Could not import that JSON."); }
      };
      reader.readAsText(file);
    });
    input.click();
  }

  function clearData() {
    if (!confirm("Erase local practice data on this browser?")) return;
    localStorage.removeItem(STORE_KEY);
    state.store = defaultStore();
    state.mock = null;
    render();
  }

  function onTick() {
    if (state.practiceTimer.running) {
      state.practiceTimer.remain -= 1;
      if (state.practiceTimer.remain <= 0) state.practiceTimer.running = false;
      setNav();
    }
    if (state.mock && state.mock.active && !state.mock.paused) {
      state.mock.qRemain -= 1;
      state.mock.totalRemain -= 1;
      if (state.mock.totalRemain <= 0) { finishMock(); return; }
      if (state.mock.qRemain <= 0) { mockNext(); return; }
      setNav();
      const status = document.getElementById("mockStatus");
      if (status && state.mock.questions[state.mock.index]) {
        const q = state.mock.questions[state.mock.index];
        status.textContent = "Question " + (state.mock.index + 1) + " of " + state.mock.questions.length +
          " · category: " + q.categoryLabel +
          " · question remaining " + fmt(state.mock.qRemain) +
          " · total remaining " + fmt(state.mock.totalRemain);
      }
      if (state.mock.totalRemain % 5 === 0) persistMock();
    }
  }

  function onKey(e) {
    if (e.target && (e.target.tagName === "TEXTAREA" || e.target.tagName === "INPUT" || e.target.tagName === "SELECT")) return;
    if (e.key === "?") {
      e.preventDefault();
      document.getElementById("help").hidden = !document.getElementById("help").hidden;
    }
    if (e.key === "f") {
      state.store.prefs.focus = !state.store.prefs.focus; saveStore(); setNav();
    }
    if (e.key === "n" && state.questionId) {
      const i = M.questions.findIndex(function (q) { return q.id === state.questionId; });
      if (i >= 0 && i < M.questions.length - 1) go("#" + M.questions[i + 1].id);
    }
    if (e.key === "p" && state.questionId) {
      const i = M.questions.findIndex(function (q) { return q.id === state.questionId; });
      if (i > 0) go("#" + M.questions[i - 1].id);
    }
  }

  document.getElementById("helpClose").addEventListener("click", function () {
    document.getElementById("help").hidden = true;
  });
  document.getElementById("focusToggle").addEventListener("click", function () {
    state.store.prefs.focus = !state.store.prefs.focus; saveStore(); setNav();
  });
  window.addEventListener("hashchange", render);
  window.addEventListener("keydown", onKey);
  setInterval(onTick, 1000);
  render();
})();
