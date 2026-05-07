import { fr } from "@codegouvfr/react-dsfr";
import { createModal } from "@codegouvfr/react-dsfr/Modal";
import { profileMock, getOrdreFromProfession } from "../data/maquette";
import "./SignalementInfosModal.css";

/**
 * Modale "Une de vos informations est incorrecte ?".
 * Réutilisable depuis l'écran d'activation et le footer global.
 *
 * Usage :
 *   - Inclure <SignalementInfosModal /> une fois dans le layout.
 *   - Ouvrir avec signalementInfosModal.open() ou via buttonProps.
 */
const modal = createModal({
  id: "signalement-infos",
  isOpenedByDefault: false,
});

export const signalementInfosModal = modal;

export function SignalementInfosModal() {
  const ordre = getOrdreFromProfession(profileMock.profession);

  return (
    <modal.Component title="Une de vos informations est incorrecte ?">
      <p className={fr.cx("fr-mb-2w")}>
        Vos informations personnelles (nom, RPPS, profession, spécialité,
        référentiel) proviennent du Répertoire Partagé des Professionnels de
        Santé (RPPS) et sont gérées par votre ordre. Ma Certif' Pro Santé ne
        peut pas les modifier.
      </p>

      <p className={fr.cx("fr-mb-2w")}>
        Pour faire corriger une information, contactez :
      </p>

      {ordre ? (
        <a
          className="signalement-modal__ordre"
          href={ordre.site}
          target="_blank"
          rel="noreferrer"
        >
          <span className="signalement-modal__ordre-body">
            <span className="signalement-modal__ordre-nom">{ordre.nom}</span>
            <span className="signalement-modal__ordre-url">
              {ordre.siteLabel}
            </span>
          </span>
        </a>
      ) : (
        <p className={fr.cx("fr-mb-2w")}>
          <strong>Contactez votre ordre professionnel</strong> en passant par
          son site officiel ou votre espace personnel.
        </p>
      )}

      <p className={`${fr.cx("fr-text--sm", "fr-mt-3w", "fr-mb-0")} fr-text-mention--grey`}>
        En attendant, vous pouvez continuer à utiliser Ma Certif' Pro Santé.
        Vos informations seront mises à jour automatiquement dès que votre
        ordre les aura corrigées.
      </p>
    </modal.Component>
  );
}
