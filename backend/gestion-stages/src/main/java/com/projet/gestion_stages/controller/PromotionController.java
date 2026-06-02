package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.PromotionFiliere;
import com.projet.gestion_stages.repository.PromotionFiliereRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
public class PromotionController {

    private final PromotionFiliereRepository promotionRepository;

    public PromotionController(PromotionFiliereRepository promotionRepository) {
        this.promotionRepository = promotionRepository;
    }

    // Récupère la liste dynamique pour le menu déroulant React
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PromotionFiliere>> getAllPromotions() {
        return ResponseEntity.ok(promotionRepository.findAll());
    }
}