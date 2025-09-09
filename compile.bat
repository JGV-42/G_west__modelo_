@echo off
REM Script para compilar el documento LaTeX y la bibliografía.

ECHO.
ECHO --- Limpiando archivos auxiliares... ---
del /q *.aux *.bbl *.bcf *.blg *.log *.out *.synctex.gz > nul 2>&1

ECHO.
ECHO --- PASO 1: Ejecutando pdflatex (primera pasada)... ---
pdflatex -interaction=nonstopmode main.tex

ECHO.
ECHO --- PASO 2: Ejecutando biber para la bibliografia... ---
biber main

ECHO.
ECHO --- PASO 3: Ejecutando pdflatex (para incluir bibliografia)... ---
pdflatex -interaction=nonstopmode main.tex

ECHO.
ECHO --- PASO 4: Ejecutando pdflatex (para ajustar referencias)... ---
pdflatex -interaction=nonstopmode main.tex

ECHO.
ECHO --- Proceso completado. ---
ECHO.
pause