# Atlas Geográfico-Social de Talavera · V12

**Universidad Nacional Mayor de San Marcos (UNMSM) · Geografía Humana · 2026-II**

Aplicación cartográfica **estática**, publicada con GitHub Pages, HTML/CSS/JavaScript y Leaflet. Su propósito es presentar 12 temas geográficos de Talavera, Andahuaylas, Apurímac, con datos espaciales verificables e interpretación comprensible.

## Inventario de información

- **M01–M12:** 12 mapas temáticos con láminas de referencia; 21 GeoJSON vectoriales y 2 rásteres originales del análisis SIG, conservados sin modificar en V12.
- **M02:** 67 centros poblados simbolizados por población y 203 manzanas urbanas con atributos censales (2017).
- **M04:** 67 centros poblados y clasificación en cuatro intervalos de distancia euclidiana a establecimientos de salud; 72 servicios en el ámbito de análisis, de los cuales 14 se encuentran dentro de Talavera.
- **M05:** 67 centros, distancias a primaria/secundaria y 60 locales educativos.
- **M07:** 67 centros clasificados por proximidad a vías principales, además de redes viales jerarquizadas.
- **M08:** dos superficies ráster categóricas de susceptibilidad de INGEMMET: movimientos en masa e inundación.
- **M09/M10/M12:** indicadores comparativos de los 20 distritos de la provincia de Andahuaylas, por UBIGEO.
- **M11:** cinco recursos del inventario MINCETUR con localización y enlace a su ficha de consulta.

## Novedades V12

1. **Lectura geográfica para los 12 mapas:** panel de objetivos, explicación territorial, advertencias sobre los alcances de cada variable y fuentes. En M02, M04, M05 y M07, los textos estadísticos se derivan de la capa GeoJSON cargada; la barra de proximidad cuenta realmente las entidades por clase.
2. **Comparador de 67 localidades:** cruza cuatro archivos GeoJSON por código `CODIGO` y permite consultar salud, primaria, secundaria y vías, ordenar por mayor distancia, buscar centros, ubicarlos en M04 y descargar CSV. No estima rutas.
3. **Clasificación de coropletas:** opción entre intervalos iguales y cuantiles (cinco clases) para los mapas temáticos numéricos, sin cambiar el valor del indicador original. M12 conserva sus cortes predefinidos por defecto.
4. **Etiquetas y legibilidad:** nombres en los mapas distritales M03/M09/M10/M12, etiquetado contextual de coberturas en M06 y símbolos de servicios al acercar. La densidad de etiquetas depende del zoom y del modo elegido.
5. **Interacción:** buscador con sugerencias de temas y entidades de la vista; enlaces para compartir tema, escala, posición, modo, clasificación, etiquetas y tamaño de símbolos; modo presentación a pantalla más amplia (salida con `Esc`).
6. **Ficha imprimible:** botón «Imprimir ficha / PDF» abre la opción de impresión del navegador con indicadores, interpretación, advertencias y fuentes. Para PDF el usuario debe elegir «Guardar como PDF».
7. **Exportación mejorada:** lámina PNG (3300 × 2160), SVG editable y GeoJSON. Ahora **M08 puede incorporar el PNG ráster local** del análisis en la exportación de la vista, acompañado de su leyenda temática. Los mosaicos externos OSM/OpenTopoMap siguen excluidos.
8. **Interfaz:** jerarquía tipográfica, paleta consistente, contraste de clases de proximidad, paneles reorganizados y ajustes para pantallas pequeñas y preferencias de movimiento reducido.

## Limitaciones metodológicas y cartográficas

- **Distancias Near:** euclidianas, en línea recta. **No representan recorrido, tiempo de viaje, transitabilidad ni disponibilidad real de servicios**. Las clases de primaria, secundaria, salud y vías tienen umbrales *diferentes*; es válido comparar los kilómetros, no equiparar un color a la misma distancia en todas las materias.
- **M02:** población por círculo y densidad urbana por manzana son variables con denominadores diferentes.
- **M08:** susceptibilidad no es riesgo ni probabilidad temporal de afectación. El ráster tiene extensión y resolución específicas y su simbología reproduce sus categorías; la exportación temática NO incorpora el mapa base externo.
- **M12:** `POB_SIM` es una estimación reprocesada; separar su valor de los intervalos de confianza oficiales y los grupos robustos.
- **M10:** lengua materna no equivale a bilingüismo. Conservar la precisión temporal de la fuente.
- **M11:** un punto de festividad puede ser referencial; las redes viales mostradas no constituyen rutas turísticas oficializadas.
- **Exportación:** compone una lámina en Web Mercator basada en la extensión visible del visor con cartografía propia y leyenda. **No es una carta certificada** ni una captura exacta del mosaico de mapa base. La escala es una referencia gráfica aproximada.

## Publicación

Ver [PUBLICAR_EN_GITHUB.md](PUBLICAR_EN_GITHUB.md). El repositorio correcto es `pierojesusmoralesfigueroa-a11y/atlas-talavera-geografia-humana`; **no subir al atlas de Lima–Satipo**.

Para prueba local: en la carpeta extraída ejecutar `py -m http.server 8002` y abrir `http://localhost:8002/?v=12`. Leaflet y las bases cartográficas necesitan internet; los GeoJSON y los rásteres están incluidos localmente.

## Archivos principales

- `index.html`: interfaz completa y paneles de consulta.
- `styles.css`: estilos y diseño adaptable.
- `app.js`: mapas, capas GeoJSON, simbología, filtros y etiquetas.
- `atlas_export.js`: exportación cartográfica vectorial/ráster a PNG y SVG.
- `atlas_v12.js`: interpretación, comparación, CSV, búsqueda, vínculos de consulta, presentación y ficha PDF imprimible.
- `data/` y `assets/`: información SIG local, gráficos, láminas e íconos.

**Fuentes institucionales del proyecto:** INEI, MTC/Provías, MINEDU, MINSA/SUSALUD, MINAM, MIDAGRI, INGEMMET, MINCETUR y cartografía administrativa. Revisar los metadatos y licencias originales antes de redistribuir información de terceros.
