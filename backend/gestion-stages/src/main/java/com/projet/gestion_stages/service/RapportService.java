package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Rapport;
import com.projet.gestion_stages.repository.RapportRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class RapportService {
    
    private final RapportRepository repository;
    
    public RapportService(RapportRepository repository) {
        this.repository = repository;
    }
    
    public List<Rapport> getAllRapports() {
        return repository.findAll();
    }
    
    public Rapport createRapport(Rapport rapport) {
        return repository.save(rapport);
    }
    
    public Rapport saveRapport(Rapport rapport) {
        return repository.save(rapport);
    }
}