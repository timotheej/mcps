import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Breadcrumb } from "@codegouvfr/react-dsfr/Breadcrumb";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { Checkbox } from "@codegouvfr/react-dsfr/Checkbox";
import {
  profileMock,
  referentiel,
  saveSelectedThemes,
} from "../../data/maquette";
import { openContactModal } from "../../components/ContactModal";

/**
 * Activation de l'espace — écran unique du MVP.
 * Fusionne les anciennes étapes Vérification + CGU + Thèmes.
 */
export function Verification() {
  const navigate = useNavigate();
  const [accepted, setAccepted] = useState(false);

  function handleConfirm() {
    if (!accepted) return;
    // Le choix des thèmes est repoussé hors de l'onboarding du MVP.
    // On initialise le sessionStorage avec une carte vide pour que
    // les helpers downstream (getNextStep, etc.) restent fonctionnels.
    const empty: Record<string, string[]> = {};
    referentiel.axes.forEach((a) => (empty[a.id] = []));
    saveSelectedThemes(empty);
    navigate("/maquette/tableau-de-bord");
  }

  return (
    <div className={fr.cx("fr-container", "fr-my-4w")}>
      <Breadcrumb
        currentPageLabel="Activation de votre espace"
        segments={[{ label: "Accueil", linkProps: { to: "/" } }]}
      />

      <h1 className={fr.cx("fr-mb-3w")}>Activation de votre espace</h1>
      <hr className="maq-activation__divider" aria-hidden="true" />

      <div className="maq-activation">
        <p className={fr.cx("fr-text--lead", "fr-mb-1v")}>Bonjour</p>
        <p className={fr.cx("fr-text--lead", "fr-mb-1w")}>
          <strong>
            {profileMock.prenom} {profileMock.nom},
          </strong>
        </p>
        <p
          className={`${fr.cx("fr-text--sm", "fr-mb-3w")} fr-text-mention--grey`}
        >
          Ces informations proviennent du RPPS via Pro Santé Connect.
        </p>

        <div className="maq-ref-hero">
          <span className="maq-ref-hero__eyebrow">
            Votre référentiel de certification
          </span>
          <h2 className="maq-ref-hero__title">{referentiel.label}</h2>
          <p className="maq-ref-hero__author">
            Rédigé par le Conseil National Professionnel infirmier
          </p>
        </div>

        <Accordion
          label="Vérifier mes informations"
          defaultExpanded
          className={fr.cx("fr-mt-3w")}
        >
          <dl className="maq-profil-dl">
            <div className="maq-profil-dl__row">
              <dt>Nom et prénom</dt>
              <dd>
                {profileMock.prenom} {profileMock.nom}
              </dd>
            </div>
            <div className="maq-profil-dl__row">
              <dt>Numéro RPPS</dt>
              <dd>{profileMock.rpps}</dd>
            </div>
            <div className="maq-profil-dl__row">
              <dt>Profession</dt>
              <dd>Infirmier diplômé d'État</dd>
            </div>
            <div className="maq-profil-dl__row">
              <dt>Spécialité ordinale</dt>
              <dd>{profileMock.specialite}</dd>
            </div>
            <div className="maq-profil-dl__row">
              <dt>Référentiel attribué</dt>
              <dd>{referentiel.label}</dd>
            </div>
            <div className="maq-profil-dl__row">
              <dt>Source</dt>
              <dd>Informations issues du RPPS</dd>
            </div>
          </dl>

          <Alert
            severity="info"
            small
            className={fr.cx("fr-mt-2w")}
            title="Ces informations sont incorrectes ?"
            description={
              <>
                Ces informations sont gérées par votre ordre professionnel. Ma
                Certif' Pro Santé ne peut pas les modifier. Pour toute
                correction, contactez{" "}
                <a
                  href="https://www.ordre-infirmiers.fr"
                  target="_blank"
                  rel="noreferrer"
                >
                  l'Ordre national des infirmiers
                </a>
                .
              </>
            }
          />
        </Accordion>

        <div className={fr.cx("fr-mt-4w")}>
          <Checkbox
            options={[
              {
                label: (
                  <span>
                    J'ai lu et j'accepte les <a href="/cgu" target="_blank" rel="noreferrer">conditions générales d'utilisation</a> de Ma Certif' Pro Santé
                  </span>
                ),
                nativeInputProps: {
                  checked: accepted,
                  onChange: (e) => setAccepted(e.target.checked),
                },
              },
            ]}
          />
        </div>

        <div className="maq-activation__actions">
          <Button
            priority="secondary"
            onClick={() => openContactModal("ordre", profileMock.profession)}
          >
            Une donnée incorrecte&nbsp;?
          </Button>
          <Button
            priority="primary"
            disabled={!accepted}
            onClick={handleConfirm}
          >
            Confirmer et continuer
          </Button>
        </div>
      </div>
    </div>
  );
}
