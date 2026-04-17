package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.model.Stage;
import com.projet.gestion_stages.service.StageService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stages")
public class StageController {

    private final StageService stageService;

    public StageController(StageService stageService) {
        this.stageService = stageService;
    }

    @GetMapping
    public ResponseEntity<List<Stage>> getStages() {
        return ResponseEntity.ok(stageService.getAllStages());
    }

    @PostMapping
    public ResponseEntity<Stage> addStage(@RequestBody Stage stage) {
        Stage newStage = stageService.createStage(stage);
        return new ResponseEntity<>(newStage, HttpStatus.CREATED);
    }
}