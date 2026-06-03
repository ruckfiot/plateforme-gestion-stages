# Plateforme de gestion des stages

Projet réalisé dans le cadre de notre 4ème année d'ingénieur. L'idée est de centraliser sur une seule plateforme web la gestion des stages des apprenants, des enseignants et des entreprises partenaires de l'école.

## Stack technique

- **Backend** : Spring Boot (Java 17), Spring Security + JWT, Spring Data JPA
- **Base de données** : MySQL
- **Frontend** : React (Vite) + React Router
- **Build** : Maven pour le back, npm/Vite pour le front

## Fonctionnalités principales

Il y a 3 rôles dans l'application, chacun avec son interface adaptée :

### Administrateur
- Gestion des utilisateurs (création, modification, suppression d'apprenants, enseignants)
- Validation des demandes d'inscription
- Gestion des entreprises partenaires
- Création/affectation des stages (assignation tuteur, entreprise, apprenant)
- Planification des soutenances (date, salle)
- Vue d'ensemble sur tous les stages

### Enseignant
- Visualisation des stages dont il est tuteur
- Téléchargement des rapports déposés par ses apprenants
- Notation du rapport écrit et de la soutenance (note /20 + commentaires)
- Tableau de bord avec ses étudiants à suivre

### Apprenant
- Consultation de son stage en cours
- Dépôt de son rapport de stage (PDF / DOCX, max 20 Mo)
- Suivi de l'état d'avancement de son stage
- Visualisation de ses notes une fois publiées

## Structure du projet

```
plateforme-gestion-stages/
├── backend/
│   └── gestion-stages/        # Projet Spring Boot
│       ├── src/main/java/...  # Controllers, Services, Models, Repositories
│       └── src/main/resources/application.properties
└── frontend/                  # App React (Vite)
    ├── src/pages/             # Accueil, Login, Stages, Utilisateurs, Entreprises, Evaluations
    ├── src/services/          # Appels API (axios)
    └── src/components/        # ProtectedRoute, etc.
```

## Lancer le projet en local

### Prérequis
- Java 17+
- Maven
- Node.js 18+
- MySQL

### 1. Base de données

Créer une base MySQL :

```sql
CREATE DATABASE gestion_stages;
```

Puis configurer les identifiants dans `backend/gestion-stages/src/main/resources/application.properties` :

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/gestion_stages
spring.datasource.username=root
spring.datasource.password=VOTRE_MDP
```

### 2. Backend

```bash
cd backend/gestion-stages
./mvnw spring-boot:run
```

Le serveur démarre sur `http://localhost:8080`.

Au premier lancement, un jeu de données de test est inséré automatiquement (admin, enseignants, promotions, etc.).

**Compte admin par défaut :**
- email : `admin@start.com`
- mot de passe : `azerty123`

### 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

L'interface est dispo sur `http://localhost:5173`.

## Authentification

On utilise des JWT. À la connexion, le backend renvoie un token qu'on stocke côté React (localStorage) et qu'on envoie dans le header `Authorization: Bearer ...` à chaque requête. Les routes sont protégées côté front par un composant `ProtectedRoute` et côté back avec `@PreAuthorize` selon les rôles.

## Dépôt de rapports

Les rapports sont uploadés via un endpoint sécurisé (`POST /stages/{id}/rapport`) et stockés dans le dossier `uploads/rapports/` côté serveur. La lecture passe par un autre endpoint qui renvoie le fichier en stream pour que l'enseignant puisse l'ouvrir directement dans le navigateur.

## Points d'amélioration / à faire

C'est un projet scolaire donc il reste des choses à améliorer :
- Mieux gérer les erreurs côté front (parfois on a juste des `alert()`)
- Ajouter des tests unitaires côté backend (il n'y a que le test généré par défaut)
- Améliorer la responsivité mobile
- Passer le stockage des fichiers sur un vrai service (S3 ou équivalent) plutôt qu'en local
- Ajouter un système de notifications par mail
- Sortir les credentials de l'`application.properties` (variables d'env)

## Auteurs

Projet réalisé en groupe par:
Hugo BEN OLIEL
Valentin BERNA
Gaétan RIVOLLET
