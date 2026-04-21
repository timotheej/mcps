import referentielJson from "./referentiel-ide.json";

// ─── Types ──────────────────────────────────────────────

export type Theme = {
  id: string;
  label: string;
  description: string;
};

export type ActionRef = {
  code: string;
  type: string;
  libelle: string;
};

export type AxeRef = {
  id: string;
  label_officiel: string;
  label_court: string;
  label_ps: string;
  couleur: string;
  min_actions: number;
  themes: Theme[];
  actions_count: number;
  actions: ActionRef[];
};

export type Referentiel = {
  id: string;
  label: string;
  profession: string;
  cycle_duree_ans: number;
  actions_totales: number;
  min_total: number;
  axes: AxeRef[];
};

export const referentiel = referentielJson.referentiel as unknown as Referentiel;

// ─── Types d'actions ───────────────────────────────────

export type ActionTypeRef = {
  id: string;
  label: string;
  description: string;
  icon: string;
};

export const ACTION_TYPES: ActionTypeRef[] = [
  {
    id: "formation",
    label: "Formation",
    description: "Cours, DPC, DU, congres, enseignement...",
    icon: "fr-icon-book-2-line",
  },
  {
    id: "analyse-pratiques",
    label: "Analyse des pratiques",
    description: "APP, vignettes cliniques, groupes de reflexion, audits...",
    icon: "fr-icon-search-line",
  },
  {
    id: "gestion-risques",
    label: "Gestion des risques",
    description: "RETEX, CREX, RMM, protocoles, vigilances...",
    icon: "fr-icon-shield-line",
  },
  {
    id: "programme-integre",
    label: "Programme integre",
    description: "Simulation haute-fidelite, tests de concordance...",
    icon: "fr-icon-flashlight-line",
  },
  {
    id: "action-libre",
    label: "Action libre",
    description: "Proposez une action hors catalogue, a valider par votre CNP.",
    icon: "fr-icon-edit-line",
  },
];

// ─── Profil PS mock ─────────────────────────────────────

export const profileMock = {
  prenom: "Marie",
  nom: "Dubois",
  profession: "Infirmiere",
  specialite: "IDE Generaliste",
  rpps: "10003123456",
  debutCycle: "01/01/2023",
  finCycle: "31/12/2031",
  cycleDureeAns: 9,
};

// ─── Actions realisees ──────────────────────────────────

export type ActionRealisee = {
  id: string;
  axeId: string;
  libelle: string;
  date: string;
  type: string;
};

export const actionsRealiseesMock: ActionRealisee[] = [
  {
    id: "ar-1",
    axeId: "axe-2",
    libelle:
      "Participation a une revue morbi-mortalite sur les chutes en geriatrie",
    date: "15/03/2024",
    type: "Action de gestion des risques",
  },
  {
    id: "ar-2",
    axeId: "axe-4",
    libelle:
      "Formation a la prevention des troubles musculo-squelettiques",
    date: "22/01/2024",
    type: "Formation",
  },
  {
    id: "ar-3",
    axeId: "axe-4",
    libelle:
      "Participation a un groupe d'analyse des pratiques sur le stress au travail",
    date: "10/06/2024",
    type: "Action d'analyse des pratiques",
  },
];

// ─── Formations suggerees ───────────────────────────────

export type FormationSuggestion = {
  id: string;
  titre: string;
  organisme: string;
  duree: string;
  modalite: string;
  axeId: string;
  themes: string[];
  typeAction: string;
};

