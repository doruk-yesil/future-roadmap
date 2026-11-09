// Active sections are independent of the archived research graph.
export function activeSections(routes){
 const career=routes.find(r=>r.id==='career');
 const agriculture=routes.find(r=>r.id==='agriculture');
 return [
  {...career,name:'Yazılım sektörü',tag:'KARİYER',description:'İş ilanları ve ilgili master seçenekleriyle yazılım alanında ilerle.',topics:career.topics.filter(t=>['jobs','tech-study'].includes(t.id))},
  {...agriculture,name:'Tarım ve hayvancılık',description:'Kendi kartlarını oluştur; açıklama ve notlarınla seçeneklerini takip et.',topics:[]},
  {id:'food',name:'Gıda',icon:'food',tag:'ZİNCİR YEMEK SEKTÖRÜ',tone:'sand',description:'Zincir yemek sektörüyle ilgili kartlarını oluştur; açıklama ve notlarını sakla.',topics:[]}
 ];
}
