package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.PromotionFiliere;
import com.projet.gestion_stages.repository.PromotionFiliereRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// Centralise la gestion des promotions académiques, servant de structure de classification pour les étudiants
@Service
public class PromotionFiliereService {

    private final PromotionFiliereRepository promotionFiliereRepository;

    public PromotionFiliereService(PromotionFiliereRepository promotionFiliereRepository) {
        this.promotionFiliereRepository = promotionFiliereRepository;
    }

    // Accès à l'ensemble des promotions définies dans le système
    public List<PromotionFiliere> getAllPromotions() {
        return promotionFiliereRepository.findAll();
    }

    // Enregistrement d'une nouvelle promotion (ex: E4a, E5) dans la base de données
    public PromotionFiliere createPromotion(PromotionFiliere promotionFiliere) {
        return promotionFiliereRepository.save(promotionFiliere);
    }
}