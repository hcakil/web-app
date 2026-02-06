# Add-on Creation Process — Pro App

## Overview

This document provides a bird's-eye view and a detailed technical breakdown of the **Add-on Creation** process in the Pro App. It covers how photos are uploaded, how add-ons are created via the API, and how the system handles poor network conditions through deferred (background) uploads.

**Entry Point:** User fills add-on details on the request screen and taps **"Done"**

---

## 1. Bird's-Eye View

A simplified, high-level overview of what happens when a pro creates an add-on request:

```
                        ╔══════════════════════════════════╗
                        ║   Pro Taps "Done" to Submit      ║
                        ║       Add-on Request(s)          ║
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
               │ Compress & Upload  │       │ Compress Photos    │
               │ Photos Immediately │       │ with Aggressive    │
               │ (2 at a time)      │       │ Compression        │
               └────────┬───────────┘       └────────┬───────────┘
                        │                             │
                        ▼                             ▼
               ┌────────────────────┐       ┌────────────────────┐
               │ Create Add-on      │       │ Upload Photos      │
               │ Request via API    │       │ (2 at a time)      │
               │ (with photos)      │       └────────┬───────────┘
               └────────┬───────────┘                │
                        │                             ▼
                        │                    ┌────────────────────┐
                        │                    │ Create Add-on      │
                        │                    │ Request via API    │
                        │                    │ (with photos)      │
                        │                    └────────┬───────────┘
                        │                             │
                        │                             ▼
                        │                    ┌────────────────────┐
                        │                    │ Save Photos to     │
                        │                    │ Device Storage     │
                        │                    │ for Background     │
                        │                    │ Re-upload          │
                        │                    └────────┬───────────┘
                        │                             │
                        ▼                             ▼
               ┌────────────────────┐       ┌────────────────────┐
               │ Update Payout      │       │ Background Service │
               │ Prices & Show      │       │ Retries Upload     │
               │ New Add-on in List │       │ Every 30s When     │
               └────────┬───────────┘       │ Connection Improves│
                        │                    └────────┬───────────┘
                        ▼                             ▼
               ╔══════════════════════════════════════════════╗
               ║              Add-on Created                  ║
               ║    (Visible in Work Order Details)           ║
               ╚══════════════════════════════════════════════╝
```

---

## 2. Detailed Complete Flow — Good Connection Path

When network quality is **good**, all photos are uploaded immediately before creating the add-on:

