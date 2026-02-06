# Checklist / Task Completion Process — Pro App

## Overview

This document provides a bird's-eye view and a detailed technical breakdown of the **Checklist Completion** process in the Pro App. It covers how a pro fills and submits a checklist, how photos are uploaded, how the task status is updated, and how poor network conditions are handled through deferred (background) uploads.

**Entry Point:** Pro fills the checklist form and taps the **"Complete"** button

---

## Feature Flags Status (Production)

| Flag | Key | Status | Effect on Checklist |
|------|-----|--------|---------------------|
| Enhance Addon Creation | `41318` | ✅ ON | Enables connection checking for checklist too |
| Network Performance Metrics | `41653` | ✅ ON | Enables network speed monitoring |
| Image Upload Improvement | `image-upload-improvement` | ✅ ON | Uses `application/octet-stream` content type |
| **Adaptive Image Compression** | **`41461`** | **❌ OFF** | **Not used by checklist flow** |

> **Note on flag 41461:** The Adaptive Image Compression flag does **NOT** affect the checklist flow. Checklists always skip photo uploads on poor connection, regardless of this flag. This flag only affects the Add-on creation flow.

---

## 1. Bird's-Eye View

A simplified, high-level overview of what happens when a pro completes a checklist:

```
                        ╔══════════════════════════════════╗
                        ║  Pro Taps "Complete" Button      ║
                        ║  on Checklist Form               ║
                        ╚════════════════╤═════════════════╝
                                         │
                                         ▼
                        ╔══════════════════════════════════╗
                        ║   App Checks Network Quality     ║
                        ║   (Good / Moderate / Poor)       ║
                        ╚════════════════╤═════════════════╝
                                         │
                          ┌──────────────┴──────────────┐
                          │                             │
                          ▼                             ▼
               ╔═══════════════════╗         ╔═══════════════════╗
               ║  GOOD CONNECTION  ║         ║  POOR CONNECTION  ║
               ╚════════╤══════════╝         ╚════════╤══════════╝
                        │                             │
                        ▼                             ▼
               ┌────────────────────┐       ┌────────────────────┐
               │ Upload All Photos  │       │ ⛔ Skip Photo      │
               │ to Cloud Storage   │       │    Upload Entirely │
               └────────┬───────────┘       └────────┬───────────┘
                        │                             │
                        ▼                             ▼
               ┌────────────────────┐       ┌────────────────────┐
               │ Save Checklist     │       │ Save Checklist     │
               │ via API            │       │ via API            │
               │ (WITH photos)      │       │ (WITHOUT photos)   │
               └────────┬───────────┘       └────────┬───────────┘
                        │                             │
                        ▼                             ▼
               ┌────────────────────┐       ┌────────────────────┐
               │ Update Task Status │       │ Update Task Status │
               │ → "Completed"      │       │ → "Completed"      │
               └────────┬───────────┘       └────────┬───────────┘
                        │                             │
                        │                             ▼
                        │                    ┌────────────────────┐
                        │                    │ Save Photos to     │
                        │                    │ Device Storage     │
                        │                    │ for Background     │
                        │                    │ Upload             │
                        │                    └────────┬───────────┘
                        │                             │
                        │                             ▼
                        │                    ┌────────────────────┐
                        │                    │ Background Service │
                        │                    │ Retries Upload     │
                        │                    │ Every 30s When     │
                        │                    │ Connection Improves│
                        │                    └────────┬───────────┘
                        │                             │
                        ▼                             ▼
               ╔══════════════════════════════════════════════╗
               ║            Checklist Completed               ║
               ║   Task Marked as Done in Work Order          ║
               ╚══════════════════════════════════════════════╝
```

---

## 2. Detailed Complete Flow — Good Connection Path

When network quality is **good**, all photos are uploaded immediately, then the checklist is saved with photo attachments:

