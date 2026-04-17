package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Soutenance;
import com.projet.gestion_stages.repository.SoutenanceRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SoutenanceService {

    private final SoutenanceRepository soutenanceRepository;

    public SoutenanceService(SoutenanceRepository soutenanceRepository) {
        this.soutenanceRepository = soutenanceRepository;
    }

    public List<Soutenance> getAllSoutenances() {
        return soutenanceRepository.findAll();
    }

    public Soutenance createSoutenance(Soutenance soutenance) {
        return soutenanceRepository.save(soutenance);
    }
}