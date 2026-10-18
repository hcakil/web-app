<a id="top"></a>

# SkillPanel — yavaş çalışma sayfası

Bu bir konuşma mülakatı değil. Ekranda görünen sınav şöyle:

- Birinci bölüm: **13 çoktan seçmeli**, önerilen süre **25 dakika**. Konu adları: Accessibility, CSS, Data Structures, Docker, HTML, REST, Web Development.
- İkinci bölüm: **bir JavaScript programlama görevi**, önerilen süre **2 saat**.
- Toplam: **2 saat 25 dakika**.
- Ortam yazıyor: Node.js 16.13.0, npm 8.1.0, Chromium 90.
- Başlayınca duraklatma yok, geri dönüş yok, ikinci hak yok.
- Kod görevinin ne sorduğu, hangi testleri çalıştırdığı ve puanın nasıl dağıldığı **bilinmiyor**.

**Start'a pratik olsun diye basma.**

Flutter biliyor olman bu soruları bildiğin anlamına gelmez. Burada her konu sıfırdan, kısa. Bilmediğini “bunu production'da yaptım” diye doldurma.

Bitiş ekranda **7 Nov 2026 02:59** görünüyor. Saat dilimi ayrıca teyit edilmedi.

---

<a id="how"></a>

## Nasıl çalış

Bir başlık seç. Alttaki küçük soruyu **cevap yazısına bakmadan** tahmin et. Sonra cevabı oku. Yanlışsa normal; yanlışın ne olduğunu bir cümleyle not et.

Günde bir ya da iki başlık yeter. Hepsini bir oturuşta bitirme.

---

<a id="eq"></a>

## 1. Eşitlik — `==` ve `===`

JavaScript'te iki eşittir, tipleri zorla benzetebilir. Üç eşittir benzemez.

**Tahmin et:** `0 == '0'` ne? `0 === '0'` ne?

> `0 == '0'` doğrudur, çünkü `==` metni sayıya çevirir.
> `0 === '0'` yanlıştır. Biri sayı, biri metin.
> Nesneler `===` ile içeriklerine göre değil, aynı nesne mi diye bakılır. İki ayrı `{ id: 1 }` eşit değildir.

Sınavda aksi yazmıyorsa `===` kullan.

---

<a id="nullish"></a>

## 2. Boş değer — `||`, `??`, `?.`

`||` “yanlış gibi duran her şeyi” atlar: `0`, `''`, `false`, `null`, `undefined`.

`??` yalnız `null` ve `undefined` için yedek değeri kullanır. `0` ve `''` durur.

**Tahmin et:** `0 || 10` ve `0 ?? 10`.

> `0 || 10` → `10`. Sıfır, `||` için “yok” sayılır.
> `0 ?? 10` → `0`. Sıfır gerçek bir değerdir.
> `obj?.profile?.name` — `obj` yoksa patlamaz, `undefined` döner. Başka hataları yutmaz.

İsim boş string olabilir. Onu `'Unknown'` yapmak istiyorsan `||` kullanma; `??` kullan.

```js
const name = apiUser?.profile?.name ?? 'Unknown';
```

---

<a id="copy"></a>

## 3. Kopya ve değiştirme

`const` yeniden atamayı engeller. İçini değiştirmeni engellemez.

`const user = { name: 'A' }` sonra `user.name = 'B'` serbesttir. `user = {}` değildir.

`{ ...obj }` ve `[...arr]` **sığ** kopyadır. İçindeki nesne hâlâ ortaktır.

`sort` ve `reverse` dizinin kendisini değiştirir.

**Tahmin et:** `const b = a.sort()` dedin. `a` değişir mi?

> Evet. `sort` `a`'yı yerinde sıralar. `b` de aynı dizidir.
> Kopyalayıp sırala: `[...a].sort(...)`.

```js
const sorted = [...items].sort((a, b) => a.rank - b.rank);
```

---

<a id="arrays"></a>

## 4. Dizi metodları

