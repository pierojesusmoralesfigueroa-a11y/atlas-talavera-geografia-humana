#!/usr/bin/env python3
"""Compila las capas GeoParquet locales en GeoJSONs públicos para Atlas Talavera.

Solo procesa los archivos reales reportados en la conversión 69/69. No inventa
geometrías, atributos ni clases de riesgo. Mantiene intactas las fuentes.

Uso:
 py tools/exportar_atlas_completo.py --raiz "C:\\...\\05_VISOR_GEOPARQUET"
 py tools/exportar_atlas_completo.py --raiz "..." --masa "C:\\...\\masa.tif" --inundacion "C:\\...\\inundacion.tif"

Geometrías se convierten a EPSG:4326; simplificación exclusivamente en la copia
web con UTM 18S y validación de área. Verificar derechos de redistribución.
"""
from __future__ import annotations
import argparse
import csv
import json
import math
import re
import sys
from collections import Counter
from datetime import datetime, timezone
from pathlib import Path

ROOT=Path(__file__).resolve().parent.parent
DATA=ROOT/'data'
CAPAS=DATA/'capas'
REPORT=DATA/'reporte_conversion_original.csv'
CAPAS.mkdir(parents=True,exist_ok=True)

# Cada una es una capa del reporte, seleccionada de manera no ambigua por su ruta.
# No se publican todos los originales: se eligen capas finales del atlas o las de
# contexto que realmente enriquecen el mapa (con recortes espaciales controlados).
SPECS=[
# id, etiqueta, ruta exacta o final único dentro del reporte, temas, estilo, encuadre
('limite','Límite distrital de Talavera','M01_Localizacion_y_centros_poblados/01_CAPAS_PROCESADAS/dist_talavera/Dist_talavera.parquet','M01 M02 M04 M05 M06 M07 M08','boundary','talavera'),
('capital','Capital distrital','M01_Localizacion_y_centros_poblados/01_CAPAS_PROCESADAS/capital_talavera/Capital_talavera.parquet','M01 M02 M06 M07','capital','talavera'),
('centros','Centros poblados','M01_Localizacion_y_centros_poblados/01_CAPAS_PROCESADAS/centros_poblados_talavera/centros_poblados_talavera.parquet','M01','points','talavera'),
('centros_pob','Centros poblados (población)','M02_Distribucion_y_concentracion_de_poblacion/01_CAPAS_PROCESADAS/centros_poblados_talavera/centros_poblados_talavera_mapa_2.parquet','M02','size_points','talavera'),
('manzanas','Manzanas urbanas y población','M02_Distribucion_y_concentracion_de_poblacion/01_CAPAS_PROCESADAS/Manzanas_talavera/manzanas_talavera.parquet','M02','choropleth','talavera'),
('hidrografia','Ríos y quebradas','M01_Localizacion_y_centros_poblados/01_CAPAS_PROCESADAS/red_hidrografica_talavera/red_hidrografica_talavera.parquet','M01 M04 M06 M07 M08','river','talavera'),
('vias_nacionales','Red vial nacional','M01_Localizacion_y_centros_poblados/01_CAPAS_PROCESADAS/Vias_talavera/Red_nacional_talavera.parquet','M01 M07','road_nacional','talavera'),
('vias_departamentales','Red vial departamental','00_COMPARTIDOS/03_RED_VIAL/Red_vial_departamental/red_vial_departamental_dic20.parquet','M01 M07','road_departamental','talavera'),
('vias_vecinales','Red vial vecinal','M01_Localizacion_y_centros_poblados/01_CAPAS_PROCESADAS/Vias_talavera/red_vecinal_talavera.parquet','M01 M07','road_vecinal','talavera'),
('sexo_distritos','Población por sexo (20 distritos)','M03_Sexo_y_grupos_de_edad/01_CAPAS_PROCESADAS/poblacion_sexo_andahuaylas/M03_Poblacion_Sexo_2017.parquet','M03','choropleth','provincia'),
('centros_salud_dist','Centros poblados · proximidad sanitaria','M04_Salud_y_proximidad/02_CAPAS_PROCESADAS/Centros_poblados_zona_18/centros_poblados_zona_18_talavera.parquet','M04','size_points','talavera'),
('salud','Establecimientos de salud (área de influencia)','M04_Salud_y_proximidad/02_CAPAS_PROCESADAS/establecimientos_salud_UTM18S/establecimiento_salud.parquet','M04','health','entorno'),
('locales_educativos','Locales educativos de Talavera','M05_Educacion_y_proximidad/01_CAPAS_PROCESADAS/Locales_educativos_talavera/Locales_educativos.parquet','M05','education','talavera'),
('dist_primaria','Centros poblados · distancia a primaria','M05_Educacion_y_proximidad/01_CAPAS_PROCESADAS/Centros_poblados_cerca_primaria/centros_primaria.parquet','M05','size_points','talavera'),
('dist_secundaria','Centros poblados · distancia a secundaria','M05_Educacion_y_proximidad/01_CAPAS_PROCESADAS/Centros_poblados_cerca_secundaria/centros_poblados_secundaria.parquet','M05','size_points','talavera'),
('cobertura_vegetal','Cobertura vegetal','M06_Cobertura_vegetal_y_superficie_agricola/01_CAPAS_PROCESADAS/Cobertura_vegetal/M06_Cobertura_Talavera.parquet','M06','categories','talavera'),
('sectores_agricolas','Sectores agrícolas','M06_Cobertura_vegetal_y_superficie_agricola/01_CAPAS_PROCESADAS/Superficie_agricola_sectorial/sup_agricola_sectorial.parquet','M06','categories','talavera'),
('dist_vial','Centros poblados · proximidad a vías','M07_Jerarquia_y_proximidad_vial/01_CAPAS_PROCESADAS/Centros_poblados_dist/centros_poblados_dist.parquet','M07','size_points','talavera'),
('centros_susceptibilidad','Centros poblados de referencia','M07_Jerarquia_y_proximidad_vial/01_CAPAS_PROCESADAS/centros_poblados_talavera/centros_poblados_talavera_mapa_2.parquet','M08','points','talavera'),
]
# Variables prioritarias por nombre. Se detectan solo si existen en el archivo;
# no se asigna nombre de variable a una columna desconocida.
PREF={
 'manzanas':['DENS_HA','DENS_HAB','DENSIDAD','DENS','POB_TOT','POB_TOTAL','TOTAL'],
 'sexo_distritos':['DENS_HAB','DENSIDAD','MUJERES','HOMBRES','POBLACION','POB_TOTAL'],
 'centros_pob':['POB_TOTAL','POBLACION','TOTAL_POB','CENSO','HAB'],
 'centros_salud_dist':['NEAR_DIST','DISTANCIA','DIST','DNEAR'],
 'dist_primaria':['NEAR_DIST','DISTANCIA','DIST','DNEAR'],
 'dist_secundaria':['NEAR_DIST','DISTANCIA','DIST','DNEAR'],
 'dist_vial':['NEAR_DIST','DISTANCIA','DIST','DNEAR'],
}
CAT_PREF={
 'cobertura_vegetal':['COBERTURA','TIPO','DESCRIPCION','NOMBRE','LEYENDA','CATEGORIA','CLASE'],
 'sectores_agricolas':['SECTOR','NOMBRE','CATEGORIA','USO','TIPO'],
 'locales_educativos':['NIVEL','TIPO','MODALIDAD','SERVICIO'],
 'salud':['TIPO','CATEGORIA','NIVEL','CLASIFICACION'],
}
KEEP_PATTERNS=[r'^UBIGEO$',r'^DISTRITO$',r'^NOM',r'^DESC',r'^ETIQUETA',r'^DEN',r'^POB',r'^TOTAL',r'^HOM',r'^MUJ',r'^NEAR',r'^DIST',r'^CATEG',r'^TIPO',r'^NIVEL',r'^MODAL',r'^GESTION',r'^SERV',r'^COB',r'^USO',r'^LEYENDA',r'^SECTOR',r'^AREA',r'^LONG',r'^LOC',r'^COD',r'^ID',r'^NAME',r'^CLAS',r'^FUENTE',r'^CENTRO',r'^INSTIT',r'^GRUPO']

