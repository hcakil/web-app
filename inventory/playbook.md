# Stage 1 — Hardcoded secrets and IDs inventory

**Audience:** an agent or developer executing **Stage 1 only**.  
**Do not** implement Pulumi `config set --secret`, do not change `generate-env.js` wiring, do not build a secrets API, do not rotate keys, do not rewrite git history, do not `pulumi destroy`.

**Goal:** for each listed repo, produce a **redacted inventory table**. After all four repos are done, merge into one master table.

**Order:** QC App first, then Pro App, then Portal, then pro-app-api.

---

## 0. Context (why this exists)

Team plan (Andrey):

1. Find hardcoded secrets, IDs, keys in source (`.dart`, `.js`, `.ts`, plus env generators).
2. Move them into Pulumi secrets (**Stage 2**, later).
3. Later: secrets API + CLI (`--show-secret`) for `generate:env` (**Stage 3**, later).

Pulumi is an **intermediate** store. Firebase Auth is **not** in use; backend is `dataverse-firestore-api`. Dart-define (YAML `.env` → JSON) is a **parallel** task; Stage 1 still inventories literals in Dart/JS even if dart-define is in progress.

**You do not need to run QC App.** It is a Windows desktop app. Stage 1 is filesystem + git scan only. No virtual machine, no Windows build, no `flutter run`.

---

## 1. Agent rules (mandatory)

- Never paste full secret values into chat, PR descriptions, commit messages, or this playbook’s output files.
- In the inventory table, set `value_in_output` to `REDACTED`. Optionally add `value_hint` as **kind + length + last 4 chars** (example: `ld-mobile-key len=40 suffix=4051`) only when needed to distinguish env rows. Prefer no suffix if the file:line already uniquely identifies the row.
- Do not copy `.env` contents into the table. `.env` is generated and gitignored; inventory the **generator** and **Dart/TS literals**.
- Treat `Pulumi.*.yaml` `secure:` blobs as **already in Pulumi** (ciphertext). List them as `already_pulumi_encrypted`, do not try to decrypt.
- Treat `pulumi stack output …` in `generate-env.js` as **already from Pulumi outputs** (may still be non-secret stack outputs). List them as `from_pulumi_stack_output`.
- Skip `node_modules/`, `build/`, `.dart_tool/`, `coverage/`, `.git/`, iOS `Pods/`, generated `*.g.dart` unless a secret is clearly authored there.
- Test fixtures with values like `'test'`, `'Widget-ABC'`, `fake-`, `example.com` are `test_placeholder` — still list if they sit next to a real production pattern, otherwise skip.
- Stage 1 output is **tables only**. No code changes unless the human explicitly asks.

---

## 2. Repos (absolute paths)

| Order | App | Clone to use | Notes |
| --- | --- | --- | --- |
| 1 | **QC App** | `/Users/hazimrentready/StudioProjects/qc-app` | Flutter Windows/web. Has `scripts/generate-env.js`, Pulumi stacks. **Start here.** Other folders `qc-app-v2` / `qc-appv2` / `VSCodeProjects/qc-app` may exist — inventory **this** path unless told otherwise. |
| 2 | **Pro App** | `/Users/hazimrentready/StudioProjects/pro-appv2.0` | Flutter mobile. `npm run generate:env -- <env>`. |
| 3 | **Portal** | `/Users/hazimrentready/StudioProjects/rr-portal-frontv11` | Front-end. Feathery / AnnounceKit called out by Andrey. Confirm folder name if clone differs (`rr-portal-front`). |
| 4 | **pro-app-api** | `/Users/hazimrentready/VSCodeProjects/pro-app-api-1` | Azure Functions. Also check `VSCodeProjects/pro-app-api` only if this clone is stale. |

Work from the clone’s **root**. Record `git rev-parse --short HEAD` and branch on the table header.

---

## 3. What to extract (classification)

Every finding gets one `kind`:

