package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class PromotionFiliere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPromotion;

    private String nom;
    private int annee;

    @OneToMany(mappedBy = "promotion")
    @JsonIgnore
    private List<Apprenant> apprenants;
}