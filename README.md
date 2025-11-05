# Sistema ASHOGA

Este repositorio contendrá el código del sistema.

## Instalación de Dependencias

En primer lugar instalar pNPM con el comando `npm install -g pnpm@latest-10`.

Acto seguido ejecutar `pnpm i` dentro del proyecto.

## Preparando Entorno de Desarrollo

Se deben configurar variables de entorno para Better Auth y Turso y acto seguido inicializar las tablas con Drizzle.

### Better Auth

Para que esta librer'ia funcione se necesitan dos variables de entorno `BETTER_AUTH_URL` que en modo desarrollo es `http://localhost:3000` y `BETTER_AUTH_SECRET` que se pude obtener desde la web de Better Auth ([aqui](https://www.better-auth.com/docs/installation#set-environment-variables)) con esto el archivo `.env` debe verse de la siguiente manera:

```.env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=YOUR_AUTH_SECRET
```

### Turso

Al igual que Better Auth, Turso necesita dos variables de entorno, en este caso `TURSO_DATABASE_URL` y `TURSO_AUTH_TOKEN` ambos pueden obtenerse al crear una base de datos en Turso en la pestaña `overview` de la base de datos en cuestión en el apartado `Connect` (notese que es necesario crear una cuenta de Turso). una vez obtenidas las credenciales de Turso el archivo `.env` debe quedar de la siguiente manera:

```.env
BETTER_AUTH_URL=http://localhost:3000
BETTER_AUTH_SECRET=YOUR_AUTH_SECRET
TURSO_DATABASE_URL=YOUR_TURSO_DB_URL
TURSO_AUTH_TOKEN=YOUR_TURSO_TOKEN
```

### Inicializando Tablas

Para hacer esto es tan simple como ejecutar `npx drizzle-kit push`

## Ejecutando el Sistema

Con el entorno ya configurado nos dirigimos a nuestra terminal y ejecutamos `pnpm dev`, ahora el sistema se estará ejecutando en [http://localhost:3000](http://localhost:3000)


## Julián
## Usuario predefinido

Una vez levantado el sistema, se abre el login. Para que la base de datos crea un usuario predeterminado, se aprieta el boton 'INIT DB'
Se crea el usuario:
email: demo@gmail.com
password {cualquier contrasña}

## Una vez iniciado sesión...

Apretar el boton que se encuentra en la parte inferior derecha 'CREATE DEFAULT TASKS'