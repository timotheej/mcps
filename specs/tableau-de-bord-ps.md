# Spec — Tableau de bord PS (refonte)

> Écran prioritaire du MVP. Refonte du proto 2022.
> À lire avec `specs/strategie-motivation.md` qui pose la stratégie UX (sens + autonomie).

## Rôle de l'écran

Premier écran après authentification Pro Santé Connect. C'est l'écran que le PS verra le plus souvent. Il doit :

1. Lui dire **où il en est** dans son cycle de certification (temps restant, actions déclarées)
2. Lui dire **quoi faire maintenant** (prochaine étape claire, pas un tableau à décoder)
3. Lui donner **envie de faire** (sens, miroir professionnel, non infantilisant)

## Données d'entrée disponibles

- Identité PS via Pro Santé Connect (RPPS, spécialité ordinale)
- Référentiel attribué automatiquement (1 PS = 1 référentiel parmi 52)
- Dates de début et de fin de cycle (6 ans ou 9 ans)
- Liste des actions déclarées, par axe, avec statut et source (AUTOMATIQUE / MANUEL)
- Règle de complétion : min 2 actions par axe, 8 au total, dépassement possible

## État de l'existant — proto 2022

Le proto affiche actuellement :
- Header avec référentiel attribué (ex: "CHIRURGIEN DENTISTE"), dates début/fin cycle, barre de progression temporelle
- 4 blocs axes numérotés ("AXE 1 — 2/2", "AXE 2 — 1/2"...)
- Donut de progression globale ("37,5%")
- Liste accordion "Actions réalisées par Axe" avec statut (Complet / En cours) + dépliage
- Quand déplié : tableau Nature / Libellé / Date / Type d'ajout / Source
- Bouton "+ Ajouter une action" dans chaque axe déplié
- Nav : Tableau de bord | Mon référentiel | Archive | FAQ
- CTA "Télécharger une synthèse"

## Problèmes identifiés (audit UX)

1. **Pas de "quoi faire maintenant"** — aucun CTA visible à l'arrivée, le PS ne sait pas par où commencer
2. **Barre de progression temporelle trompeuse** — mélange temps qui passe et progression des actions. Un PS qui fait tout d'un coup ne verra jamais la barre bouger. Ce n'est pas une progression, c'est un deadline → devrait être un **countdown** "Il vous reste X ans et Y mois"
3. **Statut "En cours" à 0/2 = trompeur** — rien n'est en cours, c'est "Non commencé"
4. **Blocs axes numérotés sans intitulé** — "Axe 1, 2, 3, 4" ne veut rien dire. Les vrais noms sont en bas dans l'accordion → aller-retour cognitif
5. **Doublon d'information** — barre temporelle + donut + blocs chiffrés + liste = 4 représentations de la même donnée
6. **Dépassement non communiqué** — 3/2 sur un axe est possible mais pas expliqué
7. **État 100% = même écran en vert** — pas de moment de félicitation, pas d'écran de succès dédié
8. **Charge cognitive élevée** — signalé par Cécile (service client ANS / voix utilisateurs)

## 5 axes d'amélioration validés

1. **Clarifier le "quoi faire maintenant"** — CTA principal visible, suggestion contextuelle
2. **Remplacer la logique comptable par une logique de progression** — visualisation qui donne envie d'avancer, pas un compteur d'obligations
3. **Supprimer le bruit, garder l'essentiel** — un seul système de représentation, countdown au lieu de barre temporelle
4. **Rendre les axes compréhensibles** — intitulés visibles dès le premier regard, wording simplifié
5. **Le moment 100%** — micro-récompenses en chemin + écran de succès dédié

## Orientation UX (depuis strategie-motivation.md)

**Levier principal : LE SENS. Facilitateur : L'AUTONOMIE.**

Conséquence pour le dashboard :
- La hiérarchie visuelle doit amplifier le **bénéfice patient** des axes et du parcours, pas la conformité administrative
- Les 4 axes doivent apparaître avec leurs **intitulés** (pas "Axe 1") et idéalement avec une formulation qui ancre le sens ("la relation avec le patient" plutôt que "Axe 3")
- Le CTA "quoi faire maintenant" doit être contextualisé à la spécialité quand c'est possible ("En tant que sage-femme...")
- L'autonomie s'exprime par le choix du point d'entrée : "par quoi voulez-vous commencer ?" avec suggestion non contraignante

