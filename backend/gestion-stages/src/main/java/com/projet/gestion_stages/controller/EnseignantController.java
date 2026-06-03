package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Enseignant;
import com.projet.gestion_stages.service.EnseignantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
// OUVERTURE CORS : Débloque les requêtes cross-origin du frontend React en développement, bien qu'une configuration globale stricte soit recommandée en production
@CrossOrigin
@RequestMapping("/api/enseignants")
public class EnseignantController {

    private final EnseignantService enseignantService;

    // INJECTION IMMUABLE : L'injection par constructeur garantit que l'instance du service ne peut pas être altérée à l'exécution (thread-safety)
    public EnseignantController(EnseignantService enseignantService) {
        this.enseignantService = enseignantService;
    }

    @GetMapping
    public ResponseEntity<List<Enseignant>> getEnseignants() {
        return ResponseEntity.ok(enseignantService.getAllEnseignants());
    }

    // SÉMANTIQUE REST : Utilisation du verbe POST avec un retour HTTP 201 (CREATED) pour informer précisément le client de la création effective de la ressource
    @PostMapping
    public ResponseEntity<Enseignant> addEnseignant(@RequestBody Enseignant enseignant) {
        Enseignant newEnseignant = enseignantService.createEnseignant(enseignant);
        return new ResponseEntity<>(newEnseignant, HttpStatus.CREATED);
    }

    // PIPELINE FONCTIONNEL : Transformation de l'Optional Java en réponse HTTP 200 ou 404, évitant la complexité cyclomatique des blocs if/else
    @PutMapping("/{id}")
    public ResponseEntity<Enseignant> updateEnseignant(@PathVariable Long id, @RequestBody Enseignant enseignantDetails) {
        return enseignantService.updateEnseignant(id, enseignantDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Traite la suppression sécurisée via l'ID extrait de l'URL et confirme au client si la ressource a bien été détruite ou si elle était déjà inexistante
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteEnseignant(@PathVariable Long id) {
        if(enseignantService.deleteEnseignant(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}