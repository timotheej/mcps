import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { ProSanteConnectButton } from "../../components/ProSanteConnectButton";
const casParticuliersModal = createModal({
  id: "modal-cas-particuliers",
  isOpenedByDefault: false,
});

const ORDRES: Array<{ nom: string; icon: string }> = [
  { nom: "Médecins", icon: "fr-icon-stethoscope-line" },
  { nom: "Chirurgiens-dentistes", icon: "fr-icon-surgical-mask-line" },
  { nom: "Sages-femmes", icon: "fr-icon-parent-line" },
  { nom: "Pharmaciens", icon: "fr-icon-capsule-line" },
  { nom: "Infirmiers", icon: "fr-icon-syringe-line" },
  { nom: "Masseurs-kinés", icon: "fr-icon-heart-pulse-line" },
  { nom: "Pédicure-podologue", icon: "fr-icon-first-aid-kit-line" },
];

type Step = {
  title: string;
  desc: string;
};

const STEPS: Step[] = [
  {
    title: "Connectez-vous avec Pro Santé Connect",
    desc: "Accédez à votre espace en toute sécurité avec votre carte CPS ou l'application e-CPS.",
  },
  {
    title: "Découvrez votre référentiel",
    desc: "Consultez les 4 axes de votre référentiel et les actions de certification à votre disposition.",
  },
  {
    title: "Déclarez vos actions",
    desc: "Au fil de votre cycle, déclarez les actions réalisées avec leurs justificatifs.",
  },
  {
    title: "Suivez votre progression",
    desc: "Visualisez votre avancement par axe et téléchargez votre synthèse de certification.",
  },
];

const CAS_PARTICULIERS = [
  {
    label: "Cycle de 6 ou 9 ans selon votre date d'inscription",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Votre cycle dure <strong>9&nbsp;ans</strong> si vous étiez en exercice
        avant le 1<sup>er</sup>&nbsp;janvier 2023, ou <strong>6&nbsp;ans</strong>{" "}
        si vous vous êtes inscrit à votre Ordre après cette date. Le cycle
        démarre à votre première inscription.
      </p>
    ),
  },
  {
    label: "Votre référentiel n'est pas encore disponible",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Les référentiels sont rédigés par les Conseils Nationaux Professionnels
        (CNP). Si le vôtre n'est pas encore publié, vous serez notifié par
        e-mail dès sa parution. Vous pouvez vous connecter dès maintenant pour
        consulter l'état d'avancement et préparer votre dossier.
      </p>
    ),
  },
  {
    label: "Vous changez d'ordre ou de spécialité ordinale",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Votre cycle se poursuit avec le référentiel correspondant à votre
        nouvelle inscription. Les actions déjà déclarées dans le précédent
        référentiel restent acquises.
      </p>
    ),
  },
  {
    label: "Arrêt longue durée, congé parental ou suspension d'activité",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Votre cycle peut être suspendu pendant la durée de votre arrêt et
        reprend à votre retour d'activité. Adressez-vous à votre Ordre
        professionnel pour les modalités précises.
      </p>
    ),
  },
  {
    label: "Vous exercez en libéral, en salariat ou en mixte",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        L'obligation s'applique de la même manière quel que soit votre mode
        d'exercice. La prise en charge financière des actions de formation peut
        différer selon votre statut (ANDPC, plan de formation employeur, fonds
        personnels).
      </p>
    ),
  },
];

