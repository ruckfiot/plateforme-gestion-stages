package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Data
public class Soutenance {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idSoutenance;
    
    // Utilisation de LocalDateTime pour une planification à la minute près des jurys, évitant les conflits d'horaire
    private LocalDateTime dateSoutenance;
    private String salle;

    // Note et appréciation du jury, constituant les données finales de la soutenance
    private Double noteSoutenance;
    private String commentaireSoutenance;
    
    // Associe la soutenance à son stage d'origine, permettant de lier l'évaluation orale au rapport écrit
    @OneToOne
    @JoinColumn(name = "idStage")
    private Stage stage;
}