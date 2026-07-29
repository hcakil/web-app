`OPUS5_AGUSTOS_PLAN_UPDATE_PROMPT.md`'yi okudum. Dataset hazır olduğu için önceki planın en büyük kalemi (erişim başvuruları ve gecikme riski) tamamen kalktı; o saatler doğrudan baseline ve öğrenmeye kayıyor.

---

# 1. Yeni bilgilerin kararı nasıl değiştirdiği

1. `GERÇEK` — Dataset danışman tarafından verildi. Önceki planın Hafta 1'indeki 4 saatlik "erişim başvurusu" kalemi ve "erişim gelmezse yedek plan" maddesi **iptal**. Ağustos artık risk azaltma ayı değil, üretim ayı.
2. `ÇIKARIM` — Bu, ana kararı değiştirmiyor ama **karakterini** değiştiriyor: tez hâlâ sıklet merkezi, fakat artık "Eylül'de sıfırdan başlamayı önlemek" için değil, ay sonunda çalışan bir baseline ve ilk sonuçlar için.
3. `ÇIKARIM` — Erişim beklemesi olmadığı için tez, "sadece teslim işi" olmaktan çıkıp gerçek bir teknik öğrenme laboratuvarı olabilir. Bu yüzden seçenek A değil **B**'yi seçiyorum: aynı zaman bütçesi, farklı yürütme.
4. `GERÇEK` — Şirket araştırması (QC App V2 ↔ Pro App, Andrey onaylı) iş saatinin içinde. Kişisel bütçeden **tek saat** ayrılmıyor; ayrı bir work-hours planı §9'da.
5. `ÇIKARIM` — Seçenek C (tezden ayrı AI mühendisliği hattı) elendi: iş saatinde mimari araştırma, kişisel zamanda tez varken üçüncü bir teknik hat açmak doğrudan tükenmişlik üretir. AI disiplini ayrı hat değil, tezin **içinde** ölçülen bir pratik olacak.
6. `GERÇEK` — Upwork artık opsiyonel değil, korumalı blok. Bu yüzden plana sabit 1,5 saat/hafta olarak girdi ve iş gelirse hangi bloğun kesileceği önceden yazıldı.
7. `GERÇEK` — Yan projeler motivasyon kaynağı ve kapatılmıyor. İkisine **toplam** 1,5 saat/hafta, dönüşümlü. Bu bir büyütme bütçesi değil, keyif/bakım bütçesi.
8. `ÇIKARIM` — Coursera artık gereksiz değil: dataset hazır olduğu için öğrenilecek konu somutlaştı (tek kanallı görüntü önişleme, transfer learning, yüz doğrulama metrikleri). Ana hedef değil, tezin destekleyici öğrenme hattı olarak 2 saat/hafta.

---

# 2. Tek ana karar

> Ağustos 2026 kişisel zamanının ana sıklet merkezi: **tez — thermal face recognition** üzerinde çalışan bir baseline hattı, ölçülebilir ilk sonuçlar ve tez iskeleti üretmek; bunu aynı zamanda Python/CV/deney disiplini öğrenme laboratuvarı olarak yürütmek.

**Neden A değil B** — İkisi aynı saatleri harcıyor; fark yürütme biçiminde. B, her koşuyu tekrarlanabilir kılmak, metrikleri elle doğrulamak ve deney günlüğü tutmak için yaklaşık %15-20 ek yük getiriyor. Bu yükü kabul ediyorum çünkü tez deneyinde yanlış bir metrik hesabını yakalayacak bir code review yok; yanlış sonuç doğrudan teze gider. Aynı ek yük, sizin en zayıf olduğunuz alanı (AI çıktısını doğrulama) tam olarak en riskli bağlamda çalıştırıyor.

**Neden D ve E değil** — D: NextMatchAI'da 100 gündür ödeme yok, İmarSinyal'de 0 kullanıcı ve 0 görüşme; ölçülmüş talep sinyali olmayan bir kaleme tek aylık pencerede ağırlık vermek en kötü risk/getiri oranı. E: Upwork'e kesin zaman ayrılacak ama ana sıklet merkezi olması, tezin son dönem teslim zorunluluğunun önüne geçmesi anlamına gelir; bu takas mantıklı değil çünkü ek gelir 6 ay için zorunlu değil.

**Neden F değil** — Coursera'yı ana hedef yapmak somut çıktı üretmez; kurs tamamlamak bir teslim değil. Destekleyici konumu doğru konumu.

