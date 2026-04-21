package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Entreprise;
import com.projet.gestion_stages.repository.EntrepriseRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entreprises")
@CrossOrigin(origins = "*")
public class EntrepriseController {

    private final EntrepriseRepository entrepriseRepository;

    public EntrepriseController(EntrepriseRepository entrepriseRepository) {
        this.entrepriseRepository = entrepriseRepository;
    }

    // 1. Lire toutes les entreprises (Accessible à tous les connectés)
    @GetMapping
    public List<Entreprise> getAllEntreprises() {
        return entrepriseRepository.findAll();
    }

    // 2. Lire une entreprise spécifique
    @GetMapping("/{id}")
    public ResponseEntity<Entreprise> getEntrepriseById(@PathVariable Long id) {
        return entrepriseRepository.findById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // 3. Ajouter une entreprise (Seuls Admin et Enseignant)
    @PostMapping
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<?> createEntreprise(@RequestBody Entreprise entreprise) {
        try {
            Entreprise savedEntreprise = entrepriseRepository.save(entreprise);
            return ResponseEntity.ok(savedEntreprise);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Erreur lors de la création : " + e.getMessage());
        }
    }

    // 4. Modifier une entreprise (Seuls Admin et Enseignant)
    @PutMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN') or hasRole('ENSEIGNANT')")
    public ResponseEntity<?> updateEntreprise(@PathVariable Long id, @RequestBody Entreprise detailsEntreprise) {
        return entrepriseRepository.findById(id).map(entreprise -> {
            entreprise.setRaisonSociale(detailsEntreprise.getRaisonSociale());
            entreprise.setAdresse(detailsEntreprise.getAdresse());
            entreprise.setContact(detailsEntreprise.getContact());
            
            Entreprise updatedEntreprise = entrepriseRepository.save(entreprise);
            return ResponseEntity.ok(updatedEntreprise);
        }).orElse(ResponseEntity.notFound().build());
    }

    // 5. Supprimer une entreprise (Seul l'Admin a ce droit extrême)
    @DeleteMapping("/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<?> deleteEntreprise(@PathVariable Long id) {
        return entrepriseRepository.findById(id).map(entreprise -> {
            entrepriseRepository.delete(entreprise);
            return ResponseEntity.ok("Entreprise supprimée avec succès.");
        }).orElse(ResponseEntity.notFound().build());
    }
}