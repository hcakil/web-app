# REPO_AUDIT.md

Read-only audit of `pro_app` (`pro-appv2.0`).
Date: 2026-07-29. Mode: analysis only, no files modified.

Every finding is tagged `FACT` (directly observable in the repository), `INFERENCE`
(reasoned from facts), or `ASSUMPTION` (not verifiable from the repository).

Scope note: `.env` was intentionally **not opened**. Secrets, credentials and customer
data were not read. `build/`, `node_modules/` and generated artifacts were excluded.

---

## 1. Executive summary

`FACT` — The application is a mature, actively maintained Flutter codebase: 558 Dart files
and ~56,000 lines under `lib/`, 207 test files and ~45,600 lines under `test/`, plus a large
Gherkin-driven integration suite under `integration_test/`. `coverage/lcov.info` (generated
2026-07-23) reports 17,257 of 21,528 lines hit across 467 files, i.e. **80.2 % line coverage**.

`FACT` — The environment is current: `ci/azure-pipelines.yml:36` and `codemagic.yaml:11` both
pin Flutter `3.35.7`, and `pubspec.lock` resolves against `flutter >=3.35.7`, `dart >=3.9.2`.
`pubspec.yaml:11` declares `sdk: ">=3.8.0 <4.0.0"`.

`INFERENCE` — There is **no repository evidence that a Flutter upgrade is needed**. The
project already runs the pinned stable version, and CI and lockfile agree. Per the audit
rules, no upgrade is recommended. What the repository *does* show is the surface that any
future upgrade would have to cross: eight `git` dependencies, five of them internal Azure
DevOps packages pinned to tags, two of them personal GitHub forks, and several exact version
pins (see §5, R9).

`FACT` — GetX is present but is **not** used as an application architecture. It is used
overwhelmingly as a service locator (`Get.find` 337 occurrences, `Get.isRegistered` 180,
`Get.put` 174, `Get.delete` 25) plus reactive primitives (`.obs` 74, `Obx` 62, `RxBool` 43).
Only 20 classes extend `GetxController` and `GetBuilder` appears once, while `setState`
appears 85 times across ~50 `State<...>` classes. Routing is Fluro, not GetX
(`router.define` 23, `router.navigateTo` 26, `Navigator.*` 31, `Get.back` 15).

`INFERENCE` — Therefore a "GetX → BLoC migration" is not one migration. It is at least three
separable decisions: (a) replace the service locator, (b) replace `Rx` reactivity,
(c) unify navigation. They have different costs and can be sequenced independently. No
recommendation is made here, because the repository contains no measured pain data (see §6).

`FACT` — The single highest-severity finding is unrelated to any migration:
`lib/services/api/api_service.dart:41-45` installs an `HttpClient` whose
`badCertificateCallback` returns `true` unconditionally, in every build mode.

`FACT` — Web is not scaffolded at all: the repository contains `android/` and `ios/` only.
There is no `web/`, `macos/`, `windows/` or `linux/` directory.

---

## 2. Architecture map

`FACT` — Top-level layout under `lib/`:

```
lib/
  main.dart              app entry + service registration
  main_mocks.dart        alternate entry for mock/E2E runs
  app.dart               ProApp widget, GetMaterialApp + Fluro router wiring
  config/                AppConfig (dotenv-backed), FirebaseConfig, test_keys.dart
  routes/                routes.dart (23 route constants), route_handlers.dart
  screens/               25 feature folders (home, order_details, request_addon_v2, ...)
  services/              38 service folders (api, auth, firestore, work_order, ...)
  states/                shared_state.dart, i_shared_state.dart, providers/ (5 providers)
  shared/                controllers, extensions, helpers, widgets
  models/                crm/, dto/, price_sheet/ (+ generated .g.dart)
  widgets/               cross-feature widgets
  candidates/            4 files: widgets staged for promotion to rr_ui_kit
  mocks/                 36 mock implementations + endpoints/ + states/
  generated/             codegen_loader.g.dart (localization)
  themes/, utils/, integration_test/
```

`FACT` — Initialization order in `lib/main.dart:42-91`: `AppConfig().load()` →
optional `SemanticsBinding` → `Hive.initFlutter()` → `RiveNative.init()` →
`EasyLocalization.ensureInitialized()` → `AppConfig().load()` again →
`initProAppFirebase()` → `initDateVerseApp()` → `initServices()` → `loadFontFamily()` →
`runApp`, wrapped in `runWithTelemetry` only when `kReleaseMode` (`main.dart:86-90`).

`FACT` — Two Firebase apps are initialized: the default app (`main.dart:93-96`) and a named
app `dataverse-firestore` (`main.dart:98-104`) configured from
`lib/config/firebase_dataverse_options_{prod,sandbox,staging,testing}.dart`.

