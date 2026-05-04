import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Notice } from "@codegouvfr/react-dsfr/Notice";
import { DeclarationDrawer } from "./DeclarationDrawer";
import { MiniRing } from "../../components/MiniRing";
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
  getThemeLabel,
  getActionTypeLabel,
  actionsCompletMock,
  actionsDepassementMock,
  type AxeRef,
  type ActionRealisee,
  type FormationSuggestion,
} from "../../data/maquette";
import "./maquette.css";

export type DashboardState =
  | "default"
  | "vierge"
  | "complet"
  | "depassement"
  | "cycle-2";

/* ─── Helpers ──────────────────────────────────────────── */

const MOIS_FR = [
  "janvier", "février", "mars", "avril", "mai", "juin",
  "juillet", "août", "septembre", "octobre", "novembre", "décembre",
];

function formatDateLong(dateStr: string): string {
  const [d, m, y] = dateStr.split("/").map(Number);
  if (!d || !m || !y) return dateStr;
  return `${d} ${MOIS_FR[m - 1]} ${y}`;
}

function getActionsForState(state: DashboardState): ActionRealisee[] {
  switch (state) {
    case "vierge":
    case "cycle-2":
      return [];
    case "complet":
      return actionsCompletMock;
    case "depassement":
      return actionsDepassementMock;
    case "default":
    default:
      return loadActions();
  }
}

/* ─── Axe progress dot ────────────────────────────────── */

function AxeDot({ done }: { done: boolean }) {
  if (done) {
    return (
      <span className="maq-axe-dot maq-axe-dot--done" aria-hidden="true">
        <span className="fr-icon-check-line" />
      </span>
    );
  }
  return <span className="maq-axe-dot" aria-hidden="true" />;
}

/* ─── Axe card ─────────────────────────────────────────── */

function AxeCard({
  axe,
  actions,
  onClick,
}: {
  axe: AxeRef;
  actions: ActionRealisee[];
  onClick: () => void;
}) {
  const axeNum = axe.id.split("-")[1];
  const total = actions.length;
  const required = axe.min_actions;
  const done = Math.min(total, required);
  const overflow = Math.max(0, total - required);

  return (
    <article
      className="maq-axe-card"
      onClick={onClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div className="maq-axe-card__head">
        <span className="maq-axe-card__label">Axe {axeNum}</span>
        <div className="maq-axe-card__progress">
          <span className="maq-axe-card__progress-text">
            {overflow > 0
              ? `${total} actions (min. ${required})`
              : `${done} sur ${required}`}
          </span>
          <div className="maq-axe-card__dots">
            {Array.from({ length: required }).map((_, i) => (
              <AxeDot key={i} done={i < done} />
            ))}
          </div>
        </div>
      </div>
      <h3 className="maq-axe-card__title">{axe.label_court}</h3>
      <p className="maq-axe-card__desc">{axe.label_ps}.</p>
    </article>
  );
}

/* ─── Reco card ────────────────────────────────────────── */

function RecoCard({
  sug,
  axe,
  onClick,
}: {
  sug: FormationSuggestion;
  axe: AxeRef;
  onClick: () => void;
}) {
  const themeLabel = sug.themes[0] ? getThemeLabel(axe.id, sug.themes[0]) : null;
  const typeLabel = getActionTypeLabel(sug.typeAction);

  return (
    <article
      className="maq-reco-card"
      onClick={onClick}
      role="link"
      tabIndex={0}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onClick();
      }}
    >
      <div className="maq-reco-card__head">
        {themeLabel && (
          <span className="maq-reco-card__tag">{themeLabel.toUpperCase()}</span>
        )}
        <span className="maq-reco-card__ref">{sug.id}</span>
      </div>
      <h3 className="maq-reco-card__title">{sug.titre}</h3>
      <p className="maq-reco-card__type">{typeLabel}</p>
    </article>
  );
}

/* ─── Dashboard page ───────────────────────────────────── */

type DashboardProps = {
  mockState?: DashboardState;
};

