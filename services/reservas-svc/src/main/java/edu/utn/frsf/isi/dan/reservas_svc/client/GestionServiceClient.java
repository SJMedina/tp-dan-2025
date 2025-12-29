package edu.utn.frsf.isi.dan.reservas_svc.client;

import edu.utn.frsf.isi.dan.reservas_svc.dto.HabitacionGestionDto;
import edu.utn.frsf.isi.dan.reservas_svc.dto.HotelGestionDto;
import org.springframework.cloud.openfeign.FeignClient;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

@FeignClient(name = "gestion-svc")
public interface GestionServiceClient {

    @GetMapping("/hoteles/{id}")
    HotelGestionDto getHotel(@PathVariable("id") Long id);

    @GetMapping("/habitaciones/{id}")
    HabitacionGestionDto getHabitacion(@PathVariable("id") Long id);
}

