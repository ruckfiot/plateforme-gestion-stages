package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.*;
import com.projet.gestion_stages.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;

@Service
public class StageService {

    private final StageRepository stageRepository;
    private final ApprenantRepository apprenantRepository;
    private final EnseignantRepository enseignantRepository;
    private final EntrepriseRepository entrepriseRepository;

    public StageService(StageRepository stageRepository,
                        ApprenantRepository apprenantRepository,
                        EnseignantRepository enseignantRepository,
                        EntrepriseRepository entrepriseRepository) {
        this.stageRepository = stageRepository;
        this.apprenantRepository = apprenantRepository;
        this.enseignantRepository = enseignantRepository;
        this.entrepriseRepository = entrepriseRepository;
    }

    // Recupere tous les stages avec leurs relations (pour Admin)
    public List<Stage> getAllStages() {
        return stageRepository.findAllWithRelations();
    }

    // Recupere un stage par son ID
    public Optional<Stage> getStageById(Long id) {
        return stageRepository.findByIdWithRelations(id);
    }

    // Recupere les stages d'un tuteur (pour Enseignant/Tuteur)
    public List<Stage> getStagesByTuteur(Long idTuteur) {
        return stageRepository.findByTuteurWithRelations(idTuteur);
    }

    // Recupere les stages d'un apprenant (pour Apprenant)
    public List<Stage> getStagesByApprenant(Long idApprenant) {
        return stageRepository.findByApprenantWithRelations(idApprenant);
    }

    // Recupere les stages par etat
    public List<Stage> getStagesByEtat(String etat) {
        return stageRepository.findByEtat(etat);
    }

    // Cree un nouveau stage (Admin uniquement)
    @Transactional
    public Stage createStage(Stage stage, Long idApprenant, Long idTuteur, Long idEntreprise) {
        // Definit l'etat initial
        if (stage.getEtat() == null || stage.getEtat().isEmpty()) {
            stage.setEtat("EN_COURS");
        }

        // Associe l'apprenant si fourni
        if (idApprenant != null) {
            Apprenant apprenant = apprenantRepository.findById(idApprenant)
                    .orElseThrow(() -> new RuntimeException("Apprenant non trouve avec l'ID: " + idApprenant));
            stage.setApprenant(apprenant);
        }

        // Associe le tuteur si fourni
        if (idTuteur != null) {
            Enseignant tuteur = enseignantRepository.findById(idTuteur)
                    .orElseThrow(() -> new RuntimeException("Enseignant non trouve avec l'ID: " + idTuteur));
            stage.setTuteur(tuteur);
        }

        // Associe l'entreprise si fournie
        if (idEntreprise != null) {
            Entreprise entreprise = entrepriseRepository.findById(idEntreprise)
                    .orElseThrow(() -> new RuntimeException("Entreprise non trouvee avec l'ID: " + idEntreprise));
            stage.setEntreprise(entreprise);
        }

        return stageRepository.save(stage);
    }

    // Met a jour un stage existant (Admin uniquement)
    @Transactional
    public Optional<Stage> updateStage(Long id, Stage stageDetails, Long idApprenant, Long idTuteur, Long idEntreprise) {
        return stageRepository.findById(id)
                .map(stage -> {
                    // Met a jour les champs de base
                    if (stageDetails.getDateDebut() != null) {
                        stage.setDateDebut(stageDetails.getDateDebut());
                    }
                    if (stageDetails.getDuree() != null) {
                        stage.setDuree(stageDetails.getDuree());
                    }
                    if (stageDetails.getObjectif() != null) {
                        stage.setObjectif(stageDetails.getObjectif());
                    }
                    if (stageDetails.getEtat() != null) {
                        stage.setEtat(stageDetails.getEtat());
                    }

                    // Met a jour l'apprenant si fourni
                    if (idApprenant != null) {
                        Apprenant apprenant = apprenantRepository.findById(idApprenant)
                                .orElseThrow(() -> new RuntimeException("Apprenant non trouve avec l'ID: " + idApprenant));
                        stage.setApprenant(apprenant);
                    }

                    // Met a jour le tuteur si fourni
                    if (idTuteur != null) {
                        Enseignant tuteur = enseignantRepository.findById(idTuteur)
                                .orElseThrow(() -> new RuntimeException("Enseignant non trouve avec l'ID: " + idTuteur));
                        stage.setTuteur(tuteur);
                    }

                    // Met a jour l'entreprise si fournie
                    if (idEntreprise != null) {
                        Entreprise entreprise = entrepriseRepository.findById(idEntreprise)
                                .orElseThrow(() -> new RuntimeException("Entreprise non trouvee avec l'ID: " + idEntreprise));
                        stage.setEntreprise(entreprise);
                    }

                    return stageRepository.save(stage);
                });
    }

