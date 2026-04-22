package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Stage;
import com.projet.gestion_stages.service.*;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "*")
public class StageController {
    
    private final StageService stageService;
    private final RapportService rapportService;
    private final SoutenanceService soutenanceService;
    
    public StageController(
    StageService stageService, 
    RapportService rapportService, 
    SoutenanceService soutenanceService
) {
    this.stageService = stageService;
    this.rapportService = rapportService;
    this.soutenanceService = soutenanceService;
}
    
    // ADMIN: TOUS les stages
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Stage>> getAll(@RequestParam(required = false) String id) {
        if (id != null && !id.isEmpty()) {
            return stageService.getStageById(Long.parseLong(id))
                    .map(List::of)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.ok(List.of()));
        }
        return ResponseEntity.ok(stageService.getAllStages());
    }
    
    // ADMIN: CREATE
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> create(
            @RequestBody Stage stage,
            @RequestParam(required = false) Long idApprenant,
            @RequestParam(required = false) Long idTuteur,
            @RequestParam(required = false) Long idEntreprise) {
        try {
            Stage saved = stageService.createStage(stage, idApprenant, idTuteur, idEntreprise);
            return ResponseEntity.ok(Map.of("success", true, "stage", saved));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    
    // ADMIN: UPDATE
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> update(
            @PathVariable Long id,
            @RequestBody Stage details,
            @RequestParam(required = false) Long idApprenant,
            @RequestParam(required = false) Long idTuteur,
            @RequestParam(required = false) Long idEntreprise) {
        return stageService.updateStage(id, details, idApprenant, idTuteur, idEntreprise)
                .map(stage -> ResponseEntity.ok(Map.of("success", true, "stage", stage)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // ADMIN/TUTEUR: État
    @PutMapping("/{id}/etat")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<Map<String, Object>> updateEtat(@PathVariable Long id, @RequestBody Map<String, String> body) {
        return stageService.updateEtatStage(id, body.get("etat"))
                .map(stage -> ResponseEntity.ok(Map.of("success", true, "stage", stage)))
                .orElse(ResponseEntity.notFound().build());
    }
    
    // ADMIN: Affectations
    @PostMapping("/{id}/affecter-apprenant")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> affecterApprenant(@PathVariable Long id, @RequestParam Long idApprenant) {
        return stageService.affecterApprenant(id, idApprenant)
                .map(stage -> ResponseEntity.ok(Map.of("success", true, "stage", stage)))
                .orElse(ResponseEntity.badRequest().build());
    }
    
    @PostMapping("/{id}/affecter-tuteur")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> affecterTuteur(@PathVariable Long id, @RequestParam Long idTuteur) {
        return stageService.affecterTuteur(id, idTuteur)
                .map(stage -> ResponseEntity.ok(Map.of("success", true, "stage", stage)))
                .orElse(ResponseEntity.badRequest().build());
    }
    
    // ADMIN: Delete
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> delete(@PathVariable Long id) {
        if (stageService.deleteStage(id)) {
            return ResponseEntity.ok(Map.of("success", true));
        }
        return ResponseEntity.notFound().build();
    }
    
    // TUTEUR: Ses stages
    @GetMapping("/tuteur")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<Stage>> getTuteurStages(Authentication auth) {
        String email = auth.getName();
        Long idTuteur = stageService.getEnseignantIdByEmail(email);
        return ResponseEntity.ok(stageService.getStagesByTuteur(idTuteur));
    }
    
    // APPRENANT: Ses stages
    @GetMapping("/apprenant")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<Stage>> getApprenantStages(Authentication auth) {
        String email = auth.getName();
        Long idApprenant = stageService.getApprenantIdByEmail(email);
        return ResponseEntity.ok(stageService.getStagesByApprenant(idApprenant));
    }
    
    // APPRENANT: Rapport PDF
    @PostMapping("/{id}/rapport")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Map<String, Object>> deposerRapport(
            @PathVariable Long id, 
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        try {
            String email = auth.getName();
            stageService.deposerRapport(id, file.getOriginalFilename(), email);
            return ResponseEntity.ok(Map.of("success", true, "message", "Rapport déposé"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}