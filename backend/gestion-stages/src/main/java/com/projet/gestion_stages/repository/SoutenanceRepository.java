package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Soutenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface SoutenanceRepository extends JpaRepository<Soutenance, Long> {

    // Recherche de la soutenance par l'ID du stage
    Optional<Soutenance> findByStageIdStage(Long idStage);

    // Verifie si une soutenance existe pour un stage donne
    boolean existsByStageIdStage(Long idStage);

    // Recherche des soutenances par salle
    List<Soutenance> findBySalle(String salle);

    // Recherche des soutenances entre deux dates
    List<Soutenance> findByDateSoutenanceBetween(LocalDateTime debut, LocalDateTime fin);

    // Recherche des soutenances a venir
    @Query("SELECT s FROM Soutenance s WHERE s.dateSoutenance > :now ORDER BY s.dateSoutenance ASC")
    List<Soutenance> findUpcomingSoutenances(@Param("now") LocalDateTime now);
}
