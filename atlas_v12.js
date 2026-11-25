'use strict';
/* Talavera V12 · Herramientas de interpretación, comparación y accesibilidad.
 * Las comparaciones proceden de cuatro GeoJSON originales y se unen por CODIGO.
 * No estima rutas, tiempos de viaje ni accesibilidad real.
 */
(function(){
  const E=id=>document.getElementById(id), safely=x=>esc(x), asNumber=x=>Number.isFinite(Number(x))?Number(x):null;
  const allIds=['centros_salud_dist','dist_primaria','dist_secundaria','dist_vial'];
  const datasetKeys={centros_salud_dist:'health',dist_primaria:'primary',dist_secundaria:'secondary',dist_vial:'road'};
  const categories={health:'Salud',primary:'Primaria',secondary:'Secundaria',road:'Vías'};
  const norm=s=>String(s??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').toLocaleLowerCase('es');
  const cases={
    M01:{focus:'Organización del territorio',read:'Ubica la capital y los asentamientos en relación con la red vial y los cursos de agua. El límite distrital define el ámbito de análisis.',caution:'M01 trabaja con 66 centros; las capas de proximidad usan 67. No debes comparar ambos conteos sin aclarar sus fuentes.'},
    M02:{focus:'Distribución de los habitantes',read:'Compara el tamaño de los círculos según población censada y la densidad de las manzanas urbanas; cada símbolo representa una variable diferente.',caution:'La población corresponde al Censo 2017. La densidad urbana de manzanas no representa a todos los sectores rurales.'},
    M03:{focus:'Composición demográfica',read:'La distribución por sexo y edad ayuda a describir la estructura de población y a plantear preguntas sobre servicios y necesidades territoriales.',caution:'Los datos de 2017 describen un momento censal. No deben interpretarse como cifras actuales.'},
    M04:{focus:'Cercanía a establecimientos de salud',read:'Las clases muestran la distancia en línea recta desde cada uno de los 67 centros poblados al establecimiento de salud más cercano.',caution:'No mide disponibilidad de profesionales, calidad de atención, tiempos de viaje ni distancias recorridas.'},
    M05:{focus:'Accesibilidad educativa potencial',read:'Confronta la distribución espacial de centros poblados respecto de locales de educación primaria y secundaria, manteniendo escalas específicas por nivel.',caution:'Primaria y secundaria usan intervalos diferentes. Compara distancias en kilómetros, no solamente el color de la categoría.'},
    M06:{focus:'Cobertura y uso de suelo',read:'Identifica coberturas del suelo y ubica sectores referenciales de MIDAGRI. Contrasta la continuidad espacial de las coberturas.',caution:'Las coberturas MINAM y los puntos sectoriales MIDAGRI no representan exactamente la misma variable, fecha ni unidad cartográfica.'},
    M07:{focus:'Jerarquía y proximidad a vías',read:'Distingue los ejes nacionales, departamentales y vecinales y analiza los centros según distancia a las vías principales.',caution:'La proximidad no demuestra transitabilidad, condiciones del camino, tiempos de recorrido ni conectividad funcional.'},
    M08:{focus:'Susceptibilidad del territorio',read:'Consulta por separado susceptibilidad a movimientos en masa y a inundación fluvial con sus categorías oficiales de referencia.',caution:'Susceptibilidad no equivale a riesgo ni probabilidad anual de afectación. Los rásteres tienen resoluciones y ámbitos propios.'},
    M09:{focus:'Comparación inter-distrital',read:'Contrasta densidades de población y de red vial para 20 distritos de la provincia de Andahuaylas.',caution:'Población y densidad vial tienen unidades distintas y no deben sumarse ni confundirse en una sola escala.'},
    M10:{focus:'Lenguas maternas según el Censo 2017',read:'La lámina original contrasta los porcentajes distritales de quechua y castellano como lengua materna. Sus cinco clases son distintas para cada lengua. En Talavera: quechua 62,51 %, castellano 36,97 %; universo censal de 17 535 personas de tres años a más.',caution:'Los porcentajes incluyen otras lenguas y respuestas. La lengua materna no determina bilingüismo. Los cuantiles opcionales cambian la leyenda respecto de la lámina A3.'},
    M11:{focus:'Patrimonio, naturaleza y turismo',read:'La lámina A3 ubica cinco recursos: Plaza de Armas, Templo Santiago Apóstol, Achanchi, Sutoqmachay y festividad de Huarataca. Tres fotografías se muestran como apoyo visual en las fichas interactivas.',caution:'El punto de la festividad puede ser referencial. Las fotografías provienen de la lámina aportada y su autoría individual no figura; comprobar permisos para redistribuirlas. Las carreteras visibles no acreditan rutas turísticas oficiales.'},
    M12:{focus:'Pobreza monetaria y grupos robustos',read:'La lámina A3 muestra dos mapas: incidencia estimada de pobreza (cinco clases) y grupos robustos departamentales para los distritos de la provincia (14 distritos en grupo 1, cinco en grupo 2 y uno en grupo 3). Talavera registra 30,12 % e intervalo al 95 % de 20,19–40,05 %.',caution:'POB_SIM procede de simulaciones reprocesadas y no debe confundirse con una estimación puntual oficial del anexo. Los grupos robustos e intervalos son medidas distintas a los cortes cromáticos.'}
  };
  const scope={M01:'66 asentamientos · distrito',M02:'67 centros · Censo 2017',M03:'20 distritos · Censo 2017',M04:'67 centros · análisis Near',M05:'67 centros · análisis Near',M06:'Coberturas + sectores',M07:'67 centros · análisis Near',M08:'2 superficies ráster',M09:'20 distritos · indicadores',M10:'20 distritos · lengua materna',M11:'5 recursos · MINCETUR',M12:'20 distritos · INEI 2018'};
  let initialPositionApplied=false,presentation=false,pendingFocus=null,comparisonRows=null,lastStatusTimer=null;
  const initial=new URLSearchParams(location.search);
  function notify(message){const area=E('atlasStatus');if(!area)return;area.textContent=message;area.hidden=false;if(lastStatusTimer)clearTimeout(lastStatusTimer);lastStatusTimer=setTimeout(()=>{area.hidden=true},5000)}
  function updateAnalysis(){
    const spec=cases[selectedTopic];if(!spec)return;
    E('analysisScope').textContent=scope[selectedTopic];E('analysisTitle').textContent=spec.focus;
    let observations=[spec.read];let summary='';const id=currentProximityId?.();
    if(id&&manifest?.capas?.[id]){
      const features=geoCache.get(manifest.capas[id].path)?.features||[];
      if(features.length){
        const counts=[0,1,2,3].map(i=>features.filter(f=>classIndex(id,f.properties||{})===i).length);
        const valid=features.map(f=>nearKm(id,f.properties||{})).filter(Number.isFinite).sort((a,b)=>a-b);
        if(valid.length){const average=valid.reduce((a,b)=>a+b,0)/valid.length;
          observations.push(`En los ${valid.length} registros de esta capa, la distancia media es ${$num(average,2)} km; la máxima es ${$num(valid[valid.length-1],2)} km.`);
        }
        const total=counts.reduce((a,b)=>a+b,0)||1;
        summary=`<div class="analysis-bar" role="img" aria-label="Distribución por clase: ${counts.join(', ')} centros"><span style="width:${100*counts[0]/total}%;background:${distanceColors[0]}"></span><span style="width:${100*counts[1]/total}%;background:${distanceColors[1]}"></span><span style="width:${100*counts[2]/total}%;background:${distanceColors[2]}"></span><span style="width:${100*counts[3]/total}%;background:${distanceColors[3]}"></span></div><div class="analysis-breakdown">${counts.map((count,i)=>`<span><i style="background:${distanceColors[i]}"></i>${safely(distanceNames[i])}: <strong>${count}</strong></span>`).join('')}</div>`;
      }
    }else if(selectedTopic==='M02'){
      const feats=geoCache.get(manifest?.capas?.centros_pob?.path)?.features||[];
      if(feats.length){const values=feats.map(f=>Number(f.properties?.POBLACION)||0).sort((a,b)=>b-a);observations.push(`En esta capa hay ${values.length} centros; el mayor registro poblacional es de ${$num(values[0],0)} habitantes.`);}
    }
    E('analysisFindings').innerHTML=observations.map((item,i)=>`<p class="analysis-point"><span aria-hidden="true">${i===0?'↳':'•'}</span>${safely(item)}</p>`).join('');
    E('analysisCaution').textContent='Precaución metodológica: '+spec.caution;
    E('analysisDistribution').innerHTML=summary;E('analysisDistribution').hidden=!summary;
    E('analysisCompare').hidden=!['M04','M05','M07'].includes(selectedTopic);
    E('openComparator').hidden=!['M04','M05','M07'].includes(selectedTopic);
  }
  function onTopic(){E('classMethodWrap').hidden=!['M02','M03','M09','M10','M12'].includes(selectedTopic);updateAnalysis();E('searchSuggestions').hidden=true;E('search').setAttribute('aria-expanded','false');}
  function restoreThemeControls(){
    if(!initial.has('map')||initial.get('map')!==selectedTopic)return;
    const desired=initial.get('mode'),choices=viewLayers[selectedTopic]||{};const cm=initial.get('method');E('classMethod').value=cm==='quantiles'?'quantiles':'equal';const lm=initial.get('labels');if(['principales','todas','ocultar'].includes(lm)){E('labelsMode').value=lm;atlasLabelsMode=lm;}const size=Number(initial.get('symbols'));if([0.82,1,1.25].includes(size)){E('symbolSize').value=String(size);atlasSymbolScale=size;}
    if(desired&&choices[desired]){E('viewMode').value=desired;currentLayers=new Set(choices[desired].filter(id=>manifest.capas[id]));syncLayerChecks();if(selectedTopic==='M05')lastEducationMode=desired.includes('secundaria')?'secundaria':'primaria';}
    const selected=initial.get('class');if(['0','1','2','3'].includes(selected)&&['M04','M05','M07'].includes(selectedTopic))E('proximityFilter').value=selected;
  }
  function afterDraw({resetExtent=false}={}){
    updateAnalysis();updateScaleStatus();
    if(resetExtent&&!initialPositionApplied){initialPositionApplied=true;const lat=Number(initial.get('lat')),lng=Number(initial.get('lng')),z=Number(initial.get('z'));
      if(initial.has('lat')&&initial.has('lng')&&initial.has('z')&&Number.isFinite(lat)&&Number.isFinite(lng)&&Number.isFinite(z)&&Math.abs(lat)<=90&&Math.abs(lng)<=180&&z>=3&&z<=19&&map)map.setView([lat,lng],z);
    }
    if(pendingFocus&&selectedTopic==='M04'){
      const code=pendingFocus;pendingFocus=null;const l=featureIndex.get(code);if(l&&map){map.flyTo(l.getLatLng(),Math.max(13,map.getZoom()),{animate:false});l.openPopup();}
    }
  }
  function classificationMethod(){return E('classMethod')?.value||'equal'}
  function updateScaleStatus(){if(!map||!E('atlasStatus'))return;E('map').setAttribute('aria-label',`Visor cartográfico: ${selectedTopic}, acercamiento ${map.getZoom()}`)}
  async function collectComparison(){
    const fcs=await Promise.all(allIds.map(id=>getJSON(manifest?.capas?.[id]?.path||'missing')));
    if(fcs.some(x=>!x?.features?.length))throw Error('No se han cargado las cuatro capas de proximidad.');
    const rows=new Map();
    allIds.forEach((id,i)=>{for(const f of fcs[i].features){const props=f.properties||{},code=String(props.CODIGO||'');if(!code)continue;const old=rows.get(code)||{code,name:normalizedLabel(props),population:asNumber(props.POBLACION),lat:f.geometry?.coordinates?.[1],lng:f.geometry?.coordinates?.[0]};old[datasetKeys[id]]=nearKm(id,props);rows.set(code,old);}});
    return [...rows.values()].filter(x=>allIds.every(id=>Number.isFinite(x[datasetKeys[id]]))).sort((a,b)=>a.name.localeCompare(b.name,'es'));
  }
  function filteredCompareRows(){
    let rows=(comparisonRows||[]).filter(r=>r.name.toLocaleLowerCase('es').includes(E('compareQuery').value.trim().toLocaleLowerCase('es')));
    const sort=E('compareSort').value;if(sort!=='name')rows=rows.slice().sort((a,b)=>b[sort]-a[sort]||a.name.localeCompare(b.name,'es'));
    return rows;
  }
  function compareCell(value,key){const val=Number.isFinite(value)?`${$num(value,2)} km`:'—';return `<td data-label="${safely(categories[key])}"><strong>${safely(val)}</strong></td>`;}
  function renderComparison(){
    const rows=filteredCompareRows();E('compareCount').textContent=`${rows.length} de ${(comparisonRows||[]).length} centros poblados`;
    E('compareTableBody').innerHTML=rows.map(r=>`<tr><th scope="row"><button class="compare-zoom" type="button" data-compare-code="${safely(r.code)}" title="Ubicar en M04">${safely(r.name)}</button></th>${['health','primary','secondary','road'].map(key=>compareCell(r[key],key)).join('')}</tr>`).join('')||'<tr><td colspan="5">Sin resultados para esta búsqueda.</td></tr>';
    document.querySelectorAll('[data-compare-code]').forEach(btn=>btn.onclick=()=>{
      pendingFocus=btn.dataset.compareCode;E('compareDialog').close();selectedTopic='M04';selectedVariable='';lastLayerTheme=null;renderTopic();
    });
  }
  function csvQuote(s){return '"'+String(s??'').replace(/"/g,'""')+'"';}
  function saveText(data,filename,mime){const url=URL.createObjectURL(new Blob(['\uFEFF',data],{type:mime}));const a=document.createElement('a');a.href=url;a.download=filename;a.click();setTimeout(()=>URL.revokeObjectURL(url),10000);}
  function saveComparisonCSV(){if(!comparisonRows)return;const rows=filteredCompareRows();const cols=['Código','Centro poblado','Población (hab.)','Salud (km)','Primaria (km)','Secundaria (km)','Vías principales (km)'];const text=[cols,...rows.map(r=>[r.code,r.name,r.population,...['health','primary','secondary','road'].map(key=>Number.isFinite(r[key])?r[key].toFixed(6):'')])].map(c=>c.map(csvQuote).join(';')).join('\r\n');saveText(text,'Talavera_V13_comparacion_67_centros.csv','text/csv;charset=utf-8');notify(`Se descargó la comparación de ${rows.length} localidades.`)}
  async function openComparator(){
    const dialog=E('compareDialog');if(!dialog)return;dialog.showModal();E('compareOverview').textContent='Cargando las cuatro capas de distancias...';E('compareTableBody').innerHTML='';
    try{if(!comparisonRows)comparisonRows=await collectComparison();
      const median=key=>{const arr=comparisonRows.map(r=>r[key]).sort((a,b)=>a-b);return arr.length?arr.length%2?arr[(arr.length-1)/2]:(arr[arr.length/2-1]+arr[arr.length/2])/2:null};
      E('compareOverview').innerHTML=`<div><strong>${comparisonRows.length}</strong><small>centros coincidentes</small></div>${Object.entries(categories).map(([key,label])=>`<div><strong>${$num(median(key),2)} km</strong><small>Mediana a ${safely(label.toLowerCase())}</small></div>`).join('')}`;
      renderComparison();
    }catch(error){E('compareOverview').textContent=error.message;E('compareTableBody').innerHTML='';notify(error.message);}
  }
  function present(){presentation=!presentation;document.body.classList.toggle('atlas-presentation-mode',presentation);const button=E('togglePresentation');button.textContent=presentation?'Salir de presentación':'Modo presentación';button.setAttribute('aria-pressed',String(presentation));if(map)setTimeout(()=>map.invalidateSize(),150);notify(presentation?'Modo de presentación activado. Pulsa Esc para salir.':'Modo de presentación desactivado.');}
  function buildShareLink(){const url=new URL(location.href);url.search='';url.hash='';url.searchParams.set('map',selectedTopic);if(['M10','M12'].includes(selectedTopic)&&selectedVariable)url.searchParams.set('variable',selectedVariable);const mode=E('viewMode')?.value;if(!E('viewWrap').hidden&&mode)url.searchParams.set('mode',mode);if(['M02','M03','M09','M10','M12'].includes(selectedTopic)&&classificationMethod()==='quantiles')url.searchParams.set('method','quantiles');if(E('labelsMode')?.value!=='principales')url.searchParams.set('labels',E('labelsMode').value);if(E('symbolSize')?.value!=='1')url.searchParams.set('symbols',E('symbolSize').value);const cl=E('proximityFilter')?.value;if(!E('proximityFilterWrap').hidden&&cl&&cl!=='all')url.searchParams.set('class',cl);if(map){const p=map.getCenter();url.searchParams.set('lat',p.lat.toFixed(5));url.searchParams.set('lng',p.lng.toFixed(5));url.searchParams.set('z',String(map.getZoom()));}return url.toString();}
  async function share(){const link=buildShareLink();try{if(navigator.clipboard?.writeText){await navigator.clipboard.writeText(link);}else{const box=document.createElement('textarea');box.value=link;document.body.appendChild(box);box.select();const copied=document.execCommand('copy');box.remove();if(!copied)throw Error('No se pudo copiar el enlace');}notify('Enlace de la vista copiado. Puedes compartirlo directamente.');}catch{window.prompt('Copia este enlace para compartir la vista:',link)}}
  function printableReport(){const spec=cases[selectedTopic],title=themes[selectedTopic];if(!spec||!title)return;
    const date=new Intl.DateTimeFormat('es-PE',{day:'2-digit',month:'long',year:'numeric'}).format(new Date());
    E('printSheet').innerHTML=`<header><small>UNMSM · GEOGRAFÍA HUMANA · ATLAS DE TALAVERA</small><h1>${safely(selectedTopic+' · '+catalog.find(c=>c[0]===selectedTopic)?.[1])}</h1><p>${safely(scope[selectedTopic])} · Elaboración: 2026</p></header><h2>Indicadores principales</h2><div class="print-metrics">${title.metrics.map(m=>`<div><strong>${safely(m[0])}</strong><span>${safely(m[1])}</span></div>`).join('')}</div><h2>Lectura territorial</h2><p>${safely(title.desc)}</p><h2>Interpretación</h2>${[...E('analysisFindings').querySelectorAll('p')].map(x=>`<p>${safely(x.textContent)}</p>`).join('')}<h2>Limitaciones metodológicas</h2><p>${safely(spec.caution)}</p><h2>Fuentes</h2><p>${safely(title.source)}</p><footer>Ficha de interpretación geográfica · Generada el ${safely(date)} · No incluye un mapa de base externo. Para descargar la cartografía temática vectorial usa el botón «Descargar mapa» del visor.</footer>`;
    window.print();
  }
  function suggestionsFor(query){const q=norm(query);const data=[];for(const [id,title] of catalog){if(norm(title).includes(q)||norm(id).includes(q))data.push({kind:'theme',id,text:`${id} · ${title}`});}
    const seen=new Set();for(const f of loadedFeatures||[]){const p=f.properties||{},name=normalizedLabel(p);if(!name||!norm(name).includes(q))continue;const key=norm(name);if(seen.has(key))continue;seen.add(key);data.push({kind:'place',id:String(p.CODIGO||p.UBIGEO||''),text:name});}
    return data.slice(0,9);
  }
  function selectSuggestion(item){E('search').value=item.text;E('searchSuggestions').hidden=true;E('search').setAttribute('aria-expanded','false');if(item.kind==='theme'){selectedTopic=item.id;selectedVariable='';renderTopic();return;}
    const layer=featureIndex.get(item.id);if(layer&&map){map.flyTo(layer.getLatLng(),Math.max(13,map.getZoom()),{duration:.5});layer.openPopup();return;}
    const q=norm(E('search').value);const f=(loadedFeatures||[]).find(x=>norm(normalizedLabel(x.properties||{}))===q);if(f){const l=L.geoJSON(f),bounds=l.getBounds();if(bounds.isValid())map.fitBounds(bounds.pad(.12),{maxZoom:12});}
  }
  function bindSearch(){const input=E('search'),results=E('searchSuggestions');input.oninput=null;input.addEventListener('input',()=>{const q=input.value.trim();if(q.length<2){results.hidden=true;input.setAttribute('aria-expanded','false');return;}const matches=suggestionsFor(q);results.innerHTML=matches.length?matches.map((m,i)=>`<button type="button" role="option" data-result="${i}">${safely(m.kind==='theme'?'MAPA':'LUGAR')} · ${safely(m.text)}</button>`).join(''):'<div class="no-search-results">No hay coincidencias en el tema visible.</div>';results.hidden=false;input.setAttribute('aria-expanded','true');results.querySelectorAll('[data-result]').forEach(b=>b.onclick=()=>selectSuggestion(matches[Number(b.dataset.result)]));});
    input.addEventListener('keydown',e=>{if(e.key==='Escape'){results.hidden=true;input.setAttribute('aria-expanded','false');}if(e.key==='Enter'){const b=results.querySelector('[data-result]');if(b&&!results.hidden){e.preventDefault();b.click();}}});
  }
  function boot(){
    E('openComparator').onclick=openComparator;E('analysisCompare').onclick=openComparator;E('closeComparator').onclick=()=>E('compareDialog').close();E('compareQuery').oninput=renderComparison;E('compareSort').onchange=renderComparison;E('compareCSV').onclick=saveComparisonCSV;
    E('togglePresentation').onclick=present;E('shareMap').onclick=share;E('printFactSheet').onclick=printableReport;E('classMethod').onchange=()=>{if(['M02','M03','M09','M10','M12'].includes(selectedTopic)){drawLayers();notify('Se recalcularon las clases con el método seleccionado.')}};
    document.addEventListener('keydown',e=>{if(e.key==='Escape'&&presentation)present()});bindSearch();
  }
  window.AtlasV12={onTopic,restoreThemeControls,afterDraw,updateScaleStatus,classificationMethod,openComparator,buildShareLink};
  document.addEventListener('DOMContentLoaded',boot);
})();
