import { useEffect, useRef } from "react";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Download } from "@codegouvfr/react-dsfr/Download";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import {
  SOURCES,
  VALIDATION_STATES,
  getAxeColor,
  getThemeLabel,
  getActionTypeLabel,
  formationsMock,
  type ActionRealisee,
  type ValidationState,
  type FormationSuggestion,
} from "../../data/maquette";
import "./maquette.css";

/* ─── Drawer component ───────────────────────────────── */

export function ActionDrawer({
  action,
  axeId,
  onClose,
  onDeclare,
  allActions,
  onNavigate,
}: {
  action: ActionRealisee | null;
  axeId: string;
  onClose: () => void;
  onDeclare: () => void;
  allActions?: ActionRealisee[];
  onNavigate?: (a: ActionRealisee) => void;
}) {
  const drawerRef = useRef<HTMLDivElement>(null);

  // Close on Escape
  useEffect(() => {
    if (!action) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [action, onClose]);

  // Trap focus / lock body scroll
  useEffect(() => {
    if (action) {
      document.body.style.overflow = "hidden";
      // Focus the drawer on open
      drawerRef.current?.focus();
    } else {
      document.body.style.overflow = "";
    }
    return () => { document.body.style.overflow = ""; };
  }, [action]);

  if (!action) return null;

  const sourceDef = SOURCES[action.source] || SOURCES.manual;
  const isAuto = sourceDef.auto;
  const validation: ValidationState = action.validation || "validated";
  const v = VALIDATION_STATES[validation];
  const { color: axeColor, bgTint } = getAxeColor(axeId);

  // Navigation
  const currentIdx = allActions ? allActions.findIndex(a => a.id === action.id) : -1;
  const prevAction = allActions && currentIdx > 0 ? allActions[currentIdx - 1] : null;
  const nextAction = allActions && currentIdx >= 0 && currentIdx < (allActions.length - 1) ? allActions[currentIdx + 1] : null;

  // Related suggestions for nudge
  const relatedSuggestions: FormationSuggestion[] = action.themeId
    ? formationsMock.filter(f => f.axeId === axeId && f.themes.includes(action.themeId!)).slice(0, 2)
    : [];

  return (
    <>
      {/* Overlay */}
      <div className="maq-drawer-overlay" onClick={onClose} />

      {/* Drawer panel */}
      <aside
        ref={drawerRef}
        className="maq-drawer"
        role="dialog"
        aria-modal="true"
        aria-label="Detail de l'action"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="maq-drawer__header">
          {allActions && allActions.length > 1 && onNavigate && (
            <div className="maq-drawer__nav">
              <button
                type="button"
                className="maq-drawer__nav-btn"
                disabled={!prevAction}
                onClick={() => prevAction && onNavigate(prevAction)}
                aria-label="Action precedente"
              >
                <span className="fr-icon-arrow-up-s-line" aria-hidden="true" />
              </button>
              <button
                type="button"
                className="maq-drawer__nav-btn"
                disabled={!nextAction}
                onClick={() => nextAction && onNavigate(nextAction)}
                aria-label="Action suivante"
              >
                <span className="fr-icon-arrow-down-s-line" aria-hidden="true" />
              </button>
            </div>
          )}
          <button
            className="maq-drawer__close"
            onClick={onClose}
            aria-label="Fermer"
            type="button"
          >
            <span className="fr-icon-close-line" aria-hidden="true" />
          </button>
        </div>

        {/* Status banner */}
        <div className="maq-drawer__status" style={{ background: v.bg, borderLeftColor: v.color }}>
          <span className="maq-drawer__status-dot" style={{ background: v.color }}>
            {v.icon === "check" && <span className="fr-icon-check-line" aria-hidden="true" style={{ fontSize: "0.75rem", color: "#fff" }} />}
            {v.icon === "clock" && <span className="fr-icon-time-line" aria-hidden="true" style={{ fontSize: "0.75rem", color: "#fff" }} />}
            {v.icon === "alert" && <span style={{ fontWeight: 700, fontSize: "0.875rem", color: "#fff" }}>!</span>}
            {v.icon === "close" && <span className="fr-icon-close-line" aria-hidden="true" style={{ fontSize: "0.75rem", color: "#fff" }} />}
          </span>
          <div>
            <span className="maq-drawer__status-label" style={{ color: v.color }}>
              {v.label}
            </span>
            <span className="maq-drawer__status-date">{action.date}</span>
          </div>
        </div>

        {/* Chips row */}
        <div className="maq-drawer__chips">
          {action.themeId && (
            <span className="maq-theme-chip" style={{ background: bgTint, color: axeColor }}>
              {getThemeLabel(axeId, action.themeId)}
            </span>
          )}
        </div>

        {/* Title */}
        <h2 className="maq-drawer__title">
          {action.title || action.libelle}
        </h2>

        {/* ─── Informations ──────────────────────────────── */}
        <div className="maq-drawer__section">
          <h3 className="maq-drawer__section-title">Informations</h3>
          <dl className="maq-drawer__dl">
            {action.org && (
              <>
                <dt>Organisme</dt>
                <dd>{action.org}</dd>
              </>
            )}
            {action.duration && (
              <>
                <dt>Duree</dt>
                <dd>{action.duration}</dd>
              </>
            )}
            {action.modality && (
              <>
                <dt>Modalite</dt>
                <dd>{action.modality}</dd>
              </>
            )}
            <dt>Type</dt>
            <dd>{action.type}</dd>
            {action.code && (
              <>
                <dt>Code referentiel</dt>
                <dd style={{ fontFamily: "var(--font-mono, monospace)", fontSize: "0.8125rem" }}>
                  {action.code}
                </dd>
              </>
            )}
            {action.triennat && (
              <>
                <dt>Cycle</dt>
                <dd>{action.triennat}</dd>
              </>
            )}
            <dt>Source</dt>
            <dd>
              {isAuto
                ? `${sourceDef.fullName} (${sourceDef.label})`
                : "Declaration manuelle"}
            </dd>
          </dl>
        </div>

        {/* ─── Justificatif ──────────────────────────────── */}
        <div className="maq-drawer__section">
          <h3 className="maq-drawer__section-title">Justificatif</h3>

          {isAuto ? (
            <>
              <Tag small iconId="fr-icon-shield-line" className={fr.cx("fr-mb-2w")}>
                Transmis par {sourceDef.label}
              </Tag>
              <Download
                label="Telecharger l'attestation"
                details={<>attestation-{action.source}-{action.date?.slice(-4)}.pdf<br />PDF &mdash; 61,88 Ko</>}
                linkProps={{ href: "#", onClick: (e) => e.preventDefault() }}
              />
            </>
          ) : validation === "complement" ? (
            <div className="maq-drawer__justif maq-drawer__justif--complement">
              <span className="fr-icon-error-line" aria-hidden="true" style={{ fontSize: "1rem", color: "var(--text-default-warning)" }} />
              <div>
                {action.complementMotif && (
                  <p className={fr.cx("fr-text--sm", "fr-mb-2w")} style={{ fontStyle: "italic" }}>
                    {action.complementMotif}
                  </p>
                )}
                {action.attachment && (
                  <p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
                    Document actuel :{" "}
                    <a className={fr.cx("fr-link", "fr-link--sm")} href="#" onClick={(e) => e.preventDefault()}>
                      {action.attachment}
                    </a>
                  </p>
                )}
                <Button
                  priority="secondary"
                  size="small"
                  iconId="fr-icon-upload-line"
                  iconPosition="left"
                >
                  Envoyer un nouveau justificatif
                </Button>
              </div>
            </div>
          ) : validation === "rejected" ? (
            <div className="maq-drawer__justif maq-drawer__justif--rejected">
              <span className="fr-icon-close-circle-line" aria-hidden="true" style={{ fontSize: "1rem", color: "var(--text-default-error)" }} />
              <div>
                <p className={fr.cx("fr-text--sm", "fr-mb-1v")} style={{ textDecoration: "line-through", color: "var(--text-mention-grey)" }}>
                  {action.attachment || "Aucun justificatif"}
                </p>
                <p className={fr.cx("fr-text--xs", "fr-mb-0")} style={{ color: "var(--text-mention-grey)" }}>
                  Cette action a ete refusee. Le justificatif n'est plus pris en compte.
                </p>
              </div>
            </div>
          ) : action.attachment ? (
            <Download
              label="Telecharger l'attestation"
              details={<>{action.attachment}<br />PDF &mdash; 61,88 Ko</>}
              linkProps={{ href: "#", onClick: (e) => e.preventDefault() }}
            />
          ) : (
            <div className="maq-drawer__justif maq-drawer__justif--missing">
              <span className="fr-icon-error-line" aria-hidden="true" style={{ fontSize: "1rem", color: "var(--text-default-error)" }} />
              <div>
                <p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
                  <strong>Aucun justificatif joint.</strong> Un document est recommande pour acceler la validation.
                </p>
                <Button
                  priority="secondary"
                  size="small"
                  iconId="fr-icon-upload-line"
                  iconPosition="left"
                >
                  Ajouter un justificatif
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* ─── Historique ────────────────────────────────── */}
        {action.historique && action.historique.length > 0 && (
          <div className="maq-drawer__section">
            <h3 className="maq-drawer__section-title">Historique</h3>
            <ol className="maq-drawer__timeline">
              {action.historique.map((h, i) => {
                const isLast = i === action.historique!.length - 1;
                return (
                  <li key={i} className={`maq-drawer__timeline-item${isLast ? " maq-drawer__timeline-item--last" : ""}`}>
                    <span className="maq-drawer__timeline-dot" style={isLast ? { background: v.color } : {}} />
                    <span className="maq-drawer__timeline-date">{h.date}</span>
                    <span className="maq-drawer__timeline-label">{h.label}</span>
                  </li>
                );
              })}
            </ol>
          </div>
        )}

        {/* ─── Complement / Rejected alert ───────────────── */}
        {validation === "complement" && action.complementMotif && (
          <div className="maq-drawer__alert maq-drawer__alert--complement">
            <span className="fr-icon-error-line" aria-hidden="true" />
            <div>
              <strong>Action requise</strong>
              <p className={fr.cx("fr-text--sm", "fr-mb-0")}>{action.complementMotif}</p>
            </div>
          </div>
        )}

        {validation === "rejected" && action.rejectedMotif && (
          <div className="maq-drawer__alert maq-drawer__alert--rejected">
            <span className="fr-icon-close-circle-line" aria-hidden="true" />
            <div>
              <strong>Motif du refus</strong>
              <p className={fr.cx("fr-text--sm", "fr-mb-1v")}>{action.rejectedMotif}</p>
              <p className={fr.cx("fr-text--xs", "fr-mb-0")} style={{ color: "var(--text-mention-grey)" }}>
                Cette action ne compte pas dans votre progression.
              </p>
            </div>
          </div>
        )}

        {/* ─── Suggestion nudge ──────────────────────────── */}
        {relatedSuggestions.length > 0 && (
          <div className="maq-drawer__nudge">
            <h3 className="maq-drawer__nudge-title">Actions similaires recommandees</h3>
            {relatedSuggestions.map(sug => (
              <article key={sug.id} className="maq-drawer__nudge-card" style={{ marginBottom: "0.5rem" }}>
                {sug.themes[0] && (
                  <span className="maq-theme-chip" style={{ background: bgTint, color: axeColor, marginBottom: "0.5rem", display: "inline-block" }}>
                    {getThemeLabel(axeId, sug.themes[0])}
                  </span>
                )}
                <p className="maq-drawer__nudge-card__title">{sug.titre}</p>
                {sug.organisme && <p className="maq-drawer__nudge-card__org">{sug.organisme}</p>}
                <div className="maq-drawer__nudge-card__meta">
                  {sug.duree && (
                    <span>
                      <span className="fr-icon-time-line" aria-hidden="true" style={{ fontSize: "0.625rem" }} />
                      {sug.duree}
                    </span>
                  )}
                  {sug.modalite && (
                    <span>
                      <span className="fr-icon-road-map-line" aria-hidden="true" style={{ fontSize: "0.625rem" }} />
                      {sug.modalite}
                    </span>
                  )}
                  <span>{getActionTypeLabel(sug.typeAction)}</span>
                </div>
              </article>
            ))}
          </div>
        )}

        {/* ─── Footer actions ────────────────────────────── */}
        <div className="maq-drawer__footer">
          {validation === "complement" && (
            <Button
              priority="primary"
              iconId="fr-icon-edit-line"
              iconPosition="left"
              onClick={onDeclare}
            >
              Completer ma declaration
            </Button>
          )}
          {validation === "rejected" && (
            <>
              <Button
                priority="primary"
                iconId="fr-icon-add-line"
                iconPosition="left"
                onClick={onDeclare}
              >
                Declarer une action de remplacement
              </Button>
              <Button priority="tertiary">
                Contester ce refus
              </Button>
            </>
          )}
          {validation === "pending" && (
            <div className="maq-drawer__pending-note">
              <span className="fr-icon-time-line" aria-hidden="true" style={{ fontSize: "1rem", color: "var(--text-default-warning)" }} />
              <p className={fr.cx("fr-text--sm", "fr-mb-0")}>
                Le Conseil National Professionnel examine votre declaration.
                Delai moyen de traitement : 4 a 6 semaines.
              </p>
            </div>
          )}
          {validation === "validated" && !isAuto && (
            <Button
              priority="tertiary no outline"
              size="small"
              iconId="fr-icon-edit-line"
              iconPosition="left"
            >
              Modifier cette action
            </Button>
          )}
        </div>
      </aside>
    </>
  );
}
