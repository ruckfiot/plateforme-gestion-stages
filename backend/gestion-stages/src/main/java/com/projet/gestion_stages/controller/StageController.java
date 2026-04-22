package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Stage;
import com.projet.gestion_stages.repository.StageRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "*")
public class StageController {

    private final StageRepository stageRepository;

    public StageController(StageRepository stageRepository) {
        this.stageRepository = stageRepository;
    }

    // 1. TOUT LE MONDE (connecté) peut voir la liste des stages
    @GetMapping
    public List<Stage> getAllStages() {
        return stageRepository.findAll();
    }

    // 2. SEULS LES APPRENANTS peuvent proposer un nouveau stage
    @PostMapping
    @PreAuthorize("hasRole('APPRENANT')") 
    public ResponseEntity<?> createStage(@RequestBody Stage stage) {
        try {
            stage.setEtat("EN_ATTENTE"); // Par défaut, un stage n'est pas encore validé
            Stage savedStage = stageRepository.save(stage);
            return ResponseEntity.ok(savedStage);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la création du stage : " + e.getMessage());
        }
    }

    // 3. SEULS LES PROFS ET ADMINS peuvent valider un stage
    @PutMapping("/{id}/valider")
    @PreAuthorize("hasRole('ENSEIGNANT') or hasRole('ADMIN')")
    public ResponseEntity<?> validerStage(@PathVariable Long id) {
        try {
            Stage stage = stageRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Stage introuvable"));
            
            stage.setEtat("VALIDÉ");
            stageRepository.save(stage);
            
            return ResponseEntity.ok("Le stage a été validé avec succès !");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }
}