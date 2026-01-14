# QC (Quality Check) Approval & Zoom Workflow Documentation

## Overview

This document provides a comprehensive description of the Quality Check (QC) workflow in the Pro App, including all relevant conditions, feature flags, edge cases, and when the BRB (BookableResourceBooking) updates its data (dates and status).

The QC process is a quality assurance step that requires Pros to participate in a video call (via Zoom) before completing their work order. This allows QC personnel to verify that the job has been completed satisfactorily.

---

## Table of Contents

1. [Production Feature Flag Values](#production-feature-flag-values)
2. [High-Level Flow Diagram](#high-level-flow-diagram)
3. [Feature Flags](#feature-flags)
4. [CRITICAL: BRB Status Update Timing Analysis](#critical-brb-status-update-timing-analysis)
5. [Detailed Production Flow](#detailed-production-flow)
6. [Detailed Workflow - Without Zoom](#detailed-workflow---without-zoom)
7. [Detailed Workflow - With Zoom](#detailed-workflow---with-zoom)
8. [BRB Data Updates](#brb-data-updates)
9. [Edge Cases](#edge-cases)
10. [QC App Integration](#qc-app-integration)
11. [Custom Zoom SDK](#custom-zoom-sdk)
12. [Potential Cheating Scenarios](#potential-cheating-scenarios)

---

## Production Feature Flag Values

**Current Production Configuration (as of January 2026):**

| # | Feature Flag | Production Value | Notes |
|---|-------------|------------------|-------|
| 1 | `popUpWindowAttemptToCompleteWorkOrder` | **TRUE** | Shows QC banner on finish work |
| 2 | `optimizeQCWorkFlow` | **TRUE** | Only Clean/Paint jobs require QC |
| 3 | `waitingRoom` | **TRUE** | Enables waiting room flow |
| 4 | `embeddedQC` | **Conditional** | iPhone ≥130605: Available, Android: Unavailable |
| 5 | `locationService` | **TRUE** | Location check for QC (1 mile) |
| 6 | `geofencing` | **TRUE** (most users) | 34 users have FALSE |
| 7 | `geofencingAll` | **TRUE** | Extends geofence to all users |

### embeddedQC Feature Flag Rules:
```
Rule 1: Android   → Build ≥ 166040, device NOT iPhone → Unavailable
Rule 2: iPhone    → Build ≥ 130605                   → Available  
Rule 3: Default   → All others                       → Unavailable
```

**⚠️ Important:** With `waitingRoom` = TRUE on production, the `embeddedQC` feature flag is NOT checked in the main flow. The `embeddedQC()` function is called directly from `qc_banner.dart`, bypassing the feature flag check in `checkQANeed()`.

---

## High-Level Flow Diagram

```
┌─────────────────────────────────────────────────────────────────────────────────────┐
│                           PRO APP - QC WORKFLOW                                       │
└─────────────────────────────────────────────────────────────────────────────────────┘

                              ┌──────────────────┐
                              │   START WORK     │
                              │   (Clock In)     │
                              │   Status: In     │
                              │   Progress       │
                              └────────┬─────────┘
                                       │
                                       │ Wait minimum 5 minutes
                                       │ + Complete all tasks
                                       ▼
                              ┌──────────────────┐
                              │  FINISH WORK     │
                              │  Button Enabled  │
                              └────────┬─────────┘
                                       │
                     ┌─────────────────┼─────────────────┐
                     │                 │                 │
                     ▼                 │                 │
    ┌────────────────────────┐        │    ┌────────────────────────┐
    │ FF: popUpWindowAttempt │        │    │ FF: popUpWindowAttempt │
    │ ToCompleteWorkOrder    │        │    │ ToCompleteWorkOrder    │
    │       = FALSE          │        │    │       = TRUE           │
    └───────────┬────────────┘        │    └───────────┬────────────┘
                │                     │                │
                │                     │                │
                ▼                     │                ▼
    ┌──────────────────────┐         │    ┌──────────────────────┐
    │  Direct Completion   │         │    │  Show QC Banner      │
    │  (No QC Required)    │         │    │  Modal               │
    └───────────┬──────────┘         │    └───────────┬──────────┘
                │                     │                │
                │                     │        ┌───────┴───────┐
                │                     │        │               │
                │                     │        ▼               ▼
                │                     │  ┌──────────┐    ┌──────────┐
                │                     │  │ "Not     │    │ "Yes,    │
                │                     │  │  Now"    │    │  Ready"  │
                │                     │  │ Button   │    │ Button   │
                │                     │  └────┬─────┘    └────┬─────┘
                │                     │       │               │
                │                     │       │               │
                │                     │       ▼               ▼
                │                     │  ┌──────────┐   ┌────────────────────┐
                │                     │  │ Close    │   │ Check optimizeQCFF │
                │                     │  │ Banner   │   └─────────┬──────────┘
                │                     │  │ (No      │             │
                │                     │  │ change)  │   ┌─────────┴─────────┐
                │                     │  └──────────┘   │                   │
                │                     │                 ▼                   ▼
                │                     │    ┌────────────────────┐   ┌──────────────┐
                │                     │    │ Work Order Type    │   │ Work Order   │
                │                     │    │ = Clean OR Paint   │   │ Type = Other │
                │                     │    └─────────┬──────────┘   └──────┬───────┘
                │                     │              │                     │
                │                     │              │                     │
                │                     │              ▼                     ▼
                │                     │    ┌────────────────────┐   ┌──────────────┐
                │                     │    │ Check WaitingRoom  │   │ Direct       │
                │                     │    │ Feature Flag       │   │ Completion   │
                │                     │    └─────────┬──────────┘   │ (Skip QC)    │
                │                     │              │              └──────────────┘
                │                     │    ┌─────────┴─────────┐
                │                     │    │                   │
                │                     │    ▼                   ▼
                │                     │  ┌──────────┐    ┌──────────────────┐
                │                     │  │ Waiting  │    │ No Waiting Room  │
                │                     │  │ Room FF  │    │ (Old Flow)       │
                │                     │  │ = TRUE   │    │                  │
                │                     │  └────┬─────┘    └────────┬─────────┘
                │                     │       │                   │
                │                     │       ▼                   ▼
                │                     │  ┌────────────────┐  ┌─────────────────────┐
                │                     │  │ Call qcAcquire │  │ Check embeddedQC FF │
                │                     │  │ API            │  └──────────┬──────────┘
                │                     │  └───────┬────────┘             │
                │                     │          │               ┌──────┴──────┐
                │                     │    ┌─────┴─────┐         │             │
                │                     │    │           │         ▼             ▼
                │                     │    ▼           ▼    ┌─────────┐   ┌─────────┐
                │                     │ ┌────────┐ ┌────────┐│Embedded│   │ Old QC  │
                │                     │ │Success │ │Partial ││QC Flow │   │ Flow    │
                │                     │ │QC Info │ │Success ││(Zoom   │   │(Launch  │
                │                     │ │Returned│ │        ││SDK)    │   │External │
                │                     │ └───┬────┘ └───┬────┘└────────┘   │Zoom App)│
                │                     │     │         │                   └─────────┘
                │                     │     ▼         ▼
                │                     │ ┌──────┐  ┌─────────────────┐
                │                     │ │Join  │  │Navigate to      │
                │                     │ │Zoom  │  │Waiting Room     │
                │                     │ │Meet  │  │Screen           │
                │                     │ └──┬───┘  └───────┬─────────┘
                │                     │    │              │
                │                     │    │              ▼
                │                     │    │    ┌─────────────────────┐
                │                     │    │    │ Poll qcAcquire      │
                │                     │    │    │ every 5 seconds     │
                │                     │    │    │ until QC available  │
                │                     │    │    └──────────┬──────────┘
                │                     │    │               │
                │                     │    │    ┌──────────┴──────────┐
                │                     │    │    │                     │
                │                     │    │    ▼                     ▼
                │                     │    │ ┌──────────┐      ┌──────────────┐
                │                     │    │ │QC Info   │      │User Closes   │
                │                     │    │ │Returned  │      │Waiting Room  │
                │                     │    │ └────┬─────┘      └──────────────┘
                │                     │    │      │
                │                     │    │      ▼
                │                     │    │ ┌─────────────────┐
                │                     │    │ │Join Zoom Meeting│
                │                     │    │ └────────┬────────┘
                │                     │    │          │
                │                     │    └────┬─────┘
                │                     │         │
                │                     │         ▼
                │                     │  ┌─────────────────────────────┐
                │                     │  │      ZOOM MEETING           │
                │                     │  │                             │
                │                     │  │  Status: IN_WAITING_ROOM    │
                │                     │  │            ↓                │
                │                     │  │  Status: IN_MEETING         │
                │                     │  │  (QC member admits Pro)     │
                │                     │  │            ↓                │
                │                     │  │  Status: DISCONNECTING      │
                │                     │  │  (Meeting ends)             │
                │                     │  └──────────────┬──────────────┘
                │                     │                 │
                └─────────────────────┼─────────────────┘
                                      │
                                      ▼
                              ┌──────────────────┐
                              │   COMPLETE       │
                              │   WORK ORDER     │
                              │                  │
                              │   BRB Updated:   │
                              │   - Status:      │
                              │     Completed    │
                              │   - endtime      │
                              │   - rr_clockout  │
                              │     time         │
                              └──────────────────┘
```

---

## Feature Flags

The QC workflow behavior is controlled by several feature flags:

### 1. `popUpWindowAttemptToCompleteWorkOrder`
**Key:** `33333-implement-a-popup-window-when-attempting-to-complete-a-work-order`

- **TRUE:** Shows the QC Banner modal when Pro taps "Finish Work"
- **FALSE:** Directly completes the work order without QC

### 2. `optimizeQCWorkFlow`
**Key:** `optimize-qc-workflow-in-pro-app`

- **TRUE:** Only requires QC for **Clean** and **Paint** work order types
- **FALSE:** QC is required for all work order types (when other conditions are met)

### 3. `waitingRoom`
**Key:** `34784-as-a-pro-i-want-to-be-connected-to-the-next-available-qa-so-that-i-can-reduce-wait-time-and-co`

- **TRUE:** Enables the waiting room flow where Pro waits for QC to become available
- **FALSE:** Uses older flow that expects immediate QC availability

### 4. `embeddedQC`
**Key:** `29978-as-the-operations-manager-i-want-advanced-client-side-tracking-of-zoom-events-in-our-pro-app`

- **TRUE:** Uses embedded Zoom SDK for the QC call (inside the app)
- **FALSE:** Launches external Zoom app via deep link

### 5. `locationService`
**Key:** `21936-geolocation-for-qc-connections`

- **TRUE:** Validates Pro's location before allowing QC (must be within 1 mile of job site)
- **FALSE:** No location check for QC

### 6. `geofencing` / `geofencingAll`
**Keys:** 
- `14359-as-a-logistics-manager-i-need-pros-to-be-unable-to-clock-in-to-a-work-order-until-they-are-within-a-mile-from-the-address-of-the-service-address`
- `40295-extend-geo-fence-to-all-users-in-pro-app`

- Controls whether Pro must be within 1 mile to clock in (Start Work)

---

## CRITICAL: BRB Status Update Timing Analysis

### ⚠️ Key Discovery

**The BRB status is updated to "Completed" based on the response from `qcAcquire` API, NOT based on whether the QC meeting was actually completed.**

### Code Location: `lib/screens/order_details/contents/qc_banner.dart` (Lines 116-148)

```dart
onPressed: () async {
  updateReadyButtonStatus(false);

  if (hasWaitingRoomFF) {  // TRUE on Production
    var error = await embeddedQC();  // ← Step 1: Call qcAcquire API
    
    if ((error != null && error.statusMessage == "Partial Success") && context.mounted) {
      // SCENARIO A: No QC available immediately
      var result = await Routes.router.navigateTo(context, Routes.waitingRoom, ...);
      
      if (result != null && context.mounted) {
        // User waited and QC became available
        joinMeeting(qaInfo.zoomMeetingId!, qaInfo.zoomMeetingPassword!);
        updateOrderDetailStateWithCompleted();  // ← BRB UPDATE Point A
      }
      // If result is null (user closed waiting room) → NO BRB UPDATE
      
    } else {
      // SCENARIO B: Success OR Failure (not "Partial Success")
      updateOrderDetailStateWithCompleted();  // ← BRB UPDATE Point B ⚠️
      if (context.mounted) Navigator.pop(context);
    }
  } else {
    // Old flow (waitingRoom = FALSE, not used on Production)
    updateOrderDetailStateWithCompleted();
    Navigator.pop(context);
  }
}
```

### BRB Update Scenarios (Production with waitingRoom=TRUE)

| Scenario | qcAcquire Result | What Happens | BRB Updated? | QC Actually Completed? |
|----------|-----------------|--------------|--------------|----------------------|
| A | **Success** | `joinMeeting()` called, then `updateOrderDetailStateWithCompleted()` | ✅ YES | ❓ Meeting started, but Pro can leave immediately |
| B | **Partial Success** | Navigate to Waiting Room | ⏳ Pending | - |
| B.1 | User waits, QC available | `joinMeeting()` + `updateOrderDetailStateWithCompleted()` | ✅ YES | ❓ Meeting started, but Pro can leave immediately |
| B.2 | User closes Waiting Room | Nothing happens | ❌ NO | ❌ NO |
| C | **Failure** (not Partial) | Error shown, then `updateOrderDetailStateWithCompleted()` | ✅ YES ⚠️ | ❌ NO QC at all! |

### ⚠️ Critical Issue in Scenario C

When `qcAcquire` returns a failure (error) that is NOT "Partial Success", the code STILL calls `updateOrderDetailStateWithCompleted()` and marks the BRB as Completed!

```dart
} else {
  // This else branch handles BOTH:
  // 1. error == null (Success) - OK
  // 2. error != null && error.statusMessage != "Partial Success" (Failure) - PROBLEM!
  
  updateOrderDetailStateWithCompleted();  // ← BRB marked Completed even on failure
  Navigator.pop(context);
}
```

### The `embeddedQC()` Function Analysis

**Location:** `lib/screens/order_details/order_details_state.dart` (Lines 457-479)

```dart
Future<ApiResultError<QCAcquireResponse>?> embeddedQC() async {
  var qcInformation = await vendorService.qcAcquire(
    data.value.bookableresourcebookingid,
    hasWaitingRoomFeatureFlag: hasWaitingRoomFF
  );
  
  ApiResultError<QCAcquireResponse>? error;
  
  switch (qcInformation) {
    case ApiResultSuccess<QCAcquireResponse>():
      // SUCCESS: Join meeting immediately
      joinMeeting(meetingId, meetingPassword);  // ← Zoom meeting starts
      // Returns null (no error)
      
    case ApiResultError<QCAcquireResponse>():
      error = qcInformation;
      if (!hasWaitingRoomFF || qcInformation.statusMessage != "Partial Success") {
        // Show error to user
        Get.find<ProAppState>().virtualQCError.value = qcInformation;
      }
      // Returns error
      
    case ApiThrow<QCAcquireResponse>():
      // Exception - returns null
  }
  return error;
}
```

**Key Observation:** `embeddedQC()` does NOT call `updateOrderDetailStateWithCompleted()`. It only:
1. Calls `joinMeeting()` on success
2. Returns error/null

The BRB update is handled AFTER `embeddedQC()` returns, in `qc_banner.dart`.

### Why `checkQANeed()` is NOT Called on Production

**Location:** `lib/screens/order_details/order_details_state.dart` (Lines 361)

```dart
// In updateOrderById() function:
finally {
  if (!hasWaitingRoomFF) await checkQANeed(dataToUpdate, byPassLocationCheck: byPassLocationCheck);
  updateData(dataToUpdate);
}
```

Since `hasWaitingRoomFF = TRUE` on Production:
- `checkQANeed()` is NEVER called from `updateOrderById()`
- The `embeddedQC` feature flag check inside `checkQANeed()` is bypassed
- Both Android and iPhone call `embeddedQC()` directly from `qc_banner.dart`

---

## Detailed Production Flow

### For Clean/Paint Jobs (QC Required)

```
┌────────────────────────────────────────────────────────────────────────────────┐
│                    PRODUCTION FLOW (Clean/Paint Jobs)                           │
│                                                                                 │
│  Feature Flags: popUpWindow=TRUE, optimizeQC=TRUE, waitingRoom=TRUE            │
└────────────────────────────────────────────────────────────────────────────────┘

User taps "Finish Work" button
         │
         ▼
┌─────────────────────────────────────┐
│ Check: hasPopUpWindowFF = TRUE      │
│ Check: hasOptimizeQCFF = TRUE       │
│ Check: workOrderType = Clean/Paint? │
└────────────────┬────────────────────┘
                 │ YES
                 ▼
┌─────────────────────────────────────┐
│       showQCBanner(context)         │
│                                     │
│  ┌─────────────────────────────┐   │
│  │     "Yes, Ready" button     │   │
│  │     "Not Now" button        │   │
│  └─────────────────────────────┘   │
└────────────────┬────────────────────┘
                 │ User taps "Yes, Ready"
                 ▼
┌─────────────────────────────────────┐
│  hasWaitingRoomFF = TRUE            │
│  Call: await embeddedQC()           │
│                                     │
│  This calls: qcAcquire API          │
│  POST /vendors/qc/acquire?bookingId │
└────────────────┬────────────────────┘
                 │
     ┌───────────┼───────────┬────────────────┐
     │           │           │                │
     ▼           ▼           ▼                ▼
┌─────────┐ ┌─────────┐ ┌─────────┐    ┌─────────────┐
│ SUCCESS │ │ PARTIAL │ │ FAILURE │    │ EXCEPTION   │
│         │ │ SUCCESS │ │         │    │ (ApiThrow)  │
└────┬────┘ └────┬────┘ └────┬────┘    └──────┬──────┘
     │           │           │                │
     │           │           │                │
     ▼           ▼           ▼                ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│                                                                             │
│  SUCCESS:                    PARTIAL SUCCESS:         FAILURE/EXCEPTION:   │
│  ┌─────────────────────┐    ┌──────────────────┐    ┌──────────────────┐  │
│  │ joinMeeting()       │    │ Navigate to      │    │ Show error       │  │
│  │ called inside       │    │ Waiting Room     │    │ message          │  │
│  │ embeddedQC()        │    │                  │    │                  │  │
│  │                     │    │ Poll qcAcquire   │    │                  │  │
│  │ Returns: null       │    │ every 5 seconds  │    │ Returns: error   │  │
│  └──────────┬──────────┘    └────────┬─────────┘    └────────┬─────────┘  │
│             │                        │                       │            │
│             │              ┌─────────┴─────────┐             │            │
│             │              │                   │             │            │
│             │              ▼                   ▼             │            │
│             │     ┌──────────────┐    ┌──────────────┐      │            │
│             │     │ QC Available │    │ User closes  │      │            │
│             │     │              │    │ Waiting Room │      │            │
│             │     └──────┬───────┘    └──────┬───────┘      │            │
│             │            │                   │              │            │
│             │            ▼                   ▼              │            │
│             │     ┌──────────────┐    ┌──────────────┐      │            │
│             │     │ joinMeeting()│    │ Returns null │      │            │
│             │     │ + update BRB │    │ NO BRB UPDATE│      │            │
│             │     └──────┬───────┘    └──────────────┘      │            │
│             │            │                                  │            │
│             └────────────┼──────────────────────────────────┘            │
│                          │                                               │
│                          ▼                                               │
│             ┌────────────────────────────────────────────────┐          │
│             │                                                │          │
│             │  Back in qc_banner.dart:                       │          │
│             │                                                │          │
│             │  if (error == null) OR                         │          │
│             │  if (error.statusMessage != "Partial Success") │          │
│             │                                                │          │
│             │  THEN: updateOrderDetailStateWithCompleted()   │  ← ⚠️    │
│             │                                                │          │
│             └────────────────────────────────────────────────┘          │
│                                                                          │
└──────────────────────────────────────────────────────────────────────────┘
                              │
                              ▼
┌─────────────────────────────────────────────────────────────────────────────┐
│  updateOrderDetailStateWithCompleted() calls:                               │
│                                                                             │
│  orderDetailsState.updateOrderStatus(                                       │
│    workOrderStatus: MSDynSystemStatus.completed,                            │
│    clockOutDateTime: ExtendedDateTime.current,                              │
│    byPassLocationCheck: true   ← Location check bypassed!                   │
│  )                                                                          │
│                                                                             │
│  This sends PATCH request to:                                               │
│  /bookableresourcebookings/{id}                                            │
│                                                                             │
│  With data:                                                                 │
│  {                                                                          │
│    "BookingStatus@odata.bind": "bookingstatuses(completed-guid)",           │
│    "endtime": "2026-01-14T...",                                            │
│    "rr_clockouttime": "2026-01-14T..."                                     │
│  }                                                                          │
└─────────────────────────────────────────────────────────────────────────────┘
```

### For Non-Clean/Paint Jobs (No QC Required)

```
User taps "Finish Work" button
         │
         ▼
┌─────────────────────────────────────┐
│ Check: hasPopUpWindowFF = TRUE      │
│ Check: hasOptimizeQCFF = TRUE       │
│ Check: workOrderType != Clean/Paint │
└────────────────┬────────────────────┘
                 │
                 ▼
┌─────────────────────────────────────┐
│  Direct call to:                    │
│  updateOrderStatus(completed, now)  │
│                                     │
│  NO QC Banner shown                 │
│  NO Zoom meeting                    │
│  BRB immediately marked Completed   │
└─────────────────────────────────────┘
```

---

## Detailed Workflow - Without Zoom

When QC is not required (feature flags disabled or work order type not eligible):

### Flow:
1. Pro taps **"Start Work"** button
2. BRB status updated to **"In Progress"**
3. Wait 5 minutes minimum + complete all tasks
4. **"Finish Work"** button becomes enabled
5. Pro taps "Finish Work"
6. BRB status updated directly to **"Completed"**

### BRB Updates:
| Action | Field Updated | Value |
|--------|--------------|-------|
| Start Work | `BookingStatus` | In Progress GUID |
| Start Work | `starttime` | Current UTC timestamp |
| Start Work | `rr_clockintime` | Current UTC timestamp |
| Start Work | `endtime` | starttime + duration |
| Finish Work | `BookingStatus` | Completed GUID |
| Finish Work | `endtime` | Current UTC timestamp |
| Finish Work | `rr_clockouttime` | Current UTC timestamp |

---

## Detailed Workflow - With Zoom

When QC is required (full flow):

### Prerequisites:
1. `popUpWindowAttemptToCompleteWorkOrder` = TRUE
2. `optimizeQCWorkFlow` = FALSE, **OR** work order type is **Clean** or **Paint**
3. Pro has been working for at least 5 minutes
4. All work order tasks are completed

### Flow:

#### Step 1: Finish Work Button Press
```
File: lib/screens/order_details/contents/actions_content.dart

onFill: () {
  if (orderDetailsState.hasPopUpWindowAttemptToCompleteWorkOrderFF) {
    if (!orderDetailsState.hasOptimizeQCFF ||
        (orderDetailsState.workOrderType.value == MSDynWorkOrderType.clean ||
         orderDetailsState.workOrderType.value == MSDynWorkOrderType.paint)) {
      showQCBanner(context);  // ← Shows QC Banner
    } else {
      // Direct completion for non-clean/paint work orders
      orderDetailsState.updateOrderStatus(
        workOrderStatus: MSDynSystemStatus.completed,
        clockOutDateTime: ExtendedDateTime.current);
    }
  } else {
    // Direct completion when FF is disabled
    orderDetailsState.updateOrderStatus(...);
  }
}
```

#### Step 2: QC Banner Display
```
File: lib/screens/order_details/contents/qc_banner.dart

Shows a modal with:
- "QC Check" title
- "Yes, Ready" button → Proceeds to QC
- "Not Now" button → Closes modal (no action)
```

#### Step 3: QC Banner "Yes, Ready" Button Logic
```dart
if (hasWaitingRoomFF) {
  var error = await embeddedQC();
  
  if (error != null && error.statusMessage == "Partial Success") {
    // No QC available immediately → Navigate to Waiting Room
    var result = await Routes.router.navigateTo(context, Routes.waitingRoom, ...);
    
    if (result != null) {
      // QC became available
      joinMeeting(qaInfo.zoomMeetingId, qaInfo.zoomMeetingPassword);
      updateOrderDetailStateWithCompleted();
    }
  } else {
    // Either success (QC available) or failure
    updateOrderDetailStateWithCompleted();
  }
} else {
  // Old flow - direct completion
  updateOrderDetailStateWithCompleted();
}
```

#### Step 4: QC Acquire API Call
```
File: lib/services/vendors/vendors_service.dart

Endpoint: POST /vendors/qc/acquire?bookingId={bookableResourceBookingId}

Response Scenarios:
1. Success: Returns zoomMeetingId, zoomMeetingPassword, zoomSdkSignature
2. Partial Success: QC not immediately available (triggers waiting room)
3. Failure: Unable to acquire QC
```

#### Step 5: Waiting Room (If Partial Success)
```
File: lib/screens/quality_check_waiting_room/waiting_room.dart

- Shows animated waiting screen with timer
- Polls qcAcquire API every 5 seconds
- When QC becomes available, returns meeting info
- User can close waiting room (no completion)
```

#### Step 6: Join Zoom Meeting
```
File: lib/screens/meetings/meetings_state.dart

void joinMeeting({id, password, userName, brbId}) {
  // Generate JWT signature
  final signature = _zoom.generateSignature(_sdkKey, _sdkSecret, id, 0);
  
  // Initialize Zoom SDK
  _zoom.initZoom(zoomOptions).then((results) => {
    // Join the meeting
    _zoom.joinMeeting(meetingOptions, true).then(
      (joinMeetingResult) => onJoinMeeting(id, userName, joinMeetingResult)
    );
  });
}
```

#### Step 7: Zoom Meeting Status Flow
```
Meeting Status Transitions:
1. MEETING_STATUS_CONNECTING → Starting connection
2. MEETING_STATUS_IN_WAITING_ROOM → Pro in Zoom waiting room
3. MEETING_STATUS_INMEETING → QC admitted Pro to meeting
4. MEETING_STATUS_DISCONNECTING → Meeting ended
```

#### Step 8: QC Session Management
```dart
// During meeting - Renew session every 30 seconds
_startRenewQcSessionTimer(qcMeetingId) {
  Timer.periodic(Duration(seconds: 30), (timer) {
    _vendorService.qcRenew(qcMeetingId);  // POST /vendors/qc/renew/{id}
  });
}

// On meeting end - Release session
onLeaveMeeting(meetingId) {
  await _vendorService.qcRelease(meetingId);  // POST /vendors/qc/release/{id}
}
```

---

## BRB Data Updates

### Complete Data Flow:

| Event | API Endpoint | BRB Fields Updated |
|-------|-------------|-------------------|
| Start Work | PATCH /bookableresourcebookings/{id} | `BookingStatus`, `starttime`, `rr_clockintime`, `endtime` |
| Finish Work (No QC) | PATCH /bookableresourcebookings/{id} | `BookingStatus`, `endtime`, `rr_clockouttime` |
| Finish Work (With QC) | PATCH /bookableresourcebookings/{id} | `BookingStatus`, `endtime`, `rr_clockouttime` |

### Important Notes:
1. **BRB status is updated BEFORE QC call** - This is significant because the work order is marked as "Completed" before the Zoom meeting happens
2. The `updateOrderDetailStateWithCompleted()` function is called which sets:
   ```dart
   orderDetailsState.updateOrderStatus(
     workOrderStatus: MSDynSystemStatus.completed,
     clockOutDateTime: ExtendedDateTime.current,
     byPassLocationCheck: true
   );
   ```

### Status GUIDs:
| Status | GUID |
|--------|------|
| Scheduled | f16d80d1-fd07-4237-8b69-187a11eb75f9 |
| In Progress | 53f39908-d08a-4d9c-90e8-907fd7bec07d |
| Completed | c33410b9-1abe-4631-b4e9-6e4a1113af34 |
| Canceled | 0adbf4e6-86cc-4db0-9dbb-51b7d1ed4020 |

---

## Edge Cases

### 1. Location-Based Edge Case
```dart
// If locationServiceFlag is enabled and Pro is > 1 mile away
if ((locationServiceFlag && !isInOneMile()) && !byPassLocationCheck) {
  // QC is skipped, telemetry logged
  return;
}
```

### 2. First-Time QC Banner
```dart
// If user hasn't seen the QC banner before
if (!await isVirtualQCBannerHasShown() && !byPassLocationCheck) {
  showVirtualQCBanner = true;  // Shows informational banner first time
  return;
}
```

### 3. Zoom App Not Installed (Old Flow)
```dart
// For oldQC() flow - launches external Zoom app
final zoomLaunched = await launchUrl(Uri.parse('zoomus://...'));
if (!zoomLaunched) {
  showInstallZoomApp = true;  // Shows prompt to install Zoom
}
```

### 4. QC Acquire Failure
```dart
case ApiResultError<QCAcquireResponse>():
  if (!hasWaitingRoomFF || qcInformation.statusMessage != "Partial Success") {
    // Show error to user
    Get.find<ProAppState>().virtualQCError.value = qcInformation;
  }
```

### 5. Waiting Room Timeout/Close
```dart
// User can close waiting room
onTap: () {
  pageClosed = true;
  _timer?.cancel();
  state.sendCloseButtonLog(duration.inSeconds, widget.brbId ?? '');
  Routes.router.pop(context);  // Returns null - no completion
}
```

### 6. Work Order Type Filtering
```dart
// When optimizeQCFF is TRUE, only these types require QC:
if (hasOptimizeQCFF) {
  final isCleanOrPaint = 
    workOrderType.value == MSDynWorkOrderType.clean || 
    workOrderType.value == MSDynWorkOrderType.paint;
  if (!isCleanOrPaint) {
    // Skip QC for: carpetClean, maintenance, repair, flooring, etc.
    return;
  }
}
```

---

## QC App Integration

The QC App is the companion application used by Quality Check personnel.

### Architecture:
- **Platform:** Flutter/Dart, primarily Windows desktop
- **Components:**
  - Checklist Screen - Left panel
  - Zoom Screen - Right panel (Windows uses external Zoom)

### Pro-to-QC Communication:
```dart
// Pro App sends customerKey in Zoom meeting options
final formattedCustomerKey = getFormattedCustomerKey(brbId);
// Format: "{encodedUserType}:{brbIdWithoutDashes}"

// QC App extracts BRB ID from participant info
String parseCustomerKey(List participantsData) {
  // Decodes the customerKey to get:
  // - appSignature (ProApp identifier)
  // - isCrewMember flag
  // - isStandardPro flag
  // - BRB ID
}
```

### QC App Services:
```dart
// QC App API endpoints (quality-controllers)
obtainHost()           // POST /meetings/obtain-host
getZak()              // GET /meetings/get-zoom-user-token
endMeeting(meetingId) // GET /meetings/{id}/end
getServiceDetail(brbId) // GET /workorders/servicedetails?bookingId={brbId}
```

---

## Custom Zoom SDK

The project uses a modified version of the Flutter Zoom SDK.

### Location:
`/Users/hazimrentready/StudioProjects/flutter_zoom_sdk`

### Key Modifications:
1. **Custom Meeting Options:**
   - `customerKey` - Passes BRB ID to QC App
   - `disablePreview` - Skips preview screen
   - Various UI customizations

2. **Platform Implementations:**
   - Android: Uses `mobilertc.aar`
   - iOS: Native Swift plugin
   - Windows: Native C++ plugin

3. **Additional Methods:**
   ```dart
   // Network quality monitoring
   Future<List> networkStatus()
   
   // Participant information
   Future<List<Map<String, dynamic>>> getParticipants()
   
   // Window control
   Future<bool> disableWindowStyles()
   Future<bool> showMeeting()
   Future<bool> hideMeeting({bool isWindows = false})
   ```

---

## Potential Cheating Scenarios

Based on the code analysis with **Production Feature Flag values**, here are the exact scenarios where Pros can bypass QC:

### 🚨 SCENARIO 1: Immediate Leave After Joining Zoom (Most Likely Cheating Method)

**Production Flow:**
1. Pro taps "Finish Work" on Clean/Paint job
2. QC Banner appears, Pro taps "Yes, Ready"
3. `qcAcquire` API returns **Success** with meeting info
4. `joinMeeting()` is called → Zoom meeting starts
5. `updateOrderDetailStateWithCompleted()` is called → **BRB marked as Completed**
6. Pro is now in Zoom meeting
7. Pro clicks "X" button → clicks "Leave Meeting"
8. Meeting ends without QC verification

**Timeline:**
```
T+0s:  Pro taps "Yes, Ready"
T+1s:  qcAcquire API call
T+2s:  joinMeeting() called - Zoom SDK initializes
T+2s:  updateOrderDetailStateWithCompleted() called ← BRB UPDATED TO COMPLETED
T+3s:  Pro enters Zoom waiting room (MEETING_STATUS_IN_WAITING_ROOM)
T+5s:  Pro clicks "X" to close meeting window
T+6s:  Pro clicks "Leave Meeting"
T+7s:  MEETING_STATUS_DISCONNECTING - Meeting ended

RESULT: BRB = Completed, but NO actual QC verification occurred
```

**Code Evidence (meetings_state.dart):**
```dart
catchLog(String status, String meetingId, String? userName) {
  // This DETECTS the cheat but DOES NOT prevent completion
  if (!meetingLogs.contains("MEETING_STATUS_INMEETING") && 
      (status == "MEETING_STATUS_DISCONNECTING")) {
    _telemetryService...event(MeetingInteraction.qcProcessEndWithoutJoinMeetingApp);
    // ⚠️ No code here to reverse the BRB completion!
  }
}
```

**Telemetry Event:** `QC:QCProcessEndWithoutJoinMeetingApp`
- This event IS logged, but the BRB remains Completed

---

### 🚨 SCENARIO 2: qcAcquire Failure Still Completes BRB

**Production Flow:**
1. Pro taps "Finish Work" on Clean/Paint job
2. QC Banner appears, Pro taps "Yes, Ready"
3. `qcAcquire` API returns **Error** (not "Partial Success")
4. Error message shown to user
5. `updateOrderDetailStateWithCompleted()` is STILL called → **BRB marked as Completed**

**Code Evidence (qc_banner.dart, lines 139-143):**
```dart
} else {
  // This else handles BOTH success AND failure!
  updateReadyButtonStatus(true);
  updateOrderDetailStateWithCompleted();  // ← BRB completed even on API failure
  if (context.mounted) Navigator.pop(context);
}
```

**Bug Analysis:**
The condition `error != null && error.statusMessage == "Partial Success"` only handles one specific error type. ALL other errors fall through to the else branch and complete the BRB.

---

### 🚨 SCENARIO 3: Waiting Room Exit (Legitimate Non-Completion)

**Production Flow:**
1. Pro taps "Finish Work" on Clean/Paint job
2. QC Banner appears, Pro taps "Yes, Ready"
3. `qcAcquire` API returns **Partial Success** (no QC available)
4. Waiting Room screen opens
5. Pro waits 10 seconds
6. Pro taps "X" to close Waiting Room
7. Returns `null` to qc_banner.dart
8. **NO BRB update** - Pro can try again later

**This is the ONLY safe path where BRB is NOT updated without QC.**

**Code Evidence (qc_banner.dart, lines 132-138):**
```dart
if (result != null && context.mounted) {
  // Only updates BRB if user waited and got QC
  joinMeeting(qaInfo.zoomMeetingId!, qaInfo.zoomMeetingPassword!);
  updateOrderDetailStateWithCompleted();
}
// If result == null, nothing happens - BRB stays In Progress
```

---

### Summary Table: Cheating Vectors

| Scenario | How Pro Does It | BRB Completed? | Telemetry Logged? | Reversible? |
|----------|----------------|----------------|-------------------|-------------|
| 1. Leave Zoom Early | Click X → Leave Meeting | ✅ YES | ✅ YES (`qcProcessEndWithoutJoin`) | ❌ NO |
| 2. API Failure | (Automatic on backend error) | ✅ YES | ❌ Limited | ❌ NO |
| 3. Waiting Room Exit | Close waiting room | ❌ NO | ✅ YES (`WaitingRoomCloseButton`) | N/A |

---

### Detection Queries for Investigation

To find potentially fraudulent completions:

1. **Find BRB completions without actual QC meeting:**
```sql
-- Find work orders where:
-- - Status = Completed
-- - Work Order Type = Clean or Paint
-- - Has telemetry: QC:QCProcessEndWithoutJoinMeetingApp
-- - Missing telemetry: QC:TotalQCProcessMeetingApp
```

2. **Cross-reference Zoom event logs:**
```
Compare:
- Pro App telemetry: QC:StartedMeetingApp timestamp
- Zoom Server logs: Meeting join time
- Zoom Server logs: Meeting leave time (should be < 30 seconds for cheaters)
- Pro App telemetry: QC:QCProcessEndWithoutJoinMeetingApp
```

3. **Pattern detection:**
```
Flag users who have:
- Multiple QC:QCProcessEndWithoutJoinMeetingApp events
- Average Zoom meeting duration < 30 seconds
- High ratio of QC:StartedMeetingApp to QC:TotalQCProcessMeetingApp
```

---

## Telemetry Events

Key telemetry events for QC monitoring:

| Event | Description |
|-------|-------------|
| `QC:StartedMeetingApp` | Pro started Zoom meeting |
| `QC:FinishedMeetingApp` | Pro finished Zoom meeting |
| `QC:WaitingTotalMeetingApp` | Duration in waiting room before admitted |
| `QC:TotalQCProcessMeetingApp` | Total time in actual QC meeting |
| `QC:QCProcessEndWithoutJoinMeetingApp` | Pro left without completing QC |
| `QC:WaitingRoomWaitingTime` | Time spent in waiting room |
| `QC:WaitingRoomCloseButton` | User closed waiting room |
| `QC:LockRenewAttempt` | Session renewal during meeting |
| `QC:LockReleaseAttempt` | Session released when meeting ends |
| `QC:SkippedByOptimizeQC` | QC skipped due to work order type |
| `QC:UnableAcquireAvailableQC` | Failed to get QC information |
| `QC:GeoLocationStatus` | Location check results |

---

## Recommendations for Investigation

1. **Cross-reference Zoom logs** with `QC:QCProcessEndWithoutJoinMeetingApp` events
2. **Check for patterns** where `QC:WaitingRoomCloseButton` is logged followed by completed work orders
3. **Verify timing** between `rr_clockouttime` and actual Zoom meeting duration
4. **Monitor** cases where BRB status is "Completed" but no `QC:TotalQCProcessMeetingApp` event exists

---

## Recommended Fixes

Based on this analysis, here are the recommended code changes:

### Fix 1: Only Update BRB AFTER Successful QC Meeting Completion

**Problem:** BRB is updated to Completed before/during Zoom meeting, not after.

**Solution:** Move `updateOrderDetailStateWithCompleted()` to be called only when `MEETING_STATUS_DISCONNECTING` is received AND the meeting had `MEETING_STATUS_INMEETING` status (meaning QC actually reviewed).

```dart
// In meetings_state.dart - modify catchLog or onMeetingStatusChanged
if (status == "MEETING_STATUS_DISCONNECTING") {
  if (meetingLogs.contains("MEETING_STATUS_INMEETING")) {
    // QC meeting was actually conducted
    updateOrderDetailStateWithCompleted();  // ← Move here
  } else {
    // Pro left without completing QC
    // Do NOT update BRB to Completed
    // Show error/warning to Pro
  }
}
```

### Fix 2: Handle API Failure Correctly in qc_banner.dart

**Problem:** The else branch catches both success and failure cases.

**Solution:**
```dart
// In qc_banner.dart
if (hasWaitingRoomFF) {
  var error = await embeddedQC();
  
  if (error != null && error.statusMessage == "Partial Success") {
    // Waiting room flow...
  } else if (error == null) {
    // SUCCESS only - Zoom meeting started
    // Don't update BRB here - wait for meeting completion
  } else {
    // FAILURE - API error
    // Do NOT update BRB
    // Just close banner and show error
    Navigator.pop(context);
  }
}
```

### Fix 3: Add Minimum Meeting Duration Requirement

**Solution:** Before allowing meeting to end, check if minimum time has passed:
```dart
// Disable "Leave Meeting" button for first 30 seconds
// Or show confirmation dialog
```
---
