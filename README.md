# 🌊 Sunfade Supply — Web Oficial & Catálogo de Drops (`@sunfadesupply_`)

Página web estática diseñada a medida para **Sunfade Supply** (*Boardshorts Vintage · Paraná, Entre Ríos*). Pensada para poner en el link de la bio de Instagram, mostrar cada *Supply Drop* con medidas reales en plano, destacar piezas `SOLD OUT` y recibir reservas listas por WhatsApp.

---

## 🚀 Cómo ver la página en tu compu

Hacé doble clic directamente sobre el archivo `index.html` para abrirla en Chrome o cualquier navegador. No requiere instalar nada.

---

## ✏️ Cómo editar tus prendas, precios y WhatsApp

Todo el contenido editable está concentrado en **`products.js`**:

1. **Activar envío directo a tu WhatsApp personal/comercial**:
   Abrí `products.js` y completá `whatsappPhone` con tu número en formato internacional sin `+` ni espacios:
   ```js
   whatsappPhone: "5493435123456",
   ```
   *(Mientras esté vacío, la web copia el pedido automáticamente al portapapeles y le ofrece al cliente pegarlo en tu DM de `@sunfadesupply_` o entrar al grupo de WhatsApp).*

2. **Marcar una bermuda como vendida (`SOLD OUT`)**:
   Buscá la prenda en `products.js` y cambiá:
   ```js
   available: false,
   ```
   Automáticamente aparece el sello **VENDIDO / SOLD OUT** y ya no deja reservarla.

3. **Subir un nuevo Drop**:
   - Guardá las fotos nuevas dentro de la carpeta `assets/` (por ejemplo `assets/drop2-quiksilver.jpg`).
   - Copiá uno de los bloques de producto en `products.js`, cambiá `id`, `name`, `brand`, `sizeLabel`, `waistCm`, `lengthCm`, `price` e `image`.

---

## 🌐 Cómo publicarla GRATIS en internet (Link para Instagram)

Al ser HTML + CSS + JS puro, podés subirla gratis en menos de 1 minuto:

### Opción más rápida: Netlify Drop (sin código)
1. Entrá a [app.netlify.com/drop](https://app.netlify.com/drop) y creá una cuenta gratuita.
2. Arrastrá la carpeta **`sunfade-supply`** entera adentro del recuadro en el navegador.
3. ¡Listo! Te da un link público (podés cambiarle el nombre gratis a `sunfadesupply.netlify.app` en *Site configuration → Change site name*) para pegar en la bio de Instagram.

