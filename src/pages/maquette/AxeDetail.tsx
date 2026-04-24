import { useState, useCallback, useEffect } from "react";
import { useParams, Navigate, useNavigate, useSearchParams } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { ActionDrawer } from "./ActionDrawer";
// Badge not needed in this version
import {
  getAxeById,
  loadActions,
  getActionsForAxe,
  loadSelectedThemes,
  getThemeLabel,
  getAxeColor,
  SOURCES,
  VALIDATION_STATES,
  type ActionRealisee,
  type ActionRef,
  type ValidationState,
  saveAxeFilters,
  loadAxeFilters,
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
      {/* P0 Accessibility: visible text label next to the bullet */}
      <span className="maq-status-label" style={{ color: v.color }}>
        {v.shortLabel}
      </span>
    </div>
  );
}

/* ─── Validation Chip (shown only for non-validated) ─── */

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

function ActionRow({
  action,
  axeId,
  refLookup,
  onDeclare,
  onOpenDetail,
  onNavigateRef,
}: {
  action: ActionRealisee;
  axeId: string;
  refLookup: (code: string) => ActionRef | undefined;
  onDeclare: () => void;
  onOpenDetail: (a: ActionRealisee) => void;
  onNavigateRef: (code: string) => void;
}) {
  const sourceDef = SOURCES[action.source] || SOURCES.manual;
  const isAuto = sourceDef.auto;
  const validation = action.validation || "validated";
  const isRejected = validation === "rejected";
  const { color: axeColor, bgTint } = getAxeColor(axeId);
  const refEntry = action.code ? refLookup(action.code) : undefined;

  return (
    <div className={`maq-action-row${isRejected ? " maq-action-row--rejected" : ""}`}>
      <StatusBullet state={validation} />
      <div className="maq-action-row__body">
        {/* Line 1: theme + auto chip + validation chip + date */}
        <div className="maq-action-row__chips">
          {action.themeId && (
            <span className="maq-theme-chip" style={{ background: bgTint, color: axeColor }}>
              {getThemeLabel(axeId, action.themeId)}
            </span>
          )}
          <ValidationChip state={validation} />
          <span className="maq-action-row__date">{action.date}</span>
        </div>

        {/* Title */}
        <h4 className={`maq-action-row__title${isRejected ? " maq-action-row__title--rejected" : ""}`}>
          {action.title || action.libelle}
        </h4>

        {/* Rattachement referentiel */}
        {refEntry && (
          <button
            type="button"
            className="maq-action-row__ref-link"
            onClick={() => onNavigateRef(refEntry.code)}
            aria-label={`Voir l'entree ${refEntry.code} dans le referentiel`}
          >
            <span aria-hidden="true" className="maq-action-row__ref-arrow">↳</span>
            <span className="maq-action-row__ref-code">{refEntry.code}</span>
            <span className="maq-action-row__ref-sep">—</span>
            <span className="maq-action-row__ref-libelle">{refEntry.libelle}</span>
          </button>
        )}

        {/* Meta: org · duration · modality */}
        <p className="maq-action-row__meta">
          {[action.org, action.duration, action.modality].filter(Boolean).join(" · ")}
        </p>

        {/* Sub-meta: triennat + attachment */}
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

        {/* P0: Complement motif + CTA / Rejected motif + CTA */}
        <ActionAlert action={action} onDeclare={onDeclare} />

        {/* Detail link */}
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

/* ─── Empty Action Row ───────��───────────────────────── */

function EmptyActionRow({ remaining, onDeclare }: { remaining: number; onDeclare: () => void }) {
  return (
    <div className="maq-action-row maq-action-row--empty">
      <span className="maq-status-bullet maq-status-bullet--empty" aria-hidden="true" />
      <div className="maq-action-row__body">
        <p className="maq-action-row__empty-text">
          {remaining} action{remaining > 1 ? "s" : ""} restante{remaining > 1 ? "s" : ""} pour cet axe
        </p>
        <a
          className={fr.cx("fr-link", "fr-link--sm")}
          href="#"
          onClick={(e) => { e.preventDefault(); onDeclare(); }}
        >
          + Declarer une action
        </a>
      </div>
    </div>
  );
}

/* ─── Referentiel Extract Card ────────────────────────── */

function ReferentielExtractCard({
  action,
  axeId,
  declared,
  onDeclare,
}: {
  action: ActionRef;
  axeId: string;
  declared: boolean;
  onDeclare: () => void;
}) {
  const { color: axeColor, bgTint } = getAxeColor(axeId);
  return (
    <article className="maq-sug-card">
      <div className="maq-sug-card__top">
        {action.themeId && (
          <span className="maq-theme-chip" style={{ background: bgTint, color: axeColor }}>
            {getThemeLabel(axeId, action.themeId)}
          </span>
        )}
        <span className="maq-sug-card__code">{action.code}</span>
      </div>
      <h4 className="maq-sug-card__title">{action.libelle}</h4>
      <div className="maq-sug-card__footer">
        {declared ? (
          <Button
            priority="tertiary no outline"
            size="small"
            iconId="fr-icon-check-line"
            iconPosition="left"
            disabled
          >
            Deja declaree
          </Button>
        ) : (
          <Button
            priority="secondary"
            size="small"
            iconId="fr-icon-add-line"
            iconPosition="left"
            onClick={onDeclare}
          >
            Declarer au titre de cette entree
          </Button>
        )}
      </div>
    </article>
  );
}

/* ─── AxeDetail page ────��────────────────────────────── */

export function AxeDetail() {
  const { id } = useParams<{ id: string }>();
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const axe = id ? getAxeById(id) : undefined;

  const savedThemes = loadSelectedThemes();
  const axeThemeIds = savedThemes && id ? savedThemes[id] || [] : [];
  const savedAxeFilters = id ? loadAxeFilters(id) : [];
  const [activeFilters, setActiveFilters] = useState<string[]>(
    savedAxeFilters.length > 0 ? savedAxeFilters : axeThemeIds
  );
  const [drawerAction, setDrawerAction] = useState<ActionRealisee | null>(null);
  const [mobileTab, setMobileTab] = useState<"actions" | "recommandations">("actions");
  const [statusFilter, setStatusFilter] = useState<ValidationState | "all">("all");

  const openDrawer = useCallback((a: ActionRealisee) => setDrawerAction(a), []);
  const closeDrawer = useCallback(() => setDrawerAction(null), []);

  // Persist theme filters
  useEffect(() => {
    if (id) saveAxeFilters(id, activeFilters);
  }, [id, activeFilters]);

  // Auto-open drawer from ?action=... query param
  useEffect(() => {
    if (!id) return;
    const actionId = searchParams.get("action");
    if (!actionId) return;
    const match = getActionsForAxe(id, loadActions()).find((a) => a.id === actionId);
    if (match) {
      setDrawerAction(match);
      const next = new URLSearchParams(searchParams);
      next.delete("action");
      setSearchParams(next, { replace: true });
    }
  }, [id, searchParams, setSearchParams]);

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

  // Extrait du referentiel filtre par themes preferentiels
  const declaredCodes = new Set(axeActions.map((a) => a.code).filter(Boolean));
  const referentielFiltered =
    activeFilters.length > 0
      ? axe.actions.filter((a) => a.themeId && activeFilters.includes(a.themeId))
      : axe.actions;
  const seenCodes = new Set<string>();
  const displayReferentiel = referentielFiltered
    .filter((a) => {
      if (seenCodes.has(a.code)) return false;
      seenCodes.add(a.code);
      return true;
    })
    .slice(0, 3);

  // Status filter
  const statusCounts = axeActions.reduce((acc, a) => {
    acc[a.validation] = (acc[a.validation] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);
  const availableStatuses = Object.keys(statusCounts) as ValidationState[];
  const showStatusFilter = availableStatuses.length > 1;
  const filteredByStatus = statusFilter === "all"
    ? axeActions
    : axeActions.filter(a => a.validation === statusFilter);

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
            currentPageLabel={`Axe ${axeNum}`}
            homeLinkProps={{ to: "/maquette" }}
            segments={[
              { label: "Tableau de bord", linkProps: { to: "/maquette/tableau-de-bord" } },
            ]}
          />

          <div className="maq-axe-band__grid">
            <div>
              {/* AXE N chip */}
              <span className="maq-axe-band__chip">AXE {axeNum}</span>

              {/* Progress dots + "N sur N" */}
              <div className="maq-axe-band__progress">
                <AxisProgressRow done={count} required={axe.min_actions} color={progressColor} />
                <span className="maq-axe-band__count">{count} sur {axe.min_actions}</span>
              </div>

              {/* Title */}
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

      {/* ═══ Two-column content ══════════════════════════════ */}
      <div className={fr.cx("fr-container")} style={{ paddingTop: "2.5rem", paddingBottom: "3rem" }}>

        {/* Mobile-only segmented control */}
        <fieldset className="maq-axe-segmented fr-segmented fr-segmented--no-legend">
          <legend className="fr-segmented__legend">Vue</legend>
          <div className="fr-segmented__elements">
            <div className="fr-segmented__element">
              <input
                type="radio"
                id="seg-actions"
                name="axe-mobile-view"
                value="actions"
                checked={mobileTab === "actions"}
                onChange={() => setMobileTab("actions")}
              />
              <label className="fr-label" htmlFor="seg-actions">
                Actions ({axeActions.length})
              </label>
            </div>
            <div className="fr-segmented__element">
              <input
                type="radio"
                id="seg-reco"
                name="axe-mobile-view"
                value="recommandations"
                checked={mobileTab === "recommandations"}
                onChange={() => setMobileTab("recommandations")}
              />
              <label className="fr-label" htmlFor="seg-reco">
                Recommandations ({referentielFiltered.length})
              </label>
            </div>
          </div>
        </fieldset>

        <div className="maq-axe-columns" data-mobile-tab={mobileTab}>
          {/* ─── LEFT: Actions declarees ──────────────────── */}
          <section>
            <h2 className={fr.cx("fr-h4", "fr-mb-1v")}>
              Actions declaree{axeActions.length > 1 ? "s" : ""}
            </h2>
            <p className={fr.cx("fr-text--sm", "fr-mb-3w")} style={{ color: "var(--text-mention-grey)" }}>
              {axeActions.length === 0
                ? "Votre premier pas commence ici."
                : `Sur les ${axe.min_actions} actions minimum requises pour cet axe.`}
            </p>

            {/* Status filter pills */}
            {showStatusFilter && (
              <div className="maq-axe-status-filters">
                <button
                  type="button"
                  className={`maq-axe-filter-pill${statusFilter === "all" ? " maq-axe-filter-pill--active" : ""}`}
                  style={statusFilter === "all" ? { background: "var(--blue-france-sun-113-625)", borderColor: "var(--blue-france-sun-113-625)", color: "#fff" } : {}}
                  onClick={() => setStatusFilter("all")}
                >
                  Toutes ({axeActions.length})
                </button>
                {availableStatuses.map(s => {
                  const v = VALIDATION_STATES[s];
                  const isActive = statusFilter === s;
                  return (
                    <button
                      key={s}
                      type="button"
                      className={`maq-axe-filter-pill${isActive ? " maq-axe-filter-pill--active" : ""}`}
                      style={isActive ? { background: v.color, borderColor: v.color, color: "#fff" } : {}}
                      onClick={() => setStatusFilter(s)}
                    >
                      {v.shortLabel} ({statusCounts[s]})
                    </button>
                  );
                })}
              </div>
            )}

            {/* Empty state */}
            {axeActions.length === 0 && (
              <div className="maq-axe-empty">
                <span className="fr-icon-draft-line" aria-hidden="true" style={{ fontSize: "3rem", color: "var(--text-mention-grey)", display: "block", marginBottom: "1rem" }} />
                <h3 className={fr.cx("fr-h5", "fr-mb-1v")}>Cet axe attend sa premiere action</h3>
                <p className={fr.cx("fr-text--sm")} style={{ color: "var(--text-mention-grey)", maxWidth: "28rem", margin: "0.5rem auto 1.5rem" }}>
                  Consultez les recommandations pour trouver une action adaptee, ou declarez directement une action deja realisee.
                </p>
                <div style={{ display: "flex", gap: "0.75rem", justifyContent: "center", flexWrap: "wrap" }}>
                  <Button priority="primary" iconId="fr-icon-add-line" iconPosition="left" size="small" onClick={onDeclare}>
                    Declarer une action
                  </Button>
                </div>
              </div>
            )}

            {filteredByStatus.map((a) => (
              <ActionRow
                key={a.id}
                action={a}
                axeId={id}
                refLookup={(code) => axe.actions.find((ra) => ra.code === code)}
                onDeclare={onDeclare}
                onOpenDetail={openDrawer}
                onNavigateRef={(code) => navigate(`/maquette/axe/${id}/referentiel#${code}`)}
              />
            ))}

            {/* Empty slot (consolide) */}
            {statusFilter === "all" && remaining > 0 && (
              <EmptyActionRow remaining={remaining} onDeclare={onDeclare} />
            )}

            {/* Bravo message */}
            {isComplete && axeActions.length > 0 && statusFilter === "all" && (
              <div className="maq-axe-bravo">
                <strong>Bravo !</strong> Vous avez valide les exigences de cet axe.
                {count > axe.min_actions && <> Les actions supplementaires sont conservees et valorisees dans votre dossier.</>}
              </div>
            )}
          </section>

          {/* ─── RIGHT: Extrait du referentiel ─────────────── */}
          <section>
            <h2 className={fr.cx("fr-h4", "fr-mb-1v")}>Actions recommandees</h2>
            <p className={fr.cx("fr-text--sm", "fr-mb-3w")} style={{ color: "var(--text-mention-grey)" }}>
              Extrait du referentiel CNP, filtre par vos themes preferentiels.
            </p>

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

            {/* Referentiel extract cards */}
            <div className="maq-sug-list">
              {displayReferentiel.map((a) => (
                <ReferentielExtractCard
                  key={a.code}
                  action={a}
                  axeId={id}
                  declared={declaredCodes.has(a.code)}
                  onDeclare={() => navigate(`/maquette/declarer?axe=${id}&code=${a.code}`)}
                />
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
        </div>

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
              linkProps={{ to: `/maquette/axe-test/${id}` }}
            >
              Tester la variante tabs
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
        allActions={axeActions}
        onNavigate={openDrawer}
      />
    </div>
  );
}
