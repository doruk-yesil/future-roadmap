// Curated from repository files and the existing portfolio, checked 2026-10-26.
// Results describe saved evidence, not experiments rerun by this website.
const github='https://github.com/';
const file=(repo,path)=>github+repo+'/blob/main/'+path;
const portfolio=file('doruk-yesil/my-portfolio','src/data/content.js');
const source=(title,url,summary,restricted=false)=>({title,url,summary,restricted});
export const PROJECTS_CHECKED_AT='26 Ekim 2026';
export const ACADEMIC_PROJECTS=[
 {
  id:'bibliocast',group:'applications',course:'ENS491 / ENS492',title:'Bibliocast · E-öğrenme platformu',
  summary:'Kurs keşfi, video izleme ve öğrenci / eğitmen / yönetici akışlarını birleştiren bitirme projesi.',
  evidence:'Kod envanteri + katkı kayıtları',tech:['React','TypeScript','React Query','Keycloak','Material UI','Vite','Docker'],
  purpose:'Bir eğitim platformunda kurs bulma, kayıt olma, içerik tüketme ve kurs yönetimini farklı kullanıcı rollerine uygun tek bir deneyimde toplamak.',
  approach:['React ve TypeScript ile özellik bazında ayrılmış bir arayüz; yönlendirme, ortak bileşenler ve API katmanları.','React Query ile sunucu verisi, önbellek ve mutation sonrası yenileme; Keycloak/OIDC ile oturum ve rol bazlı ekranlar.','Kurs kataloğu, sepet, video oynatıcı, ders ilerlemesi, notlar, quizler, sertifika ve tartışma ekranları.','Material UI, video.js, grafik bileşenleri ve Docker/nginx dağıtım dosyaları. Portfolyoda tüm sistemin backend tarafı Spring Boot, PostgreSQL, S3 ve Kafka ile anlatılıyor; bu incelemede doğrudan frontend deposu okundu.'],
  results:['Geniş bir ürün arayüzü ve API entegrasyonu mevcut; öğrenci, eğitmen, moderatör ve yönetici akışları teknik envanterde tek tek açıklanıyor.','Envanter bazı özellikleri mock veya eksik olarak ayırıyor: gerçek ödeme entegrasyonu, bazı transkript/önizleme alanları ve bazı moderasyon ekranları. Bunlar tamamlanmış üretim özelliği sayılmamalı.','Canlı kullanıcı sayısı, performans ölçümü veya üretim ortamı kabul testi doğrulanmadı. Envanter 7 Mayıs 2026 tarihli; depoda daha sonraki değişiklikler de var.'],
  role:'Frontend deposunda doruk-yesil adına commit ve birleştirilmiş değişiklik kayıtları var. İndirim akışının tamamlanması ve yönetici indirimi düzeltmesi gibi somut kayıtlar görüldü. Bütün platformu tek başıma yaptım şeklinde anlatılmamalı.',
  cv:'Ekip bitirme projesinde React/TypeScript tabanlı bir e-öğrenme platformunun geliştirilmesine katkı sağladım; rol bazlı arayüzler, API entegrasyonu ve indirim akışları üzerinde çalıştım.',
  interview:['Rol kontrolünün arayüzdeki yönlendirme ile sunucudaki yetkilendirme arasındaki farkını anlat.','React Query anahtarları, mutation sonrası invalidation ve misafir sepetinin oturum açınca taşınması iyi mimari örnekleri.','Kendi commitlerinden bir akışı seç: sorun → değişiklik → kontrol adımlarını göster; ekip kapsamını kişisel katkıdan ayır.'],
  next:['Kendi katkılarını 2–3 ekran ve ilgili commit ile eşleştir.','Mock akışları ve backend gerektiren akışları gösteren kısa bir demo senaryosu hazırla.','Kimlik bilgisi içermeyen ekran görüntüleriyle bir portfolyo vaka çalışması çıkar.'],
  sources:[source('Frontend teknik envanteri',file('Bibliocast-Frontend/Bibliocast-Frontend','summary-of-frontend.txt'),'Chrome üzerinden okundu: yığın, sayfalar, API entegrasyonları ve mock/eksik alanlar. Özel depo; erişim yetkisi gerekir.',true),source('Kişisel katkı geçmişi',github+'Bibliocast-Frontend/Bibliocast-Frontend/commits?author=doruk-yesil','Chrome üzerinden okundu: doruk-yesil commitleri, indirim geliştirmeleri ve birleştirme kayıtları.',true),source('Discount Finalized commit kaydı',github+'Bibliocast-Frontend/Bibliocast-Frontend/commit/22e4fb594053aaf61a9f2936a2f5868235fad99d','Kişisel katkı geçmişinde görülen somut değişiklik kaydı; bütün sistemin yazarlığı anlamına gelmez.',true),source('Mevcut portfolyo',portfolio,'Bitirme projesinin amacı ve tüm sistem yığını için mevcut portfolyo beyanı; frontend dışı bileşenler burada koddan yeniden doğrulanmadı.')]
 },
 {
  id:'ecommerce',group:'applications',course:'CS308',title:'E-ticaret platformu',
  summary:'Ürün listesinden sepet, sipariş, stok ve fatura akışına uzanan full-stack ekip çalışması.',
  evidence:'README + uygulama kodu',tech:['React','Java 17','Spring Boot','MongoDB','Firebase Auth','Docker'],
  purpose:'Müşteri alışverişini ve ürün/satış yöneticilerinin operasyonlarını aynı uygulamada yürütmek; frontend, backend ve veritabanı katmanlarını birlikte geliştirmek.',
  approach:['React arayüzü; müşteri, ürün yöneticisi ve satış yöneticisi ekranları.','Spring Boot ve MongoDB ile ürün, müşteri, sipariş, iade ve yorum alanları; Gradle bağımlılıkları okundu.','CustomerService içinde sepet ekleme/çıkarma, stok kontrolü, checkout ve fatura kaydı akışları var.','README Firebase Authentication, JWT ve Docker kullanımını belirtiyor. Docker/compose dosyaları var; Kubernetes yalnız isteğe bağlı diye geçiyor, uygulanmış sayılmadı.'],
  results:['Depoda gezinme/arama, sepet, sipariş geçmişi, fatura, yorum/puan ve yönetici panelleri için kod mevcut.','Checkout servisinde stok güncelleme, sepet boşaltma ve alışveriş kaydını ilişkilendirme görülüyor.','Bu incelemede uygulama ayağa kaldırılmadı; gerçek ödeme sağlayıcısı, yük testi, canlı satış veya güvenlik uygunluğu doğrulanmadı.'],
  role:'Ekip projesi. Mevcut portfolyo geçici Product Owner sorumluluğu, sprint planlama ve günlük toplantılardan söz ediyor. Portfolyoda ekip büyüklüğü tutarsız yazıldığı için kişi sayısı kullanılmadı; modül bazında kişisel sahiplik ayrıca teyit edilmeli.',
  cv:'React, Spring Boot ve MongoDB kullanılan bir e-ticaret ekip projesinde ürün, sepet, sipariş ve yönetici akışlarının geliştirilmesine katkı sağladım; geçici Product Owner sorumluluğu üstlendim.',
  interview:['Sepetten siparişe geçerken stok ve tutar tutarlılığını nasıl koruduğunu anlat.','Müşteri / ürün yöneticisi / satış yöneticisi ayrımını örnekle.','Bir sprint kararını ve kendi kod değişikliğini göster; gerçek ödeme ile ders içi checkout akışını ayır.'],
  next:['Checkout ve stok yarış koşulları için anlamlı entegrasyon testleri ekle.','Kişisel katkı listesini commitlerle doğrula.','README çalıştırma adımlarını ve demo verisini tamamla.'],
  sources:[source('Proje README',file('idemelisy/CS308','README.md'),'Amaç, kullanıcı rolleri, temel özellikler ve açıklanan teknoloji yığını.'),source('Backend bağımlılıkları',file('idemelisy/CS308','backend_files/build.gradle'),'Java 17, Spring Boot, MongoDB, e-posta ve PDF bağımlılıkları.'),source('Checkout ve sepet servisi',file('idemelisy/CS308','backend_files/src/main/java/org/project/service/CustomerService.java'),'Sepet, stok, checkout ve fatura kayıt akışları koddan okundu.'),source('Frontend bağımlılıkları',file('idemelisy/CS308','frontend_files/package.json'),'React, Firebase, Axios, grafik ve PDF araçları.'),source('Portfolyodaki ekip rolü',portfolio,'Product Owner sorumluluğu portfolyo beyanıdır; farklı ekip büyüklükleri nedeniyle sayı alınmadı.')]
 },
 {
  id:'how-u-doin',group:'applications',course:'CS310',title:'How U Doin · Mobil sohbet',
  summary:'Arkadaşlık, birebir mesajlaşma ve grup sohbeti için mobil uygulama ve Java backend.',
  evidence:'README + backend kodu',tech:['React Native','Java 17','Spring Boot','MongoDB','JWT','Spring Security'],
  purpose:'Mobil kullanıcıların hesap oluşturup arkadaş ekleyebildiği ve mesajlaşabildiği, Android/iOS odaklı bir sohbet uygulaması geliştirmek.',
  approach:['README mobil arayüzü React Native ve JavaScript olarak anlatıyor; bu depodaki incelenen dosyalar ağırlıklı olarak backend.','Spring Boot, MongoDB, Spring Security, validation ve JWT bağımlılıkları Gradle dosyasından doğrulandı.','Auth, arkadaşlık, grup ve mesaj controller/service/repository katmanları var. MessageService mesajdan önce kullanıcıları ve kabul edilmiş arkadaşlığı kontrol ediyor.'],
  results:['Mesaj kaydetme, konuşma getirme, arkadaş ve grup yönetimi için backend kodu mevcut.','README Android ve iOS emülatör testlerinden söz ediyor; test çıktıları bu incelemede görülmedi.','README gerçek zamanlı mesajlaşma diyor; incelenen koddan WebSocket/push mimarisi doğrulanmadı. Üretim mesajlaşma hizmeti diye sunulmamalı.'],
  role:'Ekip projesinin deposuna erişim var; okunan kaynaklarda kişisel modül dağılımı açık değil. Kendi geliştirdiğin endpoint veya ekranı commit üzerinden seçerek anlatmak gerekir.',
  cv:'Mobil sohbet ekip projesinde Java/Spring Boot ve MongoDB kullanılan backend akışlarıyla çalıştım; arkadaşlık, mesajlaşma ve kimlik doğrulama tasarımını uygulamalı olarak ele aldım.',
  interview:['Mesaj gönderen ve alıcının doğrulanması, arkadaşlık durumu ve konuşma erişimini anlat.','JWT ile oturum yönetimi ve parola saklama kararlarını gözden geçir.','Mobil REST çağrısı ile gerçek zamanlı bağlantının farklı ihtiyaçlarını açıkla.'],
  next:['Mobil istemcinin kodunu ve çalışır demo adımlarını bu depoyla eşleştir.','İleti sıralaması, sayfalama ve yetkisiz konuşma erişimini test et.','Gerçek zamanlılık kullanılacaksa taşıma ve yeniden bağlantı yaklaşımını belgele.'],
  sources:[source('Sohbet projesi README',file('ilke-demirkir/CS310','README.md'),'Uygulamanın amacı, React Native arayüz beyanı ve emülatör test beyanı.'),source('Backend teknoloji yığını',file('ilke-demirkir/CS310','build.gradle'),'Spring Boot, MongoDB, JWT, Spring Security ve Java 17 doğrulandı.'),source('Mesaj servisi',file('ilke-demirkir/CS310','src/main/java/com/example/cs310_how_u_doin/service/MessageService.java'),'Kullanıcı/arkadaşlık kontrolü, mesaj kaydetme ve konuşma getirme kodu.')]
 },
 {
  id:'forest-fire',group:'ai',course:'CS419',title:'Uydu görüntülerinden orman yangını tespiti',
  summary:'Etiketli eğitim verisi gerektirmeyen spektral yöntemleri karşılaştıran görüntü işleme çalışması.',
  evidence:'README + kayıtlı sonuç tablosu',tech:['Python','Sentinel-2','FIRMS','NBR / dNBR','K-Means','Görüntü işleme'],
  purpose:'Yoğun elle etiketleme gerektirmeden yangından etkilenmiş alanları çok bantlı uydu görüntülerinden ayırmak ve yöntemleri karşılaştırmak.',
  approach:['FIRMS yangın noktalarıyla olay seçimi ve Sentinel-2 sahnelerinin alınması.','Bulut/gölge maskeleme ve hizalama; NIR/SWIR bantlarından NBR hesaplama.','NBR eşikleme, adaptif eşikler, K-Means ve diğer basit indeks yöntemlerinin karşılaştırılması.','dNBR tabanlı vekil referans maskesiyle piksel düzeyinde F1, IoU, precision ve recall değerlendirmesi.'],
  results:['README tablosu: NBR_binary ortalama F1 0,4601 ve IoU 0,3565; KMeans (k=3) F1 0,2913; NDVI_0.2 F1 0,2304; SWIR_p90 F1 0,0962.','Bu karşılaştırmada NBR yöntemi en yüksek ortalama F1 değerine sahip. Bu, evrensel yangın tespit doğruluğu veya canlı afet sistemi performansı değil.','Referans maske dNBR’den türetilmiş bir silver standard; bağımsız, elle etiketli gerçek saha verisiyle aynı değil. README sonuçları aktarıldı, deneyler yeniden çalıştırılmadı.'],
  role:'README katkı listesinde Doruk Yeşil için özellik mühendisliği, segmentasyon yöntemlerinin uygulanması ve deneysel değerlendirme açıkça yazıyor.',
  cv:'Sentinel-2 görüntülerinde NBR tabanlı gözetimsiz yangın alanı segmentasyonu için özellik mühendisliği, yöntem uygulaması ve deneysel değerlendirme yaptım; farklı eşikleme/kümeleme yöntemlerini F1 ve IoU ile karşılaştırdım.',
  interview:['Neden yalnız RGB yerine NIR/SWIR ve NBR kullanıldığını açıkla.','Silver standard ile bağımsız ground truth arasındaki farkı belirt.','Yüksek recall, düşük precision ve yanlış alarm maliyetini örnekle.'],
  next:['Bağımsız etiketli bir test alanıyla doğrula; olay bazında veri ayrımını belgele.','Ortalama yanında olay bazlı sonuçları ve hata örneklerini göster.','Bulut, mevsim ve arazi tipine duyarlılığı ölç.'],
  sources:[source('Amaç, sonuçlar ve katkı listesi',file('Yesimtsn/ForestFireDetection_CS419','README.md'),'Yöntem akışı, sayısal sonuç tablosu, vekil referans tanımı ve kişisel görev paylaşımı okundu.'),source('Deney dosyaları',github+'Yesimtsn/ForestFireDetection_CS419','FIRMS/ground-truth notebookları ve segmentasyon dosyaları listelendi. Büyük segmentasyon notebooku bu incelemede bütünüyle okunmadı.')]
 },
 {
  id:'clarity',group:'ai',course:'CS445',title:'CLARITY · Politik yanıtlarda kaçamak cevap tespiti',
  summary:'Soru-cevap çiftlerini açık yanıt, muğlak yanıt ve açık yanıt vermeme olarak sınıflandıran NLP çalışması.',
  evidence:'README + notebook çıktıları',tech:['Python','PyTorch','Hugging Face','RoBERTa','Llama / LoRA','scikit-learn','Optuna'],
  purpose:'Politik röportajlarda bir soruya gerçekten cevap verilip verilmediğini sınıflandırmak; klasik dilsel özelliklerle transformer yaklaşımlarını karşılaştırmak.',
  approach:['QEvasion verisindeki 3.448 eğitim ve 308 test soru-cevap çifti; üç sınıf ve dengesiz dağılım.','TF-IDF, dilsel özellik mühendisliği, klasik modeller ve MLP; ayrıca RoBERTa ve Llama/LoRA denemeleri.','Soru-cevap eşleştirme, ön işleme, model seçimi ve sınıf bazlı precision/recall/F1 incelemesi.'],
  results:['README yaklaşık 0,74 Macro F1 yazıyor. Ancak notebooktaki ilgili 308 örnekli çıktı açıkça Weighted F1 = 0,7389 diyor; aynı classification report’ta macro F1 yaklaşık 0,65, accuracy yaklaşık 0,75. Bu değerler aynı metrik değil.','Bu sayfada 0,7389 değeri weighted F1 olarak korunuyor; 0,74 macro F1 başarı iddiası doğrulanmış kabul edilmiyor.','Kayıtlı deney çıktıları incelendi; modeller yeniden eğitilmedi. Bu sonuç tüm modellerin ortak skoru veya SemEval resmî sıralaması değil.'],
  role:'Ortak depoya erişim var; README kişisel modül paylaşımı vermiyor. Özellik mühendisliği, eğitim veya değerlendirme içinden kendi yaptığın bölümü commit/rapor ile seçerek netleştir.',
  cv:'Politik soru-cevaplarda kaçamak yanıt sınıflandırması için klasik NLP ve transformer yaklaşımlarını karşılaştıran ekip projesinde çalıştım; dengesiz veri ve sınıf bazlı model değerlendirmesini ele aldım.',
  interview:['Macro F1 ile weighted F1 farkını sınıf dengesizliği üzerinden anlat.','Azınlık sınıfının hatalarının genel accuracy içinde nasıl gizlenebileceğini göster.','Veri ayrımını, hiperparametre seçimini ve test setinin ne zaman kullanıldığını açıkla.'],
  next:['README’deki F1 adlandırmasını deney çıktısıyla eşleştir.','Her model için aynı split ve metriklerle tek bir sonuç tablosu çıkar.','Kişisel katkıyı ve yeniden üretilebilir eğitim ayarlarını kaydet.'],
  sources:[source('CLARITY proje README',file('Akseldindisyan/CS445_CLARITY_Unmasking-Political-Question-Evasions','README.md'),'Amaç, veri büyüklükleri ve yöntemler. Başarı metriği notebook ile karşılaştırıldığında adlandırma farkı bulundu.'),source('Kayıtlı deney notebooku',file('Akseldindisyan/CS445_CLARITY_Unmasking-Political-Question-Evasions','CS445.ipynb'),'156 hücreli notebook okundu. İlgili çıktı weighted F1 0,7389; sınıflandırma raporunda macro F1 yaklaşık 0,65, test örnek sayısı 308.')]
 },
 {
  id:'2048-agent',group:'ai',course:'CS415',title:'2048 · Policy Gradient oyun ajanı',
  summary:'Kendi oyun ortamında REINFORCE ile dört hamle arasından seçim öğrenen bir ajan.',
  evidence:'README + eğitim/değerlendirme kodu',tech:['Python','PyTorch','REINFORCE','NumPy','Matplotlib','Pygame'],
  purpose:'2048 tahtasından hamle seçen bir politika ağı eğitmek; durum temsili, ödül tasarımı ve eğitim/değerlendirme farkını deneyimlemek.',
  approach:['4×4 tahta, log2 tabanlı normalize edilmiş 16 elemanlı vektöre dönüştürülüyor.','İki gizli katmanlı PyTorch ağı dört hamle için çıktı üretiyor; eğitimde kategorik örnekleme kullanılıyor.','REINFORCE, hareketli baseline ve entropy bonus; ortamda köşe sezgisi ve geçersiz hamle cezaları.','Değerlendirmede ağın tercih sırasından tahtayı değiştiren hamle seçiliyor; ortalama/en iyi skor ve en büyük taş raporlanıyor. Pygame manuel oyun arayüzü de var.'],
  results:['Ortam, politika ağı, eğitim döngüsü, değerlendirme ve çizim fonksiyonları kodda mevcut.','Depoda incelenen kaynaklarda doğrulanabilir sabit bir eğitim sonucu, final skor tablosu veya kayıtlı model checkpoint’i bulunmadı. 2048’e ulaştı / şu başarı oranını aldı gibi bir sonuç eklenmedi.','README varsayılan bölüm sayısı ile güncel kod farklı; gerçek deney ayarı kod ve log üzerinden belirtilmeli.'],
  role:'Ekip projesi; okunan dosyalarda kişisel iş bölümü belirtilmiyor. Ortam, ödül tasarımı veya ağ/eğitim içinden kendi geliştirdiğin kısmı kaynakla eşleştir.',
  cv:'2048 için PyTorch tabanlı bir policy-gradient ajanı geliştiren ekipte çalıştım; durum kodlama, ödül tasarımı, eğitim ve değerlendirme akışlarını ele aldım.',
  interview:['Eğitimde örnekleme ile değerlendirmede geçerli en iyi hamle seçimini ayır.','Reward shaping’in oyunun gerçek skorundan nasıl farklı olabildiğini anlat.','Rastgele veya basit sezgisel bir baseline olmadan iyileşme iddiasının neden zayıf kaldığını açıkla.'],
  next:['Sabit seed’ler, checkpoint ve deney ayarlarını kaydet.','Rastgele/sezgisel baseline ile çoklu koşu karşılaştırması yap.','Eğitim dışı oyunlarda ortalama skor, dağılım ve en büyük taş değerlerini raporla.'],
  sources:[source('2048 proje README',file('ilke-demirkir/415_Project','README.md'),'Oyun ortamı, REINFORCE ajanı, Pygame ve değerlendirme akışı.'),source('Politika ve eğitim kodu',file('ilke-demirkir/415_Project','Policy_Gradient.py'),'16 boyutlu temsil, 128 birimli iki gizli katman, baseline/entropy ve değerlendirme seçim mantığı okundu.')]
 },
 {
  id:'turkish-nlp',group:'ai',course:'CS445 · Ders çalışmaları',title:'Türkçe duygu analizi ve model karşılaştırması',
  summary:'BERTurk, GPT-2 ve mT5/BART yaklaşımlarını karşılaştıran, mevcut portfolyoda kayıtlı çalışma.',
  evidence:'Yalnız portfolyo kaydı',tech:['Python','BERTurk','GPT-2','mT5 / BART','Model değerlendirme'],
  purpose:'Türkçe duygu sınıflandırmasında farklı transformer modellerinin performansını karşılaştırmak ve model seçimi pratiği edinmek.',
  approach:['Mevcut portfolyo ön işleme, model seçimi, hiperparametre ayarlama ve değerlendirme çalışmasını anlatıyor.','Aynı ders kapsamında VGG-16/CelebA transfer öğrenme ve bilgi erişimi/NLP ödevi de anılıyor; bunların kodları bu taramada bulunmadı.'],
  results:['Portfolyoda BERTurk için yaklaşık 0,94 ve GPT-2 için yaklaşık 0,876 validation F1 beyanı var.','Bu çalışmanın deney notebooku, veri kümesi, F1 ortalaması ve split ayrıntıları bulunamadı; sayılar bağımsız doğrulanmış sonuç olarak sunulmuyor. CLARITY ayrı bir proje ve veri kümesi.'],
  role:'Portfolyoda yer alıyor; ödev dosyası veya katkı kaydıyla kişisel uygulama ayrıntısı doğrulanmalı.',
  cv:'Türkçe duygu analizi için transformer modellerini karşılaştırdım; ön işleme, hiperparametre seçimi ve değerlendirme üzerinde çalıştım. Sayısal başarıyı eklemeden önce deney dosyasını teyit et.',
  interview:['Neden validation ile test sonucunu ayırdığını açıkla.','Tokenizer, dil kapsamı ve sınıf dengesinin model seçimine etkisini tartış.','Aynı veri bölünmesi ve aynı F1 tanımıyla karşılaştırma yapılıp yapılmadığını kontrol et.'],
  next:['Orijinal ödev/notebook ve sonuç tablolarını bul.','Veri seti, seed, split ve macro/weighted F1 türünü kaydet.','Portfolyodaki sayıları doğrulanmış kaynaklarla güncelle.'],
  sources:[source('Portfolyodaki NLP kaydı',portfolio,'Duygu analizi açıklaması ve yaklaşık validation F1 beyanları okundu. Ayrı deney deposu bulunamadı.')]
 },
 {
  id:'tourism-network',group:'data',course:'CS414',title:'Turizm ve uçuş ağı veri çalışması',
  summary:'Turizm veri dosyaları, uçuş grafı ve API ile fiyat zenginleştirme denemeleri.',
  evidence:'Notebook + dosya envanteri',tech:['Python','Pandas','NetworkX','GraphML','HTTP API','Jupyter'],
  purpose:'Depoda görülen çalışma: turizm verilerini toplamak ve uçuş bağlantı grafının kenarlarına fiyat bilgisi eklemek. Dersin tam problem tanımı ve nihai araştırma sorusu açık değil.',
  approach:['Pandas ve NetworkX kullanılan notebook GraphML grafını okuyor.','Uçuş bağlantılarındaki eksik fiyatları harici API yanıtlarından doldurma, hata durumuna değer atama ve grafı yeniden kaydetme adımları var.','Depoda UNWTO turizm konaklama, seyahat, varış ve harcama dosyaları bulunuyor. Bunların notebooktaki grafla tamamlanmış bir modele bağlandığı doğrulanmadı.'],
  results:['Veri toplama/zenginleştirme kodu ve graf dosyası mevcut; bazı kayıtlı çıktılarda boş yanıt ve istek hataları var.','Nihai analiz, optimizasyon sonucu, performans ölçüsü veya tamamlanmış rapor bulunmadı. Başarı sonucu üretmek yerine veri hazırlama çalışması olarak saklandı.'],
  role:'Ortak depo; kişisel görev dağılımı ve tamamlanan teslim kapsamı doğrulanmadı.',
  cv:'Turizm ve uçuş bağlantıları üzerinde Python, Pandas ve NetworkX ile veri hazırlama ve API tabanlı graf zenginleştirme çalışmasına katkı sağladım. Nihai analiz iddiası için rapor gerekli.',
  interview:['Eksik/hatalı API yanıtlarını graf üzerinde nasıl temsil ettiğini anlat.','Yönlü bağlantı, fiyat ağırlığı ve veri güncelliğinin analizi nasıl etkilediğini açıkla.','Veri toplanmış olması ile araştırma sorusunun cevaplanmış olması arasındaki farkı belirt.'],
  next:['Ders raporunu ve teslim kapsamını bul.','Hata/eksik veri politikasını ve API oran sınırını belgele.','Tek bir araştırma sorusu seçerek tekrar üretilebilir analiz çıkar.'],
  sources:[source('Veri hazırlama notebooku',file('ilke-demirkir/CS414','Ba%C5%9FarScraping/data.ipynb'),'Pandas/NetworkX, GraphML okuma-yazma ve API ile fiyat zenginleştirme akışı okundu. Kimlik bilgileri özete alınmadı.'),source('Veri dosyaları',github+'ilke-demirkir/CS414/tree/main/Data','Turizm veri dosyaları depo ağacından doğrulandı; dosyaların içerikleri ve nihai analiz bütünüyle okunmadı.')]
 },
 {
  id:'drone-network',group:'data',course:'CS408',title:'Drone tabanlı sensör ağı',
  summary:'Sensör → drone → sunucu akışı, TCP iletişimi ve batarya davranışı için ağ mimarisi.',
  evidence:'Yalnız portfolyo kaydı',tech:['TCP','Dağıtık sistemler','Edge processing','JSON / CSV'],
  purpose:'Sensör verisini drone üzerinden merkeze taşıyan dağıtık bir iletişim mimarisi tasarlamak; iletişim ve cihaz davranışını birlikte düşünmek.',
  approach:['Portfolyoda TCP iletişimi ve yapılandırılmış veri formatları anlatılıyor.','Sensör-drone-sunucu katmanları, drone batarya takibi ve üsse dönüş davranışı anılıyor.'],
  results:['Mimari tasarım portfolyoda mevcut; kaynak kod, deney raporu, ağ gecikmesi/paket kaybı ölçümü ve gerçek drone donanımı bu taramada doğrulanamadı.','Bu nedenle fiziksel sistem kuruldu veya belirli performansa ulaştı diye yazılmadı.'],
  role:'Portfolyoda kayıtlı ders çalışması; kişisel uygulama kapsamı rapor veya kodla tamamlanmalı.',
  cv:'TCP iletişimi, veri formatları ve batarya/üsse dönüş davranışını içeren sensör-drone-sunucu mimarisi tasarladım. Donanım uygulaması ve performans sayıları için ayrıca kanıt gerekir.',
  interview:['TCP seçiminin güvenilirlik ve gecikme açısından sonuçlarını anlat.','Bağlantı kopması, yeniden bağlanma ve tekrar gelen veri için yaklaşımını açıkla.','Drone bataryası azalınca veri aktarımı ve görev önceliğinin nasıl değiştiğini tartış.'],
  next:['Orijinal kod/rapor ve mimari çizimini bul.','Simülasyon ile fiziksel uygulama kapsamını ayır.','Bağlantı kesintisi ve batarya senaryolarını ölçülebilir testlere dönüştür.'],
  sources:[source('Portfolyodaki ağ projesi',portfolio,'Sensör-drone-sunucu mimarisi, TCP, veri formatları ve batarya/üsse dönüş beyanı. Ayrı kod deposu bulunamadı.')]
 }
];

