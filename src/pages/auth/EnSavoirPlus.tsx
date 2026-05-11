import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Highlight } from "@codegouvfr/react-dsfr/Highlight";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { ProSanteConnectButton } from "../../components/ProSanteConnectButton";

const ORDRES: Array<{ nom: string; icon: string; effectif: string }> = [
  { nom: "Médecins", icon: "fr-icon-stethoscope-line", effectif: "237 200" },
  { nom: "Chirurgiens-dentistes", icon: "fr-icon-surgical-mask-line", effectif: "47 600" },
  { nom: "Sages-femmes", icon: "fr-icon-parent-line", effectif: "25 800" },
  { nom: "Pharmaciens", icon: "fr-icon-capsule-line", effectif: "74 600" },
  { nom: "Infirmiers", icon: "fr-icon-syringe-line", effectif: "565 553" },
  { nom: "Masseurs-kinés", icon: "fr-icon-heart-pulse-line", effectif: "110 000" },
  { nom: "Pédicure-podologue", icon: "fr-icon-first-aid-kit-line", effectif: "14 400" },
];

const AXES: Array<{ num: number; titre: string; exemples: string }> = [
  {
    num: 1,
    titre: "Améliorer ses connaissances et ses compétences",
    exemples:
      "DPC, formation continue, DU/DIU, congrès, enseignement, simulation, analyse réflexive.",
  },
  {
    num: 2,
    titre: "Renforcer la qualité de ses pratiques et des soins",
    exemples:
      "Audit clinique, RMM, CREX, analyse des pratiques en groupe, protocoles, programmes intégrés.",
  },
  {
    num: 3,
    titre: "Améliorer la relation avec les patients",
    exemples:
      "Relation d'aide, éthique, communication, dispositifs d'annonce, médiation, violences intrafamiliales.",
  },
  {
    num: 4,
    titre: "Mieux prendre en compte sa santé",
    exemples:
      "Prévention des risques psychosociaux, vaccinations, santé au travail, auto-évaluation, santé communautaire.",
  },
];

const FAQ_ITEMS: Array<{ label: string; body: NonNullable<React.ReactNode> }> = [
  {
    label: "Quel est le coût pour le professionnel de santé ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        L'utilisation de Ma Certif' Pro Santé est gratuite. Seules les actions
        de formation que vous choisissez de réaliser peuvent générer un coût,
        selon leur nature et votre statut (prise en charge ANDPC, plan de
        formation employeur, fonds personnels…).
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
    label: "Le référentiel peut-il évoluer entre deux cycles ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Oui. Chaque CNP peut faire évoluer son référentiel pour tenir compte
        des évolutions de la profession et des recommandations de bonnes
        pratiques. Les évolutions s'appliquent aux nouveaux cycles ; vos
        actions déjà déclarées restent acquises.
      </p>
    ),
  },
  {
    label: "Les actions DPC déjà réalisées comptent-elles rétroactivement ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Les actions DPC enregistrées auprès de l'ANDPC depuis le début de
        votre cycle peuvent être prises en compte au titre de votre
        certification, dans les conditions définies par votre référentiel.
        Connectez-vous pour vérifier celles qui sont déjà remontées dans
        votre espace.
      </p>
    ),
  },
  {
    label: "Puis-je déclarer une action hors catalogue (action libre) ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Le MVP actuel n'autorise que les actions issues du référentiel.
        L'action libre, soumise à validation par votre CNP, sera ouverte dans
        une version ultérieure du service.
      </p>
    ),
  },
  {
    label: "Qui contacter pour une question sur mon référentiel ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Pour toute question sur le contenu de votre référentiel, contactez le
        Conseil National Professionnel de votre profession. Pour des
        questions sur la plateforme, écrivez-nous à l'adresse en bas de page.
      </p>
    ),
  },
  {
    label: "Que se passe-t-il en cas de changement d'Ordre ou de spécialité ?",
    body: (
      <p className={fr.cx("fr-mb-0")}>
        Votre cycle se poursuit avec le référentiel correspondant à votre
        nouvelle inscription. Les actions déjà déclarées dans le précédent
        référentiel restent acquises.
      </p>
    ),
  },
];

