// Çalıştırma: node dosya-adi/test.js
'use strict';
const assert = require('node:assert/strict');
const da = require('./dosya-adi.js');
let n = 0;
function t(ad, fn) { fn(); n++; console.log('✓ ' + ad); }

t('geçerli dosya adı üretilir', () => {
  const ad = da.uret({ proje: '260001', bina: '00', disiplin: 'MM', oge: 'DUVA', tur: 'PL', tip: 'MMC', kat: 'K01', sira: '1', revizyon: '' });
  assert.equal(ad, '260001_00_MM_DUVA_PL_MMC_K01_01_000');
});

t('üretilen ad doğrulanır ve açıklanır', () => {
  const s = da.dogrula('260001_00_MM_DUVA_PL_MMC_K01_01_000.ifc');
  assert.equal(s.gecerli, true);
  assert.equal(s.aciklama.disiplin, 'Mimari');
  assert.equal(s.aciklama.kat, 'Kat 1');
});

t('ZE disiplininin 3 karakterli resmî öge kodları kabul edilir', () => {
  for (const kod of ['IKS', 'KZK', 'ZTE']) {
    const s = da.alanlariDogrula({ proje: '260001', bina: '00', disiplin: 'ZE', oge: kod, tur: 'RP', tip: 'DGR', kat: 'NNN', sira: '01', revizyon: '000' });
    assert.equal(s.gecerli, true, kod + ': ' + s.hatalar.join(' '));
  }
});

t('listede olmayan 4 karakterli öge özel kod olarak uyarıyla kabul edilir', () => {
  const s = da.alanlariDogrula({ proje: '260001', bina: '00', disiplin: 'MM', oge: 'ZZZZ', tur: 'PL', tip: 'MMC', kat: 'K00', sira: '01', revizyon: '000' });
  assert.equal(s.gecerli, true);
  assert.equal(s.uyarilar.length, 1);
});

t('listede olmayan 3 karakterli öge reddedilir', () => {
  const s = da.alanlariDogrula({ proje: '260001', bina: '00', disiplin: 'MM', oge: 'ZZZ', tur: 'PL', tip: 'MMC', kat: 'K00', sira: '01', revizyon: '000' });
  assert.equal(s.gecerli, false);
});

t('disipline uymayan dosya tipi reddedilir', () => {
  const s = da.alanlariDogrula({ proje: '260001', bina: '00', disiplin: 'ST', oge: 'XXXX', tur: 'PL', tip: 'MMC', kat: 'K00', sira: '01', revizyon: '000' });
  assert.equal(s.gecerli, false);
  assert.match(s.hatalar.join(' '), /MMC/);
});

t('TUM grubundaki dosya tipi her disiplinde geçerli', () => {
  const s = da.alanlariDogrula({ proje: '260001', bina: '00', disiplin: 'EE', oge: 'XXXX', tur: 'LS', tip: 'MLZ', kat: 'NNN', sira: '01', revizyon: '000' });
  assert.equal(s.gecerli, true, s.hatalar.join(' '));
});

t('KXX ve XXX yer tutucuları reddedilir, gerçek özel kodlar kabul edilir', () => {
  const temel = { proje: '260001', bina: '00', disiplin: 'MM', oge: 'XXXX', tur: 'KS', tip: 'MMC', sira: '01', revizyon: '000' };
  assert.equal(da.alanlariDogrula({ ...temel, kat: 'KXX' }).gecerli, false);
  assert.equal(da.alanlariDogrula({ ...temel, kat: 'KAS' }).gecerli, true);
  assert.equal(da.alanlariDogrula({ ...temel, kat: 'AAK' }).gecerli, true);
});

t('hatalı biçimler reddedilir', () => {
  assert.equal(da.dogrula('26001_00_MM_DUVA_PL_MMC_K01_01_000').gecerli, false);
  assert.equal(da.dogrula('260001_00_MM_DUVA_PL_MMC_K01_00_000').gecerli, false);
  assert.equal(da.dogrula('260001_00_MM_DUVA_PL_MMC_K01_01').gecerli, false);
  assert.throws(() => da.uret({ proje: '260001', disiplin: 'XX', oge: 'DUVA', tur: 'PL', tip: 'MMC', kat: 'K01', sira: '01' }));
});

t('sıra no aynı gruptaki en büyük + 1 olur', () => {
  const mevcut = ['260001_00_MM_DUVA_PL_MMC_K01_01_000', '260001_00_MM_DUVA_PL_MMC_K01_02_000', '260001_00_MM_DUVA_PL_MMC_K02_05_000'];
  assert.equal(da.sonrakiSira(mevcut, { proje: '260001', bina: '00', disiplin: 'MM', oge: 'DUVA', tur: 'PL', tip: 'MMC', kat: 'K01' }), '03');
  assert.equal(da.sonrakiSira(mevcut, { proje: '260001', bina: '00', disiplin: 'MM', oge: 'DUVA', tur: 'PL', tip: 'MMC', kat: 'K03' }), '01');
});

t('referans verisi tam', () => {
  const r = da.referans;
  assert.equal(r.disiplinler.length, 12);
  assert.equal(r.ogeler.length, 190);
  assert.equal(r.dosya_turleri.length, 12);
  assert.equal(r.dosya_tipleri.length, 30);
  assert.equal(r.katlar.length, 64);
});

console.log(`\n${n} test geçti.`);
