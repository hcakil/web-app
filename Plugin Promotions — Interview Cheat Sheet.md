# Plugin Promotions — Interview Cheat Sheet

**Interview:** S. — 45 min  
**Goal:** Maaşı ilk 5 dakikada tartışmak değil. Görüşmenin sonunda:

> **“I can give this engineer an outcome and trust him to take it to production.”**

dedirtebilmek.

---

# 🚨 15-Second Mental Map

Paragraf ezberleme.

Sadece bunları hatırla:

## ME

**Flutter → Production → Ownership → AI**

## VENUEFLOW

**Problem → Shape → Decisions → Proof → Next**

## PLUGIN

**Devices → Realtime → Reliability → Scale**

## MONEY

**21K doesn't work → Is it a hard ceiling? → Stop talking**

---

# 1. Tell Me About Yourself

## Hafıza yolu

**Flutter → Production → Ownership → Why Plugin**

### Söylenecek ana fikirler

- Flutter benim en güçlü alanım.
- Production application tecrübem var.
- Sadece screen/ticket değil:
  - architecture
  - integrations
  - testing
  - release
  - production debugging
- En sevdiğim çalışma biçimi: outcome alıp uçtan uca sahiplenmek.
- Plugin'i ilginç yapan şey de bu.

### Natural answer

> I'm primarily a product-focused software engineer, with Flutter being my strongest area.
>
> Most of my experience has been around production applications, so my work has gone beyond implementing screens — architecture, integrations, testing, releases and production issues have all been part of the job.
>
> What interested me about this role was the ownership. You're not describing someone working through a ticket queue; you're looking for someone who can take a product problem and carry it through to production.
>
> That's also how I approached the build task.

**STOP.**

İlk cevapta bütün CV'yi anlatma.

---

# 2. Why Plugin Promotions?

## Hafıza yolu

**REAL PRODUCT → SMALL TEAM → AI-NATIVE**

> Three things stood out to me.
>
> First, this is already a real product running on physical devices in live venues.
>
> Second, the team is small enough that engineering ownership actually means something.
>
> And third, the AI-native approach is close to how I think software development is changing — use agents aggressively for throughput, but keep engineering judgement and production acceptance with the engineer.

Public PluginOS ürünü gerçekten fiziksel display'leri telefondan eşleştirme/yönetme, cihaz online/offline durumunu görme, içerik playlist'leri oluşturma ve zamanlama özellikleri sunuyor.

---

# 3. Walk Me Through VenueFlow

## EN ÖNEMLİ HAFIZA YOLU

**PROBLEM → SHAPE → 3 DECISIONS → PROOF → NEXT**

Bunu hatırlarsan geri kalan gelir.

---

## 3.1 PROBLEM

İlk cümle:

> The interesting problem in the assignment wasn't CRUD. It was realtime consistency between two independently running applications.

Ardından:

- Manager menu değiştiriyor.
- Açık POS bunu restart olmadan görmeli.
- İki uygulamanın business logic'i drift etmemeli.
- Write boundary UI'da değil backend'de korunmalı.

Repository'nin kendi framing'i de tam olarak realtime consistency üzerine kurulmuş.

---

## 3.2 SHAPE

Çiz:

```text
Manager Flutter App
        │
        ├──── Shared venueflow_core ──── Firestore
        │       models
        │       repository
        │       money
        │       cart rules
        │
POS Flutter App
```

Ana cümle:

> The applications own presentation and short-lived UI state. The shared package owns behaviour that must remain identical between applications.

Bu mimari repo'da özellikle “small feature-first architecture, not a ceremonial clean-architecture stack” olarak tanımlanıyor.

---

# 4. VenueFlow — The 3 Decisions

## DECISION 1 — Firestore = realtime source of truth

> Both applications observe the same backend state. Manager doesn't need to explicitly notify POS that something changed.

Neden?

- snapshots
- minimum backend surface
- requirement'a doğrudan uyuyor

---

## DECISION 2 — Shared business logic

Shared package:

- models
- repository abstraction
- cart rules
- money
- telemetry contract

> I wanted concepts that must behave identically in both applications to have one implementation rather than slowly drift apart.

---

## DECISION 3 — Deliberate scope

YAPMADIK:

- payment
- fake checkout
- order persistence
- inventory
- complex roles

> I deliberately didn't build features the task didn't require. A smaller complete system was more useful than a larger unfinished one.

Bu önemli çünkü assignment özellikle **scope judgement** ölçüyordu.

Repo da payments/order persistence/roles/inventory'nin bilerek dışarıda bırakıldığını açıkça belirtiyor.

---

