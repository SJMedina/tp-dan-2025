package edu.utn.frsf.isi.dan.reservas_svc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HotelGestionDto {
    private Long id;
    private String nombre;
    private String cuit;
    private String domicilio;
    private Double latitud;
    private Double longitud;
    private String telefono;
    private String correoContacto;
    private Integer categoria;
}
