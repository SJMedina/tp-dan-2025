# Docker - TP DAN 2025

Este directorio contiene todos los archivos necesarios para levantar el proyecto completo usando Docker.

## Arquitectura del Sistema

El proyecto implementa una arquitectura de microservicios con las siguientes características:

- **Service Discovery** con Netflix Eureka
- **API Gateway** con Spring Cloud Gateway
- **Mensajería asíncrona** con RabbitMQ
- **Observabilidad** con OpenTelemetry, Prometheus, Grafana, Tempo y Loki
- **Escalado horizontal** de microservicios

```
                                    ┌─────────────────────────────────────┐
                                    │         OBSERVABILIDAD              │
                                    │  ┌───────────┐  ┌───────────┐       │
                                    │  │Prometheus │  │  Grafana  │       │
                                    │  │   :9090   │  │   :3001   │       │
                                    │  └───────────┘  └───────────┘       │
                                    │  ┌───────────┐  ┌───────────┐       │
                                    │  │   Tempo   │  │   Loki    │       │
                                    │  │   :3200   │  │   :3100   │       │
                                    │  └───────────┘  └───────────┘       │
                                    │         ▲                           │
                                    │         │ OTel Collector :4317      │
                                    └─────────┼───────────────────────────┘
                                              │
┌─────────────┐     ┌─────────────────────────┼─────────────────────────────┐
│  Frontend   │     │                    API GATEWAY                        │
│  (Next.js)  │────▶│                      :8080                            │
│   :3000     │     │    ┌─────────────────────────────────────────────┐    │
└─────────────┘     │    │              EUREKA SERVER                  │    │
                    │    │                  :8761                      │    │
                    │    └─────────────────────────────────────────────┘    │
                    │         │              │              │               │
                    │         ▼              ▼              ▼               │
                    │    ┌─────────┐   ┌──────────┐   ┌──────────┐          │
                    │    │user-svc │   │reservas  │   │ gestion  │          │
                    │    │  :8081  │   │(escalable)│   │   :8083  │         │
                    │    └────┬────┘   └────┬─────┘   └────┬─────┘          │
                    │         │             │              │                │
                    │         │        RabbitMQ :5672      │                │
                    │         │             │              │                │
                    └─────────┼─────────────┼──────────────┼────────────────┘
                              ▼             ▼              ▼
                         ┌────────┐   ┌─────────┐   ┌──────────┐
                         │ MySQL  │   │ MongoDB │   │PostgreSQL│
                         │ :3306  │   │ :27017  │   │  :5432   │
                         └────────┘   └─────────┘   └──────────┘
```

## Requisitos

Asegurarse de tener instalado:

