/**
 * Données partagées entre les pages FAQ / Vos interlocuteurs.
 * Permet de tester 2 versions (fusionnée vs séparée).
 */

export type Interlocuteur = "CNP" | "Ordre" | "ANS" | "DPO";

export type FaqCategorie =
  | "Référentiel"
  | "Cycle"
  | "Mes données"
  | "Outil MCPS";

export type FaqItem = {
  q: string;
  a: string;
  interlocuteur: Interlocuteur;
  categorie: FaqCategorie;
};

export const FAQ_ITEMS: FaqItem[] = [
  // ─── Référentiel (CNP) ─────────────────────────────────
  {
    q: "Mon référentiel n'apparaît pas, n'est pas à jour, ou je ne le comprends pas",
    a: "Les référentiels sont rédigés par les Conseils Nationaux Professionnels. Si le vôtre n'est pas encore publié, vous serez notifié par e-mail dès sa parution. Pour toute question sur le contenu, contactez le CNP de votre profession.",
    interlocuteur: "CNP",
    categorie: "Référentiel",
  },
  {
    q: "Cette action devrait-elle être éligible à mon référentiel ?",
    a: "Le CNP de votre profession définit les actions éligibles et leurs critères. Pour vérifier ou contester l'éligibilité d'une action, contactez votre CNP.",
    interlocuteur: "CNP",
    categorie: "Référentiel",
  },
  {
    q: "La certification périodique remplace-t-elle le DPC ?",
    a: "Non, les deux dispositifs coexistent. Le DPC reste votre obligation annuelle de formation. La certification est à l'échelle du cycle (6 ou 9 ans). Les actions DPC peuvent compter dans votre certification selon les modalités définies par votre référentiel.",
    interlocuteur: "CNP",
    categorie: "Référentiel",
  },

  // ─── Cycle (Ordre) ─────────────────────────────────────
  {
    q: "Quelle est la durée de mon cycle de certification ?",
    a: "9 ans si vous étiez en exercice avant le 1er janvier 2023, 6 ans si vous vous êtes inscrit après cette date. Le cycle démarre à votre première inscription à l'Ordre.",
    interlocuteur: "Ordre",
    categorie: "Cycle",
  },
  {
    q: "Que se passe-t-il à l'échéance si je n'ai pas tout complété ?",
    a: "Votre Ordre est informé du niveau de complétion de votre obligation. Le dispositif de relance et les modalités d'accompagnement sont en cours de définition par les Ordres professionnels.",
    interlocuteur: "Ordre",
    categorie: "Cycle",
  },
  {
    q: "Je veux suspendre mon cycle (congé parental, arrêt longue durée…)",
    a: "Votre cycle peut être suspendu pendant la durée de votre arrêt et reprend à votre retour d'activité. Adressez-vous à votre Ordre professionnel pour les modalités précises.",
    interlocuteur: "Ordre",
    categorie: "Cycle",
  },
  {
    q: "Je change d'ordre ou de spécialité ordinale",
    a: "Votre cycle se poursuit avec le référentiel correspondant à votre nouvelle inscription. Les actions déjà déclarées dans le précédent référentiel restent acquises.",
    interlocuteur: "Ordre",
    categorie: "Cycle",
  },

  // ─── Mes données (Ordre + DPO) ─────────────────────────
  {
    q: "Une de mes informations affichées dans MCPS est incorrecte",
    a: "Les données affichées dans MCPS sont issues de votre inscription à l'Ordre (RPPS). Pour les corriger, contactez votre Ordre professionnel.",
    interlocuteur: "Ordre",
    categorie: "Mes données",
  },
  {
    q: "Mes données personnelles, RGPD, exercice de mes droits",
    a: "Vos données sont traitées conformément au RGPD sous la responsabilité de l'Agence du Numérique en Santé. Pour exercer vos droits, contactez le Délégué à la protection des données (DPO) de l'ANS.",
    interlocuteur: "DPO",
    categorie: "Mes données",
  },

  // ─── Outil MCPS (ANS — uniquement) ─────────────────────
  {
    q: "Quel est le coût pour le professionnel de santé ?",
    a: "L'utilisation de Ma Certif' Pro Santé est gratuite. Seules les actions de formation peuvent générer un coût, selon leur nature et votre statut (ANDPC, plan de formation employeur, fonds personnels).",
    interlocuteur: "ANS",
    categorie: "Outil MCPS",
  },
  {
    q: "Je n'arrive pas à me connecter avec Pro Santé Connect",
    a: "Vérifiez d'abord que votre carte CPS est en cours de validité, que votre RPPS est bien enregistré auprès de votre Ordre, et que vous utilisez bien l'application e-CPS si la carte n'est pas disponible. Si le problème persiste, contactez le support PSC de l'ANS.",
    interlocuteur: "ANS",
    categorie: "Outil MCPS",
  },
  {
    q: "L'outil MCPS a un bug ou ne fonctionne pas correctement",
    a: "Décrivez précisément le problème rencontré (page, action, message d'erreur) par e-mail à l'équipe MCPS. Toute description précise nous aide à corriger plus rapidement.",
    interlocuteur: "ANS",
    categorie: "Outil MCPS",
  },
];