# 5. VenueFlow — Small Technical Decisions

## Why integer cents?

> Money stays as integer cents end to end so calculations don't depend on floating-point arithmetic.

```text
priceCents = 1299
not
price = 12.99 double
```

---

## Why repository abstraction?

> Firebase is behind `MenuRepository`, so business logic and widgets don't need Firebase in order to be tested.

---

## Why client-side sorting?

> For this deliberately small menu dataset, adding a composite-index dependency wasn't justified. At larger scale or with more complex querying, I'd move ordering into indexed queries.

---

## Why Cubit?

> The cart state machine is small. I wanted a thin and testable coordinator around immutable state, and Cubit was enough without adding additional ceremony.

### Eğer BLoC geçmişini sorarsa

BLUFF YOK.

> I wouldn't claim years of Bloc experience. Most of my earlier production Flutter work used different state-management approaches. I've been deliberately moving toward more explicit state management, and this project was one place I applied Cubit.

---

# 6. THE STRONGEST STORY — AI Was Wrong

Bu bizim **hero story**.

## Hafıza yolu

**AGENT SAID DONE → REAL DEVICE FAILED → ROOT CAUSE → SECOND BUG → LESSON**

### Story

> The most useful part of the exercise actually happened after the implementation looked finished.
>
> Codex had implemented and deployed Google sign-in and reported it working.
>
> I tried it from a normal Chrome profile and Safari on my phone and it bounced straight back to login.

### Root cause

Firebase Auth domain ile Manager'ın gerçek hosting origin'i uyuşmuyordu.

Gerçek browser storage protection redirect session'ı kaybettiriyordu.

### Sonra ikinci bug

`main.dart.js`:

```text
Cache-Control:
max-age=31536000, immutable
```

Ama Flutter:

```text
main.dart.js
```

dosya adını content-hash etmiyor.

Sonuç:

> A fix could successfully build and deploy but still never reach a returning user.

Repository bu iki olayı ayrıntılı olarak belgeliyor. Ayrıca build boyunca 11 analyze, 11 test run, Rules emulator çalışmaları, 11 release build ve 5 deploy kaydedilmiş.

### THE LINE

> That's the division of labour I want with coding agents: they do the volume; I own the specification and the proof.

Alternatif:

> Generating implementation is getting cheaper. Deciding what should exist and proving that it works in production isn't.

---

# 7. How Do You Use AI?

## Hafıza yolu

**SPECIFY → CONSTRAIN → DELEGATE → PROVE → ACCEPT**

### SPECIFY

Önce behaviour.

```text
Requirement
WHEN ...
THEN ...
```

### CONSTRAIN

Project rules:

- integer cents
- Firestore mapping one place
- pure/testable business rules
- auth in Security Rules

### DELEGATE

Codex:

- implementation
- refactoring
- test drafts
- documentation
- debugging assistance

### PROVE

- analyze
- unit/widget tests
- Firestore Rules emulator
- release builds
- deploy

### ACCEPT

Son kontrol:

**real browser / real device / real deployed artifact**

> The part I never delegate is the claim that something actually works.

Bu yaklaşım repo'daki AI workflow ile birebir uyumlu.

---

# 8. What Would You Build Next?

İlk cevap:

## Multi-venue authorization

Şu anda:

```text
one menu
one approved manager
```

Production direction:

```text
venues/{venueId}/menuItems/{itemId}

Auth custom claims
        ↓
allowed venue IDs
```

> The first thing I'd change is the authorization boundary. The current single-manager shape is correct for the exercise, but it's deliberately wrong for a second venue.

Repository'deki proposed next change de venue-scoped menus + custom claims.

Sonra:

> After that, before inventing more infrastructure, I'd want to understand the real device lifecycle — connectivity, offline behaviour, observability and update strategy.

---

# 9. S. — What Might He Push On?

Kamuya açık profiline göre S. yalnızca recruiter değil; ciddi mobil/Flutter geçmişi var ve kendi Flutter uygulamalarını production'a çıkarmış. Bir uygulamasının milyonlarca indirmeye ulaştığını da paylaşmış.

Bu yüzden:

**Flutter trivia'ya sıfır hazırlıkla girme.**

Ama 100 soru da çalışma.

Sadece şu **5 Flutter anchor** yeter.

---

## 9.1 Widget → Element → RenderObject

```text
Widget
immutable configuration

Element
persistent instance / position in tree

RenderObject
layout + paint
```

Biri `build()` sorduğunda:

> Widgets are immutable descriptions. Elements preserve identity in the tree, while RenderObjects handle layout and painting.

---

## 9.2 build()

> `build()` should describe UI from state and stay free of side effects.

