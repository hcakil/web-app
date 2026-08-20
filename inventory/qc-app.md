# Stage 1 inventory — QC App

- path: `/Users/hazimrentready/StudioProjects/qc-app`
- branch: `main`
- commit: `8ab3b22`
- scanned_at: `2026-08-19T13:13:32Z`
- reverified_at: `2026-08-20`
- gitleaks_working_tree_count: `171`
- rg_vendor_hits_feathery: `0`
- rg_vendor_hits_announcekit: `0`

## Scan notes

- Stage 1 only: filesystem + git scan. Windows app was not run. `npm run generate:env` was not run. Pulumi was not written.
- Pulumi CLI is not logged in here (`azblob://iacstate` needs `AZURE_STORAGE_ACCOUNT`). Output names inferred from `scripts/generate-env.js` + `infra/`.
- No `secure:` blobs in any `Pulumi.*.yaml`. Zoom client id, domains, and Azure subscription ids are plaintext stack config. Stacks do have `encryptionsalt` entries, but nothing is encrypted because CI sets `PULUMI_CONFIG_PASSPHRASE` to an empty string.
- Generator envs: `sandbox`, `dev`, `prod`. `staging` is rewritten to `dev` in `generate-env.js`.
- gitleaks 8.30.1 working-tree scan: 171 hits. After skipping `.tmp/`, `build/`, `.dart_tool/`, and generated `.env` copies: 3 first-party paths (`config.dart` Zoom secret, `feature_flag_service.dart` UUID false positive, `sonar-project.properties` token). LaunchDarkly mobile keys in `generate-env.js` were **not** flagged by gitleaks (ripgrep required). Re-verified 2026-08-20: same 171 / same 3 first-party paths. Extra hits sit in generated `.env`, `.env.old`, and `build/flutter_assets/.env` (expected; not inventoried as values).
- Do not inventory `.env` / `.env.old` values (generated, gitignored via `*.env`). `pubspec.yaml` lists `.env` as a Flutter asset, so generated values are bundled at build time into the Windows installer and web build. Zoom **client secret** is a Dart literal and is compiled in even when `.env` is empty; `generate-env.js` never writes `ZOOM_CLIENT_SECRET`.
- CI (`ci/azure-environment.yml`) generates sandbox/staging/prod `.env` files and publishes them as pipeline artifact `environment`. Windows and unit-test jobs download that artifact. Stage 2/3 must replace this path, not only `generate-env.js`.
- Slot stacks enumerated: `sandbox-beta`, `dev-beta`, `prod-beta`, `dev-release`, `prod-release`. They do not set `zoom-qc-app-client-id` (inherited from `baseStack`). `sandbox` / `dev` / `prod` YAML all set the **same** Zoom client id.
- Stella booking URLs in `lib/utils/utils.dart` were missed on the first pass (`appid=` does not match the playbook `ApplicationId` pattern). Added 2026-08-20.
- Reports were written to `/tmp/gitleaks-qc-app.json` only (original). Verification report was `/tmp/gitleaks-qc-app-verify.json`.

## Inventory

