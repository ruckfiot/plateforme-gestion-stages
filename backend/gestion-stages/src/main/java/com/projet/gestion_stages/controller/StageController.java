package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Stage;
import com.projet.gestion_stages.service.*;
import java.security.Principal;
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
import java.util.List;
import java.util.Map;

// ORCHESTRATEUR CENTRAL : Ce contrôleur est le carrefour métier de l'application, croisant les logiques de stages, rapports et soutenances
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

    // ROUTAGE SÉCURITAIRE DYNAMIQUE : Analyse les "authorities" du jeton JWT injecté pour retourner une liste filtrée selon le privilège du demandeur sans multiplier les endpoints
    @GetMapping
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<List<Stage>> getAll(
            @RequestParam(required = false) String id,
            Authentication auth) {
        
        if (id != null && !id.isEmpty()) {
            return stageService.getStageById(Long.parseLong(id))
                    .map(List::of)
                    .map(ResponseEntity::ok)
                    .orElse(ResponseEntity.ok(List.of()));
        }
        
        // Si ADMIN : tous les stages
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ADMIN"))) {
            return ResponseEntity.ok(stageService.getAllStages());
        }
        
        // Si ENSEIGNANT : ses stages
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_ENSEIGNANT"))) {
            Long idTuteur = stageService.getEnseignantIdByEmail(auth.getName());
            return ResponseEntity.ok(stageService.getStagesByTuteur(idTuteur));
        }
        
        // Si APPRENANT : ses stages
        if (auth.getAuthorities().stream().anyMatch(a -> a.getAuthority().equals("ROLE_APPRENANT"))) {
            Long idApprenant = stageService.getApprenantIdByEmail(auth.getName());
            return ResponseEntity.ok(stageService.getStagesByApprenant(idApprenant));
        }
        
        return ResponseEntity.ok(List.of());
    }

    // ADMIN: CREATE
    // JOINTURE MULTIPLE : Construit le graphe d'entités en liant simultanément l'étudiant, le tuteur et l'entreprise au nouveau stage via les paramètres optionnels
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
    // MUTATION CIBLÉE (PATCH-LIKE) : Expose une route spécifique pour modifier uniquement l'état d'avancement du stage, allégeant ainsi le trafic réseau
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
    // EXTRACTION D'IDENTITÉ INTRINSÈQUE : Utilise le contexte de sécurité auth.getName() pour interroger la base sans jamais forcer le client à envoyer son propre ID (Anti-Usurpation)
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
    // La transmission de l'objet Authentication au service permet de certifier que c'est bien l'auteur légitime qui dépose le document
    @PostMapping("/{id}/rapport")
    @PreAuthorize("hasRole('APPRENANT')")
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
    // La directive "inline" dans l'entête HTTP demande explicitement au navigateur d'afficher le PDF dans son lecteur natif plutôt que de le télécharger en arrière-plan
    @GetMapping("/rapports/{nomFichier}")
    @PreAuthorize("isAuthenticated()")
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

    // SUPPRIMER RAPPORT
    // Utilise l'interface standard 'Principal' de Java Security (plus légère qu'Authentication) pour identifier l'utilisateur effectuant la suppression
    @DeleteMapping("/{id}/rapport")
    @PreAuthorize("isAuthenticated()")
    public ResponseEntity<?> supprimerRapport(@PathVariable Long id, Principal principal) {
        try {
            stageService.supprimerRapport(id, principal.getName());
            return ResponseEntity.ok(Map.of("success", true, "message", "Rapport supprimé avec succès"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "error", e.getMessage()));
        }
    }
}
