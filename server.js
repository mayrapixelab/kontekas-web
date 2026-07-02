const express = require('express');
const path    = require('path');

const app  = express();
const PORT = process.env.PORT || 3000;

// ─── Helpers ──────────────────────────────────────────────────────────────
const prod = id => `/producto.html?id=${encodeURIComponent(id)}`;
const r301 = (from, to) => app.get(from, (req, res) => res.redirect(301, to));

// ─── 301 Redirects — sitio anterior (WordPress) → nuevo ───────────────────

// Páginas generales
r301('/catalogo',              '/catalogo.html');
r301('/catalogo/',             '/catalogo.html');
r301('/contacto',              '/cotizacion.html');
r301('/contacto/',             '/cotizacion.html');
r301('/aviso-de-privacidad',   '/aviso-de-privacidad.html');
r301('/aviso-de-privacidad/',  '/aviso-de-privacidad.html');

// Categorías
const CATS = [
  ['/categoria-producto/sombrillas',      '/catalogo.html?categoria=sombrillas'],
  ['/categoria-producto/sillas',          '/catalogo.html?categoria=sillas'],
  ['/categoria-producto/mesas',           '/catalogo.html?categoria=mesas'],
  ['/categoria-producto/sets',            '/catalogo.html?categoria=sets'],
  ['/categoria-producto/camastros',       '/catalogo.html?categoria=camastros'],
  ['/categoria-producto/muebles-de-teca', '/catalogo.html?material=teca'],
];
CATS.forEach(([slug, dest]) => { r301(slug, dest); r301(slug + '/', dest); });

// Catch-alls WordPress (blog, etiquetas, PDFs, paginación)
app.get('/blog-kontekas/*',  (req, res) => res.redirect(301, '/'));
app.get('/etiqueta-producto/*', (req, res) => res.redirect(301, '/catalogo.html'));
app.get('/categoria-producto/*', (req, res) => res.redirect(301, '/catalogo.html'));
app.get('/wp-content/*',     (req, res) => res.redirect(301, '/catalogo.html'));

