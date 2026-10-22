# Türkiye BIM Standartları: açık veri

**Mimarlık ve Mühendislik Projelerinin Dijital Olarak Hazırlanması Hakkında Yönetmelik**'in referans tablolarını makine tarafından okunabilir açık veri olarak sunar: IFC sınıfları ve Türkçe karşılıkları, mahal kodları (EK-3) ve dosya adlandırma kuralı (EK-2). Doğrulama fonksiyonu da dahil.

Veriler ForumCAD'in ücretsiz BIM araçlarında kullanılan veri setinin kendisidir:

| Veri seti | Kayıt | Dosyalar | Çevrim içi araç |
|---|---|---|---|
| IFC sınıfları (EK-5, Tablo 5.1 ve 5.2) | 136 sınıf (69 zorunlu, 67 isteğe bağlı) + 62 öznitelik/özellik | [`ifc-siniflari/`](ifc-siniflari/) | [IFC Sınıf Sözlüğü](https://forumcad.com/bim/ifc/) |
| Mahal kodları (EK-3) | 152 mahal | [`mahal-kodlari/`](mahal-kodlari/) | [Mahal Sözlüğü](https://forumcad.com/bim/mahal/) |
| Dosya adı kuralı (EK-2) | 12 disiplin, 190 öge, 12 dosya türü, 30 dosya tipi, 64 kat/konum kodu | [`dosya-adi/`](dosya-adi/) | [Dosya Adı Üreteci](https://forumcad.com/bim/arac/dosya-adi) |

Yönetmeliğin kapsamı, yürürlük takvimi ve uygulamada dikkat edilecekler için: [BIM zorunlu geliyor: Dijital Proje Yönetmeliği rehberi](https://forumcad.com/makale/bim-zorunlu-geliyor-20272033-dijital-proje-yonetmeligi-rehberi) · [ForumCAD BIM](https://forumcad.com/bim.php)

## Hızlı kullanım

Her veri seti hem **CSV** (UTF-8, virgülle ayrılmış, başlık satırlı) hem **JSON** olarak verilir. Excel'de açmak için: Veri → Metinden/CSV'den → Dosya kaynağı: 65001 UTF-8.

```python
import pandas as pd
ifc = pd.read_csv("https://raw.githubusercontent.com/<kullanici>/turkiye-bim-standartlari/main/ifc-siniflari/ifc-siniflari.csv")
print(ifc[ifc.zorunlu].shape)   # (69, 9)
```

```js
// Node.js: dosya adı doğrulama
const da = require('./dosya-adi/dosya-adi.js');
da.uret({ proje: '260001', bina: '00', disiplin: 'MM', oge: 'DUVA', tur: 'PL', tip: 'MMC', kat: 'K01', sira: '01' });
// → '260001_00_MM_DUVA_PL_MMC_K01_01_000'
da.dogrula('260001_00_ST_XXXX_PL_MMC_K01_01_000').hatalar;
// → [ 'Dosya tipi MMC (MIMARI) ST disiplininde kullanılmaz.' ]
```

Dosya adı biçimi:

```
{proje}_{bina}_{disiplin}_{oge}_{tur}_{tip}_{kat}_{sira}_{revizyon}
260001 _ 00   _ MM       _ DUVA _ PL  _ MMC _ K01 _ 01   _ 000
```

## Klasörler

```
ifc-siniflari/   ifc-siniflari.csv · ifc-ozellikleri.csv · ifc-siniflari.json
mahal-kodlari/   mahal-kodlari.csv · mahal-kodlari.json
dosya-adi/       referans.json · disiplinler.csv · ogeler.csv · dosya-turleri.csv · dosya-tipleri.csv · katlar.csv
                 dosya-adi.js (üret, çöz, doğrula; bağımlılıksız) · test.js
```

Her klasörün kendi README'sinde alanların açıklaması vardır.

## Kaynak ve doğruluk

- **Kaynak:** Mimarlık ve Mühendislik Projelerinin Dijital Olarak Hazırlanması Hakkında Yönetmelik (Resmî Gazete, 5 Ağustos 2026, Sayı 33331) ve ekleri. `kaynak_sayfa` ve `tablo` alanları her kaydın kaynak belgedeki yerini gösterir.
- Kodlar ve adlar resmî metinden elle aktarılmış ve tek tek kontrol edilmiştir. Yine de bağlayıcı olan Resmî Gazete'de yayımlanan metindir. Bir fark görürseniz lütfen [issue açın](../../issues).
- IFC sınıf ve özellik adları (`IfcWall`, `Pset_WallCommon` vb.) buildingSMART International'ın IFC standardının terimleridir.

### Bilinen notlar

- **3 karakterli öge kodları:** EK-2 Tablo 2.11'de Zemin (ZE) disiplini için `IKS` (İksa), `KZK` (Kazık) ve `ZTE` (Zemin ve Temel) kodları 3 karakterlidir; diğer öge kodlarının tamamı 4 karakterdir. Yönetmeliğin 11. maddesinin 3. fıkrasındaki 4 karakter kuralı idarenin ekleyeceği **özel** alt disiplinler içindir. Bu yüzden `dosya-adi.js` resmî listedeki kodları uzunluğuna bakmadan kabul eder; 4 karakter şartını yalnızca listede olmayan özel kodlara uygular.
- Yazım: Kaynak tablolarda ASCII'ye çevrilmiş adlar ("Gorunus", "Cizim") Türkçe yazıma getirilmiştir ("Görünüş", "Çizim"). Kodlar değiştirilmemiştir.

## Kaynak gösterme

Bu veriyi bir projede, yazılımda, makalede ya da eğitimde kullanıyorsanız lütfen kaynak gösterin:

> ForumCAD, *Türkiye BIM Standartları: açık veri*, 2026. https://forumcad.com/bim.php

Ayrıntı: [`CITATION.cff`](CITATION.cff)

## Lisans

- **Veri ve dokümantasyon:** [CC BY 4.0](LICENSE). Ticari kullanım dahil serbestçe kullanabilir, değiştirebilir ve paylaşabilirsiniz; kaynak göstermeniz yeterlidir. Yönetmelik metninin kendisi kamuya açık resmî metindir; lisans, ForumCAD'in derlemesini, düzenlemesini ve Türkçe yazım düzeltmelerini kapsar.
- **Kod** (`dosya-adi/*.js`): [MIT](LICENSE-CODE).

## ForumCAD hakkında

[ForumCAD](https://forumcad.com), 2008'den beri yayında olan bir mimarlık ve inşaat platformudur: maliyet şablonları, teknik şartnameler, birim fiyatlar, hesaplayıcılar ve BIM araçları. Projeniz için BIM uygulama planı, model kontrolü veya dijital proje teslimi danışmanlığı: [forumcad.com/danismanlik.php](https://forumcad.com/danismanlik.php)

---

## English summary

Open, machine-readable reference data for **Turkey's Digital Project Regulation** (*Mimarlık ve Mühendislik Projelerinin Dijital Olarak Hazırlanması Hakkında Yönetmelik*, Official Gazette no. 33331, 5 August 2026), which makes BIM/IFC delivery mandatory for building permits in phases from 2027:

- `ifc-siniflari/`: the 136 IFC classes listed in Annex 5 (69 mandatory, 67 optional) with Turkish names, three-letter abbreviations, PredefinedType lists and the required attributes/properties.
- `mahal-kodlari/`: the 152 space (room) codes of Annex 3.
- `dosya-adi/`: the file naming convention of Annex 2 (disciplines, elements, document types, file types, level codes) plus a dependency-free JavaScript generator/validator with tests.

Data: CC BY 4.0 · Code: MIT · Maintained by [ForumCAD](https://forumcad.com).
