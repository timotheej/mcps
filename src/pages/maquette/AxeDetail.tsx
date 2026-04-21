import { useState } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import {
  getAxeById,
  loadActions,
  getActionsForAxe,
  loadSelectedThemes,
  getFormationsForAxeAndThemes,
  formationsMock,
  getAdjacentAxes,
  getThemeLabel,
  getActionTypeLabel,
} from "../../data/maquette";
import "./maquette.css";

export function AxeDetail() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const axe = id ? getAxeById(id) : undefined;

  const savedThemes = loadSelectedThemes();
  const axeThemeIds = savedThemes && id ? savedThemes[id] || [] : [];

  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  if (!axe || !id) {
    return <Navigate to="/maquette/tableau-de-bord" replace />;
  }

  const axeNum = axe.id.split("-")[1];
  const actions = loadActions();
  const axeActions = getActionsForAxe(id, actions);
  const count = axeActions.length;
  const remaining = Math.max(0, axe.min_actions - count);
  const isComplete = count >= axe.min_actions;

  const filterThemeIds = activeFilter ? [activeFilter] : axeThemeIds;
  const formations = getFormationsForAxeAndThemes(id, filterThemeIds);
  // Also get all formations for this axe (unfiltered) for "all" view
  const allFormations = formationsMock.filter((f) => f.axeId === id);

  const axeThemes = axe.themes.filter((t) =>
    axeThemeIds.includes(t.id)
  );

  const { prev, next } = getAdjacentAxes(id);

  // Build CallOut message based on state
  const calloutMessage = (() => {
    const axeDescription =
      axe.label_officiel.split(" - ")[1] || axe.label_officiel;
    if (count === 0) {
      const themesText =
        axeThemes.length > 0
          ? ` Vos centres d'interet (${axeThemes.map((t) => t.label).join(", ")}) guideront les suggestions ci-dessous.`
          : "";
      return `${axeDescription} — vous n'avez pas encore commence cet axe.${themesText} Explorez les actions ci-dessous pour trouver celle qui vous correspond.`;
    }
    if (isComplete) {
      return `${axeDescription} — cet axe est couvert, bravo ! Vous avez declare ${count} action${count > 1 ? "s" : ""}. Vous pouvez continuer a enrichir votre parcours si vous le souhaitez.`;
    }
    return `${axeDescription} — encore ${remaining} action${remaining > 1 ? "s" : ""} pour couvrir cet axe. Vous etes sur la bonne voie, explorez les suggestions basees sur vos centres d'interet.`;
  })();

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <Breadcrumb
        currentPageLabel={axe.label_court}
        homeLinkProps={{ to: "/maquette" }}
        segments={[
          {
            label: "Tableau de bord",
            linkProps: { to: "/maquette/tableau-de-bord" },
          },
        ]}
      />

      {/* ═══ Inter-axe navigation ═══════════════════════════ */}
      {(prev || next) && (
        <nav className="maq-axe-nav" aria-label="Navigation entre les axes">
          {prev ? (
            <a
              className="maq-axe-nav__link maq-axe-nav__link--prev"
              href={`/maquette/axe/${prev.id}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/maquette/axe/${prev.id}`);
              }}
            >
              <span className="fr-icon-arrow-left-s-line" aria-hidden="true" />
              Axe {prev.id.split("-")[1]} : {prev.label_court}
            </a>
          ) : (
            <span />
          )}
          {next ? (
            <a
              className="maq-axe-nav__link maq-axe-nav__link--next"
              href={`/maquette/axe/${next.id}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/maquette/axe/${next.id}`);
              }}
            >
              Axe {next.id.split("-")[1]} : {next.label_court}
              <span className="fr-icon-arrow-right-s-line" aria-hidden="true" />
            </a>
          ) : (
            <span />
          )}
        </nav>
      )}

      {/* ═══ Header integre ══════════════════════════════ */}
      <div className="maq-axe-header">
        <div className="maq-axe-header__left">
          <p className="maq-axe-header__num">Axe {axeNum}</p>
          <h1 className="maq-axe-header__title">{axe.label_court}</h1>
          <p className="maq-axe-header__ps">{axe.label_ps}</p>
        </div>
        <div className="maq-axe-header__right">
          <div className="maq-axe-header__status">
            <div className="maq-axe-header__circles">
              {Array.from({ length: axe.min_actions }).map((_, i) => (
                <span
                  key={i}
                  className={`maq-axe-header__circle${
                    i < count ? " maq-axe-header__circle--filled" : ""
                  }`}
                />
              ))}
            </div>
            {isComplete ? (
              <Badge severity="success" small>
                Couvert
              </Badge>
            ) : count > 0 ? (
              <Badge severity="new" small>
                {count} / {axe.min_actions}
              </Badge>
            ) : (
              <Badge small>
                0 / {axe.min_actions}
              </Badge>
            )}
          </div>
          <Button
            priority="primary"
            iconId="fr-icon-add-line"
            iconPosition="left"
            size="small"
            onClick={() => navigate(`/maquette/declarer?axe=${id}`)}
          >
            Declarer une action
          </Button>
        </div>
      </div>

      {/* ═══ Callout sens (pourquoi cet axe) ═════════════ */}
      <CallOut className={fr.cx("fr-mb-4w")}>{calloutMessage}</CallOut>

      {/* ═══ Layout 2 colonnes ═══════════════════════════ */}
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        {/* ─── Colonne principale : suggestions ────────── */}
        <div className={fr.cx("fr-col-12", "fr-col-lg-8")}>
          <div className="maq-axe-main">
            <div className="maq-axe-main__header">
              <h2 className={fr.cx("fr-h4", "fr-mb-0")}>
                Actions recommandees
              </h2>
              <Button
                priority="tertiary no outline"
                size="small"
                iconId="fr-icon-book-2-line"
                iconPosition="left"
                linkProps={{
                  to: `/maquette/axe/${id}/referentiel`,
                }}
              >
                Tout le referentiel ({axe.actions_count})
              </Button>
            </div>

            {/* Tags filtres */}
            {axeThemes.length > 0 && (
              <div className="maq-axe-main__filters">
                <button
                  type="button"
                  className={`maq-axe__theme-tag${
                    activeFilter === null
                      ? " maq-axe__theme-tag--active"
                      : ""
                  }`}
                  onClick={() => setActiveFilter(null)}
                >
                  Tous
                </button>
                {axeThemes.map((theme) => (
                  <button
                    key={theme.id}
                    type="button"
                    className={`maq-axe__theme-tag${
                      activeFilter === theme.id
                        ? " maq-axe__theme-tag--active"
                        : ""
                    }`}
                    onClick={() =>
                      setActiveFilter(
                        activeFilter === theme.id ? null : theme.id
                      )
                    }
                  >
                    {theme.label}
                  </button>
                ))}
                <a
                  className={fr.cx("fr-link", "fr-link--sm")}
                  href={`/maquette/onboarding?focus=${id}`}
                  onClick={(e) => {
                    e.preventDefault();
                    navigate(`/maquette/onboarding?focus=${id}`);
                  }}
                >
                  Modifier
                </a>
              </div>
            )}

            {/* Grille formations */}
            {formations.length === 0 ? (
              <div className="maq-axe__no-formations">
                <p>
                  Aucune action suggeree pour cette selection.
                  Essayez un autre filtre ou consultez le referentiel
                  complet.
                </p>
              </div>
            ) : (
              <div className="maq-axe-main__formations">
                {formations.map((f) => {
                  const matchedThemes = f.themes.filter((t) =>
                    axeThemeIds.includes(t)
                  );
                  return (
                    <article
                      key={f.id}
                      className="maq-formation"
                    >
                      <div className="maq-formation__body">
                        <span className="maq-formation__type">
                          {getActionTypeLabel(f.typeAction)}
                        </span>
                        <h3 className="maq-formation__title">
                          {f.titre}
                        </h3>
                        {f.organisme && (
                          <p className="maq-formation__org">
                            <span
                              className="fr-icon-building-line"
                              aria-hidden="true"
                              style={{ fontSize: "0.875rem" }}
                            />
                            {f.organisme}
                          </p>
                        )}
                        {(f.duree || f.modalite) && (
                          <div className="maq-formation__badges">
                            {f.duree && (
                              <span className="maq-formation__badge">
                                <span
                                  className="fr-icon-time-line"
                                  aria-hidden="true"
                                />
                                {f.duree}
                              </span>
                            )}
                            {f.modalite && (
                              <span className="maq-formation__badge">
                                <span
                                  className="fr-icon-map-pin-2-line"
                                  aria-hidden="true"
                                />
                                {f.modalite}
                              </span>
                            )}
                          </div>
                        )}
                        {matchedThemes.length > 0 && (
                          <div className="maq-formation__themes">
                            {matchedThemes.map((themeId) => (
                              <span
                                key={themeId}
                                className="maq-formation__theme-match"
                              >
                                {getThemeLabel(id, themeId)}
                              </span>
                            ))}
                          </div>
                        )}
                      </div>
                      <div className="maq-formation__action">
                        <Button
                          priority="primary"
                          size="small"
                          iconId="fr-icon-add-circle-line"
                          iconPosition="left"
                          onClick={() =>
                            navigate(
                              `/maquette/declarer?axe=${id}&formation=${f.id}`
                            )
                          }
                        >
                          Declarer
                        </Button>
                      </div>
                    </article>
                  );
                })}
              </div>
            )}

            {/* Lien toutes les formations de cet axe (non filtrees) */}
            {allFormations.length > formations.length && (
              <p className={fr.cx("fr-mt-2w", "fr-text--sm")}>
                <a
                  className={fr.cx("fr-link")}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    setActiveFilter(null);
                  }}
                >
                  Voir les {allFormations.length} actions
                  suggerees pour cet axe
                </a>
              </p>
            )}

            {/* Lien declarer librement */}
            <p
              className={`${fr.cx("fr-mt-3w", "fr-text--sm")} fr-text-mention--grey`}
            >
              Vous ne trouvez pas votre action ?{" "}
              <a
                className={fr.cx("fr-link", "fr-link--sm")}
                href={`/maquette/declarer?axe=${id}`}
                onClick={(e) => {
                  e.preventDefault();
                  navigate(`/maquette/declarer?axe=${id}`);
                }}
              >
                Declarez-la librement
                <span
                  className="fr-icon-arrow-right-s-line"
                  aria-hidden="true"
                  style={{ fontSize: "0.75rem" }}
                />
              </a>
            </p>
          </div>
        </div>

        {/* ─── Sidebar : mes formations + infos ─────────── */}
        <div className={fr.cx("fr-col-12", "fr-col-lg-4")}>
          {/* Bloc formations declarees */}
          <div className="maq-sidebar-block">
            <h3 className="maq-sidebar-block__title">
              <span
                className="fr-icon-checkbox-circle-line"
                aria-hidden="true"
              />
              Mes actions declarees
            </h3>

            {axeActions.length === 0 ? (
              <p className="maq-sidebar-block__empty">
                Aucune action declaree pour cet axe.
              </p>
            ) : (
              <ul className="maq-sidebar-block__list">
                {axeActions.map((action) => (
                  <li key={action.id} className="maq-sidebar-item">
                    <span className="maq-sidebar-item__dot" />
                    <div>
                      <p className="maq-sidebar-item__label">
                        {action.libelle}
                      </p>
                      <p className="maq-sidebar-item__meta">
                        {action.date}
                      </p>
                    </div>
                  </li>
                ))}
              </ul>
            )}

            {remaining > 0 && (
              <p className="maq-sidebar-block__remaining">
                {remaining} action{remaining > 1 ? "s" : ""} restante
                {remaining > 1 ? "s" : ""} pour couvrir cet axe
              </p>
            )}
          </div>

          {/* Bloc a propos */}
          <div className="maq-sidebar-block">
            <h3 className="maq-sidebar-block__title">
              <span
                className="fr-icon-information-line"
                aria-hidden="true"
              />
              A propos de cet axe
            </h3>
            <p className="maq-sidebar-block__text">
              {axe.label_officiel}
            </p>
            <p className="maq-sidebar-block__text maq-sidebar-block__text--muted">
              Minimum {axe.min_actions} actions a declarer sur la
              duree de votre cycle. {axe.actions_count} types
              d'actions reconnus dans le referentiel.
            </p>
          </div>

          {/* Bloc mes themes */}
          <div className="maq-sidebar-block">
            <h3 className="maq-sidebar-block__title">
              <span
                className="fr-icon-heart-line"
                aria-hidden="true"
              />
              Mes centres d'interet
            </h3>
            {axeThemes.length > 0 ? (
              <div className="maq-sidebar-block__tags">
                {axeThemes.map((t) => (
                  <span key={t.id} className="maq-sidebar-block__tag">
                    {t.label}
                  </span>
                ))}
              </div>
            ) : (
              <p className="maq-sidebar-block__empty">
                Aucun theme selectionne pour cet axe.
              </p>
            )}
            <a
              className={fr.cx("fr-link", "fr-link--sm", "fr-mt-1w")}
              href={`/maquette/onboarding?focus=${id}`}
              onClick={(e) => {
                e.preventDefault();
                navigate(`/maquette/onboarding?focus=${id}`);
              }}
            >
              Modifier
            </a>
          </div>
        </div>
      </div>

      {/* ═══ Retour ══════════════════════════════════════ */}
      <div className={fr.cx("fr-mt-6w")}>
        <Button
          priority="tertiary"
          iconId="fr-icon-arrow-left-line"
          iconPosition="left"
          linkProps={{ to: "/maquette/tableau-de-bord" }}
        >
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
}
