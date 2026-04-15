# Instructions projet — mcps (DSFR React)

## REGLE FONDAMENTALE : DSFR standard, sobre et corporate

**Pour toute modification ou creation dans ce projet, utiliser les composants DSFR tels quels.** Le DSFR est deja bien designe — ne pas surdesigner.

1. **Composant react-dsfr avec variante par defaut** — utiliser le composant standard. Ne changer la variante que si le besoin l'exige (ex: severity d'un badge)
2. **Composant custom sobre** — uniquement si AUCUN composant DSFR ne convient. Structure simple avec tokens DSFR, pas d'ombres custom, pas de fonds colores
3. **CSS custom** — cas exceptionnel, dans un fichier `.css` importe, jamais en surcharge du DSFR

### Sobriete = qualite

Le site systeme-de-design.gouv.fr est la reference : sobre, propre, corporate. Appliquer les memes principes :
- **Fonds** : blanc (`--background-default-grey`) + gris clair (`--background-alt-grey`) pour le rythme. C'est tout.
- **Couleurs d'accent** : uniquement semantiques (success, error, warning, info sur les badges/alertes). Pas de decoration.
- **Ombres** : aucune custom. Les composants DSFR gerent les leurs.
- **Differenciation** : par le contenu et la typographie, pas par la couleur.
- **Pas de fonds contrast-* pour des sections** — reserve aux CallOut, Alert, Notice.

### Pages de contenu vs pages applicatives

| | Pages de contenu | Pages applicatives (dashboard, portail) |
|---|---|---|
| **Structure** | 100% DSFR (Header, Footer, grille, Breadcrumb) | 100% DSFR (Header, Footer, grille, Breadcrumb) |
| **Zone de contenu** | Composants react-dsfr exclusivement | Composants react-dsfr + composants custom avec tokens DSFR |
| **Layout** | Grille DSFR standard (fr-col-12, fr-col-3/fr-col-9...) | Grille DSFR, layout custom autorise dans les zones de contenu |
| **CSS custom** | Non | Oui, dans un fichier `.css` importe, avec tokens DSFR |

---

## Stack technique

- React 18 + TypeScript
- Vite (dev server + build)
- `@codegouvfr/react-dsfr` (wrapper React officiel du DSFR)
- React Router 6 (navigation SPA, layout partage)

## Structure du projet

```
├── index.html                  # Point d'entree Vite (CSS/favicons react-dsfr)
├── src/
│   ├── main.tsx               # Initialisation React + DSFR + BrowserRouter
│   ├── App.tsx                # Routes React Router
│   ├── Layout.tsx             # Header + Footer DSFR partages (Outlet)
│   ├── pages/                 # Pages/ecrans (composants React)
│   │   └── Accueil.tsx        # Page d'accueil
│   └── components/            # Composants reutilisables (custom)
├── specs/                     # Specifications fonctionnelles
├── PROJET.md                  # Contexte metier du projet
├── CLAUDE.md                  # Ce fichier
└── node_modules/
    ├── @codegouvfr/react-dsfr/    # Composants React DSFR
    └── @timotheej/dsfr-toolkit/
        ├── agents/            # Prompts des agents specialises (UX, UI, Review)
        └── docs/              # Doc DSFR complete (fondations, composants, modeles)
```

---

## WORKFLOW AUTOMATIQUE — Architecture multi-agents

Quand l'utilisateur te demande de creer ou modifier un ecran, tu orchestes **4 agents specialises** dans l'ordre. Ne saute aucune phase. Ce workflow garantit une qualite UI/UX professionnelle.

---

### PHASE 0 — INITIALISATION DU PROJET (si PROJET.md est vide)

Si le fichier `PROJET.md` n'est pas encore rempli (contient encore les placeholders), **lance un interview structure** :

1. Demande a l'utilisateur de decrire le projet en quelques phrases (client, objectif, utilisateurs)
2. Pose des questions de clarification si necessaire :
   - Qui sont les utilisateurs cibles ?
   - Quels sont les parcours principaux ?
   - Y a-t-il des contraintes specifiques (logo operateur, charte, etc.) ?
3. **Remplis toi-meme le fichier `PROJET.md`** avec les informations collectees
4. Propose la liste des pages/ecrans a creer
5. Demande validation avant de continuer

Cette phase ne se joue qu'une seule fois, au tout debut du projet.

---

### PHASE 1 — UX RESEARCH (sub-agent specialise)

**Objectif** : Produire un wireframe detaille avec rationale UX pour chaque decision de placement.

