/**
 * Dijital Proje Yönetmeliği EK-2 dosya adı üretme, çözme ve doğrulama.
 * Bağımlılık yok. Node.js ve tarayıcıda çalışır.
 *
 *   Node:      const da = require('./dosya-adi.js');            // referans.json otomatik yüklenir
 *   Tarayıcı:  <script src="dosya-adi.js"></script>
 *              const da = DosyaAdi.olustur(referansJson);       // referans.json'u fetch ile yükleyin
 *
 * Kaynak: ForumCAD, https://forumcad.com/bim/arac/dosya-adi (MIT lisansı)
 */
(function (kok, fabrika) {
  if (typeof module === 'object' && module.exports) {
    var ref;
    try { ref = require('./referans.json'); } catch (e) { ref = null; }
    module.exports = fabrika(ref);
  } else {
    kok.DosyaAdi = fabrika(null);
  }
})(typeof self !== 'undefined' ? self : this, function (varsayilanRef) {
  'use strict';

  var ALANLAR = ['proje', 'bina', 'disiplin', 'oge', 'tur', 'tip', 'kat', 'sira', 'revizyon'];

  function olustur(ref) {
    if (!ref) throw new Error('referans.json verisi gerekli');

    function bul(liste, kosul) { for (var i = 0; i < liste.length; i++) if (kosul(liste[i])) return liste[i]; return null; }
    function disiplin(kod) { return bul(ref.disiplinler, function (d) { return d.kod === kod; }); }
    function oge(dk, kod) { return bul(ref.ogeler, function (o) { return o.disiplin === dk && o.kod === kod; }); }
    function tur(kod) { return bul(ref.dosya_turleri, function (t) { return t.kod === kod; }); }
    function tip(kod) { return bul(ref.dosya_tipleri, function (t) { return t.kod === kod; }); }
    function kat(kod) { return bul(ref.katlar, function (k) { return k.kod === kod; }); }

    /** Alan nesnesini doğrular. Döner: { gecerli, hatalar[], uyarilar[] } */
    function alanlariDogrula(a) {
      var h = [], u = [];
      a = a || {};
      if (!/^\d{6}$/.test(a.proje || '')) h.push('Proje kodu 6 haneli sayı olmalı (YY + NNNN).');
      if (!/^[A-Z0-9]{2}$/.test(a.bina || '')) h.push('Bina kodu 2 karakter olmalı (tek binada 00).');
      var d = disiplin(a.disiplin);
      if (!d) h.push('Disiplin kodu tanımlı değil: ' + (a.disiplin || '(boş)') + '.');

      if (d) {
        if (oge(a.disiplin, a.oge)) {
          // Yönetmelik listesindeki kod: uzunluğu ne olursa olsun geçerli (ör. ZE disiplininde 3 karakterli IKS, KZK, ZTE).
        } else if (/^[A-Z0-9]{4}$/.test(a.oge || '')) {
          u.push('Öge kodu ' + a.oge + ' ' + a.disiplin + ' listesinde yok. İdarenin belirlediği özel alt disiplin olarak kabul edildi (4 karakter).');
        } else {
          h.push('Öge kodu ' + a.disiplin + ' listesinde yok; özel kod ise 4 karakter (A-Z, 0-9) olmalı.');
        }
      }

      if (!tur(a.tur)) h.push('Dosya türü tanımlı değil: ' + (a.tur || '(boş)') + '.');
      var t = tip(a.tip);
      if (!t) h.push('Dosya tipi tanımlı değil: ' + (a.tip || '(boş)') + '.');
      else if (d) {
        var gruplar = ref.disiplin_dosya_grubu[a.disiplin] || ['TUM'];
        if (gruplar.indexOf(t.grup) === -1) h.push('Dosya tipi ' + a.tip + ' (' + t.grup + ') ' + a.disiplin + ' disiplininde kullanılmaz.');
      }

      var k = a.kat || '';
      if (k === 'KXX' || k === 'XXX') h.push('KXX/XXX yer tutucudur; müellifin belirlediği gerçek kodu yazın.');
      else if (kat(k)) { /* listede */ }
      else if (/^K[A-Z0-9]{2}$/.test(k)) u.push('Kat kodu ' + k + ' özel kat (asma, çatı piyesi, tesisat katı) olarak kabul edildi.');
      else if (/^[A-Z0-9]{3}$/.test(k)) u.push('Kat/konum kodu ' + k + ' kesit/görünüş konumu olarak kabul edildi.');
      else h.push('Kat/konum kodu 3 karakter olmalı.');

      if (!/^\d{2}$/.test(a.sira || '') || a.sira === '00') h.push('Sıra no 01-99 arası 2 haneli olmalı.');
      if (!/^\d{3}$/.test(a.revizyon || '')) h.push('Revizyon no 3 haneli olmalı (revize yoksa 000).');
      return { gecerli: h.length === 0, hatalar: h, uyarilar: u };
    }

    /** Alanlardan dosya adı üretir. Geçersizse hata fırlatır. */
    function uret(a) {
      var n = {};
      ALANLAR.forEach(function (f) { n[f] = String(a[f] == null ? '' : a[f]).trim(); });
      ['bina', 'oge', 'kat'].forEach(function (f) { n[f] = n[f].toUpperCase(); });
      if (!n.bina) n.bina = '00';
      if (!n.revizyon) n.revizyon = '000';
      if (/^\d$/.test(n.sira)) n.sira = '0' + n.sira;
      var s = alanlariDogrula(n);
      if (!s.gecerli) { var e = new Error(s.hatalar.join(' ')); e.hatalar = s.hatalar; throw e; }
      return ALANLAR.map(function (f) { return n[f]; }).join(ref.ayirici || '_');
    }

    /** Dosya adını alanlara ayırır; uzantı varsa atılır. Döner: alan nesnesi veya null */
    function coz(dosyaAdi) {
      var ad = String(dosyaAdi || '').replace(/\.[A-Za-z0-9]{2,5}$/, '');
      var p = ad.split(ref.ayirici || '_');
      if (p.length !== 9) return null;
      var a = {};
      ALANLAR.forEach(function (f, i) { a[f] = p[i]; });
      return a;
    }

    /** Dosya adını doğrular. Döner: { gecerli, hatalar[], uyarilar[], alanlar, aciklama } */
    function dogrula(dosyaAdi) {
      var a = coz(dosyaAdi);
      if (!a) return { gecerli: false, hatalar: ['Dosya adı "_" ile ayrılmış 9 alandan oluşmalı.'], uyarilar: [], alanlar: null, aciklama: null };
      var s = alanlariDogrula(a);
      s.alanlar = a;
      s.aciklama = s.gecerli ? acikla(a) : null;
      return s;
    }

    /** Alanların okunur açıklaması. */
    function acikla(a) {
      var d = disiplin(a.disiplin), o = oge(a.disiplin, a.oge), t = tur(a.tur), p = tip(a.tip), k = kat(a.kat);
      return {
        proje: a.proje, bina: a.bina,
        disiplin: d ? d.ad : a.disiplin,
        oge: o ? o.ad : a.oge + ' (özel kod)',
        tur: t ? t.ad : a.tur,
        tip: p ? p.ad : a.tip,
        kat: k ? k.ad : a.kat + ' (özel kod)',
        sira: a.sira, revizyon: a.revizyon
      };
    }

    /** Aynı ilk 7 alana sahip mevcut dosyalara göre sıradaki sıra numarasını verir. */
    function sonrakiSira(mevcutAdlar, a) {
      var anahtar = ALANLAR.slice(0, 7).map(function (f) { return a[f]; }).join('_');
      var enBuyuk = 0;
      (mevcutAdlar || []).forEach(function (x) {
        var c = coz(x);
        if (c && ALANLAR.slice(0, 7).map(function (f) { return c[f]; }).join('_') === anahtar) enBuyuk = Math.max(enBuyuk, parseInt(c.sira, 10) || 0);
      });
      var n = enBuyuk + 1;
      return n < 10 ? '0' + n : String(n);
    }

    /** Disipline göre kullanılabilir öge ve dosya tipi listeleri. */
    function secenekler(disiplinKod) {
      var gruplar = ref.disiplin_dosya_grubu[disiplinKod] || ['TUM'];
      return {
        ogeler: ref.ogeler.filter(function (o) { return o.disiplin === disiplinKod; }),
        dosyaTipleri: ref.dosya_tipleri.filter(function (t) { return gruplar.indexOf(t.grup) !== -1; })
      };
    }

    return { uret: uret, coz: coz, dogrula: dogrula, alanlariDogrula: alanlariDogrula, acikla: acikla,
             sonrakiSira: sonrakiSira, secenekler: secenekler, referans: ref, olustur: olustur };
  }

  return varsayilanRef ? olustur(varsayilanRef) : { olustur: olustur };
});
