package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.PromotionFiliere;
import com.projet.gestion_stages.repository.PromotionFiliereRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class PromotionFiliereService {

    private final PromotionFiliereRepository promotionFiliereRepository;

    public PromotionFiliereService(PromotionFiliereRepository promotionFiliereRepository) {
        this.promotionFiliereRepository = promotionFiliereRepository;
    }

    public List<PromotionFiliere> getAllPromotions() {
        return promotionFiliereRepository.findAll();
    }

    public PromotionFiliere createPromotion(PromotionFiliere promotionFiliere) {
        return promotionFiliereRepository.save(promotionFiliere);
    }
}