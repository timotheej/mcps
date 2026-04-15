import { fr } from "@codegouvfr/react-dsfr";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { CallOut } from "@codegouvfr/react-dsfr/CallOut";

export function Accueil() {
  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--gutters")}>
        <div className={fr.cx("fr-col-12")}>
          <h1>mcps</h1>
          <p className={fr.cx("fr-text--lead")}>
            Projet pret. Ouvrez Claude Code et commencez a creer vos ecrans.
          </p>

          <CallOut
            iconId="ri-information-line"
            title="Comment demarrer"
            className={fr.cx("fr-mt-4w")}
          >
            Lancez <code>claude</code> dans ce dossier, puis decrivez votre
            projet. Claude remplira le contexte et commencera a builder vos
            ecrans.
          </CallOut>

          <Alert
            severity="info"
            title="Stack technique"
            description="Ce projet utilise React + TypeScript + @codegouvfr/react-dsfr."
            className={fr.cx("fr-mt-4w")}
            small
          />
        </div>
      </div>
    </div>
  );
}
