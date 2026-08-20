# Stage 1 inventory — QC App

- branch: `main`
- commit: `8ab3b22`
- scanned_at: `2026-08-19T13:13:32Z`
- gitleaks_working_tree_count: `171`
- rg_vendor_hits_feathery: `0`
- rg_vendor_hits_announcekit: `0`

## Scan notes

- Stage 1 only: filesystem + git scan. Windows app was not run. `npm run generate:env` was not run. Pulumi was not written.
- Pulumi CLI is not logged in here (`azblob://iacstate` needs `AZURE_STORAGE_ACCOUNT`). Output names inferred from `scripts/generate-env.js` + `infra/`.
- No `secure:` blobs in any `Pulumi.*.yaml`. Zoom client id, domains, and Azure subscription ids are plaintext stack config.
- Generator envs: `sandbox`, `dev`, `prod`. `staging` is rewritten to `dev` in `generate-env.js`.
- gitleaks 8.30.1 working-tree scan: 171 hits. After skipping `.tmp/`, `build/`, `.dart_tool/`, and generated `.env` copies: 3 first-party paths (`config.dart` Zoom secret, `feature_flag_service.dart` UUID false positive, `sonar-project.properties` token). LaunchDarkly mobile keys in `generate-env.js` were **not** flagged by gitleaks (ripgrep required).
- Do not inventory `.env` / `.env.old` values (generated, gitignored via `*.env`). `pubspec.yaml` still lists `.env` as a Flutter asset, so generated values are bundled at build time.
- Reports were written to `/tmp/gitleaks-qc-app.json` only (not committed).

## Inventory

