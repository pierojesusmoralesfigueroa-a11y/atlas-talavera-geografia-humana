# Verificación de datos · Atlas Talavera V8

**Alcance:** prueba de estructura y lógica del sitio, sin sustituir la comprobación visual en navegador. 

## Integración SIG

- 12 temas cartográficos, 21 capas GeoJSON y 2 superposiciones ráster presentes; se comprobó la existencia de todos los recursos del catálogo.
- 20 distritos con estadísticas unidas por UBIGEO.
- M02: 67 centros poblados (población 0–11 691), 203 polígonos de manzana. Escala de símbolo proporcional a raíz cuadrada de población, con radio visual mínimo para permitir la lectura.
- M04: 67 localidades de proximidad y 72 establecimientos del área de estudio (Talavera + entorno).
- M05: 60 locales educativos y 67 centros poblados para ambas distancias a niveles de enseñanza.
- M07: 67 distancias a vías principales, y redes nacionales, departamentales y vecinales.
- M11: cinco registros MINCETUR y capas adicionales de contexto geográfico; sus coordenadas no se modificaron.
- M08: se retuvieron exactamente las dos imágenes ráster y su configuración de extensión geográfica de V7.

## Cuatro clases de proximidad

| Tema | Límites superiores de las clases 1, 2 y 3 (km) | Recuentos por clase (67 centros) |
|---|---|---|
| M04 | 0,604 · 1,384 · 2,619 | 12, 25, 23, 7 |
| M05 primaria | 0,220993 · 0,624645 · 1,130415 | 19, 9, 30, 9 |
| M05 secundaria | 1,167094 · 2,004886 · 2,994324 | 28, 16, 19, 4 |
| M07 | 0,462318 · 1,345644 · 2,770595 | 15, 27, 18, 7 |

Los cortes se trasladaron de las láminas originales y se recalcularon las clases a partir de las distancias almacenadas en los GeoJSON. En M04 se utiliza `DIST_KM` y en M05/M07 se convierte `NEAR_DIST` de metros a kilómetros.

## Correcciones principales

1. M02: orden de dibujo corregido para dejar los centros poblados por encima de las manzanas. Tamaño proporcional a población, no a densidad.
2. M04/M05/M07: leyenda que prioriza proximidad, símbolos por cuatro colores y selectores para cambiar de vista sin perder geometrías.
3. M11: listado de cinco recursos, filtros, mapa de contexto (límite, agua y vías), mini-mapa de plaza y templo y consulta de fichas MINCETUR.
4. Interfaz: colores renovados, jerarquía editorial, panel de lectura y leyendas más legibles, adaptable a móvil.
5. GitHub: HTML estático y capas presentes, sin conexión a scripts locales `C:\...`, y sin claves privadas.

## Pendientes de comprobación en el navegador

- Revisar que las teselas de OpenStreetMap y Leaflet carguen con conexión a internet.
- Probar M02, M04, M05, M07 y M11 en el equipo final, especialmente popups, zoom y dispositivos móviles.
- Revisar licencias y atribución de datos antes de publicar.
- Exportar las composiciones A3 originales de M10–M12 a `assets/laminas/M10.jpg`, `M11.jpg`, `M12.jpg` si se desea que el botón «Ver lámina A3» las muestre.
