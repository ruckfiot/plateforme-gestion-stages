package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Stage;
import com.projet.gestion_stages.service.*;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.security.Principal;
import java.util.List;
import java.util.Map;
// -----------------------------

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
    
// ROUTE 1 : Pour l'UPLOAD (Sécurisée avec Authentication)
    @PostMapping("/{id}/rapport")
    public ResponseEntity<?> uploadRapport(@PathVariable Long id, @RequestParam("file") MultipartFile file, Authentication auth) {
        try {
            // auth.getName() récupère automatiquement l'email du token JWT
            stageService.deposerRapport(id, file, auth.getName());
            return ResponseEntity.ok().body(Map.of("success", true, "message", "Rapport déposé"));
        } catch (Exception e) {
            e.printStackTrace(); // Affiche l'erreur exacte dans ta console Java
            return ResponseEntity.badRequest().body("Erreur : " + e.getMessage());
        }
    }

    // ROUTE 2 : Pour la LECTURE (Le professeur télécharge/lit)
    @GetMapping("/rapports/{nomFichier}")
    public ResponseEntity<Resource> lireRapport(@PathVariable String nomFichier) {
        try {
            Path filePath = Paths.get("uploads/rapports/").resolve(nomFichier).normalize();
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists()) {
                return ResponseEntity.ok()
                        // "inline" permet d'ouvrir le PDF dans le navigateur. Si tu mets "attachment", ça forcera le téléchargement.
                        .header(HttpHeaders.CONTENT_DISPOSITION, "inline; filename=\"" + resource.getFilename() + "\"")
                        .header(HttpHeaders.CONTENT_TYPE, "application/pdf")
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ENSEIGNANT : Évaluer un stage (Noter le rapport)
    @PostMapping("/{id}/evaluer")
    @PreAuthorize("hasRole('ENSEIGNANT')")
    public ResponseEntity<?> evaluerStage(@PathVariable Long id, @RequestBody Map<String, Object> evaluation) {
        try {
            stageService.evaluerStage(id, evaluation);
            return ResponseEntity.ok(Map.of("success", true, "message", "Évaluation enregistrée"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
    @DeleteMapping("/{id}/rapport")
    public ResponseEntity<?> supprimerRapport(@PathVariable Long id, Principal principal) {
        try {
            stageService.supprimerRapport(id, principal.getName());
            return ResponseEntity.ok("Rapport supprimé avec succès.");
    } catch (Exception e) {
        return ResponseEntity.badRequest().body(e.getMessage());
    }
}

}