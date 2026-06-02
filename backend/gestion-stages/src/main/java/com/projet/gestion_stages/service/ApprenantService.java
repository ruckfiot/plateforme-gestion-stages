package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Apprenant;
import com.projet.gestion_stages.model.PromotionFiliere;
import com.projet.gestion_stages.repository.ApprenantRepository;
import com.projet.gestion_stages.repository.PromotionFiliereRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class ApprenantService {

    private final ApprenantRepository apprenantRepository;
    private final PromotionFiliereRepository promotionRepository;

    // On garde l'injection de dépendances complète (Ta version)
    public ApprenantService(ApprenantRepository apprenantRepository, PromotionFiliereRepository promotionRepository) {
        this.apprenantRepository = apprenantRepository;
        this.promotionRepository = promotionRepository;
    }

    public List<Apprenant> getAllApprenants() {
        return apprenantRepository.findAll();
    }

    // On garde ta signature avec idPromotion
    public Apprenant createApprenant(Apprenant apprenant, Long idPromotion) {
        // --- NOUVEAUTÉ : Gestion de la promotion à la création ---
        if (idPromotion != null) {
            PromotionFiliere promo = promotionRepository.findById(idPromotion)
                    .orElseThrow(() -> new RuntimeException("Promotion introuvable"));
            apprenant.setPromotion(promo);
        }
        return apprenantRepository.save(apprenant);
    }
    
    // FUSION : On garde ton idPromotion + numEtudiant, ET la validation du main
    public Optional<Apprenant> updateApprenant(Long id, Apprenant details, Long idPromotion) {
        return apprenantRepository.findById(id).map(apprenant -> {
            apprenant.setNomApprenant(details.getNomApprenant());
            apprenant.setPrenomApprenant(details.getPrenomApprenant());
            apprenant.setNumEtudiant(details.getNumEtudiant()); // Ta modification
            
            // Modification venant du main : On valide aussi le compte de connexion !
            if(details.getStatut() != null) {
                apprenant.setStatut(details.getStatut());
                if (apprenant.getUtilisateur() != null) {
                    apprenant.getUtilisateur().setStatut(details.getStatut());
                }
            }

            // --- NOUVEAUTÉ : Gestion de la promotion à la modification ---
            if (idPromotion != null) {
                PromotionFiliere promo = promotionRepository.findById(idPromotion)
                        .orElseThrow(() -> new RuntimeException("Promotion introuvable"));
                apprenant.setPromotion(promo);
            } else {
                apprenant.setPromotion(null);
            }
            // -------------------------------------------------------------
            
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