def norm_code(v):
    s=str(v or '').strip(); s=s[:-2] if s.endswith('.0') else s
    return s.zfill(6)

def reader(p):
    with p.open(encoding='utf-8-sig',newline='') as f:return list(csv.DictReader(f))

def write_json(p,obj):
    p.parent.mkdir(parents=True,exist_ok=True)
    p.write_text(json.dumps(obj,ensure_ascii=False,separators=(',',':'),allow_nan=False),encoding='utf-8')

def num(v):
    try:
        z=float(v)
        return z if math.isfinite(z) else None
    except (ValueError,TypeError):return None

def typed(value):
    if value is None:return None
    if isinstance(value,bool):return value
    if hasattr(value,'item'):
        try:value=value.item()
        except Exception:pass
    if isinstance(value,(float,int)):
        return value if math.isfinite(value) else None
    s=str(value).strip()
    return None if s.lower() in ('','none','nan','nat','<na>') else s

def first_field(keys,preferences):
    pairs=[(str(k).upper(),k) for k in keys]
    for pattern in preferences:
        for up,k in pairs:
            if up==pattern or (len(pattern)>4 and up.startswith(pattern)):return k
    return None

def fields_to_export(gdf,chosen,category=None):
    # Otros atributos potencialmente necesarios para consultas. Limitar tamaño y
    # evitar cadenas inmensas o textos innecesarios de capas nacionales.
    out=[]
    for k in (chosen,category):
        if k is not None and k!='geometry' and k in gdf.columns and k not in out:out.append(k)
    for k in gdf.columns:
        if k=='geometry':continue
        if k not in out and any(re.match(p,str(k),re.I) for p in KEEP_PATTERNS):out.append(k)
    return out[:44]