Hepsini ezberleme. Ne döndürdüğünü bil.

- `map` — her elemandan yeni bir dizi üretir. Eleman sayısını değiştirmez.
- `filter` — koşulu geçenlerden yeni dizi.
- `find` — koşulu geçen **ilk** eleman. Yoksa `undefined`.
- `some` — biri uyuyor mu.
- `every` — hepsi uyuyor mu. **Boş dizide `every` doğrudur.** Bu tuzak sorulur.
- `Set` — aynı ilkel değeri bir kez tutar. İki ayrı nesne, içi aynı olsa da iki elemandır.
- `Map` — anahtar herhangi bir değer olabilir.

`typeof []` `'object'` döner. Dizi mi diye `Array.isArray(x)` kullan.

`NaN === NaN` yanlıştır. `Number.isNaN(x)` kullan.

**Tahmin et:** `[].every(x => x > 0)` doğru mu?

> Doğru. “Uymayan eleman var mı?” diye bakar. Eleman yoksa uymayan da yoktur.

Aynı `id`'den son geleni tutmak, ilk görülenin sırasını bozmadan:

```js
const uniqueById = [...new Map(items.map(x => [x.id, x])).values()];
```

---

<a id="async"></a>

## 5. Async — beklemek

`async` fonksiyon bir Promise döner. `await` o fonksiyonun içinde bekler. Bütün programı dondurmaz.

`forEach(async ...)` **beklemez.** Döngü biter, işler arkada kalır.

Bağımsız iki istek varsa sırayla `await` etme. `Promise.all` ikisini birlikte başlatır.

`Promise.all` birisi patlarsa kendisi de patlar. Diğerlerini iptal etmez.

`Promise.allSettled` hepsinin başarılı ya da başarısız sonucunu verir.

`fetch` ağ kopunca patlar. **404 ve 500'te patlamaz.** `response.ok` bakmazsan hata sayfasını veri sanırsın.

**Tahmin et:** `fetch` 404 alınca `await` hata fırlatır mı?

> Hayır. Cevap gelir, status 404'tür. `if (!response.ok) throw ...` yazmazsan devam edersin.

```js
async function getJson(url) {
  const response = await fetch(url);
  if (!response.ok) throw new Error('HTTP ' + response.status);
  return response.json();
}
```

`.then()` içinde `return` unutmak ve `await` unutmak sık hatadır.

---

<a id="loop"></a>

## 6. Sıra — event loop

Üç kuyruk var. Üstteki bitmeden alttakine geçilmez.

| Sıra | Adı | Bunu yazınca | Ne olur |
|---|---|---|---|
| 1. En yüksek | Call stack. Senkron kod. | `console.log()`, fonksiyon çağrısı, `async` fonksiyonun `await` satırından **öncesi** | Yukarıdan aşağı hemen çalışır. Bu yığın boşalmadan alttaki kuyruklara bakılmaz. |
| 2. Orta | Microtask. Job queue. | `Promise.then()`, `.catch()`, `.finally()`, `await` **sonrası** | Senkron iş bitince önce burası boşalır. Burada iş kaldıkça zamanlayıcıya geçilmez. |
| 3. En düşük | Macrotask. Task queue. | `setTimeout()`, `setInterval()`, tıklama, `fetch` cevabı | Üstteki ikisi tamamen boşsa bakılır. Bir turda **yalnız bir** makro iş alınır, sonra yine mikro kuyruğa dönülür. |

`fetch(...)` satırının kendisi hemen çalışır, isteği yollar. Cevap gelince o iş makro kuyruğuna yazılır. Cevabı işleyen `await` sonrası yine mikro kuyruktadır.

**Tahmin et, sonra aşağıya bak.**

```js
console.log('A');
setTimeout(() => console.log('B'), 0);
Promise.resolve().then(() => console.log('C'));
(async () => { console.log('D'); await 0; console.log('E'); })();
console.log('F');
```

