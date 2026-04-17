package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.PromotionFiliere;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface PromotionFiliereRepository extends JpaRepository<PromotionFiliere, Long> {
}