def build_districts(base):
    # Base completa de 20 distritos: enriquecerla con las tres tablas de atributos.
    rows9=reader(DATA/'M09_comparacion_20_distritos.csv')
    rows10=reader(DATA/'M10_lengua_20_distritos.csv')
    rows12=reader(DATA/'M12_pobreza_20_distritos.csv')
    tables=[{norm_code(r['UBIGEO']):r for r in rows} for rows in (rows9,rows10,rows12)]
    if not all(len(t)==20 for t in tables):raise ValueError('Las tablas distritales no tienen 20 códigos únicos')
    if not all(set(t)==set(tables[0]) for t in tables):raise ValueError('Los UBIGEO de las tablas distritales no coinciden')
    output=[]
    for key in sorted(tables[0]):
        p={'UBIGEO':key,'DISTRITO':tables[0][key]['Distrito']}
        for t in tables:
            for k,v in t[key].items():
                if k.upper() in ('UBIGEO','DISTRITO'):continue
                z=num(v);p[k]=z if z is not None else (v or '')
        output.append(p)
    write_json(DATA/'estadisticas_20.json',output)
    return {r['UBIGEO']:r for r in output}

def shape_to_json(base,filename,kind,clip,group,limit_geom,simplify_m):
    import geopandas as gpd
    from shapely.geometry import mapping
    if not filename.exists():raise FileNotFoundError(filename)
    gdf=gpd.read_parquet(filename)
    if gdf.crs is None:raise ValueError('Capa sin CRS (no se asigna CRS supuesto)')
    total=len(gdf)
    gdf=gdf.loc[gdf.geometry.notna() & ~gdf.geometry.is_empty].copy()
    # Hay puntos sanitarios fuera del ámbito de Talavera con coordenadas
    # no finitas o fuera de la zona UTM 18S. Filtrar ANTES de reproyectar
    # evita GEOSException durante make_valid y no altera los puntos locales.
    import numpy as np
    finite=np.isfinite(gdf.geometry.bounds.to_numpy()).all(axis=1)
    gdf=gdf.loc[finite].copy()
    if clip!='provincia' and limit_geom is not None:
        m=limit_geom if clip=='talavera' else limit_geom.buffer(12000)
        clip_in_crs=gpd.GeoSeries([m],crs='EPSG:32718').to_crs(gdf.crs).iloc[0]
        gdf=gdf.loc[gdf.geometry.intersects(clip_in_crs)].copy()
    if gdf.empty:raise ValueError('No hay geometrías locales válidas en este conjunto')
    gdf=gdf.to_crs('EPSG:32718')
    finite_utm=np.isfinite(gdf.geometry.bounds.to_numpy()).all(axis=1)
    gdf=gdf.loc[finite_utm].copy()
    invalid=~gdf.geometry.is_valid
    if invalid.any():
        # Los puntos no válidos se excluyen; los polígonos pueden repararse.
        poly=gdf.geom_type.str.contains('Polygon|LineString')
        gdf=gdf.loc[~invalid | poly].copy()
        invalid=~gdf.geometry.is_valid
        if invalid.any():gdf.loc[invalid,'geometry']=gdf.loc[invalid,'geometry'].make_valid()
    if clip!='provincia' and limit_geom is not None:
        gdf=gpd.clip(gdf,m,keep_geom_type=True)
    if len(gdf)==0:raise ValueError('Después del recorte no quedaron elementos')
    # Limitar complejidad poligonal: 14m se aplica a polígonos/lineas; no puntos.
    if simplify_m and gdf.geom_type.str.contains('Polygon|LineString').any():
        mask=gdf.geom_type.str.contains('Polygon|LineString')
        gdf.loc[mask,'geometry']=gdf.loc[mask,'geometry'].simplify(float(simplify_m),preserve_topology=True)
    numeric=[];categorical=[]
    for col in gdf.columns:
        if col=='geometry':continue
        if col.upper() in {'OBJECTID','OID','FID','ESRI_OID','ID','CODIGO','UBIGEO','CCDD','CCPP','CCDI'}:continue
        series=gdf[col]
        if len(series)==0:continue
        numeric_type=series.dtype.kind in 'iuf'
        if numeric_type and series.notna().sum()>0 and series.nunique(dropna=True)>1:
            numeric.append(str(col))
        elif 1<series.nunique(dropna=True)<=18 and series.dtype.kind in 'OU':
            categorical.append(str(col))
    chosen=first_field(numeric,PREF.get(group,[]))
    if chosen is None and numeric:chosen=numeric[0]
    cat=first_field(categorical,CAT_PREF.get(group,[]))
    if group=='sectores_agricolas' and 'SECTOR' in categorical:cat='SECTOR'
    if cat is None and categorical:cat=categorical[0]
    available=fields_to_export(gdf,chosen,cat)
    numeric=[k for k in numeric if k in available]
    categorical=[k for k in categorical if k in available]
    # Para mapas socioeconómicos no se usan geometrías derivadas de imagen: solamente origen SIG.
    gdf=gdf.to_crs('EPSG:4326')
    feats=[]
    for _,r in gdf.iterrows():
        prop={k:typed(r[k]) for k in available}
        f={'type':'Feature','geometry':mapping(r.geometry),'properties':prop}
        feats.append(f)
    target=CAPAS/(group+'.geojson')
    write_json(target,{'type':'FeatureCollection','features':feats})
    return {'path':'data/capas/'+group+'.geojson','count':len(feats),'original':total,
            'numeric':numeric[:20],'categorical':categorical[:20],
            'value':chosen if chosen in available else None,
            'category':cat if cat in available else None,
            'attributes':available,'size_kb':round(target.stat().st_size/1024)}

