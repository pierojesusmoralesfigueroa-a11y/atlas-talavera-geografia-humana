# Verificación de versión · Atlas Talavera V11

**Proyecto:** Atlas geográfico-social de Talavera, Andahuaylas, Apurímac · UNMSM · 2026-II.

## Cambios realizados

1. **M02, M04, M05 y M07:** etiquetas de centros poblados con prioridad por población, detección de solapamientos aproximada y actualización al cambiar el nivel de zoom. Selector «Principales / Más etiquetas / Sin etiquetas».
2. **M04, M05 y M07:** al pulsar una clase de distancia se destacan sus centros, mientras que las restantes clases permanecen visibles, atenuadas y con sus colores de origen. Se conserva la leyenda de cuatro rangos y su explicación.
3. **M07:** presentación inicial más legible: proximidad junto con red nacional y departamental; la red vecinal se puede activar desde Capas o al elegir «Todas las vías». Estilos de vías con menor grosor y contraste jerarquizado.
4. **Simbología:** selector de tamaño compacto/equilibrado/grande; paleta de proximidad consistente en todo el atlas. Símbolos de equipamientos sanitarios reducidos.
5. **Interfaz:** diseño editorial actualizado, métricas, paneles, sombras, tipografía, color y controles. Inicio en M01 como introducción cartográfica.
6. **Exportación:** botón «Descargar mapa» con PNG de 3300 × 2160 píxeles y SVG vectorial, más GeoJSON. Incluye título, fuente, escala aproximada calculada para la visualización, leyenda, norte y marcas académicas.

## Qué no cambia

- Geometrías y atributos SIG: **no modificados**.
- Las categorías de proximidad corresponden a las distancias euclidianas del análisis Near, **no** a recorridos ni tiempos de viaje.
- Las láminas de referencia y los datos originales se conservan.
- La exportación **no incorpora** los mosaicos raster de OpenStreetMap/OpenTopoMap por políticas/CORS. La cartografía temática vectorial propia sí se exporta. En M08, el raster de susceptibilidad se puede ver en línea, pero no está incluido en el exportador PNG/SVG, por lo que estos formatos no deben usarse como exportación completa de ese mapa.

## Pruebas

- Compilación sintáctica de `app.js` y `atlas_export.js` con Node.js.
- Archivo SVG exportado y validado con un parser XML.
- PNG descargado en prueba de navegador aislado (lienzo de 3300 × 2160 píxeles).
- Comparación de integridad entre los datos de V10 y V11 sin modificaciones de GeoJSON y recursos ráster.
- Recuentos de 67 centros poblados por proximidad y cuatro categorías cotejados con la versión anterior.

**Límite de verificación:** el navegador automatizado de este entorno bloquea la navegación a páginas locales y remotas. Las pruebas del exportador se efectuaron con un mapa simulado y geometrías reales. No sustituyen una comprobación visual completa de Leaflet en GitHub Pages. Recomendada tras publicación: revisar las etiquetas con zoom, color de las cuatro clases, filtros, exportación en M02/M04/M05/M07 y botones en móvil.
