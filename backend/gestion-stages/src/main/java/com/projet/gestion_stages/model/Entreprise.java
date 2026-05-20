package com.projet.gestion_stages.model;
import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import java.util.List;

@Entity
@Data
public class Entreprise {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idEntreprise;
    
    private String raisonSociale;
    private String adresse;
    private String contact;
    
    @OneToMany(mappedBy = "entreprise", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Stage> stagesRecus;
}