def generate_raster(path,tag,limite,classes,dim=1500):
    """Raster web: clases originales preservadas como valores, sin renombrar.
    PNG discreto transparente, enmascarado al límite y con bounds lat/lon.
    Solo se ejecuta si el usuario entrega un GeoTIFF válido.
    """
    import numpy as np
    import rasterio
    from rasterio.mask import mask
    from rasterio.warp import reproject, Resampling, calculate_default_transform
    from rasterio.enums import ColorInterp
    from shapely.geometry import mapping
    from PIL import Image
    src=Path(path)
    if not src.is_file():raise FileNotFoundError(src)
    with rasterio.open(src) as ds:
        if ds.crs is None:raise ValueError('Ráster sin CRS: '+str(src))
        import geopandas as gpd
        ls=gpd.GeoSeries([limite],crs='EPSG:32718').to_crs(ds.crs)
        arr,transform=mask(ds,[mapping(ls.iloc[0])],crop=True,filled=False)
        a=arr[0]; height,width=a.shape
        if width<1 or height<1:raise ValueError('Ráster vacío '+tag)
        # Copy to WGS84 for Leaflet ImageOverlay; nearest neighbor for categorical data.
        left,top=transform*(0,0);right,bottom=transform*(width,height)
        outtrans,ow,oh=calculate_default_transform(ds.crs,'EPSG:4326',width,height,left,bottom,right,top)
        scale=max(ow/dim,oh/dim,1)
        ow=max(1,round(ow/scale));oh=max(1,round(oh/scale))
        from affine import Affine
        outtrans=outtrans*Affine.scale(scale,scale)
        # nodata sentinel (independent of source coding)
        source=np.asarray(a.astype(np.float32).filled(-999999),dtype=np.float32)
        out=np.full((oh,ow),-999999,dtype=np.float32)
        reproject(source,destination=out,src_transform=transform,src_crs=ds.crs,
                  src_nodata=-999999,dst_transform=outtrans,dst_crs='EPSG:4326',
                  dst_nodata=-999999,resampling=Resampling.nearest)
        good=np.isfinite(out)&(out!=-999999)&(out!=0)
        unique=np.unique(out[good])
        if len(unique)>18:
            raise ValueError(f'{tag}: {len(unique)} valores diferentes: parece continuo, no categórico. Se requiere configurar una clasificación verificada antes de publicarlo.')
        colors=['#E7F4ED','#B8DDCF','#7ABCB0','#438F88','#183A4B','#D3A26B','#B67C58','#805A9F','#6FBAD1','#496B5C','#8C96A7','#C98755','#D6BAC1','#9EBEBD','#7F7059','#E8D4AE','#5A7594','#AC9575']
        rgba=np.zeros((oh,ow,4),dtype=np.uint8)
        legend=[]
        def rgb(col):return tuple(int(col[i:i+2],16) for i in (1,3,5))
        for i,value in enumerate(unique.tolist()):
            color=colors[i];rgba[out==value,:3]=rgb(color);rgba[out==value,3]=205
            legend.append({'value':int(value) if float(value).is_integer() else value,'name':f'Valor {value:g} (sin clase verificada)','color':color})
        target=DATA/'rasters'/f'{tag}.png';target.parent.mkdir(exist_ok=True)
        Image.fromarray(rgba,'RGBA').save(target,optimize=True)
        w=outtrans.c; n=outtrans.f;e=w+outtrans.a*ow;s=n+outtrans.e*oh
        return {'id':tag,'nombre':'Susceptibilidad a movimientos en masa' if tag=='masa' else 'Susceptibilidad a inundación',
                'path':f'data/rasters/{tag}.png','bounds':[[s,w],[n,e]],'legend':legend,
                'source':str(src.name),'note':'Colores web provisionales: los códigos del ráster aún no se vincularon con las categorías de la leyenda original.'}

