# Plan de implementacion: carrito y ordenes (backend)

## 1. Alcance funcional
- Definir carrito como acumulador temporal de productos por usuario autenticado.
- Definir orden como snapshot inmutable generado al hacer checkout.
- Flujo base: obtener carrito → agregar items → actualizar cantidades → eliminar items → checkout → listar ordenes → ver detalle de orden.

## 2. Modelo de datos (Prisma)
### Cart
- Campos: `id`, `userId`, `createdAt`, `updatedAt`.
- Relacion 1:1 con `User` (un carrito activo por usuario).

### CartItem
- Campos: `id`, `cartId`, `productId`, `quantity`, `unitPrice`, `subtotal`.
- Indices: `cartId`, `productId` (unico compuesto para evitar duplicados).

### Order
- Campos: `id`, `userId`, `status`, `total`, `createdAt`, `updatedAt`.
- `status` sugerido: `pending`, `paid`, `cancelled`, `shipped`, `completed`.

### OrderItem
- Campos: `id`, `orderId`, `productId`, `quantity`, `unitPrice`, `subtotal`.

Reglas:
- `unitPrice` y `subtotal` se guardan en `OrderItem` al momento del checkout.

## 3. Reglas de negocio
- Totales calculados en backend (no confiar en el cliente).
- Validar stock al agregar y al checkout.
- Checkout con carrito vacio → 400.
- Orden creada es inmutable: no se editan items ni precios.
- Si stock insuficiente, devolver 409 o 400 segun criterio del proyecto.

## 4. API REST (endpoints y contratos)
### Carrito
- `GET /api/v1/cart` → carrito actual del usuario.
- `POST /api/v1/cart/items` → agregar item `{ productId, quantity }`.
- `PATCH /api/v1/cart/items/:id` → actualizar cantidad `{ quantity }`.
- `DELETE /api/v1/cart/items/:id` → eliminar item.
- `POST /api/v1/cart/checkout` → crea orden desde carrito.

### Ordenes
- `GET /api/v1/orders` → lista ordenes del usuario.
- `GET /api/v1/orders/:id` → detalle de orden (items + totales).

## 5. Validacion con Zod
- `addCartItemSchema`: `productId` positivo, `quantity` >= 1.
- `updateCartItemSchema`: `quantity` >= 1.
- `checkoutSchema`: vacio (solo autenticar).
- Errores consistentes con middleware: 400/401/404.

## 6. Implementacion (capas)
- Prisma: agregar modelos y migraciones.
- Model layer: funciones `findOrCreateCart`, `addItem`, `updateItem`, `removeItem`, `checkout`.
- Controllers: validar, llamar modelos, responder JSON con codigos.
- Routes: nuevos routers `cart.route.ts` y `order.route.ts`, montados en `routerApi`.

## 7. Tests con bun:test
- Flujo completo: crear carrito → agregar items → actualizar → checkout → listar ordenes.
- Casos borde: qty invalida, carrito vacio, producto inexistente, stock insuficiente.
- Verificar codigos y payloads.

## 8. Notas operativas
- Variables: `DATABASE_URL`, `JWT_SECRET`, `BASE_URL`.
- Seeds para productos de prueba si no existen.