const CYCLE_ROWS = [
  [
    "Vous étiez en exercice avant le 1er janvier 2023",
    <strong key="9">9 ans</strong>,
  ],
  [
    "Vous vous êtes inscrit à votre Ordre après le 1er janvier 2023",
    <strong key="6">6 ans</strong>,
  ],
];

const ACTEURS_ROWS = [
  [
    "ANS",
    <ul key="ans" className="maq-info-list">
      <li>
        <strong>Agence du Numérique en Santé.</strong>
      </li>
      <li>Édite et exploite l'outil Ma Certif' Pro Santé.</li>
      <li>Garantit la sécurité et la conformité du service.</li>
      <li>N'accède qu'à des données agrégées anonymes.</li>
    </ul>,
  ],
  [
    "CNP",
    <ul key="cnp" className="maq-info-list">
      <li>
        <strong>Conseils Nationaux Professionnels.</strong>
      </li>
      <li>Rédigent les référentiels par profession (52 référentiels au total).</li>
      <li>Définissent les actions éligibles, les axes et les modalités de preuve.</li>
      <li>Valident les déclarations soumises par les PS.</li>
    </ul>,
  ],
  [
    "Ordres",
    <ul key="ord" className="maq-info-list">
      <li>
        <strong>Conseils des 7 ordres professionnels.</strong>
      </li>
      <li>Constatent la complétion à l'échéance du cycle.</li>
      <li>
        Seuls habilités à accéder à vos données individuelles de certification.
      </li>
      <li>
        Accompagnent les cas particuliers (suspension, changement d'ordre…).
      </li>
    </ul>,
  ],
];

export function EnSavoirPlus() {
  const navigate = useNavigate();

  function handleConnect() {
    navigate("/auth/chargement");
  }

  return (
    <div className={`${fr.cx("fr-container", "fr-mt-4w", "fr-mb-8w")}`}>
      <Breadcrumb
        currentPageLabel="En savoir plus"
        segments={[{ label: "Accueil", linkProps: { to: "/" } }]}
      />

      {/* ═══ En-tête ════════════════════════════════════════ */}
      <div className={fr.cx("fr-grid-row", "fr-mb-6w")}>
        <div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
          <h1 className={fr.cx("fr-mb-2w")}>
            Comprendre la certification périodique
          </h1>
          <p className={`${fr.cx("fr-text--lead", "fr-mb-2w")}`}>
            Cadre légal, cycle, axes, acteurs&nbsp;: tout ce qu'il faut savoir
            avant de vous connecter à Ma Certif' Pro Santé.
          </p>
          <p
            className={fr.cx("fr-text--xs", "fr-mb-0")}
            style={{ color: "var(--text-mention-grey)" }}
          >
            Dernière mise à jour&nbsp;: 11 mai 2026
          </p>
        </div>
      </div>

      {/* ═══ Sommaire + Contenu ═════════════════════════════ */}
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        {/* Sommaire latéral */}
        <aside
          className={fr.cx("fr-col-12", "fr-col-md-3")}
          aria-label="Sur cette page"
        >
          <nav className="maq-toc" aria-label="Sommaire">
            <p className="maq-toc__title">Sur cette page</p>
            <ul className="maq-toc__list">
              <li>
                <a className="maq-toc__link" href="#cadre-legal">
                  Le cadre légal
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#concerne">
                  Êtes-vous concerné&nbsp;?
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#cycle">
                  Le cycle de certification
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#axes">
                  Les 4 axes du référentiel
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#dpc">
                  Articulation avec le DPC
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#acteurs">
                  Qui fait quoi
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#calendrier">
                  Calendrier de déploiement
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#mcps">
                  Ce que MCPS apporte
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#donnees">
                  Vos données
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#faq">
                  Questions fréquentes
                </a>
              </li>
              <li>
                <a className="maq-toc__link" href="#ressources">
                  Pour aller plus loin
                </a>
              </li>
            </ul>
          </nav>
        </aside>

        {/* Contenu principal */}
        <div className={fr.cx("fr-col-12", "fr-col-md-9")}>
          {/* §1 — Cadre légal */}
          <section className="maq-info-section" aria-labelledby="cadre-legal">
            <h2 id="cadre-legal" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Le cadre légal
            </h2>
            <p>
              La certification périodique est une obligation introduite par la
              loi du 26 avril 2021 relative à l'amélioration du système de
              santé. Elle s'applique depuis le <strong>1<sup>er</sup>&nbsp;janvier 2023</strong>
              {" "}aux professionnels de santé inscrits à un Ordre.
            </p>
            <p className={fr.cx("fr-mb-3w")}>
              Elle vise à garantir, tout au long de la carrière, le maintien
              des compétences, la qualité des pratiques et la mise à jour des
              connaissances de chaque professionnel de santé.
            </p>

            <Highlight>
              «&nbsp;La certification périodique vise à garantir le maintien
              des compétences, la qualité des pratiques professionnelles et
              l'actualisation des connaissances.&nbsp;»
              <br />
              <em>— Article L4022-1 du Code de la santé publique</em>
            </Highlight>

            <p className={fr.cx("fr-mb-1w", "fr-mt-3w", "fr-text--md")}>
              <strong>Sources officielles</strong>
            </p>
            <ul className="maq-info-list">
              <li>
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
                  Loi n° 2021-502 du 26 avril 2021
                </a>
              </li>
              <li>
                <a
                  className={fr.cx(
                    "fr-link",
                    "fr-link--icon-right",
                    "fr-icon-external-link-line"
                  )}
                  href="https://www.legifrance.gouv.fr/jorf/id/JORFTEXT000043816770"
                  target="_blank"
                  rel="noreferrer"
                >
                  Ordonnance n° 2021-961 du 19 juillet 2021
                </a>
              </li>
              <li>
                <a
                  className={fr.cx(
                    "fr-link",
                    "fr-link--icon-right",
                    "fr-icon-external-link-line"
                  )}
                  href="https://www.legifrance.gouv.fr/codes/article_lc/LEGIARTI000043422879"
                  target="_blank"
                  rel="noreferrer"
                >
                  Article L4022-1 du Code de la santé publique
                </a>
              </li>
            </ul>
          </section>

          {/* §2 — Êtes-vous concerné */}
          <section className="maq-info-section" aria-labelledby="concerne">
            <h2 id="concerne" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Êtes-vous concerné&nbsp;?
            </h2>
            <p className={fr.cx("fr-mb-3w")}>
              L'obligation s'applique aux professionnels de santé inscrits à
              l'un des 7 ordres suivants&nbsp;:
            </p>

            <ul className="maq-home-ordres maq-home-ordres--with-meta">
              {ORDRES.map((o) => (
                <li key={o.nom} className="maq-home-ordres__item">
                  <span
                    className={`${o.icon} maq-home-ordres__icon`}
                    aria-hidden="true"
                  />
                  <span className="maq-home-ordres__body">
                    <span className="maq-home-ordres__name">{o.nom}</span>
                    <span className="maq-home-ordres__meta">
                      {o.effectif} professionnels
                    </span>
                  </span>
                </li>
              ))}
            </ul>
          </section>

          {/* §3 — Cycle */}
          <section className="maq-info-section" aria-labelledby="cycle">
            <h2 id="cycle" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Le cycle de certification
            </h2>
            <p className={fr.cx("fr-mb-3w")}>
              Vous devez réaliser et déclarer un ensemble d'actions sur la
              durée d'un cycle. Sa durée dépend de votre date d'inscription à
              l'Ordre.
            </p>

            <Table
              fixed
              headers={["Votre situation", "Durée du cycle"]}
              data={CYCLE_ROWS}
            />

            <p className={fr.cx("fr-mt-3w")}>
              Pendant ce cycle, vous devez réaliser au minimum{" "}
              <strong>8 actions</strong>, réparties sur les{" "}
              <strong>4 axes</strong> du référentiel (au moins{" "}
              <strong>2 actions par axe</strong>).
            </p>

            <CallOut
              iconId="fr-icon-information-line"
              title="Cas particuliers"
              buttonProps={{
                priority: "secondary",
                linkProps: { to: "/" },
                children: "Consulter les cas particuliers",
              }}
            >
              Changement d'ordre, suspension d'activité, congé parental&nbsp;:
              les règles spécifiques sont détaillées dans la rubrique «&nbsp;Cas
              particuliers&nbsp;» accessible depuis la page d'accueil.
            </CallOut>
          </section>

          {/* §4 — 4 axes */}
          <section className="maq-info-section" aria-labelledby="axes">
            <h2 id="axes" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Les 4 axes du référentiel
            </h2>
            <p className={fr.cx("fr-mb-3w")}>
              Chaque référentiel professionnel est organisé en 4 axes. Vos
              actions de certification doivent couvrir les 4 axes — au moins
              2 actions par axe, soit 8 actions minimum sur la durée du cycle.
            </p>

            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              {AXES.map((axe) => (
                <div
                  key={axe.num}
                  className={fr.cx("fr-col-12", "fr-col-md-6")}
                >
                  <div className="maq-info-axis">
                    <p className="maq-info-axis__overline">Axe {axe.num}</p>
                    <h3 className={fr.cx("fr-h5", "fr-mb-2w")}>{axe.titre}</h3>
                    <p
                      className={fr.cx("fr-text--sm", "fr-mb-0")}
                      style={{ color: "var(--text-mention-grey)" }}
                    >
                      {axe.exemples}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            <p className={fr.cx("fr-mt-3w", "fr-mb-0")}>
              Le contenu précis des actions par axe varie selon votre
              référentiel professionnel.{" "}
              <a className={fr.cx("fr-link")} href="/referentiel">
                Consulter tous les référentiels
              </a>
              .
            </p>
          </section>

          {/* §5 — Articulation DPC */}
          <section className="maq-info-section" aria-labelledby="dpc">
            <h2 id="dpc" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Articulation avec le DPC
            </h2>
            <p>
              La certification périodique <strong>ne remplace pas</strong> le
              Développement Professionnel Continu (DPC). Les deux dispositifs
              coexistent&nbsp;:
            </p>
            <ul className="maq-info-list">
              <li>
                Le <strong>DPC</strong> reste votre obligation annuelle de
                formation, pilotée par l'Agence nationale du DPC (ANDPC).
              </li>
              <li>
                La <strong>certification périodique</strong> est une obligation
                à l'échelle du cycle (6 ou 9 ans), pilotée par votre Ordre.
              </li>
            </ul>
            <p className={fr.cx("fr-mb-3w")}>
              La plupart des actions DPC peuvent être comptabilisées au titre
              de votre certification, selon les modalités définies par votre
              référentiel professionnel.
            </p>

            <Notice
              title="Les actions DPC enregistrées auprès de l'ANDPC sont automatiquement reconnues par Ma Certif' Pro Santé lors de la déclaration de votre action."
              isClosable={false}
            />
          </section>

          {/* §6 — Qui fait quoi */}
          <section className="maq-info-section" aria-labelledby="acteurs">
            <h2 id="acteurs" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Qui fait quoi
            </h2>
            <p className={fr.cx("fr-mb-3w")}>
              Trois acteurs interviennent dans votre certification périodique.
            </p>

            <Table
              fixed
              headers={["Acteur", "Rôle"]}
              data={ACTEURS_ROWS}
            />
          </section>

          {/* §7 — Calendrier */}
          <section className="maq-info-section" aria-labelledby="calendrier">
            <h2 id="calendrier" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Calendrier de déploiement
            </h2>
            <p className={fr.cx("fr-mb-3w")}>
              Le dispositif se déploie progressivement. Les 52 référentiels ne
              sont pas tous publiés en même temps&nbsp;: chaque CNP rédige son
              référentiel à son rythme.
            </p>

            <Notice
              title={
                <>
                  <strong>Entrée en vigueur de l'obligation&nbsp;:</strong>{" "}
                  1<sup>er</sup>&nbsp;janvier 2023.
                  <br />
                  <strong>Premières échéances&nbsp;:</strong> à partir de 2029
                  (cycles de 6&nbsp;ans) et 2032 (cycles de 9&nbsp;ans).
                </>
              }
              isClosable={false}
            />

            <p className={fr.cx("fr-mt-3w", "fr-mb-0")}>
              Si votre référentiel n'est pas encore disponible, vous pouvez
              vous connecter dès maintenant&nbsp;: votre espace personnel vous
              indiquera son statut. Vous serez notifié par e-mail dès sa
              publication.
            </p>
          </section>

          {/* §8 — Ce que MCPS apporte */}
          <section className="maq-info-section" aria-labelledby="mcps">
            <h2 id="mcps" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Ce que vous apporte Ma Certif' Pro Santé
            </h2>
            <p>
              L'outil est mis à votre disposition par l'ANS pour faciliter le
              suivi de votre obligation. Il vous permet de&nbsp;:
            </p>
            <ul className="maq-info-list">
              <li>
                <strong>Visualiser</strong> votre cycle, vos axes et votre
                progression à tout moment.
              </li>
              <li>
                <strong>Déclarer</strong> chaque action réalisée, en quelques
                clics, avec ses justificatifs.
              </li>
              <li>
                <strong>Recevoir</strong> automatiquement les actions
                enregistrées par des sources de confiance (ANDPC, HAS…).
              </li>
              <li>
                <strong>Télécharger</strong> une synthèse de certification à
                tout moment.
              </li>
            </ul>
            <p className={fr.cx("fr-mb-0")}>
              L'utilisation de l'outil est <strong>gratuite</strong> et
              sécurisée par Pro Santé Connect (CPS / e-CPS).
            </p>
          </section>

          {/* §9 — Vos données */}
          <section className="maq-info-section" aria-labelledby="donnees">
            <h2 id="donnees" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Vos données, votre confidentialité
            </h2>
            <p>
              Le traitement de vos données est conforme au RGPD et placé sous
              la responsabilité de l'Agence du Numérique en Santé.
            </p>
            <ul className="maq-info-list">
              <li>
                Seul votre <strong>Ordre professionnel</strong> accède à vos
                données individuelles de certification.
              </li>
              <li>
                L'ANS et les Conseils Nationaux Professionnels ne reçoivent que
                des données <strong>agrégées et anonymes</strong> (statistiques
                nationales, par profession, par référentiel).
              </li>
              <li>
                Vous pouvez exporter ou supprimer vos données depuis votre
                espace personnel, dans le respect des durées de conservation
                légales liées à votre obligation.
              </li>
            </ul>
          </section>

          {/* §10 — FAQ */}
          <section className="maq-info-section" aria-labelledby="faq">
            <h2 id="faq" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Questions fréquentes
            </h2>
            <div className={fr.cx("fr-accordions-group")}>
              {FAQ_ITEMS.map((item) => (
                <Accordion key={item.label} label={item.label}>
                  {item.body}
                </Accordion>
              ))}
            </div>
            <p className={fr.cx("fr-mt-4w", "fr-mb-0")}>
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
          </section>

          {/* §11 — Pour aller plus loin */}
          <section className="maq-info-section" aria-labelledby="ressources">
            <h2 id="ressources" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Pour aller plus loin
            </h2>

            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <Card
                  border
                  enlargeLink
                  title="Tous les référentiels"
                  titleAs="h3"
                  desc="Découvrez les actions de certification par profession et par axe, sans avoir à vous connecter."
                  linkProps={{ to: "/referentiel" }}
                />
              </div>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <Card
                  border
                  enlargeLink
                  title="Le site de l'ANS"
                  titleAs="h3"
                  desc="Cadre, gouvernance et autres services numériques en santé."
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
                  title="Vos interlocuteurs"
                  titleAs="h3"
                  desc="Identifiez votre Ordre professionnel, votre CNP et les contacts dédiés à votre certification."
                  linkProps={{
                    href: "#",
                    onClick: (e: React.MouseEvent<HTMLAnchorElement>) =>
                      e.preventDefault(),
                  }}
                />
              </div>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <Card
                  border
                  enlargeLink
                  title="Pro Santé Connect"
                  titleAs="h3"
                  desc="Le service d'authentification unique pour les professionnels de santé."
                  linkProps={{
                    href: "https://esante.gouv.fr/produits-services/pro-sante-connect",
                    target: "_blank",
                    rel: "noreferrer",
                  }}
                />
              </div>
            </div>

            <div className="maq-info-cta">
              <p className={fr.cx("fr-text--md", "fr-mb-3w")}>
                Prêt à consulter votre cycle&nbsp;?
              </p>
              <ProSanteConnectButton onClick={handleConnect} />
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
