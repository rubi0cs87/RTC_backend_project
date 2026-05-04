# 🎮 Videogames Library API

API backend RESTful construida con **Node.js** y **Express** que permite a los usuarios explorar un catálogo de videojuegos y gestionar su biblioteca personal. Los administradores pueden gestionar el catálogo completo, incluyendo la subida de imágenes a Cloudinary.

---

## ✨ Funcionalidades

- Registro e inicio de sesión con autenticación **JWT**
- Control de acceso por roles: `user` y `admin`
- CRUD completo de videojuegos (escritura solo para admins)
- Subida de imágenes a **Cloudinary** (middleware multer)
- Biblioteca de juegos personal por usuario (añadir / eliminar)
- Borrado en cascada: al eliminar un videojuego, se borra también de la biblioteca de todos los usuarios
- Borrado de cuenta propio: los usuarios pueden eliminar su propia cuenta; los admins pueden eliminar cualquiera

---

## 🛠 Tecnologías

| Capa                       | Tecnología                             |
| -------------------------- | -------------------------------------- |
| Entorno de ejecución       | Node.js                                |
| Framework                  | Express 5                              |
| Base de datos              | MongoDB (Mongoose)                     |
| Autenticación              | JSON Web Tokens (jsonwebtoken)         |
| Hash de contraseñas        | bcrypt                                 |
| Almacenamiento de imágenes | Cloudinary + multer-storage-cloudinary |
| Configuración              | dotenv                                 |
| Servidor de desarrollo     | nodemon                                |

---

## 📁 Estructura del proyecto

```
├── index.js
└── src/
    ├── api/
    │   ├── controllers/
    │   │   ├── user.js
    │   │   └── videogames.js
    │   ├── models/
    │   │   ├── user.js
    │   │   └── videogames.js
    │   └── routes/
    │       ├── user.js
    │       └── videogames.js
    ├── config/
    │   ├── cloudinary.js
    │   └── db.js
    ├── data/
    │   └── videogames_data.js
    ├── middlewares/
    │   ├── file.js
    │   └── isAuth.js
    └── utils/
        ├── deletefile.js
        ├── jwt.js
        └── seeds/
            └── videogames.seed.js
```

---

## 🚀 Puesta en marcha

### Requisitos previos

- Node.js ≥ 18
- Un cluster de MongoDB Atlas (o instancia local de MongoDB)
- Una cuenta de Cloudinary

### Instalación

```bash
# 1. Clona el repositorio
git clone https://github.com/rubi0cs87/RTC_backend_project.git
cd RTC_backend_project

# 2. Instala las dependencias
npm install

# 3. Crea el fichero de variables de entorno
cp .env.example .env
# Rellena los valores (ver sección Variables de entorno)

# 4. (Opcional) Carga datos de prueba en la base de datos
npm run launchSeed

# 5. Arranca el servidor de desarrollo
npm run dev
```

La API estará disponible en `http://localhost:3000`.

---

## 🔑 Variables de entorno

Crea un fichero `.env` en la raíz del proyecto con las siguientes claves:

```env
DB_URL=<cadena_de_conexion_mongodb>
JWT_SECRET=<tu_secreto_jwt>

CLOUDINARY_CLOUD_NAME=<nombre_del_cloud>
CLOUDINARY_API_KEY=<api_key>
CLOUDINARY_API_SECRET=<api_secret>
```

---

## 📡 Referencia de la API

### URL base

```
http://localhost:3000/api
```

### 🔐 Autenticación

> Las rutas protegidas requieren la cabecera:
> `Authorization: Bearer <token>`

---

### Usuarios — `/api/user`

