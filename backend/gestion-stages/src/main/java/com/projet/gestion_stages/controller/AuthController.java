package com.projet.gestion_stages.controller;

import com.projet.gestion_stages.dto.JwtResponse;
import com.projet.gestion_stages.dto.LoginRequest;
import com.projet.gestion_stages.model.Utilisateur;
import com.projet.gestion_stages.repository.UtilisateurRepository;
import com.projet.gestion_stages.security.JwtUtils;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "*")
public class AuthController {

    private final AuthenticationManager authenticationManager;
    private final UtilisateurRepository utilisateurRepository;
    private final JwtUtils jwtUtils;

    public AuthController(AuthenticationManager authenticationManager, 
                          UtilisateurRepository utilisateurRepository, 
                          JwtUtils jwtUtils) {
        this.authenticationManager = authenticationManager;
        this.utilisateurRepository = utilisateurRepository;
        this.jwtUtils = jwtUtils;
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@RequestBody LoginRequest loginRequest) {

        // 1. Vérification des identifiants (Email + MDP)
        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(loginRequest.getEmail(), loginRequest.getMotDePasse()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        // 2. Génération du Token JWT
        String jwt = jwtUtils.generateJwtToken(loginRequest.getEmail());
        
        // 3. Récupération des infos de l'utilisateur pour la réponse
        Utilisateur user = utilisateurRepository.findByEmail(loginRequest.getEmail()).get();

        return ResponseEntity.ok(new JwtResponse(jwt, user.getEmail(), user.getRole().name()));
    }
}