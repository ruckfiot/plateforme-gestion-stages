package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Soutenance;
import com.projet.gestion_stages.service.SoutenanceService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;
import java.util.List;
import java.util.Map;

// API DE PLANIFICATION : Point d'entrée orchestrant le calendrier des jurys et le rattachement des notes orales aux profils étudiants
@RestController
@RequestMapping("/api/soutenances")
@CrossOrigin(origins = "*")
public class SoutenanceController {

    private final SoutenanceService soutenanceService;

    public SoutenanceController(SoutenanceService soutenanceService) {
        this.soutenanceService = soutenanceService;
    }

    // Voir le planning des soutenances (Tout le monde)
    @GetMapping
    public List<Soutenance> getAllSoutenances() {
        return soutenanceService.getAllSoutenances();
    }

    // Voir les détails d'une soutenance
    @GetMapping("/{id}")
    public ResponseEntity<Soutenance> getSoutenanceById(@PathVariable Long id) {
        return soutenanceService.getSoutenanceById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Programmer une nouvelle soutenance (Admin ou Enseignant)
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

    // Modifier une date ou une salle de soutenance
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<?> updateSoutenance(@PathVariable Long id, @RequestBody Soutenance detailsSoutenance) {
        return soutenanceService.updateSoutenance(id, detailsSoutenance)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // ÉVALUER LA SOUTENANCE (Note + Commentaire)
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

    // Annuler/Supprimer une soutenance
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSoutenance(@PathVariable Long id) {
        if (soutenanceService.deleteSoutenance(id)) {
            return ResponseEntity.ok(Map.of("success", true, "message", "Soutenance annulée"));
        }
        return ResponseEntity.notFound().build();
    }
}