export function Accueil() {
  const navigate = useNavigate();

  function handleConnect() {
    navigate("/auth/chargement");
  }

  return (
    <>
      {/* ═══ Zone 1 — Hero ═══════════════════════════════════ */}
      <section
        className="maq-home-section maq-home-section--default fr-py-10w fr-py-md-12w"
        aria-labelledby="hero-title"
      >
        <div className={fr.cx("fr-container")}>
          <div
            className={fr.cx(
              "fr-grid-row",
              "fr-grid-row--gutters",
              "fr-grid-row--middle"
            )}
          >
            <div className={fr.cx("fr-col-12", "fr-col-lg-6")}>
              <p
                className={`maq-home-section__eyebrow ${fr.cx("fr-mb-2w")}`}
              >
                Agence du numérique en santé
              </p>
              <h1
                id="hero-title"
                className={`${fr.cx("fr-mb-3w")} maq-home-hero__title`}
              >
                Suivez votre certification périodique
              </h1>
              <p
                className={fr.cx("fr-text--md", "fr-mb-4w")}
                style={{ color: "var(--text-mention-grey)" }}
              >
                Ma Certif' Pro Santé est l'espace officiel pour les
                professionnels de santé soumis à l'obligation de certification
                périodique instaurée par la{" "}
                <a
                  className={fr.cx(
                    "fr-link",
                    "fr-link--icon-right",
                    "fr-icon-external-link-line"
                  )}
                  href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043407427"
                  target="_blank"
                  rel="noreferrer"
                >
                  loi du 26 avril 2021
                </a>
                .
              </p>

              <div id="connexion" className="maq-home-hero__cta">
                <ProSanteConnectButton onClick={handleConnect} />
              </div>
            </div>

            <div
              className={`${fr.cx("fr-col-12", "fr-col-lg-6", "fr-hidden", "fr-unhidden-lg")} maq-home-hero__preview`}
            >
              <div className="maq-home-hero__preview-box" aria-hidden="true">
                <div className="maq-home-hero__preview-frame">
                  <div className="maq-home-hero__preview-bar">
                    <span className="maq-home-hero__preview-dot" />
                    <span className="maq-home-hero__preview-dot" />
                    <span className="maq-home-hero__preview-dot" />
                  </div>
                  <div className="maq-home-hero__preview-content">
                    <p className="maq-home-hero__preview-overline">
                      Infirmière en soins généraux
                    </p>
                    <p className="maq-home-hero__preview-title">
                      Bonjour, Marie
                    </p>
                    <p className="maq-home-hero__preview-meta">
                      Échéance de votre cycle : 5 ans et 7 mois
                    </p>
                    <div className="maq-home-hero__preview-rows">
                      <div className="maq-home-hero__preview-row">
                        <span className="maq-home-hero__preview-row-tag">
                          Axe 1
                        </span>
                        <span className="maq-home-hero__preview-row-label">
                          Actualiser mes connaissances
                        </span>
                        <span className="maq-home-hero__preview-row-status maq-home-hero__preview-row-status--done">
                          2 sur 2
                        </span>
                      </div>
                      <div className="maq-home-hero__preview-row">
                        <span className="maq-home-hero__preview-row-tag">
                          Axe 2
                        </span>
                        <span className="maq-home-hero__preview-row-label">
                          Renforcer la qualité de mes pratiques
                        </span>
                        <span className="maq-home-hero__preview-row-status maq-home-hero__preview-row-status--done">
                          2 sur 2
                        </span>
                      </div>
                      <div className="maq-home-hero__preview-row">
                        <span className="maq-home-hero__preview-row-tag">
                          Axe 3
                        </span>
                        <span className="maq-home-hero__preview-row-label">
                          Améliorer ma relation avec les patients
                        </span>
                        <span className="maq-home-hero__preview-row-status">
                          0 sur 2
                        </span>
                      </div>
                      <div className="maq-home-hero__preview-row">
                        <span className="maq-home-hero__preview-row-tag">
                          Axe 4
                        </span>
                        <span className="maq-home-hero__preview-row-label">
                          Mieux prendre en compte ma santé
                        </span>
                        <span className="maq-home-hero__preview-row-status maq-home-hero__preview-row-status--done">
                          3 actions
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Zone 2 — Êtes-vous concerné ? ═══════════════════ */}
      <section
        className="maq-home-section maq-home-section--alt fr-py-8w fr-py-md-10w"
        aria-labelledby="concerne-title"
      >
        <div className={fr.cx("fr-container")}>
          <div
            className={fr.cx(
              "fr-grid-row",
              "fr-grid-row--gutters",
              "fr-grid-row--middle"
            )}
          >
            {/* Colonne gauche : titre + lead + CTA cas particuliers */}
            <div className={fr.cx("fr-col-12", "fr-col-lg-4")}>
              <p
                className={`maq-home-section__eyebrow ${fr.cx("fr-mb-2w")}`}
              >
                Qui est concerné&nbsp;?
              </p>
              <h2 id="concerne-title" className={fr.cx("fr-h3", "fr-mb-2w")}>
                Êtes-vous concerné&nbsp;?
              </h2>
              <p
                className={fr.cx("fr-text--md", "fr-mb-3w")}
                style={{ color: "var(--text-mention-grey)" }}
              >
                Si vous êtes inscrit à l'un des 7 ordres professionnels de
                santé, oui.
              </p>
              <Button
                priority="secondary"
                nativeButtonProps={casParticuliersModal.buttonProps}
              >
                Vous êtes dans un cas particulier&nbsp;?
              </Button>
            </div>

            {/* Colonne droite : grille des 7 ordres */}
            <div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
              <ul className="maq-home-ordres">
                {ORDRES.map((o) => (
                  <li key={o.nom} className="maq-home-ordres__item">
                    <span
                      className={`${o.icon} maq-home-ordres__icon`}
                      aria-hidden="true"
                    />
                    <span className="maq-home-ordres__name">{o.nom}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Zone 3 — Comment ça marche ═══════════════════════ */}
      <section
        className="maq-home-section maq-home-section--brand fr-py-8w fr-py-md-10w"
        aria-labelledby="comment-title"
      >
        <div className={fr.cx("fr-container")}>
          <div className={fr.cx("fr-grid-row", "fr-mb-7w")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
              <h2 id="comment-title" className={fr.cx("fr-h3", "fr-mb-2w")}>
                Comment ça marche&nbsp;?
              </h2>
              <p className={fr.cx("fr-text--md", "fr-mb-0")}>
                Quatre étapes pour suivre votre certification périodique sur Ma
                Certif' Pro Santé.
              </p>
            </div>
          </div>

          <ol className="maq-home-timeline">
            {STEPS.map((step, i) => (
              <li key={step.title} className="maq-home-timeline__step">
                <div className="maq-home-timeline__marker">
                  <span
                    className="maq-home-timeline__circle"
                    aria-hidden="true"
                  >
                    {i + 1}
                  </span>
                  {i < STEPS.length - 1 && (
                    <span
                      className="maq-home-timeline__line"
                      aria-hidden="true"
                    />
                  )}
                </div>
                <div className="maq-home-timeline__content">
                  <p className="maq-home-timeline__num">Étape {i + 1}</p>
                  <h3 className={fr.cx("fr-h5", "fr-mb-1w")}>{step.title}</h3>
                  <p className={fr.cx("fr-text--md", "fr-mb-0")}>{step.desc}</p>
                </div>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* ═══ Zone 4 — Pour aller plus loin ══════════════════ */}
      <section
        className="maq-home-section maq-home-section--default fr-py-8w fr-py-md-10w"
        aria-labelledby="explorer-title"
      >
        <div className={fr.cx("fr-container")}>
          <div className={fr.cx("fr-grid-row", "fr-mb-5w")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
              <h2 id="explorer-title" className={fr.cx("fr-h3", "fr-mb-0")}>
                Pour aller plus loin
              </h2>
            </div>
          </div>

          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
              <Card
                border
                enlargeLink
                title="En savoir plus"
                titleAs="h3"
                desc="Cadre légal, calendrier de déploiement et modalités sur le site officiel de l'Agence du Numérique en Santé."
                linkProps={{
                  href: "https://esante.gouv.fr",
                  target: "_blank",
                  rel: "noreferrer",
                }}
              />
            </div>
            <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
              <Card
                border
                enlargeLink
                title="Tous les référentiels"
                titleAs="h3"
                desc="Découvrez les actions de certification par profession, regroupées par axe, sans avoir à vous connecter."
                linkProps={{ to: "/referentiel" }}
              />
            </div>
            <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
              <Card
                border
                enlargeLink
                title="Besoin d'aide ?"
                titleAs="h3"
                desc="Réponses aux questions fréquentes, coordonnées de votre Ordre et de votre CNP, et support technique."
                linkProps={{ to: "/aide" }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* Modale "Cas particuliers" — ouverte depuis le bouton zone 2 */}
      <casParticuliersModal.Component
        title="Vous êtes dans un cas particulier ?"
        size="large"
      >
        <p className={fr.cx("fr-text--md", "fr-mb-3w")}>
          Cycle de 6 ou 9 ans, changement d'ordre, suspension d'activité…
          On répond aux 5 cas les plus fréquents.
        </p>
        <div className={fr.cx("fr-accordions-group")}>
          {CAS_PARTICULIERS.map((item) => (
            <Accordion key={item.label} label={item.label}>
              {item.body}
            </Accordion>
          ))}
        </div>
      </casParticuliersModal.Component>

    </>
  );
}
