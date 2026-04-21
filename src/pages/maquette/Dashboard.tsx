import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import {
  referentiel,
  profileMock,
  loadActions,
  loadSelectedThemes,
  getActionsForAxe,
  getFormationsForAxeAndThemes,
  getTempsRestant,
  getNewlyCoveredAxes,
  markAxesCelebrated,
  getActionTypeLabel,
  type AxeRef,
  type ActionRealisee,
  type FormationSuggestion,
} from "../../data/maquette";
import "./maquette.css";

/* ─── AxeCard sub-component ────────────────────────────── */

function AxeCard({
  axe,
  actions,
  themes,
  suggestion,
  allSuggestions,
  onClick,
  variant = "current",
  label,
}: {
  axe: AxeRef;
  actions: ActionRealisee[];
  themes: { id: string; label: string }[];
  suggestion: FormationSuggestion | null;
  allSuggestions: FormationSuggestion[];
  onClick: () => void;
  variant?: "current" | "A" | "B" | "C";
  label?: string;
}) {
  const axeNum = axe.id.split("-")[1];
  const count = actions.length;
  const isComplete = count >= axe.min_actions;
  const isEnCours = count > 0 && !isComplete;
  const remaining = Math.max(0, axe.min_actions - count);

  // ─── Nudge content varies by variant ──────────────────
  function renderNudge() {
    if (isComplete) {
      return (
        <p className="maq-card__nudge-text maq-card__nudge-text--success">
          <span className="fr-icon-check-line" aria-hidden="true" />
          Axe couvert — {count} action{count > 1 ? "s" : ""} declaree
          {count > 1 ? "s" : ""}
        </p>
      );
    }

    // ─── VARIANT A: Compact avec badge type ─────────────
    if (variant === "A" && suggestion) {
      return (
        <>
          <p className="maq-card__nudge-label">
            {isEnCours ? `Encore ${remaining} :` : "Pour commencer :"}
          </p>
          <p className="maq-card__nudge-compact">
            <span className="maq-card__nudge-type">
              {getActionTypeLabel(suggestion.typeAction)}
            </span>
            {suggestion.titre}
            <span className="maq-card__nudge-duree"> · {suggestion.duree}</span>
          </p>
        </>
      );
    }

    // ─── VARIANT B: Compteur de suggestions ─────────────
    if (variant === "B") {
      const suggCount = allSuggestions.length;
      if (suggCount > 0) {
        return (
          <div className="maq-card__nudge-count">
            <span className="fr-icon-lightbulb-line maq-card__nudge-count-icon" aria-hidden="true" />
            <p>
              <strong>{suggCount} action{suggCount > 1 ? "s" : ""} recommandee{suggCount > 1 ? "s" : ""}</strong>
              <br />
              <span className="maq-card__nudge-count-sub">
                {isEnCours ? `Plus qu'${remaining} pour couvrir cet axe` : "Basees sur vos centres d'interet"}
              </span>
            </p>
          </div>
        );
      }
      return (
        <p className="maq-card__nudge-label">
          Explorez les actions de cet axe
        </p>
      );
    }

    // ─── VARIANT C: Mini-liste 2-3 suggestions ──────────
    if (variant === "C") {
      const top = allSuggestions.slice(0, 3);
      const moreCount = allSuggestions.length - top.length;
      if (top.length > 0) {
        return (
          <>
            <p className="maq-card__nudge-label">
              {isEnCours ? `Encore ${remaining} :` : "Pour commencer :"}
            </p>
            <ul className="maq-card__nudge-list">
              {top.map((s) => (
                <li key={s.id}>
                  {s.titre}
                  <span className="maq-card__nudge-list-meta"> · {s.duree}</span>
                </li>
              ))}
            </ul>
            {moreCount > 0 && (
              <p className="maq-card__nudge-list-more">
                +{moreCount} autre{moreCount > 1 ? "s" : ""}
              </p>
            )}
          </>
        );
      }
      return (
        <p className="maq-card__nudge-label">
          Explorez les actions de cet axe
        </p>
      );
    }

    // ─── DEFAULT (current) ──────────────────────────────
    if (suggestion) {
      return (
        <>
          <p className="maq-card__nudge-label">
            {isEnCours
              ? `Encore ${remaining} — pourquoi pas :`
              : "Pour commencer :"}
          </p>
          <p className="maq-card__nudge-suggestion">
            {suggestion.titre}
          </p>
          {(suggestion.organisme || suggestion.duree || suggestion.modalite) && (
            <p className="maq-card__nudge-meta">
              {[suggestion.organisme, suggestion.duree, suggestion.modalite].filter(Boolean).join(" · ")}
            </p>
          )}
        </>
      );
    }

    return (
      <p className="maq-card__nudge-label">
        {isEnCours
          ? `Encore ${remaining} action${remaining > 1 ? "s" : ""}`
          : "Explorez les actions de cet axe"}
      </p>
    );
  }

  return (
    <article
      className="maq-card"
      onClick={onClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter") onClick();
      }}
    >
      {/* Variant label (temp, for comparison) */}
      {label && (
        <p style={{ fontSize: "0.625rem", textTransform: "uppercase", letterSpacing: "0.08em", color: "var(--text-action-high-blue-france)", fontWeight: 700, marginBottom: "0.5rem" }}>
          {label}
        </p>
      )}

      {/* Top: axe number + circles + count */}
      <div className="maq-card__top">
        <span className="maq-card__num">Axe {axeNum}</span>
        <div className="maq-card__circles-group">
          <div className="maq-card__circles">
            {Array.from({ length: axe.min_actions }).map((_, i) => (
              <span
                key={i}
                className={`maq-card__circle${
                  i < count ? " maq-card__circle--filled" : ""
                }`}
              />
            ))}
          </div>
          <span className="maq-card__count">
            {count} / {axe.min_actions}
          </span>
        </div>
      </div>

      {/* Title */}
      <h3 className="maq-card__title">{axe.label_court}</h3>
      <p className="maq-card__ps">{axe.label_ps}</p>

      {/* Themes tags (from onboarding) */}
      {themes.length > 0 && (
        <div className="maq-card__themes">
          {themes.slice(0, 3).map((t) => (
            <span key={t.id} className="maq-card__theme-tag">
              {t.label}
            </span>
          ))}
          {themes.length > 3 && (
            <span className="maq-card__theme-more">
              +{themes.length - 3}
            </span>
          )}
        </div>
      )}

      {/* Contextual nudge */}
      <div className="maq-card__nudge">
        {renderNudge()}
      </div>

      {/* Footer */}
      <div className="maq-card__footer">
        <span className="maq-card__link">
          {isComplete ? "Voir le detail" : "Explorer l'axe"}
          <span
            className="fr-icon-arrow-right-s-line"
            aria-hidden="true"
          />
        </span>
      </div>
    </article>
  );
}

