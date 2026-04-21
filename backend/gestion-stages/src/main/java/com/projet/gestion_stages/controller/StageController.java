package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Stage;
import com.projet.gestion_stages.service.StageService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/stages")
@CrossOrigin(origins = "*")
public class StageController {

    private final StageService stageService;

    @Autowired
    public StageController(StageService stageService) {
        this.stageService = stageService;
    }

    // ADMIN: Toutes les stages + recherche ID
    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Stage>> getAllStages(@RequestParam(required = false) String id) {
        if (id != null && !id.trim().isEmpty()) {
            return stageService.getStageById(Long.parseLong(id))
                    .map(stage -> ResponseEntity.ok(List.of(stage)))
                    .orElse(ResponseEntity.ok(List.of()));
        }
        return ResponseEntity.ok(stageService.getAllStages());
    }

    // ADMIN: Créer stage
    @PostMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> createStage(
            @RequestBody Stage stage,
            @RequestParam(required = false) Long idApprenant,
            @RequestParam(required = false) Long idTuteur,
            @RequestParam(required = false) Long idEntreprise) {
        try {
            Stage saved = stageService.createStage(stage, idApprenant, idTuteur, idEntreprise);
            Map<String, Object> response = new HashMap<>();
            response.put("success", true);
            response.put("stage", saved);
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            Map<String, Object> error = new HashMap<>();
            error.put("success", false);
            error.put("message", e.getMessage());
            return ResponseEntity.badRequest().body(error);
        }
    }

    // ADMIN: Modifier stage
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> updateStage(
            @PathVariable Long id,
            @RequestBody Stage details,
            @RequestParam(required = false) Long idApprenant,
            @RequestParam(required = false) Long idTuteur,
            @RequestParam(required = false) Long idEntreprise) {
        return stageService.updateStage(id, details, idApprenant, idTuteur, idEntreprise)
                .map(stage -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("stage", stage);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ADMIN/TUTEUR: MAJ état
    @PutMapping("/{id}/etat")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<Map<String, Object>> updateEtatStage(@PathVariable Long id, @RequestBody Map<String, String> request) {
        String etat = request.get("etat");
        return stageService.updateEtatStage(id, etat)
                .map(stage -> {
                    Map<String, Object> response = new HashMap<>();
                    response.put("success", true);
                    response.put("stage", stage);
                    return ResponseEntity.ok(response);
                })
                .orElse(ResponseEntity.notFound().build());
    }

    // ADMIN: Affecter apprenant
    @PostMapping("/{id}/affecter-apprenant")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> affecterApprenant(@PathVariable Long id, @RequestParam Long idApprenant) {
        return stageService.affecterApprenant(id, idApprenant)
                .map(stage -> successResponse(stage))
                .orElse(ResponseEntity.badRequest().build());
    }

    // ADMIN: Affecter tuteur
    @PostMapping("/{id}/affecter-tuteur")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> affecterTuteur(@PathVariable Long id, @RequestParam Long idTuteur) {
        return stageService.affecterTuteur(id, idTuteur)
                .map(stage -> successResponse(stage))
                .orElse(ResponseEntity.badRequest().build());
    }

    // ADMIN: Supprimer
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Map<String, Object>> deleteStage(@PathVariable Long id) {
        if (stageService.deleteStage(id)) {
            return ResponseEntity.ok(successResponse("Stage supprimé"));
        }
        return ResponseEntity.notFound().build();
    }

    // TUTEUR: Ses stages (récupère ID depuis JWT email)
    @GetMapping("/tuteur")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<List<Stage>> getStagesTuteur(Authentication auth) {
        String email = auth.getName();
        Long idTuteur = stageService.getEnseignantIdByEmail(email);
        return ResponseEntity.ok(stageService.getStagesByTuteur(idTuteur));
    }

    // APPRENANT: Ses stages (récupère ID depuis JWT email)
    @GetMapping("/apprenant")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<List<Stage>> getStagesApprenant(Authentication auth) {
        String email = auth.getName();
        Long idApprenant = stageService.getApprenantIdByEmail(email);
        return ResponseEntity.ok(stageService.getStagesByApprenant(idApprenant));
    }

    // APPRENANT: Déposer rapport PDF
    @PostMapping("/{id}/rapport")
    @PreAuthorize("hasRole('APPRENANT')")
    public ResponseEntity<Map<String, Object>> deposerRapport(
            @PathVariable Long id,
            @RequestParam("file") MultipartFile file,
            Authentication auth) {
        String email = auth.getName();
        stageService.deposerRapport(id, file.getOriginalFilename(), email);
        return ResponseEntity.ok(successResponse("Rapport déposé: " + file.getOriginalFilename()));
    }

    private Map<String, Object> successResponse(Object data) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("data", data);
        return response;
    }

    private Map<String, Object> successResponse(String message) {
        Map<String, Object> response = new HashMap<>();
        response.put("success", true);
        response.put("message", message);
        return response;
    }
}