| kind | Meaning | Examples | Stage 2 likely? |
| --- | --- | --- | --- |
| `secret` | Credential; leak = rotate | Client secrets, API keys, connection strings, PEM, SendGrid `SG.`, storage AccountKey, Zoom app secret, LaunchDarkly **SDK/mobile keys** | Yes — Pulumi `--secret` |
| `client_id` | OAuth / AAD application id | `CLIENT_ID`, Zoom client id if public | Often config, sometimes secret depending on product |
| `widget_or_form_id` | Vendor widget/form id | AnnounceKit widget, Feathery form id | Yes — Pulumi config (may not need `--secret`) |
| `feature_flag_id` | LD client-side id (not the key) | QC `FEATURE_FLAG_API_ID` | Pulumi config |
| `url_or_endpoint` | Environment URL | `API_URL`, blob `release.json` URL | Pulumi output or config |
| `instrumentation_key` | App Insights / similar | `APP_INSIGHT_KEY` | Usually stack output already |
| `already_pulumi_encrypted` | `secure:` in `Pulumi.<stack>.yaml` | Cosmos, Service Bus in prod YAML | Note only; DevOps rotation is separate P0 |
| `from_pulumi_stack_output` | `pulumi stack output X` in generate-env | `ApiUrl`, `ClientId` | No move; already wired |
| `hardcoded_in_generator` | Literal in `generate-env.js` (or equivalent) | Maps key, LD keys per env | **Yes — primary Stage 2 target** |
| `hardcoded_in_source` | Literal in `lib/` / `src/` | Dart `static String get x => '…'` | **Yes** |
| `ci_or_settings_file` | `local.settings.json`, CI param JSON | Function keys, connection strings | gitignore + rotate (separate tickets) |
| `test_placeholder` | Fake value in tests | `'test'` | No |

Also set `sensitivity`: `high` (secret), `medium` (key-like ID that unlocks a vendor project), `low` (public widget id / URL).

Andrey explicitly asked to look for **Feathery** and **AnnounceKit** IDs in Portal and Pro App even if they are not “secret-shaped.” Gitleaks will miss those; **ripgrep is required**.

---

## 4. Tools

### 4.1 ripgrep (`rg`) — required

Finds IDs and literals gitleaks misses.

Install (macOS): `brew install ripgrep`

Run from repo root. Always exclude junk:

```bash
rg -n --hidden \
  -g '!node_modules/**' -g '!build/**' -g '!.dart_tool/**' -g '!coverage/**' \
  -g '!**/Pods/**' -g '!.git/**' -g '!*.g.dart' \
  -i 'PATTERN' .
```

### 4.2 gitleaks — required

Finds high-entropy / known-prefix secrets in the **current tree**. Prefer working tree over full history for Stage 1 (history is P1 / separate).

Install:

```bash
brew install gitleaks
gitleaks version
```

Working tree (no git history):

```bash
gitleaks detect --no-git --source . --report-path /tmp/gitleaks-<repo>.json --report-format json --exit-code 0
```

`--exit-code 0` so the scan does not fail the agent run. Then summarize **counts and rule names + file paths**, not secret strings.

Optional second pass (committed files only):

```bash
gitleaks detect --source . --report-path /tmp/gitleaks-<repo>-git.json --report-format json --exit-code 0
```

Do **not** commit gitleaks JSON reports (they contain live secrets).

### 4.3 Optional: trufflehog

Only if gitleaks is noisy or a path looks like a key but did not match:

```bash
trufflehog filesystem . --results=verified,unknown --fail
```

Same rule: do not commit output.

### 4.4 Pulumi CLI — read-only in Stage 1

Used only to **label** whether a name already exists as stack output. Do **not** `config set`. If not logged in, skip live Pulumi and infer from `generate-env.js` + `infra/` + `Pulumi.yaml`.

```bash
pulumi version
# if logged in:
pulumi stack ls
# do not print: pulumi config --show-secrets
```

### 4.5 Not used in Stage 1

- Windows VM / QC installer
- `npm run generate:env` (would write `.env` with real values)
- Custom `--show-secret` CLI (Stage 3)
- History rewrite, `git filter-repo`

---

## 5. How to extract (procedure per repo)

Execute in this order. After each step, append rows to that repo’s table file.

### Step A — Record repo metadata

```bash
pwd
git rev-parse --abbrev-ref HEAD
git rev-parse --short HEAD
```

Header fields: `repo`, `path`, `branch`, `commit`, `scanned_at` (ISO date).

