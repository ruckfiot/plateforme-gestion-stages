package com.projet.gestion_stages.service;

import com.projet.gestion_stages.model.Soutenance;
import com.projet.gestion_stages.repository.SoutenanceRepository;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Map;
import java.util.Optional;

@Service
public class SoutenanceService {

    private final SoutenanceRepository repository;

    public SoutenanceService(SoutenanceRepository repository) {
        this.repository = repository;
    }

    public List<Soutenance> getAllSoutenances() {
        return repository.findAll();
    }

    public Optional<Soutenance> getSoutenanceById(Long id) {
        return repository.findById(id);
    }

    public Soutenance createSoutenance(Soutenance soutenance) {
        return repository.save(soutenance);
    }

    public Optional<Soutenance> updateSoutenance(Long id, Soutenance detailsSoutenance) {
        return repository.findById(id).map(soutenance -> {
            soutenance.setDateSoutenance(detailsSoutenance.getDateSoutenance());
            soutenance.setSalle(detailsSoutenance.getSalle());
            return repository.save(soutenance);
        });
    }

    // ✅ ÉVALUER LA SOUTENANCE
    public Soutenance evaluerSoutenance(Long id, Map<String, Object> evaluation) {
        Soutenance soutenance = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Soutenance non trouvée"));

        if (evaluation.get("noteSoutenance") != null) {
            soutenance.setNoteSoutenance(Double.parseDouble(evaluation.get("noteSoutenance").toString()));
        }
        if (evaluation.get("commentaireSoutenance") != null) {
            soutenance.setCommentaireSoutenance((String) evaluation.get("commentaireSoutenance"));
        }

        return repository.save(soutenance);
    }

    public boolean deleteSoutenance(Long id) {
        if (repository.existsById(id)) {
            repository.deleteById(id);
            return true;
        }
        return false;
    }

    public Soutenance saveSoutenance(Soutenance soutenance) {
        return repository.save(soutenance);
    }
}