`FACT` — Shared code comes from five internal Azure DevOps packages pinned by tag in
`pubspec.yaml:97-121`: `rr_telemetry` v2.2.0, `rr_ui_kit` v2.87.0, `rr_test_tools`
v5.0.0-rc.8, `rr_mock_server` v1.8.0, `rr_utils` v2.4.0. `pubspec.yaml:13-14` declares a
pub workspace containing `widgetbook`.

`INFERENCE` — The layering is conventional and consistent: widget → screen state → service →
transport. Services are grouped by domain, not by technical type, which keeps feature work
local. `lib/candidates/` acting as a staging area before promotion into `rr_ui_kit` is a
deliberate and healthy mechanism.

---

## 3. Data-flow map

`FACT` — Two independent inbound data paths exist.

**Path A — REST/OData over Dio.**
`lib/services/api/api_service.dart` owns a single `Dio` instance
(`api_service.dart:23`), base URL selected from `AppConfig.useMockServer` at
`api_service.dart:34`. Interceptor chain is installed in `initInterceptors`
(`api_service.dart:87-95`) in this order: `CookieManager(PersistCookieJar)` →
`AuthInterceptor` → `RequestTrackInterceptor` → `RequestReplyInterceptor`.
`initInterceptors` is invoked from `lib/services/auth/auth_service.dart:81` and
`lib/services/api/rent_ready_api_service.dart:50`, i.e. after authentication is set up, not
in `main.dart`.

`FACT` — Generic verbs are exposed as `find`, `findQuery`, `update`, `create`
(`api_service.dart:102-129`). Domain services build on this; e.g.
`lib/services/vendors/vendors_service.dart:44-80` composes an `ApiConnectionPath`, calls
`_rrApiService.post(...)`, parses via `ApiResponseModel.fromJson`, and returns
`ApiResultSuccess<T>` or `ApiResultError<T>`.

`FACT` — The `ApiResult` family (`lib/models/api_result.dart`, consumed e.g. at
`vendors_service.dart:74-80` and `lib/screens/home/pro_app_state.dart:88`) gives the codebase a
uniform success/error return type instead of throwing across layers.

**Path B — Firestore streams.**
`lib/services/firestore/` plus `firestore_collection_service.dart` feed screen states
directly. `pro_app_state.dart:69-71` holds `StreamSubscription? _$bookableResourceBookings`,
`_$onNotificationMessage`, and a `Map<String, StreamSubscription> _$workOrderServiceTasks`.

`FACT` — Background/heavy work uses `squadron` isolates (`pubspec.yaml:42`) via the
`*_store_service_async.dart` services (e.g. `lib/services/work_order/work_order_store_service_async.dart`,
585 lines) and `squadron_builder` codegen in `dev_dependencies`.

`FACT` — Local persistence is Hive 2 (`pubspec.yaml:77-79`: `hive ^2.2.3`,
`hive_flutter ^1.1.0`, `hive_ui 1.0.14`), initialized at `main.dart:52`. Secrets/session data
use `flutter_secure_storage` through `lib/services/local_storage/local_storage.dart` and
`lib/services/auth/auth_storage_service.dart` (read back in `main.dart:194-198`).

`FACT` — Error reporting is centralized: `main.dart:202-203` installs
`FlutterError.onError = telemetryService.onFlutterError` and wraps `runApp` in
`runZonedGuarded`; `api_service.dart:58-85` forwards `DioException`s to
`AppTelemetryService.error(...)`.

---

## 4. State-management map

`FACT` — Measured usage across `lib/`:

| Mechanism | Count | Evidence |
|---|---|---|
| `Get.find` | 337 | service resolution throughout `lib/` |
| `Get.isRegistered` | 180 | conditional self-registration guards |
| `Get.put` / `putAsync` | 174 | `main.dart:115-155` and ad-hoc call sites |
| `Get.delete` | 25 | teardown paths |
| `setState` | 85 | ~50 `State<...>` classes under `lib/screens` |
| `.obs` | 74 | screen state fields |
| `Obx` | 62 | reactive widget subtrees |
| `RxBool` / `Rx<>` / `RxList` / `RxString` / `RxMap` / `RxInt` | 43 / 35 / 20 / 14 / 5 / 2 | screen states |
| `GetxController` subclasses | 20 | e.g. `pro_app_state.dart:64` |
| `GetBuilder` | 1 | single occurrence |
| `ValueNotifier` / `ChangeNotifier` | 2 / 1 | isolated |

