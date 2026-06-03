package com.projet.gestion_stages.security;

import io.jsonwebtoken.*;
import io.jsonwebtoken.security.Keys;
import org.springframework.stereotype.Component;
import java.security.Key;
import java.util.Date;

// Composant utilitaire pour la gestion du cycle de vie des jetons JWT.
// Assure la génération, l'extraction d'identifiants et la validation cryptographique.
@Component
public class JwtUtils {

    // Clé secrète générée dynamiquement pour l'algorithme HS256, garantissant l'intégrité de la signature
    private final Key key = Keys.secretKeyFor(SignatureAlgorithm.HS256);
    // Durée de validité du jeton fixée à 24 heures
    private final int jwtExpirationMs = 86400000;

    // Génère un nouveau jeton JWT pour un utilisateur authentifié
    public String generateJwtToken(String email) {
        return Jwts.builder()
                .setSubject(email)
                .setIssuedAt(new Date())
                .setExpiration(new Date((new Date()).getTime() + jwtExpirationMs))
                .signWith(key)
                .compact();
    }

    // Extrait l'email contenu dans le payload du jeton
    public String getEmailFromJwtToken(String token) {
        return Jwts.parserBuilder().setSigningKey(key).build()
                .parseClaimsJws(token).getBody().getSubject();
    }

    // Valide l'intégrité cryptographique et la validité temporelle du jeton
    public boolean validateJwtToken(String authToken) {
        try {
            Jwts.parserBuilder().setSigningKey(key).build().parseClaimsJws(authToken);
            return true;
        } catch (Exception e) {
            // Une exception ici indique un jeton invalide ou falsifié
            return false;
        }
    }
}