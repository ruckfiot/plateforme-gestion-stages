package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Data
public class Soutenance {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSoutenance;

    private LocalDateTime dateSoutenance;
    private String salle;
    private Double noteSoutenance;
    private String commentaireSoutenance;

    @OneToOne
    @JoinColumn(name = "idStage")
    private Stage stage;
}