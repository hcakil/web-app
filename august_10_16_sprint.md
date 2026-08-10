# 10–16 Ağustos 2026 — Proxify ve kariyer kontrol sprinti

**Haftanın tek cümlelik hedefi:** 16 Ağustos'ta açılacak Proxify Flutter/Codility değerlendirmesine sakin ve ölçülmüş biçimde hazırlanırken başvuru sistemini kaybetmeden sürdürmek.

## 1. Proxify için kesin bildiklerimiz

| Bilgi | Kaynak / güven |
|---|---|
| Flutter teknik değerlendirmesi | Kişisel Proxify kartı — kesin |
| 16 Ağustos 2026, 00:00 İstanbul saatinde açılıyor | Kişisel Proxify kartı — kesin |
| Kişisel kartta 3 görev ve 90 dakika | Kişisel Proxify kartı — hazırlık için esas |
| Başladıktan sonra duraklatma yok | Proxify kuralları — kesin |
| Başlatmak için 7 gün; kaçırma veya başarısızlıkta 6 ay bekleme | Kişisel modal — kesin |
| Sonuç/ilerleme bilgisi 48 saat içinde | Proxify kuralları — kesin |
| Gerçek hayat problem çözme, kod yazma/inceleme ve teknik bilgi | Proxify açıklaması — kesin |
| Görevlerin tam biçimi | Bilinmiyor; aşağıdaki dağılım yalnızca çalışma varsayımı |

**Karar:** 16 Ağustos açılış tarihidir, sınavı aynı dakika almak zorunda değilsin. **Birincil sınav hedefi 19 Ağustos Çarşamba 21:00–23:00; yedek blok 21 Ağustos Cuma 21:00–23:00.** Bu saatler kişisel takvim hedefidir; davet e-postasındaki kesin son tarih her zaman üstündür. Ali Kerem için kesintisiz zaman doğrulanmadan ve ekrandaki kurallar yeniden okunmadan “Start” düğmesine basma.

## 2. Muhtemel görev dağılımı — çalışma varsayımı

Bu liste sızdırılmış soru değildir; üç farklı beceriyi prova etmek için güvenli bir simülasyondur.

1. **Dart problem çözme:** collection dönüşümü, null safety, edge-case ve karmaşıklık.
2. **Flutter kod okuma / hata düzeltme:** state, lifecycle, `BuildContext`, async, rebuild veya widget testi.
3. **Teknik soru veya kısa pratik:** mimari, test, hata modelleme, performans ya da platform davranışı.

Her provada süre dağılımı: **5 dk tarama + 25 dk görev 1 + 25 dk görev 2 + 25 dk görev 3 + 10 dk son kontrol.** Bir görevde 8 dakikadan fazla kilitlenirsen varsayımı yaz, çalışan en küçük çözümü bırak ve ilerle.

## 3. Günlük çalışma planı

| Tarih | Kişisel blok | Teslim / durma koşulu |
|---|---:|---|
| **10 Ağu Pzt** | 90 dk | Assessment kuralları kontrolü; 3 parçalı tanı provası; yanlışların listesi. Yeni repo yok. |
| **11 Ağu Sal** | 90 dk | Dart: list/map/set, null safety, async/await, exception; 2 küçük timed problem. |
| **12 Ağu Çar** | 90 dk | Flutter: lifecycle, keys, `BuildContext`, state/rebuild, layout; 1 bug-fix egzersizi. |
| **13 Ağu Per** | 90 dk | Repository + typed result/error; transport hatasını domain ve UI durumuna eşleme; 2 test. |
| **14 Ağu Cum** | 120 dk | Tek sayfalık mini görev: form/dropdown/persistence; 5 test hedefi değil, sınav temposu. Son 30 dk native köprü özeti. |
| **15 Ağu Cmt** | 120 dk | Tam **3 görev / 90 dk** prova; kalan 30 dk yalnız hata analizi ve kısa not. |
| **16 Ağu Paz** | 45–60 dk | Hafif tekrar, cihaz/bağlantı kontrolü, dinlenme. Açılır açılmaz sınava girme zorunluluğu yok. |

Toplam: **8 saat 45 dakika–9 saat.** Yanlış sayısından çok, aynı hata sınıfının ikinci kez tekrarlanmaması ölçülür.

### Native köprü özeti — en fazla 30–45 dakika

- iOS push: APNs izin/token akışı, foreground/background davranışı; Swift `struct` değer tipi, `class` referans tipi.
- Android: kısa iş için WorkManager, uzun/aktif kullanıcı işi için uygun Service türü; Android 8+ Notification Channel zorunluluğu.
- Error mapping: HTTP/timeout/parsing hatasını typed infrastructure error → domain failure → kullanıcı mesajına dönüştürme.

Bu başlıklar Micro1 geri bildirimini kapatır; Proxify haftasını native hazırlığa çevirmez.

## 4. Sınav günü protokolü

1. Laptop/masaüstü, güncel desteklenen tarayıcı, güç adaptörü ve sabit internet.
2. Proxify/Codility ekranındaki o teste özel kaynak, IDE, kamera ve copy/paste kurallarını yeniden oku; genel internet tavsiyesine güvenme.
3. Telefon sessizde; Ali Kerem için kesintisiz zaman önceden netleştirilmiş olsun.
4. İlk 5 dakika bütün görevleri tara. Kolay puanı önce al.
5. Örneklerin geçmesi bitirdiğin anlamına gelmez: boş giriş, tek eleman, duplicate, null/async ve hata yolunu kontrol et.
6. Son 10 dakikayı derleme, isimlendirme ve edge-case kontrolüne bırak.

## 5. Başvuru stratejisi: yapıştırıp geçmeyi tamamen yasaklamıyoruz

