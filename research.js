// Read summaries are explicit snapshots, not a claim of automatic/live monitoring.
export function sourceIndex(research){return new Map((research.sources||[]).map(s=>[s.id,s]));}
export function applyResearch(routes,research){
 const index=sourceIndex(research);
 const resolveSteps=steps=>(steps||[]).slice(0,3).map(step=>({...step,sources:(step.sourceIds||[]).map(id=>index.get(id)).filter(Boolean)}));
 for(const route of routes)for(const topic of route.topics)for(const choice of topic.choices){
  const verified=research.choices?.[choice.id];
  if(verified)Object.assign(choice,verified);
  if(choice.steps)choice.steps=resolveSteps(choice.steps);
  if(choice.variants)choice.variants=choice.variants.map(v=>({...v,steps:resolveSteps(v.steps)}));
 }
 return routes;
}
export function getActionSteps(choice){
 if(choice.steps?.length)return choice.steps;
 return [
  {title:'İlk denemeyi belirle',action:choice.firstStep||choice.summary,research:[],contact:'',output:'Bu seçenek için tek bir somut ilk adım.',sources:[]},
  {title:'Koşulları araştır ve bir karar ver',action:'Aşağıdaki ilgili araştırmayı aç; seçtiğin yolun gerekenlerini, kaynaklarını ve sonraki adımını kendi notuna yaz.',research:choice.requirements||[],contact:'Gerekliyse ilgili kurumun resmî kanalından kişisel uygunluğunu teyit et.',output:'Devam etme, erteleme veya eleme kararı.',sources:[]}
 ];
}
export function searchableChoices(routes){
 return routes.flatMap(route=>route.topics.flatMap(topic=>topic.choices.map(c=>({id:c.id,title:c.title,route:route.id,topic:topic.id,body:[c.summary,c.details,...(c.steps||[]).map(s=>s.action),...(c.variants||[]).flatMap(v=>[v.title,v.summary,...v.steps.map(s=>s.action)])].filter(Boolean).join(' '),requirements:[]}))));
}
