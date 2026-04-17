package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class Module {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idModule;

    private String code;
    private String libelle;

    @ManyToMany(mappedBy = "modulesEnseignes")
    @JsonIgnore
    private List<Enseignant> enseignants;
}