### A şeridi — haftada 3–4 yüksek uyumlu başvuru

Üç kapının tamamı geçmeli: Flutter/mobile rolü; Türkiye'den remote/B2B olasılığı; tecrübe seviyesi makul. Her biri için 15–20 dakika: doğru CV, iki kanıt cümlesi, uygun kişi arama ve takip tarihi.

### B şeridi — Easy Apply piyangosu

**Günde en fazla 2 ilan veya 15 dakika; hangisi önce dolarsa dur.** Ülke/çalışma izni kesin engelse, rol Flutter/mobile değilse veya ilan junior/Director uçlarındaysa başvurma. Böylece kaderi zorlarsın ama Proxify ve aile zamanını kumara vermezsin.

Bu hafta A şeridinde öncelik: Jumpspeak, Netguru, Colada ve uygunluk doğrulanırsa Lighthouse/PALO IT. Düşük uyumlu başvurular tabloda görünür, ancak networking ve CV zamanı almaz.

## 6. Networking: önce liste, sonra mesaj

Hiring manager, ilana recruiter gibi cevap veren herkes değildir. **Recruiter:** Talent Acquisition / Technical Recruiter. **Hiring manager:** Engineering Manager, Head of Mobile, Mobile Engineering Lead veya ekibin Director of Engineering'i. Ihor recruiter/HR temasıdır; hiring manager değildir.

Bu hafta dört kör mesaj yerine önce 8 kişilik mini harita çıkar:

- 3 eski çalışma arkadaşı veya yönetici,
- 2 UK/USA'da yazılım yapan tanıdık,
- 1 Türkiye'den yurt dışına çalışan tanıdık,
- 1 mobile recruiter,
- 1 yüksek uyumlu ilanın engineering manager'ı.

Sonra **4 kişiye** yaz: 2 eski çalışma arkadaşı, 1 mobile recruiter ve 1 yüksek uyumlu ilanın hiring manager'ı. Hiring manager bulunamadıysa recruiter'la değiştirme; ilgili şirketin Engineering Manager / Head of Mobile / Mobile Lead kişisini önce belirle. Mesaj “bana iş bul” değil, yeniden temas + tek net istek olmalı.

**Eski çalışma arkadaşı**

> Selam [isim], uzun zaman oldu. RentReady'de geçiş dönemi başladığı için remote Senior Flutter/Mobile rollerine bakıyorum. Bir ara birlikte çalışmak benim için iyiydi; sen nasılsın? Çevrende uygun bir ekip duyarsan bir sayfalık CV'mi paylaşabilir miyim?

**Yurt dışında çalışan tanıdık**

> Selam [isim], bulunduğun pazarda Türkiye'den remote/B2B mobile işe alımı şu an gerçekten nasıl? 10 dakikalık bir gerçeklik kontrolü rica edecektim; uygun görürsen profilimi de yollarım.

**Recruiter / hiring manager**

> Hi [Name] — I applied for [role]. I have 8+ years in mobile and 4+ years shipping Flutter products, including offline workflows, API integrations and production debugging. The role's [specific requirement] maps directly to [one proof]. Is Turkey-based remote/B2B engagement possible for this team?

Mesaj gönderimi bu sayfanın otomatik işi değildir; isimleri seçtikten sonra kişiselleştirilir.

## 7. Repo, tez ve AI/OpenCode sırası

| Konu | Bu hafta | Sonraki adım |
|---|---|---|
| `flutter-reliable-workflow` | Donmuş, **terk edilmedi** | 17–23 Ağu: Cubit UI + offline queue + 5 test + GIF; sonra pin |
| `flutter-fundamentals-2` | Proxify egzersiz alanı | Pinlenmez; hızlı drill ve assessment lab olarak kalır |
| `nextmatchai-case-study` | Tamam/pinli | Yeni özellik yok |
| `atama-enrichment-mvp` | Bu sprint dışında | Sadece gerçek emlakçı pilotu varsa diğer konuşmada ilerler |
| Tez | 60 dk koruma bloğu | Dataset/literatür notu; assessment sonrası 2 saat/hafta |
| AI/OpenCode | Şirket saatinde 2 × 90 dk | Küçük agent deneyi: tool call + custom instruction + hata/çıktı notu; kişisel sertifika maratonu yok |

Takım liderinin “frameworks / AI agents” talebi model ezberlemek değil; OpenCode/Claude Code benzeri coding-agent akışını, tool calling'i, instructions/context'i ve küçük bir custom agent'ın nasıl çalıştığını anlayıp gösterebilmektir. Kısa kurs fikir vermek için kullanılabilir; **tek küçük hands-on deney** öğrenmeyi doğrular.

## 8. Haftanın başarı kriterleri

- 1 adet 3 görev/90 dakika tanı provası ve 1 adet final provası tamamlandı.
- Tekrarlanan en fazla 5 hata sınıfı not edildi; her biri için bir düzeltme örneği var.
- Başvuru tablosu iki Gmail hesabıyla eşlendi; kesin retler açık listede değil.
- 8 kişilik networking haritası hazır; 2 eski çalışma arkadaşı + 1 recruiter + 1 hiring manager için 4 kişiselleştirilmiş mesaj gönderildi.
- En fazla 4 A şeridi başvurusu; B şeridi günlük limite uydu.
- Tez için 60 dakika yapıldı.
- Yeni repo veya yeni ürün özelliği açılmadı.

**Haftanın “hayır” listesi:** yeni side project, NextMatch özelliği, portföy cilası, Coursera bitirme baskısı, dört farklı AI framework'ü aynı anda öğrenme ve Proxify açıldığı gece uykusuz sınava girme.
