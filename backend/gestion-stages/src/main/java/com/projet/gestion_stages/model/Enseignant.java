package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Enseignant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEnseignant;

    private String nomEnseignant;
    private String prenomEnseignant;
    private String matricule;
    private String specialite;
    private String matiere;
    //  Statut métier (EN_ATTENTE) pour valider l'habilitation des enseignants avant leur activation sur la plateforme
    private String statut = "EN_ATTENTE";

    // Liaison vers le compte de connexion
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_utilisateur", referencedColumnName = "id")
    private Utilisateur utilisateur;

    // Relations pédagogiques
    @ManyToOne
    @JoinColumn(name = "idAdmin")
    private Administrateur administrateur;

    // Utilise une table de jointure "affectation_module" pour lier dynamiquement les enseignants à leurs modules académiques
    @ManyToMany
    @JoinTable(
        name = "affectation_module",
        joinColumns = @JoinColumn(name = "idEnseignant"),
        inverseJoinColumns = @JoinColumn(name = "idModule")
    )
    private List<Module> modulesEnseignes;

    // Évite une boucle infinie lors du rendu JSON en ignorant la liste des stages encadrés par l'enseignant
    @OneToMany(mappedBy = "tuteur")
    @JsonIgnore
    private List<Stage> stagesEncadres;
}