# Payouts screen – entities and where to check (deductions)

## Screen structure (brief)

- **Date sections**: Each section has a date range (start/end), total $, and pay date.
- **Row 1**: One row per “group” – shows **Price $**, **service date**, **service type** (e.g. Paint), work order name, expand arrow.
- **Row 2**: When user taps Row 1, **inner details** open – multiple lines, each with **name/title** and **price**.

---

## 1. Where does the data come from? (Firebase)

All payout data is loaded via:

- **`PayoutsState.getPayouts()`**  
  → **`_bookableResourceService.getPaySummaryAndPayrollItem()`**

That method is implemented in:

- **`lib/services/bookableresource/bookableresource_store_service_async.dart`** (Firebase path)

So the data is **not** coming from a “payouts” API; it comes from the **bookable resource** flow, which reads from **Firebase Firestore**.

---

## 2. Firebase collections used

| Firebase collection   | Dart model           | What it’s used for |
|-----------------------|----------------------|--------------------|
| **`rr_paysummary`**   | **PaySummary**       | Past pay periods (date ranges, pay total). Each doc is one period. |
| **`rr_payrolllineitems`** | **RRPayRollLineItem** | Every line that has a price and service info (current period and past periods). |

Flow in code:

1. **Bookable resource** is fetched (by user id).
2. **Pay summaries** for that resource are fetched from **`rr_paysummary`** (past periods).
3. For each pay summary, **payroll line items** linked to it are fetched from **`rr_payrolllineitems`**.
4. **Current period** line items (not yet linked to a pay summary) are fetched from **`rr_payrolllineitems`** with `rr_linkedpaysummary@id == null`.

So **both Row 1 and Row 2** ultimately use the same Firestore collection: **`rr_payrolllineitems`**.

---

## 3. Row 1 – what is it? Which entity?

- **UI**: One **PaymentItem** per “group” (price, service date, service type e.g. Paint).
- **Model**: **PayRollLineGroup** (from `lib/models/dto/pay_summary_group.dart`).
  - It’s a **group** of several **RRPayRollLineItem** (same entity, multiple docs from `rr_payrolllineitems`).
  - Fields you see on Row 1 come from this group:
    - **Price** → `PayRollLineGroup.groupCost` (sum of `rr_paydeduction` of items in the group).
    - **Service date** → `PayRollLineGroup.serviceDate`.
    - **Service type (e.g. Paint)** → `PayRollLineGroup.header` (from work order type or crew name).

So:

- **Entity behind Row 1**: **RRPayRollLineItem** (Firebase **`rr_payrolllineitems`**), aggregated into **PayRollLineGroup** in app code.
- **Where Row 1 is built**: **`lib/screens/payouts_one_app/payouts_screen_state.dart`**  
  - `addCurrentPeriodItem()` and `addPastPeriodItems()` build **PayRollLineGroup** from **RRPayRollLineItem** and append to **PaySummaryGroup.payRollGroups**.
- **Where Row 1 is rendered**: **`lib/screens/payouts_one_app/payouts_screen.dart`** (ListView → PaymentHeader + **PaymentItem** per `groupWorkOrder.payRollGroups`).

**Short answer for “which entity for Row 1?”**  
- **Firebase**: **`rr_payrolllineitems`** (plus **`rr_paysummary`** for which period the group belongs to).  
- **In-app**: **PayRollLineGroup** (DTO built from multiple **RRPayRollLineItem**).

---

## 4. Row 2 – what is it? Which entity?

- **UI**: The expandable lines under Row 1 – each line has **name/title** and **price**.
- **Model**: Each line is one **RRPayRollLineItem** (from `lib/models/crm/rr_payrolllineitem.dart`).
- **Widget**: **PayrollLineItem** (in `lib/screens/payouts_one_app/widgets/payroll_line_item.dart`).

So:

