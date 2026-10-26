# Future · Kendi yolunu çiz

Kariyer, eğitim ve ticaret seçenekleri için Türkçe, düzenlenebilir kişisel yol haritası.

## Kullanım

- Dört amaçtan birini seç: İberya & markalar, Ürün ticareti, Yazılım & teknoloji kariyeri, Tarım & gıda.
- Her seviyede en fazla dört kısa seçenek görünür. Seçeneğe tıklayınca özet ve ilk adım sağ panelde açılır.
- Panel geniş bir okuma alanı olarak açılır. Ürün ticaretinin dokuz seçeneğinde üçer somut aşama; her aşamada araştırma soruları, gerekli temas, beklenen çıktı ve önceden okunmuş sayfa özetleri bulunur.
- Kore / Çin güzellik ürünleri; kozmetik, profesyonel saç bakımı, elektriksiz araç ve cihaz alt yollarına ayrılır. Her alt yol ayrı üç aşamadır; ürün sınıfları birbirinin uygunluk süreci olarak sunulmaz.
- Kaynak notları `research.json` içinde tarihli anlık araştırma olarak saklanır. Erişilemeyen sayfalar okunmuş gösterilmez; eski 350 kartın tüm kaynaklarının yeniden okunduğu iddia edilmez.
- Ülke filtresi seçilen amacı daraltır. Tarım deneyimi, eğitim ve pilot birbirinden bağımsız yollardır.
- Siber güvenlik ve CS/analytics masterları teknoloji kariyerinin içindedir. Tarım/gıda eğitimi kendi alanındadır.
- Araştırmanın tamamı, gerekenler, kaynaklar ve gerçek ilişkiler ayrı ayrı genişletilir.
- Kartları favorile, durum seç, kendi notunu yaz ve görev listene ekle.
- Başlık, açıklama, koşul ve kaynakları kişisel kopyanda düzenle.
- Arama bütün özgün kartları kapsar. Elediğin kartlar seçenek panelinde kapalı bir bölümde tutulur.
- 90 günlük plan, favoriler ve görevler çalışma alanında yer alır. Eski kart bağlantıları ve kayıt kimlikleri korunur.
- Çalışma Alanım → Okul Projelerim: dokuz akademik çalışma, tıklanınca açılan proje ve SSS başlıklarıyla incelenir. Amaç, teknoloji, sonuç, kişisel katkı, CV/mülakat anlatımı ve kaynaklar ayrıdır. Projeler genel aramada da bulunur.
- 26 Ekim 2026 incelemesi yedi depo kaydını ve iki yalnız-portfolyo kaydını ayırır. Kayıtlı çıktılar yeniden çalıştırılmış deneyler değildir. CLARITY notebookundaki weighted/macro F1 ayrımı açıkça korunur.
- Kariyer → İş İlanları tek bir dar satır listesidir. Şirket/ilan araması, ülke/bölge, ülke, Remote/Hybrid/On-site, görev, kayıt türü ve gruplama filtreleri URL'de korunur. Beş okunmuş ilan sayfası, 84 önceki şirket kanalı ve bir doğrulanamayan eski kayıt ayrıdır; 84 portalın hepsi yeni açık ilan gibi sunulmaz.
- CV dosyalarım PDF ve LaTeX kaynaklarını yalnız o tarayıcının IndexedDB alanında saklar. Dosyalar yayın paketine, GitHub'a, harita yedeğine veya bir işverene gönderilmez. Cihazlar arasında aktarım için kaynak dosyalar indirilip tekrar içe aktarılır. Orijinal CV'den otomatik yeni iddia/başarı üretilmez.

## Veriler ve gizlilik

350 özgün kart, 632 ilişki, 325 benzersiz kaynak URL ve 84 şirket. Çin ürün ticareti 18 Ekim 2026; diğer kariyer ve eğitim yolları 14–15 Ekim 2026 araştırmasına dayanır. 20 Ekim 2026 düzenlemesi amaç temelli gezinme ve Türkiye/Avrupa tarım keşif kanalları ekler. Türkiye/Avrupa için kişisel uygunluğu teyit edilmiş master veya açık iş listesi sunulduğu anlamına gelmez. Araştırma bağlantıları güncel ilan, kabul, talep veya kârlılık garantisi değildir.

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

- `app.js`: kısa kartlar, ülke filtresi, arama ve ayrıntı paneli
- `navigation.js`: amaç / seçenek gruplaması, özetler ve özgün kartlara bağlantılar
- `research.js`, `research.json`: eylem planları, tarihli sayfa özetleri ve kaynak eşleştirmesi
- `graph.js`: özgün ilişkiler, arama ve önceki harita yerleşimi yardımcıları
- `state.js`: kalıcı kişisel kayıt ve doğrulanan yedekleme
- `data.json`: kişisel profili genelleştirilmiş araştırma verisi
- `styles.css`, `app.css`, `navigation.css`, `reading.css`: masaüstü, mobil ve geniş okuma paneli
- `tests/`: yerleşim, kaynak ilişki yönleri, arama ve kayıt/yedekleme kontrolleri


## 26 Ekim 2026 ilan denetimi

İlan listesi sabit yükseklikte kendi içinde kayar. Varsayılan görünüm yalnız tekil resmî sayfada yeni mezun/Graduate uygunluğu ve çalışma biçimi doğrulanan pozisyonları gösterir. Junior etiketi tek başına yeterli değildir. 90 özgün kaydın tamamının ana bağlantısı ve uygun takip sayfaları açılarak 191 farklı adres kontrol edildi. 7 doğrulanmış ilan ve gerekçeli 86 doğrulanamayan kayıt var. Genel kariyer kanalları ilan sayılmaz. Kaynaklarda ziyaret tarihli özet, kontrolde izlenen adresler ve belirsizlikler korunur. Bu kontrol canlı otomatik takip değildir.

Yerel yeniden hazırlama: `python tools/prepare_jobs.py` ardından `python tools/apply_jobs_audit.py`. Denetim girişleri `outputs/jobs-audit-*.json` içinde tutulur; kişisel CV kaynaklarını içermez.
