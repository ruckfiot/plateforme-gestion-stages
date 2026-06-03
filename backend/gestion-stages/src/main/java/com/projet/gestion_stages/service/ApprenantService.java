package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Apprenant;
import com.projet.gestion_stages.model.PromotionFiliere;
import com.projet.gestion_stages.repository.ApprenantRepository;
import com.projet.gestion_stages.repository.PromotionFiliereRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

// Centralise la gestion des apprenants et garantit l'intégrité relationnelle avec les promotions et les comptes utilisateurs
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

    // Associe l'apprenant à sa promotion dès sa création pour assurer une intégrité immédiate
    public Apprenant createApprenant(Apprenant apprenant, Long idPromotion) {
        
        if (idPromotion != null) {
            PromotionFiliere promo = promotionRepository.findById(idPromotion)
                    .orElseThrow(() -> new RuntimeException("Promotion introuvable"));
            apprenant.setPromotion(promo);
        }
        return apprenantRepository.save(apprenant);
    }
    
    // Gère la synchronisation bidirectionnelle entre le statut de l'apprenant et son compte utilisateur
    public Optional<Apprenant> updateApprenant(Long id, Apprenant details, Long idPromotion) {
        return apprenantRepository.findById(id).map(apprenant -> {
            apprenant.setNomApprenant(details.getNomApprenant());
            apprenant.setPrenomApprenant(details.getPrenomApprenant());
            apprenant.setNumEtudiant(details.getNumEtudiant()); 
            
            // Mise à jour du statut dans le profil Apprenant ET dans l'entité Utilisateur liée
            if(details.getStatut() != null) {
                apprenant.setStatut(details.getStatut());
                if (apprenant.getUtilisateur() != null) {
                    apprenant.getUtilisateur().setStatut(details.getStatut());
                }
            }

            // Gestion dynamique du changement de promotion ou détachement
            if (idPromotion != null) {
                PromotionFiliere promo = promotionRepository.findById(idPromotion)
                        .orElseThrow(() -> new RuntimeException("Promotion introuvable"));
                apprenant.setPromotion(promo);
            } else {
                apprenant.setPromotion(null);
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