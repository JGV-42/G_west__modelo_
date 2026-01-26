# Notas para el Agente IA - Proyecto GreenWest (LaTeX)

Este archivo contiene información crítica y lecciones aprendidas para trabajar en este proyecto LaTeX.

## 1. Reglas de Compilación y Sintaxis LaTeX

### Caracteres Especiales
*   **Guiones Bajos (`_`)**: Son críticos. 
    *   **Texto y Captions**: SIEMPRE se deben escapar (`\_`) en texto normal, títulos de secciones (`\section`), y pies de figura/tabla (`\caption`). Ejemplo: `carbono\_bruto4`. Si no se escapan, LaTeX interpreta que empieza una fórmula matemática o subíndice, rompiendo la compilación con errores engañosos como `! LaTeX Error: \begin{table} ... ended by \end{document}`.
    *   **Labels y Nombres de Archivo**: NO es necesario escaparlos en `\label{...}`, `\ref{...}` o `\input{...}`.

### Tablas
*   Se utilizan entornos `table` (flotantes) y `longtable` (para tablas que ocupan varias páginas).
*   Es común el uso de `\resizebox{\textwidth}{!}{...}` para ajustar tablas anchas. Asegurarse de cerrar todas las llaves correctamente.

## 2. Flujo de Trabajo
*   **Compilación**: NO intentar compilar manualmente archivos individuales si hay dependencias. Usar siempre el script `./compile.sh` en la raíz. Este script gestiona la limpieza, `pdflatex`, bibliografía (`biber`) y re-compilaciones necesarias.
*   **Ubicación de Archivos**:
    *   `main.tex`: Archivo principal.
    *   `sections/`: Capítulos y secciones del documento.
    *   `tablas_nuevas/`: Contiene fragmentos de código LaTeX con tablas actualizadas generadas externamente o refactorizadas.

## 3. Historial de Errores Frecuentes
*   **Error**: `! LaTeX Error: \begin{table} on input line X ended by \end{document}.`
    *   **Causa Probable**: Un carácter especial (como `_`) sin escapar dentro de un `\caption{}` o una llave `{}` sin cerrar dentro de la tabla.
    *   **Solución**: Revisar el contenido de la tabla, especialmente los nombres de variables en `\caption`.

*   **Error**: Referencias no definidas (`??`).
    *   **Solución**: Ejecutar `./compile.sh` completo para asegurar que `biber` y las pasadas sucesivas de `pdflatex` actualizan los índices.
