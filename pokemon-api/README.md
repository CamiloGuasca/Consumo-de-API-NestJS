# 🧩 Proyecto: Cliente CRUD con PokéAPI (NestJS)

## 📘 Descripción general

Este laboratorio implementa un **cliente CRUD (Create, Read, Update, Delete)** en **NestJS**, que consume datos reales desde la **PokéAPI ([https://pokeapi.co/](https://pokeapi.co/))** y simula operaciones de escritura (POST, PATCH, DELETE) en memoria. Esto cumple con los requerimientos del taller: construir un servicio CRUD completo sobre una API pública tipo catálogo.

---

##  Objetivo del Taller

Desarrollar un servicio NestJS capaz de:

*  Obtener **listas paginadas** de elementos desde una API pública.
*  Consultar **elementos por ID**.
*  Crear, actualizar y eliminar registros **simulados localmente** (ya que PokéAPI es solo lectura).
*  Implementar **DTOs** para validación de datos.
*  Gestionar **errores HTTP** como `NotFoundException` y `BadRequestException`.
*  Probar las operaciones en **Postman**.

---

##  Enfoque del desarrollo

La **PokéAPI** permite únicamente consultas (`GET`), por lo tanto, las operaciones de modificación (`POST`, `PATCH`, `DELETE`) se **simulan en memoria**, respetando la arquitectura y validaciones del framework NestJS.

De esta forma, se logra un cliente **híbrido**:

| Operación                   | Fuente                  | Descripción                                                              |
| --------------------------- | ----------------------- | ------------------------------------------------------------------------ |
| `GET /pokemon?limit&offset` | PokéAPI                 | Lista paginada real de pokémon.                                          |
| `GET /pokemon/:id`          | PokéAPI o memoria local | Consulta por id. Si el ID >= 10000, se busca en el almacenamiento local. |
| `POST /pokemon`             | Memoria local           | Crea un nuevo Pokémon simulado.                                          |
| `PATCH /pokemon/:id`        | Memoria local           | Actualiza parcialmente un Pokémon local.                                 |
| `DELETE /pokemon/:id`       | Memoria local           | Elimina un Pokémon local.                                                |

---

##  Instalación y ejecución

1️. Clonar el repositorio y cambiar a la carpeta del laboratorio:

```bash
git clone https://github.com/CamiloGuasca/Consumo-de-API-NestJS.git
cd Consumo-de-API-NestJS/pokemon-laboratorio/pokemon-api
```

2️. Instalar dependencias:

```bash
npm install
```

3️. Ejecutar el servidor NestJS:

```bash
npm run start:dev
```

4️. Verificar que el servicio está activo en:

```
http://localhost:5000
```





##  Endpoints y ejemplos

### 🔹 1. GET /pokemon (paginación)

Obtiene una lista paginada de Pokémon desde PokéAPI.

**Request:**

```
GET http://localhost:5000/pokemon?limit=5&offset=10
```

**Response (200 OK):**

```json
{
  "count": 1328,
  "results": [
    { "name": "metapod", "url": "https://pokeapi.co/api/v2/pokemon/11/" },
    { "name": "butterfree", "url": "https://pokeapi.co/api/v2/pokemon/12/" }
  ]
}
```

---

### 🔹 2. GET /pokemon/:id

Consulta un Pokémon específico. Si el ID pertenece a uno creado localmente (>=10000), se obtiene desde la memoria.

**Request:**

```
GET http://localhost:5000/pokemon/25
```

**Response:**

```json
{
  "id": 25,
  "name": "pikachu",
  "height": 4,
  "weight": 60
}
```

---

### 🔹 3. POST /pokemon

Crea un Pokémon local (simulado en memoria).

**Request:**

```
POST http://localhost:5000/pokemon
Content-Type: application/json

{
  "name": "dracozest",
  "height": 20,
  "weight": 180
}
```

**Response (201 Created):**

```json
{
  "id": 10000,
  "name": "dracozest",
  "height": 20,
  "weight": 180
}
```

---

### 🔹 4. PATCH /pokemon/:id

Actualiza parcialmente un Pokémon local.

**Request:**

```
PATCH http://localhost:5000/pokemon/10000
Content-Type: application/json

{
  "weight": 200
}
```

**Response:**

```json
{
  "id": 10000,
  "name": "dracozest",
  "height": 20,
  "weight": 200
}
```

---

### 🔹 5. DELETE /pokemon/:id

Elimina un Pokémon local.

**Request:**

```
DELETE http://localhost:5000/pokemon/10000
```

**Response:**

```json
{
  "deleted": true,
  "id": 10000
}
```

---

### 🔹 6. Manejo de errores

**Caso:** Pokémon no encontrado.

```
GET http://localhost:5000/pokemon/999999
```

**Response:**

```json
{
  "statusCode": 404,
  "message": "Pokémon 999999 no encontrado",
  "error": "Not Found"
}
```

**Caso:** Validación incorrecta (sin name en POST):

```json
{
  "statusCode": 400,
  "message": ["name should not be empty"],
  "error": "Bad Request"
}
```

---

## 🧪 Pruebas en Postman

Para facilitar las pruebas, se creó una colección Postman (`PokemonAPI.postman_collection.json`) que incluye:

| Método | Endpoint     | Descripción              |
| ------ | ------------ | ------------------------ |
| GET    | /pokemon     | Lista paginada           |
| GET    | /pokemon/:id | Detalle por id           |
| POST   | /pokemon     | Crear Pokémon local      |
| PATCH  | /pokemon/:id | Actualizar Pokémon local |
| DELETE | /pokemon/:id | Eliminar Pokémon local   |

Variables disponibles:

```text
baseUrl = http://localhost:5000
limit = 5
offset = 10
name = pikachu
```

---

## 🧱 DTOs y validaciones

| DTO                | Propósito                    | Validaciones principales                  |
| ------------------ | ---------------------------- | ----------------------------------------- |
| `CreatePokemonDto` | Crear nuevos Pokémon locales | `@IsString()`, `@IsInt()`, `@Min(1)`      |
| `UpdatePokemonDto` | Actualización parcial        | Hereda de `PartialType(CreatePokemonDto)` |
| `PaginationDto`    | Parámetros de paginación     | `@IsInt()`, `@Min(0)`                     |

Estas clases permiten asegurar que los datos recibidos cumplen con el formato esperado antes de procesarlos.

---

## ⚠️ Decisiones de diseño

1️⃣ **Híbrido (real + simulado)**: se optó por mantener los GET reales desde PokéAPI para aprovechar datos actualizados, y las operaciones de escritura simuladas localmente con IDs >= 10000.

2️⃣ **Validación estricta**: se aplicó `ValidationPipe` global para limpiar y validar entradas.

3️⃣ **Manejo centralizado de errores**: uso de excepciones estándar de NestJS (`BadRequestException`, `NotFoundException`).

4️⃣ **Escalabilidad**: el patrón de servicio-controlador permite cambiar fácilmente la API pública sin afectar la estructura del CRUD.


## 🧾 Conclusiones

* 🧩 La arquitectura modular de NestJS facilita crear APIs escalables y seguras.
* ⚙️ Aun cuando una API pública es de solo lectura, se pueden **simular operaciones CRUD** coherentes.
* ✅ Se demostró comprensión de **DTOs, controladores, servicios, validación y manejo de excepciones**.
* 🔍 Las pruebas en Postman verifican la correcta operación de todos los endpoints requeridos.

