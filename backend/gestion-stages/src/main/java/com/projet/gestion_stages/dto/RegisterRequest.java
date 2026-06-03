package com.projet.gestion_stages.dto;

import lombok.Data;

// DTO D'INSCRIPTION : Objet contenant toutes les données nécessaires pour initialiser un nouvel utilisateur et son profil métier associé
@Data
public class RegisterRequest {
    private String nom;
    private String prenom;
    private String email;
    private String motDePasse;
    // RÔLE DYNAMIQUE : Ce champ est crucial pour le switch-case du contrôleur qui oriente la création vers Apprenant, Enseignant ou Administrateur
    private String role; // "APPRENANT", "ENSEIGNANT" ou "ADMIN"
}