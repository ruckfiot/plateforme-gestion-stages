package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.PromotionFiliere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Interface permettant de manipuler l'ensemble des promotions académiques (ex: E4a, E5, etc.) au sein de la base de données
@Repository
public interface PromotionFiliereRepository extends JpaRepository<PromotionFiliere, Long> {
}