package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Enseignant;
import com.projet.gestion_stages.repository.EnseignantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnseignantService {

    private final EnseignantRepository enseignantRepository;

    public EnseignantService(EnseignantRepository enseignantRepository) {
        this.enseignantRepository = enseignantRepository;
    }

    public List<Enseignant> getAllEnseignants() {
        return enseignantRepository.findAll();
    }

    public Enseignant createEnseignant(Enseignant enseignant) {
        return enseignantRepository.save(enseignant);
    }
}