package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Entreprise;
import com.projet.gestion_stages.service.EntrepriseService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/entreprises")
@CrossOrigin(origins = "*")
@PreAuthorize("hasRole('ADMIN')")
public class EntrepriseController {
    
    private final EntrepriseService service;
    
    public EntrepriseController(EntrepriseService service) {
        this.service = service;
    }
    
    @GetMapping
    public ResponseEntity<List<Entreprise>> getAll() {
        return ResponseEntity.ok(service.getAllEntreprises());
    }
    
    @GetMapping("/search")
    public ResponseEntity<List<Entreprise>> search(@RequestParam String query) {
        return ResponseEntity.ok(service.searchEntreprises(query));
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Entreprise> getById(@PathVariable Long id) {
        return service.getEntrepriseById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }
    
    @PostMapping
    public ResponseEntity<Map<String, Object>> create(@RequestBody Entreprise entreprise) {
        try {
            Entreprise saved = service.createEntreprise(entreprise);
            return ResponseEntity.ok(Map.of("success", true, "entreprise", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    @PutMapping("/{id}")
    public ResponseEntity<Map<String, Object>> update(@PathVariable Long id, @RequestBody Entreprise details) {
        return service.updateEntreprise(id, details)
                .map(e -> ResponseEntity.ok(Map.of("success", true, "entreprise", e)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    @DeleteMapping("/{id}")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        if (service.deleteEntreprise(id)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Supprimé"));
        }
        return ResponseEntity.notFound().build();
    }
}