package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Administrateur;
import com.projet.gestion_stages.service.AdministrateurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// ARCHITECTURE REST : L'annotation @RestController combine @Controller et @ResponseBody pour sérialiser automatiquement les objets Java en JSON
@RestController
@RequestMapping("/api/administrateurs")
public class AdministrateurController {

    private final AdministrateurService administrateurService;

    // INJECTION DE DÉPENDANCES : L'injection par constructeur (plutôt que @Autowired) garantit l'immutabilité du service (final) et sécurise l'architecture
    public AdministrateurController(AdministrateurService administrateurService) {
        this.administrateurService = administrateurService;
    }

    // ENCAPSULATION HTTP : ResponseEntity permet d'envelopper la donnée métier tout en contrôlant précisément le code statut HTTP (ici 200 OK)
    @GetMapping
    public ResponseEntity<List<Administrateur>> getAdministrateurs() {
        return ResponseEntity.ok(administrateurService.getAllAdministrateurs());
    }

    // DÉSERIALISATION AUTOMATIQUE : @RequestBody intercepte le flux JSON de la requête HTTP (React) et le mappe dynamiquement dans l'entité Java
    @PostMapping
    public ResponseEntity<Administrateur> addAdministrateur(@RequestBody Administrateur administrateur) {
        Administrateur newAdmin = administrateurService.createAdministrateur(administrateur);
        // SÉMANTIQUE REST : Retourne explicitement un code 201 CREATED (meilleure pratique) plutôt qu'un 200 par défaut lors d'une insertion
        return new ResponseEntity<>(newAdmin, HttpStatus.CREATED);
    }
}