| logical_name | env | kind | sensitivity | location_type | file | line | how_loaded_today | already_in_pulumi | suggested_pulumi_key | tool | notes | value_in_output |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FEATURE_FLAG_API_KEY | sandbox | hardcoded_in_generator | high | generate_env | scripts/generate-env.js | 14 | literal | no | qc-app:feature-flag-api-key | rg | LaunchDarkly mobile/SDK key JS literal; written to `.env` as FEATURE_FLAG_API_KEY. Stage 2 `--secret`. | REDACTED |
| FEATURE_FLAG_API_KEY | dev | hardcoded_in_generator | high | generate_env | scripts/generate-env.js | 15 | literal | no | qc-app:feature-flag-api-key | rg | Same object; `staging` generator arg uses this `dev` value. | REDACTED |
| FEATURE_FLAG_API_KEY | prod | hardcoded_in_generator | high | generate_env | scripts/generate-env.js | 16 | literal | no | qc-app:feature-flag-api-key | rg | Same object; production LD mobile/SDK key. | REDACTED |
| FEATURE_FLAG_API_ID | sandbox | feature_flag_id | medium | generate_env | scripts/generate-env.js | 19 | literal | no | qc-app:feature-flag-api-id | rg | LaunchDarkly client-side/project id JS literal; used on web (`kIsWeb`). | REDACTED |
| FEATURE_FLAG_API_ID | dev | feature_flag_id | medium | generate_env | scripts/generate-env.js | 20 | literal | no | qc-app:feature-flag-api-id | rg | Same object; `staging` → `dev`. | REDACTED |
| FEATURE_FLAG_API_ID | prod | feature_flag_id | medium | generate_env | scripts/generate-env.js | 21 | literal | no | qc-app:feature-flag-api-id | rg | Same object; production LD client-side id. | REDACTED |
| ZOOM_CLIENT_SECRET | all | hardcoded_in_source | high | dart_source | lib/config/config.dart | 33 | literal | no | qc-app:zoom-client-secret | rg | Dart getter literal; same value for every env. **Not** written by generate-env. Compiled into every binary. Consumed by `zoom_service_web.dart:45` and `zoom_service_other.dart:108` (`ZoomOptions.appSecret`) plus signature helpers. gitleaks rule `generic-api-key`. | REDACTED |
| SONAR_LOGIN | n/a | secret | high | other | sonar-project.properties | 6 | literal | no | qc-app:sonar-login | gitleaks | Committed SonarQube token (`sonar.login`). Not app runtime. Rotate; keep out of git. gitleaks rule `sonar-api-token`. CI also uses `ci-templates` Sonar steps (`ci/azure-unit-test.yml`); confirm whether ADO injects a different secret. | REDACTED |
| SONAR_HOST_URL | n/a | url_or_endpoint | low | other | sonar-project.properties | 2 | literal | no | n/a | rg | `sonar.host.url` public SonarQube hostname. Not a secret. Listed next to the committed login token. | REDACTED |
| DEV_ZOOM_CREDENTIALS | n/a | secret | high | dart_source | lib/config/config.dart | 47 | dotenv | no | n/a | rg | Optional local-web composite (email:meetingId:password:clientId). Documented in README; **not** written by generate-env. If present in `.env`, Flutter asset bundling will ship it in the binary. Keep out of CI artifacts. | REDACTED |
| FEATURE_FLAG_API_KEY | all | hardcoded_in_generator | high | dart_source | lib/services/feature_flag_service/feature_flag_ldc.dart | 30 | dotenv | no | qc-app:feature-flag-api-key | rg | Desktop/Windows reads FEATURE_FLAG_API_KEY from dotenv. Value originates in generate-env literals. | REDACTED |
| FEATURE_FLAG_API_ID | all | feature_flag_id | medium | dart_source | lib/services/feature_flag_service/feature_flag_ldc.dart | 30 | dotenv | no | qc-app:feature-flag-api-id | rg | Web reads FEATURE_FLAG_API_ID from dotenv (`kIsWeb`). Same line as key. | REDACTED |
| APP_INSIGHT_KEY | all | from_pulumi_stack_output | medium | generate_env | scripts/generate-env.js | 56 | pulumi_stack_output | yes-output | AppInsightsInstrumentationKey | rg | `pulumi stack output AppInsightsInstrumentationKey`. | REDACTED |
| TENANT_ID | all | from_pulumi_stack_output | low | generate_env | scripts/generate-env.js | 57 | pulumi_stack_output | yes-output | TenantId | rg | `pulumi stack output TenantId`. | REDACTED |
| CLIENT_ID | all | from_pulumi_stack_output | medium | generate_env | scripts/generate-env.js | 58 | pulumi_stack_output | yes-output | ClientId | rg | `pulumi stack output ClientId` (AAD app created in infra). | REDACTED |
| API_URL | all | from_pulumi_stack_output | low | generate_env | scripts/generate-env.js | 59 | pulumi_stack_output | yes-output | ApiUrl | rg | `pulumi stack output ApiUrl` (from rentready-api stack `ApiUri`). | REDACTED |
| ZOOM_CLIENT_ID | all | from_pulumi_stack_output | medium | generate_env | scripts/generate-env.js | 60 | pulumi_stack_output | yes-output | ZoomClientId | rg | `pulumi stack output ZoomClientId`. Source config is plaintext `qc-app:zoom-qc-app-client-id`. | REDACTED |
| APP_INSIGHT_KEY | all | instrumentation_key | medium | dart_source | lib/services/telemetry/app_telemetry_service.dart | 28 | dotenv | yes-output | AppInsightsInstrumentationKey | rg | dotenv consumer of generator output. Also `app_telemetry_item_serializer_mixin.dart:78`. | REDACTED |
| TENANT_ID | all | client_id | low | dart_source | lib/config/config.dart | 27 | dotenv | yes-output | TenantId | rg | dotenv consumer. | REDACTED |
| CLIENT_ID | all | client_id | medium | dart_source | lib/config/config.dart | 25 | dotenv | yes-output | ClientId | rg | dotenv consumer (AAD public client id). | REDACTED |
| API_URL | all | url_or_endpoint | low | dart_source | lib/config/config.dart | 23 | dotenv | yes-output | ApiUrl | rg | dotenv consumer. | REDACTED |
| ZOOM_CLIENT_ID | all | client_id | medium | dart_source | lib/config/config.dart | 31 | dotenv | yes-output | ZoomClientId | rg | dotenv consumer. | REDACTED |
| zoomDomain | all | url_or_endpoint | low | dart_source | lib/config/config.dart | 29 | literal | no | qc-app:zoom-domain | rg | Hardcoded `zoom.us`. Not a secret. | REDACTED |
| versionCheckUrl | all | url_or_endpoint | low | dart_source | lib/config/config.dart | 35 | literal | no | qc-app:version-check-url | rg | Public Azure blob `release.json` URL. No SAS token in the literal. Confirm container is anonymous-read by design and only hosts release metadata. | REDACTED |
| stellaBookingUrl | sandbox | url_or_endpoint | low | dart_source | lib/utils/utils.dart | 50 | literal | no | qc-app:stella-booking-url | rg | Hardcoded Dataverse Stella URL + model-driven `appid` for sandbox. Used by `getBookableResourBookingStellaLink`. Not a credential; Stage 2 Pulumi config (not `--secret`). Missed on first pass because search used `ApplicationId` not `appid=`. | REDACTED |
| stellaBookingUrl | dev | url_or_endpoint | low | dart_source | lib/utils/utils.dart | 52 | literal | no | qc-app:stella-booking-url | rg | Same map; staging Dataverse org + app id (`AppConfig.environment` `dev`). | REDACTED |
| stellaBookingUrl | prod | url_or_endpoint | low | dart_source | lib/utils/utils.dart | 54 | literal | no | qc-app:stella-booking-url | rg | Same map; production Dataverse org + app id. | REDACTED |
| APP_INSIGHTS_INGEST_URL | all | url_or_endpoint | low | dart_source | lib/services/telemetry/app_telemetry_service_web.dart | 28 | literal | no | n/a | rg | Public Microsoft App Insights ingest endpoint. Also `app_telemetry_service_other.dart:30`. Not a secret. | REDACTED |
| zoom-qc-app-client-id | sandbox | client_id | medium | pulumi_yaml | Pulumi.sandbox.yaml | 5 | pulumi_stack_output | yes-output | qc-app:zoom-qc-app-client-id | rg | Plaintext Pulumi config (not `secure:`). Mapped to stack output `ZoomClientId` in `infra/index.ts`. **Same Zoom app id** as `dev` and `prod`. | REDACTED |
| zoom-qc-app-client-id | dev | client_id | medium | pulumi_yaml | Pulumi.dev.yaml | 5 | pulumi_stack_output | yes-output | qc-app:zoom-qc-app-client-id | rg | Plaintext Pulumi config (not `secure:`). Same value as sandbox and prod. | REDACTED |
| zoom-qc-app-client-id | prod | client_id | medium | pulumi_yaml | Pulumi.prod.yaml | 5 | pulumi_stack_output | yes-output | qc-app:zoom-qc-app-client-id | rg | Plaintext Pulumi config (not `secure:`). Same value as sandbox and dev. Slot stacks inherit via `baseStack`. | REDACTED |
| ZoomClientId | all | client_id | medium | pulumi_infra | infra/index.ts | 34 | pulumi_stack_output | yes-output | qc-app:zoom-qc-app-client-id | rg | `config.require("zoom-qc-app-client-id")` exported as `ZoomClientId`. | REDACTED |
| ClientId | all | client_id | medium | pulumi_infra | infra/builders/EnvironmentBuilder.ts | 49 | pulumi_stack_output | yes-output | ClientId | rg | Azure AD application `clientId` created by Pulumi; exported. | REDACTED |
| TenantId | all | client_id | low | pulumi_infra | infra/index.ts | 32 | pulumi_stack_output | yes-output | TenantId | rg | From `getClientConfig().tenantId`. | REDACTED |
| ApiUrl | all | url_or_endpoint | low | pulumi_infra | infra/index.ts | 29 | pulumi_stack_output | yes-output | ApiUrl | rg | `StackReference` `organization/rentready-api/<stack>` output `ApiUri`. | REDACTED |
| AppInsightsInstrumentationKey | all | instrumentation_key | medium | pulumi_infra | infra/services/app_insights.ts | 19 | pulumi_stack_output | yes-output | AppInsightsInstrumentationKey | rg | Created App Insights component; exported and copied into `.env`. | REDACTED |
| azure-native:subscriptionId | sandbox | client_id | low | pulumi_yaml | Pulumi.sandbox.yaml | 4 | pulumi_stack_output | no | azure-native:subscriptionId | rg | Azure subscription GUID in stack YAML (not `--secret`). Same id also on `dev`, `sandbox-beta`, `dev-beta`, `dev-release`. | REDACTED |
| azure-native:subscriptionId | prod | client_id | low | pulumi_yaml | Pulumi.prod.yaml | 4 | pulumi_stack_output | no | azure-native:subscriptionId | rg | Azure subscription GUID in stack YAML (not `--secret`). Same id also on `prod-beta`, `prod-release`. | REDACTED |
| qc-app:domain | sandbox | url_or_endpoint | low | pulumi_yaml | Pulumi.sandbox.yaml | 6 | pulumi_stack_output | no | qc-app:domain | rg | Public hostname. Slot `Pulumi.sandbox-beta.yaml:5` sets the same hostname. | REDACTED |
| qc-app:domain | dev | url_or_endpoint | low | pulumi_yaml | Pulumi.dev.yaml | 6 | pulumi_stack_output | no | qc-app:domain | rg | Public hostname (`qc-app-staging…`). Also `dev-release`. | REDACTED |
| qc-app:domain | prod | url_or_endpoint | low | pulumi_yaml | Pulumi.prod.yaml | 6 | pulumi_stack_output | no | qc-app:domain | rg | Public hostname. Also `prod-release`. | REDACTED |
| qc-app:domain | dev-beta | url_or_endpoint | low | pulumi_yaml | Pulumi.dev-beta.yaml | 5 | pulumi_stack_output | no | qc-app:domain | rg | Distinct slot hostname (`qc-app-staging-beta…`). | REDACTED |
| qc-app:domain | prod-beta | url_or_endpoint | low | pulumi_yaml | Pulumi.prod-beta.yaml | 5 | pulumi_stack_output | no | qc-app:domain | rg | Distinct slot hostname (`qc-app-beta…`). | REDACTED |
| qc-app:redirectUrl | sandbox | url_or_endpoint | low | pulumi_yaml | Pulumi.sandbox.yaml | 7 | pulumi_stack_output | no | qc-app:redirectUrl | rg | AAD SPA redirect URIs. `helpers.ts:30` also appends `http://localhost:8080/` on sandbox. | REDACTED |
| qc-app:redirectUrl | dev | url_or_endpoint | low | pulumi_yaml | Pulumi.dev.yaml | 7 | pulumi_stack_output | no | qc-app:redirectUrl | rg | AAD SPA redirect URIs (staging + staging-beta). | REDACTED |
| qc-app:redirectUrl | prod | url_or_endpoint | low | pulumi_yaml | Pulumi.prod.yaml | 7 | pulumi_stack_output | no | qc-app:redirectUrl | rg | AAD SPA redirect URIs (prod + prod-beta). | REDACTED |
| qc-app:baseStack | sandbox-beta | url_or_endpoint | low | pulumi_yaml | Pulumi.sandbox-beta.yaml | 6 | pulumi_stack_output | no | qc-app:baseStack | rg | Slot stack pointer to environment stack `sandbox`. Not a secret. | REDACTED |
| qc-app:baseStack | dev-beta | url_or_endpoint | low | pulumi_yaml | Pulumi.dev-beta.yaml | 6 | pulumi_stack_output | no | qc-app:baseStack | rg | Slot stack pointer to environment stack `dev`. | REDACTED |
| qc-app:originStack | dev-beta | url_or_endpoint | low | pulumi_yaml | Pulumi.dev-beta.yaml | 7 | pulumi_stack_output | no | qc-app:originStack | rg | Slot origin pointer `dev-release`. | REDACTED |
| qc-app:baseStack | prod-beta | url_or_endpoint | low | pulumi_yaml | Pulumi.prod-beta.yaml | 6 | pulumi_stack_output | no | qc-app:baseStack | rg | Slot stack pointer to environment stack `prod`. | REDACTED |
| qc-app:originStack | prod-beta | url_or_endpoint | low | pulumi_yaml | Pulumi.prod-beta.yaml | 7 | pulumi_stack_output | no | qc-app:originStack | rg | Slot origin pointer `prod-release`. | REDACTED |
| qc-app:baseStack | dev-release | url_or_endpoint | low | pulumi_yaml | Pulumi.dev-release.yaml | 6 | pulumi_stack_output | no | qc-app:baseStack | rg | Release slot pointer to environment stack `dev`. | REDACTED |
| qc-app:baseStack | prod-release | url_or_endpoint | low | pulumi_yaml | Pulumi.prod-release.yaml | 6 | pulumi_stack_output | no | qc-app:baseStack | rg | Release slot pointer to environment stack `prod`. | REDACTED |
| DOTENV_FLUTTER_ASSET | all | ci_or_settings_file | high | other | pubspec.yaml | 90 | literal | no | n/a | rg | Flutter `assets` includes `.env`. Generated LD keys, App Insights key, AAD ids, API URL, and Zoom client id are copied into `build/flutter_assets/.env` (gitleaks hit those copies). Stage 2 must change this loading path, not only `generate-env.js`. | REDACTED |
| innoSetupProductId | sandbox | client_id | low | other | pubspec.yaml | 97 | literal | no | n/a | rg | Windows Inno Setup product GUID (`inno_setup.sandbox.id`). Installer identity, not a credential. | REDACTED |
| innoSetupProductId | dev | client_id | low | other | pubspec.yaml | 104 | literal | no | n/a | rg | Staging installer product GUID (`inno_setup.dev.id`). | REDACTED |
| innoSetupProductId | prod | client_id | low | other | pubspec.yaml | 111 | literal | no | n/a | rg | Production installer product GUID (`inno_setup.production.id`). Generator env `prod` maps to this `production` key. | REDACTED |
| PULUMI_AZURE_STORAGE_KEY | n/a | ci_or_settings_file | high | ci | ci/azure-environment.yml | 47 | unknown | unknown | n/a | rg | Azure DevOps variable-group ref `$(PULUMI_AZURE_STORAGE_KEY)` (group `infrastructure`). Also line 69. Not a source literal. | REDACTED |
| PULUMI_AZURE_STORAGE_ACCOUNT | n/a | ci_or_settings_file | medium | ci | ci/azure-environment.yml | 46 | unknown | unknown | n/a | rg | ADO variable-group ref for Pulumi azblob backend. Also line 68. | REDACTED |
| PULUMI_CONFIG_PASSPHRASE | n/a | ci_or_settings_file | medium | ci | ci/azure-environment.yml | 45 | literal | no | n/a | rg | Hardcoded empty string `""`. Also line 67. **Stage 2 blocker:** `pulumi config set --secret` is not real encryption until a passphrase or Azure KMS is configured. Explains why YAML has `encryptionsalt` but no `secure:` blobs. | REDACTED |
| ENV_PIPELINE_ARTIFACT | n/a | ci_or_settings_file | high | ci | ci/azure-environment.yml | 79 | unknown | unknown | n/a | rg | Publishes generated `.env` files as artifact `environment` (sandbox/staging/production folders). Downloaded by `ci/azure-build-windows-app.yml:41` and copied onto `.env` at line 53 before installer build. Unit-test and web jobs use `download-env-files.yml` from `ci-templates`. Contains LD keys + Pulumi outputs. | REDACTED |
| unauthenticatedUserId | all | test_placeholder | low | dart_source | lib/services/feature_flag_service/feature_flag_service.dart | 6 | literal | no | n/a | gitleaks | gitleaks `generic-api-key` false positive. Static UUID used as anonymous LaunchDarkly user id, not a credential. | REDACTED |
| FEATURE_FLAG_API_KEY | n/a | test_placeholder | low | other | test/services/feature_flag/feature_flag_ldc_test.dart | 41 | literal | no | n/a | rg | Test fake `'test'`. Listed because it sits on the real env name. | REDACTED |
| APP_INSIGHT_KEY | n/a | test_placeholder | low | other | test/app_test.dart | 19 | literal | no | n/a | rg | Test fake `'inst-key-123'`. Also `test/services/connectivity/connectivity_service_test.dart:16`. Listed because it sits on the real env name. | REDACTED |