**Execution** : Utilise l'outil **Task** pour spawner un agent UX specialise :

```
Outil : Task
subagent_type : "general-purpose"
prompt :
  "Lis et suis les instructions dans node_modules/@timotheej/dsfr-toolkit/agents/ux-researcher.md

   CONTEXTE PROJET :
   - Lis le fichier PROJET.md pour le contexte metier
   - Lis les fichiers dans specs/ s'ils existent
   - Lis les pages existantes dans src/pages/ pour la coherence
   - Lis src/App.tsx pour les routes existantes

   DEMANDE UTILISATEUR :
   [Copie ici la demande exacte de l'utilisateur]

   Produis un wireframe detaille avec rationale UX pour chaque zone."
```

Une fois le wireframe recu du sub-agent :
1. **Presente le wireframe a l'utilisateur** avec les rationales UX
2. **Attends la validation** avant de passer a la phase suivante
3. Si l'utilisateur demande des modifications, relance le sub-agent UX avec les retours

---

### PHASE 2 — UI DESIGN (sub-agent specialise)

**Objectif** : Transformer le wireframe valide en specification UI detaillee avec composants precis, couleurs, espacements, responsive et micro-etats.

**Execution** : Utilise l'outil **Task** pour spawner un agent UI Designer Senior :

```
Outil : Task
subagent_type : "general-purpose"
prompt :
  "Lis et suis les instructions dans node_modules/@timotheej/dsfr-toolkit/agents/ui-designer.md

   WIREFRAME VALIDE :
   [Copie ici le wireframe valide par l'utilisateur]

   CONTEXTE :
   - Lis PROJET.md pour le contexte metier
   - Lis les pages existantes dans src/pages/ pour la coherence visuelle
   - Documentation DSFR disponible dans node_modules/@timotheej/dsfr-toolkit/docs/

   Produis une specification UI detaillee pour chaque zone du wireframe."
```

Le sub-agent UI Designer retourne une spec detaillee avec :
- Composants react-dsfr exacts (import + props) ou specs de composants custom
- Tokens couleur precis (variables CSS DSFR)
- Classes d'espacement exactes
- Comportement responsive par breakpoint
- Micro-etats des elements interactifs

---

### PHASE 3 — IMPLEMENTATION (toi, agent principal)

Tu implementes fidelement la spec UI en React. Tu ne fais PAS de decisions de design — tu suis la spec.

1. **Creer le composant page** dans `src/pages/NomPage.tsx` :
   ```tsx
   import { fr } from "@codegouvfr/react-dsfr";
   import { Button } from "@codegouvfr/react-dsfr/Button";
   // ... imports selon la spec UI

   export function NomPage() {
     return (
       <div className={fr.cx("fr-container", "fr-my-6w")}>
         <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
           <div className={fr.cx("fr-col-12")}>
             {/* Implementation fidele a la spec UI */}
           </div>
         </div>
       </div>
     );
   }
   ```

2. **Ajouter la route** dans `src/App.tsx` :
   ```tsx
   import { NomPage } from "./pages/NomPage";
   // Dans les <Routes> :
   <Route path="/nom-page" element={<NomPage />} />
   ```

3. **Ajouter la navigation** dans `src/Layout.tsx` :
   ```tsx
   // Dans le tableau navigation du Header :
   {
     text: "Nom page",
     linkProps: { to: "/nom-page" },
     isActive: location.pathname === "/nom-page",
   },
   ```

4. **Pour les composants custom** (selon la spec UI) :
   - Creer dans `src/components/NomComposant.tsx`
   - CSS custom dans `src/components/NomComposant.css` importe par le composant
   - Utiliser les variables CSS DSFR (jamais de couleurs en dur)
   - Prefixer les classes custom (ex: `app-*`, `dashboard-*`)

5. **Formulaires** :
   - Utiliser les composants react-dsfr : `<Input>`, `<Select>`, `<Checkbox>`, `<RadioButtons>`
   - Une seule colonne, labels au-dessus des inputs
   - Champs obligatoires par defaut, optionnels marques "(optionnel)"

---

### PHASE 4 — RECETTE UI (toi, agent principal + MCP Chrome DevTools)

**Objectif** : Verifier que l'implementation est fidele a la spec UI avec une qualite professionnelle.

**Execution** : Lis les instructions de review dans `node_modules/@timotheej/dsfr-toolkit/agents/ui-reviewer.md` et suis-les.

En resume :
1. **Screenshots multi-viewport** via MCP Chrome DevTools :
   - Desktop 1440px, full page
   - Tablet 768px, full page
   - Mobile 375px, full page
   - Dark mode desktop + mobile