def main():
    p=argparse.ArgumentParser(description='Exportar todos los mapas vectoriales disponibles de Talavera a GitHub Pages')
    p.add_argument('--raiz',type=Path,required=True,help='05_VISOR_GEOPARQUET con carpetas 00_COMPARTIDOS y 02_MAPAS')
    p.add_argument('--simular',action='store_true',help='Solo detectar archivos y mostrar plan, sin exportar capas')
    p.add_argument('--masa',type=Path,help='GeoTIFF categórico de susceptibilidad a movimientos en masa')
    p.add_argument('--inundacion',type=Path,help='GeoTIFF categórico de susceptibilidad a inundación')
    p.add_argument('--simplificar-m',type=float,default=10,help='Tolerancia visual para copia web: metros')
    args=p.parse_args()
    base=args.raiz.expanduser()
    if not base.is_dir():raise SystemExit('No existe carpeta GeoParquet: '+str(base))
    rep=reader(REPORT)
    found={r['geoparquet'].replace('\\','/'):r for r in rep if r.get('estado')=='OK'}
    missing=[]
    for sid,name,rel,ts,kind,clip in SPECS:
        paths=[r for r in found if r.endswith(rel)]
        if len(paths)!=1:missing.append(f'{sid}: inventario no identifica ruta única {rel}');continue
        local=base/paths[0]
        if not local.is_file():missing.append(f'{sid}: no existe {local}')
        else:print(f'[ENCONTRADO] {sid} ({found[paths[0]]["salida"]} entidades)')
    if args.simular:
        print('Faltantes:',len(missing));print('\n'.join(missing));return
    try:
        import geopandas as gpd
    except ImportError:raise SystemExit('Instala: py -m pip install geopandas pyarrow pyogrio shapely rasterio pillow')
    limitpath=base/'02_MAPAS/M01_Localizacion_y_centros_poblados/01_CAPAS_PROCESADAS/dist_talavera/Dist_talavera.parquet'
    if not limitpath.exists():raise SystemExit('Falta el límite distrital real de M01: '+str(limitpath))
    limite=gpd.read_parquet(limitpath)
    if limite.crs is None or len(limite)!=1:raise SystemExit('Límite inválido (CRS o cantidad de polígonos).')
    limit=limite.to_crs('EPSG:32718').geometry.iloc[0]
    stats=build_districts(base)
    manifest={'version':'5.0','generado_utc':datetime.now(timezone.utc).isoformat(),
              'origen':'GeoParquet local: reporte_conversion.csv','capas':{},'temas':{f'M{i:02d}':[] for i in range(1,13)},'rasters':[],
              'errores':[],'advertencias':['M08: códigos raster deben contrastarse con las clases de la lámina original.',
              'La distancia Near es euclidiana, no accesibilidad por carretera.','Las cifras de pobreza POB_SIM son reprocesadas y mantienen incertidumbre estadística.']}
    for sid,name,rel,topics,style,clip in SPECS:
        paths=[r for r in found if r.endswith(rel)]
        if len(paths)!=1:continue
        local=base/paths[0]
        if not local.exists():continue
        try:
            info=shape_to_json(base,local,style,clip,sid,limit,args.simplificar_m)
            info.update({'id':sid,'nombre':name,'estilo':style,'origen':paths[0]})
            manifest['capas'][sid]=info
            for t in topics.split():manifest['temas'][t].append(sid)
            print(f'[OK] {sid}: {info["count"]} registros web, {info["size_kb"]} KiB')
        except Exception as e:
            manifest['errores'].append({'capa':sid,'error':str(e)})
            print(f'[ERROR] {sid}: {e}')
    # Fuente cartográfica provincial más datos estadísticos verificados.
    dp='02_MAPAS/M09_Comparacion_provincial_de_densidad_poblacional_y_vial/01_CAPAS_PROCESADAS/Dens_hab_andahuaylas/Dens_hab_andahuaylas.parquet'
    poly=base/dp
    if poly.is_file():
        try:
            districts=gpd.read_parquet(poly)
            if districts.crs is None:raise ValueError('CRS no definido en M09')
            u=next((col for col in districts.columns if col.upper()=='UBIGEO'),None)
            if not u:raise ValueError('Falta UBIGEO en M09: '+str(districts.columns.tolist()))
            districts=districts.copy()
            districts['UBIGEO']=districts[u].map(norm_code)
            districts=districts.loc[districts.UBIGEO.str.startswith('0302')]
            if len(districts)!=20 or districts.UBIGEO.nunique()!=20:
                raise ValueError('M09 no contiene exactamente 20 distritos distintos')
            districts=districts.to_crs('EPSG:32718')
            districts.geometry=districts.geometry.simplify(float(args.simplificar_m),preserve_topology=True)
            districts=districts.to_crs('EPSG:4326')
            geo=[]
            for _,r in districts.iterrows():
                geo.append({'type':'Feature','geometry':r.geometry.__geo_interface__,'properties':stats[r.UBIGEO]})
            write_json(DATA/'distritos_20.geojson',{'type':'FeatureCollection','features':geo})
            info={'id':'provincia_estadisticas','path':'data/distritos_20.geojson','count':20,
                  'nombre':'Andahuaylas · indicadores INEI/MTC/MINEDU', 'estilo':'choropleth',
                  'numeric':[k for k,v in stats['030216'].items() if isinstance(v,(int,float))],
                  'value':'Dens_pob_hab_km2','category':None,'size_kb':round((DATA/'distritos_20.geojson').stat().st_size/1024),
                  'origen':dp}
            manifest['capas']['provincia_estadisticas']=info
            for t in ['M03','M09','M10','M12']:manifest['temas'][t].insert(0,'provincia_estadisticas')
            print('[OK] 20 distritos: M03/M09/M10/M12 unidos a CSV oficiales')
        except Exception as e:
            manifest['errores'].append({'capa':'provincia_estadisticas','error':str(e)})
            print('[ERROR] M09 distritos:',e)
    else:
        manifest['errores'].append({'capa':'provincia_estadisticas','error':'No existe GeoParquet provincial M09'})
    # Siempre se mantiene M11 con sus 5 coordenadas ya verificadas del inventario.
    base_tour=DATA/'m11_recursos.geojson'
    if base_tour.exists():
        manifest['capas']['turismo']={'id':'turismo','nombre':'Recursos turísticos MINCETUR','path':'data/m11_recursos.geojson',
            'count':5,'estilo':'tourism','category':'GRUPO_MAPA','numeric':[],'origen':'M11_recursos_turisticos.csv'}
        manifest['temas']['M11'].append('turismo')
    for key,path in [('masa',args.masa),('inundacion',args.inundacion)]:
        if path:
            try:
                manifest['rasters'].append(generate_raster(path,key,limit,None))
                print('[OK] ráster web:',key)
            except Exception as e:
                manifest['errores'].append({'capa':'raster_'+key,'error':str(e)})
                print('[ERROR] ráster',key,e)
    write_json(DATA/'catalogo_capas.json',manifest)
    summary={'exportadas':len(manifest['capas']),'temas':{k:len(v) for k,v in manifest['temas'].items()},
             'errores':manifest['errores'],'faltantes_en_origen':missing,
             'rasters':len(manifest['rasters']),
             'advertencias':manifest['advertencias']}
    write_json(DATA/'diagnostico_publicacion.json',summary)
    print('\n=== RESULTADO ===')
    print('Capas web:',len(manifest['capas']),'| Errores:',len(manifest['errores']),'| Rásteres:',len(manifest['rasters']))
    print('Reporte: data/diagnostico_publicacion.json')
    if manifest['errores']:sys.exit(2)

if __name__=='__main__':main()
