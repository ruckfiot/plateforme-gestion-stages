package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Module;
import com.projet.gestion_stages.repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// Assure la gestion centralisée du référentiel des modules de formation
@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    // Accès à l'ensemble du catalogue des modules disponibles
    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    // Enregistrement d'un nouveau module dans le catalogue académique
    public Module createModule(Module module) {
        return moduleRepository.save(module);
    }
}