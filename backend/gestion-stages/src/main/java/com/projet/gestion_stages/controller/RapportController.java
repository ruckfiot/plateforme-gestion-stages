package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Rapport;
import com.projet.gestion_stages.service.RapportService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/rapports")
public class RapportController {

    private final RapportService rapportService;

    public RapportController(RapportService rapportService) {
        this.rapportService = rapportService;
    }

    @GetMapping
    public ResponseEntity<List<Rapport>> getRapports() {
        return ResponseEntity.ok(rapportService.getAllRapports());
    }

    @PostMapping
    public ResponseEntity<Rapport> addRapport(@RequestBody Rapport rapport) {
        Rapport newRapport = rapportService.createRapport(rapport);
        return new ResponseEntity<>(newRapport, HttpStatus.CREATED);
    }
}