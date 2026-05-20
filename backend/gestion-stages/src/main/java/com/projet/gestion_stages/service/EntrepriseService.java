package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Entreprise;
import com.projet.gestion_stages.repository.EntrepriseRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class EntrepriseService {
    
    private final EntrepriseRepository repository;
    
    public EntrepriseService(EntrepriseRepository repository) {
        this.repository = repository;
    }
    
    public List<Entreprise> getAllEntreprises() {
        return repository.findAll();
    }
    
    public Optional<Entreprise> getEntrepriseById(Long id) {
        return repository.findById(id);
    }
    
    public List<Entreprise> searchEntreprises(String query) {
        if (query == null || query.trim().isEmpty()) {
            return repository.findAll();
        }
        return repository.findByRaisonSocialeContainingIgnoreCaseOrAdresseContainingIgnoreCaseOrContactContainingIgnoreCase(
                query, query, query);
    }
    
    public Entreprise createEntreprise(Entreprise entreprise) {
        return repository.save(entreprise);
    }
    
    public Optional<Entreprise> updateEntreprise(Long id, Entreprise details) {
        return repository.findById(id).map(entreprise -> {
            entreprise.setRaisonSociale(details.getRaisonSociale());
            entreprise.setAdresse(details.getAdresse());
            entreprise.setContact(details.getContact());
            return repository.save(entreprise);
        });
    }
    
    public boolean deleteEntreprise(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }
}