---

# 3. Kendini geliştirme tanımı

**Bu planda "kendini geliştirme" nedir** — Bilmediğiniz bir alanda (tek kanallı görüntü, PyTorch, yüz doğrulama metrikleri) çalışan bir hat kurmak ve o hattın sonuçlarının doğru olduğunu **kendiniz kanıtlayabilmek**. Kurs izlemek veya makale okumak değil; koşan kod ve doğrulanmış sayı.

**Ay sonunda kanıtlanabilecek yeni beceriler** — Her biri bir dosyayla kanıtlanır, hissiyatla değil:

1. Veri kartı çıkarma: sınıf başına görüntü sayısı, çözünürlük, hizalama durumu, etiket formatı ve **train/val/test bölme kuralının gerekçesi** (`dataset_karti.md`).
2. PyTorch'ta uçtan uca çalışan bir eğitim/değerlendirme hattı yazıp tek komutla koşturma (`run_baseline.py`).
3. Yüz doğrulama ve tanıma metriklerini doğru hesaplama ve yorumlama: rank-1, ROC, EER, TAR@FAR (`deney_protokolu.md`).
4. Deneyi tekrarlanabilir kılma: sabit tohum, konfigürasyon dosyası, koşu günlüğü, sonuç dosyası (`deney_gunlugu.md`).
5. 3 kanallı pretrained bir backbone'u tek kanallı termal girdiye uyarlama (koddaki somut adım).
6. AI ile yazılmış önişleme/metrik kodunu bağımsız doğrulama: elle örnek hesap ve sanity testi (`dogrulama_notu.md`).
7. Yöntem bölümünü deney protokolüne bağlı yazma (tez iskeletinin yöntem bölümü).

**Tez, eğitim ve pratik nasıl birleşiyor** — Zincir tek yönlü: Coursera modülü o haftanın tez teslimini besliyor, tez teslimi de o modülün gerçekten öğrenilip öğrenilmediğinin testi oluyor. Hafta 1'de önişleme modülü veri kartını besler, Hafta 2'de transfer learning modülü baseline'ı, Hafta 3'te metrik modülü sonuç tablosunu, Hafta 4'te tekrarlanabilirlik modülü yöntem bölümünü. Tez teslimine bağlanamayan hiçbir modül izlenmiyor.

**AI bağımlılığı için ne ölçülecek** — Her tez görevi için üç kayıt, fazlası yok: (a) görevin toplam süresi, (b) AI çıktısından düzeltilen önemli hata sayısı, (c) üretilen çözümü AI yardımı olmadan açıklayabildim mi (evet/hayır). Ay sonu hedefi **en az 20 kayıt** ve (c)'nin ölçülmüş oranı. `VARSAYIM` — Bu oran için hedef koymuyorum, çünkü bu ilk ölçüm; taban çizgisi Ağustos'ta kuruluyor.

---

# 4. Coursera kararı

**Kullanılacak mı** — Evet, ama yalnızca destekleyici öğrenme hattı olarak. **Haftada 2 saat**, sabit tavan.

**Tek eksen** — PyTorch ile uygulamalı computer vision. Derin öğrenme teorisi, NLP, MLOps, genel AI mühendisliği bu ayın dışında.

**Modül başlıkları** — `VARSAYIM` — Güncel kurs adlarını doğrulayamıyorum, bu yüzden kurs ismi vermiyorum; Coursera içinde aranacak **modül başlıkları** şunlar:

| Hafta | Aranacak modül başlığı | Beslediği somut teslim |
|---|---|---|
| H1 | *image preprocessing / normalization / data augmentation* (tek kanal ve grayscale işleyen bölümler) | `dataset_karti.md` ve önişleme kararları |
| H2 | *convolutional neural networks* + *transfer learning with pretrained models* | `run_baseline.py` |
| H3 | *face verification / face recognition* ve *embeddings, metric learning*; ayrıca *ROC, threshold, evaluation metrics* | `deney_protokolu.md` ve sonuç tablosu |
| H4 | *reproducible experiments / experiment tracking / reporting results* | Tez yöntem bölümü |

**Coursera 0'a indirilme koşulları** — Şu üçünden biri olursa o haftanın 2 saati kesilir: (a) Upwork'ten iş kabul edildi, (b) gerçek haftalık saat iki hafta üst üste 9'un altına indi, (c) Hafta 2 sonunda baseline tek komutla koşmuyor — bu durumda 2 saat doğrudan baseline'a aktarılır. Kurs tamamlama, sertifika veya ilerleme yüzdesi hiçbir koşulda hedef değil.

