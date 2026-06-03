package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// Interface dédiée à la persistance des enseignants, utilisant le mécanisme de dérivation de méthodes pour les recherches complexes
@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    // Spring Data JPA effectue automatiquement la jointure entre les tables Enseignant et Utilisateur pour isoler le profil par email
    Optional<Enseignant> findByUtilisateurEmail(String email);
}