# TangoFlix

TangoFlix es una aplicación web para explorar y gestionar tu colección de películas y series. Permite buscar contenido, crear listas de reproducción personalizadas, calificar contenido y más.

## 🚀 Requisitos Previos

Antes de comenzar, asegúrate de tener instalado:

- Node.js (v18 o superior)
- PostgreSQL (v14 o superior)
- npm o yarn

## 📦 Instalación

Una vez clonado el repositorio, se debe configurar el entorno de desarrollo:

### 1. Configurar el Backend (Server)

```bash
cd Server

# Instalar dependencias
npm install

# Crear archivo .env con las siguientes variables
DATABASE_URL=postgresql://usuario:contraseña@localhost:5432/tangoflix
PORT=4000
OMDB_API_KEY=tu_api_key_aqui

# Iniciar el servidor en modo desarrollo (en el directorio /Server)
node index.js
```

### 2. Configurar el Frontend (Cliente)

```bash
cd Cliente

# Instalar dependencias
npm install

# Iniciar el cliente en modo desarrollo (en el directorio /Cliente)
npm run dev
```

## 🎮 Uso de la Aplicación

1. **Registro e Inicio de Sesión**
   - Crea una cuenta nueva o inicia sesión con una existente
   - Se requiere inicio de sesión para funciones como watchlist y calificaciones

2. **Explorar Contenido**
   - Navega por películas y series
   - Usa los filtros por género
   - Utiliza la barra de búsqueda para encontrar contenido específico

3. **Gestión de Watchlist**
   - Agrega contenido a tu watchlist con el botón '+'
   - Remueve contenido con el botón '✓'
   - Accede a tu watchlist desde el menú de usuario

4. **Calificaciones y Comentarios**
   - Califica películas y series de 1 a 5 estrellas
   - Agrega comentarios a tus calificaciones
   - Ve las calificaciones y comentarios que realizadas por ese usuario

## 🛠️ Tecnologías Utilizadas

### Frontend
- Next.js
- React
- TypeScript
- Shadcn/ui
- Tailwind CSS

### Backend
- Node.js
- Express
- PostgreSQL
- Sequelize
- Winston (logging)

## 🏗️ Patrones de Diseño y Arquitectura

### Backend

1. **Arquitectura en Capas (N-Tier Architecture)**
   - **Controllers**: Manejo de requests HTTP y respuestas
   - **Services**: Lógica de negocio
   - **Repositories**: Acceso a datos y operaciones con la base de datos
   - **Models**: Definición de entidades y relaciones

2. **Repository Pattern**
   - Abstracción de la capa de datos
   - Separación de la lógica de acceso a datos
   - Implementado en `/repositories` para cada entidad

3. **Service Layer Pattern**
   - Encapsulación de la lógica de negocio
   - Mediador entre controllers y repositories
   - Implementado en `/Services` para cada dominio

4. **Singleton Pattern**
   - Utilizado en la configuración de la base de datos
   - Implementado en la conexión a PostgreSQL
   - Asegura una única instancia de conexión

5. **Factory Pattern**
   - Creación de instancias de modelos
   - Utilizado en la inicialización de modelos Sequelize

6. **Middleware Pattern**
   - Procesamiento de requests en cadena
   - Manejo de autenticación y logging
   - Validación de datos de entrada

7. **Observer Pattern**
   - Sistema de logging con Winston
   - Monitoreo de eventos y errores
   - Rotación diaria de logs


## 📝 Notas Adicionales

- La aplicación utiliza la API de OMDB para obtener información de películas y series
- Se requiere una clave de API de OMDB para el funcionamiento completo
- Los logs del servidor se guardan en la carpeta `Server/logs`

## 📊 Diagrama de Clases (UML)

```mermaid
classDiagram
    class User {
        +Integer id
        +String username
        +String fullName
        +String password
        +Boolean isAdmin
        +String profilePicture
        +validatePassword(password)
    }

    class Movie {
        +Integer id
        +String title
        +String year
        +String rated
        +String released
        +String runtime
        +String genre
        +String director
        +String writer
        +String actors
        +String plot
        +String language
        +String country
        +String awards
        +String poster
        +String type
    }

    class Rating {
        +Integer id
        +Integer userId
        +Integer movieId
        +Integer rating
        +String comment
        +Date createdAt
        +Date updatedAt
    }

    class WatchList {
        +Integer id
        +Integer userId
        +Integer movieId
        +Integer priority
        +Date createdAt
        +Date updatedAt
    }

    User "1" --o "*" Rating : tiene
    Movie "*" --o "*" Rating : recibe
    User "1" --o "1" WatchList : tiene
    Movie "*" --o "*" WatchList : incluye
    User "*" -- "*" Movie : califica
    User "*" -- "*" Movie : ve