## Contrainte de lancement — référentiels hétérogènes

Au lancement (nov 2026), certains référentiels seront incomplets ou peu granulaires. Le dashboard doit **fonctionner à deux niveaux de richesse référentielle** sans que le PS perçoive de différence de qualité.

**Socle recommandé** : combiner Piste 1 (sens au niveau de l'axe, pas de la formation) + Piste 4 (sens ancré dans l'identité professionnelle). Les deux sont atteignables dès le lancement avec seulement la spécialité du PS et la définition réglementaire des axes — aucun référentiel riche requis.

**Évolution** : Piste 2 (emplacements prévus qui s'enrichissent au fil des mois).

**Question ouverte bloquante** : combien des 7 Ordres auront des référentiels exploitables en nov 2026 ? À clarifier avant la phase UX détaillée.

## Patterns benchmarkés applicables

- **Progression visuelle multi-axes** — 4 anneaux ou barres nommés avec les vrais intitulés. Références : Apple Activity Rings, RACS CPD Dashboard.
- **Next action** — bloc "Votre prochaine étape" avec CTA contextuel (axe le moins avancé, première action si rien). Références : Duolingo (prochain exercice mis en évidence), Noom (un seul CTA par jour).
- **Feedback de micro-accomplissement** — quand un axe passe à "Complet" → feedback positif ; quand 4/4 → écran dédié. Ton institutionnel mais chaleureux. Références : Apple Watch (discret), Fitbit (milestone).
- **Countdown au lieu de timeline** — "Il vous reste 5 ans et 8 mois". Warning uniquement quand ratio temps/actions restantes devient critique. Références : CPD Progress Tracker, RACS CPD.
- **Empty state qui motive** — première connexion : pas 4 axes à zéro, mais page "Bienvenue, votre certification en 3 minutes" + CTA unique "Déclarer ma première action". Références : Duolingo, Headspace.

## Curseur gamification

Contexte institutionnel santé + DSFR pur → pas de Duolingo. **Sweet spot : RACS CPD + Apple Activity Rings.** Propre, institutionnel, progression visible, moments de satisfaction discrets. **Jamais infantilisant, jamais condescendant.**

## États à concevoir

- **Premier accès (0 action)** — empty state motivant avec CTA unique, pas 4 axes vides
- **Cycle en cours partiel** — état nominal, progression par axe + next action
- **Un axe complet, autres en cours** — micro-feedback sur l'axe complété sans noyer le reste
- **Très en retard (alerte temps)** — countdown devient warning, CTA de rattrapage
- **100% atteint** — écran de succès / transmission dédié (pas le même écran en vert)
- **Post-transmission / attente validation** — à définir
- **Cycle expiré sans complétion** — parcours non défini (question ouverte)

## Composants DSFR pressentis (à confirmer en phase UI)

- Layout : grille DSFR, `fr-container`, Breadcrumb
- Header : intitulé référentiel + countdown (pas barre de progression)
- 4 cartes axes : `Card` custom ou `Tile` enrichi — à évaluer. Progression par anneau/barre à valider en phase UI
- CTA "quoi faire maintenant" : `CallOut` ou `Highlight` (à évaluer) + `Button` primary
- Liste actions par axe : `Accordion` + `Table`
- Synthèse : `Button` secondary
- Écran de succès : `Alert` success + pictogramme + CTA

## Reste à trancher

1. **Combien d'Ordres avec référentiels exploitables en nov 2026** (bloquant pour ton du copywriting)
2. **Existence d'une étape de transmission formelle** à 100% (ou passage automatique à l'archive ?)
3. **Parcours si non complété à l'échéance** — totalement à définir
4. **Validation des actions Libre/Autre** — probablement déclaratif en V1
5. **Fréquence et contenu des relances mail** — impact sur le dashboard (notifications in-app ?)
6. **Favoriser / noter une action par les pairs** (idée mentionnée) — V1 ou V2 ?

## Prochaines étapes

1. Clarifier la question bloquante sur la maturité des référentiels
2. Phase 1 — UX Research : wireframe du dashboard avec rationale (sens + autonomie, couvrant tous les états)
3. Phase 2 — UI Design : spec UI détaillée (composants react-dsfr, tokens, responsive, dark mode)
4. Phase 3 — Implémentation React
5. Phase 4 — Recette UI multi-viewport
