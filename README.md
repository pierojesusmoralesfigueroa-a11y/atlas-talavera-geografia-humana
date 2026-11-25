# Atlas geográfico-social de Talavera · V11

**Universidad Nacional Mayor de San Marcos · Geografía Humana · 2026-II**

Atlas web cartográfico y académico para el distrito de Talavera, provincia de Andahuaylas, Apurímac. Proyecto independiente del atlas Lima–Satipo, publicado como aplicación HTML/JavaScript estática con Leaflet y capas GeoJSON locales.

## Contenido

- Doce mapas temáticos (M01–M12) y sus láminas de referencia.
- 21 capas vectoriales de origen SIG y dos rásteres temáticos.
- M02: 67 centros poblados con círculos proporcionales a habitantes; densidad de 203 manzanas urbanas.
- M04: 67 centros por distancia a la salud, y cobertura de 72 establecimientos en área de análisis (14 ubicados dentro del distrito de Talavera).
- M05: 67 centros por distancia a primaria o secundaria; 60 locales educativos.
- M07: distancias a vías principales y redes viales según jerarquía.
- M11: cinco recursos documentados por MINCETUR, con ubicación geográfica y fichas externas de consulta.
- M09/M10/M12: comparación estadística a escala distrital con el universo de 20 distritos.

## Novedades de V11

- Etiquetas de localidades adaptables al zoom, evitando las superposiciones más evidentes.
- Controles de legibilidad: **etiquetas** y **tamaño de símbolos**.
- Al seleccionar clases de proximidad, se resaltan los centros de esa clase sin ocultar los demás.
- Red vial y símbolos cartográficos más equilibrados.
- Diseño general renovado para escritorio y móvil.
- Botón **Descargar mapa** con formatos **PNG de alta resolución (3300×2160)** y **SVG vectorial**, además de **GeoJSON**.

### Exportación y límites

La descarga PNG/SVG crea una lámina temática desde las geometrías reales del visor, con título, escala, norte, leyenda y fuentes. No incrusta el mapa base externo de OSM/OpenTopoMap. Es un **mapa temático vectorial**, no una captura exacta del lienzo web. El raster del mapa M08 tampoco se exporta en PNG/SVG: use la lámina original o el archivo ráster de origen si necesita reproducirlo íntegramente. La escala se deriva de la vista Web Mercator y es gráfica aproximada; la exportación no constituye una hoja cartográfica certificada.

Las clases sanitarias, educativas y viales describen **distancia euclidiana (Near)**, no recorrido vial ni tiempos de viaje. Conserve los años y escalas originales al comparar indicadores. Verifique las licencias de redistribución y los créditos antes de uso público o comercial.

## Publicar

Lee [PUBLICAR_EN_GITHUB.md](PUBLICAR_EN_GITHUB.md) para las instrucciones exactas de actualización. Repositorio correcto: `pierojesusmoralesfigueroa-a11y/atlas-talavera-geografia-humana`.

## Probar localmente

En la carpeta descomprimida abre una terminal y ejecuta `py -m http.server 8002`. Visita `http://localhost:8002/?v=11` y prueba M02, M04, M05, M07 y el exportador. Internet es necesario para cargar la biblioteca Leaflet y los mosaicos base.

## Fuentes institucionales

INEI, MINSA/SUSALUD, MINEDU, MTC/Provías, MINAM, MIDAGRI, INGEMMET, MINCETUR y capas administrativas del proyecto. La base primaria y los rangos se describen en la documentación y láminas correspondientes.
