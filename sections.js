// Active sections are independent of the archived research graph.
export function activeSections(routes){
 const career=routes.find(r=>r.id==='career');
 const agriculture=routes.find(r=>r.id==='agriculture');
 return [
  {...career,name:'Yazılım sektörü',tag:'KARİYER',description:'İş ilanları ve ilgili master seçenekleriyle yazılım alanında ilerle.',topics:career.topics.filter(t=>['jobs','tech-study'].includes(t.id))},
  {...agriculture,name:'Tarım ve hayvancılık',description:'Sahada deneyim kazan veya kurs ve eğitim seçeneklerini incele.',topics:agriculture.topics.filter(t=>['experience','agri-study'].includes(t.id))},
  {id:'food',name:'Gıda',icon:'food',tag:'ZİNCİR YEMEK SEKTÖRÜ',tone:'sand',description:'Zincir restoranlar ve hızlı servis yemek işletmeleri alanında ilerleme.',topics:[]}
 ];
}