`FACT` — The canonical pattern is a `*_state.dart` class extending `GetxController`, holding
`Rx` fields, registered through `Get`, and consumed by a `StatefulWidget` screen that also
uses `setState` for local widget concerns. Example: `lib/screens/home/pro_app_state.dart`
(1,222 lines, `GetxController`, ~30 `Rx` fields at lines 82-125).

`FACT` — Dependency injection is a global service locator with three distinct registration
styles coexisting:

1. Explicit eager registration in `main.dart:115-155` (`Get.put`, `await Get.putAsync`).
2. Constructor-level fallback, e.g. `vendors_service.dart:36-38`
   (`Get.isRegistered<T>() ? Get.find<T>() : Get.put(T())`).
3. Static field resolution at class-load time, e.g. `api_service.dart:19-21`
   (`static final AppTelemetryService _telemetryService = Get.isRegistered... ? ... : Get.put(...)`)
   and `pro_app_state.dart:78-80` for `AnnounceService`.

`INFERENCE` — Style 3 is the problematic one: the dependency graph is resolved as a side
effect of class loading, so registration order becomes implicit and static state survives
between tests within the same isolate.

`FACT` — Navigation runs on three mechanisms simultaneously:
`app.dart:41-52` builds a `GetMaterialApp` with `navigatorKey: Get.key` but delegates route
generation to Fluro (`onGenerateRoute: router.generator`); `lib/routes/routes.dart:39-68`
defines 22 routes; call sites use `router.navigateTo` (26), raw `Navigator.*` (31), and
`Get.back` (15) / `Get.offNamedUntil` (1) / `Get.offAllNamed` (1).

`FACT` — Error, loading and empty-state handling is convention-based rather than a shared
type: `isLoading` appears 109 times, `Skeleton*` 21, `CircularProgressIndicator` 10,
`retry`/`Retry` 61/33, `on DioException` 35, `try {` 143, `} catch` 106, `rethrow` 24. There
is no `EmptyState`/`emptyState` abstraction anywhere in `lib/` (0 occurrences). Error
presentation is centralized in `lib/states/providers/error_handling_provider.dart:17-42`,
which also carries an explicit test seam (`testableContext`, lines 8-15).

---

## 5. Confirmed technical risks

Ordered by severity. Every item has file-level evidence.

### R1 — Unconditional TLS certificate acceptance in all build modes — `FACT`, high

`lib/services/api/api_service.dart:41-45`:

```41:45:lib/services/api/api_service.dart
    (dio.httpClientAdapter as IOHttpClientAdapter).createHttpClient = () {
      final client = HttpClient();
      client.badCertificateCallback = (X509Certificate cert, String host, int port) => true;
      return client;
    };
```

`FACT` — This is the only occurrence of `badCertificateCallback` in the repository, it is set
inside `ApiService.init()`, and it is not guarded by `kDebugMode`, `AppConfig.environment`, or
`useMockServer`. `main.dart:131` calls `ApiService().init()` unconditionally.
`INFERENCE` — Every HTTPS call made through this `Dio` instance, in production builds, accepts
any certificate, including self-signed ones presented by an interception proxy.
`ASSUMPTION` — This was most likely introduced to make the local mock server
(`rr_mock_server`) or a staging endpoint reachable. That intent cannot be confirmed from the
repository.

### R2 — Controller instances leaked on widget update — `FACT`, medium

`lib/screens/request_addon_v2/content/request_addon_form.dart:92-100` defines a **getter that
constructs a new controller on every access**:

```92:100:lib/screens/request_addon_v2/content/request_addon_form.dart
  RequestAddonPhotoController get requestAddonPhotoController {
    var controller = RequestAddonPhotoController(
      requestAddon: widget.requestAddon,
      onLoadingStageChange: widget.onLoadingStageChange,
    );
    return controller;
  }

  PhotoPickerController get photoPicker => requestAddonPhotoController;
```

`FACT` — `photoPicker` is read in `initState` (line 139) and again in `didUpdateWidget`
(line 176), so a second `RequestAddonPhotoController` is created and assigned whenever the
addon id changes. `didUpdateWidget` (lines 174-212) also reassigns
`descriptionController`, `customNameController` and `customPriceController` to fresh
`TextEditingController` instances (lines 186-193) without disposing the previous ones.
`dispose()` (lines 215-219) disposes only whatever instances are current at teardown.
`INFERENCE` — Each addon switch orphans one photo controller and three text controllers,
together with the listeners attached at lines 187, 194-206. `ASSUMPTION` — The user-visible
impact (memory growth, duplicated callbacks firing) has not been measured.

`FACT` — The same block duplicates `initState` logic with a **divergent** implementation: in
`initState` the price listener delegates to the `customAddonPrice` getter (line 169, which
uses `double.tryParse(text.replaceAll('$',''))` at lines 102-103), whereas in
`didUpdateWidget` the same parsing is re-implemented inline (lines 197-206). Two code paths
now compute the same value.

