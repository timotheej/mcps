import { fr } from "@codegouvfr/react-dsfr";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { Table } from "@codegouvfr/react-dsfr/Table";
import { axes, statutAxe, type Axe } from "../data/axes";
import { profile, suggestions } from "../data/profile";
import "./TableauDeBord.css";

const MINIMUM_TOTAL = 8;

function themesForAxe(axeNumero: Axe["numero"]): string[] {
  const themes = suggestions
    .filter((s) => s.axeNumero === axeNumero)
    .map((s) => s.theme);
  return Array.from(new Set(themes));
}

export function TableauDeBord() {
  const totalActions = axes.reduce(
    (sum, a) => sum + a.actionsDeclarees.length,
    0
  );
  const axesCouverts = axes.filter((a) => statutAxe(a) === "couvert").length;
  const actionsComptabilisees = Math.min(totalActions, MINIMUM_TOTAL);

  const dernieresActions = axes
    .flatMap((a) =>
      a.actionsDeclarees.map((action) => ({
        ...action,
        axeNumero: a.numero,
      }))
    )
    .slice(0, 5);

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <Breadcrumb
        currentPageLabel="Tableau de bord"
        homeLinkProps={{ to: "/" }}
        segments={[]}
      />

      {/* ─── En-tête ─────────────────────────────────────── */}
      <header className="mcps-dashboard__header">
        <h1 className={fr.cx("fr-mb-1w")}>
          Bonjour, {profile.civilite} {profile.nom}
        </h1>
        <p className={fr.cx("fr-text--lead", "fr-mb-0")}>
          Votre espace de suivi de la certification periodique
        </p>
        <div className="mcps-dashboard__tag">
          <Tag small>{profile.specialite}</Tag>
        </div>
      </header>

      {/* ─── Zone 2 — Cycle + synthèse ───────────────────── */}
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-7")}>
          <div className="mcps-card">
            <p className="mcps-card__label">Votre cycle de certification</p>
            <p className="mcps-cycle">Il vous reste 5 ans et 8 mois</p>
            <p className="mcps-cycle__sub">
              Cycle ouvert le 14 janvier 2023 — a cloturer avant le 14 janvier
              2032
            </p>
            <p className="mcps-cycle__legal">
              Obligation legale de certification periodique · cycle de 9 ans
            </p>
          </div>
        </div>
        <div className={fr.cx("fr-col-12", "fr-col-md-5")}>
          <div className="mcps-card">
            <p className="mcps-card__label">Votre avancement a ce jour</p>
            <div className="mcps-summary__gauge" aria-hidden="true">
              {Array.from({ length: MINIMUM_TOTAL }).map((_, i) => (
                <span
                  key={i}
                  className={
                    i < actionsComptabilisees
                      ? "mcps-summary__pastille mcps-summary__pastille--filled"
                      : "mcps-summary__pastille"
                  }
                />
              ))}
            </div>
            <p className="mcps-summary__figure">
              {totalActions} action{totalActions > 1 ? "s" : ""} sur{" "}
              {MINIMUM_TOTAL} minimum
            </p>
            <p className="mcps-summary__sub">
              {axesCouverts} axe{axesCouverts > 1 ? "s" : ""} couvert
              {axesCouverts > 1 ? "s" : ""} sur 4 ·{" "}
              {totalActions >= MINIMUM_TOTAL
                ? "seuil minimum atteint"
                : `${MINIMUM_TOTAL - totalActions} action${
                    MINIMUM_TOTAL - totalActions > 1 ? "s" : ""
                  } minimum a declarer`}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Zone 3 — Les 4 axes avec sens + thèmes ──────── */}
      <div className="mcps-section-header">
        <p className="mcps-section-header__overline">Referentiel</p>
        <h2 className="mcps-section-header__title">
          Vos 4 axes de certification
        </h2>
        <p className="mcps-section-header__intro">
          La loi organise votre certification en 4 axes. Chacun couvre une
          dimension de votre pratique et doit reunir au moins 2 actions sur
          la duree de votre cycle. Vous choisissez par ou avancer — a
          l'interieur de chaque axe, nous faisons remonter en priorite les
          actions en lien avec vos themes.
        </p>
        <div className="mcps-themes">
          <span className="mcps-themes__label">Vos themes :</span>
          {profile.themes.map((theme) => (
            <Tag key={theme} small>
              {theme}
            </Tag>
          ))}
          <a
            className={fr.cx("fr-link", "fr-link--sm")}
            href="#"
            onClick={(e) => e.preventDefault()}
          >
            Modifier
          </a>
        </div>
      </div>

      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        {axes.map((axe) => {
          const statut = statutAxe(axe);
          const actionsCount = axe.actionsDeclarees.length;
          const pastillesRemplies = Math.min(actionsCount, axe.minimum);
          const bonus = Math.max(0, actionsCount - axe.minimum);
          const themesMatches = themesForAxe(axe.numero);

          return (
            <div
              key={axe.numero}
              className={fr.cx("fr-col-12", "fr-col-md-6", "fr-col-lg-3")}
            >
              <article
                className={`mcps-fusion-card mcps-fusion-card--${statut}`}
                aria-labelledby={`fusion-axe-${axe.numero}-titre`}
              >
                {/* En-tête de l'axe : cadre + sens */}
                <div className="mcps-fusion-card__head">
                  <p className="mcps-fusion-card__label">Axe {axe.numero}</p>
                  <h3
                    id={`fusion-axe-${axe.numero}-titre`}
                    className="mcps-fusion-card__title"
                  >
                    {axe.intitule}
                  </h3>
                  <p className="mcps-fusion-card__sens">{axe.sens}</p>
                  <div className="mcps-fusion-card__gauge">
                    <div
                      className="mcps-axe-card__pastilles"
                      aria-hidden="true"
                    >
                      {Array.from({ length: axe.minimum }).map((_, i) => (
                        <span
                          key={i}
                          className={
                            i < pastillesRemplies
                              ? "mcps-axe-card__pastille mcps-axe-card__pastille--filled"
                              : "mcps-axe-card__pastille"
                          }
                        />
                      ))}
                    </div>
                    {bonus > 0 && (
                      <span className="mcps-axe-card__bonus">
                        + {bonus} autre{bonus > 1 ? "s" : ""}
                      </span>
                    )}
                  </div>
                </div>

                {/* Thèmes correspondants */}
                <div className="mcps-fusion-card__suggestions">
                  <p className="mcps-fusion-card__suggestions-label">
                    Selon vos themes
                  </p>
                  {themesMatches.length === 0 ? (
                    <p className="mcps-fusion-card__empty">
                      Aucun de vos themes ne correspond a cet axe.
                    </p>
                  ) : (
                    <div className="mcps-fusion-card__tags">
                      {themesMatches.map((theme) => (
                        <Tag key={theme} small>
                          {theme}
                        </Tag>
                      ))}
                    </div>
                  )}
                </div>

                {/* Lien vers l'axe complet */}
                <div className="mcps-fusion-card__foot">
                  <a
                    className={fr.cx("fr-link", "fr-link--sm")}
                    href={`/referentiel/axe/${axe.numero}`}
                  >
                    Voir toutes les actions de l'axe
                    <span
                      className="fr-icon-arrow-right-line"
                      aria-hidden="true"
                    />
                  </a>
                </div>
              </article>
            </div>
          );
        })}
      </div>

      {/* ─── Zone 4 — Dernières actions ──────────────────── */}
      <div className="mcps-section-header">
        <p className="mcps-section-header__overline">Activite</p>
        <h2 className="mcps-section-header__title">
          Vos dernieres actions declarees
        </h2>
        <p className="mcps-section-header__intro">
          Les actions que vous avez declarees, par ordre d'ajout le plus
          recent.
        </p>
      </div>

      {dernieresActions.length === 0 ? (
        <div className="mcps-table-container">
          <p className={fr.cx("fr-text--sm", "fr-mb-0", "fr-text-mention--grey")}>
            Vous n'avez encore declare aucune action.
          </p>
        </div>
      ) : (
        <>
          <div className="mcps-table-container">
            <Table
              headers={["Date", "Action", "Axe", "Origine"]}
              data={dernieresActions.map((a) => [
                a.date,
                a.libelle,
                `Axe ${a.axeNumero}`,
                a.origine,
              ])}
              noCaption
            />
          </div>
          {totalActions > dernieresActions.length && (
            <p className="mcps-table-footer">
              <a
                className={fr.cx("fr-link")}
                href="#"
                onClick={(e) => e.preventDefault()}
              >
                Voir toutes mes actions ({totalActions})
              </a>
            </p>
          )}
        </>
      )}

      {/* ─── Zone 5 — Pied de page ──────────────────────── */}
      <div className="mcps-footer-actions">
        <Button
          priority="secondary"
          iconId="fr-icon-download-line"
          iconPosition="right"
        >
          Telecharger ma synthese
        </Button>
        <p className="mcps-footer-actions__help">
          Une question sur le dispositif, son calendrier ou ses consequences ?
          Consultez la{" "}
          <a className={fr.cx("fr-link", "fr-link--sm")} href="#">
            FAQ
          </a>{" "}
          ou contactez votre Ordre.
        </p>
      </div>
    </div>
  );
}
