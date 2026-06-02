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
    
    public java.util.Optional<Apprenant> updateApprenant(Long id, Apprenant details) {
        return apprenantRepository.findById(id).map(apprenant -> {
            apprenant.setNomApprenant(details.getNomApprenant());
            apprenant.setPrenomApprenant(details.getPrenomApprenant());
            apprenant.setNumEtudiant(details.getNumEtudiant());
            apprenant.setPromo(details.getPromo());
            
            // On met à jour le statut (EN_ATTENTE -> VALIDE)
            if(details.getStatut() != null) {
                apprenant.setStatut(details.getStatut());
            }
            
            return apprenantRepository.save(apprenant);
        });
    }

    public boolean deleteApprenant(Long id) {
        if(apprenantRepository.existsById(id)) {
            apprenantRepository.deleteById(id);
            return true;
        }
        return false;
    }
}