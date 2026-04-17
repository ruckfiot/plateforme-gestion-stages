package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Soutenance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface SoutenanceRepository extends JpaRepository<Soutenance, Long> {
}