```
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                         PRO TAPS "DONE" BUTTON                              ║
     ╚═══════════════════════════════════════╤═══════════════════════════════════════╝
                                             │
                                             ▼
                            ┌────────────────────────────────┐
                            │  Check Network Quality         │
                            │  (HTTP latency + Ping test)    │
                            │  Result: GOOD                  │
                            └───────────────┬────────────────┘
                                            │
                                            ▼
                            ┌────────────────────────────────┐
                            │  Start Network Speed Monitor   │
                            │  (one-time speed measurement)  │
                            └───────────────┬────────────────┘
                                            │
                                            ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                  FOR EACH ADD-ON REQUEST (in parallel)                       ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  STEP 1: GET UPLOAD URLs                        │                 ║
     ║         │                                                 │                 ║
     ║         │  For each photo (batched, 2 at a time):         │                 ║
     ║         │    → Request a unique upload URL from API       │                 ║
     ║         │    → URL points to Azure Blob Storage           │                 ║
     ║         │                                                 │                 ║
     ║         │  If any URL request fails → entire add-on fails │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  STEP 2: COMPRESS PHOTOS                        │                 ║
     ║         │                                                 │                 ║
     ║         │  Standard compression (all in parallel):        │                 ║
     ║         │    → Max resolution: 1920 × 1920                │                 ║
     ║         │    → Quality: 85%                               │                 ║
     ║         │    → Format: JPEG                               │                 ║
     ║         │    → Skip if image < 100KB                      │                 ║
     ║         │    → Keep original if compressed is larger      │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  STEP 3: UPLOAD PHOTOS                          │                 ║
     ║         │                                                 │                 ║
     ║         │  For each photo (batched, 2 at a time):         │                 ║
     ║         │    → PUT compressed image to Blob Storage URL   │                 ║
     ║         │    → Content-Type: application/octet-stream     │                 ║
     ║         │    → Track upload progress percentage           │                 ║
     ║         │                                                 │                 ║
     ║         │  If any upload fails → entire add-on fails      │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Build Add-on Request Model                     │                 ║
     ║         │    → Product ID, Description, Amount            │                 ║
     ║         │    → Scope (Single Room / Entire Unit)          │                 ║
     ║         │    → Attach uploaded photo URLs                 │                 ║
     ║         └─────────────────────────────────────────────────┘                 ║
     ║                                                                              ║
     ╚═══════════════════════════════╤══════════════════════════════════════════════╝
                                     │
                                     ▼
                    ┌────────────────────────────────────┐
                    │  CALL API: Create Booking Alerts   │
                    │                                    │
                    │  Send all add-on requests at once  │
                    │  to backend (Stella API)           │
                    │                                    │
                    │  Receive booking alert IDs back    │
                    └───────────────┬────────────────────┘
                                    │
                                    ▼
                    ┌────────────────────────────────────┐
                    │  Update Payout Price Cache         │
                    │                                    │
                    │  For each non-custom add-on:       │
                    │    → Refresh pricing data from API │
                    │    → Update local price cache      │
                    └───────────────┬────────────────────┘
                                    │
                                    ▼
                    ┌────────────────────────────────────┐
                    │  Show New Add-on in UI             │
                    │                                    │
                    │  → Add booking alert to detail list│
                    │  → Immediately visible to pro      │
                    └───────────────┬────────────────────┘
                                    │
                                    ▼
                    ╔════════════════════════════════════╗
                    ║         DONE — SUCCESS             ║
                    ╚════════════════════════════════════╝
```

---

## 3. Detailed Complete Flow — Poor Connection Path

When network quality is **poor or moderate**, photos are still uploaded immediately but with aggressive compression. Additionally, photos are saved to local storage for a **background retry service** that re-uploads when the connection improves:

```
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                         PRO TAPS "DONE" BUTTON                              ║
     ╚═══════════════════════════════════════╤═══════════════════════════════════════╝
                                             │
                                             ▼
                            ┌────────────────────────────────┐
                            │  Check Network Quality         │
                            │  (HTTP latency + Ping test)    │
                            │  Result: POOR / MODERATE       │
                            └───────────────┬────────────────┘
                                            │
                                            ▼
                            ┌────────────────────────────────┐
                            │  Initialize Deferred Service   │
                            │  (background upload manager)   │
                            │  + Start Network Speed Monitor │
                            └───────────────┬────────────────┘
                                            │
                                            ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                  FOR EACH ADD-ON REQUEST (in parallel)                       ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  STEP 1: GET UPLOAD URLs                        │                 ║
     ║         │                                                 │                 ║
     ║         │  For each photo (batched, 2 at a time):         │                 ║
     ║         │    → Request a unique upload URL from API       │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  STEP 2: COMPRESS PHOTOS (Aggressive)           │                 ║
     ║         │                                                 │                 ║
     ║         │  Uses smaller compression (all in parallel):    │                 ║
     ║         │    → Max resolution: 1000 × 1000                │                 ║
     ║         │    → Quality: 60%                               │                 ║
     ║         │    → Maintains aspect ratio                     │                 ║
     ║         │    → Significantly smaller file size            │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  STEP 3: UPLOAD PHOTOS                          │                 ║
     ║         │                                                 │                 ║
     ║         │  For each photo (batched, 2 at a time):         │                 ║
     ║         │    → PUT compressed image to Blob Storage URL   │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  Build Add-on Request Model                     │                 ║
     ║         │    → Attach uploaded photo URLs                 │                 ║
     ║         └─────────────────────────────────────────────────┘                 ║
     ║                                                                              ║
     ╚═══════════════════════════════╤══════════════════════════════════════════════╝
                                     │
                                     ▼
                    ┌────────────────────────────────────┐
                    │  CALL API: Create Booking Alerts   │
                    │                                    │
                    │  Send all add-on requests to       │
                    │  backend with photo attachments    │
                    │                                    │
                    │  Receive booking alert IDs back    │
                    └───────────────┬────────────────────┘
                                    │
                                    ▼
     ╔═══════════════════════════════════════════════════════════════════════════════╗
     ║                    SAVE TO DEFERRED SERVICE                                  ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║   For each add-on with photos:                                              ║
     ║     → Store booking alert ID                                                ║
     ║     → Store local file paths of original photos                             ║
     ║     → Store filenames                                                       ║
     ║     → Store upload URLs already used                                        ║
     ║     → Store booking resource booking ID                                     ║
     ║     → Status: PENDING                                                       ║
     ║     → Saved to device's local database (Hive)                               ║
     ║                                                                              ║
     ╚═══════════════════════════════╤══════════════════════════════════════════════╝
                                     │
                                     ▼
                    ┌────────────────────────────────────┐
                    │  Update Payout Price Cache         │
                    │  + Show New Add-on in UI           │
                    └───────────────┬────────────────────┘
                                    │
                                    ▼
                    ╔════════════════════════════════════╗
                    ║      DONE — Deferred Service       ║
                    ║      Will Re-upload Later           ║
                    ╚════════════════════════════════════╝
```

