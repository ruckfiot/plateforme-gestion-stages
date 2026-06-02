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
    private String statut = "EN_ATTENTE";

    // Liaison vers le compte de connexion
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_utilisateur", referencedColumnName = "id")
    private Utilisateur utilisateur;

    // Relations académiques
    @ManyToOne
    @JoinColumn(name = "id_promotion") 
    private PromotionFiliere promotion;

    @ManyToOne
    @JoinColumn(name = "id_admin") 
    private Administrateur administrateur;

    @OneToMany(mappedBy = "apprenant")
    @JsonIgnore
    private List<Stage> stages;
}