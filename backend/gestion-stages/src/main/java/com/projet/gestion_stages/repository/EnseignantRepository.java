package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Enseignant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface EnseignantRepository extends JpaRepository<Enseignant, Long> {
    Optional<Enseignant> findByUtilisateurEmail(String email);
}