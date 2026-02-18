# Registro de cambios de pruebas

## Contexto
- Se configuraron entornos por comando con `--env-file` en `package.json`.
- Se aplicaron migraciones en la base de datos de prueba usando `DOTENV_CONFIG_PATH`.

## Problemas detectados en tests
- Endpoints protegidos por `authenticate` fallaban con 401 al no enviar cookie de auth.
- Tests de productos asumian datos existentes y un `id` fijo.
- Payloads de user/product no coincidian con los tipos actuales (`fullname`, `password`, `description`).
- Mensajes de error esperados no coincidian con el handler real.

## Soluciones aplicadas

### Autenticacion en tests
- Login previo en `beforeAll` y uso de `set-cookie` como `Cookie` en requests protegidos.

### Productos
- Seed controlado de producto para evitar dependencia del estado de la BD.
- Uso del `id` del seed en `GET /products/:id`.
- Ajuste de payload para crear producto (incluye `description`).
- Ajuste de expectativas de error a la estructura real (`error.message`).

### Usuarios
- Seed de usuario para login en tests.
- Payload de creacion con `fullname`, `email`, `password`.
- Headers con `Cookie` en todos los requests protegidos.

## Archivos modificados
- `src/tests/product.test.ts`
- `src/tests/user.test.ts`

## Comandos usados
- Ejecutar tests con env: `bun --env-file=.env.test.local test`
- Aplicar migraciones en test: `DOTENV_CONFIG_PATH=.env.test.local bun x prisma migrate deploy`

## Resultado
- 6/6 tests pasando.
