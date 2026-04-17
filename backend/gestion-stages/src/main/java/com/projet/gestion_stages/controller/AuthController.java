package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.dto.JwtResponse;
import com.projet.gestion_stages.dto.LoginRequest;
import com.projet.gestion_stages.model.Role;
import com.projet.gestion_stages.model.Utilisateur;
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
import org.springframework.web.bind.annotation.*;

import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtils jwtUtils;
    private final PasswordEncoder passwordEncoder; // On ajoute l'encodeur

    public AuthController(AuthenticationManager authenticationManager, 
                          UtilisateurRepository utilisateurRepository, 
                          JwtUtils jwtUtils,
                          PasswordEncoder passwordEncoder) {
        this.authenticationManager = authenticationManager;
        this.utilisateurRepository = utilisateurRepository;
        this.jwtUtils = jwtUtils;
        this.passwordEncoder = passwordEncoder;
    }

    // --- ROUTE TEMPORAIRE POUR CRÉER UN UTILISATEUR PARFAIT ---
    @GetMapping("/setup")
    public ResponseEntity<?> setupTestUser() {
        if(utilisateurRepository.findByEmail("admin@start.com").isPresent()) {
            return ResponseEntity.ok("L'utilisateur existe déjà !");
        }
        
        Utilisateur user = new Utilisateur();
        user.setEmail("admin@start.com");
        // Spring hache lui-même le mot de passe correctement
        user.setMotDePasse(passwordEncoder.encode("azerty123")); 
        user.setRole(Role.ADMIN);
        
        utilisateurRepository.save(user);
        return ResponseEntity.ok("Utilisateur admin@start.com créé avec le mot de passe azerty123 !");
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {
        
        // On affiche dans la console ce qu'on reçoit pour déboguer
        System.out.println("Tentative de connexion pour : '" + loginRequest.getEmail() + "'");
        System.out.println("Mot de passe reçu : '" + loginRequest.getMotDePasse() + "'");

        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getMotDePasse()));

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = jwtUtils.generateJwtToken(loginRequest.getEmail());
            
            Utilisateur user = utilisateurRepository.findByEmail(loginRequest.getEmail()).get();
            return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), user.getRole().name()));

        } catch (BadCredentialsException e) {
            System.out.println("ECHEC : Mauvais mot de passe !");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("Erreur : Email ou mot de passe incorrect.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Erreur interne : " + e.getMessage());
        }
    }
}