import { useState, useCallback } from "react";
import { useParams, Navigate, useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { ActionDrawer } from "./ActionDrawer";
import {
  getAxeById,
  loadActions,
  getActionsForAxe,
  loadSelectedThemes,
  getFormationsForAxeAndThemes,
  formationsMock,
  getThemeLabel,
  getActionTypeLabel,
  getAxeColor,
  SOURCES,
  VALIDATION_STATES,
  type ActionRealisee,
  type ValidationState,
  type FormationSuggestion,
} from "../../data/maquette";
import "./maquette.css";

/* ─── Progress Dot (reused from Dashboard) ───────────── */

function ProgressDot({ filled, overflow, color }: { filled: boolean; overflow?: boolean; color: string }) {
  const size = 18;
  if (overflow) {
    return (
      <span
        className="maq-progress-dot maq-progress-dot--overflow"
        style={{ width: size, height: size, background: color, borderColor: color }}
      >+</span>
    );
  }
  if (filled) {
    return (
      <span
        className="maq-progress-dot maq-progress-dot--filled"
        style={{ width: size, height: size, background: color, borderColor: color }}
      />
    );
  }
  return <span className="maq-progress-dot" style={{ width: size, height: size }} />;
}

function AxisProgressRow({ done, required, color }: { done: number; required: number; color: string }) {
  const slots = Math.max(required, done);
  const dots = [];
  for (let i = 0; i < slots; i++) {
    if (i < required) {
      dots.push(<ProgressDot key={i} filled={i < done} color={color} />);
    } else {
      dots.push(<ProgressDot key={i} filled overflow color={color} />);
    }
  }
  return <div className="maq-progress-row">{dots}</div>;
}

/* ─── Status Bullet + accessible label ───────────────── */

function StatusBullet({ state }: { state: ValidationState }) {
  const v = VALIDATION_STATES[state];
  return (
    <div className="maq-status-group">
      <span
        className="maq-status-bullet"
        aria-hidden="true"
        style={{ background: v.color }}
      >
        {v.icon === "check" && <span className="fr-icon-check-line" aria-hidden="true" style={{ fontSize: "0.75rem", color: "#fff" }} />}
        {v.icon === "clock" && <span className="fr-icon-time-line" aria-hidden="true" style={{ fontSize: "0.75rem", color: "#fff" }} />}
        {v.icon === "alert" && <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#fff" }}>!</span>}
        {v.icon === "close" && <span className="fr-icon-close-line" aria-hidden="true" style={{ fontSize: "0.75rem", color: "#fff" }} />}
      </span>
      <span className="maq-status-label" style={{ color: v.color }}>
        {v.shortLabel}
      </span>
    </div>
  );
}

/* ─── Validation Chip ─────────────────────────────────── */

function ValidationChip({ state }: { state: ValidationState }) {
  if (state === "validated") return null;
  const v = VALIDATION_STATES[state];
  return (
    <span className="maq-validation-chip" style={{ color: v.color, background: v.bg, borderColor: v.color }}>
      {v.label}
    </span>
  );
}

/* ─── Complement / Rejected alert block ──────────────── */

function ActionAlert({ action, onDeclare }: { action: ActionRealisee; onDeclare: () => void }) {
  if (action.validation === "complement") {
    return (
      <div className="maq-action-alert maq-action-alert--complement">
        <div className="maq-action-alert__header">
          <span className="fr-icon-error-line" aria-hidden="true" style={{ fontSize: "1rem" }} />
          <strong>Complement demande par le CNP</strong>
        </div>
        {action.complementMotif && (
          <p className="maq-action-alert__motif">{action.complementMotif}</p>
        )}
        <Button
          priority="secondary"
          size="small"
          iconId="fr-icon-edit-line"
          iconPosition="left"
          onClick={onDeclare}
        >
          Completer ma declaration
        </Button>
      </div>
    );
  }

  if (action.validation === "rejected") {
    return (
      <div className="maq-action-alert maq-action-alert--rejected">
        <div className="maq-action-alert__header">
          <span className="fr-icon-close-circle-line" aria-hidden="true" style={{ fontSize: "1rem" }} />
          <strong>Action refusee par le CNP</strong>
        </div>
        {action.rejectedMotif && (
          <p className="maq-action-alert__motif">{action.rejectedMotif}</p>
        )}
        <p className="maq-action-alert__note">
          Cette action ne compte pas dans votre progression.
        </p>
        <div style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
          <Button
            priority="secondary"
            size="small"
            iconId="fr-icon-add-line"
            iconPosition="left"
            onClick={onDeclare}
          >
            Declarer une action de remplacement
          </Button>
          <Button
            priority="tertiary no outline"
            size="small"
          >
            Contester ce refus
          </Button>
        </div>
      </div>
    );
  }

  return null;
}

/* ─── Action Row ─────────────────────────────────────── */

function ActionRow({ action, axeId, onDeclare, onOpenDetail }: { action: ActionRealisee; axeId: string; onDeclare: () => void; onOpenDetail: (a: ActionRealisee) => void }) {
  const sourceDef = SOURCES[action.source] || SOURCES.manual;
  const isAuto = sourceDef.auto;
  const validation = action.validation || "validated";
  const isRejected = validation === "rejected";
  const { color: axeColor, bgTint } = getAxeColor(axeId);

  return (
    <div className={`maq-action-row${isRejected ? " maq-action-row--rejected" : ""}`}>
      <StatusBullet state={validation} />
      <div className="maq-action-row__body">
        <div className="maq-action-row__chips">
          {action.themeId && (
            <span className="maq-theme-chip" style={{ background: bgTint, color: axeColor }}>
              {getThemeLabel(axeId, action.themeId)}
            </span>
          )}
          <ValidationChip state={validation} />
          <span className="maq-action-row__date">{action.date}</span>
        </div>

        <h4 className={`maq-action-row__title${isRejected ? " maq-action-row__title--rejected" : ""}`}>
          {action.title || action.libelle}
        </h4>

        <p className="maq-action-row__meta">
          {[action.org, action.duration, action.modality].filter(Boolean).join(" · ")}
        </p>

        <div className="maq-action-row__submeta">
          {action.triennat && (
            <span>
              <span className="fr-icon-calendar-line" aria-hidden="true" style={{ fontSize: "0.75rem", opacity: 0.6 }} />{" "}
              Rattachee au cycle {action.triennat}
            </span>
          )}
          {isAuto ? (
            <span>
              <span className="fr-icon-shield-line" aria-hidden="true" style={{ fontSize: "0.75rem", opacity: 0.6 }} />{" "}
              Transmis automatiquement par <strong>{sourceDef.label}</strong>
            </span>
          ) : action.attachment ? (
            <a className={fr.cx("fr-link", "fr-link--sm")} href="#" onClick={(e) => e.preventDefault()}>
              <span className="fr-icon-attachment-line" aria-hidden="true" style={{ fontSize: "0.75rem" }} />{" "}
              {action.attachment}
            </a>
          ) : (
            <span className="maq-action-row__missing-doc">
              <span className="fr-icon-error-line" aria-hidden="true" style={{ fontSize: "0.75rem" }} />
              Justificatif manquant
            </span>
          )}
        </div>

        <ActionAlert action={action} onDeclare={onDeclare} />

        <button
          type="button"
          className="maq-action-row__detail-btn"
          onClick={() => onOpenDetail(action)}
        >
          Details de cette action
          <span className="fr-icon-arrow-right-s-line" aria-hidden="true" style={{ fontSize: "0.75rem" }} />
        </button>
      </div>
    </div>
  );
}

/* ─── Empty Action Row ─────────────────────────────────── */

function EmptyActionRow({ onDeclare }: { onDeclare: () => void }) {
  return (
    <div className="maq-action-row maq-action-row--empty">
      <span className="maq-status-bullet maq-status-bullet--empty" />
      <div className="maq-action-row__body">
        <p className="maq-action-row__empty-text">En attente d'une nouvelle action</p>
        <a
          className={fr.cx("fr-link", "fr-link--sm")}
          href="#"
          onClick={(e) => { e.preventDefault(); onDeclare(); }}
        >
          + Declarer une nouvelle action
        </a>
      </div>
    </div>
  );
}

/* ─── Suggestion Card ──────────────────────────────────── */

function SuggestionCard({ sug, axeId }: { sug: FormationSuggestion; axeId: string }) {
  const { color: axeColor, bgTint } = getAxeColor(axeId);
  return (
    <article className="maq-sug-card">
      <div className="maq-sug-card__top">
        {sug.themes[0] && (
          <span className="maq-theme-chip" style={{ background: bgTint, color: axeColor }}>
            {getThemeLabel(axeId, sug.themes[0])}
          </span>
        )}
        <span className="maq-sug-card__code">{sug.id}</span>
      </div>
      <h4 className="maq-sug-card__title">{sug.titre}</h4>
      {sug.organisme && <p className="maq-sug-card__org">{sug.organisme}</p>}
      <div className="maq-sug-card__meta">
        {sug.duree && (
          <span>
            <span className="fr-icon-time-line" aria-hidden="true" style={{ fontSize: "0.75rem", opacity: 0.7 }} />
            {sug.duree}
          </span>
        )}
        {sug.modalite && (
          <span>
            <span className="fr-icon-road-map-line" aria-hidden="true" style={{ fontSize: "0.75rem", opacity: 0.7 }} />
            {sug.modalite}
          </span>
        )}
        <span>{getActionTypeLabel(sug.typeAction)}</span>
      </div>
    </article>
  );
}

/* ─── AxeDetailTabs — Tabbed variant page ──────────────── */

type TabValue = "actions" | "recommandations";

export function AxeDetailTabs() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const axe = id ? getAxeById(id) : undefined;

  const savedThemes = loadSelectedThemes();
  const axeThemeIds = savedThemes && id ? savedThemes[id] || [] : [];
  const [activeFilters, setActiveFilters] = useState<string[]>(axeThemeIds);
  const [drawerAction, setDrawerAction] = useState<ActionRealisee | null>(null);
  const [activeTab, setActiveTab] = useState<TabValue>("actions");

  const openDrawer = useCallback((a: ActionRealisee) => setDrawerAction(a), []);
  const closeDrawer = useCallback(() => setDrawerAction(null), []);

  if (!axe || !id) {
    return <Navigate to="/maquette/tableau-de-bord" replace />;
  }

  const axeNum = axe.id.split("-")[1];
  const actions = loadActions();
  const axeActions = getActionsForAxe(id, actions);
  const count = axeActions.length;
  const remaining = Math.max(0, axe.min_actions - count);
  const isComplete = count >= axe.min_actions;
  const { color, bgTint } = getAxeColor(id);
  const progressColor = isComplete ? "var(--success-425-625)" : color;

  // Suggestions with filters
  const filteredFormations = getFormationsForAxeAndThemes(id, activeFilters);
  const allFormations = formationsMock.filter((f) => f.axeId === id);
  const displayFormations = filteredFormations.length > 0 ? filteredFormations : allFormations;

  const toggleFilter = (tid: string) => {
    setActiveFilters((f) => f.includes(tid) ? f.filter((x) => x !== tid) : [...f, tid]);
  };

  const onDeclare = () => navigate(`/maquette/declarer?axe=${id}`);

  return (
    <div style={{ background: "var(--background-default-grey)", minHeight: "100vh" }}>
      {/* ═══ Full-bleed colored header band ══════════════════ */}
      <section className="maq-axe-band" style={{ background: bgTint, borderBottomColor: color + "22" }}>
        <div className={fr.cx("fr-container")} style={{ padding: "1.25rem 0 2.25rem" }}>
          <Breadcrumb
            currentPageLabel={`Axe ${axeNum} (variante tabs)`}
            homeLinkProps={{ to: "/maquette" }}
            segments={[
              { label: "Tableau de bord", linkProps: { to: "/maquette/tableau-de-bord" } },
            ]}
          />

          <div className="maq-axe-band__grid">
            <div>
              <span className="maq-axe-band__chip">AXE {axeNum}</span>

              <div className="maq-axe-band__progress">
                <AxisProgressRow done={count} required={axe.min_actions} color={progressColor} />
                <span className="maq-axe-band__count">{count} sur {axe.min_actions}</span>
              </div>

              <h1 className="maq-axe-band__title" style={{ color }}>{axe.label_court}</h1>
              <p className="maq-axe-band__desc">{axe.label_ps}</p>
            </div>

            <div className="maq-axe-band__actions">
              <Button
                priority="secondary"
                iconId="fr-icon-external-link-line"
                iconPosition="left"
                size="small"
              >
                Consulter le CNP
              </Button>
              <Button
                priority="primary"
                iconId="fr-icon-add-line"
                iconPosition="left"
                size="small"
                onClick={onDeclare}
              >
                Declarer une action
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══ Single-column tabbed content ═══════════════════ */}
      <div className={fr.cx("fr-container")} style={{ paddingTop: "2rem", paddingBottom: "3rem", maxWidth: "52rem" }}>

        {/* ─── DSFR Segmented Control ──────────────────────── */}
        <fieldset className="fr-segmented fr-segmented--no-legend" style={{ marginBottom: "2rem" }}>
          <legend className="fr-segmented__legend">Vue</legend>
          <div className="fr-segmented__elements">
            <div className="fr-segmented__element">
              <input
                type="radio"
                id="seg-actions"
                name="axe-view"
                value="actions"
                checked={activeTab === "actions"}
                onChange={() => setActiveTab("actions")}
              />
              <label className="fr-label" htmlFor="seg-actions">
                Actions declarees ({axeActions.length})
              </label>
            </div>
            <div className="fr-segmented__element">
              <input
                type="radio"
                id="seg-reco"
                name="axe-view"
                value="recommandations"
                checked={activeTab === "recommandations"}
                onChange={() => setActiveTab("recommandations")}
              />
              <label className="fr-label" htmlFor="seg-reco">
                Recommandations ({displayFormations.length})
              </label>
            </div>
          </div>
        </fieldset>

        {/* ─── Tab: Actions declarees ──────────────────────── */}
        {activeTab === "actions" && (
          <section>
            <h2 className={fr.cx("fr-h4", "fr-mb-1v")}>
              Actions declaree{axeActions.length > 1 ? "s" : ""}
            </h2>
            <p className={fr.cx("fr-text--sm", "fr-mb-3w")} style={{ color: "var(--text-mention-grey)" }}>
              {axeActions.length === 0
                ? "Votre premier pas commence ici. Choisissez une formation dans les recommandations, ou declarez une action deja realisee."
                : `Sur les ${axe.min_actions} actions minimum requises pour cet axe.`}
            </p>

            {axeActions.map((a) => (
              <ActionRow key={a.id} action={a} axeId={id} onDeclare={onDeclare} onOpenDetail={openDrawer} />
            ))}

            {Array.from({ length: remaining }).map((_, i) => (
              <EmptyActionRow key={`empty-${i}`} onDeclare={onDeclare} />
            ))}

            {isComplete && axeActions.length > 0 && (
              <div className="maq-axe-bravo">
                <strong>Bravo !</strong> Vous avez valide les exigences de cet axe.
                {count > axe.min_actions && <> Les actions supplementaires sont conservees et valorisees dans votre dossier.</>}
              </div>
            )}

            {/* Nudge towards recommendations when no actions yet */}
            {axeActions.length === 0 && (
              <div style={{ marginTop: "1.5rem", padding: "1rem 1.25rem", background: "var(--background-action-low-blue-france)", borderLeft: "3px solid var(--border-action-high-blue-france)" }}>
                <p className={fr.cx("fr-text--sm", "fr-mb-1v")} style={{ fontWeight: 600 }}>
                  {displayFormations.length} recommandation{displayFormations.length > 1 ? "s" : ""} disponible{displayFormations.length > 1 ? "s" : ""} pour cet axe
                </p>
                <button
                  type="button"
                  className="maq-action-row__detail-btn"
                  onClick={() => setActiveTab("recommandations")}
                  style={{ marginTop: "0.25rem" }}
                >
                  Voir les recommandations
                  <span className="fr-icon-arrow-right-s-line" aria-hidden="true" style={{ fontSize: "0.75rem" }} />
                </button>
              </div>
            )}
          </section>
        )}

        {/* ─── Tab: Recommandations ────────────────────────── */}
        {activeTab === "recommandations" && (
          <section>
            <h2 className={fr.cx("fr-h4", "fr-mb-3w")}>Actions recommandees</h2>

            {/* Filter pills */}
            <div className="maq-axe-filters">
              {axe.themes.map((t) => {
                const active = activeFilters.includes(t.id);
                return (
                  <button
                    key={t.id}
                    type="button"
                    className={`maq-axe-filter-pill${active ? " maq-axe-filter-pill--active" : ""}`}
                    style={active ? { background: color, borderColor: color, color: "#fff" } : {}}
                    onClick={() => toggleFilter(t.id)}
                  >
                    {t.label}
                  </button>
                );
              })}
            </div>

            {/* Suggestion cards — full-width grid */}
            <div className="maq-sug-list maq-sug-list--tabs">
              {displayFormations.slice(0, 6).map((s) => (
                <SuggestionCard key={s.id} sug={s} axeId={id} />
              ))}
            </div>

            {/* Full referentiel button */}
            <div style={{ marginTop: "1.25rem" }}>
              <Button
                priority="secondary"
                iconId="fr-icon-external-link-line"
                iconPosition="left"
                style={{ width: "100%", justifyContent: "center" }}
                linkProps={{ to: `/maquette/axe/${id}/referentiel` }}
              >
                Consulter tout le referentiel ({axe.actions_count} actions)
              </Button>
            </div>
          </section>
        )}

        {/* ═══ Retour ══════════════════════════════════════ */}
        <div className={fr.cx("fr-mt-6w")}>
          <div style={{ display: "flex", gap: "1rem", alignItems: "center", flexWrap: "wrap" }}>
            <Button
              priority="tertiary"
              iconId="fr-icon-arrow-left-line"
              iconPosition="left"
              linkProps={{ to: "/maquette/tableau-de-bord" }}
            >
              Retour au tableau de bord
            </Button>
            <span className={fr.cx("fr-text--sm")} style={{ color: "var(--text-mention-grey)" }}>
              |
            </span>
            <Button
              priority="tertiary no outline"
              size="small"
              linkProps={{ to: `/maquette/axe/${id}` }}
            >
              Voir la version deux colonnes
            </Button>
          </div>
        </div>
      </div>

      {/* ═══ Action detail drawer ════════════════════════════ */}
      <ActionDrawer
        action={drawerAction}
        axeId={id}
        onClose={closeDrawer}
        onDeclare={onDeclare}
        onNavigateRef={(code) =>
          navigate(`/maquette/axe/${id}/referentiel#${code}`)
        }
      />
    </div>
  );
}
