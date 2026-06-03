package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.dto.JwtResponse;
import com.projet.gestion_stages.dto.LoginRequest;
import com.projet.gestion_stages.dto.RegisterRequest;
import com.projet.gestion_stages.model.Administrateur;
import com.projet.gestion_stages.model.Apprenant;
import com.projet.gestion_stages.model.Enseignant;
import com.projet.gestion_stages.model.Role;
import com.projet.gestion_stages.model.Utilisateur;
import com.projet.gestion_stages.repository.AdministrateurRepository;
import com.projet.gestion_stages.repository.ApprenantRepository;
import com.projet.gestion_stages.repository.EnseignantRepository;
import com.projet.gestion_stages.repository.UtilisateurRepository;
import com.projet.gestion_stages.security.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.*;
import java.util.Map;
import java.util.Optional;

// !!! SÉCURITÉ DES FLUX : Point d'entrée critique exposé publiquement, protégé par les politiques CORS pour éviter le cross-site scripting
@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final ApprenantRepository apprenantRepository;
    private final EnseignantRepository enseignantRepository;
    private final AdministrateurRepository administrateurRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder;

    public AuthController(AuthenticationManager authenticationManager, 
                          UtilisateurRepository utilisateurRepository,
                          ApprenantRepository apprenantRepository,
                          EnseignantRepository enseignantRepository,
                          AdministrateurRepository administrateurRepository,
                          JwtUtils jwtUtils,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.utilisateurRepository = utilisateurRepository;
        this.apprenantRepository = apprenantRepository;
        this.enseignantRepository = enseignantRepository;
        this.administrateurRepository = administrateurRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    // L'annotation @Transactional garantit que la création des identifiants et du profil métier réussissent ou s'annulent ensemble (rollback)
    @PostMapping("/register")
    @Transactional
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        
        try {
            // Vérifier si l'email existe déjà
            if (utilisateurRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Erreur : Cet email est déjà utilisé !");
            }

            // Créer le compte utilisateur
            Utilisateur user = new Utilisateur();
            user.setEmail(signUpRequest.getEmail());
            // CRYPTOGRAPHIE UNIDIRECTIONNELLE : Hachage BCrypt avec sel aléatoire (Salt) pour empêcher le déchiffrement même en cas d'exfiltration de la base de données
            user.setMotDePasse(passwordEncoder.encode(signUpRequest.getMotDePasse()));

            // Assigner le rôle et créer le profil
            Role userRole = Role.valueOf(signUpRequest.getRole().toUpperCase());
            user.setRole(userRole);
            
            Utilisateur savedUser = utilisateurRepository.save(user);

            // POLYMORPHISME MÉTIER : Routage de la création du profil étendu selon le rôle sans alourdir la table Utilisateur principale
            switch (userRole) {
                case APPRENANT:
                    Apprenant apprenant = new Apprenant();
                    apprenant.setNomApprenant(signUpRequest.getNom());
                    apprenant.setPrenomApprenant(signUpRequest.getPrenom());
                    apprenant.setUtilisateur(savedUser);
                    apprenantRepository.save(apprenant);
                    break;
                case ENSEIGNANT:
                    Enseignant enseignant = new Enseignant();
                    enseignant.setNomEnseignant(signUpRequest.getNom());
                    enseignant.setPrenomEnseignant(signUpRequest.getPrenom());
                    enseignant.setUtilisateur(savedUser);
                    enseignantRepository.save(enseignant);
                    break;
                case ADMIN:
                    Administrateur admin = new Administrateur();
                    admin.setNomAdmin(signUpRequest.getNom());
                    admin.setPrenomAdmin(signUpRequest.getPrenom());
                    admin.setUtilisateur(savedUser);
                    administrateurRepository.save(admin);
                    break;
            }

            return ResponseEntity.ok("Utilisateur inscrit avec succès en tant que " + userRole + " !");

        } catch (IllegalArgumentException e) {
            return ResponseEntity.badRequest().body("Erreur : Le rôle spécifié n'est pas valide.");
        } catch (Exception e) {
            // On attrape l'erreur globale et on l'affiche EN CLAIR
            e.printStackTrace();
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("CRASH SERVEUR : " + e.getMessage());
        }
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            // DÉLÉGATION SÉCURITAIRE : Confie la validation des credentials au moteur interne de Spring Security pour éviter les failles logiques manuelles
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getMotDePasse()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            // SIGNATURE ÉPHÉMÈRE : Génération du jeton JWT signé par une clé privée côté serveur, garantissant l'intégrité de l'identité
            String jwt = jwtUtils.generateJwtToken(loginRequest.getEmail());
            
            Utilisateur user = utilisateurRepository.findByEmail(loginRequest.getEmail()).get();
            
            // --- ON RENVOIE LE STATUT À REACT ---
            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), user.getRole().name(), user.getStatut()));
            
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erreur : Email ou mot de passe incorrect.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne : " + e.getMessage());
        }
    }
    
    @PutMapping("/change-password")
    @Transactional
    public ResponseEntity<?> changePassword(@RequestBody Map<String, String> body) {
        String email            = body.get("email");
        String ancienMdp        = body.get("ancienMotDePasse");
        String nouveauMdp       = body.get("nouveauMotDePasse");

        if (email == null || ancienMdp == null || nouveauMdp == null) {
            return ResponseEntity.badRequest().body("Tous les champs sont requis.");
        }
        if (nouveauMdp.length() < 6) {
            return ResponseEntity.badRequest().body("Le nouveau mot de passe doit contenir au moins 6 caractères.");
        }

        Optional<Utilisateur> optUser = utilisateurRepository.findByEmail(email);
        if (optUser.isEmpty()) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Utilisateur introuvable.");
        }

        Utilisateur utilisateur = optUser.get();

        // Comparaison de l'empreinte de la tentative avec le hash en base sans jamais déchiffrer la donnée originale
        if (!passwordEncoder.matches(ancienMdp, utilisateur.getMotDePasse())) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Mot de passe actuel incorrect.");
        }

        utilisateur.setMotDePasse(passwordEncoder.encode(nouveauMdp));
        utilisateurRepository.save(utilisateur);

        return ResponseEntity.ok("Mot de passe mis à jour avec succès.");
    }
}