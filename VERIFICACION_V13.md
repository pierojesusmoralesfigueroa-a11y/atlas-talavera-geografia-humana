# Verificación e integración del Atlas Talavera V13

**Objeto:** incorporar los PDF A3 originales entregados por el usuario para los mapas 10, 11 y 12, manteniendo los datos SIG y el funcionamiento de V12.

## Documentos originales (1 página A3 horizontal cada uno)

| Mapa | Documento | Tema | Fuente y año de la lámina |
|---|---|---|---|
| M10 | `MAPA10.pdf` | Quechua y castellano como lengua materna (20 distritos) | INEI, Censo 2017 |
| M11 | `MAPA11_RECURSOS_TURISTICOS.pdf` | Cinco recursos turísticos y su entorno | MINCETUR, inventario 2025 |
| M12 | `M12_POBREZA_MONETARIA.pdf` | Incidencia estimada y grupos robustos de pobreza | INEI 2018, Anexo 3.03 y simulaciones reprocesadas |

## Verificaciones de datos y simbología

- M10: dos variables de porcentaje, cinco intervalos cada una, con cortes de la lámina: quechua 57,02–62,51; 62,51–80,39; 80,39–90,03; 90,03–93,64; 93,64–98,41 %. Castellano 1,34–3,30; 3,30–6,56; 6,56–11,45; 11,45–18,27; 18,27–42,08 %.
- M10 Talavera: quechua 10 961 (62,51 %); castellano 6 482 (36,97 %), población de 3 años o más 17 535.
- M11: cinco puntos únicos, 2 urbano-culturales, 1 arqueológico, 1 natural y 1 festividad. Tres fotografías recortadas de la lámina aportada, sin inventar localizaciones. Las fotografías no tienen crédito individual identificado.
- M12: clases 25–<35; 35–<42; 42–<49; 49–<55; 55–60 %; grupos robustos: 14/5/1 distritos. Talavera: 30,12 %, IC95 % 20,19–40,05 %, grupo 2 y posición departamental 78.
- M10/M12: controles para alternar las dos vistas de cada lámina y descargas directas de PDF original. Las distribuciones interactivas se basan en los 20 distritos georreferenciados existentes.
- Fuente de la lámina M12: datos reprocesados y valores del anexo no deben confundirse.

## Integridad cartográfica

- 32 archivos originales en `data/` del paquete V12 comparados mediante SHA-256: **sin alteraciones**.
- Los archivos JPEG M10/M11/M12 de apoyo fueron sustituidos por imágenes de alta resolución generadas directamente de los PDF originales. Los PDF se incorporaron con bytes idénticos a los archivos entregados.
- Comprobación mediante Node.js: sintaxis JavaScript válida.
- Pruebas de componentes mediante navegador aislado: clases de M10/M12, descarga PDF, cinco tarjetas de turismo y tres tarjetas fotográficas, sin errores JavaScript detectados.

## Límites de validación

El navegador automatizado de este entorno **bloqueó el acceso a HTTP local y a la biblioteca remota Leaflet**. Por ello no se certifica aquí la interacción final del mapa sobre GitHub Pages. Tras publicar, probar los tres mapas con conexión, la descarga PDF, el cambio de variables y el ajuste de leyendas. La corrección de valores y archivos sí se verificó de forma automatizada.

**Precaución de derechos:** los tres PDF provienen del usuario; las fotografías del M11 fueron extraídas de su lámina. Antes de redistribuirlas en un repositorio público debe comprobarse la licencia o autorización de sus titulares.
