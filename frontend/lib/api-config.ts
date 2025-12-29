// Configuration for backend services via Gateway
// El Gateway (puerto 8080) es el punto de entrada único a todos los microservicios

const GATEWAY_URL = process.env.NEXT_PUBLIC_GATEWAY_URL || "http://localhost:8080"

export const API_ENDPOINTS = {
    // Servicio de Usuarios (user-svc) - via Gateway /users/*
    USER: {
        USERS: "/users/users",
        USERS_HUESPED: "/users/users/huesped",
        USERS_PROPIETARIO: "/users/users/propietario",
        BANCOS: "/users/bancos",
        INFO: "/users/info",
    },

    // Servicio de Reservas (reservas-svc) - via Gateway /reservas/*
    RESERVAS: {
        RESERVAS: "/reservas/reservas",
        HABITACIONES: "/reservas/habitaciones",
        HABITACIONES_BUSCAR: "/reservas/habitaciones/buscar",
        INFO: "/reservas/info",
    },

    // Servicio de Gestión (gestion-svc) - via Gateway /gestion/*
    GESTION: {
        HOTELES: "/gestion/hoteles",
        TIPOS_HABITACION: "/gestion/tipos-habitacion",
        TARIFAS: "/gestion/tarifas",
        HABITACIONES: "/gestion/habitaciones",
        INFO: "/gestion/info",
    }
}

// Helper functions - todas usan el Gateway
export const getUserUrl = (endpoint: string) => `${GATEWAY_URL}${endpoint}`
export const getReservasUrl = (endpoint: string) => `${GATEWAY_URL}${endpoint}`
export const getGestionUrl = (endpoint: string) => `${GATEWAY_URL}${endpoint}`

// Para debugging
export const getGatewayUrl = () => GATEWAY_URL