```
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                      PRO TAPS "COMPLETE" BUTTON                              ║
     ╚═══════════════════════════════════════╤═══════════════════════════════════════╝
                                             │
                                             ▼
                            ┌────────────────────────────────┐
                            │  Record Start Time             │
                            │  (to calculate task duration)  │
                            └───────────────┬────────────────┘
                                            │
                                            ▼
                            ┌────────────────────────────────┐
                            │  Check Network Quality         │
                            │  (HTTP latency + Ping test)    │
                            │  Result: GOOD                  │
                            └───────────────┬────────────────┘
                                            │
                                            ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                         UPLOAD PHOTOS                                        ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  STEP 1: GET TEMPORARY BLOB INFO                │                 ║
     ║         │                                                 │                 ║
     ║         │  → Call API to get a URL template for           │                 ║
     ║         │    uploading to Azure Blob Storage              │                 ║
     ║         │  → Template: https://.../{BLOBNAME}             │                 ║
     ║         │  → Each photo gets a unique URL by replacing    │                 ║
     ║         │    {BLOBNAME} with the photo filename           │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  STEP 2: UPLOAD EACH PHOTO                      │                 ║
     ║         │                                                 │                 ║
     ║         │  ⚠️  No compression applied to checklist photos  │                 ║
     ║         │                                                 │                 ║
     ║         │  For each checklist question that has photos:    │                 ║
     ║         │    → Build upload URL from template + filename  │                 ║
     ║         │    → PUT original image bytes to Blob URL       │                 ║
     ║         │    → Content-Type: application/octet-stream     │                 ║
     ║         │    → Track upload progress                      │                 ║
     ║         │    → Collect (URL, filename) pairs per question │                 ║
     ║         │                                                 │                 ║
     ║         │  Photos are uploaded sequentially per question, │                 ║
     ║         │  but all questions run in parallel.             │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  STEP 3: MAP UPLOAD LINKS TO QUESTIONS          │                 ║
     ║         │                                                 │                 ║
     ║         │  → For each question, store list of             │                 ║
     ║         │    (upload URL, filename) pairs                 │                 ║
     ║         │  → These will be included in the checklist      │                 ║
     ║         │    save request                                 │                 ║
     ║         └─────────────────────────────────────────────────┘                 ║
     ║                                                                              ║
     ╚═══════════════════════════════╤══════════════════════════════════════════════╝
                                     │
                                     ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                        SAVE CHECKLIST                                        ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Build Checklist Request                        │                 ║
     ║         │                                                 │                 ║
     ║         │  → Title & Description from checklist template  │                 ║
     ║         │  → For each form field: question ID + answer    │                 ║
     ║         │  → For each photo question: question ID +       │                 ║
     ║         │    list of uploaded attachments (URL + filename) │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Call API: Save Checklist                       │                 ║
     ║         │                                                 │                 ║
     ║         │  → POST to /workorders/{id}/tasks/{id}/checklist│                 ║
     ║         │  → Includes all answers + photo attachments     │                 ║
     ║         │  → Returns checklist ID on success              │                 ║
     ║         └─────────────────────────────────────────────────┘                 ║
     ║                                                                              ║
     ╚═══════════════════════════════╤══════════════════════════════════════════════╝
                                     │
                                     ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                       UPDATE TASK STATUS                                     ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Call API: Update Task                          │                 ║
     ║         │                                                 │                 ║
     ║         │  → Status: Completed                            │                 ║
     ║         │  → Actual Duration: time from form open to save │                 ║
     ║         │  → Percent Complete: 100%                       │                 ║
     ║         └─────────────────────────────────────────────────┘                 ║
     ║                                                                              ║
     ╚═══════════════════════════════╤══════════════════════════════════════════════╝
                                     │
                                     ▼
                    ╔════════════════════════════════════╗
                    ║         DONE — SUCCESS             ║
                    ╚════════════════════════════════════╝
```

---

## 3. Detailed Complete Flow — Poor Connection Path