### Step B — Map config entry points (always)

List and read (do not dump secrets):

- `scripts/generate-env.js` or any `generate:env` in `package.json`
- `lib/config/config.dart` / `lib/config/*.dart`
- `infra/**/*.ts` (Pulumi program — names of outputs/config keys)
- `Pulumi.yaml` and `Pulumi.*.yaml` (key **names** only)
- Front-end: `.env*`, `src/environments/`, `environment.ts`
- API: `local.settings.json`, `host.json`, `local.settings.json.example`, Function `appSettings` in Pulumi

For `generate-env.js`, split every assignment into:

- `from_pulumi_stack_output` if `pulumi stack output …`
- `hardcoded_in_generator` if a JS object/string literal

### Step C — Named vendor / product searches (Andrey + common)

Run **each** pattern. Record file:line for hits in first-party code.

```bash
# Vendors called out
rg -n -i --hidden -g '!node_modules/**' -g '!build/**' -g '!.dart_tool/**' -g '!coverage/**' \
  'feathery|announcekit|announce.?kit' .

# Keys / secrets (names)
rg -n -i --hidden -g '!node_modules/**' -g '!build/**' -g '!.dart_tool/**' -g '!coverage/**' \
  'api[_-]?key|apikey|client[_-]?secret|app[_-]?secret|subscription[_-]?key|sdk[_-]?key|sdk[_-]?secret|access[_-]?token|connection[_-]?string|account[_-]?key|private[_-]?key|instrumentation[_-]?key' .

# Feature flags / LD
rg -n -i --hidden -g '!node_modules/**' -g '!build/**' -g '!.dart_tool/**' -g '!coverage/**' \
  'launchdarkly|feature_flag|FEATURE_FLAG|ld-client|mobile-key' .

# Maps / Zoom / Insights / AAD
rg -n -i --hidden -g '!node_modules/**' -g '!build/**' -g '!.dart_tool/**' -g '!coverage/**' \
  'azure.?maps|MAP_SUBSCRIPTION|zoomClient|ZOOM_|APP_INSIGHT|InstrumentationKey|TENANT_ID|CLIENT_ID|ApplicationId' .

# Cloud creds filenames
rg -n -i --hidden -g '!node_modules/**' -g '!build/**' \
  'begin private key|service_account|type.: .service_account' .
```

Literal-in-source heuristic (Dart/JS/TS string assigned to config getters):

```bash
rg -n --hidden -g '!node_modules/**' -g '!build/**' -g '!.dart_tool/**' \
  -g '*.dart' 'static String get \w+ => ['\''"]' .

rg -n --hidden -g '!node_modules/**' -g '!build/**' \
  -g '*.{js,ts}' 'const \w+ = \{|const \w+ = ['\''"][A-Za-z0-9_\-]{8,}' scripts/ src/ lib/ 2>/dev/null || true
```

### Step D — gitleaks

Run as in §4.2. For each finding:

- Map to a table row: `tool=gitleaks`, `rule=<RuleID>`, `file`, `line` if present.
- `kind=secret` unless it is a test fake.
- Do not copy `Secret` / `Match` fields into the table.

### Step E — Classify Pulumi YAML keys (names only)

```bash
rg -n '^\s+[A-Za-z0-9:_-]+:' Pulumi.*.yaml | head -200
rg -n 'secure:' Pulumi.*.yaml
```

One row per **config key name** that is `secure:` → `already_pulumi_encrypted`. One row per non-secure config that looks like a credential name.

### Step F — Deduplicate and fill table

Same logical item in `generate-env.js` and `config.dart` = **two rows** (different locations) with the same `logical_name`.

### Step G — Write artifacts (redacted)

Per repo, write **only** under the playbook repo or a local untracked folder. Preferred (this workspace):

`docs/stage-1-inventory/<repo-slug>.md`

Do not write tables into QC/Portal/API repos unless asked (keeps one place to merge).

---

## 6. Table schema (use for every repo)

Markdown table. One row per finding.

