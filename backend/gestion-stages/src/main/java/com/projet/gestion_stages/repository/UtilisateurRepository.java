package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Utilisateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface UtilisateurRepository extends JpaRepository<Utilisateur, Long> {
    // Très important pour la connexion : trouver l'utilisateur par son email
    Optional<Utilisateur> findByEmail(String email);
}