export function Dashboard({ mockState = "default" }: DashboardProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [drawerOpen, setDrawerOpen] = useState<boolean>(searchParams.get("declarer") === "1");
  const [drawerPreAxe, setDrawerPreAxe] = useState<string | undefined>(
    searchParams.get("axe") || undefined
  );
  const [drawerPreCode, setDrawerPreCode] = useState<string | undefined>(
    searchParams.get("code") || undefined
  );

  function openDeclarer(preAxeId?: string, preCode?: string) {
    setDrawerPreAxe(preAxeId);
    setDrawerPreCode(preCode);
    setDrawerOpen(true);
  }

  function closeDeclarer() {
    setDrawerOpen(false);
    // Nettoyer les query params si présents
    if (
      searchParams.get("declarer") === "1" ||
      searchParams.get("axe") ||
      searchParams.get("code")
    ) {
      const next = new URLSearchParams(searchParams);
      next.delete("declarer");
      next.delete("axe");
      next.delete("code");
      setSearchParams(next, { replace: true });
    }
  }

  const actions = getActionsForState(mockState);
  const savedThemes = loadSelectedThemes();
  const totalActions = actions.length;
  const totalRequired = referentiel.min_total;
  const tempsRestant = getTempsRestant();
  const isCycle2 = mockState === "cycle-2";

  // Cycle-2 mock: cycle just started on 01/01/2032, ends 31/12/2037
  const cycleEndDate = isCycle2 ? "31/12/2037" : profileMock.finCycle;
  const cycleRemaining = isCycle2 ? "6 ans" : tempsRestant.text;

  const isCertified =
    referentiel.axes.every(
      (a) => getActionsForAxe(a.id, actions).length >= a.min_actions
    );
  const overflow = Math.max(0, totalActions - totalRequired);

  const [celebratedAxes, setCelebratedAxes] = useState<AxeRef[]>([]);
  useEffect(() => {
    if (mockState !== "default") return;
    const newAxes = getNewlyCoveredAxes(actions);
    if (newAxes.length > 0) {
      setCelebratedAxes(newAxes);
      markAxesCelebrated(newAxes.map((a) => a.id));
    }
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  // Build up to 3 reco cards (only if not certified)
  const recos: { sug: FormationSuggestion; axe: AxeRef }[] = [];
  if (!isCertified) {
    for (const axe of referentiel.axes) {
      if (recos.length >= 3) break;
      const themeIds =
        savedThemes && savedThemes[axe.id] ? savedThemes[axe.id] : [];
      const formations = getFormationsForAxeAndThemes(axe.id, themeIds);
      if (formations.length > 0) recos.push({ sug: formations[0], axe });
    }
  }

  const refTotal = referentiel.actions_totales;

  return (
    <>
      {/* ═══ Notice cycle 2 ════════════════════════════════ */}
      {isCycle2 && (
        <Notice
          severity="info"
          title="Cycle 2 · démarré le 1ᵉʳ janvier 2032"
          description="Votre nouveau cycle de certification a commencé. Vos thèmes préférentiels du cycle précédent ont été conservés."
          link={{
            linkProps: { to: "/maquette/synthese" } as never,
            text: "Consulter mon cycle précédent",
          }}
        />
      )}

      {/* ═══ Header band ═══════════════════════════════════ */}
      <div className="maq-dash-header-band">
        <div className={fr.cx("fr-container")}>
          <Breadcrumb
            currentPageLabel="Tableau de bord"
            homeLinkProps={{ to: "/" }}
            segments={[]}
          />

          <div className="maq-dash-header">
            <MiniRing
              done={totalActions}
              total={totalRequired}
              capped={isCertified}
              overflow={overflow}
            />

            <div className="maq-dash-header__text">
              <p className="maq-dash-header__role">{profileMock.specialite}</p>
              <h1 className="maq-dash-header__title">
                Bonjour, {profileMock.prenom}
              </h1>
              {isCertified ? (
                <p className="maq-dash-header__deadline">
                  <strong>Certification complète pour ce cycle</strong>
                  <span aria-hidden="true"> · </span>
                  Cycle en cours jusqu'au {formatDateLong(cycleEndDate)}
                </p>
              ) : (
                <p className="maq-dash-header__deadline">
                  Échéance de votre cycle :{" "}
                  <strong>{cycleRemaining}</strong>
                  <span aria-hidden="true"> · </span>
                  {formatDateLong(cycleEndDate)}
                </p>
              )}
            </div>

            <div className="maq-dash-header__cta">
              {isCertified ? (
                <div className="maq-dash-header__ctas">
                  <Button
                    priority="primary"
                    iconId="fr-icon-download-line"
                    iconPosition="left"
                    linkProps={{ to: "/maquette/synthese" }}
                  >
                    Télécharger ma synthèse
                  </Button>
                  <Button
                    priority="secondary"
                    iconId="fr-icon-add-line"
                    iconPosition="left"
                    onClick={() => openDeclarer()}
                  >
                    Déclarer une action
                  </Button>
                </div>
              ) : (
                <Button
                  priority="primary"
                  iconId="fr-icon-add-line"
                  iconPosition="left"
                  onClick={() => openDeclarer()}
                >
                  Déclarer une action
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className={fr.cx("fr-container", "fr-pb-6w")}>
        {/* ═══ Bandeau certification ═════════════════════════ */}
        {isCertified && (
          <div className="maq-cert-banner">
            <div className="maq-cert-banner__icon" aria-hidden="true">
              <span className="fr-icon-check-line" />
            </div>
            <div className="maq-cert-banner__body">
              <h2 className="maq-cert-banner__title">
                Votre certification périodique est complète pour ce cycle.
              </h2>
              <p className="maq-cert-banner__sub">
                Votre Ordre sera informé de la complétion de votre parcours.
              </p>
              <a
                className={fr.cx("fr-link")}
                href="/maquette/synthese"
                onClick={(e) => {
                  e.preventDefault();
                  navigate("/maquette/synthese");
                }}
              >
                <span
                  className="fr-icon-download-line"
                  aria-hidden="true"
                  style={{ fontSize: "0.875rem", marginRight: "0.375rem" }}
                />
                Télécharger ma synthèse PDF
              </a>
            </div>
          </div>
        )}

        {celebratedAxes.length > 0 && !isCertified && (
          <Alert
            severity="success"
            title="Bravo !"
            description={
              celebratedAxes.length === 1
                ? `Vous avez complété l'axe ${celebratedAxes[0].id.split("-")[1]}.`
                : `Vous avez complété les axes ${celebratedAxes
                    .map((a) => a.id.split("-")[1])
                    .join(", ")}.`
            }
            className={fr.cx("fr-mt-4w")}
            closable
          />
        )}

        {/* ═══ Section: Votre parcours ═════════════════════ */}
        <h2 className={fr.cx("fr-h4", "fr-mt-5w", "fr-mb-3w")}>
          Votre parcours
        </h2>

        <div className="maq-axe-grid">
          {referentiel.axes.map((axe) => (
            <AxeCard
              key={axe.id}
              axe={axe}
              actions={getActionsForAxe(axe.id, actions)}
              onClick={() => navigate(`/maquette/axe/${axe.id}`)}
            />
          ))}
        </div>

        {/* ═══ Section conditionnelle ════════════════════════ */}
        {isCertified ? (
          <>
            <h2 className={fr.cx("fr-h4", "fr-mt-6w", "fr-mb-3w")}>
              Récapitulatif de votre cycle
            </h2>
            <div className="maq-summary">
              <p className="maq-summary__intro">
                <strong>{totalActions} actions</strong> réalisées sur{" "}
                {referentiel.axes.length} axes
                {overflow > 0 && (
                  <>
                    {" "}
                    <span className="maq-summary__overflow">
                      ({overflow > 0 ? `+${overflow} au-delà du minimum` : ""})
                    </span>
                  </>
                )}
                .
              </p>
              <ul className="maq-summary__list">
                {referentiel.axes.map((axe) => {
                  const count = getActionsForAxe(axe.id, actions).length;
                  return (
                    <li key={axe.id} className="maq-summary__item">
                      <span className="maq-summary__axe">
                        Axe {axe.id.split("-")[1]} · {axe.label_court}
                      </span>
                      <span className="maq-summary__count">
                        {count} action{count > 1 ? "s" : ""}
                      </span>
                    </li>
                  );
                })}
              </ul>
            </div>
          </>
        ) : (
          <>
            <h2 className={fr.cx("fr-h4", "fr-mt-6w", "fr-mb-3w")}>
              Actions recommandées
            </h2>

            <div className="maq-reco-grid">
              {recos.map(({ sug, axe }) => (
                <RecoCard
                  key={sug.id}
                  sug={sug}
                  axe={axe}
                  onClick={() => navigate(`/maquette/axe/${axe.id}`)}
                />
              ))}
            </div>

            <div className={fr.cx("fr-mt-3w")}>
              <Button
                priority="secondary"
                iconId="fr-icon-external-link-line"
                iconPosition="left"
                linkProps={{ to: "/referentiel" }}
              >
                Consulter tout le référentiel ({refTotal} actions)
              </Button>
            </div>
          </>
        )}
      </div>

      <DeclarationDrawer
        open={drawerOpen}
        onClose={closeDeclarer}
        preAxeId={drawerPreAxe}
        preCode={drawerPreCode}
      />
    </>
  );
}
