import { useMemo, type ReactNode } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Card } from "@codegouvfr/react-dsfr/Card";
import { Tile } from "@codegouvfr/react-dsfr/Tile";
import Book from "@codegouvfr/react-dsfr/picto/Book";
import Avatar from "@codegouvfr/react-dsfr/picto/Avatar";
import FlowSettings from "@codegouvfr/react-dsfr/picto/FlowSettings";
import Information from "@codegouvfr/react-dsfr/picto/Information";
import {
  FAQ_ITEMS,
  type FaqCategorie,
  type Interlocuteur,
} from "../../data/interlocuteurs";
import {
  openContactModal,
  type ContactTarget,
} from "../../components/ContactModal";

// ─── Mapping interlocuteur (FAQ) → target (modale) ──────
const TARGET_BY_INTERLOCUTEUR: Record<Interlocuteur, ContactTarget> = {
  CNP: "cnp",
  Ordre: "ordre",
  ANS: "ans",
  DPO: "dpo",
};

// ─── Dispatcher : 4 grandes catégories de besoin ───────
type Dispatch = {
  title: string;
  desc: string;
  interlocuteur: Interlocuteur;
  target: ContactTarget;
  pictogram: ReactNode;
};

const DISPATCH: Dispatch[] = [
  {
    title: "Référentiel et actions de certification",
    desc: "Contenu de votre référentiel, éligibilité d'une action, équivalences DPC, mises à jour.",
    interlocuteur: "CNP",
    target: "cnp",
    pictogram: <Book />,
  },
  {
    title: "Vos informations et votre cycle",
    desc: "Données personnelles (nom, RPPS, profession), durée de cycle, suspension, changement d'ordre.",
    interlocuteur: "Ordre",
    target: "ordre",
    pictogram: <Avatar />,
  },
  {
    title: "Problème technique sur Ma Certif' Pro Santé",
    desc: "Connexion avec Pro Santé Connect, bug d'affichage, anomalie sur la plateforme.",
    interlocuteur: "ANS",
    target: "ans",
    pictogram: <FlowSettings />,
  },
  {
    title: "Données personnelles et RGPD",
    desc: "Accès, rectification, opposition ou suppression de vos données personnelles.",
    interlocuteur: "DPO",
    target: "dpo",
    pictogram: <Information />,
  },
];

const FAQ_CATEGORIES_ORDER: FaqCategorie[] = [
  "Référentiel",
  "Cycle",
  "Mes données",
  "Outil MCPS",
];

function InterlocuteurBadge({ value }: { value: Interlocuteur }) {
  if (value === "ANS" || value === "DPO") {
    return (
      <Badge small noIcon>
        {value === "DPO" ? "DPO de l'ANS" : "Équipe MCPS (ANS)"}
      </Badge>
    );
  }
  return (
    <Badge severity="info" small noIcon>
      {value === "CNP" ? "Votre CNP" : "Votre Ordre"}
    </Badge>
  );
}

function ctaLabel(target: ContactTarget): string {
  switch (target) {
    case "ordre":
      return "Contacter mon Ordre";
    case "cnp":
      return "Contacter mon CNP";
    case "ans":
      return "Contacter l'équipe MCPS";
    case "dpo":
      return "Contacter le DPO";
    case "both":
      return "Voir mes coordonnées";
  }
}