### R3 — Two parallel copies of the Request Addon feature — `FACT`, medium

`FACT` — `lib/screens/request_addon_v2/` (2,294 lines) and
`lib/screens/request_addon_bundled/` (1,910 lines) contain the same file set. Comparing them
file by file:

| File | Status |
|---|---|
| `type_of_work_select_screen.dart` | byte-identical |
| `content/amount_input.dart` | byte-identical |
| `content/currency_input_formatter.dart` | byte-identical |
| `content/type_of_work.dart` | differs by 2 lines |
| `controller/request_addon_photo_controller.dart` | differs by 33 lines |
| `content/request_addon_form.dart` | differs by 257 lines |

`INFERENCE` — Any defect in the three identical files, and most defects in
`type_of_work.dart`, must be fixed twice. R2 above lives in the file with the largest
divergence, so the two trees are already drifting.
`ASSUMPTION` — Whether `request_addon_bundled` is still reachable in production, or is
retained behind a feature flag pending removal, is not determinable from the repository.

### R4 — Test doubles are production dependencies — `FACT`, medium

`FACT` — `pubspec.yaml` lists under `dependencies:` (not `dev_dependencies:`)
`fake_cloud_firestore ^4.0.0` (line 29), `firebase_auth_mocks ^0.15.0` (line 30) and
`mocktail ^1.0.5` (line 39). Consistently, `lib/mocks/` contains 36 mock implementations and
`lib/main_mocks.dart` is a second application entry point.
`INFERENCE` — This is deliberate: the mock harness is compiled into an app binary so that
Gherkin E2E suites can run against a real build. The cost is that mock code and mocking
libraries are inside the dependency graph of the shipping app.
`ASSUMPTION` — Whether release flavors actually tree-shake `lib/mocks` away, and the resulting
binary-size delta, is not measurable from source alone.

### R5 — Service-locator resolution during class initialization — `FACT`, medium (testability)

`FACT` — `api_service.dart:19-21` resolves `AppTelemetryService` into a `static final` field.
`pro_app_state.dart:78-80` does the same for `AnnounceService`. 180 `Get.isRegistered` guards
across `lib/` implement the same "resolve or self-register" fallback.
`INFERENCE` — Object graph construction is order-dependent and partly invisible at call
sites; static fields persist across tests in one isolate, which is why test setup must
pre-register services (visible in `test/services/auth_service_test.dart:38` and
`test/screens/pro_app_state_test.dart:151`).

### R6 — Dependency pinning and override tension — `FACT`, medium (upgrade friction)

`FACT` — `pubspec.yaml:67` requires `uuid: ^4.1.0` while `pubspec.yaml:156` overrides it to
`uuid: ^3.0.7`, i.e. the override contradicts the declared constraint.
`FACT` — `pubspec.yaml:157-158` pins `connectivity_plus: '>=7.0.0 <7.1.0'` with the inline
reason "connectivity_plus 7.1.x uses NWPath.isUltraConstrained (iOS 26 SDK); pin below 7.1
for Xcode 16.x" — a toolchain-driven pin on a package that is not a direct dependency.
`FACT` — Exact (non-caret) pins: `flutter_inappwebview 6.1.5` (line 49), `geolocator 14.0.2`
(59), `rive 0.14.5` (62), `meta 1.16.0` (72), `path 1.9.1` (83), `hive_ui 1.0.14` (79),
`squadron_builder 9.2.0` (144), `gherkin 3.1.0` (146), `test_api 0.7.11` (155).
`FACT` — Eight `git` dependencies: five internal Azure DevOps packages pinned to tags
(lines 97-121), `sliding_up_panel` and `flutter_zoom_sdk` from the `rentready` org
(lines 90-95), `skeletons` from the personal fork `alexander-ts/skeletons` (lines 87-89), and
`hive_generator` pinned to commit `a60998f` on the personal fork `alexander-ts/hive_generator`
(lines 140-143). `pubspec.lock` resolves 306 packages.
`INFERENCE` — These are the concrete constraints any future Flutter or dependency upgrade
would have to clear. Two of them sit on personal accounts outside organizational control.

### R7 — Three navigation mechanisms in parallel — `FACT`, medium

Evidence in §4. `INFERENCE` — Route-level concerns (guards, deep links, analytics,
back-stack behaviour) have to be implemented in three places; this is also the single largest
structural obstacle to a web adaptation, where URL-addressable routing is expected.

### R8 — Route constant declared, referenced, never registered — `FACT`, low