---

# 5. Upwork kararı

**Haftalık süre** — 1,5 saat, korumalı blok. **Tarama sıklığı** — 3 × 30 dakika (Pazartesi, Çarşamba, Cumartesi).

**En fazla başvuru** — Ağustos toplamı 5. Dağılım: Hafta 1'de 1, Hafta 2'de 2, Hafta 3'te 2, Hafta 4'te 0 (son hafta tez yazımına ayrıldı).

**Kabul kriterleri** — Dördü birlikte sağlanmalı: kapsam tek cümlede tanımlanabiliyor; tahmini süre 6 saatin altında; teslim tarihi esnek; iş mevcut becerinizin tam içinde (Flutter bug fix, test ekleme, Firebase/API entegrasyonu, küçük UI, package/build sorunu, küçük refactor veya upgrade). Aynı anda **tek iş**.

**İş gelirse zaman nasıl yeniden dağıtılır** — Sıra sabit ve önceden karar verildi: (1) Coursera 2 → 0. (2) Maker bloğu 1,5 → 0,5. (3) Hâlâ yetmiyorsa tez 9 → 7, **en fazla 2 hafta üst üste**. Tez 7'nin altına hiçbir koşulda inmiyor. Kabul edilen işe haftalık üst sınır 6 saat; aşarsa iş teslim edilir ve Ağustos'ta ikinci iş alınmaz.

**Kesin reddedilecekler** — Sıfırdan uygulama geliştirme; kapsamı açık uçlu veya "sonra netleştiririz" işleri; belirsiz kapsamlı sabit fiyat; native iOS/Android ağırlıklı işler; .NET/backend işleri; tasarım/Figma işleri; "bugün acil" teslimler; uzun NDA ve onboarding gerektiren büyük entegrasyonlar; devam eden bir işin üstüne ikinci iş.

---

# 6. NextMatchAI + İmarSinyal keyif/maker bloğu

**Toplam haftalık tavan** — 1,5 saat, iki proje **toplamı**.

**Aynı hafta ikisi birden mi** — Hayır, dönüşümlü: Hafta 1 İmarSinyal, Hafta 2 NextMatchAI, Hafta 3 İmarSinyal, Hafta 4 NextMatchAI. Aynı hafta iki projede iş açılmaz.

**"Küçük düzeltme" tanımı** — Tek oturumda (≤90 dakika) başlayıp bitebilen, yeni bağımlılık eklemeyen, veri modelini veya deploy akışını değiştirmeyen, geri alınabilir değişiklik. Gelen kullanıcı e-postasına cevap da bu bloğun içinde ve en fazla 20 dakika.

**Stop kuralı** — 90 dakikada bitmiyorsa değişiklik geri alınır veya bir not olarak `backlog.md`'ye yazılır ve **Ağustos içinde tekrar açılmaz**.

**Büyük işe dönüşmesini engelleyen sınırlar** — Yeni feature yok, yeni otomasyon yok, Codex ile yeni geliştirme akışı yok, kapsam genişletmesi yok, SEO içeriği yok, satış veya outreach sprinti yok, funnel ölçümü kurulumu yok (Eylül sonrasına). Bu blok kanıt üretmek için değil, motivasyonu korumak için var; ölçülen tek şey tavanın aşılmamış olması.

---

# 7. Haftalık kişisel zaman bütçesi

`ÇIKARIM` — Teorik maksimum 23-28 saat. Bunu doldurmuyorum. Üç gerekçe: iş saatinizde artık bilişsel yükü yüksek bir araştırma işi var (Tech Story); Eylül'de tez yükü artacak, dolayısıyla Ağustos yorgunluk borcu bırakmamalı; ve aile düzeni gerçek bir kısıt.

| Kalem | Saat/hafta |
|---|---|
| Tez (ana sıklet merkezi) | 9 |
| Coursera (destekleyici öğrenme hattı) | 2 |
| Upwork (açık kapı 1) | 1,5 |
| Maker / bakım (açık kapı 2) | 1,5 |
| Haftalık değerlendirme | 0,5 |
| **Taahhüt edilen toplam** | **14,5** |
| **Hard cap** | **17** |
| **Tampon / dinlenme** | **2,5** |

**Hafta içi dağılım** — 4 gün × 2 saat = 8 saat. Bir hafta içi günü tamamen boş bırakılıyor; bu bir tampon değil, kural. Hard cap içinde hafta içi üst sınır 10 saat.