export function Aide() {
  const itemsByCategorie = useMemo(() => {
    const map: Record<FaqCategorie, typeof FAQ_ITEMS> = {
      Référentiel: [],
      Cycle: [],
      "Mes données": [],
      "Outil MCPS": [],
    };
    FAQ_ITEMS.forEach((it) => map[it.categorie].push(it));
    return map;
  }, []);

  return (
    <div className={fr.cx("fr-container", "fr-mt-4w", "fr-mb-8w")}>
      <Breadcrumb
        currentPageLabel="Aide"
        segments={[{ label: "Accueil", linkProps: { to: "/" } }]}
      />

      {/* ─── Hero ──────────────────────────────────────── */}
      <div className={fr.cx("fr-grid-row", "fr-mb-6w")}>
        <div className={fr.cx("fr-col-12", "fr-col-lg-9")}>
          <h1 className={fr.cx("fr-mb-2w")}>Besoin d'aide&nbsp;?</h1>
          <p className={fr.cx("fr-text--lead", "fr-mb-0")}>
            Choisissez votre besoin pour être orienté vers le bon
            interlocuteur. Selon votre question, votre Ordre, votre CNP, ou
            l'équipe Ma Certif' Pro Santé peut vous répondre.
          </p>
        </div>
      </div>

      {/* ─── Sommaire latéral + contenu ─────────────────── */}
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <aside
          className={fr.cx("fr-col-12", "fr-col-md-3")}
          aria-label="Sur cette page"
        >
          <nav className="maq-toc" aria-label="Sommaire">
            <p className="maq-toc__title">Sur cette page</p>
            <ul className="maq-toc__list">
              <li>
                <a className="maq-toc__link" href="#dispatcher">
                  Qui contacter selon votre besoin
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

        <div className={fr.cx("fr-col-12", "fr-col-md-9")}>
          {/* ═══ §1 — Dispatcher 4 besoins ═══════════════════ */}
          <section className="maq-info-section" aria-labelledby="dispatcher">
            <h2 id="dispatcher" className={fr.cx("fr-h3", "fr-mb-2w")}>
              Qui contacter selon votre besoin&nbsp;?
            </h2>
            <p className={fr.cx("fr-text--md", "fr-mb-4w")}>
              Sélectionnez votre situation pour afficher les coordonnées du
              bon interlocuteur.
            </p>

            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              {DISPATCH.map((d) => (
                <div
                  key={d.title}
                  className={fr.cx("fr-col-12", "fr-col-md-6")}
                >
                  <Tile
                    title={d.title}
                    titleAs="h3"
                    desc={d.desc}
                    detail={<InterlocuteurBadge value={d.interlocuteur} />}
                    pictogram={d.pictogram}
                    orientation="horizontal"
                    enlargeLinkOrButton
                    buttonProps={{
                      onClick: () => openContactModal(d.target),
                    }}
                  />
                </div>
              ))}
            </div>
          </section>

          {/* ═══ §2 — FAQ par catégorie ═════════════════════ */}
          <section className="maq-info-section" aria-labelledby="faq">
            <h2 id="faq" className={fr.cx("fr-h3", "fr-mb-2w")}>
              Questions fréquentes
            </h2>
            <p className={fr.cx("fr-text--md", "fr-mb-4w")}>
              Si vous ne savez pas qui contacter, ces réponses peuvent vous
              orienter. Chaque réponse mène à l'interlocuteur compétent.
            </p>

            {FAQ_CATEGORIES_ORDER.map((cat) => {
              const items = itemsByCategorie[cat];
              if (items.length === 0) return null;
              return (
                <div key={cat} className={fr.cx("fr-mb-4w")}>
                  <h3 className={fr.cx("fr-h6", "fr-mb-2w")}>{cat}</h3>
                  <div className={fr.cx("fr-accordions-group")}>
                    {items.map((it) => {
                      const target =
                        TARGET_BY_INTERLOCUTEUR[it.interlocuteur];
                      return (
                        <Accordion key={it.q} label={it.q}>
                          <p className={fr.cx("fr-mb-2w")}>{it.a}</p>
                          <div className="maq-faq-footer">
                            <button
                              type="button"
                              className={fr.cx(
                                "fr-btn",
                                "fr-btn--sm",
                                "fr-btn--secondary",
                                "fr-icon-arrow-right-line",
                                "fr-btn--icon-right"
                              )}
                              onClick={() => openContactModal(target)}
                            >
                              {ctaLabel(target)}
                            </button>
                          </div>
                        </Accordion>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </section>

          {/* ═══ §3 — Pour aller plus loin ══════════════════ */}
          <section className="maq-info-section" aria-labelledby="ressources">
            <h2 id="ressources" className={fr.cx("fr-h3", "fr-mb-3w")}>
              Pour aller plus loin
            </h2>
            <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <Card
                  border
                  enlargeLink
                  title="Comprendre la certification périodique"
                  titleAs="h3"
                  desc="Cadre légal, cycle, axes, acteurs : tout ce qu'il faut savoir avant de vous connecter."
                  linkProps={{ to: "/en-savoir-plus" }}
                />
              </div>
              <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
                <Card
                  border
                  enlargeLink
                  title="Tous les référentiels"
                  titleAs="h3"
                  desc="Découvrez les actions par profession et par axe, sans vous connecter."
                  linkProps={{ to: "/referentiel" }}
                />
              </div>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
