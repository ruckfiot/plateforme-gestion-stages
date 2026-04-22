package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Rapport;
import com.projet.gestion_stages.repository.RapportRepository;
import com.projet.gestion_stages.service.FileStorageService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import java.time.LocalDate;

@RestController
@RequestMapping("/api/rapports")
@CrossOrigin(origins = "*")
public class RapportController {

    private final FileStorageService fileStorageService;
    private final RapportRepository rapportRepository;

    public RapportController(FileStorageService fileStorageService, RapportRepository rapportRepository) {
        this.fileStorageService = fileStorageService;
        this.rapportRepository = rapportRepository;
    }

    @PostMapping("/upload")
    public ResponseEntity<?> uploadRapport(@RequestParam("file") MultipartFile file) {
        if (file.isEmpty()) {
            return ResponseEntity.badRequest().body("Erreur : Le fichier est vide.");
        }

        try {
            // 1. Sauvegarde physique du PDF via le service
            String filename = fileStorageService.save(file);

            // 2. Création de l'objet Rapport pour la base de données
            Rapport rapport = new Rapport();
            
            rapport.setNomFichier(filename); 
            rapport.setDateDepot(LocalDate.now()); // On enregistre la date du jour automatiquement
            rapport.setEtat("EN_ATTENTE"); // On met un statut par défaut
            
            // 3. Sauvegarde en base de données
            rapportRepository.save(rapport);

            return ResponseEntity.ok("Fichier '" + file.getOriginalFilename() + "' téléchargé avec succès sous le nom : " + filename);
            
        } catch (Exception e) {
            e.printStackTrace(); 
            return ResponseEntity.internalServerError().body("Erreur lors de l'upload : " + e.getMessage());
        }
    }

    @GetMapping("/download/{id}")
    public ResponseEntity<Resource> downloadRapport(@PathVariable Long id) {
        try {
            // 1. Trouver le rapport dans la base de données grâce à son ID
            Rapport rapport = rapportRepository.findById(id)
                    .orElseThrow(() -> new RuntimeException("Rapport introuvable avec l'ID : " + id));

            // 2. Aller chercher le fichier physique sur le disque dur
            Resource file = fileStorageService.load(rapport.getNomFichier());

            // 3. Renvoyer le fichier avec l'en-tête spécial qui force le navigateur à lancer un téléchargement
            return ResponseEntity.ok()
                    .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + file.getFilename() + "\"")
                    .body(file);

        } catch (Exception e) {
            // Si le fichier n'est pas trouvé, on renvoie une erreur 404
            return ResponseEntity.notFound().build();
        }
    }
}