package com.projet.gestion_stages.dto;

import lombok.Data;

// DTO DE REQUÊTE : Objet de transfert de données minimaliste pour le transport des credentials depuis le formulaire de connexion
@Data
public class LoginRequest {
    private String email;
    private String motDePasse;
}