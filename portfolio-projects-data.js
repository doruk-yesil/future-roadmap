// Project-only copy from my-portfolio/src/data/content.js, read 2026-11-09.
export const PORTFOLIO_PROJECTS = [
  {
    "id": "bibliocast",
    "title": "Bibliocast",
    "subtitle": "ENS491 / ENS492 Bitirme Projesi · Sabancı Üniversitesi",
    "meta": "Danışman: Prof. Albert Levi · 4 kişilik takım",
    "description": "AI destekli e-öğrenme platformunun React ve TypeScript arayüzü üzerinde ekip çalışması. Rol bazlı öğrenci, eğitmen ve yönetici panelleri; kurs kataloğu, video izleme, sepet ve mock ödeme akışları, tartışmalar ve sertifika doğrulama ekranları içerir. Keycloak ile kimlik doğrulama ve TanStack Query ile API veri yönetimi kullanılır.",
    "tags": [
      "React",
      "TypeScript",
      "Material UI",
      "TanStack Query",
      "Keycloak",
      "Video.js"
    ],
    "links": [
      {
        "href": "https://github.com/Bibliocast-Frontend/Bibliocast-Frontend",
        "private": false
      }
    ],
    "startDate": "2025-11",
    "endDate": "2026-06-10",
    "period": "Kasım 2025 – Haziran 2026"
  },
  {
    "id": "clarity",
    "title": "CLARITY",
    "subtitle": "CS445 Natural Language Processing",
    "meta": "Politik soru-cevap sınıflandırması · Ekip projesi",
    "description": "Politik röportajlardaki soru-cevap çiftlerini açık yanıt, muğlak yanıt ve açık yanıt vermeme olarak sınıflandıran NLP projesi. QEvasion verisi üzerinde TF-IDF ve dilsel özellikler kullanan klasik modeller, MLP, RoBERTa ve Llama/LoRA yaklaşımları karşılaştırıldı.",
    "tags": [
      "Python",
      "PyTorch",
      "Hugging Face",
      "RoBERTa",
      "LoRA"
    ],
    "links": [
      {
        "href": "https://github.com/Akseldindisyan/CS445_CLARITY_Unmasking-Political-Question-Evasions"
      }
    ],
    "startDate": "2025-11",
    "endDate": "2026-01-30",
    "period": "Kasım 2025 – Ocak 2026"
  },
  {
    "id": "forest-fire",
    "title": "Gözetimsiz Orman Yangını Tespiti",
    "subtitle": "CS419 Digital Image & Video Analysis",
    "meta": "3 kişilik takım",
    "description": "Sentinel-2 görüntülerinde NBR tabanlı özellik mühendisliği, segmentasyon yöntemlerinin uygulanması ve deneysel değerlendirmeye katkı. FIRMS ile olay seçimi, bulut maskeleme, eşikleme ve K-Means yöntemleri; dNBR’den türetilmiş referans maskeleri üzerinde F1 ve IoU ile karşılaştırıldı.",
    "tags": [
      "Python",
      "Sentinel-2",
      "NBR / dNBR",
      "K-Means",
      "F1 / IoU"
    ],
    "links": [
      {
        "href": "https://github.com/Yesimtsn/ForestFireDetection_CS419"
      }
    ],
    "startDate": "2025-11",
    "endDate": "2026-01-14",
    "period": "Kasım 2025 – Ocak 2026"
  },
  {
    "id": "2048-dl",
    "title": "2048 · Policy Gradient Ajanı",
    "subtitle": "CS415 Deep Learning",
    "meta": "Oyun AI’ı · Model geliştirme",
    "description": "PyTorch ile REINFORCE tabanlı 2048 ajanı geliştiren ekip projesi. Oyun ortamı, tahta temsili, hareketli baseline, entropy bonus ve ödül şekillendirme; eğitim, değerlendirme ve skor çizimleriyle birlikte ele alındı. Pygame ile manuel oyun arayüzü de bulunur.",
    "tags": [
      "Python",
      "PyTorch",
      "REINFORCE",
      "NumPy",
      "Pygame"
    ],
    "links": [
      {
        "href": "https://github.com/ilke-demirkir/415_Project"
      }
    ],
    "startDate": "2025-11",
    "endDate": "2025-12-30",
    "period": "Kasım – Aralık 2025"
  },
  {
    "id": "frontend-experiments",
    "title": "Frontend Tablo ve Editör Demoları",
    "subtitle": "Staj çalışmaları · Vue 3 / TypeScript",
    "meta": "Grid karşılaştırması · Dashboard · Blockly",
    "description": "Dokuz veri-grid entegrasyonunu karşılaştıran uygulama, Quasar çalışan tablosu ve dashboard denemeleri, ayrıca özel toolbox ve yerel çalışma alanı kaydı içeren Blockly editörü. Demolar filtreleme, sayfalama, CSV dışa aktarma ve görsel programlama gibi arayüz ihtiyaçlarını araştırır.",
    "tags": [
      "Vue 3",
      "TypeScript",
      "Quasar",
      "Data Grids",
      "Blockly"
    ],
    "links": [
      {
        "href": "https://github.com/doruk-yesil/grid-comparison",
        "label": "Grid Comparison"
      },
      {
        "href": "https://github.com/doruk-yesil/quasar-limit-testing",
        "label": "Quasar Demos"
      },
      {
        "href": "https://github.com/doruk-yesil/blockly-demo",
        "label": "Blockly Demo"
      },
      {
        "href": "https://github.com/doruk-yesil/StajProj",
        "label": "İş Yerinde Ekstra Proje",
        "private": true
      }
    ],
    "startDate": "2025-06",
    "endDate": "2025-08-05",
    "period": "Haziran – Ağustos 2025"
  },
  {
    "id": "ecommerce",
    "title": "E-Ticaret Platformu",
    "subtitle": "CS308 Software Engineering",
    "meta": "Ekip projesi · Geçici Product Owner",
    "description": "React, Spring Boot ve MongoDB tabanlı ekip projesi: ürün arama, sepet, sipariş, PDF fatura ve müşteri/ürün yöneticisi/satış yöneticisi rolleri. Firebase Authentication ile kimlik doğrulama kullanıldı; geçici Product Owner olarak sprint planlama ve günlük toplantıların koordinasyonuna katkı sağlandı.",
    "tags": [
      "React",
      "Spring Boot",
      "MongoDB",
      "Firebase Auth",
      "Scrum"
    ],
    "links": [
      {
        "href": "https://github.com/idemelisy/CS308"
      }
    ],
    "startDate": "2025-03",
    "endDate": "2025-05-22",
    "period": "Mart – Mayıs 2025"
  },
  {
    "id": "drone-network",
    "title": "Drone Tabanlı Sensör Ağı Mimarisi",
    "subtitle": "CS408 Computer Networks",
    "meta": "Dağıtık sistemler · Ağ mimarisi",
    "description": "TCP iletişimi, yapılandırılmış veri formatları, edge processing kavramları, drone batarya takibi ve üsse geri dönüş davranışı kullanan dağıtık bir sensör-drone-sunucu mimarisi tasarlandı.",
    "tags": [
      "TCP",
      "Dağıtık Sistemler",
      "Edge Computing",
      "JSON/CSV"
    ],
    "startDate": "2025-05",
    "endDate": "2025-05-18",
    "period": "Mayıs 2025 · rapor kaydı"
  },
  {
    "id": "tourism-network",
    "title": "Turizm ve Uçuş Ağı Verileri",
    "subtitle": "CS414 Network Science",
    "meta": "Veri hazırlama · Graf zenginleştirme",
    "description": "Turizm ve uçuş ağı verileri üzerinde Python tabanlı veri hazırlama çalışması. Pandas ve NetworkX kullanılarak GraphML uçuş grafının bağlantılarına API yanıtlarından fiyat bilgisi ekleme, eksik/hatalı sonuçları işleme ve grafı kaydetme adımları araştırıldı.",
    "tags": [
      "Python",
      "Pandas",
      "NetworkX",
      "GraphML",
      "HTTP APIs"
    ],
    "links": [
      {
        "href": "https://github.com/ilke-demirkir/CS414"
      }
    ],
    "startDate": "2025-03",
    "endDate": "2025-05-08",
    "period": "Mart – Mayıs 2025"
  },
  {
    "id": "how-u-doin",
    "title": "How U Doin",
    "subtitle": "CS310 Mobile Application Development",
    "meta": "Mobil mesajlaşma · Ekip projesi",
    "description": "React Native arayüzü ve Java/Spring Boot backend’i olan mobil sohbet projesi. Kullanıcı kimlik doğrulama, arkadaş yönetimi, doğrudan mesajlaşma ve grup sohbeti akışlarını içerir. Backend MongoDB, Spring Security ve JWT kullanır.",
    "tags": [
      "React Native",
      "Java",
      "Spring Boot",
      "MongoDB",
      "JWT"
    ],
    "links": [
      {
        "href": "https://github.com/ilke-demirkir/CS310"
      }
    ],
    "startDate": "2024-11",
    "endDate": "2024-12-29",
    "period": "Kasım – Aralık 2024"
  }
];
