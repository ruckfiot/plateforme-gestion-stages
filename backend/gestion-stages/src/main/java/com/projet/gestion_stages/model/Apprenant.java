package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Apprenant {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idApprenant;

    private String nomApprenant;
    private String prenomApprenant;
    private String numEtudiant;
    //  Variable de contrôle du workflow qui permet de bloquer l'accès aux fonctionnalités de stage tant que le compte n'est pas validé par l'Admin
    private String statut = "EN_ATTENTE";

    // Liaison vers le compte de connexion. Associe chaque étudiant à une promotion unique, facilitant les requêtes de filtrage par filière dans l'API
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_utilisateur", referencedColumnName = "id")
    private Utilisateur utilisateur;

    // Relations académiques
    @ManyToOne
    @JoinColumn(name = "id_promotion") 
    private PromotionFiliere promotion;

    // Trace l'administrateur responsable du cycle de vie de cet apprenant (validation, édition, suppression)
    @ManyToOne
    @JoinColumn(name = "id_admin") 
    private Administrateur administrateur;

    // @JsonIgnore prévient ici encore la récursion infinie en coupant la sérialisation descendante vers la liste des stages de l'étudiant
    @OneToMany(mappedBy = "apprenant")
    @JsonIgnore
    private List<Stage> stages;
}