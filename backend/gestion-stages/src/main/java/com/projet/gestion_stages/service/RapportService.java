package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Rapport;
import com.projet.gestion_stages.repository.RapportRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class RapportService {

    private final RapportRepository rapportRepository;

    public RapportService(RapportRepository rapportRepository) {
        this.rapportRepository = rapportRepository;
    }

    public List<Rapport> getAllRapports() {
        return rapportRepository.findAll();
    }

    public Rapport createRapport(Rapport rapport) {
        return rapportRepository.save(rapport);
    }
}