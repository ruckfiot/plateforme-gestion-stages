package com.projet.gestion_stages.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

// Représente le registre des partenaires professionnels accueillant des stagiaires
@Entity
@Data
public class Entreprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEntreprise;
    
    private String raisonSociale;
    private String adresse;
    private String contact;
    
    // Définit la capacité d'accueil de l'entreprise sur la durée, avec propagation des suppressions (Cascade) en cas de retrait du partenaire
    @OneToMany(mappedBy = "entreprise", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Stage> stagesRecus;
}