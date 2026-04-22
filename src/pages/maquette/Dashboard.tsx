import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
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
  getAxeColor,
  getThemeLabel,
  type AxeRef,
  type ActionRealisee,
  type FormationSuggestion,
} from "../../data/maquette";
import "./maquette.css";

/* ─── Progress Dot ────────────────────────────────────── */

function ProgressDot({ filled, overflow, color }: { filled: boolean; overflow?: boolean; color: string }) {
  const size = 18;
  if (overflow) {
    return (
      <span
        className="maq-progress-dot maq-progress-dot--overflow"
        style={{ width: size, height: size, background: color, borderColor: color }}
      >
        +
      </span>
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

/* ─── Global Ring (donut) ─────────────────────────────── */

function GlobalRing({ done, total }: { done: number; total: number }) {
  const size = 176;
  const stroke = 14;
  const r = (size - stroke) / 2;
  const c = 2 * Math.PI * r;
  const pct = Math.min(done / total, 1);
  return (
    <div className="maq-global-ring" style={{ width: size, height: size }}>
      <svg width={size} height={size}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grey-950-100)" strokeWidth={stroke} />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={r}
          fill="none"
          stroke="var(--blue-france-sun-113-625)"
          strokeWidth={stroke}
          strokeDasharray={`${c * pct} ${c * (1 - pct)}`}
          strokeDashoffset={c / 4}
          strokeLinecap="butt"
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          style={{ transition: "stroke-dasharray 0.6s ease" }}
        />
      </svg>
      <div className="maq-global-ring__center">
        <span className="maq-global-ring__number">
          {done}<span className="maq-global-ring__total">/{total}</span>
        </span>
        <span className="maq-global-ring__label">actions declarees</span>
      </div>
    </div>
  );
}

/* ─── AxeCard ─────────────────────────────────────────── */

function AxeCard({
  axe,
  actions,
  themes,
  suggestion,
  onClick,
}: {
  axe: AxeRef;
  actions: ActionRealisee[];
  themes: { id: string; label: string }[];
  suggestion: FormationSuggestion | null;
  onClick: () => void;
}) {
  const axeNum = axe.id.split("-")[1];
  const count = actions.length;
  const isComplete = count >= axe.min_actions;
  const isOverflow = count > axe.min_actions;
  const { color, bgTint } = getAxeColor(axe.id);
  const progressColor = isComplete ? "var(--success-425-625)" : color;

  const status = count === 0
    ? "notstarted"
    : isOverflow
    ? "overflow"
    : isComplete
    ? "complete"
    : "inprogress";

  const complementCount = actions.filter(a => a.validation === "complement").length;
  const rejectedCount = actions.filter(a => a.validation === "rejected").length;
  const hasAlert = complementCount > 0 || rejectedCount > 0;

  return (
    <article
      className={`maq-card2${isComplete ? " maq-card2--complete" : ""}`}
      onClick={onClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => { if (e.key === "Enter") onClick(); }}
    >
      {/* Accent bar */}
      <div className="maq-card2__accent" style={{ background: color }} />

      {/* Top: axe badge + title */}
      <div className="maq-card2__top">
        <span
          className="maq-card2__num"
          style={{ background: bgTint, color, borderColor: color }}
        >
          {axeNum}
        </span>
        <div className="maq-card2__title-group">
          <span className="maq-card2__axe-label" style={{ color }}>
            Axe {axeNum}
          </span>
          <h3 className="maq-card2__title">{axe.label_court}</h3>
        </div>
      </div>

      {/* Progress + status */}
      <div className="maq-card2__progress">
        <AxisProgressRow done={count} required={axe.min_actions} color={progressColor} />
        <span className={`maq-card2__status${isComplete ? " maq-card2__status--success" : ""}`}>
          {status === "notstarted" && <>Non commence · 0/{axe.min_actions} actions</>}
          {status === "inprogress" && <>En cours · {count}/{axe.min_actions} actions</>}
          {status === "complete" && (
            <><span className="fr-icon-check-line" aria-hidden="true" style={{ fontSize: "0.875rem" }} /> Axe couvert — {count} actions</>
          )}
          {status === "overflow" && (
            <><span className="fr-icon-check-line" aria-hidden="true" style={{ fontSize: "0.875rem" }} /> Axe couvert — {count} actions (+{count - axe.min_actions})</>
          )}
        </span>
      </div>

      {/* Urgency alert */}
      {hasAlert && (
        <div className="maq-card2__alert">
          <span className="fr-icon-error-line" aria-hidden="true" style={{ fontSize: "0.75rem" }} />
          <span>
            {complementCount > 0 && `${complementCount} action${complementCount > 1 ? "s" : ""} a completer`}
            {complementCount > 0 && rejectedCount > 0 && " · "}
            {rejectedCount > 0 && `${rejectedCount} refusee${rejectedCount > 1 ? "s" : ""}`}
          </span>
        </div>
      )}

      {/* Theme tags */}
      {themes.length > 0 && (
        <div className="maq-card2__themes">
          {themes.slice(0, 3).map((t) => (
            <span key={t.id} className="maq-card2__theme" style={{ background: bgTint, color }}>
              {t.label}
            </span>
          ))}
          {themes.length > 3 && (
            <span className="maq-card2__theme-more">+{themes.length - 3}</span>
          )}
        </div>
      )}

      {/* Nudge / suggestion */}
      <div className="maq-card2__nudge">
        {isComplete ? (
          <span className="maq-card2__link">
            Voir mes actions declarees
            <span className="fr-icon-arrow-right-s-line" aria-hidden="true" />
          </span>
        ) : suggestion ? (
          <>
            <p className="maq-card2__nudge-label">Action recommandee</p>
            <span className="maq-card2__link">
              {suggestion.titre}
              <span className="fr-icon-arrow-right-s-line" aria-hidden="true" />
            </span>
          </>
        ) : (
          <span className="maq-card2__link">
            Explorer l'axe
            <span className="fr-icon-arrow-right-s-line" aria-hidden="true" />
          </span>
        )}
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
  const totalRequired = referentiel.min_total;
  const tempsRestant = getTempsRestant();

  const axesCovered = referentiel.axes.filter(
    (axe) => getActionsForAxe(axe.id, actions).length >= axe.min_actions
  ).length;

  // Celebration
  const [celebratedAxes, setCelebratedAxes] = useState<AxeRef[]>([]);
  useEffect(() => {
    const newAxes = getNewlyCoveredAxes(actions);
    if (newAxes.length > 0) {
      setCelebratedAxes(newAxes);
      markAxesCelebrated(newAxes.map((a) => a.id));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Check if all 4 axes covered for success link
  const allCovered = axesCovered === referentiel.axes.length;

  return (
    <>
      {/* ═══ Header perso ════════════════════════════════════ */}
      <div className="maq-dash-header-band">
        <div className={fr.cx("fr-container")}>
          <Breadcrumb
            currentPageLabel="Tableau de bord"
            homeLinkProps={{ to: "/maquette" }}
            segments={[]}
          />

          <div className="maq-dash-header">
            <div className="maq-dash-header__left">
              <p className={fr.cx("fr-text--sm", "fr-mb-1v")} style={{ color: "var(--text-mention-grey)" }}>
                Espace professionnel · {profileMock.specialite}
              </p>
              <h1 className={fr.cx("fr-mb-3w")}>
                Bonjour, {profileMock.prenom}
              </h1>

              {/* Countdown */}
              <div className="maq-dash-countdown">
                <span className="fr-icon-timer-line" aria-hidden="true" />
                <span>
                  Echeance de votre cycle :{" "}
                  <strong>{tempsRestant.text}</strong>
                  <span style={{ color: "var(--text-mention-grey)", marginLeft: "0.5rem" }}>
                    · {profileMock.finCycle}
                  </span>
                </span>
              </div>

              <div className={fr.cx("fr-mt-4w")} style={{ display: "flex", gap: "0.75rem", flexWrap: "wrap" }}>
                <Button
                  priority="primary"
                  iconId="fr-icon-add-line"
                  iconPosition="left"
                  onClick={() => navigate("/maquette/declarer")}
                >
                  Declarer une action
                </Button>
                <Button
                  priority="secondary"
                  onClick={() => navigate("/maquette/axe/axe-1/referentiel")}
                >
                  Voir mon referentiel
                </Button>
              </div>
            </div>

            <GlobalRing done={totalActions} total={totalRequired} />
          </div>
        </div>
      </div>

      <div className={fr.cx("fr-container", "fr-pb-6w")}>
        {/* ═══ Celebration ════════════════════════════════════ */}
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

        {/* ═══ Section: 4 cartes axes ════════════════════════ */}
        <div className="maq-section-header" style={{ marginTop: "2rem" }}>
          <h2 className={fr.cx("fr-h4", "fr-mb-0")}>Mes 4 axes de certification</h2>
          <p className={fr.cx("fr-text--sm", "fr-mb-0")} style={{ color: "var(--text-mention-grey)" }}>
            Minimum <strong>2 actions par axe</strong> sur le cycle
          </p>
        </div>

        <div className="maq-grid" style={{ marginBottom: "2rem" }}>
          {referentiel.axes.map((axe) => {
            const axeActions = getActionsForAxe(axe.id, actions);
            const themeIds = savedThemes && savedThemes[axe.id] ? savedThemes[axe.id] : [];
            const themes = axe.themes.filter((t) => themeIds.includes(t.id));
            const formations = getFormationsForAxeAndThemes(axe.id, themeIds);
            const suggestion = formations[0] || null;

            return (
              <AxeCard
                key={axe.id}
                axe={axe}
                actions={axeActions}
                themes={themes}
                suggestion={suggestion}
                onClick={() => navigate(`/maquette/axe/${axe.id}`)}
              />
            );
          })}
        </div>

        {/* ═══ Recommandations ════════════════════════════════ */}
        <div className="maq-reco-section">
          <div className="maq-section-header">
            <h2 className={fr.cx("fr-h4", "fr-mb-0")}>Recommandations pour vous</h2>
            <a
              className={fr.cx("fr-link")}
              href="/maquette/axe/axe-1/referentiel"
              onClick={(e) => { e.preventDefault(); navigate("/maquette/axe/axe-1/referentiel"); }}
            >
              Tout le referentiel
              <span className="fr-icon-arrow-right-s-line" aria-hidden="true" style={{ fontSize: "0.75rem", marginLeft: "0.25rem" }} />
            </a>
          </div>
          <p className={fr.cx("fr-text--sm", "fr-mb-3w")} style={{ color: "var(--text-mention-grey)" }}>
            Basees sur les themes que vous avez choisis lors de votre inscription.
          </p>

          <div className="maq-reco-grid">
            {(() => {
              // Pick one suggestion per uncovered axis, up to 3
              const recos: { sug: FormationSuggestion; axe: AxeRef }[] = [];
              for (const axe of referentiel.axes) {
                if (recos.length >= 3) break;
                const themeIds = savedThemes && savedThemes[axe.id] ? savedThemes[axe.id] : [];
                const formations = getFormationsForAxeAndThemes(axe.id, themeIds);
                if (formations.length > 0) {
                  recos.push({ sug: formations[0], axe });
                }
              }
              return recos.map(({ sug, axe }, i) => {
                const { color, bgTint } = getAxeColor(axe.id);
                const axeNum = axe.id.split("-")[1];
                return (
                  <article
                    key={i}
                    className="maq-reco-card"
                    onClick={() => navigate(`/maquette/axe/${axe.id}`)}
                  >
                    <div className="maq-reco-card__top">
                      <span className="maq-reco-card__axe" style={{ background: bgTint, color }}>
                        Axe {axeNum}
                      </span>
                      {sug.themes[0] && (
                        <span className="maq-reco-card__theme">
                          · {getThemeLabel(axe.id, sug.themes[0])}
                        </span>
                      )}
                    </div>
                    <h4 className="maq-reco-card__title">{sug.titre}</h4>
                    <p className="maq-reco-card__org">{sug.organisme}</p>
                    <div className="maq-reco-card__meta">
                      {sug.duree && (
                        <span>
                          <span className="fr-icon-time-line" aria-hidden="true" style={{ fontSize: "0.75rem", opacity: 0.6 }} />
                          {sug.duree}
                        </span>
                      )}
                      {sug.modalite && <span>· {sug.modalite}</span>}
                    </div>
                  </article>
                );
              });
            })()}
          </div>
        </div>

        {/* ═══ Demo link to success screen ═══════════════════ */}
        {allCovered && (
          <div className={fr.cx("fr-mt-4w")}>
            <Alert
              severity="success"
              title="Tous les axes sont couverts"
              description="Felicitations ! Consultez votre synthese de certification."
              className={fr.cx("fr-mb-2w")}
            />
            <Button
              priority="secondary"
              linkProps={{ to: "/maquette/succes" }}
            >
              Voir l'ecran de succes
            </Button>
          </div>
        )}
      </div>
    </>
  );
}
