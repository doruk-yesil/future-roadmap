// Navigation links describe membership; only canonical links describe prerequisites or feedback.
export function layoutGraph({root,branches,expanded,nodes,edges,selected}) {
  const items=[{...root,key:'root',kind:'root',x:32,y:32,w:260,h:224}];
  const links=[];let y=32;
  const visible=new Set();
  for(const branch of branches){
    const children=expanded.has(branch.id)?branch.nodeIds.map(id=>nodes.get(id)).filter(Boolean):[];
    items.push({...branch,key:branch.id,kind:'branch',x:384,y,w:260,h:224,open:children.length>0});
    links.push({source:'root',target:branch.id,type:'navigation',label:'Seçenek'});
    children.forEach((node,i)=>{
      items.push({...node,key:node.id,kind:'node',x:744,y:y+i*264,w:260,h:224});
      visible.add(node.id);
      links.push({source:branch.id,target:node.id,type:'membership',label:i===0?'Ayrıntılar':''});
    });
    y+=Math.max(264,children.length*264);
  }
  for(const edge of edges){
    if(visible.has(edge.source)&&visible.has(edge.target))links.push({...edge,canonical:true});
  }
  const lookup=new Map(items.map(i=>[i.key,i]));let lane=0;
  for(const link of links){
    const a=lookup.get(link.source),b=lookup.get(link.target);
    if(!a||!b)continue;
    if(link.canonical){
      const gutter=1040+(lane++%5)*20;
      const sy=a.y+a.h/2,ty=b.y+b.h/2;
      link.path=`M${a.x+a.w},${sy} C${gutter},${sy} ${gutter},${ty} ${b.x+b.w+4},${ty}`;
      link.labelX=gutter+4;link.labelY=(sy+ty)/2;
    }else{
      const sx=a.x+a.w,sy=a.y+a.h/2,tx=b.x-6,ty=b.y+b.h/2;
      const mid=sx+(tx-sx)*.52;
      link.path=`M${sx},${sy} C${mid},${sy} ${mid},${ty} ${tx},${ty}`;
      link.labelX=(sx+tx)/2;link.labelY=ty-12;
    }
    link.highlight=Boolean(selected&&(link.source===selected||link.target===selected));
  }
  return {items,links,width:links.some(l=>l.canonical)?1200:branches.some(b=>expanded.has(b.id))?1080:710,height:Math.max(420,y+8)};
}

export const relationLabels={path:'Sonraki adım',requirement:'Gereken koşul',feedback:'Geri dönüş',bridge:'İlgili yol',option:'Alternatif',reference:'İlgili yol',dependency:'Gereken koşul',loop:'Geri dönüş'};

export function normalizeSearch(text){
  return String(text).toLocaleLowerCase('tr-TR').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/ı/g,'i');
}

export function searchNodes(nodes,query){
  const terms=normalizeSearch(query).trim().split(/\s+/).filter(Boolean);
  if(!terms.length)return [];
  return nodes.map(n=>({node:n,score:terms.reduce((score,t)=>score+(normalizeSearch(n.title).includes(t)?5:0),0)}))
    .filter(({node:n})=>terms.every(t=>normalizeSearch([n.title,n.body,...(n.requirements||[])].join(' ')).includes(t)))
    .sort((a,b)=>b.score-a.score).map(x=>x.node);
}
