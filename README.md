# Read-me du site plateforme de gestion académique et des stages

## Introduction et Contexte
Dans les établissements d'enseignement supérieur, la gestion des apprenants, des enseignants et des stages est souvent fragmentée entre plusieurs outils, ce qui complexifie le suivi et la communication. Ce projet a pour objectif de centraliser ces processus à travers une plateforme web moderne et full-stack, permettant la gestion des utilisateurs, des affectations pédagogiques, des stages et des évaluations.
## Architecture du site
L'application repose sur une architecture full-stack moderne, structurée en couches indépendantes qui communiquent entre elles par le biais d'une API REST. Cette séparation stricte des responsabilités entre le client, le serveur et la base de données garantit la maintenabilité, l'évolutivité et la sécurité de la plateforme. L'application adapte dynamiquement ses interfaces et ses accès en fonction des trois rôles principaux : Administrateur, Enseignant et Apprenant.

### Frontend (Interface Client)
L'interface utilisateur est une Single Page Application (SPA) développée avec le framework React. Elle utilise la bibliothèque Axios pour la consommation sécurisée de l'API REST et la gestion des requêtes asynchrones. Le frontend gère non seulement l'affichage dynamique des tableaux de bord et des formulaires, mais également le traitement complexe des fichiers. Il encapsule les rapports PDF des étudiants via l'objet natif FormData lors de l'envoi, et interprète les flux de données binaires (Blob) pour générer des URLs locales permettant aux enseignants de lire les documents directement depuis le navigateur.

### Backend (Serveur et Logique Métier)
Le cœur logique de l'application est propulsé par Java et le framework Spring Boot. Le code backend respecte de manière stricte le design pattern MVC à travers une architecture en couches : Modèles (entités), Repositories (interactions avec la base de données), Services (règles métier) et Contrôleurs (exposition des endpoints REST). Le backend intègre également un système de gestion de fichiers physiques : les rapports de stage soumis sont sauvegardés de manière sécurisée dans un répertoire local du serveur (avec un nom unique généré par horodatage pour éviter les écrasements), soulageant ainsi la base de données qui ne stocke que le nom du fichier.

### Base de Données (Persistance) 
Les données de l'application sont persistées au sein d'une base de données relationnelle MySQL. Les interactions avec celle-ci sont abstraites grâce à l'ORM Hibernate et Spring Data JPA, assurant un pont fluide entre la modélisation objet en Java et les tables SQL. Le modèle relationnel a été conçu pour lier fidèlement les profils utilisateurs (Apprenants, Enseignants, Administrateurs) à leurs activités académiques (Promotions/Filières, Stages, Soutenances et Rapports) par un système rigoureux de clés primaires et étrangères.

### Sécurité et Authentification 
La sécurité de l'application et la protection des endpoints de l'API sont gérées par Spring Security. Le processus d'authentification s'appuie sur la technologie des JSON Web Tokens (JWT). Lors de la connexion d'un utilisateur, le backend génère un token chiffré contenant ses informations de session et son rôle. Ce jeton est ensuite stocké côté client et injecté dans les en-têtes (Headers) de chaque requête HTTP ultérieure, permettant au serveur de vérifier systématiquement les permissions d'accès avant d'exécuter une action ou d'accorder le téléchargement d'un document.

## Fonctionnement du site et parcours utilisateur
L'application est divisée selon les trois rôles principaux :
### A. L'Espace Administrateur 
L'administrateur a une vue d'ensemble du système. Il a la responsabilité de créer les stages en définissant le sujet, l'entreprise, et les dates. Il est également chargé d'affecter un apprenant et un enseignant à ce stage. Nous avons ajouté la possibilité pour l'administration de planifier précisément la logistique de la soutenance (salle et date).
-Tableau de bord de la vue d’ensemble du système.
-La page “gestion des stages” afin que l’administrateur puisse ajouter/voir/modifier/supprimer un stage.
-La page “gestion des entreprises” afin que l’administrateur puisse ajouter/voir/modifier/supprimer une entreprise.
-La page “gestion des comptes” afin que l’administrateur puisse ajouter/voir/modifier/supprimer un utilisateur (professeur ou élève).
### B. L'Espace Apprenant 
L'apprenant dispose d'un tableau de bord dynamique ("Actualités") qui évolue selon l'état de son stage. 
-L’apprenant peut voir son stage, ses notes, les commentaires du jury et déposer son rapport au format PDF.
-Il peut aussi voir les dates auxquelles il doit rendre son rapport et présenter sa soutenance. De plus, il peut découvrir dans quelle salle il passera sa soutenance.
### C. L'Espace Enseignant 
L'enseignant accède aux stages qu'il encadre. Il peut télécharger les rapports déposés par ses élèves et accéder à un formulaire d'évaluation complet permettant de saisir des notes (/20) et des commentaires distincts pour le rapport écrit et la soutenance orale.
-Le tableau de bord de l’enseignant lui indique ses étudiants et les stages qu’il a à noter.
-Il peut voir tous les stages qu’il possède sous la forme d’un tableau mais aussi voir plus de détails de chaque stage.
-Il a un aperçu des notes de tous ses stages.
-L’enseignant peut accéder à une page de notation afin de noter chaque stage et de leur ajouter un commentaire.
