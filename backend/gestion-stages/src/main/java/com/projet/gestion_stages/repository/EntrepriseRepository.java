package com.projet.gestion_stages.repository;

import com.projet.gestion_stages.model.Entreprise;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface EntrepriseRepository extends JpaRepository<Entreprise, Long> {
    // Méthode utilisant la dérivation pour générer une clause WHERE complexe avec OR et ignoreCase, idéale pour les barres de recherche "tout terrain"
    List<Entreprise> findByRaisonSocialeContainingIgnoreCaseOrAdresseContainingIgnoreCaseOrContactContainingIgnoreCase(
            String raisonSociale, String adresse, String contact);
    
    // Méthode utilitaire pour le filtrage par nom exact (ou partiel) lors de la saisie utilisateur
    List<Entreprise> findByRaisonSocialeContainingIgnoreCase(String raisonSociale);
}