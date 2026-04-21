package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {

    // Recherche par raison sociale (contient, insensible a la casse)
    List<Entreprise> findByRaisonSocialeContainingIgnoreCase(String raisonSociale);

    // Recherche par adresse (contient, insensible a la casse)
    List<Entreprise> findByAdresseContainingIgnoreCase(String adresse);

    // Recherche combinee : raison sociale OU adresse OU contact
    List<Entreprise> findByRaisonSocialeContainingIgnoreCaseOrAdresseContainingIgnoreCaseOrContactContainingIgnoreCase(
            String raisonSociale, String adresse, String contact);
}
