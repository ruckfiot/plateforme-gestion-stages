package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Apprenant;
import com.projet.gestion_stages.service.ApprenantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// CORS POLICY : Autorise les requêtes cross-origin du client React vers l'API Spring Boot pour éviter les blocages de sécurité du navigateur
@RestController
@RequestMapping("/api/apprenants")
@CrossOrigin(origins = "*") 
public class ApprenantController {

    private final ApprenantService apprenantService;

    public ApprenantController(ApprenantService apprenantService) {
        this.apprenantService = apprenantService;
    }

    @GetMapping
    public ResponseEntity<List<Apprenant>> getApprenants() {
        return ResponseEntity.ok(apprenantService.getAllApprenants());
    }

    // SÉCURITÉ MÉTHODE : Le filtre vérifie le rôle (extrait du token JWT) et bloque l'exécution (403 Forbidden) pour tout utilisateur non-Admin
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Apprenant> createApprenant(
            @RequestBody Apprenant apprenant, 
            // LIAISON RELATIONNELLE : Paramètre d'URL optionnel (?idPromotion=X) récupéré pour instruire la jointure JPA côté serveur
            @RequestParam(required = false) Long idPromotion) { 
        Apprenant created = apprenantService.createApprenant(apprenant, idPromotion);
        return ResponseEntity.ok(created);
    }

    // --- NOUVELLES ROUTES POUR VALIDER/MODIFIER/SUPPRIMER ---
    // Unification de la validation du compte (sécurité) et de la modification académique (promotion) sur une même route REST
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Apprenant> updateApprenant(
            @PathVariable Long id, 
            @RequestBody Apprenant details, 
            @RequestParam(required = false) Long idPromotion) { 
        
        // PROGRAMMATION FONCTIONNELLE : Utilisation de l'API Optional de Java pour mapper élégamment le résultat en 200 OK ou 404 Not Found
        return apprenantService.updateApprenant(id, details, idPromotion)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApprenant(@PathVariable Long id) {
        if(apprenantService.deleteApprenant(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}