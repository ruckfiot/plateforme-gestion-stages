package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Soutenance;
import com.projet.gestion_stages.model.Stage;
import com.projet.gestion_stages.repository.SoutenanceRepository;
import com.projet.gestion_stages.repository.StageRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class SoutenanceService {

    private final SoutenanceRepository soutenanceRepository;
    private final StageRepository stageRepository;

    public SoutenanceService(SoutenanceRepository soutenanceRepository, StageRepository stageRepository) {
        this.soutenanceRepository = soutenanceRepository;
        this.stageRepository = stageRepository;
    }

    // Recupere toutes les soutenances
    public List<Soutenance> getAllSoutenances() {
        return soutenanceRepository.findAll();
    }

    // Recupere une soutenance par son ID
    public Optional<Soutenance> getSoutenanceById(Long id) {
        return soutenanceRepository.findById(id);
    }

    // Recupere la soutenance d'un stage specifique
    public Optional<Soutenance> getSoutenanceByStageId(Long idStage) {
        return soutenanceRepository.findByStageIdStage(idStage);
    }

    // Recupere les soutenances a venir
    public List<Soutenance> getUpcomingSoutenances() {
        return soutenanceRepository.findUpcomingSoutenances(LocalDateTime.now());
    }

    // Planifie une soutenance pour un stage (Admin uniquement)
    @Transactional
    public Soutenance planifierSoutenance(Long idStage, LocalDateTime dateSoutenance, String salle) {
        // Verifie que le stage existe
        Stage stage = stageRepository.findById(idStage)
                .orElseThrow(() -> new RuntimeException("Stage non trouve avec l'ID: " + idStage));

        // Verifie qu'une soutenance n'existe pas deja pour ce stage
        if (soutenanceRepository.existsByStageIdStage(idStage)) {
            throw new RuntimeException("Une soutenance existe deja pour ce stage");
        }

        // Cree la nouvelle soutenance
        Soutenance soutenance = new Soutenance();
        soutenance.setStage(stage);
        soutenance.setDateSoutenance(dateSoutenance);
        soutenance.setSalle(salle);

        return soutenanceRepository.save(soutenance);
    }

    // Met a jour les informations d'une soutenance (Admin uniquement)
    @Transactional
    public Optional<Soutenance> updateSoutenance(Long idSoutenance, LocalDateTime dateSoutenance, String salle) {
        return soutenanceRepository.findById(idSoutenance)
                .map(soutenance -> {
                    if (dateSoutenance != null) {
                        soutenance.setDateSoutenance(dateSoutenance);
                    }
                    if (salle != null) {
                        soutenance.setSalle(salle);
                    }
                    return soutenanceRepository.save(soutenance);
                });
    }

    // Evalue une soutenance (Tuteur uniquement)
    @Transactional
    public Optional<Soutenance> evaluerSoutenance(Long idSoutenance, Double note, String commentaire) {
        return soutenanceRepository.findById(idSoutenance)
                .map(soutenance -> {
                    soutenance.setNoteSoutenance(note);
                    soutenance.setCommentaireSoutenance(commentaire);
                    return soutenanceRepository.save(soutenance);
                });
    }

    // Supprime une soutenance (Admin uniquement)
    @Transactional
    public boolean deleteSoutenance(Long id) {
        if (soutenanceRepository.existsById(id)) {
            soutenanceRepository.deleteById(id);
            return true;
        }
        return false;
    }

    // Verifie si une soutenance existe pour un stage
    public boolean existsForStage(Long idStage) {
        return soutenanceRepository.existsByStageIdStage(idStage);
    }
}
