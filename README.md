# Frontend - Projet de gestion de bibliotheque

Application Angular pour consulter et gerer une bibliotheque composee de livres et de magazines. Le frontend permet aux utilisateurs de consulter le catalogue et de demander des prets, tandis que l'administrateur gere les elements et suit les demandes d'emprunt.

## Fonctionnalites

- Connexion et inscription utilisateur
- Authentification via token JWT
- Affichage adapte aux roles `USER` et `ADMIN`
- Consultation  du catalogue de livres et magazines
- Recherche par titre ou auteur
- Creation de livres et de magazines par l'administrateur
- Modification et suppression des elements du catalogue par l'administrateur
- Demande de pret d'un element par un utilisateur
- Consultation des demandes de pret de l'utilisateur connecte
- Consultation et mise a jour de toutes les demandes par l'administrateur
- Interface responsive avec menu lateral et images d'illustration pour livres/magazines

## Stack technique

- Angular 21
- TypeScript
- Angular standalone components
- Angular signals
- Tailwind CSS
- RxJS
- Angular SSR configure par le CLI

## API consommee

Le frontend utilise le proxy Angular `/api`, configure dans [`src/proxy.conf.json`](src/proxy.conf.json), vers le backend:

```text
http://localhost:8080
```

| Ressource | Methode | Route utilisee | Usage frontend |
| --- | --- | --- | --- |
| Auth | `POST` | `/api/auth/login` | Connexion |
| Users | `GET` | `/api/users` | Recuperation de l'utilisateur connecte par email |
| Users | `POST` | `/api/users` | Inscription |
| Elements | `GET` | `/api/element` | Liste du catalogue |
| Elements | `POST` | `/api/element/book` | Creation d'un livre |
| Elements | `POST` | `/api/element/magazine` | Creation d'un magazine |
| Elements | `PUT` | `/api/element/book/{id}` | Modification d'un livre |
| Elements | `PUT` | `/api/element/magazine/{id}` | Modification d'un magazine |
| Elements | `DELETE` | `/api/element/{id}` | Suppression d'un element |
| Borrow | `GET` | `/api/borrow` | Liste des demandes pour l'admin |
| Borrow | `GET` | `/api/borrow/user/{userId}` | Demandes de l'utilisateur connecte |
| Borrow | `POST` | `/api/borrow` | Creation d'une demande |
| Borrow | `PUT` | `/api/borrow/{id}` | Mise a jour d'une demande par l'admin |

## Routes principales

| Route | Description |
| --- | --- |
| `/login` | Connexion |
| `/register` | Inscription |
| `/elements` | Catalogue des elements |
| `/elements/new/book` | Creation d'un livre |
| `/elements/new/magazine` | Creation d'un magazine |
| `/my-borrows` | Demandes de pret de l'utilisateur connecte |
| `/borrows` | Gestion de toutes les demandes pour l'administrateur |
| `/dashboard` | Tableau de bord simple |

## Demarrage

### Prerequis

- Node.js
- npm
- Backend lance sur `http://localhost:8080`

### Installer les dependances

```bash
npm install
```

### Lancer le serveur de developpement

```bash
npm start
```

Puis ouvrir:

```text
http://localhost:4200
```

La commande `npm start` lance Angular avec le proxy:

```bash
ng serve --proxy-config src/proxy.conf.json
```

## Comptes de test

Le backend initialise notamment un compte administrateur:

```text
email: admin@gmail.com
password: Azerty123?
```

Les utilisateurs peuvent etre crees depuis la page `/register`.

## Scripts utiles

| Commande | Description |
| --- | --- |
| `npm start` | Lance le serveur Angular avec proxy API |
| `npm run build` | Compile l'application |
| `npm run watch` | Compile en mode watch |
| `npm test` | Lance les tests unitaires |

## Structure du projet

```text
src/app/pages/auth              Pages login et register
src/app/pages/elements-view     Catalogue, creation et gestion des elements
src/app/pages/my-borrows        Demandes de pret de l'utilisateur connecte
src/app/pages/admin-borrows     Gestion admin des demandes
src/app/layout                  Layout principal et menu lateral
src/app/services                Services HTTP et authentification
src/app/model                   Modeles TypeScript
src/app/shared                  Composants reutilisables
public                          Assets publics, dont book.jpg et magazine.jpg
```

## Images du catalogue

Les cartes du catalogue utilisent des images statiques placees dans [`public`](public):

```text
public/book.jpg
public/magazine.jpg
```

## Notes

- Les utilisateurs voient le bouton `Preter` sur les elements du catalogue.
- Les administrateurs voient les actions modifier/supprimer sur chaque element.
- Le menu affiche `Mes demandes` pour un utilisateur et `Demandes` pour un administrateur.
- Le token est stocke en `sessionStorage`.
