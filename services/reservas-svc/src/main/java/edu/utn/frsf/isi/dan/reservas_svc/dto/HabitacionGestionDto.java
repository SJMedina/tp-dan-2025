package edu.utn.frsf.isi.dan.reservas_svc.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HabitacionGestionDto {
    private Long id;
    private Integer numero;
    private Integer piso;
    private Long tipoHabitacionId;
    private Long hotelId;
}
