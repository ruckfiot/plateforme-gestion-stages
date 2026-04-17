package com.projet.gestion_stages.security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    @Bean
    public PasswordEncoder passwordEncoder() {
        // C'est ce qui va hacher les mots de passe dans la base de données
        return new BCryptPasswordEncoder();
    }

    // Bean indispensable pour que AuthController puisse vérifier les mots de passe
    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authConfig) throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public SecurityFilterChain filterChain(HttpSecurity http) throws Exception {
        http
            .cors(cors -> cors.disable())
            .csrf(csrf -> csrf.disable()) // Désactive les protections inutiles pour une API REST
            .sessionManagement(session -> session.sessionCreationPolicy(SessionCreationPolicy.STATELESS)) // On utilise JWT
            .authorizeHttpRequests(auth -> auth
                // On autorise tout le monde à s'inscrire et se connecter
                .requestMatchers("/api/auth/login", "/api/auth/register").permitAll()
                // On autorise l'accès à la documentation Swagger sans token
                .requestMatchers("/v3/api-docs/**", "/swagger-ui/**", "/swagger-ui.html").permitAll()
                // Toutes les autres requêtes nécessiteront d'être connecté
                .anyRequest().authenticated()
            );

        // Le filtre JWT (JwtAuthTokenFilter) sera ajouté ici plus tard
        return http.build();
    }
}