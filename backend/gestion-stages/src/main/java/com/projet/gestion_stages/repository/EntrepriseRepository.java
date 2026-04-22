package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {
    // Recherche pour champ recherche
    List<Entreprise> findByRaisonSocialeContainingIgnoreCaseOrAdresseContainingIgnoreCaseOrContactContainingIgnoreCase(
            String raisonSociale, String adresse, String contact);
    
    List<Entreprise> findByRaisonSocialeContainingIgnoreCase(String raisonSociale);
}