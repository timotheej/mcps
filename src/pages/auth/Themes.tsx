import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { Tag } from "@codegouvfr/react-dsfr/Tag";
import { referentiel, saveSelectedThemes } from "../../data/maquette";

export function Themes() {
  const navigate = useNavigate();

  const [selected, setSelected] = useState<Record<string, string[]>>(() => {
    const init: Record<string, string[]> = {};
    referentiel.axes.forEach((axe) => {
      init[axe.id] = [];
    });
    return init;
  });

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

  function handleSubmit(skip = false) {
    if (skip) {
      const empty: Record<string, string[]> = {};
      referentiel.axes.forEach((a) => (empty[a.id] = []));
      saveSelectedThemes(empty);
    } else {
      saveSelectedThemes(selected);
    }
    navigate("/maquette/tableau-de-bord");
  }

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1 className={fr.cx("fr-mb-5w")}>Activation de votre espace</h1>

      <div className="maq-activation-box">
        <Stepper currentStep={3} stepCount={3} title="Préférences" />

        <h2 className={fr.cx("fr-h5", "fr-mb-1w")}>
          Choisissez vos thèmes de prédilection
        </h2>
        <p
          className={`${fr.cx("fr-text--sm", "fr-mb-3w")} fr-text-mention--grey`}
        >
          Sélectionnez au moins un thème par axe. Cela permet à Ma Certif'
          Pro Santé de vous suggérer des actions pertinentes tout au long
          de votre cycle.
        </p>

        <div className="maq-themes-counter">
          <span className="fr-icon-check-line" aria-hidden="true" />
          <strong>
            {validAxes.length} / {referentiel.axes.length}
          </strong>
          <span>axes renseignés</span>
          <span className="maq-themes-counter__sep" aria-hidden="true">
            —
          </span>
          <span>
            {totalSelected} thème{totalSelected > 1 ? "s" : ""} sélectionné
            {totalSelected > 1 ? "s" : ""}
          </span>
        </div>

        {referentiel.axes.map((axe, idx) => {
          const axeSelected = selected[axe.id] || [];
          const isAxeValid = axeSelected.length >= 1;

          return (
            <section key={axe.id} className="maq-themes-axe">
              <div className="maq-themes-axe__header">
                <h3 className="maq-themes-axe__title">
                  Axe {idx + 1} — {axe.label_officiel}
                </h3>
                {isAxeValid ? (
                  <span className="maq-themes-axe__state maq-themes-axe__state--ok">
                    <span className="fr-icon-check-line" aria-hidden="true" />
                    {axeSelected.length} thème
                    {axeSelected.length > 1 ? "s" : ""}
                  </span>
                ) : (
                  <span className="maq-themes-axe__state maq-themes-axe__state--todo">
                    <span className="fr-icon-warning-line" aria-hidden="true" />
                    À sélectionner
                  </span>
                )}
              </div>
              <p className="maq-themes-axe__desc">{axe.label_ps}</p>

              <ul className={fr.cx("fr-tags-group")}>
                {axe.themes.map((theme) => {
                  const isSel = axeSelected.includes(theme.id);
                  return (
                    <Tag
                      key={theme.id}
                      pressed={isSel}
                      nativeButtonProps={{
                        type: "button",
                        onClick: () => toggleTheme(axe.id, theme.id),
                        title: theme.description,
                      }}
                    >
                      {theme.label}
                    </Tag>
                  );
                })}
              </ul>
            </section>
          );
        })}

        {!isValid && (
          <p className="maq-themes-hint" role="alert">
            <span className="fr-icon-error-line" aria-hidden="true" />
            Sélectionnez au moins un thème par axe — Il manque :{" "}
            {missingAxes.join(", ")}
          </p>
        )}

        <div className="maq-activation-box__actions maq-activation-box__actions--between">
          <Button
            priority="tertiary"
            onClick={() => navigate("/auth/onboarding/cgu")}
          >
            Étape précédente
          </Button>
          <div
            style={{
              display: "flex",
              gap: "0.75rem",
              flexWrap: "wrap",
              justifyContent: "flex-end",
            }}
          >
            <Button
              priority="tertiary"
              nativeButtonProps={{
                onClick: () => handleSubmit(true),
              }}
            >
              Passer cette étape
            </Button>
            <Button
              priority="primary"
              iconId="fr-icon-arrow-right-line"
              iconPosition="right"
              disabled={!isValid}
              onClick={() => handleSubmit(false)}
            >
              Accéder à mon tableau de bord
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
