export type Suggestion = {
  theme: string;
  axeNumero: 1 | 2 | 3 | 4;
  axeIntitule: string;
  libelle: string;
  format: string;
  duree: string;
  organisme: string;
};

export const profile = {
  civilite: "Dr",
  nom: "Martin",
  specialite: "Chirurgien-dentiste",
  cycle: {
    debut: "14 janvier 2023",
    fin: "14 janvier 2032",
    resteAnnees: 5,
    resteMois: 8,
    dureeAnnees: 9,
  },
  /**
   * Themes selectionnes par le PS lors de l'onboarding.
   * C'est l'expression de son autonomie : il choisit ce qui
   * l'interesse dans son metier, et le tableau de bord lui
   * propose des actions coherentes avec ces themes.
   */
  themes: [
    "Prise en charge de la douleur",
    "Relation patient en situation anxieuse",
    "Sante au travail du praticien",
  ],
};

export const suggestions: Suggestion[] = [
  {
    theme: "Prise en charge de la douleur",
    axeNumero: 1,
    axeIntitule: "Ameliorer les connaissances et les competences",
    libelle: "Actualisation : prise en charge de la douleur post-operatoire",
    format: "E-learning certifiant",
    duree: "6 heures",
    organisme: "College national des chirurgiens-dentistes",
  },
  {
    theme: "Relation patient en situation anxieuse",
    axeNumero: 3,
    axeIntitule: "Ameliorer la relation avec les patients",
    libelle: "Communication et accompagnement du patient anxieux",
    format: "Presentiel",
    duree: "1 jour",
    organisme: "Societe francaise de dentisterie",
  },
  {
    theme: "Relation patient en situation anxieuse",
    axeNumero: 3,
    axeIntitule: "Ameliorer la relation avec les patients",
    libelle: "Hypnose medicale appliquee a la pratique dentaire",
    format: "Presentiel",
    duree: "3 jours",
    organisme: "Institut francais d'hypnose",
  },
  {
    theme: "Sante au travail du praticien",
    axeNumero: 4,
    axeIntitule: "Mieux prendre en compte sa sante",
    libelle: "Ergonomie du poste et prevention des TMS",
    format: "Presentiel",
    duree: "2 jours",
    organisme: "Institut national de recherche et de securite (INRS)",
  },
];
