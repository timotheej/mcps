export type AxeStatut = "non-commence" | "en-cours" | "couvert";

export type ActionCatalogue = {
  nature: string;
  libelle: string;
  format: string;
  duree: string;
};

export type ActionDeclaree = {
  libelle: string;
  date: string;
  origine: "Automatique" | "Manuel";
  source: string;
};

export type Axe = {
  numero: 1 | 2 | 3 | 4;
  intitule: string;
  sens: string;
  minimum: number;
  invitation: string;
  cadre: string;
  actionsDeclarees: ActionDeclaree[];
  catalogue: ActionCatalogue[];
};

export const axes: Axe[] = [
  {
    numero: 1,
    intitule: "Ameliorer les connaissances et les competences",
    sens: "Rester au niveau des connaissances et techniques qui evoluent dans votre pratique.",
    minimum: 2,
    invitation:
      "Quelle formation ou lecture recente aimeriez-vous rattacher a cet axe ?",
    cadre:
      "Cet axe couvre la mise a jour de votre savoir face aux situations rencontrees dans votre pratique — evolution des techniques, des recommandations, des connaissances scientifiques.",
    actionsDeclarees: [
      {
        libelle: 'Formation "Prise en charge de la douleur chronique"',
        date: "12 novembre 2026",
        origine: "Automatique",
        source: "DPC Formation Sante",
      },
      {
        libelle:
          'Congres annuel "Innovations en chirurgie dentaire" — participation',
        date: "18 septembre 2026",
        origine: "Manuel",
        source: "Declaration libre",
      },
      {
        libelle: 'Module e-learning "Nouveaux materiaux de restauration"',
        date: "03 juillet 2026",
        origine: "Automatique",
        source: "DPC Formation Sante",
      },
    ],
    catalogue: [
      {
        nature: "Formation continue",
        libelle: "Action de developpement professionnel continu (DPC)",
        format: "Presentiel ou distanciel",
        duree: "Variable",
      },
      {
        nature: "Formation continue",
        libelle: "Formation diplomante (DU, DIU, master)",
        format: "Presentiel",
        duree: "1 a 2 ans",
      },
      {
        nature: "Formation continue",
        libelle: "Formation certifiante courte",
        format: "Presentiel ou distanciel",
        duree: "1 a 5 jours",
      },
      {
        nature: "Apprentissage",
        libelle: "Lecture d'une publication scientifique de reference",
        format: "Autoformation",
        duree: "Variable",
      },
      {
        nature: "Echange entre pairs",
        libelle: "Participation a un congres ou un seminaire professionnel",
        format: "Presentiel",
        duree: "1 a 3 jours",
      },
      {
        nature: "Echange entre pairs",
        libelle: "Participation a un groupe d'analyse de pratique",
        format: "Presentiel ou distanciel",
        duree: "Variable",
      },
      {
        nature: "Autoformation",
        libelle: "Suivi d'un module e-learning certifiant",
        format: "Distanciel",
        duree: "2 a 20 heures",
      },
    ],
  },
  {
    numero: 2,
    intitule: "Renforcer la qualite des pratiques et des soins",
    sens: "Evaluer et ajuster vos gestes, protocoles et organisations de soin, seul ou en equipe.",
    minimum: 2,
    invitation:
      "Quelle evaluation de vos pratiques aimeriez-vous rattacher a cet axe ?",
    cadre:
      "Cet axe couvre l'evaluation et l'amelioration continue de vos gestes, protocoles et organisations de travail — individuellement ou en equipe.",
    actionsDeclarees: [
      {
        libelle: 'Revue de morbi-mortalite "Erreurs de prescription"',
        date: "28 octobre 2026",
        origine: "Manuel",
        source: "Declaration libre",
      },
    ],
    catalogue: [
      {
        nature: "Evaluation de pratique",
        libelle: "Audit clinique cible sur une pratique",
        format: "En equipe",
        duree: "Variable",
      },
      {
        nature: "Evaluation de pratique",
        libelle: "Revue de morbi-mortalite (RMM)",
        format: "En equipe",
        duree: "Variable",
      },
      {
        nature: "Evaluation de pratique",
        libelle: "Participation a un registre professionnel",
        format: "Continu",
        duree: "Variable",
      },
      {
        nature: "Amelioration continue",
        libelle: "Revue bibliographique ciblee",
        format: "Individuel",
        duree: "Variable",
      },
      {
        nature: "Amelioration continue",
        libelle: "Elaboration ou revision d'un protocole de soins",
        format: "Individuel ou en equipe",
        duree: "Variable",
      },
      {
        nature: "Formation appliquee",
        libelle: "Simulation en sante",
        format: "Presentiel",
        duree: "Variable",
      },
      {
        nature: "Echange entre pairs",
        libelle: "Participation a un staff pluridisciplinaire",
        format: "En equipe",
        duree: "Continu",
      },
    ],
  },
  {
    numero: 3,
    intitule: "Ameliorer la relation avec les patients",
    sens: "L'information, l'ecoute, l'annonce, l'accompagnement — le coeur de la rencontre avec vos patients.",
    minimum: 2,
    invitation:
      "Quelle situation recente d'information ou d'accompagnement aimeriez-vous rattacher a cet axe ?",
    cadre:
      "Cet axe couvre l'information du patient, le recueil de son consentement, l'annonce diagnostique, l'accompagnement et la prise en compte de son experience.",
    actionsDeclarees: [],
    catalogue: [
      {
        nature: "Formation ciblee",
        libelle: "Formation a l'annonce d'un diagnostic",
        format: "Presentiel",
        duree: "1 a 2 jours",
      },
      {
        nature: "Formation ciblee",
        libelle: "Formation a la communication avec le patient",
        format: "Presentiel ou distanciel",
        duree: "Variable",
      },
      {
        nature: "Accompagnement",
        libelle: "Participation a un groupe Balint",
        format: "Presentiel",
        duree: "Continu",
      },
      {
        nature: "Ecoute patient",
        libelle: "Recueil structure de l'experience patient",
        format: "Individuel ou en equipe",
        duree: "Variable",
      },
      {
        nature: "Ecoute patient",
        libelle: "Participation a une demarche patient partenaire",
        format: "En equipe",
        duree: "Continu",
      },
      {
        nature: "Qualite relationnelle",
        libelle: "Formation a l'education therapeutique du patient (ETP)",
        format: "Presentiel",
        duree: "40 heures",
      },
    ],
  },
  {
    numero: 4,
    intitule: "Mieux prendre en compte sa sante",
    sens: "Prendre soin de votre sante physique et psychique pour pouvoir prendre soin des autres.",
    minimum: 2,
    invitation:
      "Quelle action personnelle de suivi de votre sante aimeriez-vous rattacher a cet axe ?",
    cadre:
      "Cet axe couvre votre propre sante physique et psychique. Prendre soin de soi pour pouvoir prendre soin des autres est une dimension explicitement prevue par le dispositif.",
    actionsDeclarees: [],
    catalogue: [
      {
        nature: "Suivi medical",
        libelle: "Bilan de sante annuel",
        format: "Consultation",
        duree: "Variable",
      },
      {
        nature: "Suivi medical",
        libelle: "Consultation de medecine du travail ou dediee aux PS",
        format: "Consultation",
        duree: "Variable",
      },
      {
        nature: "Prevention",
        libelle: "Participation a une action de prevention des risques professionnels",
        format: "Presentiel ou distanciel",
        duree: "Variable",
      },
      {
        nature: "Prevention",
        libelle: "Atelier de gestion du stress ou prevention du burn-out",
        format: "Presentiel ou distanciel",
        duree: "Variable",
      },
      {
        nature: "Sante au travail",
        libelle: "Auto-evaluation de la charge de travail et des conditions d'exercice",
        format: "Individuel",
        duree: "Variable",
      },
      {
        nature: "Soutien entre pairs",
        libelle: "Participation a un groupe de parole professionnel",
        format: "Presentiel",
        duree: "Continu",
      },
    ],
  },
];

export function getAxe(numero: number): Axe | undefined {
  return axes.find((a) => a.numero === numero);
}

export function statutAxe(axe: Axe): AxeStatut {
  if (axe.actionsDeclarees.length === 0) return "non-commence";
  if (axe.actionsDeclarees.length >= axe.minimum) return "couvert";
  return "en-cours";
}

export function libelleStatut(statut: AxeStatut): string {
  switch (statut) {
    case "non-commence":
      return "Non commence";
    case "en-cours":
      return "En cours";
    case "couvert":
      return "Axe couvert";
  }
}
