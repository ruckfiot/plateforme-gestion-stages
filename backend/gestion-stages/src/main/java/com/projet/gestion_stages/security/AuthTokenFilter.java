package com.projet.gestion_stages.security;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

public class AuthTokenFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtils jwtUtils;

    @Autowired
    private UserDetailsServiceImpl userDetailsService;

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain)
            throws ServletException, IOException {
        try {
            // 1. On récupère le token dans la requête
            String jwt = parseJwt(request);
            
            // 2. Si on a un token et qu'il est valide
            if (jwt != null && jwtUtils.validateJwtToken(jwt)) {
                
                // 3. On extrait l'email
                String email = jwtUtils.getEmailFromJwtToken(jwt);

                // 4. On charge l'utilisateur depuis la base de données
                UserDetails userDetails = userDetailsService.loadUserByUsername(email);
                
                // 5. On dit à Spring "C'est bon, laisse-le passer, je le connais !"
                UsernamePasswordAuthenticationToken authentication = new UsernamePasswordAuthenticationToken(
                        userDetails, null, userDetails.getAuthorities());
                authentication.setDetails(new WebAuthenticationDetailsSource().buildDetails(request));

                SecurityContextHolder.getContext().setAuthentication(authentication);
            }
        } catch (Exception e) {
            System.err.println("Impossible de définir l'authentification de l'utilisateur : " + e.getMessage());
        }

        // On passe à la suite (la route demandée)
        filterChain.doFilter(request, response);
    }

    // Petite méthode pour extraire proprement le token de l'en-tête "Authorization"
    private String parseJwt(HttpServletRequest request) {
        String headerAuth = request.getHeader("Authorization");

        if (StringUtils.hasText(headerAuth) && headerAuth.startsWith("Bearer ")) {
            return headerAuth.substring(7); // On enlève le mot "Bearer " pour ne garder que le token
        }

        return null;
    }
}