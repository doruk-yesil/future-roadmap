// The editorial navigation is separate from source IDs, edges and browser notes.
export const COUNTRIES={all:'Tüm yerler',tr:'Türkiye',eu:'Avrupa',ae:'BAE / Dubai',us:'ABD',cn:'Çin',remote:'Uzaktan'};
const choice=(id,title,summary,nodeIds,countries=[],extra={})=>({id,title,summary,nodeIds,countries,...extra});
const topic=(id,title,summary,choices)=>({id,title,summary,choices});
export function createNavigation(data){
 const ids=group=>data.nodes.filter(n=>n.group===group).map(n=>n.id);
 const pref=prefix=>data.nodes.filter(n=>n.id.startsWith(prefix)).map(n=>n.id);
 const pick=(...values)=>values.flat();
 const routes=[
 {id:'iberya',name:'İberya & markalar',icon:'trade',tag:'MEVCUT İŞ',tone:'sand',description:'Mevcut işi geliştir, yeni marka değerlendir veya kendi markanı kur.',topics:[
  topic('improve','Mevcut işi geliştir','Veriyi, satış kanalını ve üretim düzenini iyileştir.',[
   choice('business-data','İşi ve veriyi anla','Stok, satış, kalite ve kârlılık üzerinden önceliği belirle.',['biz_iberya','biz_data','us_tekstilpilot'],['tr'],{firstStep:'Tek ürün ailesi için mevcut stok ve satış tablosunu çıkar.'}),
   choice('business-sales','Satışta küçük bir deneme yap','Bir kanal veya ürün ailesinde sonucu ölç.',['biz_distribution','biz_income','us_gozlem','us_ticaretmodelleri'],['tr'],{firstStep:'Bir müşteri grubu ve ölçülebilir bir satış hedefi seç.'})]),
  topic('brands','Marka haklarını değerlendir','Mevcut sözleşme, yeni marka adayları ve kendi markan.',[
   choice('license','Mevcut anlaşmayı ve yenilemeyi incele','Yetki, ülke kapsamı, üretim ve yenileme koşullarını netleştir.',['biz_licenseaudit','biz_renewal','biz_territory','biz_factoryrights'],[],{firstStep:'Sözleşmedeki hak, süre ve yenileme maddelerini tek sayfada özetle.'}),
   choice('brand-candidates','Hangi markalar değerlendirilebilir?','Araştırılan altı markayı aynı ticari ölçütlerle karşılaştır.',['biz_brief','biz_candidates','biz_nautica','biz_reebok','biz_champion','biz_brooks','biz_lotto','biz_bensherman'],[],{firstStep:'Ürün grubu, bölge ve satış kanalı için kısa bir marka brifi hazırla.'}),
   choice('own-brand','Lisans mı, kendi markan mı?','Lisans maliyeti ve yükümlülükleriyle kendi marka modelini kıyasla.',['biz_terms','biz_ownbrand'],['tr'],{firstStep:'İki modelin minimum sipariş ve nakit ihtiyacını karşılaştır.'})]),
  topic('textile','Üretim ve tekstil tedariki','İberya için Çin tedariki ve üretim seçenekleri.',[
   choice('textile-model','Ne tedarik edilecek?','Kumaş, aksesuar, makine veya fason üretim modelini seç.',['cn_goal','cn_options','cn_fabric','cn_trim','cn_machine','cn_oem','cn_finished'],['tr','cn'],{firstStep:'İberya için çözülmesi gereken tek üretim ihtiyacını yaz.'}),
   choice('textile-fairs','Tekstil fuarı ve saha görüşmesi','Ürün grubuna uygun fuar, görüşme ve seyahat hazırlığı.',['cn_fair','cn_intertextile','cn_chic','cn_itma','cn_invite','cn_language','cn_visa'],['cn'],{firstStep:'Fuara karar vermeden ürün grubunu ve görüşülecek firmaları seç.'}),
   choice('textile-pilot','Tedarikçiden kontrollü pilota','Teklif, numune, test, sevkiyat ve küçük bayi denemesi.',['cn_shortlist','cn_rfq','cn_audit','cn_ip','cn_sample','cn_lab','cn_gtip','cn_tareks','cn_logistics','cn_preship','cn_pilot','cn_scale'],['tr','cn'],{firstStep:'Aynı şartnameyi üç tedarikçiye gönder.'})])]},
 {id:'china',name:'Ürün ticareti',icon:'china',tag:'YENİ İŞ',tone:'sage',sequence:true,description:'Türkiye’de satılacak ürünü bul; talep, tedarik ve maliyeti küçük adımlarla sına.',topics:[
  topic('product','Satılabilecek bir ürün bul','Önce müşteri ve talep; sonra ürün seçimi.',[
   choice('market','Müşteri ve ihtiyacı seç','Ürün almadan önce sorunu ve yerli alternatifleri araştır.',['tradeprod_root','tradeprod_market','tradeprod_shortlist','tradeprod_validate'],['tr'],{firstStep:'Bir müşteri grubu ile görüşüp mevcut çözümünü öğren.'}),
   choice('simple-products','Sade ürün fikirlerini karşılaştır','Mekanik ev, bakım, hobi ve yedek parça seçenekleri.',['tradeprod_cable','tradeprod_stand','tradeprod_drawer','tradeprod_pet','tradeprod_wood','tradeprod_parts'],['tr'],{firstStep:'En fazla iki ürünü yerli alternatif ve satış fiyatıyla kıyasla.'}),
   choice('tech-toys','Teknoloji, oyuncak veya B2B ürünü','Kodlama kiti, STEM oyuncağı, sensör ve kurulum fikirleri.',['tradeprod_coding','tradeprod_toy','tradeprod_sensor','tradeprod_printer','tradeprod_retail','tradeprod_hub'],['tr'],{firstStep:'Kullanıcıyı ve ürünün güvenlik kapsamını belirle.'})]),
  topic('supply','Tedarikçiye ve ürüne ulaş','Uzaktan tedarik, gerekirse fuar; ardından numune.',[
   choice('supplier','Uzaktan tedarikçi ve numune bul','Tek şartnameyle teklif al, firmayı ve numuneyi doğrula.',pick(ids('cn_sourcing')),['cn','remote'],{firstStep:'Aynı ürün tanımıyla üç firmadan karşılaştırılabilir teklif iste.'}),
   choice('fair','Ürüne uygun fuarı seç','Çin ve Hong Kong fuarlarını ürün grubuna göre daralt.',ids('cn_fairs'),['cn'],{firstStep:'Önce ürün kategorisini seç; fuar tarihini resmî kaynaktan kontrol et.'})]),
  topic('sell','İthalat ve küçük satış denemesi','Siparişten önce uygunluk; büyümeden önce gerçek sonuç.',[
   choice('import','Sipariş öncesi ithalat hesabı','GTİP, menşe, vergi ve toplam depoya giriş maliyeti.',ids('cn_customs'),['tr'],{firstStep:'Seçilen ürün için gümrük müşaviriyle maliyet ve kapsamı teyit et.'}),
   choice('safety','Bu ürünün güvenlik koşulları ne?','Oyuncak, elektrik, radyo veya pil koşullarını ürününe göre aç.',ids('cn_safety'),['tr'],{firstStep:'Ürünün gerçek özelliklerini ve kullanım yaşını yaz.'}),
   choice('sales-pilot','Küçük sat, ölç, sonra karar ver','Birim ekonomi, satışa hazırlık ve kontrollü tekrar sipariş.',ids('cn_sales'),['tr'],{firstStep:'Kayıp sınırı ve tekrar sipariş ölçütü belirle.'})])]},
 {id:'career',name:'Yazılım & teknoloji kariyeri',icon:'career',tag:'KARİYER',tone:'blue',description:'Yazılım, veri veya siber güvenlik; doğrudan iş ya da ilgili eğitim.',topics:[
  topic('build','Yazılım ve veri becerisi geliştir','Bir rol seç ve gösterebileceğin küçük bir proje üret.',[
   choice('software','Yazılım geliştirici yolunu dene','Backend / frontend becerilerini çalışan bir projede göster.',['career_portfolio','career_apply','career_review','cyber_iberia_api'],['tr','remote'],{firstStep:'Tek rol seçip o rol için bir projeyi tamamla.'}),
   choice('analytics','Veri ve iş analitiğini işe bağla','Stok veya satış sorusuna veriyle cevap veren bir çalışma hazırla.',['biz_data','ms_depaul_is','ms_csueb_ba','uae_iot'],['tr','remote'],{firstStep:'Anonim veya örnek veriyle tek soruya cevap veren bir dashboard hazırla.'})]),
  topic('cyber','Siber güvenliği dene','Yazılımın yanında veya ayrı bir uzmanlık olarak ilerle.',[
   choice('cyber-role','Hangi güvenlik rolü sana yakın?','AppSec / DevSecOps, SOC, bulut ve pentesti karşılaştır.',['cyber_start','cyber_backend','cyber_soc','cyber_cloud','cyber_pentest'],['tr','remote'],{firstStep:'Bir rolün günlük işini örnek bir alıştırmayla dene.'}),
   choice('cyber-practice','Öğrenme ve uygulama planı','Temeller, ücretsiz kaynaklar ve rolüne uygun iki proje.',['cyber_w0','cyber_w4','cyber_w8','cyber_portswigger','cyber_mslearn','cyber_cisco','cyber_cert','cyber_labs','cyber_iberia_resilience'],['remote'],{firstStep:'Bildiğin temelleri geç; ilk eksik konuda tek laboratuvar tamamla.'})]),
  topic('jobs','İş ve başvuru seçenekleri','Türkiye ofis / hibrit ve Türkiye’den uygun uzaktan kanallar.',[
   choice('jobs-tr','Türkiye’de teknoloji ve sanayi','Yazılım, telekom, savunma ve kurumsal teknoloji şirketleri.',pick(ids('jobs_category_2'),ids('jobs_category_1'),ids('jobs_category_3'),'career_defense',pref('career_job_peak'),pref('career_job_dream'),'career_job_goodjob'),['tr'],{firstStep:'Uygun üç ilanı seç; ortak eksik beceriyi belirle.'}),
   choice('jobs-finance','Finans ve danışmanlık','Bankaların teknoloji ekipleri ve teknoloji danışmanlığı.',pick(ids('jobs_category_4'),ids('jobs_category_8')),['tr'],{firstStep:'Bir rol başlığına göre ilgili şirketlerin resmî sayfalarını incele.'}),
   choice('jobs-remote','Uzaktan iş ve büyük teknoloji','Konum ve çalışma izni uygunluğunu ilan bazında kontrol et.',pick(ids('jobs_category_5'),ids('jobs_category_6'),'career_job_canonical'),['remote'],{firstStep:'İlanda Türkiye’den çalışmaya açık izin arayıp sonra başvur.'}),
   choice('jobs-cyber','Güvenlik şirketleri ve junior kanallar','Rol seçimini güvenlik başvuru havuzuna bağla.',pick(ids('jobs_category_7'),'career_job_tervax'),['tr','remote'],{firstStep:'Seçtiğin güvenlik rolüne uygun bir örnek çalışma ekle.'})]),
  topic('tech-study','İlgili master veya eğitim','CS, analytics ve cyber eğitimi; işin zorunlu ön koşulu değil.',[
   choice('study-cs','CS veya Information Systems masterı','Yazılım derinliği ve iş sistemleri programlarını karşılaştır.',['ms_depaul_cs','ms_depaul_is','ms_fit','ms_applygate'],['us'],{firstStep:'Ders planını hedeflediğin işle kıyasla; toplam bütçeyi çıkar.'}),
   choice('study-data-cyber','Analytics veya online cyber masterı','Veri analitiği ve uzaktan güvenlik eğitimi seçenekleri.',['ms_csueb_ba','ms_nku_online','ms_fit','ms_applygate'],['us','remote'],{firstStep:'Programın rolüne katkısını ve devam koşullarını karşılaştır.'})])]},
 {id:'agriculture',name:'Tarım & gıda',icon:'leaf',tag:'YENİ ALAN',tone:'sage',description:'Çalışarak öğren, eğitim al veya küçük bir iş dene. Ülkeyi sonra seç.',topics:[
  topic('experience','Çalışarak ve sahada öğren','Master yapmadan da deneyim arayabilirsin.',[
   choice('experience-tr','Türkiye’de saha deneyimi','Sera, çiftlik, gıda işletmesi veya tarım teknolojisi ekibini araştır.',['uae_systems','uae_tr_pilot'],['tr'],{firstStep:'Yakınındaki beş işletmeyi bul; saha / operasyon ve veri rollerini ayır.',details:'Önerilen arama yolu: üretim takibi, sera operasyonu, kalite, tedarik ve tarım teknolojisi desteği. İş, kısa gözlem ziyareti ve eğitim birbirinden ayrı tekliflerdir; görüşmede görev, süre, ücret ve sorumluluğu açıklaştır. Bu yol master veya yurt dışı deneyimi gerektirmez. İŞKUR kanalında güncel ilanı ve mezun uygunluğunu ayrıca kontrol et.',requirements:['Hedeflenen işletme ve öğrenmek istediğin süreç','Görev, süre, ücret ve iş güvenliği koşullarının netliği'],sources:[{title:'İŞKUR Staj Portalı — güncel kapsamı kontrol et',url:'https://stajportali.iskur.gov.tr/'}]}),
   choice('experience-ae','BAE’de tarım deneyimi araştır','ICBA, üreticiler ve saha temaslarını aynı yerde karşılaştır.',['uae_icba_intern','uae_pureharvest','uae_bustanica','uae_silal','uae_biofarm','uae_legal','uae_jobvisa'],['ae'],{firstStep:'Bir kurumda uygun görev / staj kanalı bul; çalışma statüsünü teyit et.'}),
   choice('experience-eu','Avrupa’da işletme ve iş kanalları','Ülke, dil ve çalışma hakkına göre tarım / gıda görevlerini ara.',[],['eu'],{firstStep:'Tek ülke ve iki görev adı seçerek EURES’te arama yap.',details:'EURES Avrupa iş arama kanalıdır. Tarım / sera operasyonu, gıda üretimi, kalite veya agri-tech teknik destek gibi görevleri ayrı ara. Bir ilanı görmek Türk vatandaşı olarak çalışma hakkı veya işveren sponsorluğu bulunduğu anlamına gelmez. Başvurudan önce ülkenin resmî izin koşulunu ve işverenin uluslararası aday politikasını doğrula. Bu kart açık iş veya kabul edilmiş staj listesi değildir.',requirements:['Bir hedef ülke ve günlük işte kullanılacak dil','İşverenin deneyim / eğitim koşulları','İlgili ülkenin çalışma ve oturum koşullarının teyidi'],sources:[{title:'EURES — Avrupa’da iş arama',url:'https://europa.eu/eures/portal/'}]}),
   choice('experience-us','ABD’de deneyim yollarını araştır','Doğrudan iş ve öğrenciye bağlı deneyimi ayrı değerlendir.',['us_cpt','us_opt','us_stem','us_f1kampus','us_yanis','us_dilsertifika','us_kurum','us_guncelle'],['us'],{firstStep:'Eğitime bağlı bir yol mu, uygun çalışma statülü doğrudan iş mi istediğini seç.',details:'Master, tarımsal deneyimin zorunlu ön koşulu değildir. ABD’de doğrudan bir görev için uygun işveren ve çalışma statüsü ayrıca araştırılır; burada doğrulanmış doğrudan iş teklifi listesi yok. Eğitim seçersen ilgili CPT / OPT koşullarını aç. Genel bakery veya market işini öğrenci statüsüyle serbestçe yapılabilir varsayma.'})]),
  topic('agri-study','Kurs veya okul ile öğren','Deneyim kazanmadan doğrudan eğitimi de seçebilirsin.',[
   choice('study-short','Kısa eğitimle alanı dene','Türkiye’den online öğrenme veya yerinde uygulamalı kurs.',['uae_shortcourse','us_kurs'],['tr','eu','ae','remote'],{firstStep:'Tek konu seç: sera / hidroponik, tarım ekonomisi veya gıda operasyonu.',details:'Wageningen’in profesyonel eğitim kataloğunda tarım, toprak ve su alanları ile online öğrenme seçeneklerini inceleyebilirsin. Her kursun ön bilgisi, dili, formatı, tarihi ve ücretini kendi sayfasından kontrol et. Kısa eğitim, master başvurusu veya çalışma hakkı yerine geçmez.',sources:[{title:'WUR — Tarım, toprak ve su kursları',url:'https://www.wur.nl/en/education/for-professionals/land-water-soil-agriculture'}]}),
   choice('study-agri-us','ABD’de tarım / gıda masterı','Agribusiness, CEA, gıda, bitki ve hayvancılık programlarını daralt.',['us_secim','us_purdue','us_purduefon','us_arizona','us_arizonatakvim','us_cornell','us_cornellfon','us_msu','us_msufon','us_tamu','us_tamufon','us_kstate','us_profil','us_butce'],['us'],{firstStep:'Önce alanı seç; sonra bir programdan transkript uygunluğu ve fon bilgisi iste.'}),
   choice('study-agri-ae','BAE’de ilgili master seçenekleri','Bahçe bitkileri veya çevre / sürdürülebilirlik eğitimini karşılaştır.',['uae_uaeu_master','uae_zayed_master','uae_language'],['ae'],{firstStep:'İlgili lisans ve eksik ders koşullarını programa sor.'}),
   choice('study-agri-tr-eu','Türkiye / Avrupa eğitimini araştır','Yakın kurs veya uygun tarım / gıda programı için bir kısa liste kur.',[],['tr','eu'],{firstStep:'Öğrenmek istediğin alanı seçip resmî program kataloglarını karşılaştır.',details:'Bu bölüm bir sonraki araştırma alanıdır; kişisel akademik uygunluğu doğrulanmış Türkiye / Avrupa master listesi henüz yok. Önce uygulamalı kurs mu, tarım teknolojisi mi, tarım ekonomisi mi, gıda bilimi mi istediğini seç. Avrupa için WUR kataloğu bir başlangıç kanalı; Türkiye için hedef üniversitenin enstitü kabul sayfasını kullan. CS mezununa alan dışı kabul, bilimsel hazırlık, ücret ve eğitim dili koşullarını tek tek doğrula.',sources:[{title:'WUR — Profesyonel eğitim kataloğu',url:'https://www.wur.nl/en/education/for-professionals'}]})]),
  topic('agri-pilot','Küçük bir iş veya proje dene','Çiftlik kurmak tek seçenek değil; yazılım ve ticaret de var.',[
   choice('farm-tech','Yazılım ve sensör projesi','Çiftlik izleme veya veri analiziyle iki ilgini birleştir.',['uae_iot','uae_china','uae_model'],['tr','ae','remote'],{firstStep:'Sahte / örnek sensör verisiyle tek ölçümü izleyen demo yap.'}),
   choice('farm-pilot','Küçük üretim pilotu','Sera veya hidroponik denemeyi uzman, alıcı ve maliyetle birlikte planla.',['uae_systems','uae_climate','uae_economics','uae_biosecurity','uae_tr_pilot','uae_tr_legal','uae_metrics','uae_decision'],['tr','ae'],{firstStep:'Arazi / ekipman almadan uzman ve potansiyel alıcıyla görüş.'}),
   choice('food-business','Gıda ve tedarik modeli','Alıcı, soğuk zincir veya küçük gıda denemesini değerlendir.',['uae_buyers','uae_coldchain','us_gidapilot','uae_silal_fund'],['tr','ae'],{firstStep:'Tek ürün ve tek alıcı grubuyla talep görüşmesi yap.'})])]},
 {id:'decision',name:'90 günlük plan',icon:'check',tag:'ÇALIŞMA ALANIM',tone:'sand',secondary:true,description:'Bir odak seç, küçük kanıt topla ve sonucu değerlendir.',topics:[
  topic('focus','Odak ve kaynaklar','Zaman, bütçe ve ilgine göre bir deneme seç.',[
   choice('focus-start','Bu ay neye odaklanacağım?','Bir ana yol ve tek küçük çıktı belirle.',['core_choice','gate_resources','core_fit','core_common','core_profile','n0','core_evidence']),
   choice('focus-check','Gereken kaynaklar hazır mı?','Eğitim, seyahat ve sermaye eşiklerini seçtiğin yola göre aç.',['gate_academic','gate_travel','gate_capital','core_capital','core_mba'])]),
  topic('review','Deneme ve değerlendirme','Bir örnek planı kendine göre uyarla.',[
   choice('review-software','Yazılım + İberya veri projesi','Bir kariyer denemesini gerçek iş sorusuyla birleştir.',['core_s1','gate_s1','n2','n9','n10']),
   choice('review-business','İberya veya ürün tedarik denemesi','Tek ihtiyaca odaklan, sınırlı numune / satış kanıtı topla.',['core_s2','gate_s2','n1','n3','n6']),
   choice('review-agri','Tarım veya eğitim keşfi','Saha, kurs ve program görüşmeleri arasından bir deneme seç.',['core_s3','gate_s3','n4','n5','n7','n8','us_amac','us_otuz','us_doksan']),
   choice('review-stop','Devam et, değiştir veya ele','Elde edilen kanıta göre sonraki adımı seç.',['core_stop','core_review','core_return'])])]}];
 // Keep less useful duplicate hub cards accessible without putting them on the first screen.
 const covered=new Set(routes.flatMap(r=>r.topics.flatMap(t=>t.choices.flatMap(c=>c.nodeIds))));
 const remaining=data.nodes.filter(n=>!covered.has(n.id)).map(n=>n.id);
 if(remaining.length)routes.at(-1).topics.at(-1).choices.at(-1).extraNodeIds=remaining;
 for(const r of routes)for(const t of r.topics)for(const c of t.choices)c.nodeIds=[...new Set(c.nodeIds)];
 return routes;
}
export function matchesCountry(choice,country){return !country||country==='all'||!choice.countries.length||choice.countries.includes(country);}
export function contextForNode(routes,id,preferredRoute){
 const matches=[];
 for(const r of routes)for(const t of r.topics)for(const c of t.choices)if([...c.nodeIds,...c.extraNodeIds||[]].includes(id))matches.push({route:r,topic:t,choice:c});
 return matches.find(x=>x.route.id===preferredRoute)||matches[0]||null;
}
export function summarize(text,limit=140){
 const clean=String(text||'').replace(/Ne yapılacak:\s*/g,'').split(/\n---|\n\s*\n/)[0].replace(/\s+/g,' ').trim();
 if(clean.length<=limit)return clean;
 const sentence=clean.match(/^(.+?[.!?])(?:\s|$)/)?.[1];
 if(sentence&&sentence.length<=limit)return sentence;
 const short=clean.slice(0,limit-1);return short.slice(0,short.lastIndexOf(' ')>limit*.6?short.lastIndexOf(' '):short.length)+'…';
}