> A — hemen.
> D — async fonksiyonun `await`'ten önceki kısmı da hemen çalışır.
> F — senkron işin sonu.
> C — promise kuyruğu.
> E — `await`'ten sonrası da promise kuyruğundadır.
> B — zamanlayıcı en son.
>
> Sıra: **A, D, F, C, E, B**.

Bunu her Node ayrıntısına genelleme. Sınavda bu kadarı sorulursa yeter.

---

<a id="rest"></a>

## 7. HTTP — kelimeler

Bunlar “yaptım” hikâyesi değil. Seçeneklerde kelime olarak gelir.

- **GET** — okur. Tekrarlamak aynı şeyi bozmaz.
- **POST** — genelde yeni bir şey yapar veya tetikler. İkinci kez başka sonuç doğurabilir.
- **PUT** — kaynağın tamamını değiştirmek için düşünülür. Aynı isteği tekrarlamak aynı sonucu hedefler.
- **PATCH** — bir kısmını değiştirir. Tekrar güvenli olmayabilir.
- **200** tamam. **201** oluşturuldu. **202** kabul edildi, bitmiş olmak zorunda değil. **204** gövde yok.
- **401** kim olduğunu bilmiyorum. **403** kim olduğunu biliyorum, buna iznin yok. **404** yok. **409** çakışma. **429** çok istek.
- **500** sunucu hatası. **502** arkadaki servis kötü cevap verdi. **503** servis ayakta değil.

**CORS** tarayıcının “bu site, şu adresin cevabını okuyabilir mi” kuralıdır. Şifre değildir. Postman'i durdurmaz.

**Tahmin et:** 401 ile 403 farkı ne?

> 401: giriş yok ya da geçersiz. 403: giriş var, bu işe yetkin yok.

---

<a id="html"></a>

## 8. HTML — tıklanabilir şey buton olsun

Çoktan seçmelide “div'e onClick koydum, olur mu” diye sorabilirler.

Gerçek bir `<button>` klavye ile odaklanır ve Enter/Space ile çalışır. Tıklanabilir `<div>` bunu kendiliğinden yapmaz.

Form alanında görünen yazı, alanla bağlı olmalı. `<label for="email">` ile `<input id="email">` aynı kelimeyi kullanır.

Anlamlı resmin `alt` metni ne işe yaradığını söyler. Süs resmi `alt=""` olur. `alt` hiç yoksa ekran okuyucu dosya adını okuyabilir.

Başlıkları sadece yazı büyüsün diye kullanma. `h1`, sonra `h2`.

ARIA, HTML'in eksik kaldığı yeri tamamlar. Butona bir de `role="button"` yazmak gerekmez.

**Tahmin et:** Logo süsse `alt` ne olmalı?

> `alt=""`. Boş. “Logo” yazmak da gürültüdür, eğer yanında zaten site adı varsa.

---

<a id="css"></a>

## 9. CSS — birkaç tuzak

Bunu her gün yazmıyorsun. Seçenekleri elemek için şu kadarı yeter.

`box-sizing: border-box` dersen, yazdığın genişliğin **içine** padding ve border girer. Margin girmez.

Flex'te `justify-content` ana eksen, `align-items` çapraz eksen. Satır düzeninde ana eksen yataydır.

`min-width: 0` bazen bir flex çocuğunun, içindeki uzun yazı yüzünden taşmasını engeller. Varsayılan minimum, içeriğin genişliğidir.

`position: absolute` en yakın konumlanmış ata göre durur. Ata yoksa sayfaya göre.

`z-index: 9999` her zaman üste çıkmaz. Üst eleman kendi yığınını kapatmışsa çocuk dışarı kaçamaz.

Dikey margin'ler bloklarda birleşebilir. Flex ve grid çocuklarında birleşmez.

**Tahmin et:** Kutu 200px, padding 20px, `border-box`. İçerik alanı 200 mü kalır?

> Hayır. 200'ün içinden padding ve border düşer. Margin ayrıca dışarıdadır.

---

<a id="docker"></a>

## 10. Docker — sadece kelime

