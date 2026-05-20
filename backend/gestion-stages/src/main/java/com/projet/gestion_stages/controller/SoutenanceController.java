package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Soutenance;
import com.projet.gestion_stages.repository.SoutenanceRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soutenances")
@CrossOrigin(origins = "*")
public class SoutenanceController {

    private final SoutenanceRepository soutenanceRepository;

    public SoutenanceController(SoutenanceRepository soutenanceRepository) {
        this.soutenanceRepository = soutenanceRepository;
    }

    // 1. Voir le planning des soutenances (Tout le monde)
    @GetMapping
    public List<Soutenance> getAllSoutenances() {
        return soutenanceRepository.findAll();
    }

    // 2. Voir les détails d'une soutenance
    @GetMapping("/{id}")
    public ResponseEntity<Soutenance> getSoutenanceById(@PathVariable Long id) {
        return soutenanceRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Programmer une nouvelle soutenance (Admin ou Enseignant)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<?> createSoutenance(@RequestBody Soutenance soutenance) {
        try {
            Soutenance savedSoutenance = soutenanceRepository.save(soutenance);
            return ResponseEntity.ok(savedSoutenance);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la programmation : " + e.getMessage());
        }
    }

    // 4. Modifier une date ou une salle de soutenance
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<?> updateSoutenance(@PathVariable Long id, @RequestBody Soutenance detailsSoutenance) {
        return soutenanceRepository.findById(id).map(soutenance -> {
            soutenance.setDateSoutenance(detailsSoutenance.getDateSoutenance());
            soutenance.setSalle(detailsSoutenance.getSalle());
            
            Soutenance updatedSoutenance = soutenanceRepository.save(soutenance);
            return ResponseEntity.ok(updatedSoutenance);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Annuler/Supprimer une soutenance
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteSoutenance(@PathVariable Long id) {
        return soutenanceRepository.findById(id).map(soutenance -> {
            soutenanceRepository.delete(soutenance);
            return ResponseEntity.ok("Soutenance annulée et supprimée du système.");
        }).orElse(ResponseEntity.notFound().build());
    }
}