**Hafta sonu dağılım** — 6,5 saat taahhüt: Cumartesi 4, Pazar 2,5. Hard cap içinde hafta sonu üst sınır 7 saat.

Tampon kullanılmazsa dinlenmeye kalır; başka işle doldurulmaz. **Şirketin 40 saati bu tabloda yok.**

---

# 8. Dört haftalık Ağustos planı

Takvim: 29 Temmuz-2 Ağustos açılış (ilk 72 saat + hafta sonu), Hafta 1: 3-9 Ağustos, Hafta 2: 10-16, Hafta 3: 17-23, Hafta 4: 24-30, **31 Ağustos Pazartesi: karar kapısı**.

## Hafta 1 — 3-9 Ağustos

| Kalem | Saat | Somut teslim | Tamamlanma kriteri |
|---|---|---|---|
| Ana çalışma: dataset keşfi + literatür | 9 (5 + 4) | `dataset_karti.md`, keşif notebook'u, `literatur.md` | Sınıf başına görüntü dağılımı ve bölme kuralı gerekçeli yazılı; kaynak tablosunda 12+ satır, 5'i derin okunmuş |
| Coursera: görüntü önişleme | 2 | Önişleme kararları notu (normalizasyon, tek kanal, hizalama) | Her karar dataset kartındaki bir gözleme bağlanmış |
| Upwork | 1,5 | 3 tarama notu + 1 başvuru | Tekrar eden beceri listesi yazılı; başvuru gönderilmiş |
| Maker: İmarSinyal | 1,5 | Akış kontrolü + en fazla 1 küçük düzeltme | Tavan aşılmamış |

## Hafta 2 — 10-16 Ağustos

| Kalem | Saat | Somut teslim | Tamamlanma kriteri |
|---|---|---|---|
| Ana çalışma: baseline hattı + değerlendirme protokolü | 9 (6 + 3) | `run_baseline.py`, `deney_protokolu.md` | `python run_baseline.py` tek komutla koşuyor, bir metrik üretiyor ve sonucu dosyaya yazıyor; protokolde her karşılaştırma için tek ölçülebilir metrik tanımlı |
| Coursera: CNN + transfer learning | 2 | Backbone seçim notu (tek kanala uyarlama dahil) | Seçim baseline kodunda uygulanmış |
| Upwork | 1,5 | 3 tarama + 2 başvuru | Başvurular kabul kriterlerine uygun |
| Maker: NextMatchAI | 1,5 | Küçük düzeltme veya inbound cevap | Tavan aşılmamış, yeni feature açılmamış |

## Hafta 3 — 17-23 Ağustos

| Kalem | Saat | Somut teslim | Tamamlanma kriteri |
|---|---|---|---|
| Ana çalışma: ilk sonuçlar + AI doğrulama ölçümü | 9 (6 + 3) | Sonuç tablosu (3-4 koşu), `deney_gunlugu.md`, `dogrulama_notu.md` | Her koşu günlükten birebir tekrar üretilebiliyor; metrik hesabı elle bir örnek üzerinde doğrulanmış; 3 metriğin en az 12 kaydı var |
| Coursera: yüz doğrulama metrikleri | 2 | Metrik notu (rank-1, ROC, EER, TAR@FAR) | Metrikler baseline çıktısında hesaplanıyor |
| Upwork | 1,5 | 3 tarama + 2 başvuru | Ağustos başvuru toplamı 5'e ulaştı |
| Maker: İmarSinyal | 1,5 | Akış kontrolü | Tavan aşılmamış |

## Hafta 4 — 24-30 Ağustos

| Kalem | Saat | Somut teslim | Tamamlanma kriteri |
|---|---|---|---|
| Ana çalışma: tez iskeleti + danışman paketi | 9 (6 + 3) | 6-10 sayfalık iskelet (giriş + yöntem taslağı), 2-3 sayfa danışman paketi | Yöntem bölümü Hafta 2 protokolüyle tutarlı; paket gönderilmiş ve toplantı talebi iletilmiş |
| Coursera: tekrarlanabilirlik ve raporlama | 2 | Tekrarlanabilirlik kontrol listesi | Liste `run_baseline.py` üzerinde uygulanmış |
| Upwork | 1,5 | 3 tarama + Ağustos kanal özeti | Yeni başvuru yok; özet yazılı |
| Maker: NextMatchAI | 1,5 | Küçük düzeltme veya inbound cevap | Tavan aşılmamış |

