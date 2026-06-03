package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.PromotionFiliere;
import com.projet.gestion_stages.service.PromotionFiliereService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
public class PromotionFiliereController {

    private final PromotionFiliereService promotionFiliereService;

    public PromotionFiliereController(PromotionFiliereService promotionFiliereService) {
        this.promotionFiliereService = promotionFiliereService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PromotionFiliere>> getPromotions() {
        return ResponseEntity.ok(promotionFiliereService.getAllPromotions());
    }

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionFiliere> addPromotion(@RequestBody PromotionFiliere promotion) {
        PromotionFiliere newPromotion = promotionFiliereService.createPromotion(promotion);
        return new ResponseEntity<>(newPromotion, HttpStatus.CREATED);
    }
}