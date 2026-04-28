import { useNavigate, useSearchParams } from "react-router-dom";
import { fr } from "@codegouvfr/react-dsfr";
import { Button } from "@codegouvfr/react-dsfr/Button";
import { Alert } from "@codegouvfr/react-dsfr/Alert";

const PROFESSIONS_ELIGIBLES = [
  "Chirurgiens-dentistes",
  "Infirmiers",
  "Masseurs-kinésithérapeutes",
  "Médecins",
  "Pédicures-podologues",
  "Pharmaciens",
  "Sages-femmes",
];

export function NonEligible() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const professionDetectee = params.get("profession");

  return (
    <div className={fr.cx("fr-container", "fr-my-6w")}>
      <div className={fr.cx("fr-grid-row", "fr-grid-row--center")}>
        <div className={fr.cx("fr-col-12", "fr-col-md-10", "fr-col-lg-8")}>
          <h1 className={fr.cx("fr-h3", "fr-mb-3w")}>
            Vous n'êtes pas concerné par la certification périodique
          </h1>

          <Alert
            severity="info"
            closable={false}
            title="Professions concernées par la certification"
            description={
              <>
                <p className={fr.cx("fr-mb-1w")}>
                  Ma Certif' Pro Santé est réservé aux professionnels de
                  santé des 7 ordres soumis à l'obligation de certification
                  périodique :
                </p>
                <ul className={fr.cx("fr-mb-0")}>
                  {PROFESSIONS_ELIGIBLES.map((p) => (
                    <li key={p}>{p}</li>
                  ))}
                </ul>
              </>
            }
            className={fr.cx("fr-mb-4w")}
          />

          {professionDetectee && (
            <div className={`maq-profil-card ${fr.cx("fr-mb-4w")}`}>
              <div className="maq-profil-card__row">
                <span className="maq-profil-card__label">
                  Profession identifiée via Pro Santé Connect
                </span>
                <span className="maq-profil-card__value">
                  {professionDetectee}
                </span>
              </div>
            </div>
          )}

          <Button
            priority="tertiary"
            iconId="fr-icon-arrow-left-line"
            iconPosition="left"
            onClick={() => navigate("/")}
          >
            Revenir à l'accueil
          </Button>

          <p className={fr.cx("fr-mt-5w", "fr-mb-0")}>
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
              En savoir plus sur les professions concernées
            </a>
          </p>
        </div>
      </div>
    </div>
  );
}