When network quality is **poor or moderate**, photos are NOT uploaded. The checklist is saved without photos, and a **deferred operation** is created to upload photos later:

```
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                      PRO TAPS "COMPLETE" BUTTON                              ║
     ╚═══════════════════════════════════════╤═══════════════════════════════════════╝
                                             │
                                             ▼
                            ┌────────────────────────────────┐
                            │  Record Start Time             │
                            │  (to calculate task duration)  │
                            └───────────────┬────────────────┘
                                            │
                                            ▼
                            ┌────────────────────────────────┐
                            │  Check Network Quality         │
                            │  (HTTP latency + Ping test)    │
                            │  Result: POOR / MODERATE       │
                            └───────────────┬────────────────┘
                                            │
                                            ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                   SKIP PHOTO UPLOAD — SAVE CHECKLIST IMMEDIATELY             ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Build Checklist Request (without photos)       │                 ║
     ║         │                                                 │                 ║
     ║         │  → Title & Description from checklist template  │                 ║
     ║         │  → For each form field: question ID + answer    │                 ║
     ║         │  → Photo questions: NO attachments included     │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Call API: Save Checklist                       │                 ║
     ║         │                                                 │                 ║
     ║         │  → Checklist saved WITHOUT photo attachments    │                 ║
     ║         │  → Returns checklist ID on success              │                 ║
     ║         └─────────────────────────────────────────────────┘                 ║
     ║                                                                              ║
     ╚═══════════════════════════════╤══════════════════════════════════════════════╝
                                     │
                                     ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                       UPDATE TASK STATUS                                     ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Call API: Update Task                          │                 ║
     ║         │                                                 │                 ║
     ║         │  → Status: Completed                            │                 ║
     ║         │  → Actual Duration: time from form open to save │                 ║
     ║         │  → Percent Complete: 100%                       │                 ║
     ║         └─────────────────────────────────────────────────┘                 ║
     ║                                                                              ║
     ╚═══════════════════════════════╤══════════════════════════════════════════════╝
                                     │
                                     ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                  SAVE DEFERRED INSPECTION OPERATION                          ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║   Only if the checklist has questions with photos:                           ║
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Create Deferred Inspection Record              │                 ║
     ║         │                                                 │                 ║
     ║         │  → Work Order ID                                │                 ║
     ║         │  → Task ID                                      │                 ║
     ║         │  → Checklist ID (from the API response above)   │                 ║
     ║         │  → For each photo question:                     │                 ║
     ║         │      • Question ID                              │                 ║
     ║         │      • Local file paths of photos on device     │                 ║
     ║         │      • Filenames                                │                 ║
     ║         │  → Status: PENDING                              │                 ║
     ║         │  → Retry Count: 0                               │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Save to Local Database (Hive)                  │                 ║
     ║         │                                                 │                 ║
     ║         │  → Persisted on device even if app is closed    │                 ║
     ║         │  → Will be picked up by background service      │                 ║
     ║         └─────────────────────────────────────────────────┘                 ║
     ║                                                                              ║
     ╚═══════════════════════════════╤══════════════════════════════════════════════╝
                                     │
                                     ▼
                    ╔════════════════════════════════════╗
                    ║      DONE — Deferred Service       ║
                    ║      Will Upload Photos Later       ║
                    ╚════════════════════════════════════╝
```

---

## 4. Deferred Service — Background Checklist Photo Upload

When checklist photos are saved for deferred upload, a **background service** runs every 30 seconds to check if the connection has improved and upload the photos:

