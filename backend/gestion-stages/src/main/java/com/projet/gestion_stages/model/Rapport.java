package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Rapport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRapport;

    private String nomFichier;
    private LocalDate dateDepot;
    private Double noteRapport;
    private String commentaire;
    private String etat;

    @OneToOne
    @JoinColumn(name = "idStage")
    private Stage stage;
}