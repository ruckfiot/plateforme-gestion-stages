package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Enseignant;
import com.projet.gestion_stages.repository.EnseignantRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class EnseignantService {

    private final EnseignantRepository enseignantRepository;

    public EnseignantService(EnseignantRepository enseignantRepository) {
        this.enseignantRepository = enseignantRepository;
    }

    public List<Enseignant> getAllEnseignants() {
        return enseignantRepository.findAll();
    }

    public Enseignant createEnseignant(Enseignant enseignant) {
        return enseignantRepository.save(enseignant);
    }

    public java.util.Optional<Enseignant> updateEnseignant(Long id, Enseignant details) {
        return enseignantRepository.findById(id).map(enseignant -> {
            enseignant.setNomEnseignant(details.getNomEnseignant());
            enseignant.setPrenomEnseignant(details.getPrenomEnseignant());
            enseignant.setMatiere(details.getMatiere());
            
            // On vérifie que le statut n'est pas écrasé par du vide
            if(details.getStatut() != null) {
                enseignant.setStatut(details.getStatut());
            }
            
            return enseignantRepository.save(enseignant);
        });
    }

    public boolean deleteEnseignant(Long id) {
        if(enseignantRepository.existsById(id)) {
            enseignantRepository.deleteById(id);
            return true;
        }
        return false;
    }
}