    // Met a jour uniquement l'etat d'un stage (Admin et Tuteur)
    @Transactional
    public Optional<Stage> updateEtatStage(Long id, String nouvelEtat) {
        return stageRepository.findById(id)
                .map(stage -> {
                    stage.setEtat(nouvelEtat);
                    return stageRepository.save(stage);
                });
    }

    // Affecte un apprenant a un stage (Admin uniquement)
    @Transactional
    public Optional<Stage> affecterApprenant(Long idStage, Long idApprenant) {
        return stageRepository.findById(idStage)
                .map(stage -> {
                    Apprenant apprenant = apprenantRepository.findById(idApprenant)
                            .orElseThrow(() -> new RuntimeException("Apprenant non trouve avec l'ID: " + idApprenant));
                    stage.setApprenant(apprenant);
                    return stageRepository.save(stage);
                });
    }

    // Affecte un tuteur a un stage (Admin uniquement)
    @Transactional
    public Optional<Stage> affecterTuteur(Long idStage, Long idTuteur) {
        return stageRepository.findById(idStage)
                .map(stage -> {
                    Enseignant tuteur = enseignantRepository.findById(idTuteur)
                            .orElseThrow(() -> new RuntimeException("Enseignant non trouve avec l'ID: " + idTuteur));
                    stage.setTuteur(tuteur);
                    return stageRepository.save(stage);
                });
    }

    // Supprime un stage (Admin uniquement)
    @Transactional
    public boolean deleteStage(Long id) {
        if (stageRepository.existsById(id)) {
            stageRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Verifie si un stage existe
    public boolean existsById(Long id) {
        return stageRepository.existsById(id);
    }
}


// Récupère ID Enseignant par email utilisateur
public Long getEnseignantIdByEmail(String email) {
    return enseignantRepository.findByUtilisateurEmail(email)
            .map(Enseignant::getIdEnseignant)
            .orElseThrow(() -> new RuntimeException("Enseignant non trouvé"));
}

// Récupère ID Apprenant par email utilisateur
public Long getApprenantIdByEmail(String email) {
    return apprenantRepository.findByUtilisateurEmail(email)
            .map(Apprenant::getIdApprenant)
            .orElseThrow(() -> new RuntimeException("Apprenant non trouvé"));
}

// Dépose rapport (intègre RapportService)
@Transactional
public void deposerRapport(Long idStage, String nomFichier, String emailApprenant) {
    Long idApprenant = getApprenantIdByEmail(emailApprenant);
    // Vérifie que l'apprenant est bien affecté au stage
    Optional<Stage> stageOpt = stageRepository.findByIdWithRelations(idStage);
    Stage stage = stageOpt.orElseThrow(() -> new RuntimeException("Stage non trouvé"));
    if (!stage.getApprenant().getIdApprenant().equals(idApprenant)) {
        throw new RuntimeException("Accès non autorisé à ce stage");
    }
     rapportService.deposerRapport(idStage, nomFichier);
    System.out.println("Rapport déposé pour stage " + idStage + ": " + nomFichier);
}