```
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║              DEFERRED SERVICE — RUNS EVERY 30 SECONDS                        ║
     ╚═══════════════════════════════════════╤═══════════════════════════════════════╝
                                             │
                                             ▼
                            ┌────────────────────────────────┐
                            │  Check Network Quality         │
                            │  Is connection still poor?     │
                            └───────────┬────────────┬───────┘
                                        │            │
                                   POOR │            │ GOOD
                                        │            │
                                        ▼            ▼
                              ┌──────────────┐  ┌────────────────────────┐
                              │  Skip.       │  │  Get All Pending       │
                              │  Wait for    │  │  Operations from       │
                              │  next cycle. │  │  Local Database (Hive) │
                              └──────────────┘  └───────────┬────────────┘
                                                            │
                                                            ▼
                                        ┌────────────────────────────────┐
                                        │  Filter Eligible Operations    │
                                        │                                │
                                        │  → Status must be PENDING      │
                                        │  → Respect backoff timing      │
                                        │  → Max 50 retry attempts       │
                                        └───────────────┬────────────────┘
                                                        │
                                                        ▼
                                        ┌────────────────────────────────┐
                                        │  Process in Batches            │
                                        │  (max 2 at a time)            │
                                        └───────────────┬────────────────┘
                                                        │
                                                        ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║            FOR EACH DEFERRED CHECKLIST OPERATION                             ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║   For each checklist question that has photos:                               ║
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  1. Read Photo Files from Device Storage        │                 ║
     ║         │     → Check if each local file still exists     │                 ║
     ║         │     → Read image bytes from local path          │                 ║
     ║         │     → Skip missing files                        │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  2. Get Fresh Upload URL for Each Photo         │                 ║
     ║         │     → Request new URL from API per photo        │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  3. Upload Each Photo to Blob Storage           │                 ║
     ║         │     → PUT image bytes to URL                    │                 ║
     ║         │     → ⚠️  NO COMPRESSION — uploads original     │                 ║
     ║         │     → Content-Type: application/octet-stream    │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  4. Update Checklist via API                    │                 ║
     ║         │                                                 │                 ║
     ║         │  → PATCH the existing checklist                 │                 ║
     ║         │  → Add photo URLs as attachments to each        │                 ║
     ║         │    question that had photos                     │                 ║
     ║         │  → Uses checklist ID + question ID mapping      │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  5. Mark as Completed                           │                 ║
     ║         │     → Update status to COMPLETED in Hive        │                 ║
     ║         └─────────────────────────────────────────────────┘                 ║
     ║                                                                              ║
     ╚═══════════════════════════════════════════════════════════════════════════════╝

     ┌───────────────────────────────────────────────────────────────────────────────┐
     │                        ERROR HANDLING                                         │
     │                                                                               │
     │  If any step fails:                                                          │
     │    → Increment retry counter                                                 │
     │    → Record last attempt time                                                │
     │    → Next retry after exponential backoff: 2 × 2^retryCount seconds          │
     │       Retry 1: wait 4s │ Retry 2: wait 8s │ Retry 3: wait 16s │ ...         │
     │    → After 50 failed attempts → mark as FAILED (stop retrying)              │
     └───────────────────────────────────────────────────────────────────────────────┘
```

---

## 5. Key Difference: Checklist vs Add-on Photo Upload

| Aspect | Add-on Creation | Checklist Completion |
|--------|----------------|---------------------|
| **Good connection** | Get individual upload URLs, compress (1920px, 85%), upload 2-at-a-time | Get temp blob URL template, upload sequentially per question, **no compression** |
| **Poor connection** | ⛔ Photo upload completely skipped (flag 41461 is OFF) | ⛔ Photo upload completely skipped |
| **Compression** | Standard (1920px, 85%) on good connection only | **No compression** — always uploads original image |
| **URL strategy** | Individual URL per photo from API | URL template — replace {BLOBNAME} with filename |
| **Deferred target** | Booking Alert PATCH (add photos) | Checklist PATCH (add photos to questions) |
| **Deferred compression** | No compression (uploads originals) | No compression (uploads originals) |

> ⚠️ **Important observation:** Neither add-on nor checklist deferred uploads apply any compression. If flag 41461 were turned ON, add-on creation would use aggressive compression (1000 × 1000, 60%) on poor connections and attempt immediate upload instead of skipping.

