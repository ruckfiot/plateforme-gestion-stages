package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;
import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

//  Définit le référentiel des promotions (ex: "Master 1 Cyber", 2026), servant de filtre primaire pour l'administration
@Entity
@Data
public class PromotionFiliere {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idPromotion;

    private String nom;
    private int annee;

    // Établit le lien parent-enfant entre une promotion et sa liste d'apprenants, facilitant le reporting pédagogique
    @OneToMany(mappedBy = "promotion")
    // Empêche la récursion infinie lors de l'appel API "getPromotion", évitant d'inclure inutilement toute la liste des élèves à chaque requête
    @JsonIgnore
    private List<Apprenant> apprenants;
}