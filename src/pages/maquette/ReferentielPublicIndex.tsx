import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";
import { referentiel, getAxeColor } from "../../data/maquette";
import "./maquette.css";

export function ReferentielPublicIndex() {
  const navigate = useNavigate();

  return (
    <div style={{ background: "var(--background-default-grey)", minHeight: "100vh" }}>
      <div className={fr.cx("fr-container", "fr-my-4w")}>
        <Breadcrumb
          currentPageLabel="Referentiel de certification"
          homeLinkProps={{ to: "/" }}
          segments={[]}
        />

        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mt-2w")}>
          <div className={fr.cx("fr-col-12", "fr-col-md-8")}>
            <h1 className={fr.cx("fr-h2", "fr-mb-2w")}>
              Referentiel de certification periodique
            </h1>
            <p className={fr.cx("fr-text--lead", "fr-mb-1w")}>
              {referentiel.label} — {referentiel.profession}
            </p>
            <p className={fr.cx("fr-text--sm")} style={{ color: "var(--text-mention-grey)" }}>
              {referentiel.actions_totales} actions reconnues, reparties en {referentiel.axes.length} axes. Cycle de {referentiel.cycle_duree_ans} ans.
            </p>
          </div>
        </div>

        <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters", "fr-mt-5w")}>
          {referentiel.axes.map((axe) => {
            const axeNum = axe.id.split("-")[1];
            const { color, bgTint } = getAxeColor(axe.id);
            return (
              <div
                key={axe.id}
                className={fr.cx("fr-col-12", "fr-col-md-6")}
              >
                <article
                  className="maq-ref-public-card"
                  style={{ borderTop: `3px solid ${color}` }}
                >
                  <div
                    className="maq-ref-public-card__chip"
                    style={{ background: bgTint, color }}
                  >
                    AXE {axeNum}
                  </div>
                  <h2 className="maq-ref-public-card__title">
                    {axe.label_court}
                  </h2>
                  <p className="maq-ref-public-card__desc">
                    {axe.actions_count} actions · {axe.themes.length} themes
                  </p>
                  <div className="maq-ref-public-card__footer">
                    <Button
                      priority="secondary"
                      iconId="fr-icon-arrow-right-line"
                      iconPosition="right"
                      size="small"
                      onClick={() => navigate(`/referentiel/${axe.id}`)}
                    >
                      Consulter l'axe {axeNum}
                    </Button>
                  </div>
                </article>
              </div>
            );
          })}
        </div>

        <div className={fr.cx("fr-mt-5w", "fr-mb-6w")}>
          <CallOut
            title="Vous etes un professionnel de sante ?"
            iconId="fr-icon-information-line"
            buttonProps={{
              priority: "primary",
              children: "Acceder a mon compte",
              onClick: () => navigate("/maquette"),
            }}
          >
            Connectez-vous pour suivre votre progression sur ce referentiel, declarer vos actions et generer votre attestation de certification.
          </CallOut>
        </div>
      </div>
    </div>
  );
}
