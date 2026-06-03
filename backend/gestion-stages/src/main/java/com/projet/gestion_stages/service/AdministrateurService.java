package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Administrateur;
import com.projet.gestion_stages.repository.AdministrateurRepository;
import org.springframework.stereotype.Service;

import java.util.List;

// Encapsule la logique de traitement et sert d'interface intermédiaire entre le contrôleur et les données (Repository)
@Service
public class AdministrateurService {

    private final AdministrateurRepository administrateurRepository;

    // Utilisation du constructeur, préférable à @Autowired pour la testabilité et la lisibilité du code
    public AdministrateurService(AdministrateurRepository administrateurRepository) {
        this.administrateurRepository = administrateurRepository;
    }

    // Méthode permettant au contrôleur d'accéder à la liste complète des administrateurs
    public List<Administrateur> getAllAdministrateurs() {
        return administrateurRepository.findAll();
    }

    // Méthode encapsulant la logique de création, ici un simple délégué au repository
    public Administrateur createAdministrateur(Administrateur administrateur) {
        return administrateurRepository.save(administrateur);
    }
}