---

## 4. Deferred Service — Background Upload Process

When photos are saved for deferred upload, a **background service** runs every 30 seconds to check if the connection has improved and re-upload the photos:

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
                                        │  → Respect backoff timing:     │
                                        │    Wait = 2 × 2^retryCount    │
                                        │    (exponential backoff)       │
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
     ║              FOR EACH DEFERRED ADD-ON OPERATION                              ║
     ╠═══════════════════════════════════════════════════════════════════════════════╣
     ║                                                                              ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  1. Read Photo Files from Device Storage        │                 ║
     ║         │     → Check if each file still exists           │                 ║
     ║         │     → Read image bytes from local path          │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  2. Get Fresh Upload URL for Each Photo         │                 ║
     ║         │     → Request new URL from API                  │                 ║
     ║         │     → Original URLs may have expired            │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  3. Upload Each Photo to Blob Storage           │                 ║
     ║         │     → PUT image bytes to new URL                │                 ║
     ║         │     → Content-Type: application/octet-stream    │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  4. Update Booking Alert via API                │                 ║
     ║         │     → PATCH booking alert with new photo URLs   │                 ║
     ║         │     → Links photos to the already-created alert │                 ║
     ║         └────────────────────┬────────────────────────────┘                 ║
     ║                              │                                               ║
     ║                              ▼                                               ║
     ║         ┌─────────────────────────────────────────────────┐                 ║
     ║         │  5. Cleanup                                     │                 ║
     ║         │     → Mark operation as COMPLETED in Hive       │                 ║
     ║         │     → Delete local photo files from device      │                 ║
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

## 5. Photo Processing Details

### Compression Strategies

| Condition | Method | Max Size | Quality | Format |
|-----------|--------|----------|---------|--------|
| **Good connection** | Standard Compression | 1920 × 1920 | 85% | JPEG |
| **Poor connection** | Aggressive Compression | 1000 × 1000 | 60% | JPEG |

- Photos smaller than **100KB** skip standard compression (overhead not worth it)
- If compressed file is **larger** than original → keeps original
- Aggressive compression maintains **aspect ratio** while resizing

### Upload Strategy

All uploads use **batched concurrency** — max **2 simultaneous** uploads at a time. This prevents network congestion that can occur with fully parallel uploads on slow connections.

```
     ┌─────────────────────────────────────────────────────────────────────┐
     │                    BATCHED UPLOAD (2 at a time)                     │
     │                                                                     │
     │   Photos: [P1] [P2] [P3] [P4] [P5]                                │
     │                                                                     │
     │   Batch 1:  [P1] ────────►  [P2] ────────►                        │
     │             (uploading)      (uploading)     ← wait for both       │
     │                                                                     │
     │   Batch 2:  [P3] ────────►  [P4] ────────►                        │
     │             (uploading)      (uploading)     ← wait for both       │
     │                                                                     │
     │   Batch 3:  [P5] ────────►                                         │
     │             (uploading)                      ← wait for completion │
     └─────────────────────────────────────────────────────────────────────┘
```