---

# 9. Ayrı work-hours mini planı (kişisel bütçeye dahil değil)

Andrey'in onayladığı QC App V2 ↔ Pro App entegrasyonu Tech Story araştırması. Bu plan 40 saatin içinde yürür ve yukarıdaki hiçbir bloktan saat düşmez.

**Araştırma başlıkları** — Entegrasyon yüzeyi (kimlik/oturum paylaşımı, ortak veri modeli, iki uygulama arasında navigasyon ve durum devri); Zoom yerine LiveKit'e geçişin entegrasyona etkisi; feature flag ve mock screen stratejisi; paylaşılan kodun sınırı (`rr_ui_kit`, `rr_utils`, `rr_telemetry` hangi parçalar ortaklaşabilir); telemetri ve oturum korelasyonu (`app-session-id` iki uygulama arasında nasıl izlenir).

**Teslimler** — (1) Entegrasyon yüzeyi haritası, (2) 2-3 entegrasyon seçeneği ve trade-off tablosu, (3) feature flag / mock screen yaklaşımı, (4) ADR taslağı, (5) POC kapsam önerisi.

**İlk hafta çıktısı** — Entegrasyon yüzeyi haritası, açık soru listesi ve Andrey ile 30 dakikalık hizalama görüşmesi. Bu görüşmeden çıkan tek şey netleşmeli: hangi entegrasyon sorusunun cevaplanması bekleniyor.

**POC'ye geçiş kriteri** — Dördü birlikte sağlanmadan POC yazılmıyor: entegrasyon seçeneği yazılı olarak seçilmiş; feature flag adı ve kapsamı belirlenmiş; POC'nin cevaplayacağı **tek** soru tanımlanmış; POC tahmini 3 iş gününün altında.

