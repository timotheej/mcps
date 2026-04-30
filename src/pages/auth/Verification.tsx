import { useNavigate } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Stepper } from "@codegouvfr/react-dsfr/Stepper";
import { Accordion } from "@codegouvfr/react-dsfr/Accordion";
import { Alert } from "@codegouvfr/react-dsfr/Alert";
import { profileMock, referentiel } from "../../data/maquette";

export function Verification() {
  const navigate = useNavigate();
  const cycleYears = profileMock.cycleDureeAns;

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

        <p className={fr.cx("fr-text--lead", "fr-mb-1v")}>
          Bonjour <strong>{profileMock.prenom} {profileMock.nom}</strong>,
        </p>
        <p className={`${fr.cx("fr-text--sm", "fr-mb-4w")} fr-text-mention--grey`}>
          Infirmier diplômé d'État · {profileMock.specialite}
        </p>

        {/* ─── Hero référentiel ───────────────────────────── */}
        <div className="maq-ref-hero">
          <span className="maq-ref-hero__eyebrow">Votre référentiel de certification</span>
          <h2 className="maq-ref-hero__title">{referentiel.label}</h2>
          <p className="maq-ref-hero__author">
            Rédigé par le Conseil National Professionnel infirmier
          </p>

          <ul className="maq-ref-hero__stats">
            <li>
              <span className="maq-ref-hero__stat-value">{referentiel.axes.length}</span>
              <span className="maq-ref-hero__stat-label">axes à couvrir</span>
            </li>
            <li>
              <span className="maq-ref-hero__stat-value">{referentiel.min_total}</span>
              <span className="maq-ref-hero__stat-label">actions minimum</span>
            </li>
            <li>
              <span className="maq-ref-hero__stat-value">{cycleYears} ans</span>
              <span className="maq-ref-hero__stat-label">
                du {profileMock.debutCycle} au {profileMock.finCycle}
              </span>
            </li>
          </ul>
        </div>

        <Accordion
          label="Vérifier mes informations Pro Santé Connect"
          className={fr.cx("fr-mt-3w")}
        >
          <dl className="maq-profil-dl">
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
              <dt>Source</dt>
              <dd>Annuaire Santé (RPPS) via Pro Santé Connect</dd>
            </div>
          </dl>

          <Alert
            severity="info"
            small
            className={fr.cx("fr-mt-2w")}
            description={
              <>
                Une information est incorrecte&nbsp;? Ma Certif' Pro Santé ne
                peut pas la modifier — elle est gérée par votre ordre. Contactez{" "}
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
