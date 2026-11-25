'use strict';
/* Atlas Talavera V9 · GitHub Pages. Solo se muestran geometrías verdaderas
   exportadas desde los GeoParquet originales. Las tablas no crean polígonos. */
const catalog = [
 ['M01','Localización y centros poblados','Localización','Distribución de asentamientos y capital distrital'],
 ['M02','Distribución y concentración poblacional','Población','Manzanas urbanas y centros poblados · INEI 2017'],
 ['M03','Composición por sexo y edad','Demografía','Distribución demográfica y contexto provincial'],
 ['M04','Salud y proximidad territorial','Salud','Establecimientos y distancia euclidiana'],
 ['M05','Educación y accesibilidad','Educación','Locales educativos y proximidad a primaria/secundaria'],
 ['M06','Cobertura vegetal y superficie agrícola','Agricultura','Coberturas MINAM y sectores MIDAGRI'],
 ['M07','Jerarquía y proximidad vial','Conectividad','Vías nacionales, departamentales y vecinales'],
 ['M08','Susceptibilidad a peligros naturales','Territorio','Movimientos en masa e inundación · INGEMMET'],
 ['M09','Densidad poblacional y vial','Comparación','20 distritos · MTC e INEI'],
 ['M10','Lengua materna quechua y castellana','Cultura','20 distritos · población de 3 años a más'],
 ['M11','Recursos turísticos y patrimonio','Turismo','Cinco registros del MINCETUR'],
 ['M12','Pobreza monetaria y desigualdades','Economía','INEI 2018 · estimación y grupos robustos']
];
const $=id=>document.getElementById(id);
const esc=x=>String(x??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const urls={osm:'https://tile.openstreetmap.org/{z}/{x}/{y}.png',topo:'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png'};
const attributions={osm:'© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',topo:'© OpenTopoMap © OpenStreetMap contributors'};
const tourismIcon={'Urbano-cultural':'01_urbano_cultural_128px.png','Arqueológico':'02_arqueologico_128px.png','Natural':'03_natural_caverna_128px.png','Festividad':'04_festividad_128px.png'};
const tourismColors={'Urbano-cultural':'#438F88','Arqueológico':'#D3A26B','Natural':'#587E59','Festividad':'#805A9F'};
const sea=['#E7F4ED','#B8DDCF','#7ABCB0','#438F88','#183A4B'];
const copper=['#F5EBDD','#E9CEB4','#D3A26B','#B67C58','#7E493C'];
const spanish=['#F8EEDB','#EAD39D','#D3A26B','#B47B42','#78491F'];
const categoriesColors=['#438F88','#D3A26B','#587E59','#805A9F','#6FBAD1','#D28264','#B0C4B1','#AA835B','#5C7891','#B6A2B5','#7A8C6A','#AFCED0','#996E6D'];
const primaryPref={M01:'centros',M02:'centros_pob',M03:'provincia_estadisticas',M04:'centros_salud_dist',M05:'dist_primaria',M06:'cobertura_vegetal',M07:'dist_vial',M08:'centros_susceptibilidad',M09:'provincia_estadisticas',M10:'provincia_estadisticas',M11:'turismo',M12:'provincia_estadisticas'};
const themes={
 M01:{metrics:[['158,00 km²','Área aproximada'],['66','Centros poblados en M01'],['Talavera','Capital distrital'],['M01','Lámina del atlas']],desc:'La localización y la relación entre asentamientos, ríos y vías permite interpretar la organización territorial. M01 representa 66 centros; otros análisis emplean una base de 67 puntos, lo que requiere documentar el universo de cada capa.',source:'INEI · MTC · cartografía administrativa'},
 M02:{metrics:[['18 509','Población, 2017'],['11 646','Población urbana'],['6 863','Población rural'],['117,13','Habitantes/km²']],desc:'Los centros poblados se visualizan con círculos de área aproximadamente proporcional a su población censada; el símbolo más grande indica más habitantes. Puedes ver las localidades principales y alternar la capa de densidad de manzanas.  La densidad de manzanas no describe toda la zona rural.',source:'INEI · Censo 2017'},
 M03:{metrics:[['9 630','Mujeres'],['8 879','Hombres'],['52,03 %','Proporción femenina'],['29,54 %','Población de 0–14 años']],desc:'La composición por sexo y edad permite interpretar las demandas potenciales de servicios. Las cifras de población tienen como referencia el Censo 2017.',source:'INEI · Censo 2017'},
 M04:{metrics:[['14','Establecimientos en Talavera'],['1,40 km','Distancia media'],['4,22 km','Distancia máxima'],['22,88 %','Centros a más de 2 km']],desc:'Cada centro poblado se colorea por la distancia euclidiana al establecimiento de salud más cercano, usando los cuatro rangos de la lámina M04. Las cruces muestran los establecimientos dentro y alrededor de Talavera; no son tiempos de recorrido ni garantizan atención disponible.',source:'MINSA / SUSALUD · análisis Near'},
 M05:{metrics:[['80','Servicios educativos'],['60','Locales físicos'],['669,4 m','Distancia media a primaria'],['1 658,8 m','Distancia media a secundaria']],desc:'Compara la distancia euclidiana de los 67 centros poblados a primaria o secundaria. Las clases y colores siguen los cortes del M05; los símbolos de locales se muestran aparte. Un local puede ofrecer varios niveles, y la distancia no equivale a tiempo de viaje.',source:'MINEDU · análisis Near'},
 M06:{metrics:[['67,89 %','Cobertura clasificada agrícola'],['10 727 ha','Agricultura (cobertura MINAM)'],['13','Sectores MIDAGRI'],['25,76 %','Matorral arbustivo']],desc:'La cobertura vegetal, el uso del suelo y la delimitación sectorial agrícola son conceptos distintos. Los porcentajes y superficies no equivalen a cosecha o área bajo riego.',source:'MINAM · MIDAGRI (periodos distintos)'},
 M07:{metrics:[['145,06 km','Longitud vial cartografiada'],['71,92 %','Proporción de red vecinal'],['0,918','Km de vía por km²'],['1,34 km','Distancia media a vías principales']],desc:'Los puntos se colorean según su distancia euclidiana a vías nacionales y departamentales, conservando los cuatro intervalos del M07. Las líneas distinguen las jerarquías viales. Esta proximidad no refleja accesibilidad efectiva, transitabilidad ni tiempo de desplazamiento.',source:'MTC · Provías · análisis Near'},
 M08:{metrics:[['47,31 %','Superficie de susceptibilidad alta/muy alta a masa'],['38/67','Centros en zonas altas/muy altas a masa'],['28,75 ha','Susceptibilidad alta a inundación'],['0,18 %','Área clasificada alta a inundación']],desc:'Dos rásteres originales de INGEMMET: movimientos en masa (200 m) e inundación fluvial (50 m), con categorías verificadas frente a la lámina M08. Selecciona un ráster a la vez desde el panel. La susceptibilidad describe condiciones predisponentes: no equivale a riesgo ni a daños esperados.',source:'INGEMMET · análisis ráster'},
 M09:{metrics:[['18 509','Población, 2017'],['117,13','Densidad hab./km²'],['145,07 km','Longitud vial'],['0,918','Densidad vial km/km²']],desc:'Los indicadores se calcularon para los 20 distritos. Talavera ocupa el segundo lugar provincial en densidad poblacional y vial según la tabla trabajada.',source:'INEI · MTC · elaboración SIG 2026'},
 M10:{metrics:[['10 961','Quechua como lengua materna'],['62,51 %','Quechua (%)'],['6 482','Castellano como lengua materna'],['36,97 %','Castellano (%)']],desc:'La variable censal es la lengua con la que se aprendió a hablar en la niñez, para población de tres años a más. No mide directamente bilingüismo.',source:'INEI · tabulado de lengua materna; confirmar año en el reporte'},
 M11:{metrics:[['5','Recursos registrados'],['3','Manifestaciones culturales'],['1','Sitio natural'],['1','Festividad tradicional']],desc:'Explora cinco recursos documentados por MINCETUR con símbolos diferenciados y puntos de contexto. Consulta las fichas oficiales, filtra categorías y utiliza el detalle urbano para distinguir plaza y templo. Las vías son referencias geográficas, no rutas turísticas validadas; el punto de la festividad es referencial.',source:'MINCETUR · Inventario de Recursos Turísticos · 23/11/2026'},
 M12:{metrics:[['30,12 %','Pobreza estimada reprocesada'],['20,19–40,05 %','Intervalo oficial al 95 %'],['2','Grupo robusto departamental'],['78','Posición departamental']],desc:'POB_SIM es una estimación calculada a partir de simulaciones del INEI; los intervalos de confianza y grupos robustos provienen del anexo oficial 2018. Los rangos de una coropleta web no representan significancia estadística.',source:'INEI · Mapa de Pobreza Provincial y Distrital 2018 · Anexo 3.03'}
};
const variablePresets={
 M02:[['DENS_HA','Densidad por manzana (hab./ha)'],['T_TOTAL','Población de la manzana']],
 M03:[['Mujeres','Mujeres (2017)'],['Hombres','Hombres (2017)'],['Poblacion_2017','Población total (2017)']],
 M09:[['Dens_pob_hab_km2','Densidad poblacional (hab./km²)'],['Dens_vial_km_km2','Densidad vial (km/km²)'],['Poblacion_2017','Población total'],['Longitud_vial_km','Longitud vial (km)']],
 M10:[['PCT_QUECHUA','Quechua (%)'],['PCT_CASTELLANO','Castellano (%)'],['QUECHUA','Quechua (personas)'],['CASTELLANO','Castellano (personas)']],
 M12:[['POB_SIM','Pobreza monetaria estimada (%)'],['GRUPO_APU','Grupo robusto oficial · Apurímac'],['IC_INF95','Intervalo inferior al 95 %'],['IC_SUP95','Intervalo superior al 95 %']]
};
let map=null,baselayer=null,manifest=null,stats=[],statByCode=new Map(),geoCache=new Map(),mapLayers=[],activeData=null,selectedTopic='M11',selectedVariable='',activeRender=0,loadedFeatures=[],currentLayers=new Set(),rasterLayers=[],lastLayerTheme=null,tourismFeatureLayers=new Map(),selectedResource=null,urbanInsetMap=null,featureIndex=new Map();
const $num=(v,d=2)=>{const n=Number(v);return Number.isFinite(n)?new Intl.NumberFormat('es-PE',{maximumFractionDigits:d}).format(n):'Sin dato'};
function showMessage(t){$('mapMessage').textContent=t||'';$('mapMessage').hidden=!t;}
function setMetrics(items){$('metrics').innerHTML=items.map(x=>`<div class="metric"><b>${esc(x[0])}</b><small>${esc(x[1])}</small></div>`).join('')}
function setDetails(items){$('details').innerHTML=items.map(a=>`<div><b>${esc(a[0])}</b>: ${esc(a[1])}</div>`).join('')}
function legend(rows,title,footer=''){$('legend').innerHTML=`<h3>${esc(title)}</h3>`+rows.map(x=>`<div class="legendrow">${x[2]?`<span class="legend-bubble-space"><span class="legend-bubble" style="width:${x[2]}px;height:${x[2]}px;background:${x[1]}"></span></span>`:`<span class="chip" style="background:${x[1]}"></span>`}<span>${esc(x[0])}</span></div>`).join('')+(footer?`<p class="micro">${esc(footer)}</p>`:'')}
function initMap(){if(!window.L){showMessage('Leaflet no pudo cargarse. Revisa la conexión a internet.');return}
 map=L.map('map',{preferCanvas:true,zoomControl:true}).setView([-13.63,-73.44],11);for(const [name,z] of [['fillPane',403],['hydroPane',417],['roadPane',431],['pointPane',454],['outlinePane',477]]){map.createPane(name);map.getPane(name).style.zIndex=z;}map.createPane('rasterPane');map.getPane('rasterPane').style.zIndex=414;map.getPane('rasterPane').style.pointerEvents='none';baselayer=L.tileLayer(urls.osm,{maxZoom:19,attribution:attributions.osm}).addTo(map);L.control.scale({imperial:false}).addTo(map)}
function baseChange(){if(!map)return;const k=$('basemap').value;if(baselayer){map.removeLayer(baselayer);baselayer=null;}if(k==='none')return;if(!urls[k])return;baselayer=L.tileLayer(urls[k],{maxZoom:19,attribution:attributions[k]}).addTo(map);baselayer.bringToBack()}
function clearMap(){for(const x of [...mapLayers,...rasterLayers])if(map)map.removeLayer(x);mapLayers=[];rasterLayers=[];activeData=null;loadedFeatures=[];featureIndex.clear()}
function showUrbanInset(){const card=$('urbanInsetCard');if(!card)return;card.hidden=selectedTopic!=='M11';
 if(selectedTopic!=='M11'||!map||!window.L)return;
 if(!urbanInsetMap){urbanInsetMap=L.map('urbanInsetMap',{zoomControl:false,attributionControl:false,dragging:false,scrollWheelZoom:false,doubleClickZoom:false,boxZoom:false,keyboard:false}).setView([-13.65372,-73.42867],16);
 L.tileLayer(urls.osm,{maxZoom:19,attribution:attributions.osm}).addTo(urbanInsetMap);
 for(const r of [{p:[-13.653666,-73.428965],n:'Plaza de Armas de Talavera la Reina'},{p:[-13.653768,-73.428373],n:'Templo Santiago Apóstol'}])L.circleMarker(r.p,{radius:7,weight:2,color:'#ffffff',fillColor:'#327F79',fillOpacity:1}).bindTooltip(r.n,{permanent:true,direction:'right',offset:[6,0],className:'urban-pin-label'}).addTo(urbanInsetMap);
 }
 setTimeout(()=>urbanInsetMap.invalidateSize(),150);
}
function fit(){if(!map)return;let bounds=L.latLngBounds([]);
 if(!['M03','M09','M10','M12'].includes(selectedTopic)){
   const b=geoCache.get('data/capas/limite.geojson');if(b?.features?.length){const q=L.geoJSON(b).getBounds();if(q.isValid())bounds.extend(q);}}
 if(!bounds.isValid()){for(const x of mapLayers)if(typeof x.getBounds==='function'){let b=x.getBounds();if(b.isValid())bounds.extend(b)}for(const x of rasterLayers)if(typeof x.getBounds==='function')bounds.extend(x.getBounds());}
 if(bounds.isValid())map.fitBounds(bounds.pad(['M03','M09','M10','M12'].includes(selectedTopic)?.08:.13),{maxZoom:['M03','M09','M10','M12'].includes(selectedTopic)?10:13});else map.setView([-13.63,-73.44],11);}
async function getJSON(url){if(geoCache.has(url))return geoCache.get(url);try{const r=await fetch('./'+url);if(!r.ok)throw Error(r.status);const x=await r.json();geoCache.set(url,x);return x}catch(e){return null}}
function themeRows(){return (manifest?.temas?.[selectedTopic]||[]).filter(id=>manifest.capas?.[id]);}
function nav(){ $('themeList').innerHTML=catalog.map(r=>{const n=themeRowsFor(r[0]);const ready=n>0?'●':'○';return `<button data-theme="${r[0]}" class="theme ${selectedTopic===r[0]?'active':''}" type="button"><span class="number">${r[0]}</span><span><strong>${esc(r[1])}</strong><small>${esc(r[2])} · ${ready} ${n} capa${n===1?'':'s'}</small></span></button>`}).join('');
 document.querySelectorAll('[data-theme]').forEach(b=>b.onclick=()=>{selectedTopic=b.dataset.theme;selectedVariable='';$('sidebar').classList.remove('open');$('mobileMenu').setAttribute('aria-expanded','false');renderTopic()})}
function themeRowsFor(t){return (manifest?.temas?.[t]||[]).filter(id=>manifest.capas?.[id]).length+(t==='M08'?(manifest?.rasters?.length||0):0)}
function layerCheckboxes(){const list=themeRows();let selectedPrevious=lastLayerTheme===selectedTopic?new Set(currentLayers):new Set();lastLayerTheme=selectedTopic;currentLayers=new Set();
 for(const id of list){if(id===primaryPref[selectedTopic]||id==='limite'||selectedPrevious.has(id)||
   (selectedTopic==='M02'&&id==='centros_pob')||
   (selectedTopic==='M04'&&id==='centros_salud_dist')||
   (selectedTopic==='M05'&&id==='dist_primaria')||
       (selectedTopic==='M04'&&id==='salud')||
       (selectedTopic==='M05'&&id==='locales_educativos')||
       (selectedTopic==='M07'&&id==='dist_vial')||
       (selectedTopic==='M11'&&['vias_nacionales','vias_departamentales','hidrografia','centros'].includes(id))||
   (selectedTopic==='M07'&&id.startsWith('vias_'))||
   (selectedTopic==='M08'&&id==='centros_susceptibilidad'))currentLayers.add(id)}
 if(selectedTopic==='M11'){currentLayers.add('turismo');['centros','hidrografia'].filter(k=>manifest.capas[k]).forEach(k=>currentLayers.add(k));}
 let html='<h3>Capas del mapa</h3>';
 for(const id of list){const o=manifest.capas[id],checked=currentLayers.has(id);html+=`<label class="layer-option"><input type="checkbox" data-layer="${esc(id)}" ${checked?'checked':''}/><span>${esc(o.nombre||id)}</span><small class="layer-count">${o.count||'?'} registros</small></label>`}
 if(selectedTopic==='M08'){const previousRaster=[...selectedPrevious].find(k=>k.startsWith('raster_'));const chosen=previousRaster||((manifest.rasters||[]).some(r=>r.id==='masa')?'raster_masa':null);for(const r of (manifest.rasters||[])){if('raster_'+r.id===chosen)currentLayers.add('raster_'+r.id);html+=`<label class="layer-option"><input type="checkbox" data-layer="raster_${esc(r.id)}" ${currentLayers.has('raster_'+r.id)?'checked':''}/><span>${esc(r.nombre)}</span></label>`}}
 if(!list.length&&!manifest?.rasters?.length)html+='<p class="micro">Las capas de este tema se habilitarán al ejecutar el exportador con los GeoParquet reales de tu PC.</p>';
 $('layerChoices').innerHTML=html;document.querySelectorAll('[data-layer]').forEach(c=>c.onchange=()=>{if(c.dataset.layer.startsWith('raster_')&&c.checked){for(const k of [...currentLayers])if(k.startsWith('raster_'))currentLayers.delete(k);document.querySelectorAll('[data-layer^="raster_"]').forEach(el=>{if(el!==c)el.checked=false})}if(c.checked)currentLayers.add(c.dataset.layer);else currentLayers.delete(c.dataset.layer);drawLayers()})}

const viewChoices={
 M02:[['both','Población por centros + densidad urbana'],['centros','Solo centros: círculos proporcionales'],['manzanas','Solo densidad por manzana']],
 M04:[['both','Distancias + establecimientos'],['dist','Solo proximidad de centros poblados'],['equipment','Solo establecimientos sanitarios']],
 M05:[['primaria','Proximidad a primaria'],['secundaria','Proximidad a secundaria'],['servicios','Solo locales educativos']],
 M07:[['both','Distancia + jerarquía vial'],['dist','Solo proximidad a vías principales'],['network','Solo red vial']]
};
const viewLayers={
 M02:{both:['limite','centros_pob','manzanas'],centros:['limite','centros_pob','capital'],manzanas:['limite','manzanas','capital']},
 M04:{both:['limite','centros_salud_dist','salud'],dist:['limite','centros_salud_dist'],equipment:['limite','salud']},
 M05:{primaria:['limite','dist_primaria','locales_educativos'],secundaria:['limite','dist_secundaria','locales_educativos'],servicios:['limite','locales_educativos']},
 M07:{both:['limite','dist_vial','vias_nacionales','vias_departamentales','vias_vecinales'],dist:['limite','dist_vial'],network:['limite','vias_nacionales','vias_departamentales','vias_vecinales']}
};
function setupView(){const options=viewChoices[selectedTopic]||[];$('viewWrap').hidden=!options.length;
 if(!options.length)return;const selection={M02:'both',M04:'both',M05:'primaria',M07:'both'}[selectedTopic];
 $('viewMode').innerHTML=options.map(([key,value])=>`<option value="${key}">${esc(value)}</option>`).join('');$('viewMode').value=selection;}
function changeView(){const preset=viewLayers[selectedTopic]?.[$('viewMode').value];if(!preset)return;currentLayers=new Set(preset.filter(x=>manifest.capas[x]));
 document.querySelectorAll('[data-layer]').forEach(c=>c.checked=currentLayers.has(c.dataset.layer));drawLayers();}
function setupProximityFilter(){const isDistance=['M04','M05','M07'].includes(selectedTopic);
 $('proximityFilterWrap').hidden=!isDistance;if(!isDistance)return;
 const names=['Muy cercana','Cercana','Intermedia','Más alejada'];$('proximityFilter').innerHTML='<option value="all">Todos los centros (67)</option>'+names.map((n,i)=>`<option value="${i}">${i+1}. ${n}</option>`).join('');$('proximityFilter').value='all';
}
function updateMapGuide(){const tips={M02:'Cada círculo cambia de tamaño según la población de su centro poblado. Alterna densidad y puntos desde la barra lateral.',M04:'Los puntos se clasifican en cuatro distancias al servicio de salud más próximo. Selecciona un color para filtrarlos.',M05:'Cambia entre primaria y secundaria; consulta las cuatro categorías de cercanía de cada localidad.',M07:'Compara jerarquía vial y los cuatro rangos de distancia de los centros a vías principales.',M11:'Cinco atractivos documentados: explora las tarjetas y acerca el núcleo de plaza y templo.'};
 $('mapGuide').textContent=tips[selectedTopic]||'Activa y desactiva capas; selecciona un elemento para conocer sus atributos y fuentes.';
 $('populationLabelsWrap').hidden=selectedTopic!=='M02';$('populationRank').hidden=true;
}
function setupVars(){let options=variablePresets[selectedTopic]||[];
 if(selectedTopic==='M06'){options=[['TIPO_COBERT','Categoría de cobertura vegetal'],['AREA_GEOM_KM2','Superficie (km²)']];const info=manifest?.capas?.cobertura_vegetal;if(info){options=info.categorical?.map(v=>[v,v.replaceAll('_',' ')])||options;}}
 if(!options.length){$('variableWrap').hidden=true;selectedVariable='';return;}
 $('variableWrap').hidden=false;$('variable').innerHTML=options.map(o=>`<option value="${esc(o[0])}">${esc(o[1])}</option>`).join('');
 if(!options.some(o=>o[0]===selectedVariable))selectedVariable=options[0][0];$('variable').value=selectedVariable;}
function setupCategory(){if(selectedTopic!=='M11'){$('categoryWrap').hidden=true;return}$('categoryWrap').hidden=false;$('category').innerHTML=['Todos',...Object.keys(tourismIcon)].map(v=>`<option>${esc(v)}</option>`).join('')}
function detailsDistrict(code){const p=statByCode.get(code);if(!p)return;const entries=selectedTopic==='M10'?['QUECHUA','CASTELLANO','TOTAL_3MAS','PCT_QUECHUA','PCT_CASTELLANO']:selectedTopic==='M12'?['POB_SIM','IC_INF95','IC_SUP95','GRUPO_APU','RANK_APU']:selectedTopic==='M03'?['Hombres','Mujeres','Poblacion_2017']:['Poblacion_2017','Dens_pob_hab_km2','Longitud_vial_km','Dens_vial_km_km2'];
 setDetails([['Distrito',p.DISTRITO],['UBIGEO',p.UBIGEO],...entries.map(k=>[k.replaceAll('_',' '),typeof p[k]==='number'?$num(p[k]):p[k]])]);if($('districtSelect').value!==code)$('districtSelect').value=code}
function statisticsPanel(){if(!['M03','M09','M10','M12'].includes(selectedTopic)||!stats.length){$('statPanel').innerHTML='';$('districtWrap').hidden=true;return}
 $('districtWrap').hidden=false;$('districtSelect').innerHTML=stats.slice().sort((a,b)=>a.DISTRITO.localeCompare(b.DISTRITO,'es')).map(x=>`<option value="${x.UBIGEO}">${esc(x.DISTRITO)}</option>`).join('');
 if(!statByCode.has($('districtSelect').value))$('districtSelect').value='030216';
 if(!selectedVariable)selectedVariable={M03:'Poblacion_2017',M09:'Dens_pob_hab_km2',M10:'PCT_QUECHUA',M12:'POB_SIM'}[selectedTopic];
 const values=stats.filter(x=>Number.isFinite(Number(x[selectedVariable]))).slice().sort((a,b)=>Number(b[selectedVariable])-Number(a[selectedVariable]));
 const max=Math.max(1,...values.map(x=>Number(x[selectedVariable])));
 const html=values.map(v=>`<div class="rankrow ${v.UBIGEO==='030216'?'current':''}" title="${esc(v.DISTRITO)}"><span>${esc(v.DISTRITO)}</span><div class="track"><div class="bar" style="width:${Math.max(0,Math.min(100,Number(v[selectedVariable])/max*100))}%"></div></div><strong>${$num(v[selectedVariable])}</strong></div>`).join('');
 $('statPanel').innerHTML=`<h3>20 distritos · ${esc(selectedVariable.replaceAll('_',' '))}</h3>${html}<div class="data-note">Comparación basada en tablas INEI/MTC suministradas. Una cifra de pobreza estimada no demuestra por sí sola diferencias estadísticamente significativas.</div>`;
 if(selectedTopic==='M03')$('statPanel').innerHTML+=`<h3>Pirámides demográficas del atlas</h3><img class="pyramid" src="./assets/graficos/M03_piramide_talavera.png" alt="Pirámide de edad de Talavera"/><img class="pyramid" src="./assets/graficos/M03_piramide_andahuaylas.png" alt="Pirámide de edad de Andahuaylas"/>`;
 detailsDistrict($('districtSelect').value)}

/* Intervalos transcritos de las leyendas originales A3. NEAR_DIST se almacena en metros. */
const distanceClassifications={
 centros_salud_dist:{name:'Proximidad a establecimientos de salud',thresholds:[.604,1.384,2.619],min:.0255,max:4.2181},
 dist_primaria:{name:'Proximidad a educación primaria',thresholds:[.220993,.624645,1.130415],min:.001587,max:1.851236},
 dist_secundaria:{name:'Proximidad a educación secundaria',thresholds:[1.167094,2.004886,2.994324],min:.035522,max:4.469997},
 dist_vial:{name:'Proximidad a la red vial principal',thresholds:[.462318,1.345644,2.770595],min:.001503,max:5.402275}
};
const distanceColors=['#167F83','#73B9B2','#E5A34B','#C96657'];
const nearKm=(id,p)=>id==='centros_salud_dist'?(Number.isFinite(Number(p.DIST_KM))?Number(p.DIST_KM):Number(p.NEAR_DIST)/1000):Number(p.NEAR_DIST)/1000;
const classIndex=(id,p)=>{const cfg=distanceClassifications[id],v=nearKm(id,p);if(!cfg||!Number.isFinite(v))return -1;const i=cfg.thresholds.findIndex(b=>v<=b+1e-9);return i===-1?3:i};
const distanceClassName=(id,p)=>{const i=classIndex(id,p);return i<0?'Sin información':['Muy cercana','Cercana','Intermedia','Más alejada'][i]};
function zoomToIndexedFeature(code){const layer=featureIndex.get(String(code));if(layer&&map){map.flyTo(layer.getLatLng(),Math.max(13,map.getZoom()),{duration:.6});layer.openPopup();}else showMessage('Para ubicar esta localidad, activa su capa de puntos en el panel lateral.');}
function attachFeatureZoom(){document.querySelectorAll('[data-zoom-cpp]').forEach(b=>b.onclick=()=>zoomToIndexedFeature(b.dataset.zoomCpp));}
function selectDistanceClass(value){$('proximityFilter').value=String(value);drawLayers();}
function distanceLegend(id,features){
 const c=distanceClassifications[id];if(!c)return;
 const values=features.map(f=>classIndex(id,f.properties||{})),counts=[0,1,2,3].map(n=>values.filter(v=>v===n).length);
 const edges=[c.min,...c.thresholds,c.max];const names=['Muy cercana','Cercana','Intermedia','Más alejada'];const selected=$('proximityFilter').value;
 const rows=counts.map((count,i)=>[`${names[i]} · ${$num(edges[i],3)}–${$num(edges[i+1],3)} km (${count})`,distanceColors[i]]);
 legend(rows,c.name,`Cada punto representa un centro poblado. Clases de la lámina A3; distancias euclidianas, no tiempos de viaje.`);
 const active=features.filter(f=>selected==='all'||classIndex(id,f.properties||{})===Number(selected));
 const closest=active.slice().sort((a,b)=>nearKm(id,a.properties)-nearKm(id,b.properties)).slice(0,7);
 const cards=$('classSummary');cards.innerHTML=`<div class="class-summary-title">Clasificación de los 67 centros poblados</div><div class="class-summary-grid">${counts.map((n,i)=>`<button type="button" class="class-stat ${selected===String(i)?'chosen':''}" data-proximity-class="${i}" aria-label="Filtrar ${names[i]}"><span class="class-dot" style="background:${distanceColors[i]}"></span><strong>${n}</strong><small>${names[i]}</small></button>`).join('')}</div><div class="proximity-list-head"><strong>${selected==='all'?'Centros con menor distancia':names[Number(selected)]+' · ejemplo de localidades'}</strong><button type="button" id="showAllDistance" class="text-action">Ver todos</button></div><div class="ranked-localities">${closest.map(f=>`<button type="button" data-zoom-cpp="${esc(f.properties.CODIGO)}"><span class="color-dot" style="background:${distanceColors[classIndex(id,f.properties)]}"></span><span>${esc(normalizedLabel(f.properties))}</span><strong>${$num(nearKm(id,f.properties),2)} km</strong></button>`).join('')}</div><p class="micro">Haz clic en un grupo para filtrar el mapa, y en una localidad para conocer su distancia exacta. Se trata de distancia en línea recta.</p>`;
 cards.hidden=false;document.querySelectorAll('[data-proximity-class]').forEach(b=>b.onclick=()=>selectDistanceClass(b.dataset.proximityClass));$('showAllDistance').onclick=()=>selectDistanceClass('all');attachFeatureZoom();
}
function circleRadius(pop){
 // Radio visual en píxeles. La raíz cuadrada mantiene el área aproximadamente proporcional a la población.
 const n=Math.max(0,Math.min(11691,Number(pop)||0));return 5+29*Math.sqrt(n/11691);
}
const populationBands=[['Hasta 58 hab.',0,58],['59–168 hab.',59,168],['169–297 hab.',169,297],['298–560 hab.',298,560],['561–11 691 hab.',561,11691]];
const populationBand=n=>{const v=Number(n)||0;return populationBands.findIndex(b=>v>=b[1]&&v<=b[2]);};
function populationLegend(features){
 const counts=populationBands.map((b,i)=>features.filter(f=>populationBand(f.properties?.POBLACION)===i).length);
 legend(populationBands.map((b,i)=>[`${b[0]} · ${counts[i]} ${counts[i]===1?'centro':'centros'}`,'#267F99',Math.round(circleRadius(b[2])*1.38)]),'Centros por tamaño poblacional','Tamaño por raíz cuadrada de la población censada, expresado con radios visuales. Fuente: INEI 2017.');
 const box=$('classSummary');box.innerHTML=`<div class="class-summary-title">Cómo leer los círculos</div><div class="population-band-list">${populationBands.map((b,i)=>`<div class="population-band"><span class="population-swatch" style="width:${Math.max(8,Math.min(30,circleRadius(b[2])))}px;height:${Math.max(8,Math.min(30,circleRadius(b[2])))}px"></span><strong>${counts[i]}</strong><span>${esc(b[0])}</span></div>`).join('')}</div><p class="micro">Un círculo más grande indica más habitantes; no representa extensión urbana. Las manzanas corresponden a la densidad en hab./ha, una variable distinta.</p>`;box.hidden=false;
 const ranked=features.slice().filter(f=>Number.isFinite(Number(f.properties?.POBLACION))).sort((a,b)=>Number(b.properties.POBLACION)-Number(a.properties.POBLACION)).slice(0,8);
 const rank=$('populationRank');rank.innerHTML=`<div class="class-summary-title">Localidades con mayor población</div><p class="micro">Selecciona una localidad para ubicarla en el mapa.</p><div class="ranked-localities">${ranked.map((f,i)=>`<button type="button" data-zoom-cpp="${esc(f.properties.CODIGO)}"><span class="rank-num">${i+1}</span><span>${esc(normalizedLabel(f.properties))}</span><strong>${$num(f.properties.POBLACION,0)} hab.</strong></button>`).join('')}</div>`;rank.hidden=false;attachFeatureZoom();
}
function normalizedLabel(p){return p.DESCRIPCIO||p.NOMB_CCPP||p.NOMBRE_REF||p.NOMBRES_II||p.NOMBRE||p.DISTRITO||p.SECTOR||p.nom_poblad||''}
function informativeProperties(p,info){const special=[];
 if(info.id==='centros_pob'){special.push(['Población del centro',($num(p.POBLACION,0)+' hab.')],['Categoría',p.CATEGORIA||'No indicada']);}
 if(distanceClassifications[info.id]){special.push(['Distancia al servicio / vía más cercana',$num(nearKm(info.id,p),3)+' km'],['Clasificación',distanceClassName(info.id,p)]);if(p.NOMBRE_1)special.push(['Establecimiento asociado',p.NOMBRE_1]);}
 if(info.id==='manzanas'){special.push(['Habitantes de la manzana',$num(p.T_TOTAL,0)],['Densidad poblacional',$num(p.DENS_HA,2)+' hab./ha']);}
 if(info.id==='locales_educativos'){special.push(['Nombre del local',p.NOMBRE_REF],['Nivel o niveles',p.NIVELES_LO||p.NIVEL_MAPA]);}
 if(info.id==='salud'){special.push(['Nombre del establecimiento',p.NOMBRE],['Categoría',p.CATEGORIA],['Clasificación',p.CLASIFICAC]);}
 if(info.id==='provincia_estadisticas'){special.push(['Distrito',p.DISTRITO]);if(selectedTopic==='M10')special.push(['Quechua',$num(p.PCT_QUECHUA,2)+' %'],['Castellano',$num(p.PCT_CASTELLANO,2)+' %']);else if(selectedTopic==='M12')special.push(['Estimación reprocesada',$num(p.POB_SIM,2)+' %'],['Grupo robusto Apurímac',p.GRUPO_APU],['Intervalo de confianza',`${$num(p.IC_INF95,2)}–${$num(p.IC_SUP95,2)} %`]);else if(selectedTopic==='M09')special.push(['Densidad poblacional',$num(p.Dens_pob_hab_km2,2)+' hab./km²'],['Densidad vial',$num(p.Dens_vial_km_km2,3)+' km/km²']);}
 if(info.id==='turismo'){special.push(['Tipo',p.TIPO],['Categoría',p.GRUPO_MAPA],['Fuente','MINCETUR, Inventario de Recursos Turísticos']);}
 return special.filter(x=>x[1]!==null&&x[1]!==undefined);
}
function attractivePopup(p,info){const main=normalizedLabel(p)||info.nombre;const important=informativeProperties(p,info);const hasInfo=important.length>0;
 const entries=hasInfo?important:Object.entries(p||{}).filter(([,v])=>v!==null&&v!==undefined&&String(v).trim()!=='').slice(0,7).map(([k,v])=>[k.replaceAll('_',' '),v]);
 const officialLink=info.id==='turismo'&&typeof p.URL_FICHA==='string'&&/^https:\/\/consultasenlinea\.mincetur\.gob\.pe\//.test(p.URL_FICHA)?`<a class="popup-link" href="${esc(p.URL_FICHA)}" target="_blank" rel="noopener noreferrer">Consultar ficha MINCETUR ↗</a>`:'';
 return `<div class="atlas-popup"><span class="popup-eyebrow">${esc(info.nombre)}</span><h3>${esc(main)}</h3>${entries.map(([k,v])=>`<div class="popup-attribute"><span>${esc(k)}</span><strong>${esc(typeof v==='number'?$num(v,3):v)}</strong></div>`).join('')}${officialLink}</div>`;
}
function numericBreaks(features,k){let arr=features.map(f=>Number(f.properties?.[k])).filter(Number.isFinite).sort((a,b)=>a-b);if(!arr.length)return null;
 const lo=arr[0],hi=arr[arr.length-1];if(hi<=lo)return [lo,lo,lo,lo,lo,hi];return [0,1,2,3,4,5].map(i=>lo+(hi-lo)*i/5)}
function colorFor(v,breaks,colors){if(v===null||v===undefined||v===''||!Number.isFinite(Number(v))||!breaks)return '#d5dddd';const n=Number(v);
 for(let i=0;i<5;i++)if(n<=breaks[i+1]||i===4)return colors[i];return colors[4]}
function prepareStyle(info,features){let field=selectedTopic==='M02'&&info.id==='manzanas'?selectedVariable:selectedTopic==='M09'||selectedTopic==='M10'||selectedTopic==='M12'||selectedTopic==='M03'?selectedVariable:(info.id===primaryPref[selectedTopic]&&selectedVariable?selectedVariable:(info.value||info.category));
 if(field==='auto')field=info.value;
 const isGroups=field==='GRUPO_APU', isCat=!isGroups&&info.categorical?.includes(field)&&!info.numeric?.includes(field);
 const palette=selectedTopic==='M10'&&field==='PCT_CASTELLANO'?spanish:selectedTopic==='M12'?copper:sea;
 let br=isGroups?null:selectedTopic==='M12'&&field==='POB_SIM'?[25,35,42,49,55,60]:numericBreaks(features,field);
 const classes=field?Array.from(new Set(features.map(f=>String(f.properties?.[field]??'Sin dato')))).slice(0,20):[];
 const colors=isGroups?['#9D6149','#D3A26B','#9ECDBB']:palette;
 const color=v=>isGroups?(['#9D6149','#D3A26B','#9ECDBB'][Number(v)-1]||'#cbd1d2'):isCat?categoriesColors[Math.max(0,classes.indexOf(String(v)))%categoriesColors.length]:colorFor(v,br,colors);
 let rows=[];
 if(isGroups)rows=[['Grupo 1',colors[0]],['Grupo 2',colors[1]],['Grupo 3',colors[2]]];
 else if(isCat)rows=classes.slice(0,13).map((c,i)=>[c,categoriesColors[i]]);
 else if(br){rows=Array.from({length:5},(_,i)=>[`${$num(br[i])} – ${$num(br[i+1])}`,colors[i]])}
 return {field,color,rows,kind:isCat?'categorical':isGroups?'groups':'numeric'} }
function pointStyle(info,p,prep){const name=info.estilo||'';
 if(distanceClassifications[info.id]){const i=classIndex(info.id,p);return {radius:8.2,color:'#FFFFFF',weight:2.05,fillColor:i<0?'#929C9D':distanceColors[i],fillOpacity:.98};}
 let color=name==='capital'?'#B76A47':name==='health'?'#2C9F97':name==='education'?'#D3A26B':name==='size_points'?'#24779C':'#438F88';
 if(name==='education'){const txt=[p.NIVEL_MAPA,p.NIVELES_LO,p.NIVEL,p.NIVEL_EDU,p.MODALIDAD].filter(Boolean).join(' ').toLowerCase();if(txt.includes('multinivel'))color='#B06D79';else if(txt.includes('inicial'))color='#DBA152';else if(txt.includes('primaria'))color='#277B89';else if(txt.includes('secundaria'))color='#7965A7'}
 const radius=name==='capital'?9:info.id==='centros_pob'?circleRadius(p.POBLACION):selectedTopic==='M11'&&info.id==='centros'?3.5:name==='health'?6.5:name==='education'?6.1:5;
 return {radius,color:info.id==='centros_pob'?'#FFFFFF':'#FFFFFF',weight:info.id==='centros_pob'?2.25:1.5,fillColor:info.id==='centros_pob'?'#227D9D':selectedTopic==='M11'&&info.id==='centros'?'#647C80':color,fillOpacity:selectedTopic==='M11'&&info.id==='centros'?.62:.94};}
function featureLabel(p){return String(normalizedLabel(p)||'')}
function makeLayer(geo,info){if(!map||!geo?.features?.length)return null;
 const prep=prepareStyle(info,geo.features);const type=info.estilo;
 const pane=type==='boundary'?'outlinePane':type==='categories'||type==='choropleth'?'fillPane':type==='river'?'hydroPane':type.startsWith('road_')?'roadPane':'pointPane';
 const sortedGeo=info.id==='centros_pob'?{...geo,features:geo.features.slice().sort((x,y)=>Number(y.properties?.POBLACION||0)-Number(x.properties?.POBLACION||0))}:geo;
 const geolayer=L.geoJSON(sortedGeo,{pane,style:f=>{
   const props=f.properties||{};let s={color:'#6f8c8b',weight:1,fillOpacity:.65,fillColor:prep.color(props[prep.field])};
   if(type==='boundary')return {color:'#183A4B',weight:$('toggleTalavera').checked?3:0,fillOpacity:0};
   if(type==='river')return {color:'#70AEC6',weight:1.25,fillOpacity:0};
   if(type==='road_nacional')return {color:'#C97838',weight:3,fillOpacity:0};
   if(type==='road_departamental')return {color:'#D3A26B',weight:2,fillOpacity:0};
   if(type==='road_vecinal')return {color:'#96A2A5',weight:1.2,fillOpacity:0};
   if(type==='categories')return {...s,weight:.6,fillOpacity:.68};
   if(info.id==='provincia_estadisticas')return {...s,weight:props.UBIGEO==='030216'&&$('toggleTalavera').checked?3:($('toggleDistricts').checked?1:0),color:props.UBIGEO==='030216'&&$('toggleTalavera').checked?'#183A4B':'#728b8b'};
   return s;
 },pointToLayer:(f,ll)=>{
   if(type==='tourism'){
     const src=tourismIcon[f.properties?.GRUPO_MAPA];if(src)return L.marker(ll,{icon:L.icon({iconUrl:'./assets/iconos/'+src,iconSize:[38,38],iconAnchor:[19,35],popupAnchor:[0,-28]})});}
   if(type==='health'){
     const p=f.properties||{};const group=[p.CLASIFICAC,p.TIPO_ESTAB,p.CATEGORIA,p.NOMBRE].filter(Boolean).join(' ').toLowerCase();
     const filename=group.includes('hospital')?'03_hospital_rojo.png':group.includes('puesto')?'01_puesto_salud_turquesa.png':group.includes('centro de salud')?'02_centro_salud_azul.png':null;
     if(filename)return L.marker(ll,{icon:L.icon({iconUrl:'./assets/iconos_salud/'+filename,iconSize:[29,29],iconAnchor:[14,27]})});
   }
   return L.circleMarker(ll,{...pointStyle(info,f.properties||{},prep),pane:'pointPane'});
 },onEachFeature:(f,l)=>{
   const p=f.properties||{};const title=featureLabel(p);
   if(title)l.bindTooltip(esc(title),{sticky:true,direction:'top',opacity:.95});l.bindPopup(attractivePopup(p,info),{maxWidth:310,minWidth:205});
   if(p.CODIGO&&['centros_pob','centros_salud_dist','dist_primaria','dist_secundaria','dist_vial'].includes(info.id))featureIndex.set(String(p.CODIGO),l);
   if(info.id==='centros_pob'&&$('populationLabels').checked&&Number(p.POBLACION)>=300){l.unbindTooltip();l.bindTooltip(esc(title),{permanent:true,direction:'top',offset:[0,-7],className:'population-map-label'});}
   if(distanceClassifications[info.id]){l.unbindTooltip();l.bindTooltip(esc(`${title} · ${distanceClassName(info.id,p)} (${ $num(nearKm(info.id,p),2)} km)`),{sticky:true,direction:'top',opacity:.98,className:'distance-map-tooltip'});}
   if(info.id==='turismo'){tourismFeatureLayers.set(String(p.COD_RECURSO),l);if(p.GRUPO_MAPA!=='Urbano-cultural'){l.unbindTooltip();l.bindTooltip(esc(title),{permanent:true,direction:'top',offset:[0,-22],className:'tourism-map-label'});}}
   l.on('click',()=>{if(info.id==='turismo')selectedResource=String(p.COD_RECURSO);if(p.UBIGEO&&statByCode.has(String(p.UBIGEO))&&['M03','M09','M10','M12'].includes(selectedTopic))detailsDistrict(String(p.UBIGEO));else setDetails([['Nombre',normalizedLabel(p)||info.nombre],...informativeProperties(p,info),...Object.entries(p).filter(([k,v])=>v!==null&&v!==undefined&&!['DESCRIPCIO','NOMBRE'].includes(k)).slice(0,5).map(([k,v])=>[k.replaceAll('_',' '),typeof v==='number'?$num(v):v])]);});
 }}).addTo(map);
 mapLayers.push(geolayer);loadedFeatures.push(...geo.features.map(f=>({...f,properties:{...f.properties,'CAPA_ORIGEN':info.nombre}})));
 return prep;}
async function drawLayers(){const serial=++activeRender;clearMap();showMessage('');$('classSummary').hidden=true;$('classSummary').innerHTML='';$('populationRank').hidden=true;
 const order=id=>{const o=manifest.capas[id];const t=o?.estilo||'';return t==='choropleth'||t==='categories'?10:t==='river'?20:t.startsWith('road_')?30:t==='boundary'?55:t==='capital'?60:t==='tourism'?80:t==='health'||t==='education'?65:45};
 const ids=themeRows().filter(id=>currentLayers.has(id)).sort((a,b)=>order(a)-order(b));tourismFeatureLayers.clear();const results=await Promise.all(ids.map(id=>getJSON(manifest.capas[id].path)));
 if(serial!==activeRender)return;
 let primaryLegend=null,hasShape=false;
 for(let i=0;i<ids.length;i++){
   const info=manifest.capas[ids[i]],json=results[i];if(!json?.features?.length)continue;
   let features=json;
   if(selectedTopic==='M11'&&ids[i]==='turismo'&&$('category').value!=='Todos')features={...json,features:json.features.filter(f=>f.properties?.GRUPO_MAPA===$('category').value)};
   if(distanceClassifications[ids[i]]&&$('proximityFilter').value!=='all')features={...json,features:json.features.filter(f=>classIndex(ids[i],f.properties||{})===Number($('proximityFilter').value))};
   if(!features.features.length)continue;
   hasShape=true;const p=makeLayer(features,info);
   if(ids[i]===primaryPref[selectedTopic])primaryLegend={prep:p,info};
 }
 if(serial!==activeRender)return;
 if(selectedTopic==='M08')for(const r of (manifest.rasters||[])){
   if(!currentLayers.has('raster_'+r.id))continue;
   try{const o=L.imageOverlay('./'+r.path,r.bounds,{opacity:.78,interactive:false,pane:'rasterPane'}).addTo(map);rasterLayers.push(o);hasShape=true;
       primaryLegend={raster:r};}
   catch(e){console.error(e)}
 }
 if(hasShape){if(primaryLegend?.raster){legend(primaryLegend.raster.legend.map(c=>[c.name,c.color]),'Valores originales del ráster','Categorías cotejadas con la lámina A3 M08. Código 0: exterior/sin datos.')}
 else if(selectedTopic==='M02'&&currentLayers.has('centros_pob')){const geo=results[ids.indexOf('centros_pob')];populationLegend(geo?.features||[])}
 else if(['M04','M05','M07'].includes(selectedTopic)){const found=ids.find(id=>distanceClassifications[id]);if(found){const geo=results[ids.indexOf(found)];distanceLegend(found,geo?.features||[]);}else legend(ids.map(k=>[manifest.capas[k].nombre, '#438F88']),'Capas de referencia','Selecciona una vista de proximidad para comparar las distancias.');}
 else if(selectedTopic==='M11')legend([['Patrimonio urbano (2)','#438F88'],['Sitio arqueológico (1)','#D3A26B'],['Sitio natural (1)','#587E59'],['Festividad (1)','#805A9F']],'Recursos turísticos · MINCETUR','Selecciona un recurso en el mapa o en las tarjetas de exploración.');
 else if(primaryLegend?.prep?.rows?.length&&['choropleth','categories'].includes(primaryLegend.info.estilo))legend(primaryLegend.prep.rows,primaryLegend.prep.field||'Categorías','Clasificación del visor; contrastar con la lámina A3 original.');
 else {const colorStyles={boundary:'#183A4B',capital:'#183A4B',points:'#438F88',size_points:'#C97838',river:'#70AEC6',health:'#2C9F97',education:'#D3A26B',road_nacional:'#C97838',road_departamental:'#D3A26B',road_vecinal:'#96A2A5'};
   legend(ids.map(k=>[manifest.capas[k].nombre,colorStyles[manifest.capas[k].estilo]||'#438F88']),'Capas territoriales','Haz clic en las entidades para consultar sus atributos.');}
 fit();activeData={type:'FeatureCollection',features:loadedFeatures};}
 else{activeData=null;legend([],'Cartografía pendiente','Las estadísticas disponibles se muestran en el panel.');
     showMessage('Los indicadores y la lámina original están disponibles. Para dibujar las geometrías de este mapa en GitHub Pages, ejecuta el exportador incluido con tus GeoParquet reales (consulta README).');}
}

async function renderTourismCards(){if(selectedTopic!=='M11')return;
 const fc=await getJSON('data/m11_recursos.geojson');if(selectedTopic!=='M11'||!fc?.features)return;
 const facts=fc.features.map(f=>{const p=f.properties||{};return {id:String(p.COD_RECURSO),name:p.NOMBRE,category:p.GRUPO_MAPA,type:p.TIPO,url:p.URL_FICHA,coordinates:f.geometry.coordinates};});
 $('resourceStrip').innerHTML=facts.map((r,i)=>`<button type="button" class="resource-pill" data-tour-id="${esc(r.id)}"><span class="resource-index">${i+1}</span><span class="resource-text"><strong>${esc(r.name)}</strong><small>${esc(r.category)}</small></span><span class="resource-arrow">↗</span></button>`).join('');$('resourceStrip').hidden=false;
 $('tourismExplorer').innerHTML=`<div class="eyebrow">Guía interactiva · MINCETUR</div><h3 class="tour-heading">Descubre los cinco recursos</h3><p class="micro">Selecciona una tarjeta para acercarte al lugar y consultar su ficha. Los puntos son registros del inventario, no rutas verificadas.</p><div class="tour-summary"><div><strong>2</strong><small>Patrimonio urbano</small></div><div><strong>1</strong><small>Arqueológico</small></div><div><strong>1</strong><small>Natural</small></div><div><strong>1</strong><small>Festividad</small></div></div><div class="tour-tools"><button class="button subtle" id="tourAll" type="button">Ver todo Talavera</button><button class="button subtle" id="tourUrban" type="button">Acercar plaza y templo</button></div><div class="tour-cards">${facts.map(p=>`<button class="tour-card" type="button" data-tour-id="${esc(p.id)}"><span class="tour-icon" style="background:${tourismColors[p.category]||'#438F88'}25"><img src="./assets/iconos/${tourismIcon[p.category]||'01_urbano_cultural_128px.png'}" alt="" loading="lazy"/></span><span><b>${esc(p.name)}</b><small>${esc(p.category)} · ${esc(p.type||'')}</small></span><span class="tour-card-arrow">›</span></button>`).join('')}</div>`;
 $('tourAll').onclick=()=>fit();$('tourUrban').onclick=()=>{if(map)map.flyTo([-13.65372,-73.42867],16,{duration:.8});};
 document.querySelectorAll('[data-tour-id]').forEach(btn=>btn.onclick=()=>{const p=facts.find(x=>x.id===btn.dataset.tourId);if(!p)return;selectedResource=p.id;
 if(map){map.flyTo([p.coordinates[1],p.coordinates[0]],p.category==='Urbano-cultural'?16:14,{duration:.8});const layer=tourismFeatureLayers.get(p.id);if(layer)layer.openPopup();}
 const feature=fc.features.find(f=>String(f.properties.COD_RECURSO)===p.id);setDetails([['Recurso',p.name],['Tipo',p.type],['Categoría',p.category],['Fuente','MINCETUR'],['Coordenadas',`${$num(p.coordinates[1],6)}°, ${$num(p.coordinates[0],6)}°`]]);
 document.querySelectorAll('[data-tour-id]').forEach(el=>el.classList.toggle('selected',el.dataset.tourId===btn.dataset.tourId));});
 $('tourismExplorer').hidden=false;
}
function renderTopic(){const row=catalog.find(x=>x[0]===selectedTopic);if(!row)return;
 $('themeCode').textContent=row[0];$('themeTitle').textContent=row[1];$('themeSubtitle').textContent=row[2]+' · Distrito de Talavera, Andahuaylas, Apurímac';
 $('insightTitle').textContent=row[1];$('insightDescription').textContent=themes[selectedTopic].desc;
 $('sourceInfo').textContent='Fuentes: '+themes[selectedTopic].source;
 $('mapThumb').src='./assets/laminas/'+selectedTopic+'.jpg';
 $('mapThumb').alt='Lámina de referencia '+selectedTopic;
 $('mapThumb').onerror=()=>{$('mapThumb').style.display='none'};
 $('mapThumb').onload=()=>{$('mapThumb').style.display='block'};
 setMetrics(themes[selectedTopic].metrics);$('classSummary').hidden=true;$('classSummary').innerHTML='';$('populationRank').hidden=true;$('tourismExplorer').hidden=selectedTopic!=='M11';$('resourceStrip').hidden=selectedTopic!=='M11';showMessage('');setDetails([['Consulta','Selecciona una entidad del mapa o un distrito en el panel lateral']]);nav();layerCheckboxes();setupView();setupVars();setupCategory();setupProximityFilter();updateMapGuide();statisticsPanel();renderTourismCards();showUrbanInset();drawLayers();}
function preview(){const row=catalog.find(x=>x[0]===selectedTopic);$('modalTitle').textContent=row[0]+' · '+row[1];const img='./assets/laminas/'+selectedTopic+'.jpg';
 const isGenerated=['M10','M11','M12'].includes(selectedTopic);
 $('modalBody').innerHTML=`<img src="${img}" alt="${isGenerated?'Mapa de apoyo web':'Lámina cartográfica original'} ${selectedTopic}"/><p>${isGenerated?'Vista cartográfica de apoyo construida con los datos espaciales del atlas. No reemplaza las láminas A3 originales.':'Lámina de referencia del atlas académico.'}</p>`;
 $('modal').showModal()}
function downloadGeoJSON(){if(!activeData?.features?.length){showMessage('Para descargar una capa espacial necesitas primero ejecutar el exportador con tus GeoParquet locales.');return}
 const blob=new Blob([JSON.stringify(activeData)],{type:'application/geo+json'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download='Talavera_'+selectedTopic+'_capas_activas.geojson';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000)}
function search(){const query=$('search').value.trim().toLocaleLowerCase('es');if(!query)return;
 if(['M03','M09','M10','M12'].includes(selectedTopic)){
   const item=stats.find(x=>x.DISTRITO.toLocaleLowerCase('es').includes(query));if(item){detailsDistrict(item.UBIGEO);
   const geo=geoCache.get('data/distritos_20.geojson');const feature=geo?.features?.find(f=>f.properties?.UBIGEO===item.UBIGEO);if(feature&&map){const bounds=L.geoJSON(feature).getBounds();if(bounds.isValid())map.fitBounds(bounds.pad(.2))}}return;
 }
 for(const f of loadedFeatures){if(featureLabel(f.properties).toLocaleLowerCase('es').includes(query)&&f.geometry){let lyr=L.geoJSON(f);if(map&&lyr.getBounds().isValid()){map.fitBounds(lyr.getBounds().pad(.25),{maxZoom:14});setDetails(Object.entries(f.properties).slice(0,12));return}}}
}
function about(){ $('modalTitle').textContent='Acerca del Atlas Geográfico-Social de Talavera';
 $('modalBody').innerHTML='<p>Proyecto académico de Geografía Humana, UNMSM (2026-II), autor: Piero Morales.</p><p>Incluye fuentes INEI, MTC, MINEDU, MINSA/SUSALUD, MINAM, MIDAGRI, INGEMMET y MINCETUR. Los datos proceden de diferentes años y escalas; los atributos se presentan sin inventar desagregación geográfica.</p><p>Esta web de GitHub Pages comparte una identidad visual con el Atlas Lima–Satipo. Las herramientas avanzadas de edición cartográfica permanecen en la aplicación Python.</p><p>Las distancias Near no son recorridos ni tiempos de viaje. M08 representa susceptibilidad, no riesgo. La estimación POB_SIM del M12 es un reprocesamiento de simulaciones del INEI, no una cifra puntual publicada en el Anexo.</p>';$('modal').showModal()}
async function init(){initMap();
 const [m,s]=await Promise.all([getJSON('data/catalogo_capas.json'),getJSON('data/estadisticas_20.json')]);
 manifest=m||{capas:{},temas:{},rasters:[]};stats=Array.isArray(s)?s:[];if(!m||Object.keys(manifest.capas||{}).length<20)showMessage('No se cargó el catálogo completo V9. Comprueba que abriste esta carpeta desde el servidor HTTP correcto.');statByCode=new Map(stats.map(x=>[String(x.UBIGEO),x]));
 $('qualityStatus').textContent=`V9 · ${stats.length} distritos en tablas · ${Object.keys(manifest.capas||{}).length} capas espaciales preparadas · ${(manifest.rasters||[]).length} rásteres. ${Object.keys(manifest.capas||{}).length<=1?'Ejecuta el exportador para habilitar las capas M01–M10 y M12.':''}`;
 renderTopic();
 $('enterAtlas').onclick=()=>{$('landing').classList.add('hidden');$('landing').setAttribute('aria-hidden','true');if(map)setTimeout(()=>map.invalidateSize(),100)};
 $('openHome').onclick=()=>{$('landing').classList.remove('hidden');$('landing').removeAttribute('aria-hidden')};
 $('openAbout').onclick=about;$('landingAbout').onclick=about;$('closeModal').onclick=()=>$('modal').close();
 $('showOriginal').onclick=preview;$('showOriginal2').onclick=preview;
 $('basemap').onchange=baseChange;$('fit').onclick=fit;$('download').onclick=downloadGeoJSON;
 $('variable').onchange=()=>{selectedVariable=$('variable').value;statisticsPanel();drawLayers()};
 $('category').onchange=()=>drawLayers();$('viewMode').onchange=changeView;$('proximityFilter').onchange=drawLayers;$('populationLabels').onchange=drawLayers;$('urbanInsetCard').onclick=()=>{if(selectedTopic==='M11'&&map)map.flyTo([-13.65372,-73.42867],16,{duration:.8});};
 $('districtSelect').onchange=()=>{const code=$('districtSelect').value;detailsDistrict(code);let geo=geoCache.get('data/distritos_20.geojson');let f=geo?.features?.find(x=>x.properties?.UBIGEO===code);if(f&&map){const b=L.geoJSON(f).getBounds();if(b.isValid())map.fitBounds(b.pad(.2))}};
 $('search').oninput=search;
 $('toggleLegend').onclick=()=>$('legend').hidden=!$('legend').hidden;
 $('toggleTalavera').onchange=()=>drawLayers();$('toggleDistricts').onchange=()=>drawLayers();
 $('mobileMenu').onclick=()=>{const opened=$('sidebar').classList.toggle('open');$('mobileMenu').setAttribute('aria-expanded',String(opened))};
}
window.addEventListener('DOMContentLoaded',init);
