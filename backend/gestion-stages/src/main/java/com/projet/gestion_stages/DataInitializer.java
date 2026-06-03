package com.projet.gestion_stages;

import com.projet.gestion_stages.model.*;
import com.projet.gestion_stages.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Component;
import java.time.LocalDate;

@Component
public class DataInitializer implements CommandLineRunner {

    private final UtilisateurRepository utilisateurRepo;
    private final AdministrateurRepository adminRepo;
    private final ApprenantRepository apprenantRepo;
    private final EnseignantRepository enseignantRepo;
    private final EntrepriseRepository entrepriseRepo;
    private final StageRepository stageRepo;
    private final PromotionFiliereRepository promotionRepo;
    private final PasswordEncoder passwordEncoder;

    public DataInitializer(UtilisateurRepository utilisateurRepo,
                           AdministrateurRepository adminRepo,
                           ApprenantRepository apprenantRepo,
                           EnseignantRepository enseignantRepo,
                           EntrepriseRepository entrepriseRepo,
                           StageRepository stageRepo,
                           PromotionFiliereRepository promotionRepo,
                           PasswordEncoder passwordEncoder) {
        this.utilisateurRepo = utilisateurRepo;
        this.adminRepo = adminRepo;
        this.apprenantRepo = apprenantRepo;
        this.enseignantRepo = enseignantRepo;
        this.entrepriseRepo = entrepriseRepo;
        this.stageRepo = stageRepo;
        this.promotionRepo = promotionRepo;
        this.passwordEncoder = passwordEncoder;
    }

