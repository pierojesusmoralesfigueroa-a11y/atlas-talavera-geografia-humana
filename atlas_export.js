'use strict';
/* Exportación editorial V12 — cartografía local vectorial. Sin servicios externos ni API keys.
   Se exporta la ventana visible con GeoJSON original, leyenda y escala. Los mosaicos OSM
   y OpenTopoMap no se copian por sus condiciones de uso/CORS. */
(function(){
 const px=1650,py=1080;
 const mapBox={x:54,y:152,w:1120,h:778};
 const panel={x:1196,y:152,w:400,h:778};
 const xml=x=>String(x??'').replace(/[&<>"']/g,s=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&apos;'}[s]));
 const fmt=x=>Number(x).toFixed(1);
 const nameFor=()=>catalog.find(r=>r[0]===selectedTopic)?.[1]||'Mapa temático';
 function pathPart(line,close){if(!Array.isArray(line)||!line.length)return '';
  const nodes=[];let last=null;
  for(const c of line){if(!Array.isArray(c)||!Number.isFinite(c[0])||!Number.isFinite(c[1]))continue;
   const p=map.latLngToContainerPoint([c[1],c[0]]);const n=[Math.round(p.x*10)/10,Math.round(p.y*10)/10];
   if(last&&last[0]===n[0]&&last[1]===n[1])continue;
   nodes.push((nodes.length?'L':'M')+n[0]+' '+n[1]);last=n;}
  return nodes.join(' ')+(close?' Z':'');
 }
 function geomPath(g){const c=g?.coordinates;if(!c)return '';
  if(g.type==='LineString')return pathPart(c,false);
  if(g.type==='MultiLineString')return c.map(r=>pathPart(r,false)).join(' ');
  if(g.type==='Polygon')return c.map(r=>pathPart(r,true)).join(' ');
  if(g.type==='MultiPolygon')return c.flatMap(poly=>poly.map(r=>pathPart(r,true))).join(' ');
  return '';
 }
 function layerGeometry(){if(!map||(!activeData?.features?.length&&!(selectedTopic==='M08'&&[...currentLayers].some(id=>id.startsWith('raster_')))))throw Error('Activa una capa cartográfica antes de descargar el mapa.');
  const groups=new Map();for(const f of (activeData?.features||[])){const id=f.properties?.CAPA_ID;if(!id)continue;if(!groups.has(id))groups.set(id,[]);groups.get(id).push(f);}
  const priority=id=>{const t=manifest?.capas?.[id]?.estilo||'';return t==='categories'||t==='choropleth'?10:t==='river'?20:t.startsWith('road_')?30:t==='boundary'?40:t==='tourism'?80:t==='health'||t==='education'?65:50;};
  let svg='';
  // Contexto territorial suave: el límite se rellena antes de las vías y los puntos.
  for(const f of groups.get('limite')||[]){const d=geomPath(f.geometry);if(d)svg+=`<path d="${d}" fill="#dcebe4" fill-opacity=".74" stroke="none" fill-rule="evenodd"/>`;}
  for(const [id,features] of [...groups].sort((a,b)=>priority(a[0])-priority(b[0]))){
   const info=manifest?.capas?.[id];if(!info)continue;const t=info.estilo,prep=prepareStyle(info,features);
   for(const f of features){const p=f.properties||{},g=f.geometry||{};
    if(g.type==='Point'){const loc=g.coordinates;if(!loc?.length)continue;const pt=map.latLngToContainerPoint([loc[1],loc[0]]);if(pt.x<-35||pt.y<-35||pt.x>map.getSize().x+35||pt.y>map.getSize().y+35)continue;
      if(t==='health'){svg+=`<g transform="translate(${fmt(pt.x)} ${fmt(pt.y)})"><circle r="11" fill="#fff" stroke="#16847f" stroke-width="2"/><path d="M-6 0H6M0 -6V6" stroke="#16847f" stroke-width="3.3" stroke-linecap="round"/></g>`;continue;}
      if(t==='education'){svg+=`<g transform="translate(${fmt(pt.x)} ${fmt(pt.y)})"><rect x="-8" y="-8" width="16" height="16" rx="3" fill="#fff" stroke="#6557A2" stroke-width="2"/><path d="M-5 1L0 -2L5 1M-5 3L0 0L5 3" stroke="#6557A2" stroke-width="1.4" fill="none"/></g>`;continue;}
      if(t==='tourism'){const color=tourismColors[p.GRUPO_MAPA]||'#356b78';svg+=`<circle cx="${fmt(pt.x)}" cy="${fmt(pt.y)}" r="9" fill="${color}" stroke="#fff" stroke-width="3"/>`;continue;}
      const style=pointStyle(info,p,prep);svg+=`<circle cx="${fmt(pt.x)}" cy="${fmt(pt.y)}" r="${fmt(style.radius||5)}" fill="${xml(style.fillColor||'#317c81')}" stroke="${xml(style.color||'#fff')}" stroke-width="${fmt(style.weight||1)}" opacity="${fmt(style.opacity??1)}" fill-opacity="${fmt(style.fillOpacity??1)}"/>`;continue;
    }
    if(g.type==='MultiPoint'){for(const c of g.coordinates||[]){const pt=map.latLngToContainerPoint([c[1],c[0]]);svg+=`<circle cx="${fmt(pt.x)}" cy="${fmt(pt.y)}" r="4" fill="#247f8b"/>`;}continue;}
    const d=geomPath(g);if(!d)continue;
    if(t==='boundary'){svg+=`<path d="${d}" fill="none" stroke="#203e49" stroke-width="3"/>`;continue;}
    if(t==='river'){svg+=`<path d="${d}" fill="none" stroke="#73afc3" stroke-width="1.35"/>`;continue;}
    if(t?.startsWith('road_')){const sw=t==='road_nacional'?'#b66b2f':t==='road_departamental'?'#b79950':'#8d9ba0';const width=t==='road_nacional'?3:t==='road_departamental'?2:1.2;svg+=`<path d="${d}" fill="none" stroke="${sw}" stroke-width="${width}" stroke-linejoin="round" stroke-linecap="round"/>`;continue;}
    const key=prep.field,fill=prep.color(p[key]);svg+=`<path d="${d}" fill="${xml(fill)}" stroke="#87a09d" stroke-width="0.85" fill-opacity="0.78" fill-rule="evenodd"/>`;
   }
  }
  return svg;
 }

 async function rasterOverlaySvg(){
  if(selectedTopic!=='M08')return '';
  let out='';
  for(const r of manifest?.rasters||[]){
   if(!currentLayers.has('raster_'+r.id))continue;
   const res=await fetch('./'+r.path);if(!res.ok)throw Error('No se pudo cargar el ráster seleccionado para exportar.');
   const blob=await res.blob();const dataUrl=await new Promise((resolve,reject)=>{const reader=new FileReader();reader.onload=()=>resolve(reader.result);reader.onerror=()=>reject(new Error('No se pudo leer el ráster para exportar.'));reader.readAsDataURL(blob)});
   const sw=r.bounds?.[0],ne=r.bounds?.[1];if(!sw||!ne)continue;
   const topLeft=map.latLngToContainerPoint([ne[0],sw[1]]),bottomRight=map.latLngToContainerPoint([sw[0],ne[1]]);
   const width=bottomRight.x-topLeft.x,height=bottomRight.y-topLeft.y;
   if(width>0&&height>0)out+=`<image x="${fmt(topLeft.x)}" y="${fmt(topLeft.y)}" width="${fmt(width)}" height="${fmt(height)}" preserveAspectRatio="none" image-rendering="pixelated" opacity="0.85" href="${xml(dataUrl)}"/>`;
  }
  return out;
 }
 function labelsVector(){const result=[];for(const label of atlasLabelLayers){const at=label.getLatLng();if(!at)continue;const pt=map.latLngToContainerPoint(at),content=String(label.getContent()||'').replace(/&amp;/g,'&').replace(/&lt;/g,'<').replace(/&gt;/g,'>');
  const x=pt.x,y=pt.y-20;const width=Math.min(188,Math.max(48,content.length*6.3+16));if(y<8||x<width/2||x>map.getSize().x-width/2)continue;
  result.push(`<rect x="${fmt(x-width/2)}" y="${fmt(y-17)}" width="${fmt(width)}" height="22" rx="5" fill="#fff" fill-opacity="0.96" stroke="#b6cfca"/><text x="${fmt(x)}" y="${fmt(y-2)}" font-size="11" fill="#123945" text-anchor="middle" font-weight="700">${xml(content)}</text>`);}
 return result.join('');}
 function legendContent(){let html='',row=0;const x=panel.x+28,y=panel.y+100;
 function item(color,title,subtitle){const yy=y+row*55;row++;return `<circle cx="${x+12}" cy="${yy+11}" r="9" fill="${color}" stroke="#fff" stroke-width="3"/><text x="${x+32}" y="${yy+10}" font-size="16" font-weight="700" fill="#183e4b">${xml(title)}</text><text x="${x+32}" y="${yy+28}" font-size="12" fill="#718389">${xml(subtitle||'')}</text>`}
 if(['M04','M05','M07'].includes(selectedTopic)){const id=currentProximityId(),config=distanceClassifications[id];if(config){const edges=[config.min,...config.thresholds,config.max];const source=geoCache.get(manifest.capas[id].path);const fs=source?.features||[];const counts=[0,1,2,3].map(i=>fs.filter(f=>classIndex(id,f.properties||{})===i).length);for(let i=0;i<4;i++)html+=item(distanceColors[i],distanceNames[i]+` · ${counts[i]}`,`${$num(edges[i],3)}–${$num(edges[i+1],3)} km`);}}
 else if(selectedTopic==='M02'&&currentLayers.has('centros_pob')){for(const band of populationBands){const radius=Math.min(20,circleRadius(band[2])*.7);html+=`<circle cx="${x+12}" cy="${y+row*55+11}" r="${radius}" fill="#217d9f" stroke="white" stroke-width="2"/><text x="${x+40}" y="${y+row*55+15}" font-size="14" fill="#183e4b">${xml(band[0])}</text>`;row++}}
 else if(selectedTopic==='M08'){const chosen=(manifest?.rasters||[]).find(r=>currentLayers.has('raster_'+r.id));if(chosen){for(const entry of chosen.legend||[])html+=item(entry.color,entry.name,'Categoría de susceptibilidad');}else html+=item('#8b9a9c','Centros poblados','Sin ráster activo');}
 else if(selectedTopic==='M11'){for(const [cat,color]of Object.entries(tourismColors))html+=item(color,cat,'Recurso inventariado · MINCETUR')}
 else if(['M02','M03','M09','M10','M12'].includes(selectedTopic)){const id=selectedTopic==='M02'?'manzanas':'provincia_estadisticas',f=(activeData?.features||[]).filter(x=>x.properties?.CAPA_ID===id);if(f.length){const prep=prepareStyle(manifest.capas[id],f);for(const [label,color] of (prep.rows||[]).slice(0,8))html+=item(color,label,prep.field||'Variable temática')}else html+=item('#8aa89f','Entidades','No hay valores temáticos activos');}
 else {const active=[...currentLayers].filter(k=>!k.startsWith('raster_')).slice(0,9);for(const id of active){const info=manifest.capas[id];if(info){const type=info.estilo;let color=type==='road_nacional'?'#B76828':type==='road_departamental'?'#CFA252':type==='road_vecinal'?'#8C9BA1':type==='river'?'#73afc3':'#3c8a83';html+=item(color,info.nombre||id,info.count?`${info.count} elementos cartografiados`:'Capa temática')}}}
 return html;
 }
 function scaleBar(){const sz=map.getSize(),mid=sz.y/2;const oneHundred=map.distance(map.containerPointToLatLng([40,mid]),map.containerPointToLatLng([140,mid]));if(!Number.isFinite(oneHundred)||oneHundred<=0)return '';
  const nice=[0.1,0.2,0.5,1,2,5,10,20,50,100,200,500];const target=oneHundred*1.4/1000;const km=nice.reduce((p,n)=>Math.abs(n-target)<Math.abs(p-target)?n:p,nice[0]);const width=100*(km*1000/oneHundred);if(width>350)return '';
  const xx=30,yy=sz.y-42;return `<rect x="${xx-12}" y="${yy-30}" width="${width+45}" height="47" rx="7" fill="#ffffff" fill-opacity=".93"/><path d="M${xx} ${yy}v-10h${width}v10" stroke="#234250" stroke-width="3" fill="none"/><text x="${xx+width/2}" y="${yy+11}" text-anchor="middle" fill="#1d3e49" font-size="12" font-weight="700">${xml(km<1?`${Math.round(km*1000)} m`:`${km} km`)}</text>`;
 }
 async function buildSvg(){if(!map)throw Error('Mapa no disponible.');const view=map.getSize();if(!view.x||!view.y)throw Error('Dimensiones inválidas del visor.');
  const scale=Math.min(mapBox.w/view.x,mapBox.h/view.y),mW=view.x*scale,mH=view.y*scale,tx=mapBox.x+(mapBox.w-mW)/2,ty=mapBox.y+(mapBox.h-mH)/2;
  const shapes=layerGeometry();const raster=await rasterOverlaySvg();const labels=labelsVector();const footerText='Elaboración académica: UNMSM · 2026  |  ' + (themes[selectedTopic]?.source||'Datos geográficos del proyecto');
  const desc=selectedTopic==='M08'?'Susceptibilidad según clasificación de los rásteres originales; no equivale a riesgo.':selectedTopic==='M04'||selectedTopic==='M05'||selectedTopic==='M07'?'La distancia es euclidiana (Near); no equivale a tiempo de recorrido.':selectedTopic==='M02'?'Círculos por población censada, manzanas por densidad urbana.':'Consultar metodología, periodos y escalas en las fichas del atlas.';
  return `<?xml version="1.0" encoding="UTF-8"?><svg xmlns="http://www.w3.org/2000/svg" width="${px}" height="${py}" viewBox="0 0 ${px} ${py}"><defs><clipPath id="mapclip"><rect x="0" y="0" width="${view.x}" height="${view.y}"/></clipPath></defs>
  <rect width="${px}" height="${py}" fill="#f4f6f4"/>
  <rect width="${px}" height="120" fill="#153d4c"/>
  <rect width="6" height="120" x="0" fill="#c59e60"/>
  <text x="53" y="38" font-size="16" letter-spacing="3" font-family="Arial,sans-serif" fill="#bbe1d7">ATLAS GEOGRÁFICO-SOCIAL DE TALAVERA</text>
  <text x="53" y="84" font-size="32" font-weight="700" font-family="Arial,sans-serif" fill="#ffffff">${xml(selectedTopic+' · '+nameFor())}</text>
  <text x="${px-54}" y="55" text-anchor="end" font-family="Arial,sans-serif" font-size="17" fill="#ddeeea">UNMSM · GEOGRAFÍA HUMANA</text>
  <text x="${px-54}" y="85" text-anchor="end" font-family="Arial,sans-serif" font-size="15" fill="#c2dbd9">V12 · Noviembre 2026</text>
  <rect x="${mapBox.x}" y="${mapBox.y}" width="${mapBox.w}" height="${mapBox.h}" fill="#edf2ef" stroke="#b4cbc3" rx="10"/>
  <g transform="translate(${fmt(tx)} ${fmt(ty)}) scale(${scale.toFixed(5)})" clip-path="url(#mapclip)"><rect x="0" y="0" width="${view.x}" height="${view.y}" fill="#edf2ef"/>${raster}${shapes}${labels}${scaleBar()}</g>
  <text x="${mapBox.x+18}" y="${mapBox.y+25}" fill="#1a4852" font-size="13" font-family="Arial,sans-serif" font-weight="700">Cartografía temática · extensión visible en el visor</text>
  <text x="${mapBox.x+mapBox.w-15}" y="${mapBox.y+25}" text-anchor="end" fill="#5c797e" font-size="12" font-family="Arial,sans-serif">SIN MOSAICO BASE EXTERNO</text>
  <g transform="translate(${mapBox.x+mapBox.w-37} ${mapBox.y+55})" font-family="Arial,sans-serif"><path d="M0 -16L9 15L0 8L-9 15Z" fill="#254b55" stroke="#fff" stroke-width="1.4"/><text x="0" y="-24" text-anchor="middle" fill="#254b55" font-size="14" font-weight="700">N</text></g>
  <rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="${panel.h}" rx="12" fill="#fff" stroke="#d0e0d9"/>
  <rect x="${panel.x}" y="${panel.y}" width="${panel.w}" height="6" fill="#168378" rx="3"/>
  <text x="${panel.x+28}" y="${panel.y+48}" font-size="20" font-weight="700" font-family="Arial,sans-serif" fill="#194455">LEYENDA TEMÁTICA</text>
  <text x="${panel.x+28}" y="${panel.y+71}" font-size="12" fill="#607d83" font-family="Arial,sans-serif">${xml(selectedTopic+' · '+nameFor())}</text>
  <g font-family="Arial,sans-serif">${legendContent()}</g>
  <line x1="${panel.x+28}" y1="${panel.y+568}" x2="${panel.x+panel.w-28}" y2="${panel.y+568}" stroke="#d4e4de"/>
  <text x="${panel.x+28}" y="${panel.y+605}" font-size="14" font-weight="700" fill="#23515d" font-family="Arial,sans-serif">CÓMO INTERPRETARLO</text>
  ${wrapSvgText(desc,panel.x+28,panel.y+635,42,320,14)}
  <text x="${panel.x+28}" y="${panel.y+730}" font-size="11" fill="#748c90" font-family="Arial,sans-serif">Fuente cartográfica: ver nota inferior</text>
  <rect x="${mapBox.x}" y="958" width="${px-2*mapBox.x}" height="1" fill="#cbded8"/>
  ${wrapSvgText(footerText,54,989,90,1540,13)}
  <text x="54" y="1047" font-family="Arial,sans-serif" font-size="13" fill="#5c777f">Proyección de visualización: Web Mercator (EPSG:3857). Los datos conservan sus atributos originales en GeoJSON.</text>
  </svg>`;
 }
 function wrapSvgText(txt,x,y,maxLen,maxW,size){const words=String(txt).split(/\s+/),lines=[],chars=Math.max(35,Math.floor(maxW/(size*.52)));let line='';for(const word of words){if((line+word).length>chars){lines.push(line.trim());line='';}line+=word+' ';}if(line.trim())lines.push(line.trim());return lines.slice(0,3).map((s,i)=>`<text x="${x}" y="${y+i*(size+7)}" font-family="Arial,sans-serif" font-size="${size}" fill="#59747a">${xml(s)}</text>`).join('');}
 function downloadBlob(blob,extension){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`Talavera_V12_${selectedTopic}_${new Date().toISOString().slice(0,10)}.${extension}`;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),12000)}
 function feedback(s){const element=document.getElementById('exportFeedback');if(element)element.textContent=s;}
 async function exportSvg(){try{const content=await buildSvg();downloadBlob(new Blob([content],{type:'image/svg+xml;charset=utf-8'}),'svg');feedback('SVG generado con geometría vectorial, etiquetas y leyenda.')}catch(e){feedback(e.message);console.error(e)}}
 async function exportPng(){try{feedback('Preparando mapa vectorial de alta resolución…');const content=await buildSvg(),blob=new Blob([content],{type:'image/svg+xml;charset=utf-8'}),url=URL.createObjectURL(blob);try{const img=new Image();img.src=url;await img.decode();const canvas=document.createElement('canvas');canvas.width=px*2;canvas.height=py*2;const ctx=canvas.getContext('2d');ctx.fillStyle='#fff';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(img,0,0,canvas.width,canvas.height);const result=await new Promise((resolve,reject)=>canvas.toBlob(b=>b?resolve(b):reject(new Error('No se pudo crear la imagen PNG.')),'image/png'));downloadBlob(result,'png');feedback(`PNG generado (${canvas.width} × ${canvas.height} píxeles).`)}finally{URL.revokeObjectURL(url)}}catch(e){feedback('No se completó la exportación: '+e.message);console.error(e)}}
 function initExport(){const trigger=document.getElementById('exportAtlas'),dialog=document.getElementById('exportDialog');if(!trigger||!dialog)return;
  trigger.addEventListener('click',()=>{feedback('');dialog.showModal()});document.getElementById('closeExport').addEventListener('click',()=>dialog.close());
  document.getElementById('exportPNG').addEventListener('click',exportPng);document.getElementById('exportSVG').addEventListener('click',exportSvg);
  document.getElementById('exportGeoJSON').addEventListener('click',()=>{downloadGeoJSON();feedback('Se exportaron las capas activas en formato GeoJSON.')});
 }
 document.addEventListener('DOMContentLoaded',initExport);
})();
