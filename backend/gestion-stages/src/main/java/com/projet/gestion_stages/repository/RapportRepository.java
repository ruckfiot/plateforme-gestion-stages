package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface RapportRepository extends JpaRepository<Rapport, Long> {

    // Recherche du rapport par l'ID du stage
    Optional<Rapport> findByStageIdStage(Long idStage);

    // Verifie si un rapport existe pour un stage donne
    boolean existsByStageIdStage(Long idStage);
}
