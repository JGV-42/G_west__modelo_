#!/bin/bash
# Script para compilar el documento LaTeX y la bibliografía.

echo
echo "--- Limpiando archivos auxiliares... ---"
# Usamos rm -f para forzar el borrado sin preguntar y ocultar errores si no existen
rm -f *.aux *.bbl *.bcf *.blg *.log *.out *.synctex.gz > /dev/null 2>&1

echo
echo "--- PASO 1: Ejecutando pdflatex (primera pasada)... ---"
pdflatex -interaction=nonstopmode main.tex

echo
echo "--- PASO 2: Ejecutando biber para la bibliografia... ---"
biber main

echo
echo "--- PASO 3: Ejecutando pdflatex (para incluir bibliografia)... ---"
pdflatex -interaction=nonstopmode main.tex

echo
echo "--- PASO 4: Ejecutando pdflatex (para ajustar referencias)... ---"
pdflatex -synctex=1 -interaction=nonstopmode main.tex

echo
echo "--- Proceso completado. ---"
echo
