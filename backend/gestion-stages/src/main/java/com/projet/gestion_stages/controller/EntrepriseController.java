package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Entreprise;
import com.projet.gestion_stages.service.EntrepriseService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/entreprises")
public class EntrepriseController {

    private final EntrepriseService entrepriseService;

    public EntrepriseController(EntrepriseService entrepriseService) {
        this.entrepriseService = entrepriseService;
    }

    @GetMapping
    public ResponseEntity<List<Entreprise>> getEntreprises() {
        return ResponseEntity.ok(entrepriseService.getAllEntreprises());
    }

    @PostMapping
    public ResponseEntity<Entreprise> addEntreprise(@RequestBody Entreprise entreprise) {
        Entreprise newEntreprise = entrepriseService.createEntreprise(entreprise);
        return new ResponseEntity<>(newEntreprise, HttpStatus.CREATED);
    }
}