---
description: Revisa la ortografía del archivo activo, marca los errores visualmente (tachar amarillo / corrección verde) y genera un log.
---

1. **Identificación de Archivos**:
   - Analiza la solicitud del usuario para ver si especificó archivos, capítulos o secciones concretas (ej. "revisa la introducción", "revisa todo").
   - Si especificó **"todo"**, **"completo"** o **"all"**, lista todos los archivos `.tex` relevantes en el proyecto (especialmente en `sections/`).
   - Si especificó nombres parciales (ej. "introducción"), busca el archivo correspondiente en el sistema de archivos.
   - Si NO especificó nada, usa el archivo actualmente activo en el editor.
   - Genera una lista final de archivos a procesar.

2. **Bucle de Procesamiento**:
   - **Itera** sobre cada archivo identificado en el paso 1 y realiza los siguientes pasos (3 y 4) para cada uno.

3. **Verificación de Herramientas (Preamble)**:
   - Lee el archivo `preamble.tex`.
   - Comprueba si existen los paquetes `ulem` y `xcolor` y el comando `\correccion`.
   - Si no existen, **edita `preamble.tex`** para añadirlos antes de `\begin{document}` (o en la zona de paquetes):

     ```latex
     \usepackage[normalem]{ulem}
     \usepackage{xcolor} % Carga básica por si no está
     \definecolor{ForestGreen}{RGB}{34,139,34} % Definición manual para evitar conflictos de opciones (dvipsnames)
     \newcommand{\correccion}[2]{\textcolor{orange}{\sout{#1}} \textcolor{ForestGreen}{#2}}
     ```
     > **Nota Técnica:** Muchas plantillas (como `elsarticle`) cargan `xcolor` internamente sin opciones. Si intentamos cargarlo después con `\usepackage[dvipsnames]{xcolor}`, se produce un "Option Clash" y las opciones se ignoran, dejando indefinidos colores como `ForestGreen`. Por eso definimos el color manualmente con RGB.

4. **Análisis y Corrección**:
   - Lee el contenido completo del archivo activo.
   - Analiza el texto en busca de errores ortográficos y gramaticales (ignorando comandos LaTeX y etiquetas). No debes preocuparte acerca de qué habla el texto, solo de si está escrito de forma correcta.
   - **Para cada error encontrado**:
     - Realiza una sustitución en el contenido del archivo: cambia `error` por `\correccion{error}{corrección}`.
     - **IMPORTANTE**: NO corrijas el texto directamente. DEBES usar siempre el comando `\correccion{texto original}{texto corregido}` para que el usuario pueda ver los cambios visualmente.
     - **OBLIGATORIO**: Por cada corrección aplicada en el texto (cada vez que insertes `\correccion`), DEBES añadir inmediatamente un registro en el archivo `correcciones.md`.
     - Añade una entrada al archivo `correcciones.md` en la raíz del proyecto (créalo si no existe).
     - Formato del log en `correcciones.md`:
       `- [FECHA] [ARCHIVO:LINEA] Error: "mal" -> Corrección: "bien"`

5. **Finalización**:
   - Guarda los cambios en el archivo `.tex`.
   - Muestra al usuario un resumen: "Se han realizado X correcciones. Revisa 'correcciones.md' para ver el detalle."