2. **Compare chaque screenshot avec la spec UI** sur 11 criteres :
   - Hierarchie visuelle, alignement, espacement, couleurs, typographie, responsive, dark mode, accessibilite, lisibilite des tokens, harmonie visuelle, impression generale
3. **Classe les defauts** : Bloquant / Majeur / Design / Mineur
4. **Si defauts DESIGN** (probleme dans la spec, pas dans le code) : **retour a la Phase 2** — relance le sub-agent UI Designer avec les retours du reviewer, puis re-implemente
5. **Corrige les bloquants et majeurs**, reprends les screenshots
6. **Repete** jusqu'a 0 bloquants, 0 majeurs et 0 design

Enfin, **propose les prochaines pages/ecrans** a creer selon le contexte du projet.

---

### PHASE 5 — EXPORT FIGMA (optionnel, sur demande)

**Objectif** : Exporter un ecran React valide vers Figma pour documentation/handoff.

**Prerequis** :
- MCP Figma connecte dans Claude Code (plugin `figma@claude-plugins-official`)
- Bibliotheque DSFR connectee dans le fichier Figma cible ("DSFR - Composants" + "DSFR - Fondamentaux")
- URL du fichier Figma fournie par l'utilisateur

**Quand** : l'utilisateur dit "exporte dans Figma", "pousse dans Figma", "cree la maquette Figma", etc.

**Execution** : Utilise l'outil **Task** pour spawner un sub-agent avec contexte frais :

```
Outil : Task
subagent_type : "general-purpose"
prompt :

  "Tu dois recreer dans Figma un ecran React existant en utilisant les composants
   de la bibliotheque DSFR connectee.

   ## REGLE ABSOLUE
   Pour CHAQUE composant react-dsfr utilise dans le code, tu DOIS instancier
   le composant equivalent depuis la bibliotheque DSFR Figma :
   1. search_design_system('[nom composant]') — trouver le composant
   2. Invoquer le skill /figma:figma-use — OBLIGATOIRE avant chaque use_figma
   3. use_figma(...) — instancier le composant de la bibliotheque

   JAMAIS de shapes manuelles pour remplacer un composant DSFR.

   ## CODE REACT SOURCE
   [Copie ici le contenu complet du fichier src/pages/XxxPage.tsx]

   ## CORRESPONDANCE react-dsfr → Figma
   Button → search 'Bouton'          | Card → search 'Carte'
   Alert → search 'Alerte'           | Badge → search 'Badge'
   Header → search 'En-tete'         | Footer → search 'Pied de page'
   Breadcrumb → search 'Fil d Ariane' | Input → search 'Champ de saisie'
   Table → search 'Tableau'          | Tag → search 'Tag'
   Tabs → search 'Onglets'           | CallOut → search 'Mise en avant'
   Accordion → search 'Accordeon'     | Pagination → search 'Pagination'
   Select → search 'Liste deroulante' | RadioButtons → search 'Bouton radio'
   Checkbox → search 'Case a cocher'  | ToggleSwitch → search 'Interrupteur'
   Tile → search 'Tuile'             | SideMenu → search 'Menu lateral'
   Stepper → search 'Indicateur d etapes' | Notice → search 'Bandeau d information'

   ## FICHIER FIGMA
   URL : [URL du fichier Figma]
   Page cible : [Nom de la page]

   ## METHODE
   1. Lis le code React pour comprendre la structure de la page
   2. search_design_system pour TOUS les composants DSFR utilises
   3. Construis la page dans Figma section par section
   4. get_screenshot pour verifier la fidelite avec le proto React

   ## CHECKLIST OBLIGATOIRE
   Avant de terminer, liste chaque element :
   - Nom | INSTANCE BIBLIOTHEQUE ou MANUEL | Si MANUEL : justification
   Si un element est MANUEL alors qu un composant DSFR existe, corrige-le."
```

---

## Correspondance DSFR → react-dsfr

Utilise ces imports pour les composants DSFR en React :

