import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { profileMock } from "../../data/maquette";

export function Verification() {
  const navigate = useNavigate();

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1 className={fr.cx("fr-mb-2w")}>Activation de votre espace</h1>
      <p
        className={`${fr.cx("fr-text--lead", "fr-mb-5w")} fr-text-mention--grey`}
      >
        Vérifiez votre référentiel de certification, acceptez les conditions
        puis choisissez vos thèmes préférentiels.
      </p>

      <div className="maq-activation-box">
        <Stepper
          currentStep={1}
          stepCount={3}
          title="Vérification"
          nextTitle="Conditions"
        />

        <h2 className={fr.cx("fr-h5", "fr-mb-1w")}>
          Votre référentiel de certification
        </h2>
        <p
          className={`${fr.cx("fr-text--sm", "fr-mb-3w")} fr-text-mention--grey`}
        >
          Ces informations proviennent du RPPS via Pro Santé Connect.
        </p>

        <div className="maq-profil-card">
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">Nom et prénom</span>
            <span className="maq-profil-card__value">
              {profileMock.prenom} {profileMock.nom}
            </span>
          </div>
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">Numéro RPPS</span>
            <span className="maq-profil-card__value">{profileMock.rpps}</span>
          </div>
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">Profession</span>
            <span className="maq-profil-card__value">
              Infirmier diplômé d'État
            </span>
          </div>
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">Spécialité ordinale</span>
            <span className="maq-profil-card__value">
              {profileMock.specialite}
            </span>
          </div>
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">Référentiel attribué</span>
            <span className="maq-profil-card__value maq-profil-card__value--rich">
              Référentiel des infirmiers — IDE
              <Badge severity="info" small noIcon>
                Rédigé par le CNPI
              </Badge>
            </span>
          </div>
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">Cycle de certification</span>
            <span className="maq-profil-card__value">
              {profileMock.debutCycle} — {profileMock.finCycle}
              {" "}({profileMock.cycleDureeAns} ans)
            </span>
          </div>
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">Source</span>
            <span className="maq-profil-card__value">
              Informations issues du RPPS
            </span>
          </div>
        </div>

        <Accordion
          label="Ces informations sont incorrectes ?"
          className={fr.cx("fr-mt-3w")}
        >
          <Alert
            severity="info"
            small
            description={
              <>
                Ces informations sont gérées par votre ordre professionnel.
                Ma Certif' Pro Santé ne peut pas les modifier. Pour toute
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

        <div className="maq-activation-box__actions">
          <Button
            priority="primary"
            iconId="fr-icon-arrow-right-line"
            iconPosition="right"
            onClick={() => navigate("/auth/onboarding/cgu")}
          >
            Confirmer et continuer
          </Button>
        </div>
      </div>
    </div>
  );
}
