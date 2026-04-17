package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Module;
import com.projet.gestion_stages.repository.ModuleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class ModuleService {

    private final ModuleRepository moduleRepository;

    public ModuleService(ModuleRepository moduleRepository) {
        this.moduleRepository = moduleRepository;
    }

    public List<Module> getAllModules() {
        return moduleRepository.findAll();
    }

    public Module createModule(Module module) {
        return moduleRepository.save(module);
    }
}