package com.projet.gestion_stages.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

// Gère le stockage physique des fichiers sur le serveur (Filesystem)
@Service
public class FileStorageService {

    private final Path root;

    // Crée automatiquement le répertoire de stockage au démarrage si inexistant
    public FileStorageService(@Value("${file.upload-dir}") String uploadDir) {
        this.root = Paths.get(uploadDir);
        try {
            Files.createDirectories(root);
        } catch (IOException e) {
            throw new RuntimeException("Impossible d'initialiser le dossier de stockage !");
        }
    }

    // Sauvegarde le fichier avec un identifiant unique (UUID) pour éviter les collisions de noms et les failles de sécurité
    public String save(MultipartFile file) {
        try {
            String filename = UUID.randomUUID().toString() + "_" + file.getOriginalFilename();
            Files.copy(file.getInputStream(), this.root.resolve(filename));
            return filename;
        } catch (Exception e) {
            throw new RuntimeException("Erreur lors du stockage du fichier : " + e.getMessage());
        }
    }

    // Récupère une ressource depuis le système de fichiers pour la retourner à l'utilisateur
    public Resource load(String filename) {
        try {
            Path file = root.resolve(filename);
            Resource resource = new UrlResource(file.toUri());

            if (resource.exists() || resource.isReadable()) {
                return resource;
            } else {
                throw new RuntimeException("Impossible de lire le fichier !");
            }
        } catch (MalformedURLException e) {
            throw new RuntimeException("Erreur: " + e.getMessage());
        }
    }
}