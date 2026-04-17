package com.projet.gestion_stages.dto;

import lombok.Data;

@Data
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    private String role; // "APPRENANT", "ENSEIGNANT" ou "ADMIN"
}