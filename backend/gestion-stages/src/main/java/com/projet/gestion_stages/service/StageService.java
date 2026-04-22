package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.*;
import com.projet.gestion_stages.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
@Transactional
public class StageService {
    
    private final StageRepository stageRepository;
    private final ApprenantRepository apprenantRepository;
    private final EnseignantRepository enseignantRepository;
    private final EntrepriseRepository entrepriseRepository;
    private final RapportRepository rapportRepository;
    private final SoutenanceRepository soutenanceRepository;
    private final RapportService rapportService;
    private final SoutenanceService soutenanceService;
    
    public StageService(
            StageRepository stageRepository, 
            ApprenantRepository apprenantRepository,
            EnseignantRepository enseignantRepository, 
            EntrepriseRepository entrepriseRepository,
            RapportRepository rapportRepository, 
            SoutenanceRepository soutenanceRepository,
            RapportService rapportService,
            SoutenanceService soutenanceService
    ) {
        this.stageRepository = stageRepository;
        this.apprenantRepository = apprenantRepository;
        this.enseignantRepository = enseignantRepository;
        this.entrepriseRepository = entrepriseRepository;
        this.rapportRepository = rapportRepository;
        this.soutenanceRepository = soutenanceRepository;
        this.rapportService = rapportService;
        this.soutenanceService = soutenanceService;
    }
    
    // ADMIN: Tous les stages
    public List<Stage> getAllStages() {
        return stageRepository.findAllWithRelations();
    }
    
    // Détail stage
    public Optional<Stage> getStageById(Long id) {
        return stageRepository.findByIdWithRelations(id);
    }
    
    // TUTEUR: Ses stages
    public List<Stage> getStagesByTuteur(Long idTuteur) {
        return stageRepository.findByTuteurIdEnseignant(idTuteur);
    }
    
    // APPRENANT: Ses stages
    public List<Stage> getStagesByApprenant(Long idApprenant) {
        return stageRepository.findByApprenantIdApprenant(idApprenant);
    }
    
    // ID utilisateur → ID Enseignant (JWT)
    public Long getEnseignantIdByEmail(String email) {
        return enseignantRepository.findByUtilisateurEmail(email)
                .map(Enseignant::getIdEnseignant)
                .orElseThrow(() -> new RuntimeException("Enseignant non trouvé: " + email));
    }
    
    // ID utilisateur → ID Apprenant (JWT)
    public Long getApprenantIdByEmail(String email) {
        return apprenantRepository.findByUtilisateurEmail(email)
                .map(Apprenant::getIdApprenant)
                .orElseThrow(() -> new RuntimeException("Apprenant non trouvé: " + email));
    }
    
    // CREATE stage (Admin + popup)
    public Stage createStage(Stage stage, Long idApprenant, Long idTuteur, Long idEntreprise) {
        if (idApprenant != null) {
            stage.setApprenant(apprenantRepository.findById(idApprenant).orElseThrow());
        }
        if (idTuteur != null) {
            stage.setTuteur(enseignantRepository.findById(idTuteur).orElseThrow());
        }
        if (idEntreprise != null) {
            stage.setEntreprise(entrepriseRepository.findById(idEntreprise).orElseThrow());
        }
        if (stage.getEtat() == null || stage.getEtat().isEmpty()) {
            stage.setEtat("EN_COURS");
        }
        return stageRepository.save(stage);
    }
    
    // UPDATE stage complet (Admin)
    public Optional<Stage> updateStage(Long id, Stage details, Long idApprenant, Long idTuteur, Long idEntreprise) {
        return stageRepository.findById(id).map(stage -> {
            stage.setDateDebut(details.getDateDebut());
            stage.setDuree(details.getDuree());
            stage.setObjectif(details.getObjectif());
            stage.setEtat(details.getEtat() != null ? details.getEtat() : stage.getEtat());
            stage.setDateSoutenance(details.getDateSoutenance());
            
            if (idApprenant != null) {
                stage.setApprenant(apprenantRepository.findById(idApprenant).orElseThrow());
            }
            if (idTuteur != null) {
                stage.setTuteur(enseignantRepository.findById(idTuteur).orElseThrow());
            }
            if (idEntreprise != null) {
                stage.setEntreprise(entrepriseRepository.findById(idEntreprise).orElseThrow());
            }
            
            return stageRepository.save(stage);
        });
    }
    
    // UPDATE ÉTAT (Admin/Tuteur)
    public Optional<Stage> updateEtatStage(Long id, String etat) {
        return stageRepository.findById(id).map(stage -> {
            stage.setEtat(etat);
            return stageRepository.save(stage);
        });
    }
    
    // AFFECTER Apprenant (Admin)
    public Optional<Stage> affecterApprenant(Long idStage, Long idApprenant) {
        return stageRepository.findById(idStage).map(stage -> {
            stage.setApprenant(apprenantRepository.findById(idApprenant).orElseThrow());
            return stageRepository.save(stage);
        });
    }
    
    // AFFECTER Tuteur (Admin)
    public Optional<Stage> affecterTuteur(Long idStage, Long idTuteur) {
        return stageRepository.findById(idStage).map(stage -> {
            stage.setTuteur(enseignantRepository.findById(idTuteur).orElseThrow());
            return stageRepository.save(stage);
        });
    }
    
    // APPRENANT: Déposer rapport PDF
    public void deposerRapport(Long idStage, String nomFichier, String emailApprenant) {
        Long idApprenant = getApprenantIdByEmail(emailApprenant);
        
        Stage stage = stageRepository.findByIdWithRelations(idStage)
                .orElseThrow(() -> new RuntimeException("Stage " + idStage + " non trouvé"));
        
        // Vérification autorisation
        if (!stage.getApprenant().getIdApprenant().equals(idApprenant)) {
            throw new RuntimeException("Accès refusé au stage " + idStage);
        }
        
        // Créer rapport via service 
        Rapport rapport = new Rapport();
        rapport.setNomFichier(nomFichier);
        rapport.setDateDepot(LocalDate.now());
        rapport.setStage(stage);
        rapportService.createRapport(rapport);
        
        // Met à jour état stage
        stage.setEtat("RAPPORT_DEPOSE");
        stageRepository.save(stage);
    }
    
    // ADMIN: Delete stage + cascade
    public boolean deleteStage(Long id) {
        if (stageRepository.existsById(id)) {
            stageRepository.deleteById(id);
            return true;
        }
        return false;
    }
}