**Repo audit bulgularının ticket'lara dönüşümü** — Üç ayrı ticket, üç ayrı PR, sırayla:
- **Ticket 1 (öncelikli, güvenlik):** `REPO_AUDIT.md` Candidate 1 — `lib/services/api/api_service.dart:41-45` TLS bypass'ını ortam bazlı hale getirme. Kabul kriteri: production konfigürasyonunda callback'in kurulmadığını kanıtlayan test + mock server E2E'nin geçmesi.
- **Ticket 2:** Candidate 2 — `request_addon_form.dart` controller lifecycle ve tekrarlanan `didUpdateWidget` mantığı. Kabul kriteri: addon değişiminde eski controller'ların dispose edildiğini doğrulayan widget testi.
- **Ticket 3 (önce karar, sonra iş):** Candidate 3 — `request_addon_bundled` akışının canlı olup olmadığını feature flag ve telemetriyle doğrula; sonucuna göre ya sil ya da ortak dosyaları tekilleştir. Bu ticket **araştırma** olarak açılır, implementasyon olarak değil.
- Küçük bulgular (R8 kayıtsız route sabiti, R9 tekrarlanan `AppConfig().load()` ve no-op `FutureBuilder`, R10 her 4xx'in fatal işaretlenmesi) için ayrı ticket açılmıyor; ilgili dosyaya başka bir iş için dokunulduğunda fırsatçı olarak düzeltilir.

---

# 10. 31 Ağustos çıktıları

Ölçülebilir liste; her satır bir dosya veya sayı:

1. `dataset_karti.md` — sınıf başına görüntü dağılımı, çözünürlük, hizalama durumu, gerekçeli train/val/test bölme kuralı.
2. `literatur.md` — en az 12 satır, 5'i derin okunmuş, her satırda "bizim işimize etkisi" kolonu dolu.
3. `run_baseline.py` — tek komutla koşan, sonucu dosyaya yazan çalışan hat.
4. `deney_protokolu.md` — metrikler (rank-1, ROC, EER, TAR@FAR), split, tohum, karşılaştırma tanımları.
5. Sonuç tablosu — en az 3 koşu ve aralarındaki farkın tek cümlelik açıklaması.
6. `deney_gunlugu.md` — en az 5 koşu kaydı, hepsi tekrar üretilebilir.
7. AI kullanım ölçümü — en az 20 kayıt (süre / düzeltilen önemli hata sayısı / AI olmadan açıklayabildim mi) ve üçüncü metriğin ölçülmüş oranı.
8. `dogrulama_notu.md` — metrik hesabının elle doğrulandığı en az 1 örnek.
9. Tez iskeleti — 6-10 sayfa, giriş ve yöntem taslağı dahil, yöntem protokolle tutarlı.
10. Danışman paketi — gönderilmiş, 2-3 sayfa, açık sorular listesiyle.
11. Upwork — 5 başvuru gönderilmiş, 12 tarama yapılmış, tekrar eden beceri listesi yazılı, gelen görüşme/iş sayısı kayıtlı.
12. Coursera — 4 modül notu, her biri o haftanın teslimine bağlanmış.
13. Maker — 4 hafta boyunca haftalık 1,5 saat tavanının aşılmadığının kaydı.
14. Gerçek haftalık saat kaydı — 4 hafta.

---

# 11. Zaman kesme sırası

Kapasite düşerse kesme sırası önceden sabit; hafta ortasında yeniden pazarlık yok:

1. **Coursera** (2 → 0). İlk kesilen, çünkü tek başına teslim üretmiyor.
2. **Maker bloğu** (1,5 → 0,5). Yalnızca arıza kontrolü kalır.
3. **Upwork** (1,5 → 0,5). Tek tarama kalır; **sıfıra indirilmez**, kanal kapanmaz.
4. **Tezin ikinci görevi** (haftalık 3 saatlik ikinci kalem) ertelenir.
5. **En son korunan: tezin birinci görevi** — dataset keşfi, baseline, sonuçlar, iskelet. Bu kalem hiçbir koşulda sıfırlanmaz ve haftalık 6 saatin altına inmez.

Tek istisna: Upwork'ten iş kabul edilirse §5'teki yeniden dağıtım sırası geçerlidir ve tez 7 saatin altına inmez.

---

# 12. Yapılmayacaklar

1. Şirket işlerini (Tech Story araştırması, POC, TLS/lifecycle/duplication ticket'ları) kişisel zamanda yapmak.
2. Kişisel haftalık 17 saat hard cap'ini aşmak veya tampon saatleri işe doldurmak.
3. NextMatchAI veya İmarSinyal'de yeni feature, yeni otomasyon, SEO içeriği, kampanya veya satış sprinti açmak.
4. Aynı hafta iki yan projede birden iş açmak.
5. Ağustos'ta 5'ten fazla Upwork başvurusu, kapsamı belirsiz iş veya aynı anda ikinci iş kabul etmek.
6. Coursera'da sertifika, kurs tamamlama yüzdesi veya tez teslimine bağlanmayan modül peşine düşmek.
7. Tezde model mimarisi optimizasyonuna veya son doğruluk kovalamacasına girmek — Ağustos'un işi çalışan ve doğrulanmış bir baseline.
8. Tezden ayrı üçüncü bir teknik öğrenme hattı (LLM reliability, prompt/skill sistemleri, structured output) açmak.
9. Yeni proje, yeni SaaS, yeni araç ekseni başlatmak.
10. Eylül'e yarım kalmış deney, çalışmayan kod veya belgelenmemiş sonuç bırakmak.

---

# 13. İlk 72 saat (29-31 Temmuz)

1. **Kişisel plan** — Bu bütçeyi takvime yaz: 4 hafta içi günü × 2 saat, Cumartesi 4, Pazar 2,5; bir hafta içi gününü boş olarak işaretle. Gerçek saat kaydı için tek bir dosya aç. Süre: 30 dakika.
2. **Tez** — Danışmandan gelen dataset'i indir, aç ve tek oturumda ilk envanteri çıkar: kaç kişi, kaç görüntü, format, çözünürlük, etiket yapısı. `dataset_karti.md`, `literatur.md`, `deney_protokolu.md`, `deney_gunlugu.md`, `dogrulama_notu.md` iskeletlerini oluştur. Süre: 2 saat.
3. **Coursera** — Yalnızca Hafta 1 için "image preprocessing / normalization / data augmentation" modülünü seç ve kaydet. Başka kurs açma, ders izlemeye başlama. Süre: 20 dakika.
4. **Upwork** — İlk 30 dakikalık taramayı yap ve kabul/ret kriterlerini profilinin yanına yazılı olarak koy; böylece ilk cazip ama kapsamsız iş geldiğinde karar hazır olur. Süre: 30 dakika.
5. **Maker** — İmarSinyal'de Codex ile yeni geliştirme akışını durdur ve haftalık taahhüdü 1,5 saatlik dönüşümlü bloğa indir; kapanan işleri `backlog.md`'ye not et. Süre: 1 saat.