// Suggestions issues du vrai referentiel IDE (libelles officiels)
export const formationsMock: FormationSuggestion[] = [
  // ─── Axe 1 — Actualisation des connaissances ────────────
  {
    id: "REF.60.04_1-AXE1-1",
    titre: "Actions de DPC et Formation Continue dans le cadre des orientations prioritaires nationales",
    organisme: "ANDPC / ODPC",
    duree: "",
    modalite: "",
    axeId: "axe-1",
    themes: ["dpc-fc"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE1-8",
    titre: "Formations ciblees sur les expertises professionnelles infirmieres (liste CNPI)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-1",
    themes: ["dpc-fc"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE1-10",
    titre: "Organisation ou intervention lors de conferences, colloques ou journees professionnelles",
    organisme: "",
    duree: "",
    modalite: "Presentiel",
    axeId: "axe-1",
    themes: ["congres"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE1-11",
    titre: "Preparation et mise en oeuvre de communications orales / e-posters",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-1",
    themes: ["congres", "recherche"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE1-26",
    titre: "Activites d'enseignement et d'encadrement des travaux d'etudiants de sante",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-1",
    themes: ["enseignement"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE1-28",
    titre: "Tutorat d'apprenant (etudiant ou pair en integration)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-1",
    themes: ["tutorat"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE1-14",
    titre: "Travaux d'expertise, publication ou revues de litterature, commentaires d'articles",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-1",
    themes: ["recherche", "expertise"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE1-34",
    titre: "Seances d'analyse des pratiques / pratique reflexive individuelle ou en groupe",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-1",
    themes: ["simulation-1"],
    typeAction: "analyse-pratiques",
  },
  {
    id: "REF.60.04_1-AXE1-39",
    titre: "Conception, mise en oeuvre et evaluation de seances de simulation",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-1",
    themes: ["simulation-1"],
    typeAction: "gestion-risques",
  },
  // ─── Axe 2 — Qualite des pratiques ──────────────────────
  {
    id: "REF.60.04_1-AXE2-25",
    titre: "Redaction et actualisation de protocoles et d'aides cognitives",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-2",
    themes: ["protocoles"],
    typeAction: "gestion-risques",
  },
  {
    id: "REF.60.04_1-AXE2-7",
    titre: "Participation a des groupes de travail elaborant les recommandations HAS",
    organisme: "HAS",
    duree: "",
    modalite: "",
    axeId: "axe-2",
    themes: ["protocoles"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE2-37",
    titre: "Sessions de simulation haute-fidelite mono, inter et pluriprofessionnelle",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-2",
    themes: ["simulation-2"],
    typeAction: "programme-integre",
  },
  {
    id: "REF.60.04_1-AXE2-30",
    titre: "Comite de Retour d'Experience (CREX)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-2",
    themes: ["risques"],
    typeAction: "gestion-risques",
  },
  {
    id: "REF.60.04_1-AXE2-31",
    titre: "Revue Morbi-Mortalite (RMM)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-2",
    themes: ["risques"],
    typeAction: "gestion-risques",
  },
  {
    id: "REF.60.04_1-AXE2-20",
    titre: "Staff d'une equipe medico-soignante, groupe d'analyse des pratiques",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-2",
    themes: ["equipe"],
    typeAction: "analyse-pratiques",
  },
  {
    id: "REF.60.04_1-AXE2-23",
    titre: "Audit clinique, patients traceurs, traceur cible",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-2",
    themes: ["epp"],
    typeAction: "analyse-pratiques",
  },
  {
    id: "REF.60.04_1-AXE2-34",
    titre: "Participation a un comite d'etablissement (CLUD, CLIN, CLAN, Comite ethique...)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-2",
    themes: ["instances"],
    typeAction: "gestion-risques",
  },
  {
    id: "REF.60.04_1-AXE2-1",
    titre: "Demarche d'accreditation des specialites a risque pour les professionnels de sante",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-2",
    themes: ["accreditation"],
    typeAction: "formation",
  },
  // ─── Axe 3 — Relation patients ──────────────────────────
  {
    id: "REF.60.04_1-AXE3-6",
    titre: "Relation d'aide, gestion des douleurs provoquees par les soins, approches non medicamenteuses",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-3",
    themes: ["relation-aide"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE3-2",
    titre: "Depistage, prevention et prise en charge des violences intrafamiliales et de la maltraitance",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-3",
    themes: ["violences"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE3-12",
    titre: "Formation sur les droits des usagers, l'ethique et les droits des personnes vulnerables",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-3",
    themes: ["ethique"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE3-7",
    titre: "Collaboration avec les patients-experts, patients-partenaires et pairs-aidants",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-3",
    themes: ["education"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE3-5",
    titre: "Formations a la transculturalite, a l'ethnologie et aux specificites liees a l'age",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-3",
    themes: ["interculturalite"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE3-21",
    titre: "Participation a un dispositif d'annonce (cancer, dommage associe aux soins, maladie chronique)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-3",
    themes: ["annonce"],
    typeAction: "analyse-pratiques",
  },
  {
    id: "REF.60.04_1-AXE3-10",
    titre: "Participation aux travaux de la commission des usagers (CDU)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-3",
    themes: ["mediation"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE3-24",
    titre: "RETEX / CREX en lien avec les situations d'agressivite et de violences",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-3",
    themes: ["violences"],
    typeAction: "gestion-risques",
  },
  // ─── Axe 4 — Sante personnelle ─────────────────────────
  {
    id: "REF.60.04_1-AXE4-7",
    titre: "Prevention et maitrise des risques psychosociaux",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-4",
    themes: ["sante-travail"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE4-1",
    titre: "Formations ciblees sur le travail d'equipe et la sante",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-4",
    themes: ["sante-travail"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE4-5",
    titre: "Actions pour reduire les risques lies aux substances chimiques et agents physiques (PNSE4)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-4",
    themes: ["environnement"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE4-4",
    titre: "Formations a la promotion de sante et a la prevention en sante",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-4",
    themes: ["prevention"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE4-12",
    titre: "Auto-evaluation de son etat de sante avec outils de suivi ou d'auto-depistage",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-4",
    themes: ["autoeval"],
    typeAction: "analyse-pratiques",
  },
  {
    id: "REF.60.04_1-AXE4-10",
    titre: "Contribution a des actions de sante communautaire et de sante publique",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-4",
    themes: ["communautaire"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE4-2",
    titre: "Approfondissement des connaissances sur les determinants de sante et liens environnement-sante (PNNS 4)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-4",
    themes: ["determinants"],
    typeAction: "formation",
  },
  {
    id: "REF.60.04_1-AXE4-16",
    titre: "Pratique reguliere d'une activite extra-professionnelle (physique, sportive, culturelle, associative)",
    organisme: "",
    duree: "",
    modalite: "",
    axeId: "axe-4",
    themes: ["autoeval", "sante-travail"],
    typeAction: "gestion-risques",
  },
];

// ─── Helpers ────────────────────────────────────────────

export function getAxeById(id: string): AxeRef | undefined {
  return referentiel.axes.find((a) => a.id === id);
}

export function getFormationsForAxeAndThemes(
  axeId: string,
  themeIds: string[]
): FormationSuggestion[] {
  if (themeIds.length === 0) {
    return formationsMock.filter((f) => f.axeId === axeId);
  }
  return formationsMock.filter(
    (f) =>
      f.axeId === axeId && f.themes.some((t) => themeIds.includes(t))
  );
}

// ─── SessionStorage ─────────────────────────────────────

const THEMES_KEY = "mcps-maquette-themes";
const ACTIONS_KEY = "mcps-maquette-actions";

export function saveSelectedThemes(
  themes: Record<string, string[]>
): void {
  sessionStorage.setItem(THEMES_KEY, JSON.stringify(themes));
}

export function loadSelectedThemes(): Record<string, string[]> | null {
  const raw = sessionStorage.getItem(THEMES_KEY);
  return raw ? JSON.parse(raw) : null;
}

export function saveActions(actions: ActionRealisee[]): void {
  sessionStorage.setItem(ACTIONS_KEY, JSON.stringify(actions));
}

export function loadActions(): ActionRealisee[] {
  const raw = sessionStorage.getItem(ACTIONS_KEY);
  return raw ? JSON.parse(raw) : [...actionsRealiseesMock];
}

export function getActionsForAxe(
  axeId: string,
  actions: ActionRealisee[]
): ActionRealisee[] {
  return actions.filter((a) => a.axeId === axeId);
}

// ─── Temps restant ──────────────────────────────────────

export function getTempsRestant(): string {
  const fin = new Date(2031, 11, 31);
  const now = new Date();
  const diffMs = fin.getTime() - now.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const years = Math.floor(diffDays / 365.25);
  const months = Math.floor((diffDays % 365.25) / 30.44);
  return `${years} ans et ${months} mois`;
}

// ─── Timeline du cycle ──────────────────────────────────

const CYCLE_START = new Date(2023, 0, 1);
const CYCLE_END = new Date(2031, 11, 31);

export function getCycleProgress(): number {
  const now = new Date();
  const total = CYCLE_END.getTime() - CYCLE_START.getTime();
  const elapsed = now.getTime() - CYCLE_START.getTime();
  return Math.min(Math.max(elapsed / total, 0), 1);
}

function parseDateFr(dateStr: string): Date {
  const parts = dateStr.split("/");
  return new Date(
    parseInt(parts[2]),
    parseInt(parts[1]) - 1,
    parseInt(parts[0])
  );
}

export function getActionTimelinePosition(dateStr: string): number {
  const date = parseDateFr(dateStr);
  const total = CYCLE_END.getTime() - CYCLE_START.getTime();
  const elapsed = date.getTime() - CYCLE_START.getTime();
  return Math.min(Math.max(elapsed / total, 0), 1);
}

export function getCycleYears(): number[] {
  const years: number[] = [];
  for (let y = 2023; y <= 2031; y++) years.push(y);
  return years;
}

export function getYearPosition(year: number): number {
  const date = new Date(year, 0, 1);
  const total = CYCLE_END.getTime() - CYCLE_START.getTime();
  const elapsed = date.getTime() - CYCLE_START.getTime();
  return Math.min(Math.max(elapsed / total, 0), 1);
}

// ─── Prochaine etape ────────────────────────────────────

export type NextStep = {
  axe: AxeRef;
  reason: string;
  formation: FormationSuggestion | null;
};

export function getNextStep(
  actions: ActionRealisee[],
  themes: Record<string, string[]> | null
): NextStep | null {
  const progress = referentiel.axes.map((axe) => {
    const count = actions.filter((a) => a.axeId === axe.id).length;
    return {
      axe,
      count,
      isCovered: count >= axe.min_actions,
      remaining: Math.max(0, axe.min_actions - count),
    };
  });

  // Priority: axes with 0 actions, then axes in progress
  const uncovered = progress
    .filter((p) => !p.isCovered)
    .sort((a, b) => a.count - b.count);

  if (uncovered.length === 0) return null;

  const target = uncovered[0];
  const themeIds =
    themes && themes[target.axe.id] ? themes[target.axe.id] : [];
  const formations = getFormationsForAxeAndThemes(
    target.axe.id,
    themeIds
  );

  const reason =
    target.count === 0
      ? "Vous n'avez pas encore commence cet axe"
      : `Encore ${target.remaining} action${target.remaining > 1 ? "s" : ""} pour le couvrir`;

  return {
    axe: target.axe,
    reason,
    formation: formations[0] || null,
  };
}

// ─── Celebrations ───────────────────────────────────────

const CELEBRATED_KEY = "mcps-maquette-celebrated";

export function getNewlyCoveredAxes(
  actions: ActionRealisee[]
): AxeRef[] {
  const celebrated: string[] = JSON.parse(
    sessionStorage.getItem(CELEBRATED_KEY) || "[]"
  );
  const newlyCovered = referentiel.axes.filter((axe) => {
    const count = actions.filter((a) => a.axeId === axe.id).length;
    return count >= axe.min_actions && !celebrated.includes(axe.id);
  });
  return newlyCovered;
}

export function markAxesCelebrated(axeIds: string[]): void {
  const celebrated: string[] = JSON.parse(
    sessionStorage.getItem(CELEBRATED_KEY) || "[]"
  );
  const updated = [...new Set([...celebrated, ...axeIds])];
  sessionStorage.setItem(CELEBRATED_KEY, JSON.stringify(updated));
}

// ─── Action type helpers ───────────────────────────────

export function getActionTypeLabel(typeId: string): string {
  const t = ACTION_TYPES.find((at) => at.id === typeId);
  return t ? t.label : typeId;
}

// ─── Theme label lookup ─────────────────────────────────

export function getThemeLabel(
  axeId: string,
  themeId: string
): string {
  const axe = getAxeById(axeId);
  if (!axe) return themeId;
  const theme = axe.themes.find((t) => t.id === themeId);
  return theme ? theme.label : themeId;
}

// ─── Axe navigation ────────────────────────────────────

export function getAdjacentAxes(
  currentId: string
): { prev: AxeRef | null; next: AxeRef | null } {
  const idx = referentiel.axes.findIndex((a) => a.id === currentId);
  return {
    prev: idx > 0 ? referentiel.axes[idx - 1] : null,
    next:
      idx < referentiel.axes.length - 1
        ? referentiel.axes[idx + 1]
        : null,
  };
}
