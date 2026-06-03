package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Soutenance;
import com.projet.gestion_stages.service.SoutenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/soutenances")
@CrossOrigin(origins = "*")
public class SoutenanceController {

    private final SoutenanceService soutenanceService;

    public SoutenanceController(SoutenanceService soutenanceService) {
        this.soutenanceService = soutenanceService;
    }

    // 1. Voir le planning des soutenances (Tout le monde)
    @GetMapping
    public List<Soutenance> getAllSoutenances() {
        return soutenanceService.getAllSoutenances();
    }

    // 2. Voir les détails d'une soutenance
    @GetMapping("/{id}")
    public ResponseEntity<Soutenance> getSoutenanceById(@PathVariable Long id) {
        return soutenanceService.getSoutenanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Programmer une nouvelle soutenance (Admin ou Enseignant)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<?> createSoutenance(@RequestBody Soutenance soutenance) {
        try {
            Soutenance savedSoutenance = soutenanceService.createSoutenance(soutenance);
            return ResponseEntity.ok(savedSoutenance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la programmation : " + e.getMessage());
        }
    }

    // 4. Modifier une date ou une salle de soutenance
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<?> updateSoutenance(@PathVariable Long id, @RequestBody Soutenance detailsSoutenance) {
        return soutenanceService.updateSoutenance(id, detailsSoutenance)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 5. ÉVALUER LA SOUTENANCE (Note + Commentaire)
    @PostMapping("/{id}/evaluer")
    @PreAuthorize("hasRole('ENSEIGNANT') or hasRole('ADMIN')")
    public ResponseEntity<?> evaluerSoutenance(@PathVariable Long id, @RequestBody Map<String, Object> evaluation) {
        try {
            Soutenance evaluee = soutenanceService.evaluerSoutenance(id, evaluation);
            return ResponseEntity.ok(Map.of("success", true, "message", "Soutenance évaluée", "soutenance", evaluee));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }

    // 6. Annuler/Supprimer une soutenance
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSoutenance(@PathVariable Long id) {
        if (soutenanceService.deleteSoutenance(id)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Soutenance annulée"));
        }
        return ResponseEntity.notFound().build();
    }
}
