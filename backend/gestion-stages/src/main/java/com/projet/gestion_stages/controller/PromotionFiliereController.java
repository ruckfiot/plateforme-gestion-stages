package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.PromotionFiliere;
import com.projet.gestion_stages.service.PromotionFiliereService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// API ACADÉMIQUE : Point d'accès REST dédié à la gestion du référentiel des classes, garantissant l'isolation du modèle de données
@RestController
@RequestMapping("/api/promotions")
@CrossOrigin(origins = "*")
public class PromotionFiliereController {

    private final PromotionFiliereService promotionFiliereService;

    // IMMUTABILITÉ : Injection de dépendance par constructeur certifiant que le service ne sera jamais réinstancié ou altéré en cours d'exécution
    public PromotionFiliereController(PromotionFiliereService promotionFiliereService) {
        this.promotionFiliereService = promotionFiliereService;
    }

    // SÉCURITÉ GRANULAIRE : Contrairement à @PreAuthorize sur la classe entière, le verrouillage par méthode permet de garder la flexibilité d'ouvrir d'autres routes à l'avenir
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<PromotionFiliere>> getPromotions() {
        return ResponseEntity.ok(promotionFiliereService.getAllPromotions());
    }

    // CONTRÔLE D'INTÉGRITÉ : Vérifie la validité du JWT Admin dans le SecurityContext avant d'autoriser l'insertion d'une nouvelle promotion en base
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<PromotionFiliere> addPromotion(@RequestBody PromotionFiliere promotion) {
        PromotionFiliere newPromotion = promotionFiliereService.createPromotion(promotion);
        return new ResponseEntity<>(newPromotion, HttpStatus.CREATED);
    }
}