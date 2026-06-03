package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Rapport;
import com.projet.gestion_stages.repository.RapportRepository;
import org.springframework.stereotype.Service;
import java.util.List;

// Centralise la gestion du cycle de vie des documents (rapports de stage) déposés par les apprenants
@Service
public class RapportService {
    
    private final RapportRepository repository;
    
    public RapportService(RapportRepository repository) {
        this.repository = repository;
    }
    
    // Accès à l'ensemble des rapports stockés dans la plateforme
    public List<Rapport> getAllRapports() {
        return repository.findAll();
    }
    
    // Méthode standard pour l'enregistrement initial d'un rapport
    public Rapport createRapport(Rapport rapport) {
        return repository.save(rapport);
    }
    
    // Méthode dédiée à la persistance (pourrait être étendue avec une logique de validation métier ou de journalisation)
    public Rapport saveRapport(Rapport rapport) {
        return repository.save(rapport);
    }
}