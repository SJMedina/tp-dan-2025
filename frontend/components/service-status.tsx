"use client"

import { useEffect, useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { RefreshCw, Server, Clock, Globe, CheckCircle2, XCircle, Loader2 } from "lucide-react"
import { API_ENDPOINTS, getUserUrl, getReservasUrl, getGestionUrl } from "@/lib/api-config"

interface ServiceInfo {
    server: string
    ip: string
    time: string
    timestamp: number
}

interface ServiceStatus {
    name: string
    port: string
    status: "online" | "offline" | "loading"
    info?: ServiceInfo
    error?: string
}

export function ServiceStatus() {
    const [services, setServices] = useState<ServiceStatus[]>([
        { name: "User Service", port: "8081", status: "loading" },
        { name: "Reservas Service", port: "8082", status: "loading" },
        { name: "Gestión Service", port: "8083", status: "loading" },
    ])
    const [isRefreshing, setIsRefreshing] = useState(false)

    const checkServices = async () => {
        setIsRefreshing(true)

        const fetchServiceInfo = async (url: string): Promise<{ info?: ServiceInfo; error?: string }> => {
            try {
                const response = await fetch(url, {
                    method: 'GET',
                    headers: { 'Accept': 'application/json' },
                })
                if (!response.ok) throw new Error(`HTTP ${response.status}`)
                const info = await response.json()
                return { info }
            } catch (error) {
                return { error: error instanceof Error ? error.message : "Error desconocido" }
            }
        }

        const [userResult, reservasResult, gestionResult] = await Promise.all([
            fetchServiceInfo(getUserUrl(API_ENDPOINTS.USER.INFO)),
            fetchServiceInfo(getReservasUrl(API_ENDPOINTS.RESERVAS.INFO)),
            fetchServiceInfo(getGestionUrl(API_ENDPOINTS.GESTION.INFO)),
        ])

        setServices([
            {
                name: "User Service",
                port: "8081",
                status: userResult.info ? "online" : "offline",
                info: userResult.info,
                error: userResult.error,
            },
            {
                name: "Reservas Service",
                port: "8082",
                status: reservasResult.info ? "online" : "offline",
                info: reservasResult.info,
                error: reservasResult.error,
            },
            {
                name: "Gestión Service",
                port: "8083",
                status: gestionResult.info ? "online" : "offline",
                info: gestionResult.info,
                error: gestionResult.error,
            },
        ])

        setIsRefreshing(false)
    }

    useEffect(() => {
        checkServices()
        // Auto-refresh cada 30 segundos
        const interval = setInterval(checkServices, 30000)
        return () => clearInterval(interval)
    }, [])

    const getStatusBadge = (status: ServiceStatus["status"]) => {
        switch (status) {
            case "online":
                return <Badge className="bg-green-500 hover:bg-green-600"><CheckCircle2 className="w-3 h-3 mr-1" /> Online</Badge>
            case "offline":
                return <Badge variant="destructive"><XCircle className="w-3 h-3 mr-1" /> Offline</Badge>
            case "loading":
                return <Badge variant="secondary"><Loader2 className="w-3 h-3 mr-1 animate-spin" /> Cargando</Badge>
        }
    }

    const onlineCount = services.filter(s => s.status === "online").length

    return (
        <Card>
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <div>
                        <CardTitle className="text-lg flex items-center gap-2">
                            <Server className="h-5 w-5" />
                            Estado de Microservicios
                        </CardTitle>
                        <CardDescription>
                            {onlineCount}/3 servicios activos
                        </CardDescription>
                    </div>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={checkServices}
                        disabled={isRefreshing}
                    >
                        <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
                        Actualizar
                    </Button>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid gap-3">
                    {services.map((service) => (
                        <div
                            key={service.name}
                            className="flex items-center justify-between p-3 rounded-lg border bg-card"
                        >
                            <div className="flex-1">
                                <div className="flex items-center gap-2">
                                    <span className="font-medium">{service.name}</span>
                                    <span className="text-xs text-muted-foreground">:{service.port}</span>
                                </div>
                                {service.info && (
                                    <div className="flex items-center gap-4 mt-1 text-xs text-muted-foreground">
                                        <span className="flex items-center gap-1">
                                            <Server className="h-3 w-3" />
                                            {service.info.server.substring(0, 12)}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Globe className="h-3 w-3" />
                                            {service.info.ip}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3 w-3" />
                                            {new Date(service.info.time).toLocaleTimeString()}
                                        </span>
                                    </div>
                                )}
                                {service.error && (
                                    <p className="text-xs text-destructive mt-1">{service.error}</p>
                                )}
                            </div>
                            <div className="ml-4">
                                {getStatusBadge(service.status)}
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    )
}

