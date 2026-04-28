import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Badge } from "@codegouvfr/react-dsfr/Badge";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Alert } from "@codegouvfr/react-dsfr/Alert";

export function ReferentielIndisponible() {
  const navigate = useNavigate();

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <h1 className={fr.cx("fr-mb-5w")}>Activation de votre espace</h1>

      <div className="maq-activation-box">
        <Stepper
          currentStep={1}
          stepCount={3}
          title="Vérification"
          nextTitle="Conditions"
        />

        <h2 className={fr.cx("fr-h5", "fr-mb-3w")}>
          Votre référentiel n'est pas encore disponible
        </h2>

        <Alert
          severity="info"
          closable={false}
          title="Référentiel en cours d'élaboration"
          description="Votre référentiel de certification est actuellement en cours d'élaboration par votre Conseil national professionnel (CNP). Vous serez averti par email dès que votre espace de suivi sera accessible."
          className={fr.cx("fr-mb-3w")}
        />

        <h3 className={fr.cx("fr-h6", "fr-mb-2w")}>
          En attendant, voici ce que nous avons identifié
        </h3>
        <div className="maq-profil-card">
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">Profession</span>
            <span className="maq-profil-card__value">Pédicure-podologue</span>
          </div>
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">CNP référent</span>
            <span className="maq-profil-card__value">
              CNP des pédicures-podologues
            </span>
          </div>
          <div className="maq-profil-card__row">
            <span className="maq-profil-card__label">Statut</span>
            <span className="maq-profil-card__value maq-profil-card__value--rich">
              <Badge severity="new" small>
                Référentiel en cours de rédaction
              </Badge>
            </span>
          </div>
        </div>

        <Accordion
          label="Qu'est-ce qu'un Conseil national professionnel (CNP) ?"
          className={fr.cx("fr-mt-3w")}
        >
          <p className={fr.cx("fr-mb-0")}>
            Les Conseils nationaux professionnels regroupent les organisations
            représentatives d'une même profession ou spécialité de santé. Ils
            élaborent les référentiels de certification propres à leur domaine
            et valident les actions que vous déclarez.
          </p>
        </Accordion>

        <p className={fr.cx("fr-mt-3w", "fr-mb-0")}>
          <a
            className={fr.cx(
              "fr-link",
              "fr-link--icon-right",
              "fr-icon-external-link-line"
            )}
            href="https://esante.gouv.fr"
            target="_blank"
            rel="noreferrer"
          >
            Contact de votre CNP
          </a>
        </p>

        <div className="maq-activation-box__actions">
          <Button priority="tertiary" onClick={() => navigate("/")}>
            Revenir à l'accueil
          </Button>
        </div>
      </div>
    </div>
  );
}
