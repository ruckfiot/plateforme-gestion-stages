package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Enseignant;
import com.projet.gestion_stages.repository.EnseignantRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

// Assure la gestion du cycle de vie des enseignants et la synchronisation avec les comptes d'authentification
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

    // Applique les modifications de profil et propage le changement de statut au compte Utilisateur associé
    public Optional<Enseignant> updateEnseignant(Long id, Enseignant details) {
        return enseignantRepository.findById(id).map(enseignant -> {
            enseignant.setNomEnseignant(details.getNomEnseignant());
            enseignant.setPrenomEnseignant(details.getPrenomEnseignant());
            enseignant.setMatiere(details.getMatiere());
            
            // Propagation du statut (ex: ACTIVE/SUSPENDU) entre le profil Enseignant et le compte Utilisateur
            if(details.getStatut() != null) {
                enseignant.setStatut(details.getStatut());
                if (enseignant.getUtilisateur() != null) {
                    enseignant.getUtilisateur().setStatut(details.getStatut());
                }
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