// ─── Productos individuales ────────────────────────────────────────────────
const PRODS = [
  // Sombrillas — madera central
  ['/catalogo/sombrillas/sombrilla-redonda-de-madera-3-30',                              'SHI 001'],
  ['/catalogo/sombrillas/sombrilla-colgante-redonda-3-5-de-madera',                      'SHI 003'],
  ['/catalogo/sombrillas/sombrilla-colgante-redonda-4-0-de-madera',                      'SHI 004'],
  ['/catalogo/sombrillas/sombrilla-colgante-cuadrada-4-0-de-madera',                     'SHI 005'],
  ['/catalogo/sombrillas/sombrilla-cuadrada-2-75-de-madera',                             'SHI 011'],
  ['/catalogo/sombrillas/sombrilla-cuadrada-3-0-de-madera',                              'SHI 014'],
  ['/catalogo/sombrillas/sombrilla-cuadrada-colgante-beige-de-madera-cafe-3x3mts',       'SHI 015'],
  ['/catalogo/sombrillas/sombrilla-redonda-2-75-de-madera',                              'SHI 018'],
  ['/catalogo/sombrillas/sombrilla-redonda-2-75-de-madera-poste-38mm',                   'SHI 019'],
  ['/catalogo/sombrillas/sombrilla-cuadrada-4-00-de-madera',                             'SHI 021'],
  // Sombrillas — fibra de vidrio / aluminio
  ['/catalogo/sombrillas/sombrilla-redonda-colgante-de-fibra-de-vidrio-color-beige-de-4-00-m-de-diametro', 'SHI 004F'],
  ['/catalogo/sombrillas/sombrilla-cuadrada-colgante-de-fibra-de-vidrio-color-beige-de-4x4', 'SHI 005F'],
  ['/catalogo/sombrillas/sombrilla-cuadrada-colgante-de-fibra-de-vidrio-3-x-3-m',        'SHI 015F'],
  ['/catalogo/sombrillas/sombrilla-cuadrada-beige-de-fibra-de-vidrio-de-2-75-x-2-75',   'SHI 411B'],
  ['/catalogo/sombrillas/sombrilla-redonda-de-fibra-de-vidrio-de-2-75-de-diametro-tela-beige', 'SHI 418B'],
  ['/catalogo/sombrillas/sombrilla-redonda-beige-de-fibra-de-vidrio-de-3-30-de-diametro','SHI 401B'],
  ['/catalogo/sombrillas/sombrilla-redonda-de-fibra-de-vidrio-de-2-70-m',                'SHI 430'],
  ['/catalogo/sombrillas/sombrilla-cuadrada-con-estructura-de-aluminio-2-50-m',          'SHI 500'],
  // Sombrillas — bases de granito
  ['/catalogo/sombrillas/base-de-granito-blanco-de-35-kg-para-sombrilla',                'SHI 008'],
  ['/catalogo/sombrillas/base-de-granito-blanco-de-35-kg-con-ruedas-para-sombrilla',     'SHI 008R'],
  ['/catalogo/sombrillas/base-de-granito-blanco-de-55-kg-para-sombrilla',                'SHI 020'],
  ['/catalogo/sombrillas/base-de-granito-blanco-de-130-kg-para-sombrilla-colgante-cuatro-piezas', 'SHI 009'],
  // Camastros
  ['/catalogo/camastros/camastro-de-aluminio-y-malla-textilene-color-cafe',              'NIC 125'],
  ['/catalogo/camastros/camastro-de-aluminio-y-tejido-sintetico-chocolate',              'NIC 001'],
  ['/catalogo/camastros/camastro-lettino-de-teca',                                       'DTA 132A'],
  // Mesas — aluminio
  ['/catalogo/mesas/mesa-cuadrada-brit-con-cubierta-de-stone-glass',                     'NIC 129'],
  ['/catalogo/mesas/mesa-lateral-armazon-y-cubierta-de-aluminio-color-chocolate',        'NIC 162'],
  ['/catalogo/mesas/mesa-cuadrada-de-aluminio-con-pedestal-cubierta-sinterizada-de-roca-color-chocolate', 'NIC 163'],
  ['/catalogo/mesas/mesa-redonda-de-aluminio-cubierta-sinterizada-de-roca-color-chocolate', 'NIC 164'],
  // Mesas — teca
  ['/catalogo/mesas/mesa-redonda-picnic-de-teca-con-aceite',                             'DTA 033A'],
  ['/catalogo/mesas/mesa-rotary-de-teca-redonda',                                        'DTA 045A'],
  ['/catalogo/mesas/mesa-oval-de-teca-con-extension-2-4',                                'DTA 048A'],
  ['/catalogo/mesas/mesa-oval-de-teca-con-extension-de-1-20-1-80m-x-1-20x0-74m',        'DTA 047A'],
  ['/catalogo/mesas/mesa-cuadrada-emma-de-teca-1x1',                                    'DTA 130A'],
  ['/catalogo/mesas/mesa-lateral-samos-de-teca',                                         'DTA 137A'],
  ['/catalogo/mesas/mesa-mars-oval-de-teca-con-extension-3-2-m',                         'DTA 113A'],
  ['/catalogo/mesas/mesa-venus-rectangular-de-teca-con-extension-3-2-m',                 'DTA 112A'],
  ['/catalogo/mesas/mesa-redonda-mercy-de-teca',                                         'DTA 041A'],
  // Sillas — aluminio (NIC)
  ['/catalogo/sillas/silla-aba',                                                          'NIC 161'],
  ['/catalogo/sillas/silla-roma',                                                         'NIC 160'],
  ['/catalogo/sillas/silla-soft',                                                         'NIC 056'],
  ['/catalogo/sillas/silla-line',                                                         'NIC 149'],
  ['/catalogo/sillas/silla-sun',                                                          'NIC 158'],
  ['/catalogo/sillas/silla-dia',                                                          'NIC 155'],
  ['/catalogo/sillas/silla-bun',                                                          'NIC 159'],
  ['/catalogo/sillas/silla-bun-2',                                                        'NIC 159G'],
  ['/catalogo/sillas/silla-ding-con-brazos',                                              'NIC 136N'],
  ['/catalogo/sillas/silla-ding-sin-brazos',                                              'NIC 138N'],
  // Sillas — teca (DTA)
  ['/catalogo/sillas/silla-selecta-plegable-de-teca-sin-brazos',                         'DTA 121A'],
  ['/catalogo/sillas/silla-folding-de-teca',                                             'DTA 008A'],
  ['/catalogo/sillas/silla-stacking-de-teca-con-brazos',                                 'DTA 014A'],
  ['/catalogo/sillas/silla-combo-stacking-de-teca-con-brazos',                           'DTA 015A'],
  ['/catalogo/sillas/sillon-individual-de-teca',                                          'DTA 050A'],
  ['/catalogo/sillas/banca-doble-de-teca',                                               'DTA 051A'],
];

PRODS.forEach(([slug, id]) => {
  const dest = prod(id);
  r301(slug, dest);
  r301(slug + '/', dest);
});

// Sets → catálogo filtrado (los IDs llevan caracteres especiales compuestos)
[
  '/catalogo/sets/set-brit-ding-con-brazos',
  '/catalogo/sets/set-brit-soft',
  '/catalogo/sets/set-de-nic',
  '/catalogo/sets/set-de-sillones-de-teca',
  '/catalogo/sets/set-de-teca',
  '/catalogo/sets/set-oval',
  '/catalogo/sets/set-oval-8-sillas',
  '/catalogo/sets/set-mars',
  '/catalogo/sets/set-mercy',
  '/catalogo/sets/set-picnic',
  '/catalogo/sets/set-rotary',
  '/catalogo/sets/set-venus',
  '/catalogo/sets/set-mesa-cuadrada-de-aluminio-y-sillas-dia',
  '/catalogo/sets/set-mesa-cuadrada-de-aluminio-y-sillas-soft',
  '/catalogo/sets/set-mesa-lateral-de-aluminio-y-camastro',
  '/catalogo/sets/set-mesa-lateral-de-aluminio-y-sillas-soft',
  '/catalogo/sets/set-mesa-oval-con-extension',
  '/catalogo/sets/set-mesa-redonda-de-aluminio-y-sillas-ding-sin-brazos',
].forEach(slug => {
  r301(slug,        '/catalogo.html?categoria=sets');
  r301(slug + '/', '/catalogo.html?categoria=sets');
});

// ─── Archivos estáticos ────────────────────────────────────────────────────
app.use(express.static(path.join(__dirname)));

app.listen(PORT, () => console.log(`Kontekas · puerto ${PORT}`));
