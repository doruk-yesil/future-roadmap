# Future · Kendi yolunu çiz

Kariyer, eğitim ve ticaret seçenekleri için Türkçe, düzenlenebilir kişisel yol haritası.

## Kullanım

- Bir ana yol ve alt seçenek seç; ihtiyaç duyduğun kartları aç.
- Kartların tam açıklaması, gerekenler, resmî kaynaklar ve bağlı yollar sağ panelde bulunur.
- Kartları favorile, durum seç, kendi notunu yaz ve görev listene ekle.
- Başlık, açıklama, koşul ve kaynakları kişisel kopyanda düzenle.
- Arama bütün kartları kapsar; kart listesi haritaya alternatif görünüm sağlar.
- Kesik bağlantılar seçenek/içerik ilişkisi; düz bağlantılar özgün araştırmadaki adım, koşul veya geri dönüş ilişkileridir.

## Veriler ve gizlilik

350 kart, 632 ilişki, 325 benzersiz kaynak URL ve 84 şirket. Çin ürün ticareti 18 Ekim 2026; diğer kariyer ve eğitim yolları 14–15 Ekim 2026 araştırmasına dayanır. Araştırma bağlantıları güncel ilan, kabul, talep veya kârlılık garantisi değildir.

Açık sürümde kişisel profil ayrıntıları genelleştirilmiştir. Yayımlanan dosyalarda özel tam profil ve kişisel çalışma kayıtları bulunmaz.

Notlar, favoriler, durumlar, görevler ve kart düzenlemeleri yalnız tarayıcının `localStorage` alanında saklanır. Hesap veya sunucu eşitlemesi yoktur. Tarayıcı verileri silinirse kişisel değişiklikler kaybolabilir. **Yedekleme & kullanım** bölümünden JSON yedeğini indir; başka cihazda aynı dosyayı geri yükle. Birbirinden farklı alan adları ve yerel önizleme ayrı kayıt alanları kullanır. Her ziyaretçinin çalışma kaydı kendine aittir; kart düzenlemesi herkesin gördüğü temel araştırmayı değiştirmez.

## Yerel çalıştırma

Node.js 20 veya üzeri gerekir. Paket kurulumu ve API anahtarı gerekmez.

```sh
npm start
```

Ekranda yazan yerel adresi aç. Dosyayı doğrudan çift tıklamak yerine HTTP sunucusunu kullan.

```sh
npm test
npm run build
```

`dist/` yalnız yayın için gerekli statik dosyaları içerir. Uygulama harici CDN, analiz servisi veya font servisi kullanmaz; kaynak bağlantıları tıklandığında ilgili site yeni sekmede açılır.

## GitHub Pages

Depodaki `.github/workflows/pages.yml`, `main` dalına her değişiklikte testleri ve derlemeyi çalıştırır; başarılı sonucu GitHub Pages'e yayınlar. İlk kurulumda **Settings → Pages → Source: GitHub Actions** seçilir. GitHub hesabının ücretsiz planında depo ve site herkese açıktır. Yalnız `dist/` yayınlanır.

İçerik güncellemesi `data.json` üzerinden yapılır; kart kimliklerini korumak mevcut kişisel kayıtların eşleşmesini sağlar. Uygulamanın içindeki kart düzenlemesi ise tarayıcıya özel kalır. Güncel kaynak kontrol tarihlerini yalnız gerçekten yeniden araştırıldıysa değiştir.

## Dosyalar

- `app.js`: gezinme, arama, harita ve ayrıntı paneli
- `graph.js`: açılır dalların yerleşimi ve ilişki yönleri
- `state.js`: kalıcı kişisel kayıt ve doğrulanan yedekleme
- `data.json`: kişisel profili genelleştirilmiş araştırma verisi
- `styles.css`, `app.css`: masaüstü ve mobil görünüm
- `*.test.mjs`: yerleşim, kaynak ilişki yönleri, arama ve kayıt/yedekleme kontrolleri
