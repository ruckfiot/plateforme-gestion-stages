package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Entreprise;
import com.projet.gestion_stages.service.EntrepriseService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

/**
 * Contrôleur REST pour la gestion des entreprises partenaires (Admin uniquement)
 * Endpoints pour CRUD + recherche
 */
@RestController
@RequestMapping("/api/entreprises")
@CrossOrigin(origins = "*")
public class EntrepriseController {

    private final EntrepriseService entrepriseService;

    @Autowired
    public EntrepriseController(EntrepriseService entrepriseService) {
        this.entrepriseService = entrepriseService;
    }

    // Liste toutes les entreprises - Admin
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Entreprise>> getAllEntreprises() {
        return ResponseEntity.ok(entrepriseService.getAllEntreprises());
    }

    // Recherche par raison sociale/adresse/contact - Admin
    @GetMapping("/search")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Entreprise>> searchEntreprises(@RequestParam String query) {
        return ResponseEntity.ok(entrepriseService.searchEntreprises(query));
    }

    // Détail d'une entreprise - Admin
    @GetMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Entreprise> getEntrepriseById(@PathVariable Long id) {
        return entrepriseService.getEntrepriseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Création entreprise (bouton + popup) - Admin
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createEntreprise(@RequestBody Entreprise entreprise) {
        try {
            Entreprise saved = entrepriseService.createEntreprise(entreprise);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("entreprise", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", "Erreur création: " + e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // Modification entreprise (bouton ligne) - Admin
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateEntreprise(@PathVariable Long id, @RequestBody Entreprise details) {
        return entrepriseService.updateEntreprise(id, details)
                .map(entreprise -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("entreprise", entreprise);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // Suppression entreprise (bouton ligne) - Admin
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteEntreprise(@PathVariable Long id) {
        if (entrepriseService.deleteEntreprise(id)) {
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("message", "Entreprise supprimée");
            return ResponseEntity.ok(response);
        }
        return ResponseEntity.notFound().build();
    }
}