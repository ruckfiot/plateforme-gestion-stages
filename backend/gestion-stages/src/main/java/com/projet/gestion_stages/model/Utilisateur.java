package com.projet.gestion_stages.model;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class Utilisateur {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(unique = true, nullable = false)
    private String email;

    @Column(nullable = false)
    private String motDePasse; // Sera haché en base

    @Enumerated(EnumType.STRING)
    private Role role;

    // Par défaut, un compte créé est mis "EN_ATTENTE"
    @Column(nullable = false)
    private String statut = "EN_ATTENTE";
    // Les admins contournent l'attente (obligatoire pour le DataInitializer)
    public void setRole(Role role) {
        this.role = role;
        if (Role.ADMIN.equals(role)) {
            this.statut = "ACTIVE";
        }
    }
}