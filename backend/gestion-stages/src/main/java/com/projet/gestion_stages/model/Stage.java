package com.projet.gestion_stages.model;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDate;
import java.util.List;

@Entity
@Data // Génère automatiquement les getters, setters, toString, etc.
public class Stage {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idStage;
    
    private String sujet;
    private LocalDate dateDebut;
    private String duree;
    private String objectif;
    private String etat = "EN_COURS"; // EN_COURS, TERMINE, VALIDE
    private LocalDate dateSoutenance;
    private LocalDate dateLimiteRapport;
    
    @ManyToOne
    @JoinColumn(name = "idApprenant")
    private Apprenant apprenant;
    
    @ManyToOne
    @JoinColumn(name = "idAdministrateur")
    private Administrateur administrateur;

    @ManyToOne
    @JoinColumn(name = "idTuteur")
    private Enseignant tuteur;
    
    @ManyToOne
    @JoinColumn(name = "idEntreprise")
    private Entreprise entreprise;

    // Liaison avec la table Rapport
    @OneToMany(mappedBy = "stage")
    @JsonIgnoreProperties("stage") 
    private List<Rapport> rapports;

    // Liaison avec la table Soutenance
    @OneToMany(mappedBy = "stage")
    @JsonIgnoreProperties("stage") 
    private List<Soutenance> soutenances;
    
    // Variable de transport pour la modale React (reçue lors de l'update de l'admin)
    @Transient
    private String salleSoutenance;
    
    // Champs calculés pour le frontend (colonnes du tableau)
    @JsonProperty("nomTuteur")
    @Transient
    public String getNomTuteur() {
        return tuteur != null ? tuteur.getNomEnseignant() : "";
    }
    
    @JsonProperty("prenomTuteur")
    @Transient
    public String getPrenomTuteur() {
        return tuteur != null ? tuteur.getPrenomEnseignant() : "";
    }
    
    @JsonProperty("prenomApprenant")
    @Transient
    public String getPrenomApprenant() {
        return apprenant != null ? apprenant.getPrenomApprenant() : "";
    }
    
    @JsonProperty("nomApprenant")
    @Transient
    public String getNomApprenant() {
        return apprenant != null ? apprenant.getNomApprenant() : "";
    }
}