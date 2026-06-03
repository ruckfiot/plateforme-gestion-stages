package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Module;
import com.projet.gestion_stages.service.ModuleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

// CONTRAT D'INTERFACE : @RestController indique à Spring de court-circuiter le moteur de vues classique pour sérialiser directement les retours en JSON brut
@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    private final ModuleService moduleService;

    // INVERSION DE CONTRÔLE (IoC) : L'injection par constructeur assure que le contrôleur ne peut être instancié sans son service métier, garantissant l'intégrité de l'état
    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @GetMapping
    public ResponseEntity<List<Module>> getModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    // SÉPARATION DES PRÉOCCUPATIONS : Le contrôleur se limite strictement à l'encapsulation HTTP (201 CREATED) et délègue toute la logique de persistance au ModuleService
    @PostMapping
    public ResponseEntity<Module> addModule(@RequestBody Module module) {
        Module newModule = moduleService.createModule(module);
        return new ResponseEntity<>(newModule, HttpStatus.CREATED);
    }
}