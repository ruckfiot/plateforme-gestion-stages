package com.projet.gestion_stages.model;
import com.fasterxml.jackson.annotation.JsonProperty;
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
    private String etat = "EN_COURS"; // EN_COURS, TERMINE, VALIDE
    
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
    
    private LocalDate dateSoutenance;
    
    // Champs calculés pour frontend (colonnes tableau)
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