`FACT` — `lib/routes/routes.dart:23` declares `typeOfWorkSelect = '/type-of-work-select'`.
`defineRoutes` (lines 39-68) registers 22 routes and does **not** register it.
`lib/services/dynamic_status_bar/dynamic_status_bar_service.dart:13` maps
`Routes.typeOfWorkSelect` to `Brightness.light`.
`INFERENCE` — The status-bar map contains an entry for a route Fluro cannot generate; either
the screen (`lib/screens/request_addon_v2/type_of_work_select_screen.dart`) is pushed by other
means, or that brightness rule is dead configuration.

### R9 — Duplicated and no-op initialization — `FACT`, low

`FACT` — `await AppConfig().load()` is called twice in `main`, at `main.dart:45` and
`main.dart:56`. `FACT` — `app.dart:39-63` wraps the whole app in
`FutureBuilder(builder: ..., future: null)`; with a null future the builder resolves
immediately and the `FutureBuilder` adds no behaviour.

### R10 — Every HTTP response error is reported as fatal — `FACT`, low

`FACT` — `api_service.dart:70-81`: when `err.response != null`, telemetry is sent with
`isFatal: true`; only transport-level failures use `isFatal: false` (line 83).
`INFERENCE` — Expected 4xx responses (validation, 401 before refresh, 404) are recorded with
the same severity as crashes, which reduces the signal value of fatal-error dashboards.
`FACT` — The same handler logs full request data (`api_service.dart:55`, `79`), so request
bodies reach logs and telemetry properties.

### R11 — `.env` is bundled as an application asset — `FACT`, needs a policy decision

`FACT` — `pubspec.yaml:176` lists `.env` in `flutter: assets:`. `flutter_dotenv` requires
this. Keys read from it in code include `API_URL`, `USE_MOCK_SERVER`, `TEST_TOKEN_URL`,
`TEST_OAUTH2_TOKEN`, `USE_SEMANTICS` (`lib/config/config.dart:23-67`), `FEATURE_FLAG_KEY`
(`lib/services/feature_flag/feature_flag_service.dart:113`) and `APP_INSIGHT_KEY`
(`lib/services/telemetry/app_telemetry_service.dart:25`).
`INFERENCE` — Anything present in a bundled asset is extractable from a distributed IPA/APK;
this is inherent to `flutter_dotenv`, not a coding defect.
`ASSUMPTION` — The file's contents were not read, so whether any of these values are
genuinely sensitive is unknown. This is a question for the team, not a code change.

---

## 6. Assumptions requiring measurement

These are explicitly **not** presented as problems. No repository evidence establishes user
impact for any of them.

`ASSUMPTION` — **`ProAppState` size and rebuild cost.** `lib/screens/home/pro_app_state.dart`
is 1,222 lines with ~30 `Rx` fields (lines 82-125), a manual pricing cache (line 102), three
stream subscription holders (lines 69-71) and multiple controllers. Large surface area is a
fact; excessive rebuilds are not. Measurement needed: widget rebuild counts per `Obx` scope
and frame timings on the home screen under a realistic work-order list.

`ASSUMPTION` — **Three-minute network timeouts.**
`api_service.dart:29-30` sets both `connectTimeout` and `receiveTimeout` to
`60000 * 3` ms (180 s). Whether users hit these, and what they see while waiting, is
unmeasured. Measurement needed: p95/p99 request duration and timeout counts from existing
telemetry.

`ASSUMPTION` — **Benefit of a state-management change.** The repository shows a hybrid
approach (§4) but contains no defect log, no rebuild profile, and no test-difficulty record
that quantifies the cost of the current arrangement. Measurement needed before any decision:
per-incident classification of state-related defects over a fixed window, and the observed
cost of writing tests for `GetxController`-based states versus plain ones.

`ASSUMPTION` — **Coverage quality.** 80.2 % is a real number, but `coverage/lcov.info` is
dated 2026-07-23 and coverage says nothing about assertion strength. Measurement needed:
regenerate on the current HEAD and inspect which of the largest files (§ list below) are
covered.

`ASSUMPTION` — **Largest files by line count** (`lib/`), offered as a map, not as a verdict:
`screens/home/pro_app_state.dart` 1,222; `screens/connectivity_test_screen/connectivity_test_screen.dart`
1,182; `screens/order_details/order_details_state.dart` 1,004; `generated/codegen_loader.g.dart`
984; `screens/order_details/contents/work_summary.dart` 939;
`screens/request_addon_v2/request_addon_v2_screen_state.dart` 909;
`screens/home/widget/details_panel.dart` 875.

`ASSUMPTION` — **Web adaptation scope.** Stated as undefined by the product owner. Nothing in
the repository defines target platforms, breakpoints, or which flows must work on web.

