package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Stage;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StageRepository extends JpaRepository<Stage, Long> {

    // Recherche des stages par tuteur (enseignant)
    List<Stage> findByTuteurIdEnseignant(Long idEnseignant);

    // Recherche des stages par apprenant
    List<Stage> findByApprenantIdApprenant(Long idApprenant);

    // Recherche des stages par entreprise
    List<Stage> findByEntrepriseIdEntreprise(Long idEntreprise);

    // Recherche des stages par etat
    List<Stage> findByEtat(String etat);

    // Recherche d'un stage par son ID avec toutes les relations chargees
    @Query("SELECT s FROM Stage s " +
            "LEFT JOIN FETCH s.apprenant a " +
            "LEFT JOIN FETCH s.tuteur t " +
            "LEFT JOIN FETCH s.entreprise e " +
            "LEFT JOIN FETCH s.rapport r " +
            "LEFT JOIN FETCH s.soutenance so " +
            "WHERE s.idStage = :id")
    Optional<Stage> findByIdWithRelations(@Param("id") Long id);

    // Recupere tous les stages avec leurs relations (evite le probleme N+1)
    @Query("SELECT DISTINCT s FROM Stage s " +
            "LEFT JOIN FETCH s.apprenant a " +
            "LEFT JOIN FETCH s.tuteur t " +
            "LEFT JOIN FETCH s.entreprise e " +
            "LEFT JOIN FETCH s.rapport r " +
            "LEFT JOIN FETCH s.soutenance so")
    List<Stage> findAllWithRelations();

    // Recupere les stages d'un tuteur avec toutes les relations
    @Query("SELECT DISTINCT s FROM Stage s " +
            "LEFT JOIN FETCH s.apprenant a " +
            "LEFT JOIN FETCH s.tuteur t " +
            "LEFT JOIN FETCH s.entreprise e " +
            "LEFT JOIN FETCH s.rapport r " +
            "LEFT JOIN FETCH s.soutenance so " +
            "WHERE t.idEnseignant = :idTuteur")
    List<Stage> findByTuteurWithRelations(@Param("idTuteur") Long idTuteur);

    // Recupere les stages d'un apprenant avec toutes les relations
    @Query("SELECT DISTINCT s FROM Stage s " +
            "LEFT JOIN FETCH s.apprenant a " +
            "LEFT JOIN FETCH s.tuteur t " +
            "LEFT JOIN FETCH s.entreprise e " +
            "LEFT JOIN FETCH s.rapport r " +
            "LEFT JOIN FETCH s.soutenance so " +
            "WHERE a.idApprenant = :idApprenant")
    List<Stage> findByApprenantWithRelations(@Param("idApprenant") Long idApprenant);
}
