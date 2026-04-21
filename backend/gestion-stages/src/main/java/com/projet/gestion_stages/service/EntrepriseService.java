package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Entreprise;
import com.projet.gestion_stages.repository.EntrepriseRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class EntrepriseService {

    private final EntrepriseRepository entrepriseRepository;

    public EntrepriseService(EntrepriseRepository entrepriseRepository) {
        this.entrepriseRepository = entrepriseRepository;
    }

    // Recupere toutes les entreprises
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    // Recupere une entreprise par son ID
    public Optional<Entreprise> getEntrepriseById(Long id) {
        return entrepriseRepository.findById(id);
    }

    // Recherche des entreprises par mot-cle (raison sociale, adresse ou contact)
    public List<Entreprise> searchEntreprises(String keyword) {
        if (keyword == null || keyword.trim().isEmpty()) {
            return entrepriseRepository.findAll();
        }
        return entrepriseRepository.findByRaisonSocialeContainingIgnoreCaseOrAdresseContainingIgnoreCaseOrContactContainingIgnoreCase(
                keyword, keyword, keyword);
    }

    // Cree une nouvelle entreprise
    public Entreprise createEntreprise(Entreprise entreprise) {
        return entrepriseRepository.save(entreprise);
    }

    // Met a jour une entreprise existante
    public Optional<Entreprise> updateEntreprise(Long id, Entreprise entrepriseDetails) {
        return entrepriseRepository.findById(id)
                .map(entreprise -> {
                    entreprise.setRaisonSociale(entrepriseDetails.getRaisonSociale());
                    entreprise.setAdresse(entrepriseDetails.getAdresse());
                    entreprise.setContact(entrepriseDetails.getContact());
                    return entrepriseRepository.save(entreprise);
                });
    }

    // Supprime une entreprise par son ID
    public boolean deleteEntreprise(Long id) {
        if (entrepriseRepository.existsById(id)) {
            entrepriseRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Verifie si une entreprise existe
    public boolean existsById(Long id) {
        return entrepriseRepository.existsById(id);
    }
}
