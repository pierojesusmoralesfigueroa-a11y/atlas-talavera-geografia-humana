# Atlas geográfico-social de Talavera · V13 — Láminas A3 integradas

Sitio estático para GitHub Pages basado en la V12. **Esta actualización integra tres PDF A3 proporcionados por el autor:** M10 (lengua materna, INEI 2017), M11 (turismo, MINCETUR) y M12 (pobreza monetaria, INEI 2018).

## Integración de M10, M11 y M12

- **M10:** lámina original de dos mapas y acceso a descarga PDF A3. Se muestran como vistas alternables las variables de lengua materna quechua y castellana; sus **cinco cortes coinciden con las leyendas originales** cuando se utiliza «Rangos originales de la lámina A3». Los valores se calculan a partir de la tabla de 20 distritos ya contenida en V12. Indicadores Talavera: 10 961 quechua, 6 482 castellano, 17 535 personas de 3+ años.
- **M11:** lámina original con cinco recursos MINCETUR; se mantienen las coordenadas y fichas existentes. Se incorpora galería de **tres fotografías recortadas de la lámina proporcionada** (plaza, Achanchi y Sutoqmachay), con enlaces de selección a los puntos del visor. El punto de la festividad sigue siendo referencial. Las fotografías no tienen crédito individual visible; **verificar los permisos para su difusión pública**.
- **M12:** lámina original con dos vistas, incidencia estimada y grupos robustos. Se incorporaron exactamente los cinco rangos de incidencia (25–<35, 35–<42, 42–<49, 49–<55, 55–60 %) y la leyenda de grupos robustos con 14/5/1 distritos. Talavera: 30,12 %, IC95 % 20,19–40,05 %, grupo 2. Los valores POB_SIM son estimaciones reprocesadas, no mediciones directas oficiales.
- **Láminas originales:** `assets/laminas_pdf/M10_original_A3.pdf`, `M11_original_A3.pdf` y `M12_original_A3.pdf`. Se consultan desde «Ver lámina A3» y mediante «Descargar lámina original PDF».
- **Integridad:** ningún GeoJSON, CSV ni ráster original de V12 se ha alterado. Los demás mapas M01–M09 conservan sus datos.

## Publicación rápida

Abrir exclusivamente `https://github.com/pierojesusmoralesfigueroa-a11y/atlas-talavera-geografia-humana/upload/main`, descomprimir `Actualizacion_Talavera_V12_a_V13.zip` y arrastrar todos sus archivos y carpetas; luego guardar el commit. No subir al repositorio `atlas-lima-satipo-2026`. Tras GitHub Actions en verde, visitar la web y presionar `Ctrl + F5`. **No basta con subir el ZIP comprimido:** debe preservarse la estructura de subcarpetas.

---

## Historial previo (V12)

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


## Actualización V14 · Publicación de láminas M01, M10, M11 y M12

- **M01:** 67 centros poblados, 158,02 km², 98,51 % de localidades rurales según el PDF M01 aportado. Usa la capa de 67 centros con población del atlas, conservando la capa previa de 66 como alternativa desactivada. Lámina SVG vectorial web, no copia del PDF original.
- **M10:** imagen y PDF A3 aportados, accesibles desde `Talavera_M10_A3.jpg` y `Talavera_M10_original_A3.pdf` en la raíz.
- **M11:** imagen y PDF A3 aportados, accesibles desde `Talavera_M11_A3.jpg` y `Talavera_M11_original_A3.pdf` en la raíz. Fotografías extraídas de la lámina en `Talavera_Turismo_*.jpg`.
- **M12:** imagen y PDF A3 aportados, accesibles desde `Talavera_M12_A3.jpg` y `Talavera_M12_original_A3.pdf` en la raíz.

La V14 conecta las rutas reales del repositorio. El PDF original del M01 sigue siendo un archivo proporcionado en la conversación, no se afirma haberlo alojado en GitHub. Para evitar caché, se usan consultas `?v=14`.
