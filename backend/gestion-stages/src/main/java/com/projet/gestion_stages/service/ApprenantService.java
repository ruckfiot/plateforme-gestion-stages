package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Apprenant;
import com.projet.gestion_stages.repository.ApprenantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ApprenantService {

    private final ApprenantRepository apprenantRepository;

    // Injection de dépendance via le constructeur
    public ApprenantService(ApprenantRepository apprenantRepository) {
        this.apprenantRepository = apprenantRepository;
    }

    // Méthode pour récupérer tous les apprenants
    public List<Apprenant> getAllApprenants() {
        return apprenantRepository.findAll();
    }

    // Méthode pour ajouter un nouvel apprenant
    public Apprenant createApprenant(Apprenant apprenant) {
        return apprenantRepository.save(apprenant);
    }
}