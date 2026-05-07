import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Card } from "@codegouvfr/react-dsfr/Card";
import Avatar from "@codegouvfr/react-dsfr/picto/Avatar";
import DocumentSearch from "@codegouvfr/react-dsfr/picto/DocumentSearch";
import Internet from "@codegouvfr/react-dsfr/picto/Internet";
import Book from "@codegouvfr/react-dsfr/picto/Book";
import Search from "@codegouvfr/react-dsfr/picto/Search";
import HumanCooperation from "@codegouvfr/react-dsfr/picto/HumanCooperation";
import Doctor from "@codegouvfr/react-dsfr/picto/Doctor";
import { ProSanteConnectButton } from "../../components/ProSanteConnectButton";

const ORDRES = [
  { name: "Médecins", count: "237 200" },
  { name: "Chirurgiens-dentistes", count: "47 600" },
  { name: "Sages-femmes", count: "25 800" },
  { name: "Pharmaciens", count: "74 600" },
  { name: "Infirmiers", count: "565 553" },
  { name: "Masseurs-kinésithérapeutes", count: "110 000" },
  { name: "Pédicures-podologues", count: "14 400" },
];

const AXES = [
  {
    title: "Actualiser mes connaissances",
    desc: "Formations, DPC, congrès, enseignement",
  },
  {
    title: "Améliorer mes pratiques",
    desc: "Audits, RMM, analyse de pratiques, simulation",
  },
  {
    title: "Renforcer la relation patient",
    desc: "Communication, éthique, droits des usagers",
  },
  {
    title: "Préserver ma santé",
    desc: "Risques psychosociaux, prévention, santé au travail",
  },
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

const FAQ_ITEMS = [
  {
    label: "Mon référentiel n'est pas encore disponible, que faire ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Les référentiels sont rédigés par les Conseils Nationaux Professionnels
        (CNP). Si le vôtre n'est pas encore publié, vous serez informé par
        e-mail dès qu'il sera disponible. Vous pouvez vous connecter dès
        maintenant pour suivre l'état d'avancement.
      </p>
    ),
  },
  {
    label: "Que se passe-t-il si je ne complète pas dans les délais ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        À l'échéance de votre cycle, votre Ordre est informé du niveau de
        complétion de votre obligation. Le dispositif de relance et les
        modalités d'accompagnement sont en cours de définition par les ordres
        professionnels.
      </p>
    ),
  },
  {
    label: "Mes données sont-elles confidentielles ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Vos données sont traitées conformément au RGPD. Seuls vous-même et
        votre Ordre professionnel ont accès à vos données individuelles. L'ANS
        et les CNP n'accèdent qu'à des données agrégées anonymes.
      </p>
    ),
  },
  {
    label: "La certification périodique remplace-t-elle le DPC ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Non. La certification périodique et le DPC (développement professionnel
        continu) sont deux dispositifs distincts mais complémentaires&nbsp;: les
        actions DPC peuvent compter dans votre certification périodique selon
        les modalités définies par votre référentiel.
      </p>
    ),
  },
  {
    label: "Qui contacter pour des questions sur mon référentiel ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Pour toute question sur le contenu de votre référentiel, contactez le
        CNP de votre profession. Pour des questions sur la plateforme,
        écrivez-nous à l'adresse en bas de page.
      </p>
    ),
  },
  {
    label: "Comment se passe la certification en cas de changement d'ordre ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        En cas de changement d'ordre ou de spécialité ordinale, votre cycle se
        poursuit avec le référentiel correspondant à votre nouvelle inscription.
        Les actions déjà déclarées dans le précédent référentiel restent
        acquises.
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
            <div className={fr.cx("fr-col-12", "fr-col-lg-7")}>
              <p className={`maq-home-hero__eyebrow ${fr.cx("fr-mb-2w")}`}>
                Service public · Agence du Numérique en Santé
              </p>
              <h1 id="hero-title" className={`${fr.cx("fr-mb-3w")} maq-home-hero__title`}>
                Suivez votre certification périodique
              </h1>
              <p className={fr.cx("fr-text--lead", "fr-mb-5w")}>
                Ma Certif' Pro Santé est l'espace officiel pour les professionnels
                de santé soumis à l'obligation de certification périodique
                instaurée par la{" "}
                <a
                  className={fr.cx("fr-link")}
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
                <Accordion label="Qu'est-ce que Pro Santé Connect ?">
                  <p className={fr.cx("fr-mb-1w")}>
                    Pro Santé Connect est le service d'authentification
                    officiel des professionnels de santé, géré par l'Agence du
                    Numérique en Santé. Il utilise votre carte CPS ou
                    l'application e-CPS sur smartphone.
                  </p>
                  <p className={fr.cx("fr-mb-0")}>
                    <a
                      className={fr.cx(
                        "fr-link",
                        "fr-link--icon-right",
                        "fr-icon-external-link-line"
                      )}
                      href="https://esante.gouv.fr/produits-services/pro-sante-connect"
                      target="_blank"
                      rel="noreferrer"
                    >
                      En savoir plus sur esante.gouv.fr
                    </a>
                  </p>
                </Accordion>
              </div>
            </div>

            <div
              className={`${fr.cx("fr-col-12", "fr-col-lg-5", "fr-hidden", "fr-unhidden-lg")} maq-home-hero__illustration`}
            >
              <Avatar style={{ width: "100%", maxWidth: 460, height: "auto" }} />
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
            <div
              className={`${fr.cx("fr-col-12", "fr-col-lg-5", "fr-hidden", "fr-unhidden-lg")} maq-home-concerne__illustration`}
            >
              <Doctor style={{ width: "100%", maxWidth: 380, height: "auto" }} />
            </div>

            <div className={fr.cx("fr-col-12", "fr-col-lg-7")}>
              <h2 id="concerne-title" className={fr.cx("fr-h3", "fr-mb-2w")}>
                Êtes-vous concerné&nbsp;?
              </h2>
              <p className={fr.cx("fr-text--lead", "fr-mb-3w")}>
                L'obligation s'applique aux professionnels de santé inscrits à
                l'un des sept ordres.
              </p>

              <p className="maq-home-concerne__total">
                <strong>1&nbsp;075&nbsp;000</strong> professionnels concernés
                en France
              </p>

              <ul className="maq-home-concerne__list">
                {ORDRES.map((o) => (
                  <li key={o.name} className="maq-home-concerne__item">
                    <span
                      className="fr-icon-check-line maq-home-concerne__check"
                      aria-hidden="true"
                    />
                    <span className="maq-home-concerne__name">{o.name}</span>
                    <span className="maq-home-concerne__count">{o.count}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          <div
            className={fr.cx("fr-callout", "fr-icon-time-line", "fr-mt-7w")}
          >
            <h3 className={fr.cx("fr-callout__title", "fr-h6")}>
              Combien de temps pour vous certifier&nbsp;?
            </h3>
            <p className={fr.cx("fr-callout__text")}>
              Votre cycle de certification dure <strong>9&nbsp;ans</strong> si
              vous étiez en exercice avant le 1<sup>er</sup>&nbsp;janvier 2023,
              ou <strong>6&nbsp;ans</strong> pour les nouveaux inscrits.
            </p>
          </div>
        </div>
      </section>

      {/* ═══ Zone 3 — Pourquoi vous certifier ════════════════ */}
      <section
        className="maq-home-section maq-home-section--default fr-py-8w fr-py-md-10w"
        aria-labelledby="pourquoi-title"
      >
        <div className={fr.cx("fr-container")}>
          <div className={fr.cx("fr-grid-row", "fr-mb-5w")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
              <h2 id="pourquoi-title" className={fr.cx("fr-h3", "fr-mb-2w")}>
                Pourquoi vous certifier&nbsp;?
              </h2>
              <p className={fr.cx("fr-text--lead", "fr-mb-0")}>
                Quatre axes pour entretenir et faire évoluer votre exercice tout
                au long de votre carrière.
              </p>
            </div>
          </div>

          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            {AXES.map((axe, i) => {
              const pictos = [Book, Search, HumanCooperation, Internet];
              const Picto = pictos[i];
              return (
                <div
                  key={axe.title}
                  className={fr.cx("fr-col-12", "fr-col-md-6", "fr-col-lg-3")}
                >
                  <div className="maq-home-axis">
                    <Picto className="maq-home-axis__pictogram" />
                    <p className="maq-home-axis__num">Axe {i + 1}</p>
                    <h3 className={fr.cx("fr-h6", "fr-mb-1w")}>{axe.title}</h3>
                    <p className={fr.cx("fr-text--sm", "fr-mb-0")}>
                      {axe.desc}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ═══ Zone 4 — Comment ça marche ═══════════════════════ */}
      <section
        className="maq-home-section maq-home-section--alt fr-py-8w fr-py-md-10w"
        aria-labelledby="comment-title"
      >
        <div className={fr.cx("fr-container")}>
          <div className={fr.cx("fr-grid-row", "fr-mb-5w")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
              <h2 id="comment-title" className={fr.cx("fr-h3", "fr-mb-2w")}>
                Comment ça marche
              </h2>
              <p className={fr.cx("fr-text--lead", "fr-mb-0")}>
                Quatre étapes pour suivre votre certification périodique sur Ma
                Certif' Pro Santé.
              </p>
            </div>
          </div>

          <div className="maq-home-timeline">
            {STEPS.map((step, i) => (
              <div key={step.title} className="maq-home-timeline__step">
                <div className="maq-home-timeline__marker">
                  <span className="maq-home-timeline__circle" aria-hidden="true">
                    {i + 1}
                  </span>
                </div>
                <div className="maq-home-timeline__content">
                  <p className="maq-home-timeline__num">Étape {i + 1}</p>
                  <h3 className={fr.cx("fr-h6", "fr-mb-1w")}>{step.title}</h3>
                  <p className={fr.cx("fr-text--sm", "fr-mb-0")}>
                    {step.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══ Zone 5 — Explorer sans se connecter ════════════ */}
      <section
        className="maq-home-section maq-home-section--default fr-py-8w fr-py-md-10w"
        aria-labelledby="explorer-title"
      >
        <div className={fr.cx("fr-container")}>
          <div className={fr.cx("fr-grid-row", "fr-mb-5w")}>
            <div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
              <h2 id="explorer-title" className={fr.cx("fr-h3", "fr-mb-2w")}>
                Explorer sans vous connecter
              </h2>
              <p className={fr.cx("fr-text--lead", "fr-mb-0")}>
                Vous pouvez vous renseigner sur le dispositif avant de vous
                connecter.
              </p>
            </div>
          </div>

          <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
            <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
              <Card
                border
                enlargeLink
                imageComponent={<DocumentSearch />}
                title="Consulter les référentiels"
                titleAs="h3"
                desc="Avant de vous connecter, consultez les actions de certification par profession, regroupées par axe."
                linkProps={{ to: "/referentiel" }}
              />
            </div>
            <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
              <Card
                border
                enlargeLink
                imageComponent={<Internet />}
                title="En savoir plus sur le dispositif"
                titleAs="h3"
                desc="Cadre, calendrier de déploiement et modalités sur le site officiel de l'Agence du Numérique en Santé."
                linkProps={{
                  href: "https://esante.gouv.fr",
                  target: "_blank",
                  rel: "noreferrer",
                }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Zone 6 — Questions fréquentes ═══════════════════ */}
      <section
        className="maq-home-section maq-home-section--alt fr-py-8w fr-py-md-10w"
        aria-labelledby="faq-title"
      >
        <div className={fr.cx("fr-container")}>
          <div className={fr.cx("fr-grid-row", "fr-grid-row--center")}>
            <div
              className={fr.cx("fr-col-12", "fr-col-md-10", "fr-col-lg-8")}
            >
              <h2 id="faq-title" className={fr.cx("fr-h3", "fr-mb-2w")}>
                Questions fréquentes
              </h2>
              <p className={fr.cx("fr-text--lead", "fr-mb-5w")}>
                Les réponses aux questions les plus posées sur la certification
                périodique.
              </p>

              <div className={fr.cx("fr-accordions-group")}>
                {FAQ_ITEMS.map((item) => (
                  <Accordion key={item.label} label={item.label}>
                    {item.body}
                  </Accordion>
                ))}
              </div>

              <p className={fr.cx("fr-mt-5w", "fr-mb-0")}>
                <a
                  className={fr.cx(
                    "fr-link",
                    "fr-link--icon-left",
                    "fr-icon-mail-line"
                  )}
                  href="mailto:contact-mcps@esante.gouv.fr"
                >
                  Une autre question&nbsp;? Contactez-nous
                </a>
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