/* ─── Dashboard page ───────────────────────────────────── */

export function Dashboard() {
  const navigate = useNavigate();
  const actions = loadActions();
  const savedThemes = loadSelectedThemes();
  const totalActions = actions.length;
  const axesCovered = referentiel.axes.filter(
    (axe) => getActionsForAxe(axe.id, actions).length >= axe.min_actions
  ).length;
  const progressPercent = Math.round(
    (totalActions / referentiel.min_total) * 100
  );

  // ─── Celebration logic ──────────────────────────────────
  const [celebratedAxes, setCelebratedAxes] = useState<AxeRef[]>([]);

  useEffect(() => {
    const newAxes = getNewlyCoveredAxes(actions);
    if (newAxes.length > 0) {
      setCelebratedAxes(newAxes);
      markAxesCelebrated(newAxes.map((a) => a.id));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <>
      {/* ═══ Header : Profil + Circle chart ════════════════ */}
      <div className="maq-progress-banner">
        <div className={fr.cx("fr-container")}>
          <div className="maq-dashboard-header">
            <div className="maq-dashboard-header__left">
              <Breadcrumb
                currentPageLabel="Tableau de bord"
                homeLinkProps={{ to: "/maquette" }}
                segments={[]}
              />
              <h1 className={fr.cx("fr-mb-1v")}>
                Bonjour, {profileMock.prenom}
              </h1>
              <p className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}>
                {profileMock.specialite} · Il vous reste {getTempsRestant()}
              </p>
            </div>
            <div className="maq-dashboard-header__right">
              <div className="maq-dashboard-header__progress">
                <p className={fr.cx("fr-text--sm", "fr-text--bold", "fr-mb-1v")}>
                  {totalActions} / {referentiel.min_total} actions
                </p>
                <div
                  className="maq-progress__track"
                  role="progressbar"
                  aria-valuenow={totalActions}
                  aria-valuemin={0}
                  aria-valuemax={referentiel.min_total}
                  aria-label="Progression des actions"
                >
                  <div
                    className="maq-progress__fill"
                    style={{ width: `${Math.min(progressPercent, 100)}%` }}
                  />
                </div>
              </div>
              <Button
                priority="tertiary no outline"
                size="small"
                iconId="fr-icon-file-text-line"
                iconPosition="left"
                linkProps={{ to: "/maquette/synthese" }}
              >
                Ma synthese
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className={fr.cx("fr-container", "fr-pb-6w")}>
        {/* ═══ ZONE B' — Celebration (conditionnel) ═════════ */}
        {celebratedAxes.length > 0 && (
          <Alert
            severity="success"
            title="Bravo !"
            description={
              celebratedAxes.length === 1
                ? `L'axe ${celebratedAxes[0].id.split("-")[1]} est desormais couvert.`
                : `Les axes ${celebratedAxes.map((a) => a.id.split("-")[1]).join(", ")} sont desormais couverts.`
            }
            className={fr.cx("fr-mt-4w")}
            closable
          />
        )}

        {/* ═══ ZONE B'' — Etat vide (conditionnel) ═════════ */}
        {totalActions === 0 && (
          <CallOut
            iconId="ri-lightbulb-line"
            title="Par ou commencer ?"
            className={fr.cx("fr-mt-4w")}
          >
            Choisissez un axe qui vous parle et declarez votre premiere
            action. Pas besoin de tout faire d'un coup — chaque pas
            compte dans votre cycle.
          </CallOut>
        )}

        {/* ═══ Tous les axes couverts (conditionnel) ════════ */}
        {axesCovered === 4 && (
          <CallOut
            iconId="ri-trophy-line"
            title="Tous les axes sont couverts"
            className={fr.cx("fr-mt-4w")}
          >
            Felicitations ! Vos actions couvrent les 4 axes du referentiel.
            Vous pouvez continuer a enrichir votre parcours si vous le souhaitez.
          </CallOut>
        )}

        {/* ═══ ZONE C — Section "Votre parcours" ═══════════ */}
        <div className={`maq-section-header ${fr.cx("fr-mt-5w")}`}>
          <h2 className={fr.cx("fr-h4", "fr-mb-0")}>Votre parcours</h2>
          <Button
            priority="primary"
            iconId="fr-icon-add-line"
            iconPosition="left"
            size="small"
            onClick={() => navigate("/maquette/declarer")}
          >
            Declarer une action
          </Button>
        </div>

        {/* ─── Comparaison des 3 variantes (axe 1 vide) ───── */}
        {(() => {
          const demoAxe = referentiel.axes[0]; // axe 1
          const demoActions = getActionsForAxe(demoAxe.id, actions);
          const demoThemeIds = savedThemes && savedThemes[demoAxe.id] ? savedThemes[demoAxe.id] : [];
          const demoThemes = demoAxe.themes.filter((t) => demoThemeIds.includes(t.id));
          const demoFormations = getFormationsForAxeAndThemes(demoAxe.id, demoThemeIds);
          const demoSuggestion = demoFormations[0] || null;
          return (
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "1rem", marginBottom: "2rem" }}>
              <AxeCard axe={demoAxe} actions={demoActions} themes={demoThemes} suggestion={demoSuggestion} allSuggestions={demoFormations} onClick={() => {}} variant="A" label="A — Compacte + type" />
              <AxeCard axe={demoAxe} actions={demoActions} themes={demoThemes} suggestion={demoSuggestion} allSuggestions={demoFormations} onClick={() => {}} variant="B" label="B — Compteur" />
              <AxeCard axe={demoAxe} actions={demoActions} themes={demoThemes} suggestion={demoSuggestion} allSuggestions={demoFormations} onClick={() => {}} variant="C" label="C — Mini-liste" />
            </div>
          );
        })()}

        {/* ─── Grille axes (2x2) ───────────────────────────── */}
        <div className="maq-grid">
          {referentiel.axes.map((axe) => {
            const axeActions = getActionsForAxe(axe.id, actions);
            const themeIds =
              savedThemes && savedThemes[axe.id]
                ? savedThemes[axe.id]
                : [];
            const themes = axe.themes.filter((t) =>
              themeIds.includes(t.id)
            );
            const formations = getFormationsForAxeAndThemes(
              axe.id,
              themeIds
            );
            const suggestion = formations[0] || null;

            return (
              <AxeCard
                key={axe.id}
                axe={axe}
                actions={axeActions}
                themes={themes}
                suggestion={suggestion}
                allSuggestions={formations}
                onClick={() => navigate(`/maquette/axe/${axe.id}`)}
              />
            );
          })}
        </div>

      </div>
    </>
  );
}
