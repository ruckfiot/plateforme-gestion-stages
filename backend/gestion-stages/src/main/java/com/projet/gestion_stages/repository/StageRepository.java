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
    
    // Par tuteur (vue tuteur)
    List<Stage> findByTuteurIdEnseignant(Long idTuteur);
    
    // Par apprenant (vue apprenant)
    List<Stage> findByApprenantIdApprenant(Long idApprenant);
    
    // Par entreprise
    List<Stage> findByEntrepriseIdEntreprise(Long idEntreprise);
    
    // Par état
    List<Stage> findByEtat(String etat);
    
    // Stage complet avec relations (évite N+1)
    @Query("SELECT s FROM Stage s " +
           "LEFT JOIN FETCH s.apprenant a " +
           "LEFT JOIN FETCH s.tuteur t " +
           "LEFT JOIN FETCH s.entreprise e " +
           "WHERE s.idStage = :id")
    Optional<Stage> findByIdWithRelations(@Param("id") Long id);
    
    // Tous les stages avec relations
    @Query("SELECT DISTINCT s FROM Stage s " +
           "LEFT JOIN FETCH s.apprenant a " +
           "LEFT JOIN FETCH s.tuteur t " +
           "LEFT JOIN FETCH s.entreprise e")
    List<Stage> findAllWithRelations();
}