---

## 7. Web-readiness observations

`FACT` — No web platform folder exists. `ls` at repository root shows `android/` and `ios/`
only; `web/`, `macos/`, `windows/`, `linux/` are absent. A web build is therefore not
currently possible without scaffolding.

`FACT` — Hard `dart:io` coupling: 19 files under `lib/` import `dart:io`, including a UI file
(`lib/screens/request_addon_v2/content/request_addon_form.dart:1`). 13 files reference
`Platform.isIOS` / `Platform.isAndroid` / `Platform.operatingSystem`. `kIsWeb` appears only 8
times in the entire `lib/` tree.

`FACT` — Two initialization paths would fail on web as written:
`api_service.dart:41` casts `dio.httpClientAdapter` to `IOHttpClientAdapter` (an IO-only
type), and `api_service.dart:88-89` builds a `PersistCookieJar` over
`FileStorage(getTemporaryDirectory().path)` via `path_provider`.

`FACT` — `main.dart:53` calls `RiveNative.init()`; `main.dart:68-71` calls
`SystemChrome.setPreferredOrientations([portraitUp, portraitDown])`.
`INFERENCE` — A portrait-locked, native-Rive-initialized entry point is not a meaningful web
entry point; the entry sequence would need platform branching.

`FACT` — Viewport is captured once at construction:
`pro_app_state.dart:108-110` computes `headerHomeScreenSize` from
`MediaQueryData.fromView(PlatformDispatcher.instance.views.first).padding.top` and
`GetSizeUtil.height()` in a field initializer.
`INFERENCE` — On mobile this is acceptable because the viewport is effectively static; on web
the window is resizable, so values derived this way will not update.

`INFERENCE` — Dependencies that are likely to require a web-specific replacement or
conditional import, based on their platform scope: `flutter_zoom_sdk` (git),
`dart_ping_ios`, `android_id`, `permission_handler`, `flutter_local_notifications`,
`background_downloader`, `device_info_plus`, `path_provider`, `flutter_secure_storage`,
`flutter_inappwebview`. This list is an inference from package identity, not verified against
each package's declared platform support.

`FACT` — Routing is Fluro plus imperative `Navigator` calls (§4, R7).
`INFERENCE` — URL-addressable, deep-linkable routing is the largest structural work item for
any web adaptation, larger than widget-level responsiveness.

`FACT` — `squadron` isolates back the `*_store_service_async` services.
`ASSUMPTION` — Whether the existing squadron workers run under web workers unmodified is not
determinable from this repository.

---

## 8. Testability observations

`FACT` — The test base is substantial and well organized: 207 files / ~45,600 lines under
`test/`, mirroring source structure (`test/screens/`, `test/services/`, `test/states/`,
`test/models/`, `test/widgets/`, `test/shared/`, `test/utils/`). `integration_test/`
holds ~25 Gherkin suite files with generated `.g.dart` companions, plus `features/`,
`steps/`, `worlds/`, `hooks/`, `config/`. A separate Python-based harness lives in `e2e/`.

`FACT` — Measured coverage: 17,257 / 21,528 lines, 467 files, **80.2 %**
(`coverage/lcov.info`, 2026-07-23). `coverage/acceptance_report.json` also exists.

`FACT` — Deliberate test seams already exist: `Routes.setTestRouter` annotated
`@visibleForTesting` (`routes.dart:10-13`), `ErrorHandlingProvider.testableContext`
(`error_handling_provider.dart:8-15`), `AppTestParams` threaded through `main`, `ProApp` and
`initServices` (`main.dart:42`, `106-156`; `app.dart:16-33`), emulator switches for Firestore
and Auth (`main.dart:109-121`, `137-143`), and a mock server toggle (`api_service.dart:34`).

`FACT` — Resource cleanup is disciplined: `dispose()` appears 99 times and `onClose()` 24
times. Of the 14 files under `lib/` that declare a `StreamSubscription`, 12 call `cancel()`;
the two that do not are `lib/mocks/api_service_mock.dart` and
`lib/mocks/firebase_messaging_mock.dart`.
`INFERENCE` — Unmanaged stream subscriptions are therefore **not** a confirmed risk in
production code.

`FACT` — The main friction is the one described in R5: static and self-registering locator
usage forces tests to pre-populate `Get`. Visible in `test/services/auth_service_test.dart:38`
and `test/screens/pro_app_state_test.dart:151`, which stub `apiServiceMock.initInterceptors()`
before exercising unrelated behaviour.

`FACT` — `analysis_options.yaml` includes `package:flutter_lints/flutter.yaml`
(`flutter_lints ^6.0.0`), excludes generated files, and fixes formatting at
`page_width: 120` with `trailing_commas: preserve`. `lefthook.yml` and
`sonar-project.properties` are present at root.