Expensive work / network call / state mutation'ı build içine koyma.

---

## 9.3 Async + widget lifecycle

Hatırla:

```dart
await something();

if (!context.mounted) return;
```

Async işlemden sonra widget dispose edilmiş olabilir.

---

## 9.4 State ownership

Soru:

**Local state mi Cubit mi?**

Düşün:

```text
temporary UI-only state
→ local widget state

business state / multiple consumers / testable transitions
→ Cubit/Bloc/etc.
```

Framework dininden konuşma.

Trade-off konuş.

---

## 9.5 Performance

İlk cevap hiçbir zaman:

> “I put const everywhere.”

olmasın.

Doğrusu:

> I profile first. Then I look for unnecessary rebuilds, expensive work in build/layout, large list behaviour, image/memory pressure and main-isolate work.

---

# 10. Firebase — Likely Pressure Area

İlanın en güçlü requirement'larından biri.

Şunları savunabiliyor ol:

## Firestore snapshots

Realtime stream.

## Security Rules

**UI security değildir.**

> Hiding an edit button is UX. Security Rules are authorization.

## Rules are not filters

Query allowed değilse Firebase:

“izin verilen document'ları getir”

diye filtrelemez.

Query'nin kendisinin rules ile uyumlu olması gerekir.

## Transactions / batches

- atomic multi-write gerekiyorsa batch/transaction
- read-modify-write concurrency varsa transaction düşün

## Offline

Firestore cache yararlı olabilir ama:

> Offline-first UX and conflict semantics are still product decisions. Turning persistence on is not an offline strategy.

---

# 11. React / Vue — DO NOT FAKE IT

Bu konuda gerçek durum:

- Production React experience: **No**
- Production Vue experience: **No**
- Angular: geçmişte kullandın, fakat güncel pratiğin değil
- Recent web delivery: Flutter Web

### Cevap

> I want to be transparent about this one: I don't have production React or Vue experience.
>
> My older web work was primarily Angular, although I wouldn't describe myself as currently sharp in Angular either. More recently, my web-facing work has been Flutter Web.
>
> So React or Vue is a framework-specific gap for me today. The underlying web and application concepts aren't new to me, and I'm comfortable ramping into the stack, but I don't want to overstate experience I don't have.

Sonra önemli line:

> If React or Vue proficiency is expected on day one, that's a gap I'd rather be transparent about. If the expectation is strong product ownership with the ability to ramp into that part of the stack, I'm comfortable with that.

**BU KADAR.**

Savunmaya geçme.

---

# 12. PluginOS — Public Product Teardown

## KNOW THESE, DON'T RECITE THEM

Public PluginOS description:

```text
Phone app
   ↓
QR device pairing
   ↓
Plugin hardware

Device management
- name devices
- tablet / TV displays
- online / offline status

Content
- profiles
- playlists
- image upload
- compression
- reordering

Scheduling
- date/time windows

Account
- Google / Apple / email
```

App Store description bunları açıkça listeliyor.

Website ayrıca kurulumu:

```text
WiFi
→ QR scan
→ upload promotions
```

olarak anlatıyor ve hardware tarafında table displays + TV sticks sunuyor.

Terms sayfasına göre platform Firebase dahil üçüncü taraf servislerle entegre ve cihaz association'ında MAC address kullanıyor.

Brochure'da ayrıca POS ile payment/order entegrasyonunu özel integration fırsatı olarak pazarlıyorlar.

---

# 13. What Their Hard Engineering Problems MAY Be

**Bunlar public facts değil; product architecture inference.**

```text
DEVICE IDENTITY
Who is this physical device?

PAIRING
Can a device be claimed twice?

CONNECTIVITY
Venue WiFi disappears. What happens?

CONTENT SYNC
How does a device know there is new content?

CACHE
How do you know it's displaying the latest asset?

SCHEDULING
Whose timezone wins?

OBSERVABILITY
Online/offline is not enough:
what version?
last heartbeat?
last successful content sync?

ROLLOUTS
How do 700 physical devices safely receive changes?
```

VenueFlow'daki cache/realtime hikâyesi bu dünya ile doğrudan bağlanıyor.

---

# 14. The Four Questions We Ask S.

Dört.

Daha fazla değil.

---

## Q1 — FIELD PROBLEMS

> You have roughly 700 devices in the field now. What production problems consume the most engineering time today — connectivity, device state, content synchronization, updates, or something completely different?

**Best question.**

---

## Q2 — OWNERSHIP

> If you hired the right person tomorrow, what would you want them to completely own within the first 60 to 90 days?

Bize gerçek job description'ı verir.

