package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Module;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Interface JPA standard permettant la gestion complète du cycle de vie des modules de formation (CRUDS)
@Repository
public interface ModuleRepository extends JpaRepository<Module, Long> {
}