## Pulumi YAML `secure:` 

None. `rg -n 'secure:' Pulumi.*.yaml` returned no matches. Encrypted-in-git stack secrets are not used in this repo today. All stacks still declare `encryptionsalt`; CI passphrase is empty (see `PULUMI_CONFIG_PASSPHRASE`).

## Stage 2 candidates (this repo)

Highest priority to move into Pulumi `--secret` / config (not done in Stage 1):

1. LaunchDarkly **keys** in `scripts/generate-env.js` (`FEATURE_FLAG_API_KEY`, per env)
2. Zoom **client secret** Dart literal in `lib/config/config.dart` (all envs share one value). Must also stop compiling it: generate-env does not emit this key today; `config.dart` has to read dotenv (or dart-define) after Pulumi stores it.
3. Committed **SonarQube** `sonar.login` (rotate; gitignore or CI secret — not app Pulumi unless desired)
4. LaunchDarkly **ids** in `scripts/generate-env.js` (`FEATURE_FLAG_API_ID`, may not need `--secret`)
5. Stella booking URLs / Dataverse `appid`s in `lib/utils/utils.dart` (config, not secrets)
6. `versionCheckUrl` / `zoomDomain` (config, not secrets)

Stage 2 blockers / loading-path work (not just config keys):

- Empty `PULUMI_CONFIG_PASSPHRASE` in CI — `--secret` is not real until this is fixed.
- `.env` Flutter asset (`pubspec.yaml`) + pipeline artifact `environment` — generated values ship in binaries and ADO artifacts.
- Confirm whether one Zoom app (same client id + secret for sandbox/dev/prod) is intentional before rotating.

Already wired from Pulumi stack outputs: `APP_INSIGHT_KEY`, `TENANT_ID`, `CLIENT_ID`, `API_URL`, `ZOOM_CLIENT_ID`.