---

## 6. Telemetry — Success Scenario Logs

### Good Connection — Full Upload Success

```
RequestAddonScreenState isConnectionPoor: Connectivity quality good
RequestAddonScreenState _processAddonRequest: getUploadUrl for 3 photos took 450ms
RequestAddonScreenState _processAddonRequest: compressImage for 3 photos took 1200ms
RequestAddonScreenState _processAddonRequest: putBlobImage for 3 photos took 3500ms
RequestAddonScreenState _processAddonRequest: Total processing time 5150ms for 3 photos
onDone: Processing 2 addon requests took 5200ms
RequestAddonScreenState:onDone: addonsRequest API call took 380ms
RequestAddonScreenState:onDone: Pricing cache update took 120ms
RequestAddonScreenState:onDone: Total operation time 5700ms
```

### Poor Connection — Upload + Deferred Save Success

```
RequestAddonScreenState isConnectionPoor: Connectivity quality poor
RequestAddonScreenState _processAddonRequest: getUploadUrl for 3 photos took 2800ms
RequestAddonScreenState _processAddonRequest: compressImage for 3 photos took 600ms
RequestAddonScreenState _processAddonRequest: putBlobImage for 3 photos took 8200ms
RequestAddonScreenState _processAddonRequest: Total processing time 11600ms for 3 photos
onDone: Processing 1 addon requests took 11600ms
RequestAddonScreenState:onDone: addonsRequest API call took 1200ms
RequestAddonScreenState:onDone: Pricing cache update took 200ms
RequestAddonScreenState:onDone: Total operation time 13000ms
```

**Later, when connection improves (Deferred Service):**

```
DeferredService: Connection is good, processing 1 pending operations
DeferredService: Starting deferred upload for booking alert BA-12345
DeferredService: putBlobImage completed for 3 photos
DeferredService: Booking Alert Updated Successfully
DeferredService: Operation completed, local photos deleted
```

---

## 7. Key Files Reference

| File | Purpose |
|------|---------|
| `lib/screens/request_addon_bundled/request_addon_screen.dart` | UI screen — entry point |
| `lib/screens/request_addon_bundled/request_addon_screen_state.dart` | Main logic — orchestrates the full process |
| `lib/services/deferred/deferred_service.dart` | Background upload manager — retries failed uploads |
| `lib/services/hive_operation/hive_operation_service.dart` | Local database — stores pending deferred operations |
| `lib/services/image/image_service.dart` | Photo compression & blob storage upload |
| `lib/services/vendors/vendors_service.dart` | API calls — create booking alerts, get upload URLs |
| `lib/utils/connectivity_util.dart` | Network quality detection (HTTP + Ping tests) |
| `lib/models/deferred_operation.dart` | Data model for deferred add-on operations |

---

## 8. Connection Quality Detection

The app evaluates network quality using **two tests**:

1. **HTTP Connection Test:** Measures response latency of an HTTP request
2. **Ping Connection Test:** Measures ICMP ping latency

These are combined into a **balanced quality** score:

| Quality | Meaning | Upload Behavior |
|---------|---------|-----------------|
| **Good** | Reliable connection | Standard compression, immediate upload |
| **Moderate** | Slow but usable | Aggressive compression, immediate upload + deferred backup |
| **Poor** | Unreliable | Aggressive compression, immediate upload + deferred backup |

> **Note:** Both "Moderate" and "Poor" are treated as poor connection — triggering aggressive compression and deferred service backup.

---

## Summary

| Scenario | What Happens |
|----------|-------------|
| **Good Connection** | Photos compressed (1920px, 85%), uploaded 2-at-a-time, add-on created with photos, payout prices updated |
| **Poor Connection** | Photos aggressively compressed (1000px, 60%), uploaded 2-at-a-time, add-on created with photos, photos also saved locally for background re-upload when connection improves |
| **Background Re-upload** | Every 30 seconds, checks connection → if good, reads local photos, gets fresh URLs, uploads, updates booking alert, deletes local copies |
| **Retry on Failure** | Exponential backoff (4s → 8s → 16s → ...), up to 50 attempts before marking as permanently failed |