- **Entity for Row 2**: **RRPayRollLineItem** (Firebase **`rr_payrolllineitems`**).
- **Where Row 2 is rendered**: **`lib/screens/payouts_one_app/widgets/payment_item.dart`**  
  - Inside the expanded section: `for (RRPayRollLineItem payrollItem in widget.payrollLineItem)` → **PayrollLineItem** for each item.  
  - Row 2 fields:
    - **Title/name** → `payrollItem.rr_workorderservice?.msdyn_name ?? payrollItem.rr_name`.
    - **Price** → `payrollItem.rr_paydeduction`.

**Short answer for “which entity for Row 2?”**  
- **Entity**: **RRPayRollLineItem** (Firebase **`rr_payrolllineitems`**).  
- **Widget**: **PayrollLineItem**.

---

## 5. Deductions – where to check (feature doc “showing deductions logic”)

The **price** shown on both Row 1 and Row 2 is the **deduction** amount from the backend:

- **Field**: **`RRPayRollLineItem.rr_paydeduction`** (see `lib/models/crm/rr_payrolllineitem.dart`).

Places that implement “deductions” (reading/displaying this field):

| Where | File | What to check |
|-------|------|-------------------------------|
| **Totals and group cost** | `lib/screens/payouts_one_app/payouts_screen_state.dart` | `addCurrentPeriodItem()` and `addPastPeriodItems()`: `total += payRollLineItem.rr_paydeduction ?? 0`, and `groupCost += payRollLineItem.rr_paydeduction ?? 0`. All “price” logic for sections and Row 1 is based on **rr_paydeduction**. |
| **Row 1 price** | `lib/screens/payouts_one_app/payouts_screen.dart` | **PaymentItem** gets `price: '${payrollGroup.groupCost.toPrecision(2)}'` – `groupCost` is the sum of **rr_paydeduction** for that group (set in state above). |
| **Row 2 price** | `lib/screens/payouts_one_app/widgets/payment_item.dart` | **PayrollLineItem** is called with `price: (payrollItem.rr_paydeduction ?? 0).toPrecision(2)`. |
| **Inner line display** | `lib/screens/payouts_one_app/widgets/payroll_line_item.dart` | Renders the `price` passed in (which is **rr_paydeduction**). |

So for the **“deductions”** part of the feature doc:

1. **Data source**: Firebase **`rr_payrolllineitems`** documents; field **`rr_paydeduction`** (or equivalent name in Firestore).
2. **Mapping to model**: **`RRPayRollLineItem.rr_paydeduction`** in `lib/models/crm/rr_payrolllineitem.dart`.
3. **Where deductions are used**:
   - **State**: `payouts_screen_state.dart` – building groups and totals from **rr_paydeduction**.
   - **Row 1**: `payouts_screen.dart` – group price = sum of **rr_paydeduction** for that group.
   - **Row 2**: `payment_item.dart` + `payroll_line_item.dart` – each line’s price = **rr_paydeduction** of one **RRPayRollLineItem**.

If the feature doc describes **new** deduction rules (e.g. filter by type, or show a separate “deductions” section), the right place to add that is:

- **State**: `payouts_screen_state.dart` (filtering/grouping/summing).
- **UI**: `payouts_screen.dart` (section/header) and/or `payment_item.dart` / `payroll_line_item.dart` (how each row/line is shown).

---

## 6. Quick reference

| Question | Answer |
|----------|--------|
| **Row 1 – which entity from Firebase?** | **`rr_payrolllineitems`** (RRPayRollLineItem), aggregated into **PayRollLineGroup** in app. Date sections also use **`rr_paysummary`**. |
| **Row 2 – which entity?** | **RRPayRollLineItem** (Firebase **`rr_payrolllineitems`**). One doc per inner row. |
| **Where are deductions shown?** | **rr_paydeduction** in state (totals, groupCost), PaymentItem (Row 1 price), PayrollLineItem (Row 2 price). |
| **Where to implement new deduction logic?** | **payouts_screen_state.dart** (data/grouping) and **payouts_screen.dart** / **payment_item.dart** / **payroll_line_item.dart** (UI). |
