package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

// ENTITÉ DE DOCUMENTATION : Représente la trace numérique du travail fourni par l'apprenant (le PDF) et son évaluation pédagogique
@Entity
@Data
public class Rapport {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRapport;

    // Stocke uniquement le nom généré par FileStorageService pour isoler la couche de stockage binaire du modèle métier
    private String nomFichier;
    private LocalDate dateDepot;

    // Attributs portés par le rapport pour le suivi de la note finale par le tuteur
    private Double noteRapport;
    private String commentaire;

    // Indique le cycle de vie du rapport (DEPOSE, VALIDE, A_CORRIGER) pour guider le workflow métier
    private String etat = "DEPOSE";
    
    // Associe chaque rapport à un stage unique, permettant de retrouver facilement le contexte pédagogique du document
    @OneToOne
    @JoinColumn(name = "idStage")
    private Stage stage;
}