package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Soutenance;
import com.projet.gestion_stages.repository.SoutenanceRepository;
import org.springframework.stereotype.Service;
import java.util.List;

@Service
public class SoutenanceService {
    
    private final SoutenanceRepository repository;
    
    public SoutenanceService(SoutenanceRepository repository) {
        this.repository = repository;
    }
    
    public List<Soutenance> getAllSoutenances() {
        return repository.findAll();
    }
    public Soutenance createSoutenance(Soutenance soutenance) {
        return repository.save(soutenance);
    }
    
    public Soutenance saveSoutenance(Soutenance soutenance) {
        return repository.save(soutenance);
    }
}