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
import org.springframework.transaction.annotation.Transactional; // <-- IMPORT IMPORTANT
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/register")
    @Transactional // Si ça crash, Spring effacera l'utilisateur automatiquement !
    public ResponseEntity<?> registerUser(@RequestBody RegisterRequest signUpRequest) {
        
        try {
            // 1. Vérifier si l'email existe déjà
            if (utilisateurRepository.findByEmail(signUpRequest.getEmail()).isPresent()) {
                return ResponseEntity.badRequest().body("Erreur : Cet email est déjà utilisé !");
            }

            // 2. Créer le compte utilisateur
            Utilisateur user = new Utilisateur();
            user.setEmail(signUpRequest.getEmail());
            user.setMotDePasse(passwordEncoder.encode(signUpRequest.getMotDePasse()));

            // 3. Assigner le rôle et créer le profil
            Role userRole = Role.valueOf(signUpRequest.getRole().toUpperCase());
            user.setRole(userRole);
            
            Utilisateur savedUser = utilisateurRepository.save(user);

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

    // -- LA ROUTE DE LOGIN RESTE EXACTEMENT PAREILLE EN DESSOUS (JE L'AI COUPÉE ICI POUR ALLÉGER) --
    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getMotDePasse()));
            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(loginRequest.getEmail());
            Utilisateur user = utilisateurRepository.findByEmail(loginRequest.getEmail()).get();
            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), user.getRole().name()));
        } catch (BadCredentialsException e) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erreur : Email ou mot de passe incorrect.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne : " + e.getMessage());
        }
    }
}