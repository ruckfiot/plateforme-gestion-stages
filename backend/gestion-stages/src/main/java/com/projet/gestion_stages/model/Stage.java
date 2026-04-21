package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;

@Entity
@Data
public class Stage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idStage;

    private LocalDate dateDebut;
    private String duree;
    private String objectif;
    private String etat; // En cours, Terminé, Validé, Refusé
    private String nomTuteur;
    private String prenomTuteur;

    @JsonProperty("nomTuteur")
    public String getNomTuteur() {
        return tuteur != null ? tuteur.getNomEnseignant() : "";
    }

    @JsonProperty("prenomTuteur")
    public String getPrenomTuteur() {
        return tuteur != null ? tuteur.getPrenomEnseignant() : "";
    }

    @ManyToOne
    @JoinColumn(name = "idApprenant")
    private Apprenant apprenant;

    @ManyToOne
    @JoinColumn(name = "idEnseignant")
    private Enseignant tuteur;

    @ManyToOne
    @JoinColumn(name = "idEntreprise")
    private Entreprise entreprise;

    @ManyToOne
    @JoinColumn(name = "idAdmin")
    private Administrateur administrateur;

    @OneToOne(mappedBy = "stage", cascade = CascadeType.ALL)
    private Rapport rapport;

    @OneToOne(mappedBy = "stage", cascade = CascadeType.ALL)
    private Soutenance soutenance;
}