| logical_name | env | kind | sensitivity | location_type | file | line | how_loaded_today | already_in_pulumi | suggested_pulumi_key | tool | notes | value_in_output |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| FEATURE_FLAG_API_KEY | sandbox | hardcoded_in_generator | high | generate_env | scripts/generate-env.js | 14 | literal | no | qc-app:feature-flag-api-key | rg | LaunchDarkly mobile/SDK key JS literal; written to `.env` as FEATURE_FLAG_API_KEY. Stage 2 `--secret`. | REDACTED |
| FEATURE_FLAG_API_KEY | dev | hardcoded_in_generator | high | generate_env | scripts/generate-env.js | 15 | literal | no | qc-app:feature-flag-api-key | rg | Same object; `staging` generator arg uses this `dev` value. | REDACTED |
| FEATURE_FLAG_API_KEY | prod | hardcoded_in_generator | high | generate_env | scripts/generate-env.js | 16 | literal | no | qc-app:feature-flag-api-key | rg | Same object; production LD mobile/SDK key. | REDACTED |
| FEATURE_FLAG_API_ID | sandbox | feature_flag_id | medium | generate_env | scripts/generate-env.js | 19 | literal | no | qc-app:feature-flag-api-id | rg | LaunchDarkly client-side/project id JS literal; used on web (`kIsWeb`). | REDACTED |
| FEATURE_FLAG_API_ID | dev | feature_flag_id | medium | generate_env | scripts/generate-env.js | 20 | literal | no | qc-app:feature-flag-api-id | rg | Same object; `staging` → `dev`. | REDACTED |
| FEATURE_FLAG_API_ID | prod | feature_flag_id | medium | generate_env | scripts/generate-env.js | 21 | literal | no | qc-app:feature-flag-api-id | rg | Same object; production LD client-side id. | REDACTED |
| ZOOM_CLIENT_SECRET | all | hardcoded_in_source | high | dart_source | lib/config/config.dart | 33 | literal | no | qc-app:zoom-client-secret | rg | Dart getter literal; same value for every env. Consumed by `lib/services/zoom/zoom_service_web.dart` and `zoom_service_other.dart`. gitleaks rule `generic-api-key`. | REDACTED |
| SONAR_LOGIN | n/a | secret | high | other | sonar-project.properties | 6 | literal | no | qc-app:sonar-login | gitleaks | Committed SonarQube token (`sonar.login`). Not app runtime. Rotate; keep out of git. gitleaks rule `sonar-api-token`. | REDACTED |
| DEV_ZOOM_CREDENTIALS | n/a | secret | high | dart_source | lib/config/config.dart | 47 | dotenv | no | n/a | rg | Optional local-web composite (email:meetingId:password:clientId). Documented in README; **not** written by generate-env. | REDACTED |
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
| versionCheckUrl | all | url_or_endpoint | low | dart_source | lib/config/config.dart | 35 | literal | no | qc-app:version-check-url | rg | Public Azure blob `release.json` URL. No SAS token in the literal. | REDACTED |
| zoom-qc-app-client-id | sandbox | client_id | medium | pulumi_yaml | Pulumi.sandbox.yaml | 5 | pulumi_stack_output | yes-output | qc-app:zoom-qc-app-client-id | rg | Plaintext Pulumi config (not `secure:`). Mapped to stack output `ZoomClientId` in `infra/index.ts`. | REDACTED |
| zoom-qc-app-client-id | dev | client_id | medium | pulumi_yaml | Pulumi.dev.yaml | 5 | pulumi_stack_output | yes-output | qc-app:zoom-qc-app-client-id | rg | Plaintext Pulumi config (not `secure:`). | REDACTED |
| zoom-qc-app-client-id | prod | client_id | medium | pulumi_yaml | Pulumi.prod.yaml | 5 | pulumi_stack_output | yes-output | qc-app:zoom-qc-app-client-id | rg | Plaintext Pulumi config (not `secure:`). | REDACTED |
| ZoomClientId | all | client_id | medium | pulumi_infra | infra/index.ts | 34 | pulumi_stack_output | yes-output | qc-app:zoom-qc-app-client-id | rg | `config.require("zoom-qc-app-client-id")` exported as `ZoomClientId`. | REDACTED |
| ClientId | all | client_id | medium | pulumi_infra | infra/builders/EnvironmentBuilder.ts | 49 | pulumi_stack_output | yes-output | ClientId | rg | Azure AD application `clientId` created by Pulumi; exported. | REDACTED |
| TenantId | all | client_id | low | pulumi_infra | infra/index.ts | 32 | pulumi_stack_output | yes-output | TenantId | rg | From `getClientConfig().tenantId`. | REDACTED |
| ApiUrl | all | url_or_endpoint | low | pulumi_infra | infra/index.ts | 29 | pulumi_stack_output | yes-output | ApiUrl | rg | `StackReference` `organization/rentready-api/<stack>` output `ApiUri`. | REDACTED |
| AppInsightsInstrumentationKey | all | instrumentation_key | medium | pulumi_infra | infra/services/app_insights.ts | 19 | pulumi_stack_output | yes-output | AppInsightsInstrumentationKey | rg | Created App Insights component; exported and copied into `.env`. | REDACTED |
| azure-native:subscriptionId | sandbox | client_id | low | pulumi_yaml | Pulumi.sandbox.yaml | 4 | pulumi_stack_output | no | azure-native:subscriptionId | rg | Azure subscription GUID in stack YAML (not `--secret`). Same id also on `dev`, `*-beta`, `dev-release`. | REDACTED |
| azure-native:subscriptionId | prod | client_id | low | pulumi_yaml | Pulumi.prod.yaml | 4 | pulumi_stack_output | no | azure-native:subscriptionId | rg | Azure subscription GUID in stack YAML (not `--secret`). Same id also on `prod-beta`, `prod-release`. | REDACTED |
| qc-app:domain | sandbox | url_or_endpoint | low | pulumi_yaml | Pulumi.sandbox.yaml | 6 | pulumi_stack_output | no | qc-app:domain | rg | Public hostname. Slot `Pulumi.sandbox-beta.yaml` also sets domain. | REDACTED |
| qc-app:domain | dev | url_or_endpoint | low | pulumi_yaml | Pulumi.dev.yaml | 6 | pulumi_stack_output | no | qc-app:domain | rg | Public hostname (`qc-app-staging…`). Also `dev-beta`, `dev-release`. | REDACTED |
| qc-app:domain | prod | url_or_endpoint | low | pulumi_yaml | Pulumi.prod.yaml | 6 | pulumi_stack_output | no | qc-app:domain | rg | Public hostname. Also `prod-beta`, `prod-release`. | REDACTED |
| qc-app:redirectUrl | sandbox | url_or_endpoint | low | pulumi_yaml | Pulumi.sandbox.yaml | 7 | pulumi_stack_output | no | qc-app:redirectUrl | rg | AAD SPA redirect URIs. `helpers.ts` also appends `http://localhost:8080/` on sandbox. | REDACTED |
| qc-app:redirectUrl | dev | url_or_endpoint | low | pulumi_yaml | Pulumi.dev.yaml | 7 | pulumi_stack_output | no | qc-app:redirectUrl | rg | AAD SPA redirect URIs (staging + staging-beta). | REDACTED |
| qc-app:redirectUrl | prod | url_or_endpoint | low | pulumi_yaml | Pulumi.prod.yaml | 7 | pulumi_stack_output | no | qc-app:redirectUrl | rg | AAD SPA redirect URIs (prod + prod-beta). | REDACTED |
| PULUMI_AZURE_STORAGE_KEY | n/a | ci_or_settings_file | high | ci | ci/azure-environment.yml | 47 | unknown | unknown | n/a | rg | Azure DevOps variable-group ref `$(PULUMI_AZURE_STORAGE_KEY)` (group `infrastructure`). Also line 69. Not a source literal. | REDACTED |
| PULUMI_AZURE_STORAGE_ACCOUNT | n/a | ci_or_settings_file | medium | ci | ci/azure-environment.yml | 46 | unknown | unknown | n/a | rg | ADO variable-group ref for Pulumi azblob backend. Also line 68. | REDACTED |
| unauthenticatedUserId | all | test_placeholder | low | dart_source | lib/services/feature_flag_service/feature_flag_service.dart | 6 | literal | no | n/a | gitleaks | gitleaks `generic-api-key` false positive. Static UUID used as anonymous LaunchDarkly user id, not a credential. | REDACTED |
| FEATURE_FLAG_API_KEY | n/a | test_placeholder | low | other | test/services/feature_flag/feature_flag_ldc_test.dart | 41 | literal | no | n/a | rg | Test fake `'test'`. Listed because it sits on the real env name. | REDACTED |

## Pulumi YAML `secure:` 

None. `rg -n 'secure:' Pulumi.*.yaml` returned no matches. Encrypted-in-git stack secrets are not used in this repo today.

## Stage 2 candidates (this repo)

Highest priority to move into Pulumi `--secret` / config (not done in Stage 1):

1. LaunchDarkly **keys** in `scripts/generate-env.js` (`FEATURE_FLAG_API_KEY`, per env)
2. Zoom **client secret** Dart literal in `lib/config/config.dart` (all envs share one value)
3. Committed **SonarQube** `sonar.login` (rotate; gitignore or CI secret — not app Pulumi unless desired)
4. LaunchDarkly **ids** in `scripts/generate-env.js` (`FEATURE_FLAG_API_ID`, may not need `--secret`)
5. `versionCheckUrl` / `zoomDomain` (config, not secrets)

Already wired from Pulumi stack outputs: `APP_INSIGHT_KEY`, `TENANT_ID`, `CLIENT_ID`, `API_URL`, `ZOOM_CLIENT_ID`.
