import { useState, useEffect, useRef } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import {
  referentiel,
  profileMock,
  loadSelectedThemes,
  saveSelectedThemes,
} from "../../data/maquette";
import "./maquette.css";

type Step = "profil" | "themes";

export function Onboarding() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const focusAxe = searchParams.get("focus");

  // If coming from "Modifier" (focus param or already has themes), skip profil step
  const isEditMode = !!focusAxe || loadSelectedThemes() !== null;
  const [step, setStep] = useState<Step>(isEditMode ? "themes" : "profil");

  const [selected, setSelected] = useState<Record<string, string[]>>(
    () => {
      const saved = loadSelectedThemes();
      if (saved) return saved;
      const init: Record<string, string[]> = {};
      referentiel.axes.forEach((axe) => {
        init[axe.id] = [];
      });
      return init;
    }
  );

  const axeRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (focusAxe && axeRefs.current[focusAxe]) {
      axeRefs.current[focusAxe]?.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
    }
  }, [focusAxe]);

  function toggleTheme(axeId: string, themeId: string) {
    setSelected((prev) => {
      const current = prev[axeId] || [];
      const next = current.includes(themeId)
        ? current.filter((t) => t !== themeId)
        : [...current, themeId];
      return { ...prev, [axeId]: next };
    });
  }

  const validAxes = referentiel.axes.filter(
    (axe) => (selected[axe.id] || []).length >= 1
  );
  const isValid = validAxes.length === referentiel.axes.length;
  const totalSelected = Object.values(selected).reduce(
    (sum, arr) => sum + arr.length,
    0
  );

  const missingAxes = referentiel.axes
    .filter((axe) => (selected[axe.id] || []).length === 0)
    .map((axe) => `Axe ${axe.id.split("-")[1]}`);

  function handleSubmit() {
    saveSelectedThemes(selected);
    navigate("/maquette/tableau-de-bord");
  }

  // ─── Edit mode: simplified layout (no activation wrapper) ──
  if (isEditMode) {
    return (
      <div className={fr.cx("fr-container", "fr-my-6w")}>
        <h1 className={fr.cx("fr-mb-4w")}>Vos themes preferentiels</h1>
        <ThemesContent
          selected={selected}
          toggleTheme={toggleTheme}
          validAxes={validAxes}
          isValid={isValid}
          totalSelected={totalSelected}
          missingAxes={missingAxes}
          axeRefs={axeRefs}
          onSubmit={handleSubmit}
          footer={
            <div className="maq-onboarding__footer">
              <span className={fr.cx("fr-text--sm")}>
                Vous pourrez modifier vos themes a tout moment.
              </span>
              <Button
                priority="primary"
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                onClick={handleSubmit}
                disabled={!isValid}
              >
                Valider et acceder a mon tableau de bord
              </Button>
            </div>
          }
        />
      </div>
    );
  }

  // ─── First-time activation: DSFR "creation de compte" layout ──
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      {/* h1 + chapo au-dessus du bloc gris (pattern DSFR) */}
      <h1 className={fr.cx("fr-mb-2w")}>
        Activation de votre espace
      </h1>
      <p className={`${fr.cx("fr-text--lg", "fr-mb-5w")} fr-text-mention--grey`}>
        Bienvenue sur Ma Certif' Pro Sante. Verifiez vos informations
        puis personnalisez votre tableau de bord.
      </p>

      {/* Bloc gris centre (pattern DSFR formulaire multi-etapes) */}
      <div className="maq-activation-box">
        <Stepper
          currentStep={step === "profil" ? 1 : 2}
          stepCount={2}
          title={
            step === "profil"
              ? "Verification du profil"
              : "Vos themes preferentiels"
          }
          nextTitle={
            step === "profil"
              ? "Vos themes preferentiels"
              : undefined
          }
        />

        {/* ═══ ETAPE 1 — Verification du profil ══════════ */}
        {step === "profil" && (
          <>
            <h2 className={fr.cx("fr-h5", "fr-mb-2w")}>
              Vos informations professionnelles
            </h2>
            <p className={`${fr.cx("fr-text--sm", "fr-mb-3w")} fr-text-mention--grey`}>
              Ces informations proviennent de votre carte CPS / e-CPS.
              Si elles sont incorrectes, contactez votre ordre professionnel.
            </p>

            <div className="maq-profil-card">
              <div className="maq-profil-card__row">
                <span className="maq-profil-card__label">Nom</span>
                <span className="maq-profil-card__value">
                  {profileMock.prenom} {profileMock.nom}
                </span>
              </div>
              <div className="maq-profil-card__row">
                <span className="maq-profil-card__label">Profession</span>
                <span className="maq-profil-card__value">
                  {profileMock.specialite}
                </span>
              </div>
              <div className="maq-profil-card__row">
                <span className="maq-profil-card__label">N° RPPS</span>
                <span className="maq-profil-card__value">
                  {profileMock.rpps}
                </span>
              </div>
              <div className="maq-profil-card__row">
                <span className="maq-profil-card__label">
                  Cycle de certification
                </span>
                <span className="maq-profil-card__value">
                  {profileMock.debutCycle} — {profileMock.finCycle}
                  {" "}({profileMock.cycleDureeAns} ans)
                </span>
              </div>
            </div>

            <div className="maq-activation-box__actions">
              <Button
                priority="primary"
                iconId="fr-icon-arrow-right-line"
                iconPosition="right"
                onClick={() => setStep("themes")}
              >
                C'est bien moi, continuer
              </Button>
            </div>
          </>
        )}

        {/* ═══ ETAPE 2 — Themes preferentiels ════════════ */}
        {step === "themes" && (
          <ThemesContent
            selected={selected}
            toggleTheme={toggleTheme}
            validAxes={validAxes}
            isValid={isValid}
            totalSelected={totalSelected}
            missingAxes={missingAxes}
            axeRefs={axeRefs}
            onSubmit={handleSubmit}
            footer={
              <div className="maq-activation-box__actions maq-activation-box__actions--between">
                <Button
                  priority="tertiary"
                  onClick={() => setStep("profil")}
                >
                  Precedent
                </Button>
                <Button
                  priority="primary"
                  iconId="fr-icon-arrow-right-line"
                  iconPosition="right"
                  onClick={handleSubmit}
                  disabled={!isValid}
                >
                  Valider
                </Button>
              </div>
            }
          />
        )}
      </div>
    </div>
  );
}