---

## 9. Areas that should remain unchanged

Each of these works, has evidence of care, and would lose value if disturbed.

`FACT` — **Test and E2E infrastructure.** The Gherkin suites, `rr_test_tools`,
`rr_mock_server`, `lib/mocks` harness and `main_mocks.dart` entry point together produce 80 %
measured coverage on a 56k-line app. Do not restructure this to satisfy a dependency-hygiene
preference; R4 is a packaging observation, not a mandate.

`FACT` — **`ApiResult` result types.** `ApiResultSuccess` / `ApiResultError`
(`lib/models/api_result.dart`, used at `vendors_service.dart:74-80`) already give the codebase
a uniform, non-throwing error contract. No replacement is needed.

`FACT` — **Telemetry wiring.** `runWithTelemetry` (`main.dart:172-207`) with
`FlutterError.onError` plus `runZonedGuarded`, on-demand user properties, and
`rr_telemetry` integration is a correct and complete crash-reporting setup. Only the severity
classification in R10 is worth revisiting.

`FACT` — **Dio interceptor chain.** Cookie → auth → tracking → reply-cache ordering
(`api_service.dart:91-94`) is coherent, and deferring `initInterceptors` until auth setup
(`auth_service.dart:81`) is intentional. Leave the ordering alone.

`FACT` — **Stream and controller disposal outside R2.** 12 of 14 subscription-holding files
cancel correctly; 99 `dispose()` implementations exist. No sweeping lifecycle refactor is
justified.

`FACT` — **Fluro route table.** 22 routes centralized in one file with handler separation
(`routes.dart`, `route_handlers.dart`). R7 is about *three* mechanisms coexisting, not about
Fluro being wrong. Do not replace Fluro on its own.

`FACT` — **CI and toolchain pinning.** `ci/azure-pipelines.yml:36` and `codemagic.yaml:11`
both pin Flutter `3.35.7`, consistent with `pubspec.lock`. There is no version drift to fix.

`FACT` — **Dual Firebase app setup** (`main.dart:93-104`) and the per-environment
`firebase_dataverse_options_*.dart` files. This is an intentional design for the
Dataverse-backed Firestore project.

`FACT` — **Localization.** `easy_localization` with `generated/codegen_loader.g.dart`,
`LocalizationService`, and `assets/translations/`. Working and conventional.

`FACT` — **`lib/candidates/` staging convention.** Four files awaiting promotion to
`rr_ui_kit`. This is a useful mechanism; do not collapse it into `lib/widgets`.

`FACT` — **Domain-oriented service folders.** 38 folders under `lib/services/` grouped by
business domain rather than technical layer. This keeps feature changes local and should be
preserved by any future architectural work.

---

## 10. Candidate improvements (at most three)

Exactly three, ordered by evidence strength and by how contained the change is. None is
implemented.

### Candidate 1 — Scope the TLS certificate bypass to non-production configurations

**Repository evidence** — `lib/services/api/api_service.dart:41-45`, the only
`badCertificateCallback` in the repository, set inside `ApiService.init()` which
`main.dart:131` always calls. No guard on `kDebugMode`, `kReleaseMode`,
`AppConfig.environment` or `AppConfig.useMockServer`, although
`api_service.dart:34` already branches on `useMockServer` for the base URL, and
`main.dart:86-90`, `main.dart:127-128` show the codebase does distinguish release mode
elsewhere.

**Actual problem** — Production traffic accepts any TLS certificate, so a machine-in-the-
middle with a self-signed certificate can read and modify requests and responses, including
authenticated ones. This affects a live application handling work orders, payouts and
customer property data.

**Expected benefit** — Restores certificate validation on production traffic while keeping
whatever local/mock workflow motivated the override. No user-facing behaviour change on
correctly configured endpoints.

**Estimated implementation scope** — Small. One file, roughly 5-10 lines: gate the
`createHttpClient` assignment behind the existing configuration flags. Plus one added unit
test asserting the callback is absent under production configuration. 2-4 hours including
verification against staging and mock-server runs.

**Risk** — Medium and concentrated in discovery, not in code: if a staging or mock endpoint
currently relies on an invalid certificate, that environment will start failing. This must be
verified per environment before merge, and the mock-server E2E suites must be re-run.

**How success would be measured** — (a) A test proves the callback is not installed when the
production configuration is active; (b) the full Gherkin E2E suite passes against the mock
server with the override still enabled there; (c) staging and production smoke runs show no
increase in `DioException` counts in telemetry over a defined observation window.

### Candidate 2 — Fix controller lifecycle and de-duplicate `didUpdateWidget` in `request_addon_form.dart`