---

## 6. Telemetry — Success Scenario Logs

### Good Connection — Full Upload Success

```
DynamicFormState isConnectionPoor: Connectivity quality good
DynamicFormState saveImages: getTempBlobInfo took 320ms
DynamicFormState saveImages: putBlobImage for 5 photos took 4200ms
DynamicFormState saveImages: Total processing time 4520ms for 5 photos
DynamicFormState:completeFormSave: Total operation time 6800ms
```

**Telemetry events emitted:**
- `DynamicForm:SaveChecklist` — workOrderId, taskId
- `DynamicForm:SaveTask` — workOrderId, taskId

### Poor Connection — Deferred Upload Success

**At the time of checklist completion (immediate):**

```
DynamicFormState isConnectionPoor: Connectivity quality poor
DynamicFormState saveImages: Total processing time 0ms for 0 photos
DynamicFormState:completeFormSave: Total operation time 1200ms
```

> Note: `0ms for 0 photos` — because photo upload is **completely skipped** on poor connection. This is the "missing log" that was investigated. The checklist is saved without photos, and the deferred service handles upload later.

**Later, when connection improves (Deferred Service):**

```
DeferredService processSingleInspectionOperation: Starting deferred upload for checklist CL-12345
DeferredService saveImages: Total processing time 5800ms for 5 photos (deferred upload completed)
```

---

## 7. Key Files Reference

| File | Purpose |
|------|---------|
| `lib/screens/dynamic_form/dynamic_form.dart` | UI screen — checklist form and "Complete" button |
| `lib/screens/dynamic_form/dynamic_form_state.dart` | Main logic — orchestrates checklist save, photo upload, task update |
| `lib/services/deferred/deferred_service.dart` | Background upload manager — retries photo uploads when connection improves |
| `lib/services/hive_operation/hive_operation_service.dart` | Local database — stores pending deferred operations |
| `lib/services/image/image_service.dart` | Blob storage upload and temp URL retrieval |
| `lib/services/vendors/vendors_service.dart` | API calls — save checklist, update task, update checklist with photos |
| `lib/utils/connectivity_util.dart` | Network quality detection (HTTP + Ping tests) |
| `lib/models/deferred_inspection_operation.dart` | Data model for deferred checklist operations |

---

## 8. Connection Quality Detection

The app evaluates network quality using **two tests**:

1. **HTTP Connection Test:** Measures response latency of an HTTP request
2. **Ping Connection Test:** Measures ICMP ping latency

These are combined into a **balanced quality** score:

| Quality | Meaning | Checklist Behavior |
|---------|---------|-------------------|
| **Good** | Reliable connection | Upload photos immediately (uncompressed), save checklist with attachments |
| **Moderate** | Slow but usable | ⛔ Skip photo upload, save checklist without photos, queue deferred upload |
| **Poor** | Unreliable | ⛔ Skip photo upload, save checklist without photos, queue deferred upload |

> **Note:** Both "Moderate" and "Poor" are treated as poor connection — triggering the deferred upload path.

---

## Summary

| Scenario | What Happens |
|----------|-------------|
| **Good Connection** | Photos uploaded immediately (no compression) via temp blob URL, checklist saved with attachments, task marked completed |
| **Poor Connection** | ⛔ Photo upload skipped entirely, checklist saved without photos, task marked completed, photos saved to device for background upload |
| **Background Upload** | Every 30 seconds, checks connection → if good, reads local photos (uncompressed), gets fresh URLs, uploads, patches checklist with photo URLs |
| **Retry on Failure** | Exponential backoff (4s → 8s → 16s → ...), up to 50 attempts before marking as permanently failed |
| **Missing Telemetry Explanation** | When connection is poor, the log shows "0ms for 0 photos" because upload is skipped — photos are uploaded later by the deferred service, which emits its own separate log |
