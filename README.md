# Portafolio 2026 — Diego Tapullima Torrelli

Sitio web interactivo de una sola página construido a partir del portafolio
original en PDF. HTML + CSS + JavaScript puro, sin dependencias ni build.

## Qué incluye

- **Preloader** con barra de progreso
- **Cursor personalizado** que crece sobre los elementos clicables (solo escritorio)
- **Barra de progreso de scroll** y navegación que marca la sección activa
- **Hero** con parallax, contadores animados y menú hamburguesa en móvil
- **Sección "Sobre mí"** con barras de enfoque animadas al entrar en pantalla
- **Grilla de 6 proyectos** con filtros por categoría (Branding · Editorial · Infografía)
- **Visor modal** por proyecto: tablero completo con zoom, descripción, rol,
  tipografía, herramientas y paleta de colores con **clic para copiar el HEX**
- Navegación del visor con **flechas ← →**, **Esc** para cerrar y **swipe** en móvil
- Totalmente responsive y con soporte para `prefers-reduced-motion`

## Estructura

```
index.html
assets/
  css/style.css      estilos
  js/projects.js     datos de los proyectos  ← edita aquí el contenido
  js/main.js         interacciones
  img/               tableros y portadas extraídos del PDF
```

## Cómo verlo

Abre `index.html` en el navegador, o sirve la carpeta:

```bash
python3 -m http.server 8000
```

## Publicar en GitHub Pages

1. En el repositorio: **Settings → Pages**
2. En *Source* elige **Deploy from a branch**
3. Rama `main`, carpeta `/ (root)` → **Save**
4. El sitio queda en `https://asociadosariana-16.github.io/RodiPortafolio/`

## Pendiente por completar

- En `index.html`, la sección de contacto usa el correo de ejemplo
  `hola@ejemplo.com`. Reemplázalo por el correo real y agrega los enlaces
  a redes (Behance, Instagram, LinkedIn) si quieres mostrarlos.

## Agregar o editar proyectos

Todo el contenido vive en `assets/js/projects.js`. Cada proyecto es un objeto:

```js
{
  id: 'nombre',
  title: 'Nombre del proyecto',
  year: '2026',
  cat: 'branding',            // branding | editorial | infografia
  catLabel: 'Branding',
  tagline: 'Frase corta',
  cover: 'assets/img/nombre-cover.jpg',
  board: 'assets/img/nombre-board.jpg',
  desc:  'Descripción del proyecto.',
  role:  'Qué hiciste tú.',
  typo:  'Tipografías usadas',   // deja '' para ocultar el bloque
  tools: ['Photoshop', 'Illustrator'],
  palette: [ { hex: '#780000', name: 'Rojo oscuro' } ]  // [] para ocultar
}
```

Si agregas un proyecto, actualiza también los contadores de los filtros en
`index.html` (los números dentro de las etiquetas `<i>`).
