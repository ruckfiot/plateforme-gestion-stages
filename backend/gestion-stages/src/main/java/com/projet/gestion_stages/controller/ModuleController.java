package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Module;
import com.projet.gestion_stages.service.ModuleService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/modules")
public class ModuleController {

    private final ModuleService moduleService;

    public ModuleController(ModuleService moduleService) {
        this.moduleService = moduleService;
    }

    @GetMapping
    public ResponseEntity<List<Module>> getModules() {
        return ResponseEntity.ok(moduleService.getAllModules());
    }

    @PostMapping
    public ResponseEntity<Module> addModule(@RequestBody Module module) {
        Module newModule = moduleService.createModule(module);
        return new ResponseEntity<>(newModule, HttpStatus.CREATED);
    }
}