/* ─── Themes content (shared between edit and activation modes) ── */

function ThemesContent({
  selected,
  toggleTheme,
  validAxes,
  isValid,
  totalSelected,
  missingAxes,
  axeRefs,
  onSubmit: _onSubmit,
  footer,
}: {
  selected: Record<string, string[]>;
  toggleTheme: (axeId: string, themeId: string) => void;
  validAxes: typeof referentiel.axes;
  isValid: boolean;
  totalSelected: number;
  missingAxes: string[];
  axeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  onSubmit: () => void;
  footer: React.ReactNode;
}) {
  return (
    <>
      <p className={fr.cx("fr-text--lead", "fr-mb-1w")}>
        Qu'est-ce qui vous interesse dans votre pratique ?
      </p>
      <p className={fr.cx("fr-text--sm", "fr-mb-3w")}>
        Selectionnez au moins un theme par axe. Cela personnalise votre
        tableau de bord et nous permet de vous suggerer des actions
        pertinentes tout au long de votre cycle de certification.
      </p>

      <CallOut className={fr.cx("fr-mb-4w")}>
        <p className={fr.cx("fr-text--bold", "fr-mb-1w")}>
          Pourquoi choisir vos themes ?
        </p>
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
            <p className={fr.cx("fr-text--sm", "fr-mb-1v")}>
              <strong>Sans vos themes</strong>
            </p>
            <p className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}>
              Vous voyez les {referentiel.actions_totales} actions
              du referentiel — difficile de s'y retrouver.
            </p>
          </div>
          <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
            <p className={fr.cx("fr-text--sm", "fr-mb-1v")}>
              <strong>Avec vos themes</strong>
            </p>
            <p className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}>
              Nous vous proposons les actions qui correspondent
              a votre pratique quotidienne.
            </p>
          </div>
        </div>
      </CallOut>

      <div className="maq-onboarding__counter">
        <span className="fr-icon-check-line" aria-hidden="true" />
        <strong>
          {validAxes.length} / {referentiel.axes.length}
        </strong>{" "}
        axes renseignes — {totalSelected} theme
        {totalSelected > 1 ? "s" : ""} selectionne
        {totalSelected > 1 ? "s" : ""}
      </div>

      {referentiel.axes.map((axe) => {
        const axeSelected = selected[axe.id] || [];
        const axeNum = axe.id.split("-")[1];
        const isAxeValid = axeSelected.length >= 1;
        const themeCount = axe.themes.length;

        return (
          <div
            key={axe.id}
            className={`maq-onboarding__axe${
              isAxeValid ? " maq-onboarding__axe--valid" : ""
            }`}
            ref={(el) => {
              axeRefs.current[axe.id] = el;
            }}
          >
            <div className="maq-onboarding__axe-header">
              <div>
                <p className="maq-onboarding__axe-num">
                  Axe {axeNum} — {themeCount} themes disponibles
                </p>
                <p className="maq-onboarding__axe-title">
                  {axe.label_court}
                </p>
              </div>
              {isAxeValid && (
                <span className="maq-onboarding__axe-check">
                  <span
                    className="fr-icon-check-line"
                    aria-hidden="true"
                  />
                  {axeSelected.length} theme
                  {axeSelected.length > 1 ? "s" : ""}
                </span>
              )}
            </div>
            <p className={fr.cx("fr-text--sm", "fr-mb-1v")}>
              {axe.label_officiel}
            </p>
            <p className="maq-onboarding__axe-desc">{axe.label_ps}</p>
            <div className="maq-onboarding__tags">
              {axe.themes.map((theme) => {
                const isSel = axeSelected.includes(theme.id);
                return (
                  <button
                    key={theme.id}
                    type="button"
                    className={`maq-onboarding__tag${
                      isSel ? " maq-onboarding__tag--selected" : ""
                    }`}
                    onClick={() => toggleTheme(axe.id, theme.id)}
                    title={theme.description}
                    aria-pressed={isSel}
                  >
                    {isSel && (
                      <span
                        className="fr-icon-check-line maq-onboarding__tag-icon"
                        aria-hidden="true"
                      />
                    )}
                    {theme.label}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}

      {!isValid && (
        <p className="maq-onboarding__hint">
          <span className="fr-icon-error-line" aria-hidden="true" />{" "}
          Selectionnez au moins 1 theme par axe
          {missingAxes.length > 0 && (
            <> — il manque : {missingAxes.join(", ")}</>
          )}
        </p>
      )}

      {footer}
    </>
  );
}
