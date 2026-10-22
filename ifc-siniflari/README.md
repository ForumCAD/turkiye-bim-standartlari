# IFC sınıfları

Yönetmeliğin EK-5'inde, BIM modellerinde kullanılacak IFC sınıfları Türkçe karşılıkları ve üç harfli kısaltmalarıyla listelenir. Tablo 5.1'deki 69 sınıf zorunlu, Tablo 5.2'deki 67 sınıf isteğe bağlıdır.

## ifc-siniflari.csv

| Alan | Açıklama |
|---|---|
| `ifc_sinif` | IFC sınıf adı (ör. `IfcWall`) |
| `turkce_ad` | Yönetmelikteki Türkçe karşılık |
| `kisaltma` | Üç harfli kısaltma. `IfcProject` için tanımlı değil, boş |
| `zorunlu` | `true` = Tablo 5.1 (zorunlu), `false` = Tablo 5.2 (isteğe bağlı) |
| `tablo` | Kaynak tablo numarası |
| `on_tanimli_tipler` | PredefinedType değerleri, `\|` ile ayrılmış |
| `tanim` | Kaynak belgedeki tanım (yalnızca 10 temel sınıfta var) |
| `kaynak_sayfa` | Kaynak belgedeki sayfa numarası |
| `forumcad_url` | Sınıfın ForumCAD'deki açıklama sayfası |

## ifc-ozellikleri.csv

13 temel sınıf (kiriş, kolon, kapı, duvar, pencere vb.) için yönetmelikte istenen öznitelik ve özellikler.

| Alan | Açıklama |
|---|---|
| `ifc_sinif` | Bağlı olduğu sınıf |
| `tur` | `oznitelik` (IFC attribute) veya `ozellik` (property set içindeki property) |
| `ifc_ad` | IFC adı (ör. `FireRating`, `PredefinedType`) |
| `turkce_ad` | Türkçe adı |
| `pset` | Özellik kümesi (ör. `Pset_WallCommon`). Özniteliklerde boş |
| `veri_tipi` | Metin, Sayı, Sayı veya Metin, Mantıksal |
| `zorunlu` | `true` / `false` |
| `aciklama` | Kaynak belgedeki açıklama |
| `kaynak_sayfa` | Kaynak belgedeki sayfa numarası |

## ifc-siniflari.json

Aynı veri; her sınıfın altında `ozellikler` dizisiyle iç içe.
