package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Rapport;
import com.projet.gestion_stages.model.Stage;
import com.projet.gestion_stages.repository.RapportRepository;
import com.projet.gestion_stages.repository.StageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class RapportService {

    private final RapportRepository rapportRepository;
    private final StageRepository stageRepository;

    public RapportService(RapportRepository rapportRepository, StageRepository stageRepository) {
        this.rapportRepository = rapportRepository;
        this.stageRepository = stageRepository;
    }

    // Recupere tous les rapports
    public List<Rapport> getAllRapports() {
        return rapportRepository.findAll();
    }

    // Recupere un rapport par son ID
    public Optional<Rapport> getRapportById(Long id) {
        return rapportRepository.findById(id);
    }

    // Recupere le rapport d'un stage specifique
    public Optional<Rapport> getRapportByStageId(Long idStage) {
        return rapportRepository.findByStageIdStage(idStage);
    }

    // Depose un rapport pour un stage (Apprenant uniquement)
    @Transactional
    public Rapport deposerRapport(Long idStage, String nomFichier) {
        // Verifie que le stage existe
        Stage stage = stageRepository.findById(idStage)
                .orElseThrow(() -> new RuntimeException("Stage non trouve avec l'ID: " + idStage));

        // Verifie qu'un rapport n'existe pas deja pour ce stage
        if (rapportRepository.existsByStageIdStage(idStage)) {
            throw new RuntimeException("Un rapport existe deja pour ce stage");
        }

        // Cree le nouveau rapport
        Rapport rapport = new Rapport();
        rapport.setStage(stage);
        rapport.setNomFichier(nomFichier);
        rapport.setDateDepot(LocalDate.now());
        rapport.setEtat("DEPOSE");

        return rapportRepository.save(rapport);
    }

    // Met a jour le fichier d'un rapport (Apprenant uniquement - tant que non evalue)
    @Transactional
    public Optional<Rapport> updateRapportFichier(Long idRapport, String nomFichier) {
        return rapportRepository.findById(idRapport)
                .map(rapport -> {
                    // Verifie que le rapport n'a pas encore ete evalue
                    if (rapport.getNoteRapport() != null) {
                        throw new RuntimeException("Impossible de modifier un rapport deja evalue");
                    }
                    rapport.setNomFichier(nomFichier);
                    rapport.setDateDepot(LocalDate.now());
                    return rapportRepository.save(rapport);
                });
    }

    // Evalue un rapport (Tuteur uniquement)
    @Transactional
    public Optional<Rapport> evaluerRapport(Long idRapport, Double note, String commentaire) {
        return rapportRepository.findById(idRapport)
                .map(rapport -> {
                    rapport.setNoteRapport(note);
                    rapport.setCommentaire(commentaire);
                    rapport.setEtat("EVALUE");
                    return rapportRepository.save(rapport);
                });
    }

    // Met a jour l'etat d'un rapport
    @Transactional
    public Optional<Rapport> updateEtatRapport(Long idRapport, String nouvelEtat) {
        return rapportRepository.findById(idRapport)
                .map(rapport -> {
                    rapport.setEtat(nouvelEtat);
                    return rapportRepository.save(rapport);
                });
    }

    // Supprime un rapport
    @Transactional
    public boolean deleteRapport(Long id) {
        if (rapportRepository.existsById(id)) {
            rapportRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Verifie si un rapport existe pour un stage
    public boolean existsForStage(Long idStage) {
        return rapportRepository.existsByStageIdStage(idStage);
    }
}