1. **Docker Desktop** (incluyendo Docker y Docker Compose)
2. **Java JDK 21** (https://adoptium.net/es/temurin/releases?version=21)
3. **Node.js 20+** (https://nodejs.org/)

> **Nota:** No es necesario instalar Maven. El proyecto incluye Maven Wrapper (`mvnw.cmd`).

## Paso a Paso para Levantar el Proyecto

### Paso 1: Clonar o Descomprimir el Proyecto

### Paso 2: Compilar la Librería Común y Componentes de Infraestructura

```bash
# Compilar librería común
cd common/dan-common-lib
./mvnw clean install -DskipTests
cd ../..

# Compilar Eureka Server
cd common/dan-eureka-server
./mvnw clean package -DskipTests
cd ../..

# Compilar Gateway
cd common/dan-spring-gateway
./mvnw clean package -DskipTests
cd ../..
```

En Windows usar `mvnw.cmd` en lugar de `./mvnw`:
```cmd
cd common\dan-common-lib
mvnw.cmd clean install -DskipTests
cd ..\..

cd common\dan-eureka-server
mvnw.cmd clean package -DskipTests
cd ..\..

cd common\dan-spring-gateway
mvnw.cmd clean package -DskipTests
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
cd common\dan-eureka-server; .\mvnw.cmd clean package -DskipTests; cd ..\..;
cd common\dan-spring-gateway; .\mvnw.cmd clean package -DskipTests; cd ..\..;
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

### Servicios Principales

| Servicio             | URL                    | Descripción                        |
|----------------------|------------------------|------------------------------------|
| **Frontend**         | http://localhost:3000  | Interfaz web principal             |
| **API Gateway**      | http://localhost:8080  | Punto de entrada único para APIs   |
| **Eureka Dashboard** | http://localhost:8761  | Service Discovery dashboard        |
| **User Service**     | http://localhost:8081  | API de usuarios (acceso directo)   |
| **Gestión Service**  | http://localhost:8083  | API de hoteles (acceso directo)    |

> **Nota:** El servicio de reservas no tiene puerto expuesto directamente para permitir escalado horizontal. Acceder siempre via Gateway.

### Administración de Bases de Datos

| Servicio           | URL                    | Descripción                        |
|--------------------|------------------------|------------------------------------|
| **phpMyAdmin**     | http://localhost:6080  | Admin MySQL (user-svc)             |
| **pgAdmin**        | http://localhost:6081  | Admin PostgreSQL (gestion-svc)     |
| **Mongo Express**  | http://localhost:6091  | Admin MongoDB (reservas-svc)       |

### Mensajería

| Servicio           | URL                    | Descripción                        |
|--------------------|------------------------|------------------------------------|
| **RabbitMQ Admin** | http://localhost:15672 | Consola de mensajería              |

### Observabilidad 

| Servicio           | URL                    | Descripción                        |
|--------------------|------------------------|------------------------------------|
| **Grafana**        | http://localhost:3001  | Dashboard de visualización         |
| **Prometheus**     | http://localhost:9090  | Métricas del sistema               |
| **Tempo**          | http://localhost:3200  | Trazas distribuidas (API)          |
| **Loki**           | http://localhost:3100  | Agregación de logs (API)           |

> **Nota:** Tempo y Loki no tienen interfaz web propia. Se acceden a través de Grafana.

### Acceso a APIs a través del Gateway

El Gateway (puerto 8080) enruta las peticiones a los microservicios con balanceo de carga:

| Ruta Gateway                       | Microservicio destino                 |
|------------------------------------|---------------------------------------|
| `http://localhost:8080/users/*`    | user-svc (usuarios, bancos)           |
| `http://localhost:8080/reservas/*` | reservas-svc (reservas, habitaciones) |
| `http://localhost:8080/gestion/*`  | gestion-svc (hoteles, tarifas)        |

**Ejemplo:**
- `GET http://localhost:8080/users/bancos` → `GET http://user-svc:8080/bancos`
- `GET http://localhost:8080/gestion/hoteles` → `GET http://gestion-svc:8080/hoteles`
- `GET http://localhost:8080/reservas/reservas` → `GET http://reservas-svc:8080/reservas` (con load balancing)

### Credenciales de Acceso

| Servicio           | Usuario         | Contraseña |
|--------------------|-----------------|------------|
| RabbitMQ           | admin           | admin      |
| Mongo Express      | admin           | admin      |
| pgAdmin            | admin@admin.com | admin      |
| MySQL (phpMyAdmin) | root            | rootpwd    |
| Grafana            | admin           | admin      |

## Features Implementadas

### Etapa 03 - Service Discovery y Gateway

- **Eureka Server**: Registro y descubrimiento de servicios
- **Spring Cloud Gateway**: Enrutamiento dinámico con load balancing
- Los microservicios se registran automáticamente en Eureka
- El Gateway usa `lb://` para balancear carga entre instancias

### Etapa 04 - Escalado Horizontal y Resiliencia

- **Reservas-svc escalable**: Puede tener múltiples instancias
- **RabbitMQ**: Mensajería asíncrona entre gestion-svc y reservas-svc
  - Cuando se crea/modifica/elimina una habitación en gestión, se envía mensaje a reservas
  - Con múltiples instancias, solo una recibe cada mensaje (competing consumers)
- **Comunicación inter-servicios**: reservas-svc consulta user-svc via Feign Client

Para escalar reservas-svc:
```bash
docker-compose up -d --scale reservas-svc=3
```

### Etapa 05 - Observabilidad con OpenTelemetry

Stack completo de observabilidad:

| Componente                  | Función                                                |
|-----------------------------|--------------------------------------------------------|
| **OpenTelemetry Collector** | Hub central que recibe telemetría y la distribuye      |
| **Prometheus**              | Almacena métricas (CPU, memoria, requests, latencia)   |
| **Tempo**                   | Almacena trazas distribuidas (seguimiento de requests) |
| **Loki**                    | Almacena logs centralizados                            |
| **Promtail**                | Recolecta logs de contenedores Docker                  |
| **Grafana**                 | Visualización unificada de métricas, trazas y logs     |

**Flujo de datos:**
```
Microservicios → OTel Collector → { Prometheus, Tempo, Loki } → Grafana
```

**Cómo usar Grafana:**
1. Acceder a http://localhost:3001 (admin/admin)
2. Ir a Explore
3. Seleccionar datasource:
   - **Prometheus**: Para ver métricas (`http_server_requests_seconds_count`, etc.)
   - **Tempo**: Para ver trazas distribuidas
   - **Loki**: Para buscar logs (`{container="user-svc"}`)

## Comandos Útiles

```bash
# Ver logs de todos los servicios
docker-compose logs -f

# Ver logs de un servicio específico
docker-compose logs -f gestion-svc

# Ver logs de observabilidad
docker-compose logs -f grafana prometheus tempo loki

# Detener todos los servicios
docker-compose down

# Detener y eliminar volúmenes (Borra todos los datos)
docker-compose down -v

# Escalar reservas-svc a 3 instancias
docker-compose up -d --scale reservas-svc=3

# Ver servicios registrados en Eureka
curl http://localhost:8761/eureka/apps

# Ver métricas de un servicio
curl http://localhost:8081/actuator/prometheus

# Verificar health de servicios
curl http://localhost:8080/actuator/health
```

## Troubleshooting

### Error: "port already in use"
Verifique que los puertos no estén en uso: 3000, 3001, 8080, 8081, 8083, 8761, 3306, 5432, 27017, 5672, 15672, 9090, 3100, 3200, 4317, 4318

### Error: "jar not found" al construir imagen
Asegúrese de haber compilado todos los componentes con Maven antes de ejecutar docker-compose:
- `common/dan-common-lib`
- `common/dan-eureka-server`
- `common/dan-spring-gateway`
- `services/user-svc`
- `services/reservas-svc`
- `services/gestion-svc`

### Error de CORS en el frontend
El Gateway tiene CORS configurado para `localhost:3000`. Si usa otra URL, modifique `common/dan-spring-gateway/src/main/resources/application-eureka.properties`.

### Grafana no muestra datos
1. Verificar que otel-collector esté corriendo: `docker-compose logs otel-collector`
2. Verificar que los servicios envíen telemetría: revisar logs de los microservicios
3. Esperar ~1 minuto para que Prometheus recolecte métricas


