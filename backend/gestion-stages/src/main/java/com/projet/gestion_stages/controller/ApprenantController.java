package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Apprenant;
import com.projet.gestion_stages.service.ApprenantService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

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

    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Apprenant> createApprenant(
            @RequestBody Apprenant apprenant, 
            @RequestParam(required = false) Long idPromotion) { 
        Apprenant created = apprenantService.createApprenant(apprenant, idPromotion);
        return ResponseEntity.ok(created);
    }

    // --- NOUVELLES ROUTES POUR VALIDER/MODIFIER/SUPPRIMER ---
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Apprenant> updateApprenant(
            @PathVariable Long id, 
            @RequestBody Apprenant details, 
            @RequestParam(required = false) Long idPromotion) { 
        
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