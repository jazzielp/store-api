# Configuracion de entorno de pruebas (bun test + BD separada)

## Observaciones del repo (para que no te pises la BD normal)
- Prisma usa `process.env.DATABASE_URL` en `src/lib/prisma.ts`.
- Los tests levantan la app con `app.listen(...)` y usan `fetch`.
- `src/tests/user.test.ts` usa `BASE_URL` (por defecto `http://localhost:3000/api/v1`).
- `src/tests/product.test.ts` usa un puerto aleatorio (no necesita `BASE_URL`).

## Paso a paso

### 1) Defini una base de datos de prueba
Elegi un archivo distinto al de desarrollo. Ejemplo (SQLite/libsql local):

```
DATABASE_URL="file:./dev.test.db"
```

> Recomendacion: mantene el archivo de test en la raiz, por ejemplo `dev.test.db`.

### 2) Crea un archivo de entorno de pruebas
Crea un `.env.test` en la raiz con variables de test:

```
DATABASE_URL="file:./dev.test.db"
BASE_URL="http://localhost:3000/api/v1"
JWT_SECRET="test-secret"
```

> `JWT_SECRET` es necesario si tus rutas auth se usan en tests.

### 3) Aplica migraciones a la BD de prueba
Inicializa la BD de prueba usando las migraciones existentes:

```
DOTENV_CONFIG_PATH=.env.test bunx prisma migrate deploy
```

Si preferis, podes exportar variables manualmente:

```
DATABASE_URL="file:./dev.test.db" bunx prisma migrate deploy
```

### 4) Ejecuta los tests apuntando a la BD de prueba
Corre los tests usando el entorno de test:

```
DOTENV_CONFIG_PATH=.env.test bun test
```

Si no usas dotenv, podes hacerlo inline:

```
DATABASE_URL="file:./dev.test.db" BASE_URL="http://localhost:3000/api/v1" bun test
```

> Asegurate de que el puerto 3000 este libre si se usa `BASE_URL`.

### 5) Limpieza (opcional)
Para correr tests desde cero, borra el archivo `dev.test.db` y repeti el paso 3.

## Checklist rapido
- `DATABASE_URL` apunta a la BD de test.
- `BASE_URL` correcto para `user.test.ts`.
- Migraciones aplicadas en la BD de test.
- `bun test` corre sin tocar la BD normal.
