import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import {
  referentiel,
  profileMock,
  loadActions,
  getActionsForAxe,
  getTempsRestant,
  getCycleProgress,
} from "../../data/maquette";
import "./maquette.css";

export function Synthese() {
  const actions = loadActions();
  const tempsRestant = getTempsRestant().text;
  const cycleProgress = getCycleProgress();

  const totalActions = actions.length;
  const axesCoveredCount = referentiel.axes.filter(
    (axe) =>
      getActionsForAxe(axe.id, actions).length >= axe.min_actions
  ).length;
  const totalAxes = referentiel.axes.length;

  const today = new Date();
  const dateStr = today.toLocaleDateString("fr-FR", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  function getAxeStatus(
    axe: (typeof referentiel.axes)[0]
  ): { label: string; severity: "success" | "warning" | "info" } {
    const count = getActionsForAxe(axe.id, actions).length;
    if (count >= axe.min_actions) {
      return { label: "Couvert", severity: "success" };
    }
    if (count > 0) {
      return { label: "En cours", severity: "warning" };
    }
    return { label: "Non commence", severity: "info" };
  }

  return (
    <div className={`${fr.cx("fr-container", "fr-my-6w")} maq-synthese`}>
      <Breadcrumb
        currentPageLabel="Ma synthese"
        homeLinkProps={{ to: "/maquette" }}
        segments={[
          {
            label: "Tableau de bord",
            linkProps: { to: "/maquette/tableau-de-bord" },
          },
        ]}
      />

      {/* ─── Header ─────────────────────────────────────── */}
      <div className="maq-synthese__header">
        <h1 className={fr.cx("fr-mb-0")}>
          Ma synthese de certification
        </h1>
        <Button
          priority="secondary"
          iconId="fr-icon-printer-line"
          iconPosition="left"
          onClick={() => window.print()}
        >
          Imprimer
        </Button>
      </div>

      {/* ─── Profil ─────────────────────────────────────── */}
      <div className="maq-synthese__profile">
        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
          <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
            <p className={fr.cx("fr-text--lg", "fr-mb-1v")}>
              <strong>
                {profileMock.prenom} {profileMock.nom}
              </strong>
            </p>
            <p className={`${fr.cx("fr-text--sm", "fr-mb-1v")} fr-text-mention--grey`}>
              {profileMock.specialite}
            </p>
            <p className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}>
              RPPS : {profileMock.rpps}
            </p>
          </div>
          <div className={fr.cx("fr-col-12", "fr-col-md-6")}>
            <p className={`${fr.cx("fr-text--sm", "fr-mb-1v")} fr-text-mention--grey`}>
              Cycle de certification
            </p>
            <p className={fr.cx("fr-text--sm", "fr-mb-1v")}>
              <strong>
                {profileMock.debutCycle} — {profileMock.finCycle}
              </strong>
            </p>
            <p className={`${fr.cx("fr-text--sm", "fr-mb-0")} fr-text-mention--grey`}>
              Temps restant : {tempsRestant}
            </p>
          </div>
        </div>
      </div>

      {/* ─── Progression globale ────────────────────────── */}
      <div className="maq-synthese__progress">
        <h2 className={fr.cx("fr-h4", "fr-mb-2w")}>
          Progression globale
        </h2>
        <p className={fr.cx("fr-text--sm", "fr-mb-2w")}>
          <strong>{totalActions} / {referentiel.min_total}</strong> actions
          {" "}&middot;{" "}
          <strong>{axesCoveredCount} / {totalAxes}</strong> axes couverts
        </p>
        <div className="maq-progress__track" style={{ height: "6px" }}>
          <div
            className="maq-progress__fill"
            style={{
              width: `${Math.round(cycleProgress * 100)}%`,
            }}
          />
        </div>
        <p className={`${fr.cx("fr-text--xs", "fr-mt-1v")} fr-text-mention--grey`}>
          Avancement du cycle : {Math.round(cycleProgress * 100)} %
        </p>
      </div>

      {/* ─── Detail par axe ─────────────────────────────── */}
      {referentiel.axes.map((axe) => {
        const axeNum = axe.id.split("-")[1];
        const axeActions = getActionsForAxe(axe.id, actions);
        const status = getAxeStatus(axe);

        return (
          <div key={axe.id} className="maq-synthese__axe">
            <div className="maq-synthese__axe-header">
              <div>
                <p className={`${fr.cx("fr-text--xs", "fr-mb-1v")} fr-text-mention--grey`}>
                  Axe {axeNum}
                </p>
                <p className={fr.cx("fr-text--lg", "fr-mb-0")}>
                  <strong>{axe.label_court}</strong>
                </p>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
                <span className={fr.cx("fr-text--sm")}>
                  {axeActions.length} / {axe.min_actions} actions
                </span>
                <Badge severity={status.severity}>{status.label}</Badge>
              </div>
            </div>

            {axeActions.length > 0 ? (
              <ul className="maq-synthese__action-list">
                {axeActions.map((action) => (
                  <li key={action.id} className="maq-synthese__action">
                    <span className="maq-synthese__action-libelle">
                      {action.libelle}
                    </span>
                    <span className={`${fr.cx("fr-text--xs")} fr-text-mention--grey`}>
                      {action.date} &middot; {action.type}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <p className={`${fr.cx("fr-text--sm")} fr-text-mention--grey`}
                style={{ fontStyle: "italic" }}
              >
                Aucune action declaree
              </p>
            )}
          </div>
        );
      })}

      {/* ─── Footer ─────────────────────────────────────── */}
      <div className="maq-synthese__footer">
        <p className={`${fr.cx("fr-text--sm")} fr-text-mention--grey`}>
          Document genere le {dateStr} — Ma Certif' Pro Sante
        </p>
        <Button
          priority="secondary"
          linkProps={{ to: "/maquette/tableau-de-bord" }}
        >
          Retour au tableau de bord
        </Button>
      </div>
    </div>
  );
}
