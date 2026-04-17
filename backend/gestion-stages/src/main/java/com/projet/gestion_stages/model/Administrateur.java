package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Administrateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idAdmin;

    private String nomAdmin;
    private String prenomAdmin;

    // Liaison vers le compte de connexion
    @OneToOne(cascade = CascadeType.ALL)
    @JoinColumn(name = "id_utilisateur", referencedColumnName = "id")
    private Utilisateur utilisateur;

    // Relations de gestion
    @OneToMany(mappedBy = "administrateur")
    @JsonIgnore
    private List<Apprenant> apprenants;

    @OneToMany(mappedBy = "administrateur")
    @JsonIgnore
    private List<Enseignant> enseignants;

    @OneToMany(mappedBy = "administrateur")
    @JsonIgnore
    private List<Stage> stagesCrees;
}