---

## Q3 — AI

> You describe the team as AI-native. Where are coding agents giving you the most leverage today, and where have you learned not to trust them?

S.'nin teknik/AI ilgisine çok uygun. Kamuya açık son paylaşımlarında da AI framework'lerinin gerçek package API'si ile dokümantasyon arasındaki farkları bizzat inceleyen içerikler paylaşmış.

---

## Q4 — TEAM

> How is engineering structured today, and what would I be working with you on directly versus owning independently?

---

# 15. If He Asks About a PluginOS Architecture Problem

Her şeyi bildiğini iddia etme.

Pattern:

**CLARIFY → FAILURE MODE → SIMPLE DESIGN → TRADE-OFF**

Örnek:

> How would you make device updates reliable?

Önce:

> Are we talking about content updates or application/firmware updates? And does the device need to keep functioning offline?

Sonra düşün.

Bu seni “solution vomiting” yapan developer'dan ayırır.

---

# 16. If He Asks: How Would You Sync Content to Devices?

Bilinmeyen mevcut architecture hakkında iddia YOK.

> I wouldn't choose the transport before understanding the device constraints.
>
> Conceptually I'd want the backend to own desired state, the device to report observed state, and updates to be idempotent.
>
> Whether the notification mechanism is a Firestore listener, FCM wake-up, polling, or a combination depends on the hardware lifecycle and connectivity model.

Güçlü kavram:

```text
DESIRED STATE
what backend wants

OBSERVED STATE
what device actually has
```

Aradaki fark = operational signal.

---

# 17. Why Are You Looking?

Kısa.

> My current company is going through an engineering transition and moving development toward a US-based team. I'm still there during the transition, but it created a natural point for me to think carefully about what I want next.
>
> I'm particularly interested in smaller product teams where I can have broader ownership.

Drama yok.

---

# 18. Compensation

İlk açan SEN OLMA.

Ama sorarsa:

> For a full-time role at this scope, $21,000 wouldn't work for me.
>
> The figure I submitted reflects the level of ownership in the role.
>
> That said, if we both feel there's a strong fit, I'm open to looking at the overall package and structure to see whether there's a workable middle ground.
>
> Is $21,000 a hard ceiling, or is there flexibility for a candidate you really want?

## THEN STOP TALKING.

```text
NO:
Maybe 35?
Maybe 40?
Turkey is cheaper...
I could probably...
```

Sessizlik onların problemi.

---

# 19. If 21K Is a Hard Ceiling

> Understood. I don't think I could make a full-time arrangement work at that level.
>
> Would there be flexibility in the structure — for example reduced hours, equity, or a clearly defined compensation review?

Full-time $21K'ya “okay” deme.

---

# 20. Interview Rescue Routes

Konuşurken kayboldun.

Anahtar kelimeye dön.

## Kendimi anlatırken kayboldum

**Flutter → Production → Ownership → Plugin**

## VenueFlow'da kayboldum

**Problem → Shape → Decisions → Proof → Next**

## Architecture sorusunda kayboldum

**Requirement → Failure mode → Simplest solution → Trade-off**

## AI sorusunda kayboldum

**Specify → Constrain → Delegate → Prove → Accept**

## PluginOS konuşurken kayboldum

**Devices → Realtime → Reliability → Scale**

## Salary'de kayboldum

**21K doesn't work → Hard ceiling? → Silence**

---

# 21. Tomorrow's Win Condition

Interview başarılı demek:

S. şunları düşünmeli:

```text
Flutter                         ✓
Firebase                        ✓
Can ship                        ✓
Can explain decisions           ✓
Doesn't fake knowledge          ✓
Uses AI aggressively            ✓
Doesn't blindly trust AI        ✓
Thinks about real devices       ✓
Understands production failure  ✓
Can own an outcome              ✓
```

React/Vue:

```text
Gap                             YES
Hidden                          NO
Rampable                        MAYBE
```

Bu tek kırmızı noktamızı saklamıyoruz.

Diğer alanlardaki fit'in bunu aşmasına çalışıyoruz.

---

# 22. Ten Minutes Before the Call

Açık tablar:

```text
1. This cheat sheet
2. VenueFlow README
3. docs/architecture.md
4. docs/ai-use.md
5. Live POS
6. Live Manager
```

Kontrol:

```text
POS opens
Manager opens
Login works
Manager edit → POS realtime works
Camera/mic works
Notifications muted
Water nearby
```

Son bakacağın şey:

# Flutter → Production → Ownership → AI

ve

# Problem → Shape → Decisions → Proof → Next

Başka hiçbir şey ezberlemeye çalışma.