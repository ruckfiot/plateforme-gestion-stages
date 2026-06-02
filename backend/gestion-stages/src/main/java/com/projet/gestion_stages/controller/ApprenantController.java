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

    @PutMapping("/{id}")
    public ResponseEntity<Apprenant> updateApprenant(@PathVariable Long id, @RequestBody Apprenant apprenantDetails) {
        return apprenantService.updateApprenant(id, apprenantDetails)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteApprenant(@PathVariable Long id) {
        if(apprenantService.deleteApprenant(id)) {
            return ResponseEntity.ok().build();
        }
        return ResponseEntity.notFound().build();
    }
}