Kod görevinde Docker yazman gerekmiyor olabilir. Çoktan seçmelide komutun ne işe yaradığını sorarlar. Kullanmadıysan “kullandım” deme. Anlamını bil.

- **Image** kalıp. **Container** o kalıbın çalışan kopyası.
- `docker build -t demo .` bulunduğun klasörden image üretir.
- `docker run -p 8080:80 demo` senin makinedeki 8080'i, kabın 80 portuna bağlar.
- `EXPOSE 80` “bu kapı bekleniyor” diye not düşer. **Portu açmaz.**
- `COPY` dosyayı image'a koyar. `RUN` image kurulurken bir komut çalıştırır.
- `CMD` varsayılan komut. `ENTRYPOINT` asıl çalıştırılan program olarak düşünülür.

**Tahmin et:** Dockerfile'da `EXPOSE 80` yazdın. Tarayıcıdan 80'e girebilir misin?

> Hayır. Yayınlamak için `docker run -p ...` gerekir.

---

<a id="cost"></a>

## 11. “Bu ne kadar yavaş” soruları

Kesin formül değil. Seçenekte “iç içe `find`” görürsen yavaş de.

- Diziye index ile bakmak: sabit, O(1).
- `find` / `includes`: eleman sayısı kadar, O(n).
- `Set.has` ve `Map.get`: pratikte sabit. “Her durumda kesin” diye yemin etme.
- `sort`: tipik olarak O(n log n). Karşılaştırma kendiyle çelişmesin.
- `map` içinde her seferinde `find`: n kere n. Büyük listede bunu yapma. Önce `Map` kur.

---

<a id="task"></a>

## 12. Kod görevi gelirse — bilmediğin projeye böyle bak

Görevin ne olduğu belli değil. Gelen projeyi tanımıyormuşsun gibi aç.

1. İstenen davranışı, `package.json`'ı ve görünen testleri oku. Fonksiyonun adını değiştirme.
2. Testi bir kez çalıştır. Kırmızıysa, sen bozmadan önceki hâlini not et.
3. İstenen kadarını yaz. Yanındaki dosyayı güzelleştirme.
4. Boş liste, tekrar eden id, `null`, hatalı HTTP ve sıra önemliyse onu da dene. Görev istemiyorsa uydurma.
5. Gelen diziyi `sort` ile yerinde bozma.
6. Testi tekrar çalıştır. Son on dakikayı kaydetmeye ve hâlâ kırmızı olan tek teste ayır.

Ortam Node 16. Yeni diye gördüğün her sözdizimi orada yoktur. `??` ve `?.` vardır. Emin değilsen daha düz yaz.

---

<a id="links"></a>

## 13. Elin alışsın diye

Önce buradaki tahminler. Sonra, istersen:

- [Exercism JavaScript](https://exercism.org/tracks/javascript/exercises) — test çalıştırılan küçük alıştırmalar. Dizi ve nesne ile başla.
- [MDN CSS alıştırmaları](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/CSS_layout/Test_your_skills)
- [MDN erişilebilirlik alıştırmaları](https://developer.mozilla.org/en-US/docs/Learn_web_development/Core/Accessibility/Test_your_skills)
- [SkillPanel örnek JavaScript projesi](https://github.com/SkillPanel/devskiller-sample-javascript) — platforma en yakın örnek. Çalıştırmadan önce istenen Node sürümüne bak.

Bunlar sınavdan **önce** içindir. Sınav sırasında dışarı bakmak yasak olabilir. Kuralları ekranda oku.

---

<a id="order"></a>

## Sıra, acele etmeden

1. Eşitlik, `??`, kopya ve `sort`.
2. `every` boş dizi, `fetch` 404, event loop sırası.
3. HTTP kelimeleri ve buton / `alt`.
4. CSS'te border-box ve flex eksenleri. Docker'da `EXPOSE` port açmaz.
5. Ancak ondan sonra Exercism'de bir alıştırma.

Beş günlük program yok. Bir oturuşta bir başlık.
