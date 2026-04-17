package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Apprenant;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface ApprenantRepository extends JpaRepository<Apprenant, Long> {
    // Spring Boot te donne déjà save(), findAll(), findById(), deleteById() gratuitement !
}