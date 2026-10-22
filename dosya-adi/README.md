# Dosya adlandırma (EK-2)

Yönetmeliğe göre her proje dosyası 9 alandan oluşan, `_` ile ayrılmış bir adla teslim edilir:

| # | Alan | Uzunluk | Kural |
|---|---|---|---|
| 1 | Proje kodu | 6 | YY + NNNN; idare veya e-PYS atar |
| 2 | Bina kodu | 2 | Tek binada `00` |
| 3 | Disiplin | 2 | `disiplinler.csv` |
| 4 | Alt disiplin / öge | 4 (bkz. not) | `ogeler.csv`, seçilen disipline göre |
| 5 | Dosya türü | 2 | `dosya-turleri.csv` |
| 6 | Dosya tipi | 3 | `dosya-tipleri.csv`; disiplinin grubuna ve `TUM` grubuna göre |
| 7 | Kat / konum | 3 | `katlar.csv`; `KXX` = müellifin belirleyeceği özel kat (K + 2 karakter), `XXX` = kesit/görünüş konumu (3 karakter) |
| 8 | Sıra no | 2 | 01'den başlar |
| 9 | Revizyon no | 3 | Revize yoksa `000` |

Not: Zemin (ZE) disiplinindeki `IKS`, `KZK`, `ZTE` öge kodları resmî tabloda 3 karakterlidir. Listede olmayan özel öge kodları 4 karakter olmalıdır.

## Dosyalar

- `referans.json`: tüm referans tabloları, alan kuralları ve `disiplin_dosya_grubu` eşlemesi (hangi disiplin hangi dosya tiplerini kullanabilir).
- `*.csv`: aynı tablolar ayrı ayrı.
- `dosya-adi.js`: `uret`, `coz`, `dogrula`, `acikla`, `sonrakiSira`, `secenekler`. Bağımlılıksız; Node.js'te `require`, tarayıcıda `DosyaAdi.olustur(referans)`.
- `test.js`: `node dosya-adi/test.js`

## Tarayıcıda

```html
<script src="dosya-adi.js"></script>
<script>
fetch('referans.json').then(r => r.json()).then(ref => {
  const da = DosyaAdi.olustur(ref);
  console.log(da.dogrula('260001_00_MM_DUVA_PL_MMC_K01_01_000'));
});
</script>
```

Formla çalışan sürüm, toplu üretim ve CSV dışa aktarma: [ForumCAD Dosya Adı Üreteci](https://forumcad.com/bim/arac/dosya-adi)
