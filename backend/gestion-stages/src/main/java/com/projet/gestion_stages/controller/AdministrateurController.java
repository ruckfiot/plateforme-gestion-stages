package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Administrateur;
import com.projet.gestion_stages.service.AdministrateurService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/administrateurs")
public class AdministrateurController {

    private final AdministrateurService administrateurService;

    public AdministrateurController(AdministrateurService administrateurService) {
        this.administrateurService = administrateurService;
    }

    @GetMapping
    public ResponseEntity<List<Administrateur>> getAdministrateurs() {
        return ResponseEntity.ok(administrateurService.getAllAdministrateurs());
    }

    @PostMapping
    public ResponseEntity<Administrateur> addAdministrateur(@RequestBody Administrateur administrateur) {
        Administrateur newAdmin = administrateurService.createAdministrateur(administrateur);
        return new ResponseEntity<>(newAdmin, HttpStatus.CREATED);
    }
}