| Besoin | Import react-dsfr |
|--------|-------------------|
| Bouton | `import { Button } from "@codegouvfr/react-dsfr/Button"` |
| Groupe de boutons | `import { ButtonsGroup } from "@codegouvfr/react-dsfr/ButtonsGroup"` |
| Alerte | `import { Alert } from "@codegouvfr/react-dsfr/Alert"` |
| Badge | `import { Badge } from "@codegouvfr/react-dsfr/Badge"` |
| Breadcrumb | `import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb"` |
| Callout | `import { CallOut } from "@codegouvfr/react-dsfr/CallOut"` |
| Carte | `import { Card } from "@codegouvfr/react-dsfr/Card"` |
| Header | `import { Header } from "@codegouvfr/react-dsfr/Header"` |
| Footer | `import { Footer } from "@codegouvfr/react-dsfr/Footer"` |
| Input | `import { Input } from "@codegouvfr/react-dsfr/Input"` |
| Select | `import { Select } from "@codegouvfr/react-dsfr/SelectNext"` |
| Checkbox | `import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox"` |
| Radio | `import { RadioButtons } from "@codegouvfr/react-dsfr/RadioButtons"` |
| Tableau | `import { Table } from "@codegouvfr/react-dsfr/Table"` |
| Tag | `import { Tag } from "@codegouvfr/react-dsfr/Tag"` |
| Onglets | `import { Tabs } from "@codegouvfr/react-dsfr/Tabs"` |
| Tuile | `import { Tile } from "@codegouvfr/react-dsfr/Tile"` |
| Accordeon | `import { Accordion } from "@codegouvfr/react-dsfr/Accordion"` |
| Modale | `import { createModal } from "@codegouvfr/react-dsfr/Modal"` |
| Pagination | `import { Pagination } from "@codegouvfr/react-dsfr/Pagination"` |
| Stepper | `import { Stepper } from "@codegouvfr/react-dsfr/Stepper"` |
| Toggle | `import { ToggleSwitch } from "@codegouvfr/react-dsfr/ToggleSwitch"` |
| Notice / Bandeau | `import { Notice } from "@codegouvfr/react-dsfr/Notice"` |
| Highlight | `import { Highlight } from "@codegouvfr/react-dsfr/Highlight"` |
| Sidemenu | `import { SideMenu } from "@codegouvfr/react-dsfr/SideMenu"` |
| Upload | `import { Upload } from "@codegouvfr/react-dsfr/Upload"` |
| Mot de passe | `import { PasswordInput } from "@codegouvfr/react-dsfr/blocks/PasswordInput"` |
| Classes utilitaires | `import { fr } from "@codegouvfr/react-dsfr"` puis `fr.cx("fr-mt-4w")` |
| Dark mode (hook) | `import { useIsDark } from "@codegouvfr/react-dsfr/useIsDark"` |
| Theme affichage | `import { headerFooterDisplayItem } from "@codegouvfr/react-dsfr/Display"` |

---

## Regles DSFR — Reference rapide

### Convention de nommage CSS

- Prefixe : `fr-`
- Methodologie : BEM (Block-Element-Modifier)
- Pattern : `fr-block__element--modifier`
- En React : toujours via `fr.cx("fr-block__element--modifier")`

### Breakpoints

| Nom | Min-width | Suffixe |
|-----|-----------|---------|
| XS | 0px | (defaut) |
| SM | 576px | `-sm` |
| MD | 768px | `-md` |
| LG | 992px | `-lg` |
| XL | 1248px | `-xl` |

### Espacements structurels

| Contexte | Token | Valeur |
|----------|-------|--------|
| Titre → description | `fr-mt-2w` | 16px |
| Bloc titre → contenu | `fr-mt-3w` | 24px |
| Entre sous-sections | `fr-mt-4w` | 32px |
| Entre sections majeures | `fr-mt-5w` | 40px |
| Dernier contenu → footer | `fr-mt-7w` | 56px |

---

## Documentation DSFR complete

**Note importante** : La documentation ci-dessous decrit la structure HTML des composants DSFR. En React, utiliser les composants `@codegouvfr/react-dsfr` qui encapsulent ce HTML. La documentation reste utile pour :
- Comprendre les variantes disponibles (tailles, couleurs, etats)
- Les attributs aria-* et l'accessibilite
- Les classes CSS utilitaires applicables via `fr.cx()`
- La structure des composants complexes (Header, Footer)

### Fondations

| Sujet | Fichier |
|-------|---------|
| Typographie | `node_modules/@timotheej/dsfr-toolkit/docs/fondations/typographie.md` |
| Couleurs | `node_modules/@timotheej/dsfr-toolkit/docs/fondations/couleurs.md` |
| Grille et breakpoints | `node_modules/@timotheej/dsfr-toolkit/docs/fondations/grille.md` |
| Espacement | `node_modules/@timotheej/dsfr-toolkit/docs/fondations/espacement.md` |
| Icones | `node_modules/@timotheej/dsfr-toolkit/docs/fondations/icones.md` |
| Pictogrammes | `node_modules/@timotheej/dsfr-toolkit/docs/fondations/pictogrammes.md` |
| Elevation/ombres | `node_modules/@timotheej/dsfr-toolkit/docs/fondations/elevation.md` |
| Medias | `node_modules/@timotheej/dsfr-toolkit/docs/fondations/medias.md` |