| Column | Required | Allowed values / notes |
| --- | --- | --- |
| `logical_name` | yes | Stable name, e.g. `ZOOM_CLIENT_SECRET`, `FEATURE_FLAG_API_KEY`, `announceKitWidgetId` |
| `env` | yes | `sandbox` / `dev` / `staging` / `prod` / `all` / `n/a` |
| `kind` | yes | see §3 |
| `sensitivity` | yes | `high` / `medium` / `low` |
| `location_type` | yes | `generate_env` / `dart_source` / `js_ts_source` / `pulumi_yaml` / `pulumi_infra` / `ci` / `local_settings` / `json_config` / `other` |
| `file` | yes | repo-relative path |
| `line` | yes | number or `n/a` |
| `how_loaded_today` | yes | `literal` / `dotenv` / `pulumi_stack_output` / `pulumi_secure_config` / `unknown` |
| `already_in_pulumi` | yes | `yes-output` / `yes-secure-config` / `no` / `unknown` |
| `suggested_pulumi_key` | yes | e.g. `qc-app:zoom-client-secret` (proposal only) |
| `tool` | yes | `rg` / `gitleaks` / `manual` |
| `notes` | yes | Short; no secret material |
| `value_in_output` | yes | always `REDACTED` |

**File header** (markdown):

```text
# Stage 1 inventory — <app name>
- path:
- branch:
- commit:
- scanned_at:
- gitleaks_working_tree_count:
- rg_vendor_hits_feathery:
- rg_vendor_hits_announcekit:
```

---

## 7. Per-repo checklists

### 7.1 QC App — **do this first**

**Root:** `/Users/hazimrentready/StudioProjects/qc-app`  
**Do not run** the Windows app.

Known entry points to read first (then still run full rg + gitleaks):

| File | Why |
| --- | --- |
| `package.json` | `generate:env` → `node ./scripts/generate-env.js --env` |
| `scripts/generate-env.js` | Mix of `pulumi stack output` and **hardcoded** `featureFlagApiKey` / `featureFlagApiId` per `sandbox`/`dev`/`prod` |
| `lib/config/config.dart` | dotenv for most env; **literal** Zoom client secret getter; hardcoded `zoom.us`; blob `versionCheckUrl` |
| `lib/services/feature_flag_service/feature_flag_ldc.dart` | Reads `FEATURE_FLAG_API_KEY` / `FEATURE_FLAG_API_ID` from dotenv |
| `lib/services/zoom/*.dart` | Uses `AppConfig.zoomClientSecret` |
| `infra/` | Pulumi output names |
| `Pulumi.yaml`, `Pulumi.sandbox.yaml`, `Pulumi.dev.yaml`, `Pulumi.prod.yaml` (and `*-beta` / `*-release`) | Encrypted config key names |

Env mapping in this repo: `staging` is rewritten to `dev` in `generate-env.js`. Supported generator envs: `sandbox`, `dev`, `prod`.

Commands (copy-paste from QC root):

```bash
cd /Users/hazimrentready/StudioProjects/qc-app
git rev-parse --abbrev-ref HEAD && git rev-parse --short HEAD

rg -n -i --hidden -g '!node_modules/**' -g '!build/**' -g '!.dart_tool/**' -g '!coverage/**' \
  'feathery|announcekit|api[_-]?key|client[_-]?secret|subscription[_-]?key|FEATURE_FLAG|zoomClient|ZOOM_|APP_INSIGHT|TENANT_ID|CLIENT_ID' .

rg -n --hidden -g '*.dart' -g '!*.g.dart' 'static String get \w+ => ['\''"]' lib/

gitleaks detect --no-git --source . --report-path /tmp/gitleaks-qc-app.json --report-format json --exit-code 0
```

Write: `docs/stage-1-inventory/qc-app.md` **in the playbook repo**  
(`/Users/hazimrentready/StudioProjects/pro-appv2.0/docs/stage-1-inventory/qc-app.md`).

QC-specific notes to capture if still true at scan time:

- LaunchDarkly **keys** live as JS literals in the generator (`hardcoded_in_generator`, `secret`, `high`).
- LaunchDarkly **project/client ids** in the same file (`feature_flag_id`).
- Zoom **secret** in Dart (`hardcoded_in_source`, `secret`, `high`) while Zoom **client id** comes from Pulumi output + dotenv.
- `versionCheckUrl` is a public blob URL (`url_or_endpoint`, `low`) unless it embeds a SAS token (if it does → `secret`).