    @Override
    public void run(String... args) {

        if (utilisateurRepo.count() > 0) return;

        //  PROMOS 
        PromotionFiliere  E1 = new PromotionFiliere();
         E1.setNom("E1");
         E1.setAnnee(2025);
        promotionRepo.save( E1);

        PromotionFiliere  E2 = new PromotionFiliere();
         E2.setNom("E2");
         E2.setAnnee(2025);
        promotionRepo.save( E2);

        PromotionFiliere  E3E = new PromotionFiliere();
         E3E.setNom("E3E");
         E3E.setAnnee(2025);
        promotionRepo.save( E3E);

        PromotionFiliere  E3A = new PromotionFiliere();
         E3A.setNom("E3A");
         E3A.setAnnee(2025);
        promotionRepo.save( E3A);

        PromotionFiliere  E4A = new PromotionFiliere();
         E4A.setNom("E4A");
         E4A.setAnnee(2025);
        promotionRepo.save( E4A);

        PromotionFiliere  E4E = new PromotionFiliere();
         E4E.setNom("E4E");
         E4E.setAnnee(2025);
        promotionRepo.save( E4E);

        PromotionFiliere  E5A = new PromotionFiliere();
         E5A.setNom("E5A");
         E5A.setAnnee(2025);
        promotionRepo.save( E5A);

        PromotionFiliere  E5E = new PromotionFiliere();
         E5E.setNom("E5E");
         E5E.setAnnee(2025);
        promotionRepo.save( E5E);

        //  ADMIN 
        Utilisateur uAdmin = new Utilisateur();
        uAdmin.setEmail("admin@start.com");
        uAdmin.setMotDePasse(passwordEncoder.encode("azerty123"));
        uAdmin.setRole(Role.ADMIN);

        Administrateur admin = new Administrateur();
        admin.setNomAdmin("Moreau");
        admin.setPrenomAdmin("Claire");
        admin.setUtilisateur(uAdmin);
        adminRepo.save(admin);

        //  ENSEIGNANTS 
        Utilisateur uManel = new Utilisateur();
        uManel.setEmail("manel.zoghlami@start.com");
        uManel.setMotDePasse(passwordEncoder.encode("manel123"));
        uManel.setRole(Role.ENSEIGNANT);

        Enseignant manel = new Enseignant();
        manel.setNomEnseignant("Zoghlami");
        manel.setPrenomEnseignant("Manel");
        manel.setMatricule("ENS001");
        manel.setSpecialite("Informatique");
        manel.setMatiere("Développement Web");
        manel.setUtilisateur(uManel);
        enseignantRepo.save(manel);

        Utilisateur uThomas = new Utilisateur();
        uThomas.setEmail("thomas.renard@start.com");
        uThomas.setMotDePasse(passwordEncoder.encode("thomas123"));
        uThomas.setRole(Role.ENSEIGNANT);

        Enseignant thomas = new Enseignant();
        thomas.setNomEnseignant("Renard");
        thomas.setPrenomEnseignant("Thomas");
        thomas.setMatricule("ENS002");
        thomas.setSpecialite("Réseaux");
        thomas.setMatiere("Administration Système");
        thomas.setUtilisateur(uThomas);
        enseignantRepo.save(thomas);

        Utilisateur uSophie = new Utilisateur();
        uSophie.setEmail("sophie.lambert@start.com");
        uSophie.setMotDePasse(passwordEncoder.encode("sophie123"));
        uSophie.setRole(Role.ENSEIGNANT);

        Enseignant sophie = new Enseignant();
        sophie.setNomEnseignant("Lambert");
        sophie.setPrenomEnseignant("Sophie");
        sophie.setMatricule("ENS003");
        sophie.setSpecialite("Intelligence Artificielle");
        sophie.setMatiere("Machine Learning");
        sophie.setUtilisateur(uSophie);
        enseignantRepo.save(sophie);

        Utilisateur uKarim = new Utilisateur();
        uKarim.setEmail("karim.benali@start.com");
        uKarim.setMotDePasse(passwordEncoder.encode("karim123"));
        uKarim.setRole(Role.ENSEIGNANT);

        Enseignant karim = new Enseignant();
        karim.setNomEnseignant("Benali");
        karim.setPrenomEnseignant("Karim");
        karim.setMatricule("ENS004");
        karim.setSpecialite("Systèmes Embarqués");
        karim.setMatiere("Electronique");
        karim.setUtilisateur(uKarim);
        enseignantRepo.save(karim);

        Utilisateur uNicolas = new Utilisateur();
        uNicolas.setEmail("nicolas.petit@start.com");
        uNicolas.setMotDePasse(passwordEncoder.encode("nicolas123"));
        uNicolas.setRole(Role.ENSEIGNANT);

        Enseignant nicolas = new Enseignant();
        nicolas.setNomEnseignant("Petit");
        nicolas.setPrenomEnseignant("Nicolas");
        nicolas.setMatricule("ENS005");
        nicolas.setSpecialite("Cloud Computing");
        nicolas.setMatiere("DevOps");
        nicolas.setUtilisateur(uNicolas);
        enseignantRepo.save(nicolas);

        //  APPRENANTS 

        Utilisateur uHugo = new Utilisateur();
        uHugo.setEmail("hugo.benoliel@start.com");
        uHugo.setMotDePasse(passwordEncoder.encode("hugo123"));
        uHugo.setRole(Role.APPRENANT);

        Apprenant hugo = new Apprenant();
        hugo.setNomApprenant("BEN OLIEL");
        hugo.setPrenomApprenant("Hugo");
        hugo.setPromotion( E4A);
        hugo.setUtilisateur(uHugo);
        apprenantRepo.save(hugo);

        Utilisateur uValentin = new Utilisateur();
        uValentin.setEmail("valentin.berna@start.com");
        uValentin.setMotDePasse(passwordEncoder.encode("valentin123"));
        uValentin.setRole(Role.APPRENANT);

        Apprenant valentin = new Apprenant();
        valentin.setNomApprenant("BERNA");
        valentin.setPrenomApprenant("Valentin");
        valentin.setPromotion( E4A);
        valentin.setUtilisateur(uValentin);
        apprenantRepo.save(valentin);

        Utilisateur uGaetan = new Utilisateur();
        uGaetan.setEmail("gaetan.rivollet@start.com");
        uGaetan.setMotDePasse(passwordEncoder.encode("gaetan123"));
        uGaetan.setRole(Role.APPRENANT);

        Apprenant gaetan = new Apprenant();
        gaetan.setNomApprenant("RIVOLLET");
        gaetan.setPrenomApprenant("Gaétan");
        gaetan.setPromotion( E4A);
        gaetan.setUtilisateur(uGaetan);
        apprenantRepo.save(gaetan);

        Utilisateur uLucie = new Utilisateur();
        uLucie.setEmail("lucie.martin@start.com");
        uLucie.setMotDePasse(passwordEncoder.encode("lucie123"));
        uLucie.setRole(Role.APPRENANT);

        Apprenant lucie = new Apprenant();
        lucie.setNomApprenant("Martin");
        lucie.setPrenomApprenant("Lucie");
        lucie.setPromotion( E1);
        lucie.setUtilisateur(uLucie);
        apprenantRepo.save(lucie);

        Utilisateur uAdam = new Utilisateur();
        uAdam.setEmail("adam.cohen@start.com");
        uAdam.setMotDePasse(passwordEncoder.encode("adam123"));
        uAdam.setRole(Role.APPRENANT);

        Apprenant adam = new Apprenant();
        adam.setNomApprenant("Cohen");
        adam.setPrenomApprenant("Adam");
        adam.setPromotion( E2);
        adam.setUtilisateur(uAdam);
        apprenantRepo.save(adam);

        Utilisateur uCamille = new Utilisateur();
        uCamille.setEmail("camille.dupuis@start.com");
        uCamille.setMotDePasse(passwordEncoder.encode("camille123"));
        uCamille.setRole(Role.APPRENANT);

        Apprenant camille = new Apprenant();
        camille.setNomApprenant("Dupuis");
        camille.setPrenomApprenant("Camille");
        camille.setPromotion( E3E);
        camille.setUtilisateur(uCamille);
        apprenantRepo.save(camille);

        Utilisateur uNoa = new Utilisateur();
        uNoa.setEmail("noa.fontaine@start.com");
        uNoa.setMotDePasse(passwordEncoder.encode("noa123"));
        uNoa.setRole(Role.APPRENANT);

        Apprenant noa = new Apprenant();
        noa.setNomApprenant("Fontaine");
        noa.setPrenomApprenant("Noa");
        noa.setPromotion( E3A);
        noa.setUtilisateur(uNoa);
        apprenantRepo.save(noa);

        Utilisateur uLea = new Utilisateur();
        uLea.setEmail("lea.rousseau@start.com");
        uLea.setMotDePasse(passwordEncoder.encode("lea123"));
        uLea.setRole(Role.APPRENANT);

        Apprenant lea = new Apprenant();
        lea.setNomApprenant("Rousseau");
        lea.setPrenomApprenant("Léa");
        lea.setPromotion( E5A);
        lea.setUtilisateur(uLea);
        apprenantRepo.save(lea);

        Utilisateur uMaxime = new Utilisateur();
        uMaxime.setEmail("maxime.girard@start.com");
        uMaxime.setMotDePasse(passwordEncoder.encode("maxime123"));
        uMaxime.setRole(Role.APPRENANT);

        Apprenant maxime = new Apprenant();
        maxime.setNomApprenant("Girard");
        maxime.setPrenomApprenant("Maxime");
        maxime.setPromotion( E4E);
        maxime.setUtilisateur(uMaxime);
        apprenantRepo.save(maxime);

        Utilisateur uElisa = new Utilisateur();
        uElisa.setEmail("elisa.blanc@start.com");
        uElisa.setMotDePasse(passwordEncoder.encode("elisa123"));
        uElisa.setRole(Role.APPRENANT);

        Apprenant elisa = new Apprenant();
        elisa.setNomApprenant("Blanc");
        elisa.setPrenomApprenant("Elisa");
        elisa.setPromotion( E5E);
        elisa.setUtilisateur(uElisa);
        apprenantRepo.save(elisa);

        //  ENTREPRISES 
        Entreprise sopra = new Entreprise();
        sopra.setRaisonSociale("Sopra Steria");
        sopra.setAdresse("PAE Les Glaisins, Annecy-le-Vieux");
        sopra.setContact("contact@soprasteria.com");
        entrepriseRepo.save(sopra);

        Entreprise cea = new Entreprise();
        cea.setRaisonSociale("CEA");
        cea.setAdresse("91191 Gif-sur-Yvette");
        cea.setContact("contact@cea.fr");
        entrepriseRepo.save(cea);

        Entreprise capgemini = new Entreprise();
        capgemini.setRaisonSociale("Capgemini");
        capgemini.setAdresse("11 Rue de Tilsitt, Paris");
        capgemini.setContact("contact@capgemini.com");
        entrepriseRepo.save(capgemini);

        Entreprise thales = new Entreprise();
        thales.setRaisonSociale("Thales Group");
        thales.setAdresse("Tour Carpe Diem, Puteaux");
        thales.setContact("contact@thalesgroup.com");
        entrepriseRepo.save(thales);

        Entreprise orange = new Entreprise();
        orange.setRaisonSociale("Orange");
        orange.setAdresse("78 Rue Olivier de Serres, Paris");
        orange.setContact("contact@orange.com");
        entrepriseRepo.save(orange);

        Entreprise airbus = new Entreprise();
        airbus.setRaisonSociale("Airbus");
        airbus.setAdresse("2 Rond-Point Emile Dewoitine, Toulouse");
        airbus.setContact("contact@airbus.com");
        entrepriseRepo.save(airbus);

        Entreprise ibm = new Entreprise();
        ibm.setRaisonSociale("IBM France");
        ibm.setAdresse("17 Avenue de l'Europe, Bois-Colombes");
        ibm.setContact("contact@ibm.fr");
        entrepriseRepo.save(ibm);

        Entreprise sncf = new Entreprise();
        sncf.setRaisonSociale("SNCF");
        sncf.setAdresse("2 Place aux Étoiles, Saint-Denis");
        sncf.setContact("contact@sncf.fr");
        entrepriseRepo.save(sncf);

        Entreprise atos = new Entreprise();
        atos.setRaisonSociale("Atos");
        atos.setAdresse("80 Quai Voltaire, Bezons");
        atos.setContact("contact@atos.net");
        entrepriseRepo.save(atos);

        Entreprise dassault = new Entreprise();
        dassault.setRaisonSociale("Dassault Systèmes");
        dassault.setAdresse("10 Rue Marcel Dassault, Vélizy-Villacoublay");
        dassault.setContact("contact@3ds.com");
        entrepriseRepo.save(dassault);

        //  STAGES 
        Stage s1 = new Stage();
        s1.setSujet("Développement d'une application de gestion RH");
        s1.setDateDebut(LocalDate.of(2025, 2, 3));
        s1.setDuree("6 mois");
        s1.setObjectif("Concevoir et développer un module RH complet");
        s1.setEtat("EN_COURS");
        s1.setApprenant(hugo);
        s1.setEntreprise(sopra);
        s1.setTuteur(manel);
        s1.setAdministrateur(admin);
        stageRepo.save(s1);

        Stage s2 = new Stage();
        s2.setSujet("Analyse de données nucléaires");
        s2.setDateDebut(LocalDate.of(2025, 3, 3));
        s2.setDuree("5 mois");
        s2.setObjectif("Traiter et visualiser des données de simulation neutronique");
        s2.setEtat("EN_COURS");
        s2.setApprenant(valentin);
        s2.setEntreprise(cea);
        s2.setTuteur(sophie);
        s2.setAdministrateur(admin);
        stageRepo.save(s2);

        Stage s3 = new Stage();
        s3.setSujet("Intégration d'un système de monitoring cloud");
        s3.setDateDebut(LocalDate.of(2025, 1, 6));
        s3.setDuree("6 mois");
        s3.setObjectif("Mettre en place des dashboards de supervision avec Grafana");
        s3.setEtat("EN_COURS");
        s3.setApprenant(gaetan);
        s3.setEntreprise(capgemini);
        s3.setTuteur(nicolas);
        s3.setAdministrateur(admin);
        stageRepo.save(s3);

        Stage s4 = new Stage();
        s4.setSujet("Cybersécurité des systèmes industriels");
        s4.setDateDebut(LocalDate.of(2024, 9, 2));
        s4.setDuree("4 mois");
        s4.setObjectif("Auditer et renforcer la sécurité des systèmes SCADA");
        s4.setEtat("TERMINE");
        s4.setApprenant(lea);
        s4.setEntreprise(thales);
        s4.setTuteur(thomas);
        s4.setAdministrateur(admin);
        stageRepo.save(s4);

        Stage s5 = new Stage();
        s5.setSujet("Développement d'un chatbot IA pour le support client");
        s5.setDateDebut(LocalDate.of(2024, 10, 1));
        s5.setDuree("4 mois");
        s5.setObjectif("Intégrer un modèle de langage dans le système de ticketing");
        s5.setEtat("TERMINE");
        s5.setApprenant(adam);
        s5.setEntreprise(orange);
        s5.setTuteur(sophie);
        s5.setAdministrateur(admin);
        stageRepo.save(s5);

        Stage s6 = new Stage();
        s6.setSujet("Optimisation de logiciels embarqués avioniques");
        s6.setDateDebut(LocalDate.of(2025, 4, 1));
        s6.setDuree("5 mois");
        s6.setObjectif("Réduire l'empreinte mémoire des modules de navigation");
        s6.setEtat("EN_COURS");
        s6.setApprenant(camille);
        s6.setEntreprise(airbus);
        s6.setTuteur(karim);
        s6.setAdministrateur(admin);
        stageRepo.save(s6);

        Stage s7 = new Stage();
        s7.setSujet("Migration d'infrastructure vers le cloud AWS");
        s7.setDateDebut(LocalDate.of(2025, 2, 17));
        s7.setDuree("6 mois");
        s7.setObjectif("Piloter la migration complète d'un SI on-premise vers AWS");
        s7.setEtat("EN_COURS");
        s7.setApprenant(noa);
        s7.setEntreprise(ibm);
        s7.setTuteur(nicolas);
        s7.setAdministrateur(admin);
        stageRepo.save(s7);
    }
}
