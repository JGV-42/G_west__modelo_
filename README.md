# GreenWest: Modelo de IA para Predicción de Créditos de Carbono

Artículo científico sobre el desarrollo de un modelo de inteligencia artificial para predecir la captura de carbono en proyectos de forestación y reforestación en España.

## 📁 Estructura del proyecto

```
G_west__modelo_/
├── main.tex                    # Documento principal
├── preamble.tex                # Configuración de paquetes
├── referencias.bib             # Bibliografía (BibLaTeX)
├── compile.sh                  # Script de compilación
├── sections/                   # Contenido modular
│   ├── 01_introduccion.tex
│   ├── 02_objetivos.tex
│   ├── 03_revision_literatura.tex
│   ├── 04_estado_del_arte.tex
│   ├── 05_metodologia.tex
│   ├── 06_desarrollo_modelo.tex
│   ├── 07_resultados.tex
│   ├── 08_discusion.tex
│   ├── 09_conclusiones.tex
│   ├── 10_recomendaciones.tex
│   ├── 11_agradecimientos.tex
│   └── 12_anexos.tex
├── figuras/                    # Imágenes y gráficos
└── backup_20241216/            # Backup de versiones anteriores
```

## 🚀 Compilación

```bash
./compile.sh
```

El script ejecuta `pdflatex` → `biber` → `pdflatex` (×2) para generar correctamente las referencias cruzadas y la bibliografía.

## 📝 Plantilla utilizada

- **Clase**: `elsarticle` (Elsevier)
- **Estilo de citas**: `numeric` ([1], [2], etc.)
- **Bibliografía**: BibLaTeX con backend Biber
- **Ordenación**: Por orden de aparición en el texto

### Cambiar a otra revista

Para adaptar a otra plantilla (Springer, IEEE, etc.):

1. Modificar `\documentclass` en `main.tex`
2. Adaptar el `frontmatter` (autores, abstract, keywords)
3. Revisar `preamble.tex` por paquetes conflictivos

**No es necesario modificar** los archivos de `sections/`.

---

## ✅ Buenas prácticas aplicadas

### Estructura modular
- **Separación de contenido**: Cada sección en un archivo `.tex` independiente
- **Nomenclatura consistente**: `XX_nombre.tex` con números de 2 dígitos
- **Preamble separado**: Configuración centralizada en `preamble.tex`

### Formato compatible con revistas

| Práctica | Implementación |
|----------|----------------|
| Secciones numeradas | Eliminados todos los `\section*`, `\subsection*` (excepto Agradecimientos) |
| Posicionamiento de floats | Cambiado `[H]` → `[htbp]` para que LaTeX decida |
| Sin saltos de página forzados | Eliminados `\newpage` |
| Sin espaciado manual | Eliminados `\medskip`, `\bigskip`, `\vspace` |
| Tablas sin escalado | Eliminados `\resizebox`, ajustados anchos de columna |
| Etiquetas únicas | Corregidas etiquetas duplicadas |

### Tablas
- Anchos de columna fijos con `p{Xcm}`
- Uso de `longtable` para tablas largas (división automática entre páginas)
- Tamaño de fuente `\footnotesize` o `\small` según necesidad
- Sin `\resizebox` que puede hacer el texto ilegible

### Código limpio
- Sin comentarios `TODO` en producción (pendientes documentados)
- Sin caracteres Unicode problemáticos (`≤` → `$\leq$`)
- Referencias cruzadas con `\label` y `\ref` consistentes

---

## 📋 Historial de cambios principales

### 2024-12-16

#### Adaptación a `elsarticle`
- Cambiado de `article` a `elsarticle` class
- Implementado `frontmatter` con autores, afiliaciones y abstract
- Configurado estilo de citas `authoryear`

#### Reorganización de archivos
- Renombrados todos los archivos de secciones con formato consistente `XX_nombre.tex`
- Actualizado `main.tex` con las nuevas rutas

#### Correcciones de formato
- Eliminados ~30 `\medskip` manuales
- Eliminados 7 `\resizebox` en tablas
- Cambiados 17 `[H]` → `[htbp]` en floats
- Eliminados 2 `\newpage` forzados
- Convertidas ~22 secciones sin numerar a numeradas

#### Correcciones de tablas
- Tabla de modelos de combustible: convertida a `longtable`
- Tabla de especies: ajustados anchos de columna
- Tablas de resultados: eliminado escalado, ajustados anchos

#### Correcciones de errores
- Corregido `\multirow` con `\shortstack` para texto multilínea
- Reemplazados caracteres Unicode `≤`/`≥` por `$\leq$`/`$\geq$`
- Corregida etiqueta duplicada `tab:resultados_modelos`

---

## 📚 Dependencias (paquetes LaTeX)

- `elsarticle` - Clase de documento
- `biblatex` + `biber` - Gestión de bibliografía
- `amsmath`, `amsfonts`, `amssymb` - Símbolos matemáticos
- `graphicx` - Inclusión de figuras
- `booktabs`, `longtable`, `multirow` - Tablas profesionales
- `hyperref` - Enlaces y referencias
- `xcolor` - Colores
- `siunitx` - Unidades SI
- `tikz` - Diagramas

---

## 👥 Autores

- Maider Araceli Urbón Jiménez (correspondencia)
- Jaime Gabriel Vegas
- Ana de Luis Reboredo
- Belén Pérez Lancho
- Ana-Belén Gil-González

**Afiliación**: Grupo B1, Equipo BISITE, Universidad de Salamanca

---

## 📄 Licencia

[Pendiente de definir]