### 7.2 Pro App

**Root:** `/Users/hazimrentready/StudioProjects/pro-appv2.0`

Entry points:

| File | Why |
| --- | --- |
| `package.json` | `"generate:env": "node ./scripts/generate-env.js --env"` |
| `scripts/generate-env.js` | Pulumi outputs for OAuth/API/Zoom; **literals** for `featureFlagKey` per env and `mapSubscriptionKey` |
| `lib/config/config.dart` | `announceKitWidgetId` literal; maps key from dotenv |
| `lib/screens/home/home_screen.dart` | AnnounceKit init |
| `e2e/**/*.json` | Possible committed env-like JSON |
| `firebase/functions/**` | Cloud functions secrets |
| `Pulumi.*.yaml` | P0-3 already flagged prod stack secrets as encrypted-in-git |

Env mapping: generator accepts `sandbox`, `staging`, `prod`, `testing`; `staging` → Pulumi stack `dev`; `testing` → `sandbox`.

AnnounceKit / Feathery: search even if QC had none.

Write: `docs/stage-1-inventory/pro-app.md`

### 7.3 Portal (`rr-portal-front`)

**Root:** `/Users/hazimrentready/StudioProjects/rr-portal-frontv11`

No `generate-env.js` guaranteed. Search:

- `Pulumi.yaml`, `Pulumi.*.yaml`, `infra/`
- `src/`, `apps/`, env files, Feathery/AnnounceKit components
- GCP SA JSON (`P0-1` — if present, row `kind=secret`, `high`, note “rotation is DevOps”; do not copy PEM)

Write: `docs/stage-1-inventory/portal.md`

### 7.4 pro-app-api

**Root:** `/Users/hazimrentready/VSCodeProjects/pro-app-api-1`

Focus:

- `src/local.settings.json` (often tracked; **do not paste values**). Separate ticket exists to gitignore it — still **list keys/names** in Stage 1 (`ci_or_settings_file`).
- Pulumi / Bicep / `local.settings.json` key names
- Connection strings, function keys, `SERVER_SECRET` if any

Write: `docs/stage-1-inventory/pro-app-api.md`

---

## 8. After all four repos — master table

Create `docs/stage-1-inventory/MASTER.md`:

- Concatenate all rows.
- Add column `repo` (`qc-app` | `pro-app` | `portal` | `pro-app-api`).
- Sort: `sensitivity=high` first, then `no` for `already_in_pulumi`.
- Short summary counts: secrets vs IDs vs already-in-Pulumi.

This master table is the input to **Stage 2** (Pulumi `config set --secret` + `generate-env` changes). Stage 2 is **out of scope** until a human says to start it.

---

## 9. Stage 1 definition of done

- [ ] QC App table exists, redacted, from `/Users/hazimrentready/StudioProjects/qc-app`
- [ ] Pro App table exists
- [ ] Portal table exists
- [ ] pro-app-api table exists
- [ ] Master table exists
- [ ] Every `hardcoded_in_generator` and `hardcoded_in_source` row has `suggested_pulumi_key`
- [ ] No secret values in any committed markdown
- [ ] No app was “run” as a requirement (QC Windows VM not used)

---

## 10. Out of scope (do not do in the same pass)

- Stage 2: `pulumi config set --secret <ns>:<key> "<SECRET>"`
- Stage 3: secrets API / `--show-secret` for generate-env
- P0-7 npm CVE lockfile bumps
- gitignore `local.settings.json` PR (related but separate)
- Key rotation in Azure/GCP/Zoom/LaunchDarkly (DevOps)
- dart-define YAML→JSON conversion

---

## 11. Handoff prompt (paste to the executing agent)

```text
Follow docs/stage-1-secrets-inventory-playbook.md in pro-appv2.0.

Execute Stage 1 only. Start with QC App at
/Users/hazimrentready/StudioProjects/qc-app
Do not run the Windows app. Do not print or write secret values.
Write the redacted table to
/Users/hazimrentready/StudioProjects/pro-appv2.0/docs/stage-1-inventory/qc-app.md
Stop after QC App unless I ask to continue with the next repo.
```

To continue later: same prompt, next root from §2, next output file from §7.
