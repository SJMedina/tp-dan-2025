# Docker - TP DAN 2025

Este directorio contiene todos los archivos necesarios para levantar el proyecto completo usando Docker.

## Requisitos

Asegurarse de tener instalado:

1. Docker Desktop (incluyendo Docker y Docker Compose)
2. Java JDK 21 (https://adoptium.net/es/temurin/releases?version=21&os=any&arch=any)
3. Node.js 20+ (https://nodejs.org/)

> **Nota:** No es necesario instalar Maven. El proyecto incluye Maven Wrapper (`mvnw.cmd`).

## Paso a Paso para Levantar el Proyecto

### Paso 1: Clonar o Descomprimir el Proyecto

### Paso 2: Compilar la Librería Común

```bash
cd common/dan-common-lib
./mvnw clean install -DskipTests
cd ../..
```

En Windows usar `mvnw.cmd` en lugar de `./mvnw`:
```cmd
cd common\dan-common-lib
mvnw.cmd clean install -DskipTests
cd ..\..
```

### Paso 3: Compilar los Microservicios

```bash
# Compilar user-svc
cd services/user-svc
./mvnw clean package -DskipTests
cd ../..

# Compilar reservas-svc
cd services/reservas-svc
./mvnw clean package -DskipTests
cd ../..

# Compilar gestion-svc
cd services/gestion-svc
./mvnw clean package -DskipTests
cd ../..
```

Comando alternativo para Windows PowerShell (todo en una línea):
```powershell
cd common\dan-common-lib; .\mvnw.cmd clean install -DskipTests; cd ..\..;
cd services\user-svc; .\mvnw.cmd clean package -DskipTests; cd ..\..;
cd services\reservas-svc; .\mvnw.cmd clean package -DskipTests; cd ..\..;
cd services\gestion-svc; .\mvnw.cmd clean package -DskipTests; cd ..\..
```

### Paso 4: Instalar Dependencias del Frontend

```bash
cd frontend
npm install
cd ..
```

### Paso 5: Levantar los Servicios con Docker

```bash
cd docker
docker-compose up --build
```

> **Nota:** La primera vez puede demorar varios minutos mientras descarga las imágenes y construye los contenedores.

Para ejecutar en segundo plano (modo detached):
```bash
docker-compose up --build -d
```


## URLs de Acceso

Una vez levantado, los servicios estarán disponibles en:

| Servicio             | URL                    | Descripción                    |
|----------------------|------------------------|--------------------------------|
| **Frontend**         | http://localhost:3000  | Interfaz web principal         |
| **User Service**     | http://localhost:8081  | API de usuarios                |
| **Reservas Service** | http://localhost:8082  | API de reservas (MongoDB)      |
| **Gestión Service**  | http://localhost:8083  | API de hoteles y habitaciones  |
| **RabbitMQ Admin**   | http://localhost:15672 | Consola de mensajería          |
| **phpMyAdmin**       | http://localhost:6080  | Admin MySQL (user-svc)         |
| **pgAdmin**          | http://localhost:6081  | Admin PostgreSQL (gestion-svc) |
| **Mongo Express**    | http://localhost:6091  | Admin MongoDB (reservas-svc)   |

### Credenciales de Acceso

| Servicio           | Usuario         | Contraseña |
|--------------------|-----------------|------------|
| RabbitMQ           | admin           | admin      |
| Mongo Express      | admin           | admin      |
| pgAdmin            | admin@admin.com | admin      |
| MySQL (phpMyAdmin) | root            | rootpwd    |

## Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f gestion-svc

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (Borra todos los datos)
docker-compose down -v

```

## Arquitectura del Sistema

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│  Frontend   │────▶│ User Svc    │────▶│   MySQL     │
│  (Next.js)  │     │  :8081      │     │   :3306     │
│   :3000     │     └─────────────┘     └─────────────┘
│             │
│             │     ┌─────────────┐     ┌─────────────┐
│             │────▶│ Reservas    │────▶│  MongoDB    │
│             │     │  :8082      │     │   :27017    │
│             │     └──────┬──────┘     └─────────────┘
│             │            │
│             │            │ RabbitMQ
│             │            ▼
│             │     ┌─────────────┐     ┌─────────────┐
│             │────▶│ Gestión     │────▶│ PostgreSQL  │
│             │     │  :8083      │     │   :5432     │
└─────────────┘     └─────────────┘     └─────────────┘
```

## Troubleshooting

### Error: "port already in use"
Verifique que los puertos 3000, 8081, 8082, 8083, 3306, 5432, 27017, 5672, 15672 no estén en uso.

### Error: "jar not found" al construir imagen
Asegúrese de haber compilado los microservicios con Maven antes de ejecutar docker-compose.

### Los servicios no se conectan entre sí
Espere 1-2 minutos adicionales. Los healthchecks aseguran que las dependencias estén listas antes de iniciar los servicios.

### Error de CORS en el frontend
Los microservicios ya tienen CORS configurado para localhost:3000. Si usa otra URL, deberá modificar la configuración CORS en cada servicio.

