package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

// Interface héritant de JpaRepository pour bénéficier des méthodes CRUD (Create, Read, Update, Delete) prêtes à l'emploi sans requêtes SQL manuelles
@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {}