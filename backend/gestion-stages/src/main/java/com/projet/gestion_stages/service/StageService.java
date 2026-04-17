package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Stage;
import com.projet.gestion_stages.repository.StageRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StageService {

    private final StageRepository stageRepository;

    public StageService(StageRepository stageRepository) {
        this.stageRepository = stageRepository;
    }

    public List<Stage> getAllStages() {
        return stageRepository.findAll();
    }

    public Stage createStage(Stage stage) {
        // Tu pourras ajouter ici la logique d'initialisation de l'état "EN_COURS" par exemple
        return stageRepository.save(stage);
    }
}