export const INTERLOCUTEUR_LABELS: Record<Interlocuteur, string> = {
  CNP: "Votre CNP",
  Ordre: "Votre Ordre",
  ANS: "ANS",
  DPO: "DPO ANS",
};

export type CoordOrdre = {
  nom: string;
  site: string;
  siteLabel: string;
  trouver?: { label: string; url: string };
};

export type CoordCnp = {
  nom: string;
  site?: string;
  email?: string;
};

export type ProfessionContacts = {
  id: string;
  label: string;
  icon: string;
  ordre: CoordOrdre;
  cnp: CoordCnp;
  /** Si la profession a plusieurs CNP (spécialités) */
  specialites?: CoordCnp[];
};

// Coordonnées simplifiées pour la maquette. À enrichir en prod.
export const CONTACTS_BY_PROFESSION: ProfessionContacts[] = [
  {
    id: "medecins",
    label: "Médecins",
    icon: "fr-icon-stethoscope-line",
    ordre: {
      nom: "Conseil national de l'Ordre des médecins",
      site: "https://www.conseil-national.medecin.fr",
      siteLabel: "conseil-national.medecin.fr",
      trouver: {
        label: "Trouver mon conseil départemental",
        url: "https://www.conseil-national.medecin.fr/lordre-medecins/conseil-national-de-lordre",
      },
    },
    cnp: {
      nom: "Médecins Généralistes — CNGE",
      site: "https://www.cnge.fr",
    },
  },
  {
    id: "chirurgiens-dentistes",
    label: "Chirurgiens-dentistes",
    icon: "fr-icon-surgical-mask-line",
    ordre: {
      nom: "Ordre national des chirurgiens-dentistes",
      site: "https://www.ordre-chirurgiens-dentistes.fr",
      siteLabel: "ordre-chirurgiens-dentistes.fr",
    },
    cnp: {
      nom: "CNP Chirurgiens-dentistes",
    },
  },
  {
    id: "sages-femmes",
    label: "Sages-femmes",
    icon: "fr-icon-parent-line",
    ordre: {
      nom: "Ordre national des sages-femmes",
      site: "https://www.ordre-sages-femmes.fr",
      siteLabel: "ordre-sages-femmes.fr",
    },
    cnp: {
      nom: "CNP Sages-femmes",
    },
  },
  {
    id: "pharmaciens",
    label: "Pharmaciens",
    icon: "fr-icon-capsule-line",
    ordre: {
      nom: "Ordre national des pharmaciens",
      site: "https://www.ordre.pharmacien.fr",
      siteLabel: "ordre.pharmacien.fr",
    },
    cnp: {
      nom: "CNP Pharmaciens",
    },
  },
  {
    id: "infirmiers",
    label: "Infirmiers",
    icon: "fr-icon-syringe-line",
    ordre: {
      nom: "Ordre national des infirmiers",
      site: "https://www.ordre-infirmiers.fr",
      siteLabel: "ordre-infirmiers.fr",
      trouver: {
        label: "Trouver mon conseil départemental",
        url: "https://www.ordre-infirmiers.fr",
      },
    },
    cnp: {
      nom: "CNP Infirmier (CNPI)",
      site: "https://www.cnp-infirmier.fr",
    },
  },
  {
    id: "masseurs-kine",
    label: "Masseurs-kinés",
    icon: "fr-icon-heart-pulse-line",
    ordre: {
      nom: "Ordre des masseurs-kinésithérapeutes",
      site: "https://www.ordremk.fr",
      siteLabel: "ordremk.fr",
    },
    cnp: {
      nom: "CNP Masseurs-kinésithérapeutes",
    },
  },
  {
    id: "podologues",
    label: "Pédicure-podologue",
    icon: "fr-icon-first-aid-kit-line",
    ordre: {
      nom: "Ordre national des pédicures-podologues",
      site: "https://www.onpp.fr",
      siteLabel: "onpp.fr",
    },
    cnp: {
      nom: "CNP Pédicures-podologues",
    },
  },
];