### Composants

| Composant | Prefixe CSS | Documentation |
|-----------|-------------|---------------|
| Accordeon | `fr-accordion` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/accordeon.md` |
| Alerte | `fr-alert` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/alerte.md` |
| Badge | `fr-badge` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/badge.md` |
| Bandeau info | `fr-notice` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/notice.md` |
| Recherche | `fr-search-bar` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/recherche.md` |
| Logo | `fr-logo` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/logo.md` |
| Bouton | `fr-btn` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/bouton.md` |
| FranceConnect | `fr-connect` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/franceconnect.md` |
| Radio | `fr-radio-group` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/radio.md` |
| Carte | `fr-card` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/carte.md` |
| Checkbox | `fr-checkbox-group` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/checkbox.md` |
| Input | `fr-input-group` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/input.md` |
| Callout | `fr-callout` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/callout.md` |
| Citation | `fr-quote` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/citation.md` |
| Consentement | `fr-consent-banner` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/consentement.md` |
| Contenu medias | `fr-content-media` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/contenu-medias.md` |
| Segmente | `fr-segmented` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/segmented.md` |
| Curseur | `fr-range` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/curseur.md` |
| Header | `fr-header` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/header.md` |
| Breadcrumb | `fr-breadcrumb` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/breadcrumb.md` |
| Formulaire | `fr-fieldset` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/formulaire.md` |
| Highlight | `fr-highlight` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/highlight.md` |
| Lien | `fr-link` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/lien.md` |
| Modale | `fr-modal` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/modale.md` |
| Mot de passe | `fr-password` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/password.md` |
| Navigation | `fr-nav` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/navigation.md` |
| Onglet | `fr-tabs` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/onglet.md` |
| Pagination | `fr-pagination` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/pagination.md` |
| Affichage | `fr-display` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/display.md` |
| Partage | `fr-share` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/partage.md` |
| Footer | `fr-footer` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/footer.md` |
| Langues | `fr-translate` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/translate.md` |
| Select | `fr-select-group` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/select.md` |
| Sidemenu | `fr-sidemenu` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/sidemenu.md` |
| Skiplinks | `fr-skiplinks` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/skiplinks.md` |
| Sommaire | `fr-summary` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/sommaire.md` |
| Stepper | `fr-stepper` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/stepper.md` |
| Tableau | `fr-table` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/tableau.md` |
| Tag | `fr-tag` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/tag.md` |
| Toggle | `fr-toggle` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/toggle.md` |
| Tooltip | `fr-tooltip` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/tooltip.md` |
| Transcription | `fr-transcription` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/transcription.md` |
| Tuile | `fr-tile` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/tuile.md` |
| Upload | `fr-upload-group` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/upload.md` |
| Follow | `fr-follow` | `node_modules/@timotheej/dsfr-toolkit/docs/composants/follow.md` |

### Utilitaires

| Sujet | Fichier |
|-------|---------|
| Classes d'affichage | `node_modules/@timotheej/dsfr-toolkit/docs/utilitaires/affichage.md` |
| Classes d'espacement | `node_modules/@timotheej/dsfr-toolkit/docs/utilitaires/espacement.md` |

### Modeles de pages

| Modele | Fichier |
|--------|---------|
| Pages d'erreur | `node_modules/@timotheej/dsfr-toolkit/docs/modeles/erreurs.md` |
| Page de connexion | `node_modules/@timotheej/dsfr-toolkit/docs/modeles/connexion.md` |
| Formulaire multi-etapes | `node_modules/@timotheej/dsfr-toolkit/docs/modeles/formulaire-multi-etapes.md` |
| Tableau filtrable | `node_modules/@timotheej/dsfr-toolkit/docs/modeles/tableau-filtrable.md` |
| Page de liste | `node_modules/@timotheej/dsfr-toolkit/docs/modeles/page-de-liste.md` |
| Page de contenu | `node_modules/@timotheej/dsfr-toolkit/docs/modeles/page-de-contenu.md` |

---

## Composants Beta (ne pas utiliser en production)

En-tete connectee, Combobox, Dropdown, Tabnav, Composition

## Composant deprecie

Telechargement (`fr-download`) → Utiliser Card, Link ou Tile en variante download
