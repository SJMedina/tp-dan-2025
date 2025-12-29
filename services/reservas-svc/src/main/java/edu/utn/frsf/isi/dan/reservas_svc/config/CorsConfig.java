package edu.utn.frsf.isi.dan.reservas_svc.config;

import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

/**
 * CORS deshabilitado en el microservicio.
 * El Gateway (dan-spring-gateway) se encarga de manejar CORS centralizadamente.
 * Si se accede directamente al microservicio sin pasar por el Gateway,
 * descomentar la anotación @Configuration.
 */
// @Configuration  // Deshabilitado - CORS manejado por Gateway
public class CorsConfig implements WebMvcConfigurer {

    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOriginPatterns("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
