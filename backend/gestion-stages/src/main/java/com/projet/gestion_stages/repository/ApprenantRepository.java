package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Apprenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

// Spring génère automatiquement le SQL nécessaire pour naviguer dans la relation (Apprenant -> Utilisateur -> Email) sans écrire une seule ligne de code
@Repository
public interface ApprenantRepository extends JpaRepository<Apprenant, Long> {
    Optional<Apprenant> findByUtilisateurEmail(String email);
}