| Método   | Endpoint              | Acceso   | Descripción                                          |
| -------- | --------------------- | -------- | ---------------------------------------------------- |
| `POST`   | `/register`           | Público  | Crear una nueva cuenta de usuario                    |
| `POST`   | `/login`              | Público  | Iniciar sesión y obtener un JWT                      |
| `GET`    | `/`                   | 🔒 Auth  | Obtener todos los usuarios (con biblioteca incluida) |
| `PUT`    | `/change-role/:email` | 🔒 Admin | Promover un usuario de `user` a `admin`              |
| `PUT`    | `/library`            | 🔒 Auth  | Añadir un videojuego a la biblioteca propia          |
| `DELETE` | `/library`            | 🔒 Auth  | Eliminar un videojuego de la biblioteca propia       |
| `PUT`    | `/`                   | 🔒 Auth  | Actualizar el avatar del usuario autenticado         |
| `DELETE` | `/:email`             | 🔒 Auth  | Eliminar un usuario (solo admin o el propio usuario) |

#### Registro — `POST /api/user/register`

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

> Los usuarios siempre se crean con rol `user`. El primer administrador debe crearse directamente desde MongoDB Atlas.

#### Login — `POST /api/user/login`

```json
{
  "email": "usuario@ejemplo.com",
  "password": "contraseña123"
}
```

Respuesta:

```json
{
  "token": "<jwt>",
  "user": { ... }
}
```

#### Añadir a la biblioteca — `PUT /api/user/library`

```json
{
  "videogameId": "<id_objeto_mongodb>"
}
```

#### Eliminar de la biblioteca — `DELETE /api/user/library`

```json
{
  "videogameId": "<id_objeto_mongodb>"
}
```

#### Actualizar avatar — `PUT /api/user/`

Enviar como `multipart/form-data` con el campo `avatar` (archivo de imagen).

---

### Videojuegos — `/api/videogames`

| Método   | Endpoint | Acceso   | Descripción                                                |
| -------- | -------- | -------- | ---------------------------------------------------------- |
| `GET`    | `/`      | Público  | Obtener todos los videojuegos                              |
| `POST`   | `/`      | 🔒 Admin | Crear un nuevo videojuego (multipart/form-data)            |
| `PUT`    | `/:id`   | 🔒 Admin | Actualizar un videojuego (multipart/form-data)             |
| `DELETE` | `/:id`   | 🔒 Admin | Eliminar un videojuego y quitarlo de todas las bibliotecas |

#### Crear / Actualizar videojuego — `multipart/form-data`

| Campo          | Tipo    | Obligatorio |
| -------------- | ------- | ----------- |
| `title`        | string  | ✅          |
| `platform`     | string  | ✅          |
| `description`  | string  | ✅          |
| `price`        | number  | ✅          |
| `videogameImg` | archivo | ✅ (POST)   |

---

## 📦 Scripts NPM

| Script       | Comando                                   | Descripción                                              |
| ------------ | ----------------------------------------- | -------------------------------------------------------- |
| `start`      | `node index.js`                           | Arranca el servidor en producción                        |
| `dev`        | `nodemon index.js`                        | Arranca el servidor de desarrollo con recarga automática |
| `launchSeed` | `node src/utils/seeds/videogames.seed.js` | Carga datos de prueba en la base de datos                |

---

## 🗂 Modelos de datos

### Usuario

| Campo      | Tipo       | Notas                                         |
| ---------- | ---------- | --------------------------------------------- |
| `email`    | String     | Obligatorio, único                            |
| `password` | String     | Hasheado con bcrypt al guardar                |
| `role`     | String     | `"user"` (por defecto) \| `"admin"`           |
| `avatar`   | String     | URL de Cloudinary (default si no se sube)     |
| `library`  | ObjectId[] | Referencias a la colección `videogames`       |

### Videojuego

| Campo          | Tipo   | Notas                           |
| -------------- | ------ | ------------------------------- |
| `title`        | String | Obligatorio                     |
| `platform`     | String | Obligatorio                     |
| `description`  | String | Obligatorio                     |
| `price`        | Number | Obligatorio                     |
| `videogameImg` | String | Obligatorio — URL de Cloudinary |