const escapeHTML=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const list=items=>`<ul>${items.map(x=>`<li>${escapeHTML(x)}</li>`).join('')}</ul>`;
const faq=(question,body,open=false)=>`<details class="project-faq"${open?' open':''}><summary>${escapeHTML(question)}</summary><div class="project-answer">${body}</div></details>`;
const groups=[['applications','Uygulama ve ürün geliştirme'],['ai','Yapay zekâ ve görüntü işleme'],['data','Veri ve ağ sistemleri']];
export function searchProjects(query){
 const words=String(query??'').toLocaleLowerCase('tr-TR').trim().split(/\s+/).filter(Boolean);
 if(!words.length)return [];
 return ACADEMIC_PROJECTS.filter(p=>{const text=JSON.stringify(p).toLocaleLowerCase('tr-TR');return words.every(w=>text.includes(w));});
}
export function renderProjectResults(projects){return projects.map(p=>`<a class="result-item project-search-result" href="#view=projects&project=${p.id}"><span class="result-main"><span class="result-category">OKUL PROJESİ · ${escapeHTML(p.course)}</span><strong>${escapeHTML(p.title)}</strong><span class="result-excerpt">${escapeHTML(p.summary)}</span></span><span class="project-search-arrow" aria-hidden="true">→</span></a>`).join('');}
export function renderProjects(selectedId=null){
 const cards=projects=>projects.map(p=>`<details class="academic-project" id="project-${p.id}" name="academic-project"${p.id===selectedId?' open':''}>
 <summary><span class="project-summary-main"><span class="project-course">${escapeHTML(p.course)}</span><strong>${escapeHTML(p.title)}</strong><span class="project-excerpt">${escapeHTML(p.summary)}</span></span><span class="project-plus" aria-hidden="true">+</span></summary>
 <div class="project-content"><div class="project-meta"><span>${escapeHTML(p.evidence)}</span><span>İnceleme: ${PROJECTS_CHECKED_AT}</span></div><div class="project-tech" aria-label="Kullanılan teknolojiler">${p.tech.map(t=>`<span>${escapeHTML(t)}</span>`).join('')}</div>
 ${faq('Ne amaçla yapıldı?',`<p>${escapeHTML(p.purpose)}</p>`,true)}
 ${faq('Hangi teknoloji ve yöntemler kullanıldı?',list(p.approach))}
 ${faq('Ortaya ne çıktı? Sonuçları nasıl okumalıyım?',list(p.results))}
 ${faq('Benim katkım neydi?',`<p>${escapeHTML(p.role)}</p>`)}
 ${faq('CV ve mülakatta nasıl anlatabilirim?',`<p class="project-cv">${escapeHTML(p.cv)}</p><h3>Mülakatta anlatabileceğin noktalar</h3>${list(p.interview)}<p class="project-answer-note">CV cümlesini başvurudan önce kendi gerçek sorumluluğun ve gösterebileceğin kayıtlarla eşleştir.</p>`)}
 ${faq('Tekrar geliştirmek istersem nereden devam ederim?',list(p.next))}
 ${faq('Kaynaklar ve doğrulama',p.sources.filter(s=>{try{return new URL(s.url).protocol==='https:';}catch{return false;}}).map(s=>`<article class="project-source"><a href="${escapeHTML(s.url)}" target="_blank" rel="noopener noreferrer">${escapeHTML(s.title)} <span aria-hidden="true">↗</span></a>${s.restricted?'<span class="project-source-access">Özel depo · GitHub erişimi gerekir</span>':''}<p>${escapeHTML(s.summary)}</p></article>`).join(''))}
 <a class="project-permalink" href="#view=projects&project=${p.id}">Bu projenin bağlantısını aç →</a></div></details>`).join('');
 return `<section class="collection-heading projects-heading"><span class="eyebrow">ÇALIŞMA ALANIM / PROJE ARŞİVİ</span><h1>Okul Projelerim</h1><p>Bir projeye tıkla; amacını, kullanılanları, sonuçlarını ve başvuruda nasıl anlatabileceğini aç. Her cevap kendi başlığı altında.</p><div class="project-overview"><span>${ACADEMIC_PROJECTS.length} proje</span><span>7 depo kaydı · 2 portfolyo kaydı</span><span>${PROJECTS_CHECKED_AT}</span></div></section>
 <div class="projects-list">${groups.map(([id,title])=>`<section class="project-group" aria-labelledby="project-group-${id}"><h2 id="project-group-${id}">${title}</h2>${cards(ACADEMIC_PROJECTS.filter(p=>p.group===id))}</section>`).join('')}</div>
 <p class="project-footer-note">Özetler mevcut kod, kayıtlı çıktı ve portfolyo metinlerinden hazırlandı. Deneyler ve eski uygulamalar yeniden çalıştırılmadı. Kaynağı yalnız portfolyo olan kayıtlar ayrıca belirtildi.</p>`;
}
