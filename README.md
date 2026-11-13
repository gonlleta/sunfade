# 🌊 Sunfade Supply — Web Oficial & Catálogo de Drops (`@sunfadesupply_`)

Página web estática diseñada a medida para **Sunfade Supply** (*Boardshorts Vintage · Paraná, Entre Ríos*). Pensada para el link de la bio de Instagram, con medidas reales en plano, links directos a cada prenda (`?prenda=SF-001`), vista previa Open Graph para WhatsApp y sistema de reserva vía DM / Grupo VIP.

---

## 🚀 Cómo ver la página en tu compu

Hacé doble clic directamente sobre `index.html` o entrá al servidor local si está corriendo (`http://localhost:4173`).

---

## ✏️ Cómo editar tus prendas y drops (`products.js`)

Todo el catálogo editable está concentrado en **`products.js`**:

1. **Marcar una bermuda como vendida (`SOLD OUT`)**:
   Buscá la prenda en `products.js` y cambiá:
   ```js
   available: false,
   ```
   Automáticamente aparece el sello **VENDIDO / SOLD OUT** y ya no permite reservarla.

2. **Subir un nuevo Drop**:
   - Guardá las fotos nuevas dentro de `assets/` (por ejemplo `assets/drop2-quiksilver.jpg`).
   - Copiá uno de los bloques en `products.js`, cambiá `id` (ej. `"SF-007"`), `name`, `brand`, `sizeLabel`, `waistCm`, `lengthCm`, `price` e `image`.

3. **Compartir el link directo de una prenda en Historias o en el Grupo**:
   Tocá el botón **🔗** en cualquier tarjeta o dentro de la ficha de una prenda para copiar su URL directa (ej. `https://gonlleta.github.io/sunfade/?prenda=SF-001`). Quien entre a ese link verá abierta automáticamente esa bermuda.
