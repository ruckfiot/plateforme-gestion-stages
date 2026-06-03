package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.*;
import com.projet.gestion_stages.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.LocalDate;
import java.util.List;
import java.util.Map;
import java.util.Optional;
import org.springframework.web.multipart.MultipartFile;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.io.IOException;

// Service central qui coordonne les actions sur les stages, rapports et soutenances
@Service
// Assure l'atomicité des opérations. Si une méthode échoue au milieu de son exécution, toutes les requêtes SQL précédentes de la méthode sont annulées (rollback)
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
        return stageRepository.findByTuteur_IdEnseignant(idTuteur);
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
    // Association dynamique des différentes entités et initialisation automatique du statut du workflow à "EN_COURS"
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
    // Met à jour les infos du stage et orchestre intelligemment la création ou la mise à jour de l'entité Soutenance qui lui est liée
    public Optional<Stage> updateStage(Long id, Stage details, Long idApprenant, Long idTuteur, Long idEntreprise) {
        return stageRepository.findById(id).map(stage -> {
            stage.setSujet(details.getSujet()); 
            stage.setDateDebut(details.getDateDebut());
            stage.setDuree(details.getDuree());
            stage.setObjectif(details.getObjectif());
            stage.setEtat(details.getEtat() != null ? details.getEtat() : stage.getEtat());
            
            // Mise à jour de la date dans l'entité Stage
            stage.setDateSoutenance(details.getDateSoutenance());
            stage.setDateLimiteRapport(details.getDateLimiteRapport());
            
            // --- CRÉATION OU MISE À JOUR DE LA TABLE SOUTENANCE ---
            if (details.getDateSoutenance() != null || details.getSalleSoutenance() != null) {
                Soutenance soutenance = soutenanceRepository.findAll().stream()
                        .filter(s -> s.getStage() != null && s.getStage().getIdStage().equals(id))
                        .findFirst()
                        .orElse(new Soutenance());
                
                soutenance.setStage(stage);
                // Si une date est fournie, on la convertit en LocalDateTime (en ajoutant 00:00:00)
                if (details.getDateSoutenance() != null) {
                    soutenance.setDateSoutenance(details.getDateSoutenance().atStartOfDay());
                } else {
                    soutenance.setDateSoutenance(null);
                }
                soutenance.setSalle(details.getSalleSoutenance());
                
                soutenanceRepository.save(soutenance);
            }
            
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
    
    // Le dossier physique où seront stockés les PDF (il se créera à la racine du projet Java)
    private final String UPLOAD_DIR = "uploads/rapports/";

    // APPRENANT: Déposer rapport PDF (Physique + BDD)
    public void deposerRapport(Long idStage, MultipartFile file, String emailApprenant) throws IOException {
        Long idApprenant = getApprenantIdByEmail(emailApprenant);
        
        Stage stage = stageRepository.findByIdWithRelations(idStage)
                .orElseThrow(() -> new RuntimeException("Stage " + idStage + " non trouvé"));
        
        if (!stage.getApprenant().getIdApprenant().equals(idApprenant)) {
            throw new RuntimeException("Accès refusé au stage " + idStage);
        }

        // 1. Création du dossier s'il n'existe pas
        Path uploadPath = Paths.get(UPLOAD_DIR);
        if (!Files.exists(uploadPath)) {
            Files.createDirectories(uploadPath);
        }

        // 2. Génération d'un nom unique (Timestamp + Nom d'origine sans espaces)
        String originalFileName = file.getOriginalFilename();
        String uniqueFileName = System.currentTimeMillis() + "_" + originalFileName.replaceAll("\\s+", "_");
        Path filePath = uploadPath.resolve(uniqueFileName);

        // 3. Copie physique du fichier sur le disque dur
        Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);
        
        // 4. On met à jour le rapport existant, ou on en crée un nouveau
        Rapport rapport;
        if (stage.getRapports() != null && !stage.getRapports().isEmpty()) {
            rapport = stage.getRapports().get(0); 
        } else {
            rapport = new Rapport();
            rapport.setStage(stage);
        }
        
        rapport.setNomFichier(uniqueFileName); 
        rapport.setDateDepot(LocalDate.now());
        rapportRepository.save(rapport); 
        
        stage.setEtat("RAPPORT_DEPOSE");
        stageRepository.save(stage);
    }

    // APPRENANT: Supprimer son rapport (fichier physique + BDD)
public void supprimerRapport(Long idStage, String emailApprenant) throws IOException {
    Long idApprenant = getApprenantIdByEmail(emailApprenant);

    Stage stage = stageRepository.findByIdWithRelations(idStage)
            .orElseThrow(() -> new RuntimeException("Stage " + idStage + " non trouvé"));

    if (!stage.getApprenant().getIdApprenant().equals(idApprenant)) {
        throw new RuntimeException("Accès refusé au stage " + idStage);
    }

    if (stage.getRapports() == null || stage.getRapports().isEmpty()) {
        throw new RuntimeException("Aucun rapport à supprimer pour ce stage.");
    }

    Rapport rapport = stage.getRapports().get(0);

    // Suppression du fichier physique
    Path filePath = Paths.get(UPLOAD_DIR).resolve(rapport.getNomFichier());
    Files.deleteIfExists(filePath);

    // Suppression en base
    rapportRepository.delete(rapport);

    // Remise de l'état du stage à EN_COURS
    stage.setEtat("EN_COURS");
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
    
// ENSEIGNANT: Évaluer un stage (Notes + Commentaires Rapport & Soutenance)
    public void evaluerStage(Long idStage, Map<String, Object> evaluation) {
        Stage stage = stageRepository.findByIdWithRelations(idStage)
                .orElseThrow(() -> new RuntimeException("Stage introuvable"));
        
        // ========================================================
        // 2. GESTION DU RAPPORT ÉCRIT (Table 'rapport')
        // ========================================================
        if (stage.getRapports() != null && !stage.getRapports().isEmpty()) {
            Rapport rapport = stage.getRapports().get(0);
            
            if (evaluation.containsKey("noteRapport") && evaluation.get("noteRapport") != null && !evaluation.get("noteRapport").toString().isEmpty()) {
                rapport.setNoteRapport(((Number) evaluation.get("noteRapport")).doubleValue());
            }
            if (evaluation.containsKey("commentaire") && evaluation.get("commentaire") != null) {
                rapport.setCommentaire(evaluation.get("commentaire").toString());
            }
            
            rapport.setEtat("EVALUE");
            rapportRepository.save(rapport);
        }
        
        // ========================================================
        // 3. GESTION DE LA SOUTENANCE ORALE (Table 'soutenance')
        // ========================================================
        if ((evaluation.containsKey("noteSoutenance") && evaluation.get("noteSoutenance") != null && !evaluation.get("noteSoutenance").toString().isEmpty()) || 
            (evaluation.containsKey("commentaireSoutenance") && evaluation.get("commentaireSoutenance") != null)) {
            
            Soutenance soutenance = soutenanceRepository.findAll().stream()
                    .filter(s -> s.getStage() != null && s.getStage().getIdStage().equals(idStage))
                    .findFirst()
                    .orElse(new Soutenance()); 
            
            if (evaluation.containsKey("noteSoutenance") && evaluation.get("noteSoutenance") != null && !evaluation.get("noteSoutenance").toString().isEmpty()) {
                soutenance.setNoteSoutenance(((Number) evaluation.get("noteSoutenance")).doubleValue());
            }
            if (evaluation.containsKey("commentaireSoutenance") && evaluation.get("commentaireSoutenance") != null) {
                soutenance.setCommentaireSoutenance(evaluation.get("commentaireSoutenance").toString());
            }
            
            soutenance.setStage(stage);
            soutenanceRepository.save(soutenance);
        }
        
        // ========================================================
        // 4. VALIDATION FINALE DU STAGE
        // ========================================================
        stage.setEtat("VALIDE");
        stageRepository.save(stage);
    }
}