package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Administrateur;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface AdministrateurRepository extends JpaRepository<Administrateur, Long> {
    // Méthodes magiques fournies par Spring Data JPA
}