# Contexte projet — mcps

## Client

- **Nom du client** : ANS — Agence du Numérique en Santé
- **Direction / service** : à préciser
- **Contact principal** : Cécile (service client ANS, voix utilisateurs) — à compléter

## Projet

- **Nom du projet** : CDPS — Compte De suivi de la certification Périodique des professionnels de Santé
- **Nom de code** : Ma Certif' Pro Santé (MCPS)
- **Description courte** : Nouveau SI permettant aux professionnels de santé à ordre de suivre leur obligation de certification périodique (loi entrée en vigueur le 1er janvier 2023).
- **Objectif principal** : Donner au PS une vision claire de son cycle de certification (6 ou 9 ans), des 4 axes à couvrir et des actions à déclarer, avec un parcours simple de déclaration et de suivi.
- **Date cible** : MVP novembre 2026

## Utilisateurs cibles

Population totale : ~1,075 million de PS répartis sur 7 ordres.

| Ordre | Effectifs | Poids |
|---|---|---|
| Infirmiers | 565 553 | ~52% |
| Médecins | 237 200 | ~22% |
| Masseurs-kinésithérapeutes | 110 000 | ~10% |
| Pharmaciens | 74 600 | ~7% |
| Chirurgiens-dentistes | 47 600 | ~4% |
| Sages-femmes | 25 800 | ~2% |
| Pédicures-podologues | 14 400 | ~1% |

Profils d'exercice : libéral, salarié, militaire (SSA). Libéraux et mixtes majoritaires.

### Profil 1 — Professionnel de santé (cible principale)
- **Rôle** : PS à ordre, soumis à l'obligation de certification périodique
- **Caractéristiques** : population terrain, mobile, peu de temps écran (notamment les infirmiers = 52% de la base)
- **Besoins principaux** :
  - Comprendre où il en est de son cycle de certification (temps restant, actions réalisées)
  - Savoir quoi faire maintenant (prochaine étape claire)
  - Déclarer facilement une action réalisée
  - Obtenir une synthèse téléchargeable

## Parcours utilisateur

### Parcours 1 : Première connexion
1. Authentification via Pro Santé Connect (CPS / e-CPS)
2. Vérification du référentiel attribué automatiquement (via RPPS / spécialité ordinale) + acceptation CGU
3. Arrivée sur le tableau de bord (état initial : aucune action déclarée)
4. Découverte du cycle, des 4 axes et de la marche à suivre

### Parcours 2 : Déclaration d'une action
1. Depuis le tableau de bord ou depuis un axe, lancer "Déclarer une action"
2. Sélectionner la nature de l'action, renseigner les détails, joindre une attestation si besoin
3. Confirmer — l'action s'ajoute dans l'axe correspondant
4. Le tableau de bord se met à jour (progression de l'axe, progression globale)

### Parcours 3 : Suivi et synthèse
1. Consultation régulière du tableau de bord pour voir l'avancement
2. Consultation de "Mon référentiel" pour explorer les actions possibles par axe
3. Téléchargement d'une synthèse de certification
4. À 100% : écran de transmission / succès, puis passage à l'archive pour les cycles précédents

## Pages à créer

Espace PS connecté :

- [ ] Écran d'erreur auth PSC
- [ ] Onboarding applicatif post-connexion (vérification référentiel + CGU)
- [ ] État d'attente "référentiel non disponible" (en cours d'écriture par le CNP)
- [ ] **Tableau de bord** (refonte prioritaire — voir axes d'amélioration ci-dessous)
- [ ] Mon référentiel — vue axes (4 cartes + intitulés + lien CNP)
- [ ] Mon référentiel — détail axe (catalogue des actions du référentiel)
- [ ] Déclaration d'une action (page dédiée, pas modale)
- [ ] Archive (cycles précédents, lecture seule)
- [ ] Écran de succès 100% / transmission
- [ ] Transition cycle suivant / cas non certifié à l'échéance
- [ ] FAQ (3 entrées : Plateforme, Référentiel, Procédures + contacts ANS/CNP/Ordre)
- [ ] Paramètres du compte
- [ ] Notifications

## Modèle métier — référentiels et axes

- Chaque PS a un cycle de certification : **9 ans** (PS en exercice en 2023) ou **6 ans** (nouveaux inscrits post-2023)
- **52 référentiels** existants, élaborés par les CNP (Conseils Nationaux Professionnels)
- **1 PS = 1 référentiel**, attribué automatiquement via la spécialité ordinale (RPPS)
- **4 axes** de certification :
  - Axe 1 : Améliorer les connaissances et les compétences
  - Axe 2 : Renforcer la qualité des pratiques et des soins
  - Axe 3 : Améliorer la relation avec les patients
  - Axe 4 : Mieux prendre en compte sa santé
- **Minimum 2 actions par axe, 8 actions au total.** Dépassement possible (ex: 3/2). Évolution probable : pondération.

## Axes d'amélioration validés pour le dashboard

Le proto 2022 existe mais pose plusieurs problèmes UX (pas de "quoi faire maintenant", barre de progression temporelle trompeuse, statut "En cours" à 0/2, axes sans intitulé, 4 représentations redondantes de la même donnée, pas de moment 100%, charge cognitive élevée).

5 directions validées :

1. **Clarifier le "quoi faire maintenant"** — CTA principal visible, suggestion contextuelle (ex: "Déclarez votre première action pour [axe]")
2. **Logique de progression** plutôt que logique comptable — visualisation qui donne envie d'avancer
3. **Supprimer le bruit** — un seul système de représentation, countdown "Il vous reste X ans et Y mois" au lieu d'une barre temporelle
4. **Axes compréhensibles** — intitulés visibles dès le premier regard, wording simplifié
5. **Le moment 100%** — micro-récompenses en chemin + écran de succès dédié

**Curseur gamification** : institutionnel santé, pas ludique. Sweet spot : RACS CPD + Apple Activity Rings. Propre, sobre, avec progression visible et moments de satisfaction.

## Charte graphique / Contraintes

- **Design system** : **DSFR pur** (Système de Design de l'État) — **pas le DSFR thématisé ANS**
- **Logo opérateur** : à fournir (à placer dans `public/`)
- **Couleurs d'accent DSFR** : celles par défaut du DSFR (sobriété corporate)
- **Responsive** : desktop + smartphone (obligatoire)
- **Authentification** : Pro Santé Connect (CPS / e-CPS)
- **Source de données PS** : Annuaire Santé via RPPS
- **Accessibilité** : RGAA (implicite pour un SI public DSFR)

## Questions ouvertes

- Qui valide les actions "Libre / Autre" ? (Probablement déclaratif en V1, sans validation unitaire)
- Que se passe-t-il si le PS n'a pas complété à l'échéance ? (Parcours non défini)
- Le référentiel peut-il changer entre deux cycles ?
- Fréquence des mails de relance ?
- Le PS peut-il ajouter des actions après la date butoir ?

## Notes additionnelles

- **Mails identifiés** : mail "Lancement certification" (avec stepper statut référentiel, qui peut être "en cours d'écriture" par le CNP) ; mail "Synthèse certification" périodique (progression % + détail par axe + CTA "Accéder à mon espace")
- **Site public partiel** déjà existant : liste des référentiels, vidéo explicative, tableau des 51 référentiels consultables sans authentification
- **Seul l'Ordre** a une vue sur les données individuelles des PS
