package com.projet.gestion_stages.dto;

import lombok.Data;

// DTO DE RÉPONSE SÉCURITAIRE : Structure de données légère contenant uniquement les informations vitales pour la session côté client
@Data
public class JwtResponse {
    private String token;
    private String email;
    private String role;
    private String statut;

    // CONSTRUCTEUR D'AUTHENTIFICATION : Agrège les éléments de sécurité (JWT) et les métadonnées métier (rôle/statut) dans un seul payload JSON
    public JwtResponse(String token, String email, String role, String statut) {
        this.token = token;
        this.email = email;
        this.role = role;
        this.statut = statut;
    }
}