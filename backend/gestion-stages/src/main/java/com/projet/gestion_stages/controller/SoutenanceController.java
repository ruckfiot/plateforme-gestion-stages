package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Soutenance;
import com.projet.gestion_stages.service.SoutenanceService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/soutenances")
public class SoutenanceController {

    private final SoutenanceService soutenanceService;

    public SoutenanceController(SoutenanceService soutenanceService) {
        this.soutenanceService = soutenanceService;
    }

    @GetMapping
    public ResponseEntity<List<Soutenance>> getSoutenances() {
        return ResponseEntity.ok(soutenanceService.getAllSoutenances());
    }

    @PostMapping
    public ResponseEntity<Soutenance> addSoutenance(@RequestBody Soutenance soutenance) {
        Soutenance newSoutenance = soutenanceService.createSoutenance(soutenance);
        return new ResponseEntity<>(newSoutenance, HttpStatus.CREATED);
    }
}