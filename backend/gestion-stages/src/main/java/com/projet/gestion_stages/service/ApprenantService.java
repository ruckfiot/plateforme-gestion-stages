package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Apprenant;
import com.projet.gestion_stages.repository.ApprenantRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ApprenantService {

    private final ApprenantRepository apprenantRepository;

    public ApprenantService(ApprenantRepository apprenantRepository) {
        this.apprenantRepository = apprenantRepository;
    }

    public List<Apprenant> getAllApprenants() {
        return apprenantRepository.findAll();
    }

    public Apprenant createApprenant(Apprenant apprenant) {
        return apprenantRepository.save(apprenant);
    }

    // --- NOUVELLES MÉTHODES POUR VALIDER ET MODIFIER ---
    public Optional<Apprenant> updateApprenant(Long id, Apprenant details) {
        return apprenantRepository.findById(id).map(apprenant -> {
            apprenant.setNomApprenant(details.getNomApprenant());
            apprenant.setPrenomApprenant(details.getPrenomApprenant());
            
            if(details.getStatut() != null) {
                apprenant.setStatut(details.getStatut());
                // HYPER IMPORTANT : On valide aussi le compte de connexion !
                if (apprenant.getUtilisateur() != null) {
                    apprenant.getUtilisateur().setStatut(details.getStatut());
                }
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