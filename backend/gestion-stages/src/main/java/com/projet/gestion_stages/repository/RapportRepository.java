package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Rapport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Interface JPA standard permettant la gestion complète du cycle de vie des rapports de stage (dépôt, édition, suppression)
@Repository
public interface RapportRepository extends JpaRepository<Rapport, Long> {
}