**Repository evidence** — `lib/screens/request_addon_v2/content/request_addon_form.dart`:
lines 92-100 (getter constructing a new `RequestAddonPhotoController` per access), 139 and
176 (both read `photoPicker`), 186-193 (three `TextEditingController`s reassigned without
disposal), 187 and 194-206 (listeners reattached), 215-219 (`dispose` covers only current
instances), 102-103 versus 197-206 (the same price parsing implemented twice).

**Actual problem** — Two concrete defects, not a style preference. First, switching the addon
orphans four controllers and their listeners on every update, so callbacks can fire from
detached controllers. Second, price parsing exists in two divergent implementations, so a fix
applied to one path silently misses the other — and this file is already the most divergent
one between the two addon trees (R3).

**Expected benefit** — Deterministic controller lifecycle, one price-parsing path, and a
noticeably smaller surface for the class of bug where a stale listener writes into current
state.

**Estimated implementation scope** — Small and contained. One file: convert the getter to a
stored field created in `initState`, dispose superseded controllers before reassignment, and
extract the shared listener setup into one private method used by both `initState` and
`didUpdateWidget`. 4-8 hours including widget tests.

**Risk** — Medium. This is a live form in a revenue-relevant flow, and `didUpdateWidget`
timing is subtle: disposing a controller that is still referenced by a pending
`addPostFrameCallback` (lines 119-131) would throw. Mitigation is a widget test that
exercises an addon switch with in-flight text edits. Note `test/screens/request_addon_v2/`
already exists as a home for these tests.

**How success would be measured** — (a) A widget test switches `requestAddon.id` several
times and asserts old controllers are disposed and callbacks fire exactly once per change;
(b) the `request_addon` Gherkin steps (`integration_test/steps/request_addon.steps.dart`)
still pass; (c) coverage for this file in a regenerated `lcov.info` does not decrease.

### Candidate 3 — Decide the fate of `request_addon_bundled`, then unify the shared files

**Repository evidence** — File-by-file comparison in R3: `type_of_work_select_screen.dart`,
`content/amount_input.dart` and `content/currency_input_formatter.dart` are byte-identical
across `lib/screens/request_addon_v2/` and `lib/screens/request_addon_bundled/`;
`content/type_of_work.dart` differs by 2 lines; `controller/request_addon_photo_controller.dart`
by 33; `content/request_addon_form.dart` by 257. Combined size 4,204 lines.

**Actual problem** — Three files must be edited twice for every change, and a fourth differs
by two lines, which is the classic state just before an accidental divergence. Candidate 2's
defect exists in the tree that has already drifted the most, which demonstrates the cost is
already being paid.

**Expected benefit** — Halves the edit surface for the shared parts of this feature and
removes a whole class of "fixed in v2, still broken in bundled" defects.

**Estimated implementation scope** — Medium, and explicitly two-staged. Stage one is a
decision, not code: determine whether `request_addon_bundled` is still reachable in
production (a feature-flag and telemetry question, since the repository cannot answer it).
Stage two, if both trees must stay, is to extract the three identical files plus
`type_of_work.dart` into one shared location and delete the copies: roughly 1-2 days
including test updates. If `bundled` turns out to be dead, deletion is far cheaper than
extraction.

**Risk** — Medium to high, and mostly informational: acting before the stage-one decision
risks either deleting a live flow or investing in extraction for code that should simply be
removed. Also, the two `type_of_work.dart` copies differ by 2 lines — those 2 lines must be
understood, not merged away, because they may encode a real behavioural difference between
the bundled and v2 flows.

**How success would be measured** — (a) Duplicate-file count between the two directories
drops from 3 identical plus 1 near-identical to 0; (b) total lines in the two directories drop
measurably from 4,204; (c) both flows' Gherkin suites pass unchanged; (d) over a following
observation window, no defect requires the same fix in both trees.

---

### Explicitly not proposed

`INFERENCE` — Not proposed, and why: no Flutter upgrade (R-none; the project is on the pinned
current stable and no evidence of an upgrade need exists); no state-management migration
(the required pain measurement does not exist yet — see §6); no `ProAppState` refactor (size
is a fact, cost is not measured); no move of test doubles out of `dependencies` (R4 — the
mock harness depends on them being there, so this needs a build-flavor decision first, not a
dependency edit); no `.env` change (R11 — contents unread, this is a policy question);
no web scaffolding (scope undefined by the product owner). The low-severity items R8, R9 and
R10 are real but too small to occupy one of three slots; they are suitable as opportunistic
fixes inside unrelated work.

---

I have completed a read-only audit. I will not change code until one candidate improvement is explicitly selected.
