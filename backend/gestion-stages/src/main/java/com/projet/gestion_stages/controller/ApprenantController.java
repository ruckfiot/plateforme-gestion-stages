package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Apprenant;
import com.projet.gestion_stages.service.ApprenantService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/apprenants")
public class ApprenantController {

    private final ApprenantService apprenantService;

    public ApprenantController(ApprenantService apprenantService) {
        this.apprenantService = apprenantService;
    }

    @GetMapping
    public ResponseEntity<List<Apprenant>> getApprenants() {
        return ResponseEntity.ok(apprenantService.getAllApprenants());
    }

    @PostMapping
    public ResponseEntity<Apprenant> addApprenant(@RequestBody Apprenant apprenant) {
        Apprenant newApprenant = apprenantService.createApprenant(apprenant);
        return new ResponseEntity<>(newApprenant, HttpStatus.CREATED);
    }
}